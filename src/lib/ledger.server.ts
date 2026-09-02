import { createHash, randomUUID } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import {
  DEFAULT_PERKS,
  DEFAULT_SPELLS,
  DEFAULT_SUBJECTS_BY_INSTITUTION,
  DEFAULT_TIERS,
  type CatalogPerk,
  type CatalogSpell,
} from "@/lib/catalog";
import {
  advancementReady,
  currentWeekMondayISO,
  isCollegeInstitution,
  isNecromancy,
  missingT2PerkSchools,
  normalizeFormId,
  parseStatus,
  todayISO,
  weekMondayISO,
  weekUsage,
  weeklyWarningFor,
  type GrantStatus,
  type InstitutionRecord,
  type LearnedSpell,
  type Lesson,
  type RosterPayload,
  type Student,
  type StudentStatus,
  type Tier,
} from "@/lib/ledger";

const SEED_PINS = {
  gm: "999999",
  grantor: "888888",
  winterhold: "100001",
  synod: "200002",
  thalmor: "300003",
  vigil: "400004",
  other: "500005",
} as const;

export type Session =
  | { role: "gm"; pin: string }
  | { role: "grantor"; pin: string }
  | { role: "teacher"; pin: string; institutionId: string; institutionName: string };

export type UnlockResult =
  | { ok: true; role: "gm" }
  | { ok: true; role: "grantor" }
  | { ok: true; role: "teacher"; institutionId: string; institutionName: string }
  | { ok: false; error: string };

export type MutResult = { ok: true } | { ok: false; error: string };

type InstRow = {
  id: string;
  name: string;
  pin_hash: string;
  weekly_spell_limit: number;
  per_school_limit: number;
  is_antagonist: boolean;
  advancement_min: number;
};

type StudentRow = {
  id: string;
  institution_id: string;
  name: string;
  form_id: string;
  status: string;
  is_antagonist: boolean;
  notes: string;
  last_lesson_date: string | null;
  last_institution_id: string | null;
  last_subject: string;
  specialization_school: string;
  created_at: string | Date;
};

type AccessRow = {
  student_id: string;
  institution_id: string;
  display_name: string;
  enrolled_at: string | Date;
};
type LessonRow = {
  id: string;
  student_id: string;
  date: string;
  institution_id: string;
  subject: string;
  teacher_name: string;
  notes: string;
};
type SpellRow = {
  id: string;
  student_id: string;
  lesson_id: string | null;
  catalog_id: string;
  name: string;
  school: string;
  tier: number;
  form_id: string;
  institution_id: string;
  status: string;
  taught_date: string;
  granted_date: string | null;
};
type TierRow = { student_id: string; institution_id: string; school: string; level: number };
type ProgressRow = {
  student_id: string;
  institution_id: string;
  school: string;
  learnable_tier: number;
};
type PerkRow = {
  id: string;
  student_id: string;
  catalog_id: string;
  school: string;
  rank: string;
  form_id: string;
  granted_date: string;
};
type CatalogSpellRow = {
  id: string;
  name: string;
  school: string;
  tier: number;
  form_id: string;
  hidden: boolean;
};
type CatalogPerkRow = {
  id: string;
  school: string;
  rank: string;
  form_id: string;
  unlock: string;
  prohibited: boolean;
};

function hashPin(pin: string): string {
  return createHash("sha256").update(pin, "utf8").digest("hex");
}

function asBool(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

function asIsoDay(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  return todayISO();
}

function asIsoStamp(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value) return value;
  return new Date().toISOString();
}

function grantStatus(status: string, taughtDate: string): GrantStatus {
  if (status === "granted") return "granted";
  if (weekMondayISO(taughtDate) < currentWeekMondayISO()) return "overdue";
  return status === "overdue" ? "overdue" : "pending";
}

let seedChain: Promise<void> | null = null;

async function ensureSeeded(sql: Sql): Promise<void> {
  seedChain ??= (async () => {
    await seedSettings(sql);
    await seedInstitutions(sql);
    await seedCatalog(sql);
    await seedDemo(sql);
    await backfillPlayerIds(sql);
  })().catch((err) => {
    seedChain = null;
    throw err;
  });
  await seedChain;
}

async function seedSettings(sql: Sql) {
  await sql`insert into settings (key, value) values ('gm_pin_hash', ${hashPin(SEED_PINS.gm)}) on conflict (key) do nothing`;
  await sql`insert into settings (key, value) values ('grantor_pin_hash', ${hashPin(SEED_PINS.grantor)}) on conflict (key) do nothing`;
}

async function seedInstitutions(sql: Sql) {
  const existing = await sql<{ n: number }>`select count(*)::int as n from institutions`;
  if ((existing[0]?.n ?? 0) > 0) return;

  const rows: { id: string; name: string; pin: string; weekly: number; perSchool: number; antagonist: boolean; min: number }[] = [
    { id: "inst-winterhold", name: "College of Winterhold", pin: SEED_PINS.winterhold, weekly: 2, perSchool: 1, antagonist: false, min: 1 },
    { id: "inst-synod", name: "Synod", pin: SEED_PINS.synod, weekly: 1, perSchool: 0, antagonist: false, min: 1 },
    { id: "inst-thalmor", name: "Thalmor", pin: SEED_PINS.thalmor, weekly: 1, perSchool: 0, antagonist: true, min: 1 },
    { id: "inst-vigil", name: "Vigil", pin: SEED_PINS.vigil, weekly: 1, perSchool: 0, antagonist: false, min: 2 },
    { id: "inst-other", name: "Other", pin: SEED_PINS.other, weekly: 1, perSchool: 0, antagonist: false, min: 1 },
  ];
  for (const row of rows) {
    await sql`insert into institutions (id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min)
      values (${row.id}, ${row.name}, ${hashPin(row.pin)}, ${row.weekly}, ${row.perSchool}, ${row.antagonist}, ${row.min})
      on conflict (id) do nothing`;
    const subjects = DEFAULT_SUBJECTS_BY_INSTITUTION[row.name] ?? [];
    for (const school of subjects) {
      await sql`insert into institution_subjects (institution_id, school) values (${row.id}, ${school}) on conflict do nothing`;
    }
  }
}

async function seedCatalog(sql: Sql) {
  const existing = await sql<{ n: number }>`select count(*)::int as n from catalog_spells`;
  if ((existing[0]?.n ?? 0) === 0) {
    for (const spell of DEFAULT_SPELLS) {
      await sql`insert into catalog_spells (id, name, school, tier, form_id, hidden)
        values (${spell.id}, ${spell.name}, ${spell.school}, ${spell.tier}, ${spell.formId}, ${spell.hidden})
        on conflict (id) do nothing`;
    }
  }
  const perks = await sql<{ n: number }>`select count(*)::int as n from catalog_perks`;
  if ((perks[0]?.n ?? 0) === 0) {
    for (const perk of DEFAULT_PERKS) {
      await sql`insert into catalog_perks (id, school, rank, form_id, unlock, prohibited)
        values (${perk.id}, ${perk.school}, ${perk.rank}, ${perk.formId}, ${perk.unlock}, ${perk.prohibited})
        on conflict (id) do nothing`;
    }
  }
  const tiers = await sql<{ n: number }>`select count(*)::int as n from catalog_tiers`;
  if ((tiers[0]?.n ?? 0) === 0) {
    for (const level of DEFAULT_TIERS) {
      await sql`insert into catalog_tiers (level) values (${level}) on conflict do nothing`;
    }
  }
}

async function seedDemo(sql: Sql) {
  const existing = await sql<{ n: number }>`select count(*)::int as n from students`;
  if ((existing[0]?.n ?? 0) > 0) return;

  const winterhold = "inst-winterhold";
  const synod = "inst-synod";
  const thalmor = "inst-thalmor";
  const vigil = "inst-vigil";

  async function addStudent(row: {
    id: string;
    home: string;
    name: string;
    formId: string;
    status?: string;
    notes?: string;
    lastDate?: string | null;
    lastInst?: string | null;
    lastSubject?: string;
    spec?: string;
    created?: string;
    access: string[];
  }) {
    await sql`insert into students (id, institution_id, name, form_id, status, notes, last_lesson_date, last_institution_id, last_subject, specialization_school, created_at)
      values (${row.id}, ${row.home}, ${row.name}, ${row.formId}, ${row.status ?? "active"}, ${row.notes ?? ""}, ${row.lastDate ?? null}, ${row.lastInst ?? null}, ${row.lastSubject ?? ""}, ${row.spec ?? ""}, ${row.created ?? "2026-08-01T12:00:00Z"})`;
    for (const inst of row.access) {
      await sql`insert into student_access (student_id, institution_id, display_name, enrolled_at) values (${row.id}, ${inst}, ${row.name}, ${row.created ?? "2026-08-01T12:00:00Z"}) on conflict do nothing`;
    }
  }

  async function addTier(studentId: string, inst: string, school: string, level: number, learnable = level) {
    await sql`insert into student_tiers (student_id, institution_id, school, level) values (${studentId}, ${inst}, ${school}, ${level}) on conflict do nothing`;
    await sql`insert into student_progress (student_id, institution_id, school, learnable_tier) values (${studentId}, ${inst}, ${school}, ${learnable}) on conflict do nothing`;
  }

  async function addSpell(row: {
    id: string;
    studentId: string;
    lessonId: string;
    catalogId: string;
    name: string;
    school: string;
    tier: number;
    formId: string;
    inst: string;
    status: string;
    taught: string;
    granted?: string | null;
  }) {
    await sql`insert into learned_spells (id, student_id, lesson_id, catalog_id, name, school, tier, form_id, institution_id, status, taught_date, granted_date)
      values (${row.id}, ${row.studentId}, ${row.lessonId}, ${row.catalogId}, ${row.name}, ${row.school}, ${row.tier}, ${row.formId}, ${row.inst}, ${row.status}, ${row.taught}, ${row.granted ?? null})`;
  }

  async function addLesson(id: string, studentId: string, date: string, inst: string, subject: string, teacher: string) {
    await sql`insert into lessons (id, student_id, date, institution_id, subject, teacher_name, notes)
      values (${id}, ${studentId}, ${date}, ${inst}, ${subject}, ${teacher}, ${""})`;
  }

  await addStudent({
    id: "stu-selvas",
    home: winterhold,
    name: "Selvas Uroth",
    formId: "0x01000A01",
    lastDate: "2026-08-29",
    lastInst: winterhold,
    lastSubject: "Pyromancy",
    spec: "Pyromancy",
    created: "2026-07-12T14:00:00Z",
    access: [winterhold],
  });
  await addLesson("les-selvas-1", "stu-selvas", "2026-07-20", winterhold, "Pyromancy", "Faralda");
  await addLesson("les-selvas-2", "stu-selvas", "2026-08-04", winterhold, "Restoration", "Colette");
  await addLesson("les-selvas-3", "stu-selvas", "2026-08-29", winterhold, "Pyromancy", "Faralda");
  await addSpell({
    id: "sp-selvas-firebolt",
    studentId: "stu-selvas",
    lessonId: "les-selvas-1",
    catalogId: "pyromancy-firebolt",
    name: "Firebolt",
    school: "Pyromancy",
    tier: 1,
    formId: "0x12FD0",
    inst: winterhold,
    status: "granted",
    taught: "2026-07-20",
    granted: "2026-07-21",
  });
  await addSpell({
    id: "sp-selvas-ward",
    studentId: "stu-selvas",
    lessonId: "les-selvas-2",
    catalogId: "restoration-lesser-ward",
    name: "Lesser Ward",
    school: "Restoration",
    tier: 1,
    formId: "0x13018",
    inst: winterhold,
    status: "granted",
    taught: "2026-08-04",
    granted: "2026-08-05",
  });
  await addSpell({
    id: "sp-selvas-heal",
    studentId: "stu-selvas",
    lessonId: "les-selvas-2",
    catalogId: "restoration-fast-healing",
    name: "Fast Healing",
    school: "Restoration",
    tier: 1,
    formId: "0x2F3B8",
    inst: winterhold,
    status: "granted",
    taught: "2026-08-04",
    granted: "2026-08-05",
  });
  await addSpell({
    id: "sp-selvas-cloak",
    studentId: "stu-selvas",
    lessonId: "les-selvas-3",
    catalogId: "pyromancy-flame-cloak",
    name: "Flame Cloak",
    school: "Pyromancy",
    tier: 2,
    formId: "0x3AE9F",
    inst: winterhold,
    status: "granted",
    taught: "2026-08-18",
    granted: "2026-08-19",
  });
  await addSpell({
    id: "sp-selvas-ignite",
    studentId: "stu-selvas",
    lessonId: "les-selvas-3",
    catalogId: "pyromancy-ignite",
    name: "Ignite",
    school: "Pyromancy",
    tier: 2,
    formId: "0x402732B",
    inst: winterhold,
    status: "pending",
    taught: "2026-08-29",
  });
  await addTier("stu-selvas", winterhold, "Pyromancy", 3, 3);
  await addTier("stu-selvas", winterhold, "Restoration", 2, 2);
  await sql`insert into granted_perks (id, student_id, catalog_id, school, rank, form_id, granted_date)
    values (${"pk-selvas-adept"}, ${"stu-selvas"}, ${"destruction-adept"}, ${"Destruction"}, ${"Adept"}, ${"0xC44C0"}, ${"2026-08-20"})`;

  await addStudent({
    id: "stu-mira",
    home: synod,
    name: "Mira Venn",
    formId: "0x01000A02",
    lastDate: "2026-09-01",
    lastInst: synod,
    lastSubject: "Restoration",
    spec: "Restoration",
    created: "2026-08-22T10:00:00Z",
    access: [synod],
  });
  await addLesson("les-mira-1", "stu-mira", "2026-09-01", synod, "Restoration", "Aleris");
  await addSpell({
    id: "sp-mira-ward",
    studentId: "stu-mira",
    lessonId: "les-mira-1",
    catalogId: "restoration-lesser-ward",
    name: "Lesser Ward",
    school: "Restoration",
    tier: 1,
    formId: "0x13018",
    inst: synod,
    status: "pending",
    taught: "2026-09-01",
  });
  await addTier("stu-mira", synod, "Restoration", 1, 1);

  await addStudent({
    id: "stu-ilen",
    home: winterhold,
    name: "Ilen Parke",
    formId: "0x01000A03",
    lastDate: "2026-09-01",
    lastInst: synod,
    lastSubject: "Restoration",
    spec: "Alteration",
    created: "2026-08-10T09:00:00Z",
    access: [winterhold, synod],
  });
  await addLesson("les-ilen-wh", "stu-ilen", "2026-08-16", winterhold, "Alteration", "Tolfdir");
  await addLesson("les-ilen-syn", "stu-ilen", "2026-09-01", synod, "Restoration", "Aleris");
  await addSpell({
    id: "sp-ilen-oak",
    studentId: "stu-ilen",
    lessonId: "les-ilen-wh",
    catalogId: "alteration-oakflesh",
    name: "Oakflesh",
    school: "Alteration",
    tier: 1,
    formId: "0x5AD5C",
    inst: winterhold,
    status: "granted",
    taught: "2026-08-16",
    granted: "2026-08-17",
  });
  await addSpell({
    id: "sp-ilen-heal",
    studentId: "stu-ilen",
    lessonId: "les-ilen-syn",
    catalogId: "restoration-fast-healing",
    name: "Fast Healing",
    school: "Restoration",
    tier: 1,
    formId: "0x2F3B8",
    inst: synod,
    status: "granted",
    taught: "2026-09-01",
    granted: "2026-09-01",
  });
  await addTier("stu-ilen", winterhold, "Alteration", 1, 1);
  await addTier("stu-ilen", synod, "Restoration", 1, 1);

  await addStudent({
    id: "stu-ryn",
    home: thalmor,
    name: "Ryn Thalor",
    formId: "0x01000A04",
    lastDate: "2026-09-01",
    lastInst: thalmor,
    lastSubject: "Necromancy",
    spec: "Necromancy",
    created: "2026-08-28T11:00:00Z",
    access: [thalmor],
  });
  await addLesson("les-ryn-1", "stu-ryn", "2026-09-01", thalmor, "Necromancy", "Ancano");
  await addSpell({
    id: "sp-ryn-zombie",
    studentId: "stu-ryn",
    lessonId: "les-ryn-1",
    catalogId: "necromancy-raise-zombie",
    name: "Raise Zombie",
    school: "Necromancy",
    tier: 1,
    formId: "0x7E8E1",
    inst: thalmor,
    status: "pending",
    taught: "2026-09-01",
  });
  await addTier("stu-ryn", thalmor, "Necromancy", 1, 1);

  await addStudent({
    id: "stu-kael",
    home: winterhold,
    name: "Kael Thorne",
    formId: "0x01000A05",
    lastDate: "2026-08-25",
    lastInst: winterhold,
    lastSubject: "Pyromancy",
    spec: "Pyromancy",
    created: "2026-06-02T12:00:00Z",
    access: [winterhold],
  });
  await addLesson("les-kael-1", "stu-kael", "2026-07-08", winterhold, "Pyromancy", "Faralda");
  await addLesson("les-kael-2", "stu-kael", "2026-08-25", winterhold, "Pyromancy", "Faralda");
  await addSpell({
    id: "sp-kael-firebolt",
    studentId: "stu-kael",
    lessonId: "les-kael-1",
    catalogId: "pyromancy-firebolt",
    name: "Firebolt",
    school: "Pyromancy",
    tier: 1,
    formId: "0x12FD0",
    inst: winterhold,
    status: "granted",
    taught: "2026-07-08",
    granted: "2026-07-09",
  });
  await addSpell({
    id: "sp-kael-cloak",
    studentId: "stu-kael",
    lessonId: "les-kael-2",
    catalogId: "pyromancy-flame-cloak",
    name: "Flame Cloak",
    school: "Pyromancy",
    tier: 2,
    formId: "0x3AE9F",
    inst: winterhold,
    status: "granted",
    taught: "2026-08-25",
    granted: "2026-08-26",
  });
  await addTier("stu-kael", winterhold, "Pyromancy", 2, 2);

  await addStudent({
    id: "stu-sera",
    home: vigil,
    name: "Sera Holdyn",
    formId: "0x01000A06",
    lastDate: "2026-08-27",
    lastInst: vigil,
    lastSubject: "Vigil",
    spec: "Vigil",
    created: "2026-08-05T16:00:00Z",
    access: [vigil],
  });
  await addLesson("les-sera-1", "stu-sera", "2026-08-12", vigil, "Vigil", "Keeper Carcette");
  await addLesson("les-sera-2", "stu-sera", "2026-08-27", vigil, "Vigil", "Keeper Carcette");
  await addSpell({
    id: "sp-sera-ward",
    studentId: "stu-sera",
    lessonId: "les-sera-1",
    catalogId: "vigil-lesser-ward",
    name: "Lesser Ward",
    school: "Vigil",
    tier: 1,
    formId: "0x13018",
    inst: vigil,
    status: "granted",
    taught: "2026-08-12",
    granted: "2026-08-13",
  });
  await addSpell({
    id: "sp-sera-heal",
    studentId: "stu-sera",
    lessonId: "les-sera-2",
    catalogId: "vigil-fast-healing",
    name: "Fast Healing",
    school: "Vigil",
    tier: 1,
    formId: "0x2F3B8",
    inst: vigil,
    status: "overdue",
    taught: "2026-08-27",
  });
  await addTier("stu-sera", vigil, "Vigil", 1, 1);
}

async function backfillPlayerIds(sql: Sql) {
  const known: Record<string, string> = {
    "stu-selvas": "0x01000A01",
    "stu-mira": "0x01000A02",
    "stu-ilen": "0x01000A03",
    "stu-ryn": "0x01000A04",
    "stu-kael": "0x01000A05",
    "stu-sera": "0x01000A06",
  };
  const rows = await sql<{ id: string; name: string; form_id: string }>`select id, name, form_id from students`;
  for (const row of rows) {
    if (!row.form_id) {
      const next = known[row.id] ?? `0x${row.id.replace(/[^a-f0-9]/gi, "").slice(0, 8).padEnd(8, "0")}`;
      await sql`update students set form_id = ${next} where id = ${row.id} and form_id = ${""}`;
    }
  }
  await sql`update student_access as a set display_name = s.name from students s where a.student_id = s.id and a.display_name = ${""}`;
}

export async function resolveSession(pin: string): Promise<Session | null> {
  if (!/^\d{6}$/.test(pin)) return null;
  const sql = await getSql();
  await ensureSeeded(sql);
  const hash = hashPin(pin);
  const settings = await sql<{ key: string; value: string }>`select key, value from settings where key in ('gm_pin_hash', 'grantor_pin_hash')`;
  const gm = settings.find((s) => s.key === "gm_pin_hash")?.value;
  const grantor = settings.find((s) => s.key === "grantor_pin_hash")?.value;
  if (gm && hash === gm) return { role: "gm", pin };
  if (grantor && hash === grantor) return { role: "grantor", pin };
  const inst = (
    await sql<InstRow>`select id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min from institutions where pin_hash = ${hash} limit 1`
  )[0];
  if (!inst) return null;
  return { role: "teacher", pin, institutionId: inst.id, institutionName: inst.name };
}

export async function unlock(pin: string): Promise<UnlockResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (session.role === "teacher") {
    return {
      ok: true,
      role: "teacher",
      institutionId: session.institutionId,
      institutionName: session.institutionName,
    };
  }
  return { ok: true, role: session.role };
}

async function loadInstitutions(sql: Sql): Promise<InstitutionRecord[]> {
  const instRows = await sql<InstRow>`select id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min from institutions order by name`;
  const subjectRows = await sql<{ institution_id: string; school: string }>`select institution_id, school from institution_subjects`;
  const byInst = new Map<string, string[]>();
  for (const row of subjectRows) {
    const list = byInst.get(row.institution_id) ?? [];
    list.push(row.school);
    byInst.set(row.institution_id, list);
  }
  return instRows.map((row) => ({
    id: row.id,
    name: row.name,
    weeklySpellLimit: Number(row.weekly_spell_limit),
    perSchoolLimit: Number(row.per_school_limit),
    isAntagonist: asBool(row.is_antagonist),
    subjects: (byInst.get(row.id) ?? []).sort((a, b) => a.localeCompare(b)),
    advancementMin: Number(row.advancement_min),
  }));
}

function visibleSchools(inst: InstitutionRecord | null, role: Session["role"]): Set<string> | null {
  if (role === "gm" || role === "grantor") return null;
  if (!inst) return new Set();
  const set = new Set(inst.subjects);
  if (!inst.isAntagonist) {
    for (const school of [...set]) {
      if (isNecromancy(school)) set.delete(school);
    }
  }
  return set;
}

export async function loadRoster(pin: string): Promise<{ ok: true; roster: RosterPayload } | { ok: false; error: string }> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  const sql = await getSql();
  const institutions = await loadInstitutions(sql);
  const instById = new Map(institutions.map((i) => [i.id, i]));
  const actorInst = session.role === "teacher" ? (instById.get(session.institutionId) ?? null) : null;
  const schools = visibleSchools(actorInst, session.role);
  const isGm = session.role === "gm";
  const isCollege = actorInst ? isCollegeInstitution(actorInst.name) : false;

  const [studentRows, accessRows, lessonRows, spellRows, tierRows, progressRows, perkRows, catalogSpellRows, catalogPerkRows, tierLevels] =
    await Promise.all([
      sql<StudentRow>`select id, institution_id, name, form_id, status, is_antagonist, notes, last_lesson_date, last_institution_id, last_subject, specialization_school, created_at from students order by name`,
      sql<AccessRow>`select student_id, institution_id, display_name, enrolled_at from student_access`,
      sql<LessonRow>`select id, student_id, date, institution_id, subject, teacher_name, notes from lessons order by date desc`,
      sql<SpellRow>`select id, student_id, lesson_id, catalog_id, name, school, tier, form_id, institution_id, status, taught_date, granted_date from learned_spells order by taught_date desc`,
      sql<TierRow>`select student_id, institution_id, school, level from student_tiers`,
      sql<ProgressRow>`select student_id, institution_id, school, learnable_tier from student_progress`,
      sql<PerkRow>`select id, student_id, catalog_id, school, rank, form_id, granted_date from granted_perks`,
      sql<CatalogSpellRow>`select id, name, school, tier, form_id, hidden from catalog_spells order by school, tier, name`,
      sql<CatalogPerkRow>`select id, school, rank, form_id, unlock, prohibited from catalog_perks order by school, rank`,
      sql<{ level: number }>`select level from catalog_tiers order by level`,
    ]);

  const accessByStudent = new Map<string, string[]>();
  const localName = new Map<string, string>();
  const enrolledAt = new Map<string, string>();
  for (const row of accessRows) {
    const list = accessByStudent.get(row.student_id) ?? [];
    list.push(row.institution_id);
    accessByStudent.set(row.student_id, list);
    localName.set(`${row.student_id}:${row.institution_id}`, row.display_name);
    enrolledAt.set(`${row.student_id}:${row.institution_id}`, asIsoStamp(row.enrolled_at));
  }

  const catalogSpells: CatalogSpell[] = catalogSpellRows
    .filter((row) => {
      if (asBool(row.hidden) && !isGm) return false;
      if (schools && !schools.has(row.school)) return false;
      return true;
    })
    .map((row) => ({
      id: row.id,
      name: row.name,
      school: row.school,
      tier: Number(row.tier),
      formId: row.form_id,
      hidden: asBool(row.hidden),
    }));

  const catalogPerks: CatalogPerk[] = catalogPerkRows.map((row) => ({
    id: row.id,
    school: row.school,
    rank: row.rank,
    formId: row.form_id,
    unlock: row.unlock,
    prohibited: asBool(row.prohibited),
  }));

  const students: Student[] = [];
  for (const row of studentRows) {
    const visibleIds = accessByStudent.get(row.id) ?? [];
    if (session.role === "teacher") {
      if (!visibleIds.includes(session.institutionId)) continue;
    }

    const home = instById.get(row.institution_id);
    const spellsAll = spellRows.filter((s) => s.student_id === row.id);
    const lessonsAll = lessonRows.filter((l) => l.student_id === row.id);
    const tiersAll = tierRows.filter((t) => t.student_id === row.id);
    const progressAll = progressRows.filter((p) => p.student_id === row.id);
    const perksAll = perkRows.filter((p) => p.student_id === row.id);

    const spellVisible = (s: SpellRow) => {
      const taughtAt = instById.get(s.institution_id);
      const antagonist = asBool(taughtAt?.isAntagonist);
      if (isGm || session.role === "grantor") return true;
      if (schools && isNecromancy(s.school) && !actorInst?.isAntagonist) return false;
      if (s.institution_id === actorInst?.id) return true;
      if (isCollege && taughtAt && !antagonist) return true;
      return false;
    };

    const lessonVisible = (l: LessonRow) => {
      if (isGm) return true;
      return l.institution_id === actorInst?.id;
    };

    const tierScope = (t: TierRow) => {
      if (isGm) return true;
      return t.institution_id === actorInst?.id;
    };

    const spells: LearnedSpell[] = spellsAll.filter(spellVisible).map((s) => {
      const taughtAt = instById.get(s.institution_id);
      const status = grantStatus(s.status, asIsoDay(s.taught_date));
      return {
        id: s.id,
        catalogId: s.catalog_id,
        name: s.name,
        school: s.school,
        tier: Number(s.tier),
        formId: s.form_id,
        institution: taughtAt?.name ?? "",
        antagonist: asBool(taughtAt?.isAntagonist),
        status,
        taughtDate: asIsoDay(s.taught_date),
        grantedDate: s.granted_date ? asIsoDay(s.granted_date) : null,
        lessonId: s.lesson_id ?? "",
      };
    });

    const lessons: Lesson[] = lessonsAll.filter(lessonVisible).map((l) => {
      const taughtAt = instById.get(l.institution_id);
      const related = spells.filter((s) => s.lessonId === l.id);
      return {
        id: l.id,
        date: asIsoDay(l.date),
        institution: taughtAt?.name ?? "",
        subject: l.subject,
        teacherName: l.teacher_name,
        notes: l.notes,
        spellNames: related.map((s) => s.name),
        tiersUnlocked: [],
      };
    });

    const tiers: Tier[] = tiersAll.filter(tierScope).map((t) => ({
      school: t.school,
      level: Number(t.level),
      institutionId: t.institution_id,
    }));

    const learnableTiers: Tier[] = progressAll
      .filter((p) => isGm || p.institution_id === actorInst?.id)
      .map((p) => ({
        school: p.school,
        level: Number(p.learnable_tier),
        institutionId: p.institution_id,
      }));

    const perks = (isGm ? perksAll : []).map((p) => ({
      id: p.id,
      catalogId: p.catalog_id,
      school: p.school,
      rank: p.rank,
      formId: p.form_id,
      grantedDate: asIsoDay(p.granted_date),
    }));

    let lastLessonDate: string | null = null;
    let lastInstitution = "";
    let lastSubject = "";
    if (isGm) {
      lastLessonDate = row.last_lesson_date ? asIsoDay(row.last_lesson_date) : null;
      lastInstitution = instById.get(row.last_institution_id ?? "")?.name ?? home?.name ?? "";
      lastSubject = row.last_subject ?? "";
    } else if (actorInst) {
      const mine = lessonsAll.filter((l) => l.institution_id === actorInst.id);
      const latest = mine[0];
      if (latest) {
        lastLessonDate = asIsoDay(latest.date);
        lastInstitution = actorInst.name;
        lastSubject = latest.subject;
      }
    }

    const usageAll = weekUsage(
      spellsAll.map((s) => ({
        taughtDate: asIsoDay(s.taught_date),
        institution: instById.get(s.institution_id)?.name ?? "",
        school: s.school,
        antagonist: asBool(instById.get(s.institution_id)?.isAntagonist),
      })),
      true,
    );
    const usageLocal = weekUsage(
      spellsAll.map((s) => ({
        taughtDate: asIsoDay(s.taught_date),
        institution: instById.get(s.institution_id)?.name ?? "",
        school: s.school,
        antagonist: asBool(instById.get(s.institution_id)?.isAntagonist),
      })),
      false,
    );

    const need = actorInst?.advancementMin ?? 1;
    const local = actorInst ? localName.get(`${row.id}:${actorInst.id}`) : "";
    const student: Student = {
      id: row.id,
      formId: row.form_id ?? "",
      institutionId: row.institution_id,
      name: local || row.name,
      status: parseStatus(row.status),
      lastLessonDate,
      lastInstitution,
      lastSubject,
      notes: isGm || session.role === "teacher" ? row.notes : "",
      tiers,
      spells,
      perks,
      lessons,
      createdAt: asIsoStamp(row.created_at),
      enrolledAt: actorInst ? enrolledAt.get(`${row.id}:${actorInst.id}`) : asIsoStamp(row.created_at),
      isAntagonist: isGm ? asBool(row.is_antagonist) : undefined,
      institutionAntagonist: isGm ? asBool(home?.isAntagonist) : undefined,
      visibleInstitutionIds: isGm ? visibleIds : undefined,
      weeklyWarning: isGm
        ? weeklyWarningFor(
            spellsAll.map((s) => ({
              taughtDate: asIsoDay(s.taught_date),
              institution: instById.get(s.institution_id)?.name ?? "",
              school: s.school,
              antagonist: asBool(instById.get(s.institution_id)?.isAntagonist),
            })),
            true,
          )
        : null,
      weekUsage: isGm ? usageAll : usageLocal,
      missingT2Perks: isGm
        ? missingT2PerkSchools({
            tiers: tiersAll.map((t) => ({ school: t.school, level: Number(t.level) })),
            perks,
          })
        : [],
      advancement: advancementReady(
        spells.map((s) => ({ school: s.school, tier: s.tier })),
        need,
        tiers,
      ),
      learnableTiers,
      specializationSchool: row.specialization_school,
    };
    students.push(student);
  }

  return {
    ok: true,
    roster: {
      role: session.role,
      institutionId: session.role === "teacher" ? session.institutionId : null,
      institutionName: session.role === "teacher" ? session.institutionName : isGm ? "GM" : "Grantor",
      students,
      institutions: isGm
        ? institutions
        : session.role === "grantor"
          ? institutions.map((i) => ({ ...i, isAntagonist: false }))
          : institutions.filter((i) => i.id === session.institutionId),
      catalogSpells,
      catalogPerks: isGm || session.role === "grantor" ? catalogPerks : [],
      tiers: (tierLevels.length ? tierLevels.map((t) => Number(t.level)) : [...DEFAULT_TIERS]).sort((a, b) => a - b),
    },
  };
}

function teacherOrGm(session: Session): boolean {
  return session.role === "gm" || session.role === "teacher";
}

function actingInstitutionId(session: Session, requested?: string | null): string | null {
  if (session.role === "teacher") return session.institutionId;
  if (session.role === "gm") return requested || null;
  return null;
}

export async function enrollStudent(
  pin: string,
  name: string,
  formId: string,
  institutionId?: string,
): Promise<MutResult & { studentId?: string }> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (!teacherOrGm(session)) return { ok: false, error: "Not allowed" };
  const trimmed = name.trim().replace(/\s+/g, " ");
  const form = normalizeFormId(formId);
  if (!form) return { ok: false, error: "refID required" };
  if (!trimmed) return { ok: false, error: "Name required" };
  const instId = actingInstitutionId(session, institutionId);
  if (!instId) return { ok: false, error: "Institution required" };
  const sql = await getSql();
  const existing = (
    await sql<{ id: string }>`select id from students where lower(form_id) = ${form.toLowerCase()} limit 1`
  )[0];
  if (existing) {
    await sql`insert into student_access (student_id, institution_id, display_name, enrolled_at)
      values (${existing.id}, ${instId}, ${trimmed}, ${new Date().toISOString()})
      on conflict (student_id, institution_id) do update set display_name = ${trimmed}`;
    return { ok: true, studentId: existing.id };
  }
  const id = randomUUID();
  await sql`insert into students (id, institution_id, name, form_id, status) values (${id}, ${instId}, ${trimmed}, ${form}, ${"active"})`;
  await sql`insert into student_access (student_id, institution_id, display_name, enrolled_at)
    values (${id}, ${instId}, ${trimmed}, ${new Date().toISOString()})`;
  return { ok: true, studentId: id };
}

export async function updateStudent(
  pin: string,
  input: {
    studentId: string;
    status?: StudentStatus;
    notes?: string;
    specializationSchool?: string;
    name?: string;
  },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (!teacherOrGm(session)) return { ok: false, error: "Not allowed" };
  const sql = await getSql();
  const row = (await sql<StudentRow>`select id, institution_id, name, form_id, status, is_antagonist, notes, last_lesson_date, last_institution_id, last_subject, specialization_school, created_at from students where id = ${input.studentId} limit 1`)[0];
  if (!row) return { ok: false, error: "Student not found" };
  if (session.role === "teacher") {
    const access = await sql<AccessRow>`select student_id, institution_id, display_name, enrolled_at from student_access where student_id = ${row.id} and institution_id = ${session.institutionId}`;
    if (access.length === 0) return { ok: false, error: "Student not found" };
  }
  const status = input.status ?? parseStatus(row.status);
  const notes = input.notes ?? row.notes;
  const spec = input.specializationSchool ?? row.specialization_school;
  const nextName = input.name?.trim().replace(/\s+/g, " ");
  await sql`update students set status = ${status}, notes = ${notes}, specialization_school = ${spec} where id = ${row.id}`;
  if (nextName) {
    if (session.role === "gm") {
      await sql`update students set name = ${nextName} where id = ${row.id}`;
    }
    const instId = actingInstitutionId(session, session.role === "gm" ? row.institution_id : undefined);
    if (instId) {
      await sql`insert into student_access (student_id, institution_id, display_name)
        values (${row.id}, ${instId}, ${nextName})
        on conflict (student_id, institution_id) do update set display_name = ${nextName}`;
    }
  }
  return { ok: true };
}

export async function logLesson(
  pin: string,
  input: {
    studentId: string;
    institutionId?: string;
    date: string;
    teacherName: string;
    subject: string;
    spellId: string;
    notes?: string;
    specializationSchool?: string;
  },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (!teacherOrGm(session)) return { ok: false, error: "Not allowed" };
  const instId = actingInstitutionId(session, input.institutionId);
  if (!instId) return { ok: false, error: "Institution required" };
  const sql = await getSql();
  const institutions = await loadInstitutions(sql);
  const inst = institutions.find((i) => i.id === instId);
  if (!inst) return { ok: false, error: "Institution not found" };
  if (isNecromancy(input.subject) && !inst.isAntagonist && session.role !== "gm") {
    return { ok: false, error: "Subject not taught here" };
  }
  if (!inst.subjects.some((s) => s.toLowerCase() === input.subject.toLowerCase()) && session.role !== "gm") {
    return { ok: false, error: "Subject not taught here" };
  }
  const student = (await sql<{ id: string; name: string }>`select id, name from students where id = ${input.studentId} limit 1`)[0];
  if (!student) return { ok: false, error: "Student not found" };
  const spell = (
    await sql<CatalogSpellRow>`select id, name, school, tier, form_id, hidden from catalog_spells where id = ${input.spellId} limit 1`
  )[0];
  if (!spell) return { ok: false, error: "Spell not found" };
  if (spell.school.toLowerCase() !== input.subject.toLowerCase()) {
    return { ok: false, error: "Spell does not match subject" };
  }
  const known = await sql<{ n: number }>`select count(*)::int as n from learned_spells where student_id = ${student.id} and lower(name) = ${spell.name.toLowerCase()} and lower(school) = ${spell.school.toLowerCase()}`;
  if ((known[0]?.n ?? 0) > 0) return { ok: false, error: "Spell already learned" };

  const progress = (
    await sql<ProgressRow>`select student_id, institution_id, school, learnable_tier from student_progress where student_id = ${student.id} and institution_id = ${instId} and lower(school) = ${spell.school.toLowerCase()} limit 1`
  )[0];
  const cap = progress ? Number(progress.learnable_tier) : 1;
  if (Number(spell.tier) > cap) return { ok: false, error: `${spell.school} is T${cap}` };

  const date = input.date || todayISO();
  const lessonId = randomUUID();
  const spellRowId = randomUUID();
  await sql`insert into student_access (student_id, institution_id, display_name)
    values (${student.id}, ${instId}, ${student.name})
    on conflict (student_id, institution_id) do nothing`;
  await sql`insert into lessons (id, student_id, date, institution_id, subject, teacher_name, notes)
    values (${lessonId}, ${student.id}, ${date}, ${instId}, ${input.subject}, ${input.teacherName.trim()}, ${input.notes ?? ""})`;
  await sql`insert into learned_spells (id, student_id, lesson_id, catalog_id, name, school, tier, form_id, institution_id, status, taught_date)
    values (${spellRowId}, ${student.id}, ${lessonId}, ${spell.id}, ${spell.name}, ${spell.school}, ${Number(spell.tier)}, ${spell.form_id}, ${instId}, ${"pending"}, ${date})`;

  const existingTier = (
    await sql<TierRow>`select student_id, institution_id, school, level from student_tiers where student_id = ${student.id} and institution_id = ${instId} and lower(school) = ${spell.school.toLowerCase()} limit 1`
  )[0];
  if (!existingTier) {
    await sql`insert into student_tiers (student_id, institution_id, school, level) values (${student.id}, ${instId}, ${spell.school}, ${1})`;
    await sql`insert into student_progress (student_id, institution_id, school, learnable_tier) values (${student.id}, ${instId}, ${spell.school}, ${1}) on conflict do nothing`;
  }

  const spec = input.specializationSchool?.trim();
  if (spec) {
    await sql`update students set last_lesson_date = ${date}, last_institution_id = ${instId}, last_subject = ${input.subject}, specialization_school = ${spec} where id = ${student.id}`;
  } else {
    await sql`update students set last_lesson_date = ${date}, last_institution_id = ${instId}, last_subject = ${input.subject} where id = ${student.id}`;
  }
  return { ok: true };
}

export async function graduateStudent(
  pin: string,
  input: { studentId: string; school: string; institutionId?: string },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (!teacherOrGm(session)) return { ok: false, error: "Not allowed" };
  const instId = actingInstitutionId(session, input.institutionId);
  if (!instId) return { ok: false, error: "Institution required" };
  const sql = await getSql();
  const institutions = await loadInstitutions(sql);
  const inst = institutions.find((i) => i.id === instId);
  if (!inst) return { ok: false, error: "Institution not found" };
  const school = input.school.trim();
  if (!school) return { ok: false, error: "Subject required" };

  const tierRow = (
    await sql<TierRow>`select student_id, institution_id, school, level from student_tiers where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`
  )[0];
  const current = tierRow ? Number(tierRow.level) : 1;
  const maxTier = (
    await sql<{ level: number }>`select coalesce(max(level), 5)::int as level from catalog_tiers`
  )[0]?.level ?? 5;
  if (current >= maxTier) return { ok: false, error: "Already at highest tier" };

  const spells = await sql<{ n: number }>`select count(*)::int as n from learned_spells where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} and tier = ${current}`;
  const have = spells[0]?.n ?? 0;
  if (have < inst.advancementMin) return { ok: false, error: "Not enough spells at this tier" };

  const next = current + 1;
  if (tierRow) {
    await sql`update student_tiers set level = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
  } else {
    await sql`insert into student_tiers (student_id, institution_id, school, level) values (${input.studentId}, ${instId}, ${school}, ${next})`;
  }
  const progress = (
    await sql<ProgressRow>`select student_id, institution_id, school, learnable_tier from student_progress where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`
  )[0];
  if (progress) {
    await sql`update student_progress set learnable_tier = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
  } else {
    await sql`insert into student_progress (student_id, institution_id, school, learnable_tier) values (${input.studentId}, ${instId}, ${school}, ${next})`;
  }
  return { ok: true };
}

export async function revertGraduation(
  pin: string,
  input: { studentId: string; school: string; institutionId?: string },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (!teacherOrGm(session)) return { ok: false, error: "Not allowed" };
  const instId = actingInstitutionId(session, input.institutionId);
  if (!instId) return { ok: false, error: "Institution required" };
  const sql = await getSql();
  const school = input.school.trim();
  if (!school) return { ok: false, error: "Subject required" };
  const progress = (
    await sql<ProgressRow>`select student_id, institution_id, school, learnable_tier from student_progress where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`
  )[0];
  const tierRow = (
    await sql<TierRow>`select student_id, institution_id, school, level from student_tiers where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`
  )[0];
  const learnable = progress ? Number(progress.learnable_tier) : tierRow ? Number(tierRow.level) : 1;
  if (learnable <= 1) return { ok: false, error: "Already at T1" };
  const next = learnable - 1;
  if (progress) {
    await sql`update student_progress set learnable_tier = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
  }
  if (tierRow && Number(tierRow.level) > next) {
    await sql`update student_tiers set level = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
  }
  return { ok: true };
}

export async function grantSpell(pin: string, spellRowId: string): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (session.role === "teacher") return { ok: false, error: "Not allowed" };
  const sql = await getSql();
  const row = (await sql<{ id: string }>`select id from learned_spells where id = ${spellRowId} limit 1`)[0];
  if (!row) return { ok: false, error: "Grant line not found" };
  await sql`update learned_spells set status = ${"granted"}, granted_date = ${todayISO()} where id = ${spellRowId}`;
  return { ok: true };
}

export async function grantPerk(pin: string, studentId: string, perkId: string): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session) return { ok: false, error: "PIN not recognized" };
  if (session.role !== "gm") return { ok: false, error: "Not allowed" };
  const sql = await getSql();
  const perk = (
    await sql<CatalogPerkRow>`select id, school, rank, form_id, unlock, prohibited from catalog_perks where id = ${perkId} limit 1`
  )[0];
  if (!perk) return { ok: false, error: "Perk not found" };
  if (asBool(perk.prohibited)) return { ok: false, error: "Perk is prohibited" };
  const already = await sql<{ n: number }>`select count(*)::int as n from granted_perks where student_id = ${studentId} and catalog_id = ${perk.id}`;
  if ((already[0]?.n ?? 0) > 0) return { ok: false, error: "Perk already granted" };
  const id = randomUUID();
  await sql`insert into granted_perks (id, student_id, catalog_id, school, rank, form_id, granted_date)
    values (${id}, ${studentId}, ${perk.id}, ${perk.school}, ${perk.rank}, ${perk.form_id}, ${todayISO()})`;
  return { ok: true };
}

export async function saveInstitution(
  pin: string,
  input: {
    id?: string;
    name: string;
    weeklySpellLimit: number;
    perSchoolLimit: number;
    isAntagonist: boolean;
    advancementMin: number;
    subjects: string[];
    newPin?: string;
  },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session || session.role !== "gm") return { ok: false, error: "Not allowed" };
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name required" };
  const sql = await getSql();
  const id = input.id || `inst-${randomUUID().slice(0, 8)}`;
  const existing = (await sql<{ id: string; pin_hash: string }>`select id, pin_hash from institutions where id = ${id} limit 1`)[0];
  let pinHash = existing?.pin_hash;
  if (input.newPin) {
    if (!/^\d{6}$/.test(input.newPin)) return { ok: false, error: "PIN must be 6 digits" };
    pinHash = hashPin(input.newPin);
  }
  if (!existing && !pinHash) return { ok: false, error: "PIN required for a new institution" };
  if (existing) {
    await sql`update institutions set name = ${name}, weekly_spell_limit = ${input.weeklySpellLimit}, per_school_limit = ${input.perSchoolLimit}, is_antagonist = ${input.isAntagonist}, advancement_min = ${input.advancementMin}, pin_hash = ${pinHash!} where id = ${id}`;
    await sql`delete from institution_subjects where institution_id = ${id}`;
  } else {
    await sql`insert into institutions (id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min)
      values (${id}, ${name}, ${pinHash!}, ${input.weeklySpellLimit}, ${input.perSchoolLimit}, ${input.isAntagonist}, ${input.advancementMin})`;
  }
  for (const school of input.subjects) {
    const s = school.trim();
    if (!s) continue;
    await sql`insert into institution_subjects (institution_id, school) values (${id}, ${s}) on conflict do nothing`;
  }
  return { ok: true };
}

export async function saveMasterPin(pin: string, kind: "gm" | "grantor", nextPin: string): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session || session.role !== "gm") return { ok: false, error: "Not allowed" };
  if (!/^\d{6}$/.test(nextPin)) return { ok: false, error: "PIN must be 6 digits" };
  const sql = await getSql();
  const key = kind === "gm" ? "gm_pin_hash" : "grantor_pin_hash";
  const hashed = hashPin(nextPin);
  await sql`insert into settings (key, value) values (${key}, ${hashed}) on conflict (key) do update set value = ${hashed}`;
  return { ok: true };
}

export async function saveSpell(
  pin: string,
  input: { id?: string; name: string; school: string; tier: number; formId: string; hidden: boolean },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session || session.role !== "gm") return { ok: false, error: "Not allowed" };
  const name = input.name.trim();
  const school = input.school.trim();
  if (!name || !school) return { ok: false, error: "Name and subject required" };
  const sql = await getSql();
  const id =
    input.id ||
    `${school}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  await sql`insert into catalog_spells (id, name, school, tier, form_id, hidden)
    values (${id}, ${name}, ${school}, ${input.tier}, ${input.formId.trim()}, ${input.hidden})
    on conflict (id) do update set name = ${name}, school = ${school}, tier = ${input.tier}, form_id = ${input.formId.trim()}, hidden = ${input.hidden}`;
  return { ok: true };
}

export async function savePerk(
  pin: string,
  input: { id?: string; school: string; rank: string; formId: string; unlock: string; prohibited: boolean },
): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session || session.role !== "gm") return { ok: false, error: "Not allowed" };
  const school = input.school.trim();
  const rank = input.rank.trim();
  if (!school || !rank) return { ok: false, error: "School and rank required" };
  const sql = await getSql();
  const id =
    input.id ||
    `${school}-${rank}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  await sql`insert into catalog_perks (id, school, rank, form_id, unlock, prohibited)
    values (${id}, ${school}, ${rank}, ${input.formId.trim()}, ${input.unlock.trim()}, ${input.prohibited})
    on conflict (id) do update set school = ${school}, rank = ${rank}, form_id = ${input.formId.trim()}, unlock = ${input.unlock.trim()}, prohibited = ${input.prohibited}`;
  return { ok: true };
}

export async function saveTiers(pin: string, levels: number[]): Promise<MutResult> {
  const session = await resolveSession(pin);
  if (!session || session.role !== "gm") return { ok: false, error: "Not allowed" };
  const unique = [...new Set(levels.filter((n) => Number.isInteger(n) && n > 0))].sort((a, b) => a - b);
  if (unique.length === 0) return { ok: false, error: "At least one tier required" };
  const sql = await getSql();
  await sql`delete from catalog_tiers`;
  for (const level of unique) {
    await sql`insert into catalog_tiers (level) values (${level})`;
  }
  return { ok: true };
}

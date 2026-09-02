import {
  DEFAULT_INSTITUTIONS,
  DEFAULT_PERKS,
  DEFAULT_SPELLS,
  DEFAULT_TIERS,
  type CatalogPerk,
  type CatalogSpell,
} from "@/lib/catalog";

export const APP_NAME = "Sovngarde Collegium";
export const APP_ORG = "Keizaal Online";
export const APP_TITLE = `${APP_NAME}, ${APP_ORG}`;
export const NAME_PLACEHOLDER = "Velos Garinson";
export const FORM_ID_PLACEHOLDER = "1A3F";
export const TIER_MAX = 5;
export const COLLEGE_NAME = "College of Winterhold";
export const COLLEGE_WEEKLY_CAP = 2;
export const GLOBAL_NON_COLLEGE_CAP = 1;

export const ENROLLED_FILTERS = [
  { value: "7d", label: "Enrolled ≤ 7 days" },
  { value: "30d", label: "Enrolled ≤ 30 days" },
  { value: "90d", label: "Enrolled ≤ 90 days" },
  { value: "older", label: "Enrolled > 90 days" },
] as const;

export const ROSTER_SORTS = ["name", "enrolled", "lesson", "status", "subject"] as const;
export type RosterSort = (typeof ROSTER_SORTS)[number];

export const SORT_LABEL: Record<RosterSort, string> = {
  name: "Name",
  enrolled: "Time enrolled",
  lesson: "Last lesson",
  status: "Status",
  subject: "Subject",
};

export type { CatalogPerk, CatalogSpell };
export { DEFAULT_INSTITUTIONS, DEFAULT_PERKS, DEFAULT_SPELLS, DEFAULT_TIERS };

export const STUDENT_STATUSES = ["active", "expelled", "suspended", "dead", "graduated"] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Active",
  expelled: "Expelled",
  suspended: "Suspended",
  dead: "Dead",
  graduated: "Graduated",
};

export const STATUS_BADGE: Record<StudentStatus, "neutral" | "warn" | "necro" | "resto"> = {
  active: "neutral",
  expelled: "warn",
  suspended: "warn",
  dead: "necro",
  graduated: "resto",
};

export type SchoolTone = "pyro" | "resto" | "necro" | "cryo" | "vigil" | "neutral";
export type GrantStatus = "pending" | "granted" | "overdue";

export interface Tier {
  school: string;
  level: number;
  institutionId?: string | null;
}

export interface LearnedSpell {
  id: string;
  catalogId: string;
  name: string;
  school: string;
  tier: number;
  formId: string;
  institution: string;
  antagonist: boolean;
  status: GrantStatus;
  taughtDate: string;
  grantedDate: string | null;
  lessonId: string;
  overWeeklyLimit?: boolean;
}

export interface GrantedPerk {
  id: string;
  catalogId: string;
  school: string;
  rank: string;
  formId: string;
  grantedDate: string;
}

export interface Lesson {
  id: string;
  date: string;
  institution: string;
  subject: string;
  teacherName: string;
  notes: string;
  spellNames: string[];
  tiersUnlocked: Tier[];
}

export interface AdvancementCue {
  school: string;
  currentTier: number;
  nextTier: number;
  have: number;
  need: number;
}

export interface WeeklyWarning {
  week: string;
  count: number;
  max: number;
  school?: string;
  reason: "count" | "school" | "global";
}

export interface WeekUsage {
  week: string;
  college: number;
  nonCollege: number;
  antagonist: number;
  total: number;
  remainingCollege: number;
  remainingNonCollege: number;
  collegeSchools: string[];
  overLimit: boolean;
  reason: string | null;
  includeAntagonist: boolean;
}

export interface Student {
  id: string;
  formId: string;
  institutionId: string;
  name: string;
  status: StudentStatus;
  lastLessonDate: string | null;
  lastInstitution: string;
  lastSubject: string;
  notes: string;
  tiers: Tier[];
  spells: LearnedSpell[];
  perks: GrantedPerk[];
  lessons: Lesson[];
  createdAt: string;
  enrolledAt?: string;
  isAntagonist?: boolean;
  institutionAntagonist?: boolean;
  visibleInstitutionIds?: string[];
  weeklyWarning?: WeeklyWarning | null;
  weekUsage?: WeekUsage;
  missingT2Perks?: string[];
  advancement?: AdvancementCue[];
  learnableTiers?: Tier[];
  specializationSchool?: string;
}

export interface InstitutionRecord {
  id: string;
  name: string;
  weeklySpellLimit: number;
  perSchoolLimit: number;
  isAntagonist: boolean;
  subjects: string[];
  advancementMin: number;
}

export interface RosterPayload {
  role: "gm" | "grantor" | "teacher";
  institutionId: string | null;
  institutionName: string | null;
  students: Student[];
  institutions: InstitutionRecord[];
  catalogSpells: CatalogSpell[];
  catalogPerks: CatalogPerk[];
  tiers: number[];
}

export function schoolTone(school: string): SchoolTone {
  switch (school.trim().toLowerCase()) {
    case "pyromancy":
    case "destruction":
      return "pyro";
    case "restoration":
      return "resto";
    case "necromancy":
    case "conjuration":
      return "necro";
    case "cryomancy":
    case "aeromancy":
      return "cryo";
    case "vigil":
      return "vigil";
    default:
      return "neutral";
  }
}

export const SCHOOL_BADGE: Record<SchoolTone, string> = {
  pyro: "bg-pyro/15 text-pyro",
  resto: "bg-resto/15 text-resto",
  necro: "bg-necro/15 text-necro",
  cryo: "bg-cryo/15 text-cryo",
  vigil: "bg-resto/15 text-resto",
  neutral: "bg-elevated text-muted-foreground",
};

export function highestTier(student: Student): Tier | null {
  if (student.tiers.length === 0) return null;
  return student.tiers.reduce((best, t) => (t.level > best.level ? t : best));
}

export function standingTiers(student: Student): Tier[] {
  const map = new Map<string, Tier>();
  for (const tier of student.tiers) {
    const key = tier.school.toLowerCase();
    const prev = map.get(key);
    if (!prev || tier.level > prev.level) map.set(key, tier);
  }
  return [...map.values()].sort((a, b) => b.level - a.level || a.school.localeCompare(b.school));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const now = new Date();
  if (y !== now.getFullYear()) return `${m}/${d}/${String(y).slice(2)}`;
  return `${m}/${d}`;
}

export function pendingCount(student: Student): number {
  return student.spells.filter((s) => s.status === "pending" || s.status === "overdue").length;
}

export function overdueGrantCount(student: Student): number {
  return student.spells.filter((s) => s.status === "overdue").length;
}

export function parseStatus(value: string | null | undefined): StudentStatus {
  const v = (value ?? "active").toLowerCase();
  return (STUDENT_STATUSES as readonly string[]).includes(v) ? (v as StudentStatus) : "active";
}

export function daysEnrolled(student: Pick<Student, "createdAt" | "enrolledAt">): number {
  const iso = (student.enrolledAt ?? student.createdAt).slice(0, 10);
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const then = Date.UTC(y, m - 1, d);
  const [ty, tm, td] = todayISO().split("-").map(Number);
  if (!ty || !tm || !td) return 0;
  const now = Date.UTC(ty, tm - 1, td);
  return Math.max(0, Math.round((now - then) / 86_400_000));
}

export function todayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

export function weekMondayISO(iso: string): string {
  const [ys, ms, ds] = iso.split("-").map(Number);
  if (!ys || !ms || !ds) return iso;
  const date = new Date(Date.UTC(ys, ms - 1, ds, 12));
  const daysFromMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysFromMonday);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function currentWeekMondayISO(): string {
  return weekMondayISO(todayISO());
}

export function isCollegeInstitution(name: string): boolean {
  return name.trim().toLowerCase() === COLLEGE_NAME.toLowerCase();
}

export function isNecromancy(school: string): boolean {
  return school.trim().toLowerCase() === "necromancy";
}

export function normalizeFormId(raw: string): string {
  return raw.trim().replace(/\s+/g, "");
}

export function uniqueSorted(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = raw.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

export function subjectsForInstitution(
  institutions: InstitutionRecord[],
  name: string,
  fallback: string[] = [],
): string[] {
  const inst = institutions.find((i) => i.name === name);
  if (!inst) return fallback;
  return inst.subjects.length ? inst.subjects : fallback;
}

type UsageSpell = Pick<LearnedSpell, "taughtDate" | "institution" | "school"> & {
  antagonist?: boolean;
};

function usageForWeek(spells: UsageSpell[], weekMonday: string, includeAntagonist = true): WeekUsage {
  const thisWeek = spells.filter((s) => weekMondayISO(s.taughtDate) === weekMonday);
  const antagonist = thisWeek.filter((s) => s.antagonist).length;
  const counted = includeAntagonist ? thisWeek : thisWeek.filter((s) => !s.antagonist);
  const college = counted.filter((s) => isCollegeInstitution(s.institution));
  const nonCollege = counted.filter((s) => !isCollegeInstitution(s.institution));
  const schoolCounts = new Map<string, number>();
  for (const spell of college) {
    const key = spell.school.toLowerCase();
    schoolCounts.set(key, (schoolCounts.get(key) ?? 0) + 1);
  }
  const dupSchool = [...schoolCounts.values()].some((n) => n > 1);
  const remainingCollege = Math.max(0, COLLEGE_WEEKLY_CAP - college.length - nonCollege.length);
  const remainingNonCollege = nonCollege.length >= GLOBAL_NON_COLLEGE_CAP ? 0 : remainingCollege > 0 ? 1 : 0;

  let overLimit = false;
  let reason: string | null = null;
  if (nonCollege.length > GLOBAL_NON_COLLEGE_CAP) {
    overLimit = true;
    reason = `${nonCollege.length} non-college spells this week (limit ${GLOBAL_NON_COLLEGE_CAP})`;
  } else if (college.length + nonCollege.length > COLLEGE_WEEKLY_CAP) {
    overLimit = true;
    reason = `${college.length + nonCollege.length} spells this week (cap ${COLLEGE_WEEKLY_CAP})`;
  } else if (dupSchool) {
    overLimit = true;
    reason = "More than 1 college spell in the same subject this week";
  }

  return {
    week: weekMonday,
    college: college.length,
    nonCollege: nonCollege.length,
    antagonist,
    total: counted.length,
    remainingCollege,
    remainingNonCollege,
    collegeSchools: college.map((s) => s.school),
    overLimit,
    reason,
    includeAntagonist,
  };
}

export function weekUsage(spells: UsageSpell[], includeAntagonist = true): WeekUsage {
  return usageForWeek(spells, currentWeekMondayISO(), includeAntagonist);
}

export function weeklyWarningFor(spells: UsageSpell[], includeAntagonist = true): WeeklyWarning | null {
  const week = currentWeekMondayISO();
  const usage = usageForWeek(spells, week, includeAntagonist);
  if (!usage.overLimit) return null;
  if (usage.reason?.includes("same subject")) {
    return { week, count: usage.college, max: 1, reason: "school" };
  }
  if (usage.reason?.includes("non-college")) {
    return { week, count: usage.nonCollege, max: GLOBAL_NON_COLLEGE_CAP, reason: "global" };
  }
  return { week, count: usage.total, max: COLLEGE_WEEKLY_CAP, reason: "count" };
}

export function warningLabel(w: WeeklyWarning): string {
  if (w.reason === "school") return `${w.count} in one subject this week (limit ${w.max})`;
  if (w.reason === "global") return `${w.count} non-college spells this week (limit ${w.max})`;
  return `${w.count} spells this week (limit ${w.max})`;
}

export function perkSchoolFor(subject: string): string | null {
  const s = subject.trim().toLowerCase();
  if (s === "pyromancy" || s === "cryomancy" || s === "aeromancy" || s === "destruction") return "Destruction";
  if (s === "restoration" || s === "vigil") return "Restoration";
  if (s === "alteration") return "Alteration";
  if (s === "illusion") return "Illusion";
  if (s === "conjuration" || s === "necromancy") return "Conjuration";
  return null;
}

export function missingT2PerkSchools(student: Pick<Student, "tiers" | "perks">): string[] {
  const needed = new Set<string>();
  for (const tier of student.tiers) {
    if (tier.level < 2) continue;
    const school = perkSchoolFor(tier.school);
    if (school) needed.add(school);
  }
  return [...needed].filter(
    (school) =>
      !student.perks.some(
        (perk) =>
          perk.school.toLowerCase() === school.toLowerCase() &&
          (perk.rank === "Adept" || perk.rank === "Expert"),
      ),
  );
}

export function advancementReady(
  spells: Pick<LearnedSpell, "school" | "tier">[],
  need: number,
  displayed: Pick<Tier, "school" | "level">[] = [],
  maxTier = TIER_MAX,
): AdvancementCue[] {
  const min = Math.max(1, need);
  const spellTiers = new Map<string, number[]>();
  for (const spell of spells) {
    const school = spell.school.trim();
    if (!school) continue;
    const list = spellTiers.get(school) ?? [];
    list.push(spell.tier);
    spellTiers.set(school, list);
  }
  const rows =
    displayed.length > 0
      ? displayed
      : [...spellTiers.entries()].map(([school, tiers]) => ({ school, level: Math.max(...tiers) }));
  const cues: AdvancementCue[] = [];
  for (const row of rows) {
    const school = row.school.trim();
    if (!school) continue;
    const currentTier = Math.max(1, row.level);
    if (currentTier >= maxTier) continue;
    const have = (spellTiers.get(school) ?? []).filter((t) => t === currentTier).length;
    if (have >= min) {
      cues.push({ school, currentTier, nextTier: currentTier + 1, have, need: min });
    }
  }
  return cues;
}

export function learnableLevel(student: Student, school: string): number {
  const key = school.trim().toLowerCase();
  const progress = student.learnableTiers?.find((t) => t.school.toLowerCase() === key);
  if (progress) return Math.max(1, progress.level);
  const tier = student.tiers.find((t) => t.school.toLowerCase() === key);
  return Math.max(1, tier?.level ?? 1);
}

export function alreadyKnowsSpell(student: Student, spell: Pick<CatalogSpell, "name" | "school">): boolean {
  return student.spells.some(
    (s) => s.name.toLowerCase() === spell.name.toLowerCase() && s.school.toLowerCase() === spell.school.toLowerCase(),
  );
}

export function canLearnSpell(student: Student, spell: CatalogSpell, _atCollege: boolean): boolean {
  if (alreadyKnowsSpell(student, spell)) return false;
  return spell.tier <= learnableLevel(student, spell.school);
}

export function learnBlockReason(
  known: { name: string; school: string; tier: number }[],
  spell: { name: string; school: string; tier: number },
  learnable: Map<string, number>,
): string | null {
  if (
    known.some(
      (s) => s.name.toLowerCase() === spell.name.toLowerCase() && s.school.toLowerCase() === spell.school.toLowerCase(),
    )
  ) {
    return `${spell.name} already learned`;
  }
  const cap = learnable.get(spell.school.toLowerCase()) ?? 1;
  if (spell.tier > cap) return `${spell.school} is T${cap}`;
  return null;
}

export interface RosterQuery {
  text: string;
  subject: string;
  status: string;
  enrolled: string;
  sort: RosterSort | "";
  grant: string;
  week: string;
}

export function parseRosterQuery(raw: string): RosterQuery {
  const tokens = raw.match(/[^\s]+/g) ?? [];
  const kept: string[] = [];
  const q: RosterQuery = {
    text: "",
    subject: "",
    status: "",
    enrolled: "",
    sort: "",
    grant: "",
    week: "",
  };
  for (const token of tokens) {
    const [key, ...rest] = token.split(":");
    const value = rest.join(":");
    if (!value || !key) {
      kept.push(token);
      continue;
    }
    const k = key.toLowerCase();
    if (k === "subject") q.subject = value;
    else if (k === "status") q.status = value;
    else if (k === "enrolled") q.enrolled = value;
    else if (k === "sort" && (ROSTER_SORTS as readonly string[]).includes(value)) q.sort = value as RosterSort;
    else if (k === "grant") q.grant = value;
    else if (k === "week") q.week = value;
    else kept.push(token);
  }
  q.text = kept.join(" ");
  return q;
}

export function setQueryText(query: string, text: string): string {
  const parsed = parseRosterQuery(query);
  const modifiers: string[] = [];
  if (parsed.subject) modifiers.push(`subject:${parsed.subject}`);
  if (parsed.status) modifiers.push(`status:${parsed.status}`);
  if (parsed.enrolled) modifiers.push(`enrolled:${parsed.enrolled}`);
  if (parsed.sort) modifiers.push(`sort:${parsed.sort}`);
  if (parsed.grant) modifiers.push(`grant:${parsed.grant}`);
  if (parsed.week) modifiers.push(`week:${parsed.week}`);
  return [text.trim(), ...modifiers].filter(Boolean).join(" ");
}

export function setQueryToken(query: string, key: keyof Omit<RosterQuery, "text">, value: string): string {
  const parsed = parseRosterQuery(query);
  parsed[key] = value as never;
  const modifiers: string[] = [];
  if (parsed.subject) modifiers.push(`subject:${parsed.subject}`);
  if (parsed.status) modifiers.push(`status:${parsed.status}`);
  if (parsed.enrolled) modifiers.push(`enrolled:${parsed.enrolled}`);
  if (parsed.sort) modifiers.push(`sort:${parsed.sort}`);
  if (parsed.grant) modifiers.push(`grant:${parsed.grant}`);
  if (parsed.week) modifiers.push(`week:${parsed.week}`);
  return [parsed.text, ...modifiers].filter(Boolean).join(" ");
}

export function studentMatchesQuery(student: Student, q: RosterQuery, gm: boolean): boolean {
  if (q.text) {
    const hay = `${student.name} ${student.formId}`.toLowerCase();
    if (!hay.includes(q.text.toLowerCase())) return false;
  }
  if (q.subject) {
    const key = q.subject.toLowerCase();
    const hit =
      student.lastSubject.toLowerCase() === key ||
      student.tiers.some((t) => t.school.toLowerCase() === key) ||
      student.spells.some((s) => s.school.toLowerCase() === key) ||
      (student.specializationSchool ?? "").toLowerCase() === key;
    if (!hit) return false;
  }
  if (q.status) {
    const label = STATUS_LABEL[student.status].toLowerCase();
    if (label !== q.status.toLowerCase() && student.status !== q.status.toLowerCase()) return false;
  }
  if (q.enrolled) {
    const days = daysEnrolled(student);
    if (q.enrolled === "7d" && days > 7) return false;
    if (q.enrolled === "30d" && days > 30) return false;
    if (q.enrolled === "90d" && days > 90) return false;
    if (q.enrolled === "older" && days <= 90) return false;
  }
  if (q.grant === "pending" && pendingCount(student) === 0) return false;
  if (q.grant === "overdue" && overdueGrantCount(student) === 0) return false;
  if (q.week === "over" && !(gm && student.weeklyWarning)) return false;
  return true;
}

export function sortRoster(students: Student[], sort: RosterSort | "", canGrant: boolean): Student[] {
  const copy = [...students];
  copy.sort((a, b) => {
    if (canGrant) {
      const ao = overdueGrantCount(a);
      const bo = overdueGrantCount(b);
      if (ao !== bo) return bo - ao;
    }
    if (sort === "enrolled") return daysEnrolled(b) - daysEnrolled(a) || a.name.localeCompare(b.name);
    if (sort === "lesson") {
      const ad = a.lastLessonDate ?? "";
      const bd = b.lastLessonDate ?? "";
      if (ad !== bd) return ad < bd ? -1 : 1;
      return a.name.localeCompare(b.name);
    }
    if (sort === "status") return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
    if (sort === "subject") return (a.lastSubject || "").localeCompare(b.lastSubject || "") || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
  return copy;
}

export function previewUsage(
  current: WeekUsage,
  extra: { institution: string; school: string; antagonist: boolean }[],
): WeekUsage {
  const fake: UsageSpell[] = extra
    .filter((s) => !s.antagonist)
    .map((s) => ({
      taughtDate: todayISO(),
      institution: s.institution,
      school: s.school,
      antagonist: false,
    }));
  const existing: UsageSpell[] = [];
  for (let i = 0; i < current.college; i++) {
    existing.push({
      taughtDate: todayISO(),
      institution: COLLEGE_NAME,
      school: current.collegeSchools[i] ?? "Pyromancy",
    });
  }
  for (let i = 0; i < current.nonCollege; i++) {
    existing.push({ taughtDate: todayISO(), institution: "Synod", school: "Restoration" });
  }
  return weekUsage([...existing, ...fake], false);
}

export function usageLabel(usage: WeekUsage): string {
  if (usage.overLimit && usage.reason) return usage.reason;
  return `${usage.total} counted this week`;
}

export function institutionUsageLabel(usage: WeekUsage, college: boolean): string {
  if (college) {
    const used = usage.college + usage.nonCollege;
    return `${used} this week · ${usage.remainingCollege} remaining`;
  }
  return `${usage.nonCollege} this week · ${usage.remainingNonCollege} remaining`;
}

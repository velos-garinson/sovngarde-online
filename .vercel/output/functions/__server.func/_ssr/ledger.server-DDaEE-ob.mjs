import { a as DEFAULT_TIERS, i as DEFAULT_SUBJECTS_BY_INSTITUTION, r as DEFAULT_SPELLS, t as DEFAULT_PERKS } from "./catalog-CqkqW_vg.mjs";
import { F as weekUsage, I as weeklyWarningFor, P as weekMondayISO, b as missingT2PerkSchools, d as advancementReady, j as todayISO, m as currentWeekMondayISO, v as isCollegeInstitution, w as parseStatus, x as normalizeFormId, y as isNecromancy } from "./ledger-cJ4uPQbl.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger.server-DDaEE-ob.js
var _0002_schema_default = "create table if not exists settings (\n  key text primary key,\n  value text not null\n);\n\ncreate table if not exists institutions (\n  id text primary key,\n  name text not null unique,\n  pin_hash text not null,\n  weekly_spell_limit integer not null default 1,\n  per_school_limit integer not null default 0,\n  is_antagonist boolean not null default false,\n  advancement_min integer not null default 1\n);\n\ncreate table if not exists institution_subjects (\n  institution_id text not null references institutions (id) on delete cascade,\n  school text not null,\n  primary key (institution_id, school)\n);\n\ncreate table if not exists catalog_tiers (\n  level integer primary key\n);\n\ncreate table if not exists catalog_spells (\n  id text primary key,\n  name text not null,\n  school text not null,\n  tier integer not null,\n  form_id text not null default '',\n  hidden boolean not null default false\n);\n\ncreate table if not exists catalog_perks (\n  id text primary key,\n  school text not null,\n  rank text not null,\n  form_id text not null default '',\n  unlock text not null default '',\n  prohibited boolean not null default false\n);\n\ncreate table if not exists students (\n  id text primary key,\n  institution_id text not null references institutions (id),\n  name text not null,\n  status text not null default 'active',\n  is_antagonist boolean not null default false,\n  notes text not null default '',\n  last_lesson_date date,\n  last_institution_id text,\n  last_subject text not null default '',\n  specialization_school text not null default '',\n  created_at timestamptz not null default now()\n);\n\ncreate unique index if not exists students_name_lower_idx on students (lower(name));\n\ncreate table if not exists student_access (\n  student_id text not null references students (id) on delete cascade,\n  institution_id text not null references institutions (id) on delete cascade,\n  primary key (student_id, institution_id)\n);\n\ncreate table if not exists lessons (\n  id text primary key,\n  student_id text not null references students (id) on delete cascade,\n  date date not null,\n  institution_id text not null references institutions (id),\n  subject text not null default '',\n  teacher_name text not null default '',\n  notes text not null default ''\n);\n\ncreate table if not exists learned_spells (\n  id text primary key,\n  student_id text not null references students (id) on delete cascade,\n  lesson_id text,\n  catalog_id text not null default '',\n  name text not null,\n  school text not null,\n  tier integer not null default 1,\n  form_id text not null default '',\n  institution_id text not null references institutions (id),\n  status text not null default 'pending',\n  taught_date date not null,\n  granted_date date\n);\n\ncreate table if not exists student_tiers (\n  student_id text not null references students (id) on delete cascade,\n  institution_id text not null references institutions (id),\n  school text not null,\n  level integer not null,\n  primary key (student_id, institution_id, school)\n);\n\ncreate table if not exists student_progress (\n  student_id text not null references students (id) on delete cascade,\n  institution_id text not null references institutions (id),\n  school text not null,\n  learnable_tier integer not null default 1,\n  primary key (student_id, institution_id, school)\n);\n\ncreate table if not exists granted_perks (\n  id text primary key,\n  student_id text not null references students (id) on delete cascade,\n  catalog_id text not null default '',\n  school text not null,\n  rank text not null,\n  form_id text not null default '',\n  granted_date date not null\n);\n";
var _0003_player_form_default = "alter table students add column if not exists form_id text not null default '';\n\ncreate unique index if not exists students_form_id_uidx\n  on students (lower(form_id))\n  where form_id <> '';\n\ndrop index if exists students_name_lower_idx;\n\nalter table student_access add column if not exists display_name text not null default '';\nalter table student_access add column if not exists enrolled_at timestamptz not null default now();\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_schema.sql": _0002_schema_default,
			"/migrations/0003_player_form.sql": _0003_player_form_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var SEED_PINS = {
	gm: "999999",
	grantor: "888888",
	winterhold: "100001",
	synod: "200002",
	thalmor: "300003",
	vigil: "400004",
	other: "500005"
};
function hashPin(pin) {
	return createHash("sha256").update(pin, "utf8").digest("hex");
}
function asBool(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function asIsoDay(value) {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
	return todayISO();
}
function asIsoStamp(value) {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string" && value) return value;
	return (/* @__PURE__ */ new Date()).toISOString();
}
function grantStatus(status, taughtDate) {
	if (status === "granted") return "granted";
	if (weekMondayISO(taughtDate) < currentWeekMondayISO()) return "overdue";
	return status === "overdue" ? "overdue" : "pending";
}
var seedChain = null;
async function ensureSeeded(sql) {
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
async function seedSettings(sql) {
	await sql`insert into settings (key, value) values ('gm_pin_hash', ${hashPin(SEED_PINS.gm)}) on conflict (key) do nothing`;
	await sql`insert into settings (key, value) values ('grantor_pin_hash', ${hashPin(SEED_PINS.grantor)}) on conflict (key) do nothing`;
}
async function seedInstitutions(sql) {
	if (((await sql`select count(*)::int as n from institutions`)[0]?.n ?? 0) > 0) return;
	const rows = [
		{
			id: "inst-winterhold",
			name: "College of Winterhold",
			pin: SEED_PINS.winterhold,
			weekly: 2,
			perSchool: 1,
			antagonist: false,
			min: 1
		},
		{
			id: "inst-synod",
			name: "Synod",
			pin: SEED_PINS.synod,
			weekly: 1,
			perSchool: 0,
			antagonist: false,
			min: 1
		},
		{
			id: "inst-thalmor",
			name: "Thalmor",
			pin: SEED_PINS.thalmor,
			weekly: 1,
			perSchool: 0,
			antagonist: true,
			min: 1
		},
		{
			id: "inst-vigil",
			name: "Vigil",
			pin: SEED_PINS.vigil,
			weekly: 1,
			perSchool: 0,
			antagonist: false,
			min: 2
		},
		{
			id: "inst-other",
			name: "Other",
			pin: SEED_PINS.other,
			weekly: 1,
			perSchool: 0,
			antagonist: false,
			min: 1
		}
	];
	for (const row of rows) {
		await sql`insert into institutions (id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min)
      values (${row.id}, ${row.name}, ${hashPin(row.pin)}, ${row.weekly}, ${row.perSchool}, ${row.antagonist}, ${row.min})
      on conflict (id) do nothing`;
		const subjects = DEFAULT_SUBJECTS_BY_INSTITUTION[row.name] ?? [];
		for (const school of subjects) await sql`insert into institution_subjects (institution_id, school) values (${row.id}, ${school}) on conflict do nothing`;
	}
}
async function seedCatalog(sql) {
	if (((await sql`select count(*)::int as n from catalog_spells`)[0]?.n ?? 0) === 0) for (const spell of DEFAULT_SPELLS) await sql`insert into catalog_spells (id, name, school, tier, form_id, hidden)
        values (${spell.id}, ${spell.name}, ${spell.school}, ${spell.tier}, ${spell.formId}, ${spell.hidden})
        on conflict (id) do nothing`;
	if (((await sql`select count(*)::int as n from catalog_perks`)[0]?.n ?? 0) === 0) for (const perk of DEFAULT_PERKS) await sql`insert into catalog_perks (id, school, rank, form_id, unlock, prohibited)
        values (${perk.id}, ${perk.school}, ${perk.rank}, ${perk.formId}, ${perk.unlock}, ${perk.prohibited})
        on conflict (id) do nothing`;
	if (((await sql`select count(*)::int as n from catalog_tiers`)[0]?.n ?? 0) === 0) for (const level of DEFAULT_TIERS) await sql`insert into catalog_tiers (level) values (${level}) on conflict do nothing`;
}
async function seedDemo(sql) {
	if (((await sql`select count(*)::int as n from students`)[0]?.n ?? 0) > 0) return;
	const winterhold = "inst-winterhold";
	const synod = "inst-synod";
	const thalmor = "inst-thalmor";
	const vigil = "inst-vigil";
	async function addStudent(row) {
		await sql`insert into students (id, institution_id, name, form_id, status, notes, last_lesson_date, last_institution_id, last_subject, specialization_school, created_at)
      values (${row.id}, ${row.home}, ${row.name}, ${row.formId}, ${row.status ?? "active"}, ${row.notes ?? ""}, ${row.lastDate ?? null}, ${row.lastInst ?? null}, ${row.lastSubject ?? ""}, ${row.spec ?? ""}, ${row.created ?? "2026-08-01T12:00:00Z"})`;
		for (const inst of row.access) await sql`insert into student_access (student_id, institution_id, display_name, enrolled_at) values (${row.id}, ${inst}, ${row.name}, ${row.created ?? "2026-08-01T12:00:00Z"}) on conflict do nothing`;
	}
	async function addTier(studentId, inst, school, level, learnable = level) {
		await sql`insert into student_tiers (student_id, institution_id, school, level) values (${studentId}, ${inst}, ${school}, ${level}) on conflict do nothing`;
		await sql`insert into student_progress (student_id, institution_id, school, learnable_tier) values (${studentId}, ${inst}, ${school}, ${learnable}) on conflict do nothing`;
	}
	async function addSpell(row) {
		await sql`insert into learned_spells (id, student_id, lesson_id, catalog_id, name, school, tier, form_id, institution_id, status, taught_date, granted_date)
      values (${row.id}, ${row.studentId}, ${row.lessonId}, ${row.catalogId}, ${row.name}, ${row.school}, ${row.tier}, ${row.formId}, ${row.inst}, ${row.status}, ${row.taught}, ${row.granted ?? null})`;
	}
	async function addLesson(id, studentId, date, inst, subject, teacher) {
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
		access: [winterhold]
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
		granted: "2026-07-21"
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
		granted: "2026-08-05"
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
		granted: "2026-08-05"
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
		granted: "2026-08-19"
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
		taught: "2026-08-29"
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
		access: [synod]
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
		taught: "2026-09-01"
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
		access: [winterhold, synod]
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
		granted: "2026-08-17"
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
		granted: "2026-09-01"
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
		access: [thalmor]
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
		taught: "2026-09-01"
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
		access: [winterhold]
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
		granted: "2026-07-09"
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
		granted: "2026-08-26"
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
		access: [vigil]
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
		granted: "2026-08-13"
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
		taught: "2026-08-27"
	});
	await addTier("stu-sera", vigil, "Vigil", 1, 1);
}
async function backfillPlayerIds(sql) {
	const known = {
		"stu-selvas": "0x01000A01",
		"stu-mira": "0x01000A02",
		"stu-ilen": "0x01000A03",
		"stu-ryn": "0x01000A04",
		"stu-kael": "0x01000A05",
		"stu-sera": "0x01000A06"
	};
	const rows = await sql`select id, name, form_id from students`;
	for (const row of rows) if (!row.form_id) await sql`update students set form_id = ${known[row.id] ?? `0x${row.id.replace(/[^a-f0-9]/gi, "").slice(0, 8).padEnd(8, "0")}`} where id = ${row.id} and form_id = ${""}`;
	await sql`update student_access as a set display_name = s.name from students s where a.student_id = s.id and a.display_name = ${""}`;
}
async function resolveSession(pin) {
	if (!/^\d{6}$/.test(pin)) return null;
	const sql = await getSql();
	await ensureSeeded(sql);
	const hash = hashPin(pin);
	const settings = await sql`select key, value from settings where key in ('gm_pin_hash', 'grantor_pin_hash')`;
	const gm = settings.find((s) => s.key === "gm_pin_hash")?.value;
	const grantor = settings.find((s) => s.key === "grantor_pin_hash")?.value;
	if (gm && hash === gm) return {
		role: "gm",
		pin
	};
	if (grantor && hash === grantor) return {
		role: "grantor",
		pin
	};
	const inst = (await sql`select id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min from institutions where pin_hash = ${hash} limit 1`)[0];
	if (!inst) return null;
	return {
		role: "teacher",
		pin,
		institutionId: inst.id,
		institutionName: inst.name
	};
}
async function unlock(pin) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (session.role === "teacher") return {
		ok: true,
		role: "teacher",
		institutionId: session.institutionId,
		institutionName: session.institutionName
	};
	return {
		ok: true,
		role: session.role
	};
}
async function loadInstitutions(sql) {
	const instRows = await sql`select id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min from institutions order by name`;
	const subjectRows = await sql`select institution_id, school from institution_subjects`;
	const byInst = /* @__PURE__ */ new Map();
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
		advancementMin: Number(row.advancement_min)
	}));
}
function visibleSchools(inst, role) {
	if (role === "gm" || role === "grantor") return null;
	if (!inst) return /* @__PURE__ */ new Set();
	const set = new Set(inst.subjects);
	if (!inst.isAntagonist) {
		for (const school of [...set]) if (isNecromancy(school)) set.delete(school);
	}
	return set;
}
async function loadRoster(pin) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	const sql = await getSql();
	const institutions = await loadInstitutions(sql);
	const instById = new Map(institutions.map((i) => [i.id, i]));
	const actorInst = session.role === "teacher" ? instById.get(session.institutionId) ?? null : null;
	const schools = visibleSchools(actorInst, session.role);
	const isGm = session.role === "gm";
	const isCollege = actorInst ? isCollegeInstitution(actorInst.name) : false;
	const [studentRows, accessRows, lessonRows, spellRows, tierRows, progressRows, perkRows, catalogSpellRows, catalogPerkRows, tierLevels] = await Promise.all([
		sql`select id, institution_id, name, form_id, status, is_antagonist, notes, last_lesson_date, last_institution_id, last_subject, specialization_school, created_at from students order by name`,
		sql`select student_id, institution_id, display_name, enrolled_at from student_access`,
		sql`select id, student_id, date, institution_id, subject, teacher_name, notes from lessons order by date desc`,
		sql`select id, student_id, lesson_id, catalog_id, name, school, tier, form_id, institution_id, status, taught_date, granted_date from learned_spells order by taught_date desc`,
		sql`select student_id, institution_id, school, level from student_tiers`,
		sql`select student_id, institution_id, school, learnable_tier from student_progress`,
		sql`select id, student_id, catalog_id, school, rank, form_id, granted_date from granted_perks`,
		sql`select id, name, school, tier, form_id, hidden from catalog_spells order by school, tier, name`,
		sql`select id, school, rank, form_id, unlock, prohibited from catalog_perks order by school, rank`,
		sql`select level from catalog_tiers order by level`
	]);
	const accessByStudent = /* @__PURE__ */ new Map();
	const localName = /* @__PURE__ */ new Map();
	const enrolledAt = /* @__PURE__ */ new Map();
	for (const row of accessRows) {
		const list = accessByStudent.get(row.student_id) ?? [];
		list.push(row.institution_id);
		accessByStudent.set(row.student_id, list);
		localName.set(`${row.student_id}:${row.institution_id}`, row.display_name);
		enrolledAt.set(`${row.student_id}:${row.institution_id}`, asIsoStamp(row.enrolled_at));
	}
	const catalogSpells = catalogSpellRows.filter((row) => {
		if (asBool(row.hidden) && !isGm) return false;
		if (schools && !schools.has(row.school)) return false;
		return true;
	}).map((row) => ({
		id: row.id,
		name: row.name,
		school: row.school,
		tier: Number(row.tier),
		formId: row.form_id,
		hidden: asBool(row.hidden)
	}));
	const catalogPerks = catalogPerkRows.map((row) => ({
		id: row.id,
		school: row.school,
		rank: row.rank,
		formId: row.form_id,
		unlock: row.unlock,
		prohibited: asBool(row.prohibited)
	}));
	const students = [];
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
		const spellVisible = (s) => {
			const taughtAt = instById.get(s.institution_id);
			const antagonist = asBool(taughtAt?.isAntagonist);
			if (isGm || session.role === "grantor") return true;
			if (schools && isNecromancy(s.school) && !actorInst?.isAntagonist) return false;
			if (s.institution_id === actorInst?.id) return true;
			if (isCollege && taughtAt && !antagonist) return true;
			return false;
		};
		const lessonVisible = (l) => {
			if (isGm) return true;
			return l.institution_id === actorInst?.id;
		};
		const tierScope = (t) => {
			if (isGm) return true;
			return t.institution_id === actorInst?.id;
		};
		const spells = spellsAll.filter(spellVisible).map((s) => {
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
				lessonId: s.lesson_id ?? ""
			};
		});
		const lessons = lessonsAll.filter(lessonVisible).map((l) => {
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
				tiersUnlocked: []
			};
		});
		const tiers = tiersAll.filter(tierScope).map((t) => ({
			school: t.school,
			level: Number(t.level),
			institutionId: t.institution_id
		}));
		const learnableTiers = progressAll.filter((p) => isGm || p.institution_id === actorInst?.id).map((p) => ({
			school: p.school,
			level: Number(p.learnable_tier),
			institutionId: p.institution_id
		}));
		const perks = (isGm ? perksAll : []).map((p) => ({
			id: p.id,
			catalogId: p.catalog_id,
			school: p.school,
			rank: p.rank,
			formId: p.form_id,
			grantedDate: asIsoDay(p.granted_date)
		}));
		let lastLessonDate = null;
		let lastInstitution = "";
		let lastSubject = "";
		if (isGm) {
			lastLessonDate = row.last_lesson_date ? asIsoDay(row.last_lesson_date) : null;
			lastInstitution = instById.get(row.last_institution_id ?? "")?.name ?? home?.name ?? "";
			lastSubject = row.last_subject ?? "";
		} else if (actorInst) {
			const latest = lessonsAll.filter((l) => l.institution_id === actorInst.id)[0];
			if (latest) {
				lastLessonDate = asIsoDay(latest.date);
				lastInstitution = actorInst.name;
				lastSubject = latest.subject;
			}
		}
		const usageAll = weekUsage(spellsAll.map((s) => ({
			taughtDate: asIsoDay(s.taught_date),
			institution: instById.get(s.institution_id)?.name ?? "",
			school: s.school,
			antagonist: asBool(instById.get(s.institution_id)?.isAntagonist)
		})), true);
		const usageLocal = weekUsage(spellsAll.map((s) => ({
			taughtDate: asIsoDay(s.taught_date),
			institution: instById.get(s.institution_id)?.name ?? "",
			school: s.school,
			antagonist: asBool(instById.get(s.institution_id)?.isAntagonist)
		})), false);
		const need = actorInst?.advancementMin ?? 1;
		const local = actorInst ? localName.get(`${row.id}:${actorInst.id}`) : "";
		const student = {
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
			isAntagonist: isGm ? asBool(row.is_antagonist) : void 0,
			institutionAntagonist: isGm ? asBool(home?.isAntagonist) : void 0,
			visibleInstitutionIds: isGm ? visibleIds : void 0,
			weeklyWarning: isGm ? weeklyWarningFor(spellsAll.map((s) => ({
				taughtDate: asIsoDay(s.taught_date),
				institution: instById.get(s.institution_id)?.name ?? "",
				school: s.school,
				antagonist: asBool(instById.get(s.institution_id)?.isAntagonist)
			})), true) : null,
			weekUsage: isGm ? usageAll : usageLocal,
			missingT2Perks: isGm ? missingT2PerkSchools({
				tiers: tiersAll.map((t) => ({
					school: t.school,
					level: Number(t.level)
				})),
				perks
			}) : [],
			advancement: advancementReady(spells.map((s) => ({
				school: s.school,
				tier: s.tier
			})), need, tiers),
			learnableTiers,
			specializationSchool: row.specialization_school
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
			institutions: isGm ? institutions : session.role === "grantor" ? institutions.map((i) => ({
				...i,
				isAntagonist: false
			})) : institutions.filter((i) => i.id === session.institutionId),
			catalogSpells,
			catalogPerks: isGm || session.role === "grantor" ? catalogPerks : [],
			tiers: (tierLevels.length ? tierLevels.map((t) => Number(t.level)) : [...DEFAULT_TIERS]).sort((a, b) => a - b)
		}
	};
}
function teacherOrGm(session) {
	return session.role === "gm" || session.role === "teacher";
}
function actingInstitutionId(session, requested) {
	if (session.role === "teacher") return session.institutionId;
	if (session.role === "gm") return requested || null;
	return null;
}
async function enrollStudent(pin, name, formId, institutionId) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (!teacherOrGm(session)) return {
		ok: false,
		error: "Not allowed"
	};
	const trimmed = name.trim().replace(/\s+/g, " ");
	const form = normalizeFormId(formId);
	if (!form) return {
		ok: false,
		error: "refID required"
	};
	if (!trimmed) return {
		ok: false,
		error: "Name required"
	};
	const instId = actingInstitutionId(session, institutionId);
	if (!instId) return {
		ok: false,
		error: "Institution required"
	};
	const sql = await getSql();
	const existing = (await sql`select id from students where lower(form_id) = ${form.toLowerCase()} limit 1`)[0];
	if (existing) {
		await sql`insert into student_access (student_id, institution_id, display_name, enrolled_at)
      values (${existing.id}, ${instId}, ${trimmed}, ${(/* @__PURE__ */ new Date()).toISOString()})
      on conflict (student_id, institution_id) do update set display_name = ${trimmed}`;
		return {
			ok: true,
			studentId: existing.id
		};
	}
	const id = randomUUID();
	await sql`insert into students (id, institution_id, name, form_id, status) values (${id}, ${instId}, ${trimmed}, ${form}, ${"active"})`;
	await sql`insert into student_access (student_id, institution_id, display_name, enrolled_at)
    values (${id}, ${instId}, ${trimmed}, ${(/* @__PURE__ */ new Date()).toISOString()})`;
	return {
		ok: true,
		studentId: id
	};
}
async function updateStudent(pin, input) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (!teacherOrGm(session)) return {
		ok: false,
		error: "Not allowed"
	};
	const sql = await getSql();
	const row = (await sql`select id, institution_id, name, form_id, status, is_antagonist, notes, last_lesson_date, last_institution_id, last_subject, specialization_school, created_at from students where id = ${input.studentId} limit 1`)[0];
	if (!row) return {
		ok: false,
		error: "Student not found"
	};
	if (session.role === "teacher") {
		if ((await sql`select student_id, institution_id, display_name, enrolled_at from student_access where student_id = ${row.id} and institution_id = ${session.institutionId}`).length === 0) return {
			ok: false,
			error: "Student not found"
		};
	}
	const status = input.status ?? parseStatus(row.status);
	const notes = input.notes ?? row.notes;
	const spec = input.specializationSchool ?? row.specialization_school;
	const nextName = input.name?.trim().replace(/\s+/g, " ");
	await sql`update students set status = ${status}, notes = ${notes}, specialization_school = ${spec} where id = ${row.id}`;
	if (nextName) {
		if (session.role === "gm") await sql`update students set name = ${nextName} where id = ${row.id}`;
		const instId = actingInstitutionId(session, session.role === "gm" ? row.institution_id : void 0);
		if (instId) await sql`insert into student_access (student_id, institution_id, display_name)
        values (${row.id}, ${instId}, ${nextName})
        on conflict (student_id, institution_id) do update set display_name = ${nextName}`;
	}
	return { ok: true };
}
async function logLesson(pin, input) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (!teacherOrGm(session)) return {
		ok: false,
		error: "Not allowed"
	};
	const instId = actingInstitutionId(session, input.institutionId);
	if (!instId) return {
		ok: false,
		error: "Institution required"
	};
	const sql = await getSql();
	const inst = (await loadInstitutions(sql)).find((i) => i.id === instId);
	if (!inst) return {
		ok: false,
		error: "Institution not found"
	};
	if (isNecromancy(input.subject) && !inst.isAntagonist && session.role !== "gm") return {
		ok: false,
		error: "Subject not taught here"
	};
	if (!inst.subjects.some((s) => s.toLowerCase() === input.subject.toLowerCase()) && session.role !== "gm") return {
		ok: false,
		error: "Subject not taught here"
	};
	const student = (await sql`select id, name from students where id = ${input.studentId} limit 1`)[0];
	if (!student) return {
		ok: false,
		error: "Student not found"
	};
	const spell = (await sql`select id, name, school, tier, form_id, hidden from catalog_spells where id = ${input.spellId} limit 1`)[0];
	if (!spell) return {
		ok: false,
		error: "Spell not found"
	};
	if (spell.school.toLowerCase() !== input.subject.toLowerCase()) return {
		ok: false,
		error: "Spell does not match subject"
	};
	if (((await sql`select count(*)::int as n from learned_spells where student_id = ${student.id} and lower(name) = ${spell.name.toLowerCase()} and lower(school) = ${spell.school.toLowerCase()}`)[0]?.n ?? 0) > 0) return {
		ok: false,
		error: "Spell already learned"
	};
	const progress = (await sql`select student_id, institution_id, school, learnable_tier from student_progress where student_id = ${student.id} and institution_id = ${instId} and lower(school) = ${spell.school.toLowerCase()} limit 1`)[0];
	const cap = progress ? Number(progress.learnable_tier) : 1;
	if (Number(spell.tier) > cap) return {
		ok: false,
		error: `${spell.school} is T${cap}`
	};
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
	if (!(await sql`select student_id, institution_id, school, level from student_tiers where student_id = ${student.id} and institution_id = ${instId} and lower(school) = ${spell.school.toLowerCase()} limit 1`)[0]) {
		await sql`insert into student_tiers (student_id, institution_id, school, level) values (${student.id}, ${instId}, ${spell.school}, ${1})`;
		await sql`insert into student_progress (student_id, institution_id, school, learnable_tier) values (${student.id}, ${instId}, ${spell.school}, ${1}) on conflict do nothing`;
	}
	const spec = input.specializationSchool?.trim();
	if (spec) await sql`update students set last_lesson_date = ${date}, last_institution_id = ${instId}, last_subject = ${input.subject}, specialization_school = ${spec} where id = ${student.id}`;
	else await sql`update students set last_lesson_date = ${date}, last_institution_id = ${instId}, last_subject = ${input.subject} where id = ${student.id}`;
	return { ok: true };
}
async function graduateStudent(pin, input) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (!teacherOrGm(session)) return {
		ok: false,
		error: "Not allowed"
	};
	const instId = actingInstitutionId(session, input.institutionId);
	if (!instId) return {
		ok: false,
		error: "Institution required"
	};
	const sql = await getSql();
	const inst = (await loadInstitutions(sql)).find((i) => i.id === instId);
	if (!inst) return {
		ok: false,
		error: "Institution not found"
	};
	const school = input.school.trim();
	if (!school) return {
		ok: false,
		error: "Subject required"
	};
	const tierRow = (await sql`select student_id, institution_id, school, level from student_tiers where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`)[0];
	const current = tierRow ? Number(tierRow.level) : 1;
	if (current >= ((await sql`select coalesce(max(level), 5)::int as level from catalog_tiers`)[0]?.level ?? 5)) return {
		ok: false,
		error: "Already at highest tier"
	};
	if (((await sql`select count(*)::int as n from learned_spells where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} and tier = ${current}`)[0]?.n ?? 0) < inst.advancementMin) return {
		ok: false,
		error: "Not enough spells at this tier"
	};
	const next = current + 1;
	if (tierRow) await sql`update student_tiers set level = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
	else await sql`insert into student_tiers (student_id, institution_id, school, level) values (${input.studentId}, ${instId}, ${school}, ${next})`;
	if ((await sql`select student_id, institution_id, school, learnable_tier from student_progress where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`)[0]) await sql`update student_progress set learnable_tier = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
	else await sql`insert into student_progress (student_id, institution_id, school, learnable_tier) values (${input.studentId}, ${instId}, ${school}, ${next})`;
	return { ok: true };
}
async function revertGraduation(pin, input) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (!teacherOrGm(session)) return {
		ok: false,
		error: "Not allowed"
	};
	const instId = actingInstitutionId(session, input.institutionId);
	if (!instId) return {
		ok: false,
		error: "Institution required"
	};
	const sql = await getSql();
	const school = input.school.trim();
	if (!school) return {
		ok: false,
		error: "Subject required"
	};
	const progress = (await sql`select student_id, institution_id, school, learnable_tier from student_progress where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`)[0];
	const tierRow = (await sql`select student_id, institution_id, school, level from student_tiers where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()} limit 1`)[0];
	const learnable = progress ? Number(progress.learnable_tier) : tierRow ? Number(tierRow.level) : 1;
	if (learnable <= 1) return {
		ok: false,
		error: "Already at T1"
	};
	const next = learnable - 1;
	if (progress) await sql`update student_progress set learnable_tier = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
	if (tierRow && Number(tierRow.level) > next) await sql`update student_tiers set level = ${next} where student_id = ${input.studentId} and institution_id = ${instId} and lower(school) = ${school.toLowerCase()}`;
	return { ok: true };
}
async function grantSpell(pin, spellRowId) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (session.role === "teacher") return {
		ok: false,
		error: "Not allowed"
	};
	const sql = await getSql();
	if (!(await sql`select id from learned_spells where id = ${spellRowId} limit 1`)[0]) return {
		ok: false,
		error: "Grant line not found"
	};
	await sql`update learned_spells set status = ${"granted"}, granted_date = ${todayISO()} where id = ${spellRowId}`;
	return { ok: true };
}
async function grantPerk(pin, studentId, perkId) {
	const session = await resolveSession(pin);
	if (!session) return {
		ok: false,
		error: "PIN not recognized"
	};
	if (session.role !== "gm") return {
		ok: false,
		error: "Not allowed"
	};
	const sql = await getSql();
	const perk = (await sql`select id, school, rank, form_id, unlock, prohibited from catalog_perks where id = ${perkId} limit 1`)[0];
	if (!perk) return {
		ok: false,
		error: "Perk not found"
	};
	if (asBool(perk.prohibited)) return {
		ok: false,
		error: "Perk is prohibited"
	};
	if (((await sql`select count(*)::int as n from granted_perks where student_id = ${studentId} and catalog_id = ${perk.id}`)[0]?.n ?? 0) > 0) return {
		ok: false,
		error: "Perk already granted"
	};
	await sql`insert into granted_perks (id, student_id, catalog_id, school, rank, form_id, granted_date)
    values (${randomUUID()}, ${studentId}, ${perk.id}, ${perk.school}, ${perk.rank}, ${perk.form_id}, ${todayISO()})`;
	return { ok: true };
}
async function saveInstitution(pin, input) {
	const session = await resolveSession(pin);
	if (!session || session.role !== "gm") return {
		ok: false,
		error: "Not allowed"
	};
	const name = input.name.trim();
	if (!name) return {
		ok: false,
		error: "Name required"
	};
	const sql = await getSql();
	const id = input.id || `inst-${randomUUID().slice(0, 8)}`;
	const existing = (await sql`select id, pin_hash from institutions where id = ${id} limit 1`)[0];
	let pinHash = existing?.pin_hash;
	if (input.newPin) {
		if (!/^\d{6}$/.test(input.newPin)) return {
			ok: false,
			error: "PIN must be 6 digits"
		};
		pinHash = hashPin(input.newPin);
	}
	if (!existing && !pinHash) return {
		ok: false,
		error: "PIN required for a new institution"
	};
	if (existing) {
		await sql`update institutions set name = ${name}, weekly_spell_limit = ${input.weeklySpellLimit}, per_school_limit = ${input.perSchoolLimit}, is_antagonist = ${input.isAntagonist}, advancement_min = ${input.advancementMin}, pin_hash = ${pinHash} where id = ${id}`;
		await sql`delete from institution_subjects where institution_id = ${id}`;
	} else await sql`insert into institutions (id, name, pin_hash, weekly_spell_limit, per_school_limit, is_antagonist, advancement_min)
      values (${id}, ${name}, ${pinHash}, ${input.weeklySpellLimit}, ${input.perSchoolLimit}, ${input.isAntagonist}, ${input.advancementMin})`;
	for (const school of input.subjects) {
		const s = school.trim();
		if (!s) continue;
		await sql`insert into institution_subjects (institution_id, school) values (${id}, ${s}) on conflict do nothing`;
	}
	return { ok: true };
}
async function saveMasterPin(pin, kind, nextPin) {
	const session = await resolveSession(pin);
	if (!session || session.role !== "gm") return {
		ok: false,
		error: "Not allowed"
	};
	if (!/^\d{6}$/.test(nextPin)) return {
		ok: false,
		error: "PIN must be 6 digits"
	};
	const sql = await getSql();
	const key = kind === "gm" ? "gm_pin_hash" : "grantor_pin_hash";
	const hashed = hashPin(nextPin);
	await sql`insert into settings (key, value) values (${key}, ${hashed}) on conflict (key) do update set value = ${hashed}`;
	return { ok: true };
}
async function saveSpell(pin, input) {
	const session = await resolveSession(pin);
	if (!session || session.role !== "gm") return {
		ok: false,
		error: "Not allowed"
	};
	const name = input.name.trim();
	const school = input.school.trim();
	if (!name || !school) return {
		ok: false,
		error: "Name and subject required"
	};
	await (await getSql())`insert into catalog_spells (id, name, school, tier, form_id, hidden)
    values (${input.id || `${school}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}, ${name}, ${school}, ${input.tier}, ${input.formId.trim()}, ${input.hidden})
    on conflict (id) do update set name = ${name}, school = ${school}, tier = ${input.tier}, form_id = ${input.formId.trim()}, hidden = ${input.hidden}`;
	return { ok: true };
}
async function savePerk(pin, input) {
	const session = await resolveSession(pin);
	if (!session || session.role !== "gm") return {
		ok: false,
		error: "Not allowed"
	};
	const school = input.school.trim();
	const rank = input.rank.trim();
	if (!school || !rank) return {
		ok: false,
		error: "School and rank required"
	};
	await (await getSql())`insert into catalog_perks (id, school, rank, form_id, unlock, prohibited)
    values (${input.id || `${school}-${rank}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}, ${school}, ${rank}, ${input.formId.trim()}, ${input.unlock.trim()}, ${input.prohibited})
    on conflict (id) do update set school = ${school}, rank = ${rank}, form_id = ${input.formId.trim()}, unlock = ${input.unlock.trim()}, prohibited = ${input.prohibited}`;
	return { ok: true };
}
async function saveTiers(pin, levels) {
	const session = await resolveSession(pin);
	if (!session || session.role !== "gm") return {
		ok: false,
		error: "Not allowed"
	};
	const unique = [...new Set(levels.filter((n) => Number.isInteger(n) && n > 0))].sort((a, b) => a - b);
	if (unique.length === 0) return {
		ok: false,
		error: "At least one tier required"
	};
	const sql = await getSql();
	await sql`delete from catalog_tiers`;
	for (const level of unique) await sql`insert into catalog_tiers (level) values (${level})`;
	return { ok: true };
}
//#endregion
export { enrollStudent, graduateStudent, grantPerk, grantSpell, loadRoster, logLesson, revertGraduation, saveInstitution, saveMasterPin, savePerk, saveSpell, saveTiers, unlock, updateStudent };

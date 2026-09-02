//#region node_modules/.nitro/vite/services/ssr/assets/ledger-cJ4uPQbl.js
var APP_NAME = "Sovngarde Collegium";
var APP_ORG = "Keizaal Online";
var APP_TITLE = `${APP_NAME}, ${APP_ORG}`;
var NAME_PLACEHOLDER = "Velos Garinson";
var FORM_ID_PLACEHOLDER = "1A3F";
var COLLEGE_NAME = "College of Winterhold";
var ENROLLED_FILTERS = [
	{
		value: "7d",
		label: "Enrolled ≤ 7 days"
	},
	{
		value: "30d",
		label: "Enrolled ≤ 30 days"
	},
	{
		value: "90d",
		label: "Enrolled ≤ 90 days"
	},
	{
		value: "older",
		label: "Enrolled > 90 days"
	}
];
var ROSTER_SORTS = [
	"name",
	"enrolled",
	"lesson",
	"status",
	"subject"
];
var SORT_LABEL = {
	name: "Name",
	enrolled: "Time enrolled",
	lesson: "Last lesson",
	status: "Status",
	subject: "Subject"
};
var STUDENT_STATUSES = [
	"active",
	"expelled",
	"suspended",
	"dead",
	"graduated"
];
var STATUS_LABEL = {
	active: "Active",
	expelled: "Expelled",
	suspended: "Suspended",
	dead: "Dead",
	graduated: "Graduated"
};
var STATUS_BADGE = {
	active: "neutral",
	expelled: "warn",
	suspended: "warn",
	dead: "necro",
	graduated: "resto"
};
function schoolTone(school) {
	switch (school.trim().toLowerCase()) {
		case "pyromancy":
		case "destruction": return "pyro";
		case "restoration": return "resto";
		case "necromancy":
		case "conjuration": return "necro";
		case "cryomancy":
		case "aeromancy": return "cryo";
		case "vigil": return "vigil";
		default: return "neutral";
	}
}
function standingTiers(student) {
	const map = /* @__PURE__ */ new Map();
	for (const tier of student.tiers) {
		const key = tier.school.toLowerCase();
		const prev = map.get(key);
		if (!prev || tier.level > prev.level) map.set(key, tier);
	}
	return [...map.values()].sort((a, b) => b.level - a.level || a.school.localeCompare(b.school));
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}
function formatShortDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	if (y !== (/* @__PURE__ */ new Date()).getFullYear()) return `${m}/${d}/${String(y).slice(2)}`;
	return `${m}/${d}`;
}
function pendingCount(student) {
	return student.spells.filter((s) => s.status === "pending" || s.status === "overdue").length;
}
function overdueGrantCount(student) {
	return student.spells.filter((s) => s.status === "overdue").length;
}
function parseStatus(value) {
	const v = (value ?? "active").toLowerCase();
	return STUDENT_STATUSES.includes(v) ? v : "active";
}
function daysEnrolled(student) {
	const [y, m, d] = (student.enrolledAt ?? student.createdAt).slice(0, 10).split("-").map(Number);
	if (!y || !m || !d) return 0;
	const then = Date.UTC(y, m - 1, d);
	const [ty, tm, td] = todayISO().split("-").map(Number);
	if (!ty || !tm || !td) return 0;
	const now = Date.UTC(ty, tm - 1, td);
	return Math.max(0, Math.round((now - then) / 864e5));
}
function todayISO() {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return `${parts.find((p) => p.type === "year")?.value ?? "2026"}-${parts.find((p) => p.type === "month")?.value ?? "01"}-${parts.find((p) => p.type === "day")?.value ?? "01"}`;
}
function weekMondayISO(iso) {
	const [ys, ms, ds] = iso.split("-").map(Number);
	if (!ys || !ms || !ds) return iso;
	const date = new Date(Date.UTC(ys, ms - 1, ds, 12));
	const daysFromMonday = (date.getUTCDay() + 6) % 7;
	date.setUTCDate(date.getUTCDate() - daysFromMonday);
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function currentWeekMondayISO() {
	return weekMondayISO(todayISO());
}
function isCollegeInstitution(name) {
	return name.trim().toLowerCase() === COLLEGE_NAME.toLowerCase();
}
function isNecromancy(school) {
	return school.trim().toLowerCase() === "necromancy";
}
function normalizeFormId(raw) {
	return raw.trim().replace(/\s+/g, "");
}
function uniqueSorted(values) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
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
function usageForWeek(spells, weekMonday, includeAntagonist = true) {
	const thisWeek = spells.filter((s) => weekMondayISO(s.taughtDate) === weekMonday);
	const antagonist = thisWeek.filter((s) => s.antagonist).length;
	const counted = includeAntagonist ? thisWeek : thisWeek.filter((s) => !s.antagonist);
	const college = counted.filter((s) => isCollegeInstitution(s.institution));
	const nonCollege = counted.filter((s) => !isCollegeInstitution(s.institution));
	const schoolCounts = /* @__PURE__ */ new Map();
	for (const spell of college) {
		const key = spell.school.toLowerCase();
		schoolCounts.set(key, (schoolCounts.get(key) ?? 0) + 1);
	}
	const dupSchool = [...schoolCounts.values()].some((n) => n > 1);
	const remainingCollege = Math.max(0, 2 - college.length - nonCollege.length);
	const remainingNonCollege = nonCollege.length >= 1 ? 0 : remainingCollege > 0 ? 1 : 0;
	let overLimit = false;
	let reason = null;
	if (nonCollege.length > 1) {
		overLimit = true;
		reason = `${nonCollege.length} non-college spells this week (limit 1)`;
	} else if (college.length + nonCollege.length > 2) {
		overLimit = true;
		reason = `${college.length + nonCollege.length} spells this week (cap 2)`;
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
		includeAntagonist
	};
}
function weekUsage(spells, includeAntagonist = true) {
	return usageForWeek(spells, currentWeekMondayISO(), includeAntagonist);
}
function weeklyWarningFor(spells, includeAntagonist = true) {
	const week = currentWeekMondayISO();
	const usage = usageForWeek(spells, week, includeAntagonist);
	if (!usage.overLimit) return null;
	if (usage.reason?.includes("same subject")) return {
		week,
		count: usage.college,
		max: 1,
		reason: "school"
	};
	if (usage.reason?.includes("non-college")) return {
		week,
		count: usage.nonCollege,
		max: 1,
		reason: "global"
	};
	return {
		week,
		count: usage.total,
		max: 2,
		reason: "count"
	};
}
function perkSchoolFor(subject) {
	const s = subject.trim().toLowerCase();
	if (s === "pyromancy" || s === "cryomancy" || s === "aeromancy" || s === "destruction") return "Destruction";
	if (s === "restoration" || s === "vigil") return "Restoration";
	if (s === "alteration") return "Alteration";
	if (s === "illusion") return "Illusion";
	if (s === "conjuration" || s === "necromancy") return "Conjuration";
	return null;
}
function missingT2PerkSchools(student) {
	const needed = /* @__PURE__ */ new Set();
	for (const tier of student.tiers) {
		if (tier.level < 2) continue;
		const school = perkSchoolFor(tier.school);
		if (school) needed.add(school);
	}
	return [...needed].filter((school) => !student.perks.some((perk) => perk.school.toLowerCase() === school.toLowerCase() && (perk.rank === "Adept" || perk.rank === "Expert")));
}
function advancementReady(spells, need, displayed = [], maxTier = 5) {
	const min = Math.max(1, need);
	const spellTiers = /* @__PURE__ */ new Map();
	for (const spell of spells) {
		const school = spell.school.trim();
		if (!school) continue;
		const list = spellTiers.get(school) ?? [];
		list.push(spell.tier);
		spellTiers.set(school, list);
	}
	const rows = displayed.length > 0 ? displayed : [...spellTiers.entries()].map(([school, tiers]) => ({
		school,
		level: Math.max(...tiers)
	}));
	const cues = [];
	for (const row of rows) {
		const school = row.school.trim();
		if (!school) continue;
		const currentTier = Math.max(1, row.level);
		if (currentTier >= maxTier) continue;
		const have = (spellTiers.get(school) ?? []).filter((t) => t === currentTier).length;
		if (have >= min) cues.push({
			school,
			currentTier,
			nextTier: currentTier + 1,
			have,
			need: min
		});
	}
	return cues;
}
function learnableLevel(student, school) {
	const key = school.trim().toLowerCase();
	const progress = student.learnableTiers?.find((t) => t.school.toLowerCase() === key);
	if (progress) return Math.max(1, progress.level);
	const tier = student.tiers.find((t) => t.school.toLowerCase() === key);
	return Math.max(1, tier?.level ?? 1);
}
function alreadyKnowsSpell(student, spell) {
	return student.spells.some((s) => s.name.toLowerCase() === spell.name.toLowerCase() && s.school.toLowerCase() === spell.school.toLowerCase());
}
function canLearnSpell(student, spell, _atCollege) {
	if (alreadyKnowsSpell(student, spell)) return false;
	return spell.tier <= learnableLevel(student, spell.school);
}
function parseRosterQuery(raw) {
	const tokens = raw.match(/[^\s]+/g) ?? [];
	const kept = [];
	const q = {
		text: "",
		subject: "",
		status: "",
		enrolled: "",
		sort: "",
		grant: "",
		week: ""
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
		else if (k === "sort" && ROSTER_SORTS.includes(value)) q.sort = value;
		else if (k === "grant") q.grant = value;
		else if (k === "week") q.week = value;
		else kept.push(token);
	}
	q.text = kept.join(" ");
	return q;
}
function setQueryText(query, text) {
	const parsed = parseRosterQuery(query);
	const modifiers = [];
	if (parsed.subject) modifiers.push(`subject:${parsed.subject}`);
	if (parsed.status) modifiers.push(`status:${parsed.status}`);
	if (parsed.enrolled) modifiers.push(`enrolled:${parsed.enrolled}`);
	if (parsed.sort) modifiers.push(`sort:${parsed.sort}`);
	if (parsed.grant) modifiers.push(`grant:${parsed.grant}`);
	if (parsed.week) modifiers.push(`week:${parsed.week}`);
	return [text.trim(), ...modifiers].filter(Boolean).join(" ");
}
function setQueryToken(query, key, value) {
	const parsed = parseRosterQuery(query);
	parsed[key] = value;
	const modifiers = [];
	if (parsed.subject) modifiers.push(`subject:${parsed.subject}`);
	if (parsed.status) modifiers.push(`status:${parsed.status}`);
	if (parsed.enrolled) modifiers.push(`enrolled:${parsed.enrolled}`);
	if (parsed.sort) modifiers.push(`sort:${parsed.sort}`);
	if (parsed.grant) modifiers.push(`grant:${parsed.grant}`);
	if (parsed.week) modifiers.push(`week:${parsed.week}`);
	return [parsed.text, ...modifiers].filter(Boolean).join(" ");
}
function studentMatchesQuery(student, q, gm) {
	if (q.text) {
		if (!`${student.name} ${student.formId}`.toLowerCase().includes(q.text.toLowerCase())) return false;
	}
	if (q.subject) {
		const key = q.subject.toLowerCase();
		if (!(student.lastSubject.toLowerCase() === key || student.tiers.some((t) => t.school.toLowerCase() === key) || student.spells.some((s) => s.school.toLowerCase() === key) || (student.specializationSchool ?? "").toLowerCase() === key)) return false;
	}
	if (q.status) {
		if (STATUS_LABEL[student.status].toLowerCase() !== q.status.toLowerCase() && student.status !== q.status.toLowerCase()) return false;
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
function sortRoster(students, sort, canGrant) {
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
function usageLabel(usage) {
	if (usage.overLimit && usage.reason) return usage.reason;
	return `${usage.total} counted this week`;
}
function institutionUsageLabel(usage, college) {
	if (college) return `${usage.college + usage.nonCollege} this week · ${usage.remainingCollege} remaining`;
	return `${usage.nonCollege} this week · ${usage.remainingNonCollege} remaining`;
}
//#endregion
export { studentMatchesQuery as A, parseRosterQuery as C, setQueryToken as D, setQueryText as E, weekUsage as F, weeklyWarningFor as I, uniqueSorted as M, usageLabel as N, sortRoster as O, weekMondayISO as P, overdueGrantCount as S, schoolTone as T, institutionUsageLabel as _, FORM_ID_PLACEHOLDER as a, missingT2PerkSchools as b, STATUS_BADGE as c, advancementReady as d, alreadyKnowsSpell as f, initials as g, formatShortDate as h, ENROLLED_FILTERS as i, todayISO as j, standingTiers as k, STATUS_LABEL as l, currentWeekMondayISO as m, APP_ORG as n, NAME_PLACEHOLDER as o, canLearnSpell as p, APP_TITLE as r, SORT_LABEL as s, APP_NAME as t, STUDENT_STATUSES as u, isCollegeInstitution as v, parseStatus as w, normalizeFormId as x, isNecromancy as y };

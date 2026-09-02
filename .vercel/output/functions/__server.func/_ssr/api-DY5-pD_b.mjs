import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DY5-pD_b.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var pinSchema = object({ pin: string().regex(/^\d{6}$/) });
var unlockWithPin_createServerFn_handler = createServerRpc({
	id: "7540b6f2bccb7d4469b2651078fb68b639124f57e1e2ea1c75ec2b4111ed2f6b",
	name: "unlockWithPin",
	filename: "src/lib/api.ts"
}, (opts) => unlockWithPin.__executeServer(opts));
var unlockWithPin = createServerFn({ method: "POST" }).validator((d) => pinSchema.parse(d)).handler(unlockWithPin_createServerFn_handler, async ({ data }) => {
	const { unlock } = await import("./ledger.server-DDaEE-ob.mjs");
	return unlock(data.pin);
});
var loadRosterFn_createServerFn_handler = createServerRpc({
	id: "c3fb9227e171ba64b21ae264bcdf224301fdefc670e9404a002dbe436398f7fc",
	name: "loadRosterFn",
	filename: "src/lib/api.ts"
}, (opts) => loadRosterFn.__executeServer(opts));
var loadRosterFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.parse(d)).handler(loadRosterFn_createServerFn_handler, async ({ data }) => {
	const { loadRoster } = await import("./ledger.server-DDaEE-ob.mjs");
	return loadRoster(data.pin);
});
var enrollStudentFn_createServerFn_handler = createServerRpc({
	id: "d16484a5156162a2d316eeb54d848bb86dea64ffff7046513c80c92957b682df",
	name: "enrollStudentFn",
	filename: "src/lib/api.ts"
}, (opts) => enrollStudentFn.__executeServer(opts));
var enrollStudentFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	name: string().min(1),
	formId: string().min(1),
	institutionId: string().optional()
}).parse(d)).handler(enrollStudentFn_createServerFn_handler, async ({ data }) => {
	const { enrollStudent } = await import("./ledger.server-DDaEE-ob.mjs");
	return enrollStudent(data.pin, data.name, data.formId, data.institutionId);
});
var updateStudentFn_createServerFn_handler = createServerRpc({
	id: "6839b310ccdb5e58149bc1a4df6070b304fe16c35880ab851afaabef9f8e52bf",
	name: "updateStudentFn",
	filename: "src/lib/api.ts"
}, (opts) => updateStudentFn.__executeServer(opts));
var updateStudentFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	status: _enum([
		"active",
		"expelled",
		"suspended",
		"dead",
		"graduated"
	]).optional(),
	notes: string().optional(),
	specializationSchool: string().optional(),
	name: string().optional()
}).parse(d)).handler(updateStudentFn_createServerFn_handler, async ({ data }) => {
	const { updateStudent } = await import("./ledger.server-DDaEE-ob.mjs");
	return updateStudent(data.pin, data);
});
var logLessonFn_createServerFn_handler = createServerRpc({
	id: "63afb81ede8ea14fa2745fd55c153aa47278f50611d8f6a7bb1a7a470df7ca18",
	name: "logLessonFn",
	filename: "src/lib/api.ts"
}, (opts) => logLessonFn.__executeServer(opts));
var logLessonFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	institutionId: string().optional(),
	date: string(),
	teacherName: string(),
	subject: string(),
	spellId: string(),
	notes: string().optional(),
	specializationSchool: string().optional()
}).parse(d)).handler(logLessonFn_createServerFn_handler, async ({ data }) => {
	const { logLesson } = await import("./ledger.server-DDaEE-ob.mjs");
	return logLesson(data.pin, data);
});
var graduateStudentFn_createServerFn_handler = createServerRpc({
	id: "6c08b2f159a81511afd650df70d10406468a85285b5151328390bfc03b99487d",
	name: "graduateStudentFn",
	filename: "src/lib/api.ts"
}, (opts) => graduateStudentFn.__executeServer(opts));
var graduateStudentFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	school: string(),
	institutionId: string().optional()
}).parse(d)).handler(graduateStudentFn_createServerFn_handler, async ({ data }) => {
	const { graduateStudent } = await import("./ledger.server-DDaEE-ob.mjs");
	return graduateStudent(data.pin, data);
});
var revertGraduationFn_createServerFn_handler = createServerRpc({
	id: "68b316b748ac912c8a12c019331762830cd14999810163d957aabb894e5e5b67",
	name: "revertGraduationFn",
	filename: "src/lib/api.ts"
}, (opts) => revertGraduationFn.__executeServer(opts));
var revertGraduationFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	school: string(),
	institutionId: string().optional()
}).parse(d)).handler(revertGraduationFn_createServerFn_handler, async ({ data }) => {
	const { revertGraduation } = await import("./ledger.server-DDaEE-ob.mjs");
	return revertGraduation(data.pin, data);
});
var grantSpellFn_createServerFn_handler = createServerRpc({
	id: "f0c6c80e7a8d2dac2baf31cdefcab915b5b9a237db897113a63a42c44540f9d6",
	name: "grantSpellFn",
	filename: "src/lib/api.ts"
}, (opts) => grantSpellFn.__executeServer(opts));
var grantSpellFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({ spellRowId: string() }).parse(d)).handler(grantSpellFn_createServerFn_handler, async ({ data }) => {
	const { grantSpell } = await import("./ledger.server-DDaEE-ob.mjs");
	return grantSpell(data.pin, data.spellRowId);
});
var grantPerkFn_createServerFn_handler = createServerRpc({
	id: "97db0902be3e7a2c397568d935a29c655f5ce9b277d9356e74842442127f66b8",
	name: "grantPerkFn",
	filename: "src/lib/api.ts"
}, (opts) => grantPerkFn.__executeServer(opts));
var grantPerkFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	perkId: string()
}).parse(d)).handler(grantPerkFn_createServerFn_handler, async ({ data }) => {
	const { grantPerk } = await import("./ledger.server-DDaEE-ob.mjs");
	return grantPerk(data.pin, data.studentId, data.perkId);
});
var saveInstitutionFn_createServerFn_handler = createServerRpc({
	id: "b7bb2f838efdb16995c2f7749b5860c0e484ee16fa7d9c5da6636e00f146db30",
	name: "saveInstitutionFn",
	filename: "src/lib/api.ts"
}, (opts) => saveInstitutionFn.__executeServer(opts));
var saveInstitutionFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	id: string().optional(),
	name: string(),
	weeklySpellLimit: number(),
	perSchoolLimit: number(),
	isAntagonist: boolean(),
	advancementMin: number(),
	subjects: array(string()),
	newPin: string().optional()
}).parse(d)).handler(saveInstitutionFn_createServerFn_handler, async ({ data }) => {
	const { saveInstitution } = await import("./ledger.server-DDaEE-ob.mjs");
	return saveInstitution(data.pin, data);
});
var saveMasterPinFn_createServerFn_handler = createServerRpc({
	id: "eabc0223f264d9610cd4dc250a5d7f3f4ddb81b8d24de5dfb7e87510af5d41d3",
	name: "saveMasterPinFn",
	filename: "src/lib/api.ts"
}, (opts) => saveMasterPinFn.__executeServer(opts));
var saveMasterPinFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	kind: _enum(["gm", "grantor"]),
	nextPin: string()
}).parse(d)).handler(saveMasterPinFn_createServerFn_handler, async ({ data }) => {
	const { saveMasterPin } = await import("./ledger.server-DDaEE-ob.mjs");
	return saveMasterPin(data.pin, data.kind, data.nextPin);
});
var saveSpellFn_createServerFn_handler = createServerRpc({
	id: "0ae21a327e38144780deec767064fae9d280095dc390b2e804f8ed71d535ea44",
	name: "saveSpellFn",
	filename: "src/lib/api.ts"
}, (opts) => saveSpellFn.__executeServer(opts));
var saveSpellFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	id: string().optional(),
	name: string(),
	school: string(),
	tier: number(),
	formId: string(),
	hidden: boolean()
}).parse(d)).handler(saveSpellFn_createServerFn_handler, async ({ data }) => {
	const { saveSpell } = await import("./ledger.server-DDaEE-ob.mjs");
	return saveSpell(data.pin, data);
});
var savePerkFn_createServerFn_handler = createServerRpc({
	id: "3e8310824f96140d921762f75ffb52b48c92eb76b46c3c3f8f6c71351bb2c438",
	name: "savePerkFn",
	filename: "src/lib/api.ts"
}, (opts) => savePerkFn.__executeServer(opts));
var savePerkFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	id: string().optional(),
	school: string(),
	rank: string(),
	formId: string(),
	unlock: string(),
	prohibited: boolean()
}).parse(d)).handler(savePerkFn_createServerFn_handler, async ({ data }) => {
	const { savePerk } = await import("./ledger.server-DDaEE-ob.mjs");
	return savePerk(data.pin, data);
});
var saveTiersFn_createServerFn_handler = createServerRpc({
	id: "23ccf35c16844540f0fbd181500c85ef45fd6bc6a112232245bb08575c38a4b5",
	name: "saveTiersFn",
	filename: "src/lib/api.ts"
}, (opts) => saveTiersFn.__executeServer(opts));
var saveTiersFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({ levels: array(number()) }).parse(d)).handler(saveTiersFn_createServerFn_handler, async ({ data }) => {
	const { saveTiers } = await import("./ledger.server-DDaEE-ob.mjs");
	return saveTiers(data.pin, data.levels);
});
//#endregion
export { enrollStudentFn_createServerFn_handler, graduateStudentFn_createServerFn_handler, grantPerkFn_createServerFn_handler, grantSpellFn_createServerFn_handler, loadRosterFn_createServerFn_handler, logLessonFn_createServerFn_handler, revertGraduationFn_createServerFn_handler, saveInstitutionFn_createServerFn_handler, saveMasterPinFn_createServerFn_handler, savePerkFn_createServerFn_handler, saveSpellFn_createServerFn_handler, saveTiersFn_createServerFn_handler, unlockWithPin_createServerFn_handler, updateStudentFn_createServerFn_handler };

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const pinSchema = z.object({ pin: z.string().regex(/^\d{6}$/) });

export const unlockWithPin = createServerFn({ method: "POST" })
  .validator((d) => pinSchema.parse(d))
  .handler(async ({ data }) => {
    const { unlock } = await import("@/lib/ledger.server");
    return unlock(data.pin);
  });

export const loadRosterFn = createServerFn({ method: "POST" })
  .validator((d) => pinSchema.parse(d))
  .handler(async ({ data }) => {
    const { loadRoster } = await import("@/lib/ledger.server");
    return loadRoster(data.pin);
  });

export const enrollStudentFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        name: z.string().min(1),
        formId: z.string().min(1),
        institutionId: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { enrollStudent } = await import("@/lib/ledger.server");
    return enrollStudent(data.pin, data.name, data.formId, data.institutionId);
  });

export const updateStudentFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        studentId: z.string(),
        status: z.enum(["active", "expelled", "suspended", "dead", "graduated"]).optional(),
        notes: z.string().optional(),
        specializationSchool: z.string().optional(),
        name: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { updateStudent } = await import("@/lib/ledger.server");
    return updateStudent(data.pin, data);
  });

export const logLessonFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        studentId: z.string(),
        institutionId: z.string().optional(),
        date: z.string(),
        teacherName: z.string(),
        subject: z.string(),
        spellId: z.string(),
        notes: z.string().optional(),
        specializationSchool: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { logLesson } = await import("@/lib/ledger.server");
    return logLesson(data.pin, data);
  });

export const graduateStudentFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        studentId: z.string(),
        school: z.string(),
        institutionId: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { graduateStudent } = await import("@/lib/ledger.server");
    return graduateStudent(data.pin, data);
  });

export const revertGraduationFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        studentId: z.string(),
        school: z.string(),
        institutionId: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { revertGraduation } = await import("@/lib/ledger.server");
    return revertGraduation(data.pin, data);
  });

export const grantSpellFn = createServerFn({ method: "POST" })
  .validator((d) => pinSchema.extend({ spellRowId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { grantSpell } = await import("@/lib/ledger.server");
    return grantSpell(data.pin, data.spellRowId);
  });

export const grantPerkFn = createServerFn({ method: "POST" })
  .validator((d) => pinSchema.extend({ studentId: z.string(), perkId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { grantPerk } = await import("@/lib/ledger.server");
    return grantPerk(data.pin, data.studentId, data.perkId);
  });

export const saveInstitutionFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        id: z.string().optional(),
        name: z.string(),
        weeklySpellLimit: z.number(),
        perSchoolLimit: z.number(),
        isAntagonist: z.boolean(),
        advancementMin: z.number(),
        subjects: z.array(z.string()),
        newPin: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { saveInstitution } = await import("@/lib/ledger.server");
    return saveInstitution(data.pin, data);
  });

export const saveMasterPinFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        kind: z.enum(["gm", "grantor"]),
        nextPin: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { saveMasterPin } = await import("@/lib/ledger.server");
    return saveMasterPin(data.pin, data.kind, data.nextPin);
  });

export const saveSpellFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        id: z.string().optional(),
        name: z.string(),
        school: z.string(),
        tier: z.number(),
        formId: z.string(),
        hidden: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { saveSpell } = await import("@/lib/ledger.server");
    return saveSpell(data.pin, data);
  });

export const savePerkFn = createServerFn({ method: "POST" })
  .validator((d) =>
    pinSchema
      .extend({
        id: z.string().optional(),
        school: z.string(),
        rank: z.string(),
        formId: z.string(),
        unlock: z.string(),
        prohibited: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { savePerk } = await import("@/lib/ledger.server");
    return savePerk(data.pin, data);
  });

export const saveTiersFn = createServerFn({ method: "POST" })
  .validator((d) => pinSchema.extend({ levels: z.array(z.number()) }).parse(d))
  .handler(async ({ data }) => {
    const { saveTiers } = await import("@/lib/ledger.server");
    return saveTiers(data.pin, data.levels);
  });

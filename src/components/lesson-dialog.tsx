import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { groupSpellsByTier } from "@/lib/catalog";
import {
  alreadyKnowsSpell,
  canLearnSpell,
  institutionUsageLabel,
  isCollegeInstitution,
  todayISO,
  usageLabel,
  type CatalogSpell,
  type InstitutionRecord,
  type Student,
} from "@/lib/ledger";
import { cn } from "@/lib/utils";

export function LessonDialog({
  open,
  onOpenChange,
  student,
  institutions,
  catalog,
  role,
  defaultInstitutionId,
  onSubmit,
  onGraduate,
  busy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  institutions: InstitutionRecord[];
  catalog: CatalogSpell[];
  role: "gm" | "grantor" | "teacher";
  defaultInstitutionId: string | null;
  onSubmit: (input: {
    date: string;
    teacherName: string;
    subject: string;
    spellId: string;
    notes: string;
    specializationSchool: string;
    institutionId?: string;
  }) => void;
  onGraduate: (school: string) => void;
  busy: boolean;
}) {
  const [date, setDate] = useState(todayISO());
  const [teacherName, setTeacherName] = useState("");
  const [institutionId, setInstitutionId] = useState(defaultInstitutionId ?? institutions[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [spellId, setSpellId] = useState("");
  const [notes, setNotes] = useState("");
  const [spec, setSpec] = useState("");

  const inst = institutions.find((i) => i.id === institutionId) ?? institutions[0] ?? null;
  const subjects = inst?.subjects ?? [];

  const available = useMemo(() => {
    if (!student) return [];
    const atCollege = (inst?.name ?? "").toLowerCase().includes("winterhold");
    return catalog.filter((spell) => {
      if (subject && spell.school !== subject) return false;
      if (subjects.length && !subjects.includes(spell.school)) return false;
      return canLearnSpell(student, spell, atCollege);
    });
  }, [student, catalog, subject, subjects, inst]);

  const grouped = groupSpellsByTier(available);
  const mustGraduate = Boolean(
    student && subject && available.length === 0 && (student.advancement ?? []).some((c) => c.school === subject),
  );
  const knownEmpty = Boolean(student && subject && available.length === 0);

  function resetFor(next: Student | null) {
    setDate(todayISO());
    setTeacherName("");
    const nextInst = defaultInstitutionId ?? institutions[0]?.id ?? "";
    setInstitutionId(nextInst);
    const nextPlace = institutions.find((i) => i.id === nextInst) ?? institutions[0];
    const list = nextPlace?.subjects ?? [];
    setSubject(next?.specializationSchool && list.includes(next.specializationSchool) ? next.specializationSchool : "");
    setSpellId("");
    setNotes("");
    setSpec(next?.specializationSchool ?? "");
  }

  useEffect(() => {
    if (open && student) resetFor(student);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when a lesson dialog opens
  }, [open, student?.id, defaultInstitutionId]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next && student) resetFor(student);
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson</DialogTitle>
          <DialogDescription>
            {student?.name ?? ""}
            {student?.formId ? ` · ${student.formId}` : ""}
          </DialogDescription>
        </DialogHeader>
        {student ? (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <Label>Teacher</Label>
                <Input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
              </label>
            </div>
            {role === "gm" ? (
              <label className="space-y-1.5">
                <Label>Institution</Label>
                <Select
                  value={institutionId}
                  onValueChange={(v) => {
                    setInstitutionId(v);
                    setSubject("");
                    setSpellId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            ) : null}
            <label className="space-y-1.5">
              <Label>Subject</Label>
              <Select
                value={subject}
                onValueChange={(v) => {
                  setSubject(v);
                  setSpellId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5">
              <Label>Spell</Label>
              <Select value={spellId} onValueChange={setSpellId} disabled={!subject || available.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={knownEmpty ? "None at this tier" : "Spell"} />
                </SelectTrigger>
                <SelectContent>
                  {grouped.map((group) => (
                    <SelectGroup key={group.tier}>
                      <SelectLabel>Tier {group.tier}</SelectLabel>
                      {group.items.map((spell) => (
                        <SelectItem key={spell.id} value={spell.id} disabled={alreadyKnowsSpell(student, spell)}>
                          {spell.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5">
              <Label>Specialization</Label>
              <Select value={spec || "__none"} onValueChange={(v) => setSpec(v === "__none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </label>
            {student.weekUsage ? (
              <p className="text-xs text-muted-foreground">
                {role === "gm"
                  ? usageLabel(student.weekUsage)
                  : institutionUsageLabel(student.weekUsage, isCollegeInstitution(inst?.name ?? ""))}
              </p>
            ) : null}
          </div>
        ) : null}
        <DialogFooter>
          {mustGraduate ? (
            <Button
              type="button"
              variant="warn"
              className={cn("advance-cue sm:mr-auto")}
              onClick={() => subject && onGraduate(subject)}
              disabled={busy}
            >
              Graduate
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={!student || !subject || !spellId || busy}
            onClick={() =>
              student &&
              onSubmit({
                date,
                teacherName,
                subject,
                spellId,
                notes,
                specializationSchool: spec,
                institutionId: role === "gm" ? institutionId : undefined,
              })
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

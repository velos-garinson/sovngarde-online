import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { perkLabel, groupPerksBySchool } from "@/lib/catalog";
import {
  STATUS_BADGE,
  STATUS_LABEL,
  STUDENT_STATUSES,
  formatShortDate,
  initials,
  overdueGrantCount,
  schoolTone,
  standingTiers,
  type CatalogPerk,
  type Student,
  type StudentStatus,
} from "@/lib/ledger";
import { cn } from "@/lib/utils";

export function StudentCard({
  student,
  open,
  onToggle,
  canTeach,
  isGm,
  perks,
  onLesson,
  onGraduate,
  onEdit,
  onStatus,
  onGrantPerk,
}: {
  student: Student;
  open: boolean;
  onToggle: () => void;
  canTeach: boolean;
  isGm: boolean;
  perks: CatalogPerk[];
  onLesson: () => void;
  onGraduate: () => void;
  onEdit: () => void;
  onStatus: (status: StudentStatus) => void;
  onGrantPerk: (perkId: string) => void;
}) {
  const tiers = standingTiers(student);
  const overdue = overdueGrantCount(student);
  const pending = student.spells.filter((s) => s.status === "pending").length;
  const highlightGraduate = (student.advancement?.length ?? 0) > 0 && canTeach;

  return (
    <article className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated/60"
      >
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm bg-elevated font-medium text-muted-foreground">
          {initials(student.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{student.name}</span>
            {tiers.map((tier) => (
              <Badge key={tier.school} tone={schoolTone(tier.school)}>
                T{tier.level} {tier.school}
              </Badge>
            ))}
            <Badge tone={STATUS_BADGE[student.status]}>{STATUS_LABEL[student.status]}</Badge>
            {pending > 0 ? (
              <Badge tone="grant">
                {pending} grant
              </Badge>
            ) : null}
            {overdue > 0 ? (
              <Badge tone="overdue">
                {overdue} overdue
              </Badge>
            ) : null}
            {isGm && student.weeklyWarning ? <Badge tone="limit">Over limit</Badge> : null}
            {isGm && (student.missingT2Perks?.length ?? 0) > 0 ? <Badge tone="perk">T2 no perk</Badge> : null}
            {isGm && student.institutionAntagonist ? <Badge tone="antagonist">Antagonist</Badge> : null}
          </span>
          {student.formId ? (
            <span className="mt-1 block font-mono text-xs tabular-nums text-subtle">{student.formId}</span>
          ) : null}
          {student.lastLessonDate ? (
            <span className="mt-1 block text-xs text-muted-foreground">
              {formatShortDate(student.lastLessonDate)}
              {student.lastInstitution ? ` · ${student.lastInstitution}` : ""}
              {student.lastSubject ? ` · ${student.lastSubject}` : ""}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "mt-2 size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)]",
          open ? "rows-expand" : "rows-collapse",
        )}
      >
        <div className="min-h-0 overflow-hidden" inert={!open || undefined}>
          <div className="space-y-4 border-t border-border px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {canTeach ? (
                <>
                  <Button size="sm" onClick={onLesson}>
                    Lesson
                  </Button>
                  <Button
                    size="sm"
                    variant={highlightGraduate ? "warn" : "secondary"}
                    className={highlightGraduate ? "advance-cue" : undefined}
                    onClick={onGraduate}
                  >
                    Graduate
                  </Button>
                  <Button size="sm" variant="secondary" onClick={onEdit}>
                    Edit
                  </Button>
                </>
              ) : null}
              {canTeach ? (
                <Select value={student.status} onValueChange={(v) => onStatus(v as StudentStatus)}>
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>

            <section>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Spells</h3>
              {student.spells.length === 0 ? (
                <p className="mt-2 text-sm text-subtle">None</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {student.spells.map((spell) => (
                    <li key={spell.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span>
                        {spell.name}{" "}
                        <span className="text-muted-foreground">
                          T{spell.tier} {spell.school}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        {spell.status === "overdue" ? (
                          <Badge tone="overdue">overdue</Badge>
                        ) : spell.status === "pending" ? (
                          <Badge tone="grant">pending</Badge>
                        ) : (
                          <span>{spell.status}</span>
                        )}
                        {spell.formId ? <span className="font-mono tabular-nums">{spell.formId}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lessons</h3>
              {student.lessons.length === 0 ? (
                <p className="mt-2 text-sm text-subtle">None</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {student.lessons.map((lesson) => (
                    <li key={lesson.id} className="text-sm">
                      {formatShortDate(lesson.date)} · {lesson.subject}
                      {lesson.teacherName ? ` · ${lesson.teacherName}` : ""}
                      {lesson.spellNames.length ? ` · ${lesson.spellNames.join(", ")}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {isGm ? (
              <section>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Perks</h3>
                {student.perks.length === 0 ? (
                  <p className="mt-2 text-sm text-subtle">None</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {student.perks.map((perk) => (
                      <li key={perk.id} className="text-sm">
                        {perk.rank} {perk.school}
                        {perk.formId ? ` · ${perk.formId}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 max-w-sm">
                  <Select onValueChange={onGrantPerk}>
                    <SelectTrigger>
                      <SelectValue placeholder="Grant perk" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupPerksBySchool(perks.filter((p) => !p.prohibited)).map((group) => (
                        <div key={group.school}>
                          <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {group.school}
                          </div>
                          {group.items.map((perk) => (
                            <SelectItem key={perk.id} value={perk.id}>
                              {perkLabel(perk)}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>
            ) : null}

            {student.specializationSchool ? (
              <p className="text-xs text-muted-foreground">Specialization: {student.specializationSchool}</p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

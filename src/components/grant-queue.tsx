import { Check, Copy, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { learnSpellCommand } from "@/lib/catalog";
import { downloadPendingWorkbook } from "@/lib/excel";
import { formatShortDate, type Student } from "@/lib/ledger";
import { copyText } from "@/lib/utils";

function pendingLines(students: Student[]) {
  return students.flatMap((student) =>
    student.spells
      .filter((spell) => spell.status === "pending" || spell.status === "overdue")
      .map((spell) => ({ student, spell })),
  );
}

function exportText(students: Student[]): string {
  return pendingLines(students)
    .map(({ student, spell }) => learnSpellCommand(spell.formId || "-", student.name))
    .join("\n");
}

export function GrantQueue({
  students,
  canGrant,
  onGrant,
  busy,
}: {
  students: Student[];
  canGrant: boolean;
  onGrant: (spellRowId: string) => void;
  busy: boolean;
}) {
  const lines = pendingLines(students);

  async function copyAll() {
    const text = exportText(students);
    if (!text) {
      toast("Nothing to copy");
      return;
    }
    const ok = await copyText(text);
    toast(ok ? "Copied" : "Copy failed");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copyAll} disabled={lines.length === 0}>
          <Copy className="size-4" />
          Copy /learnspell
        </Button>
        <Button variant="secondary" onClick={() => downloadPendingWorkbook(students)} disabled={lines.length === 0}>
          <FileSpreadsheet className="size-4" />
          Excel
        </Button>
      </div>
      {lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending grants.</p>
      ) : (
        <ul className="space-y-2">
          {lines.map(({ student, spell }) => (
            <li
              key={spell.id}
              className="flex flex-col gap-2 rounded-md border border-border bg-card px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {student.name}
                  {spell.status === "overdue" ? <Badge tone="overdue">overdue</Badge> : <Badge tone="grant">pending</Badge>}
                </p>
                {student.formId ? (
                  <p className="font-mono text-xs tabular-nums text-subtle">{student.formId}</p>
                ) : null}
                <p className="text-sm text-muted-foreground">
                  {spell.name} · T{spell.tier} {spell.school} · {formatShortDate(spell.taughtDate)}
                </p>
                <p className="mt-1 font-mono text-xs text-subtle">
                  {learnSpellCommand(spell.formId || "-", student.name)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    const ok = await copyText(learnSpellCommand(spell.formId || "-", student.name));
                    toast(ok ? "Copied" : "Copy failed");
                  }}
                >
                  <Copy className="size-4" />
                  Copy
                </Button>
                {canGrant ? (
                  <Button size="sm" onClick={() => onGrant(spell.id)} disabled={busy}>
                    <Check className="size-4" />
                    Granted
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import type { Student } from "@/lib/ledger";
import { STATUS_LABEL } from "@/lib/ledger";

const AMP = "&" + "amp;";
const LT = "&" + "lt;";
const GT = "&" + "gt;";
const QUOT = "&" + "quot;";

function xmlEscape(value: string): string {
  return value.replace(/&/g, AMP).replace(/</g, LT).replace(/>/g, GT).replace(/"/g, QUOT);
}

function cell(value: string): string {
  return `<Cell><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;
}

function row(values: string[]): string {
  return `<Row>${values.map(cell).join("")}</Row>`;
}

function workbook(sheet: string, header: string, body: string[]): string {
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${xmlEscape(sheet)}">
<Table>
${header}
${body.join("\n")}
</Table>
</Worksheet>
</Workbook>`;
}

function download(xml: string, filename: string) {
  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function rosterSpreadsheetXml(students: Student[]): string {
  const header = row([
    "formID",
    "Name",
    "Status",
    "Home",
    "Last lesson",
    "Place",
    "Subject",
    "Tiers",
    "Spells",
    "Pending grants",
    "Perks",
    "Specialization",
  ]);
  const body = students.map((s) =>
    row([
      s.formId,
      s.name,
      STATUS_LABEL[s.status],
      s.lastInstitution,
      s.lastLessonDate ?? "",
      s.lastInstitution,
      s.lastSubject,
      s.tiers.map((t) => `T${t.level} ${t.school}`).join("; "),
      s.spells.map((sp) => `${sp.name} (${sp.status})`).join("; "),
      s.spells
        .filter((sp) => sp.status !== "granted")
        .map((sp) => `${sp.name} ${sp.formId}`)
        .join("; "),
      s.perks.map((p) => `${p.rank} ${p.school}`).join("; "),
      s.specializationSchool ?? "",
    ]),
  );
  return workbook("Roster", header, body);
}

export function downloadRosterWorkbook(students: Student[]) {
  download(rosterSpreadsheetXml(students), "sovngarde-roster.xls");
}

export function downloadPendingWorkbook(students: Student[]) {
  const header = row(["Player", "formID", "Spell", "Spell formID", "Tier", "School", "Taught", "Status", "Command"]);
  const body = students.flatMap((s) =>
    s.spells
      .filter((sp) => sp.status === "pending" || sp.status === "overdue")
      .map((sp) =>
        row([
          s.name,
          s.formId,
          sp.name,
          sp.formId,
          `T${sp.tier}`,
          sp.school,
          sp.taughtDate,
          sp.status,
          `/learnspell ${sp.formId || "-"} ${s.name}`,
        ]),
      ),
  );
  download(workbook("Needs Grant", header, body), "sovngarde-needs-grant.xls");
}

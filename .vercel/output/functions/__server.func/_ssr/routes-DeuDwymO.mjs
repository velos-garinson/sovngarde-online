import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { c as learnSpellCommand, l as perkLabel, n as DEFAULT_SCHOOLS, o as groupPerksBySchool, s as groupSpellsByTier } from "./catalog-CqkqW_vg.mjs";
import { A as studentMatchesQuery, C as parseRosterQuery, D as setQueryToken, E as setQueryText, M as uniqueSorted, N as usageLabel, O as sortRoster, S as overdueGrantCount, T as schoolTone, _ as institutionUsageLabel, a as FORM_ID_PLACEHOLDER, c as STATUS_BADGE, f as alreadyKnowsSpell, g as initials, h as formatShortDate, i as ENROLLED_FILTERS, j as todayISO, k as standingTiers, l as STATUS_LABEL, n as APP_ORG, o as NAME_PLACEHOLDER, p as canLearnSpell, s as SORT_LABEL, t as APP_NAME, u as STUDENT_STATUSES, v as isCollegeInstitution } from "./ledger-cJ4uPQbl.mjs";
import { a as Lock, c as ChevronRight, i as Plus, l as ChevronDown, o as FileSpreadsheet, r as Search, s as Copy, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as Label2, c as Separator2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Sub2, n as Content2, o as Portal2, r as Item2, s as Root2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectItem$1, c as SelectLabel$1, d as SelectValue$1, f as SelectViewport, i as SelectIcon, l as SelectPortal, n as SelectContent$1, o as SelectItemIndicator, r as SelectGroup$1, s as SelectItemText, t as Select$1, u as SelectTrigger$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { i as Trigger$1, n as List, r as Root2$1, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DeuDwymO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
var badgeVariants = cva("inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium leading-none tabular-nums", {
	variants: { tone: {
		pyro: "bg-pyro/15 text-pyro",
		resto: "bg-resto/15 text-resto",
		necro: "bg-necro/20 text-necro",
		cryo: "bg-cryo/15 text-cryo",
		vigil: "bg-resto/15 text-resto",
		warn: "bg-warn/15 text-warn",
		grant: "bg-accent/12 text-accent",
		overdue: "bg-pyro/15 text-pyro",
		limit: "bg-cryo/15 text-cryo",
		perk: "bg-resto/15 text-resto",
		antagonist: "bg-necro/20 text-necro",
		neutral: "bg-elevated text-muted-foreground"
	} },
	defaultVariants: { tone: "neutral" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[color,background-color,box-shadow,scale,opacity] duration-[var(--duration-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 press-in [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground hover:bg-accent/90",
			secondary: "bg-elevated text-foreground border border-border hover:border-accent/40",
			outline: "border border-border bg-transparent text-foreground hover:bg-elevated",
			ghost: "text-muted-foreground hover:bg-elevated hover:text-foreground",
			destructive: "bg-destructive text-accent-foreground hover:bg-destructive/90",
			warn: "bg-warn text-accent-foreground hover:bg-warn/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var AMP = "&amp;";
var LT = "&lt;";
var GT = "&gt;";
var QUOT = "&quot;";
function xmlEscape(value) {
	return value.replace(/&/g, AMP).replace(/</g, LT).replace(/>/g, GT).replace(/"/g, QUOT);
}
function cell(value) {
	return `<Cell><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;
}
function row(values) {
	return `<Row>${values.map(cell).join("")}</Row>`;
}
function workbook(sheet, header, body) {
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
function download(xml, filename) {
	const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function rosterSpreadsheetXml(students) {
	return workbook("Roster", row([
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
		"Specialization"
	]), students.map((s) => row([
		s.formId,
		s.name,
		STATUS_LABEL[s.status],
		s.lastInstitution,
		s.lastLessonDate ?? "",
		s.lastInstitution,
		s.lastSubject,
		s.tiers.map((t) => `T${t.level} ${t.school}`).join("; "),
		s.spells.map((sp) => `${sp.name} (${sp.status})`).join("; "),
		s.spells.filter((sp) => sp.status !== "granted").map((sp) => `${sp.name} ${sp.formId}`).join("; "),
		s.perks.map((p) => `${p.rank} ${p.school}`).join("; "),
		s.specializationSchool ?? ""
	])));
}
function downloadRosterWorkbook(students) {
	download(rosterSpreadsheetXml(students), "sovngarde-roster.xls");
}
function downloadPendingWorkbook(students) {
	download(workbook("Needs Grant", row([
		"Player",
		"formID",
		"Spell",
		"Spell formID",
		"Tier",
		"School",
		"Taught",
		"Status",
		"Command"
	]), students.flatMap((s) => s.spells.filter((sp) => sp.status === "pending" || sp.status === "overdue").map((sp) => row([
		s.name,
		s.formId,
		sp.name,
		sp.formId,
		`T${sp.tier}`,
		sp.school,
		sp.taughtDate,
		sp.status,
		`/learnspell ${sp.formId || "-"} ${s.name}`
	])))), "sovngarde-needs-grant.xls");
}
function pendingLines(students) {
	return students.flatMap((student) => student.spells.filter((spell) => spell.status === "pending" || spell.status === "overdue").map((spell) => ({
		student,
		spell
	})));
}
function exportText(students) {
	return pendingLines(students).map(({ student, spell }) => learnSpellCommand(spell.formId || "-", student.name)).join("\n");
}
function GrantQueue({ students, canGrant, onGrant, busy }) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: copyAll,
				disabled: lines.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy /learnspell"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: () => downloadPendingWorkbook(students),
				disabled: lines.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), "Excel"]
			})]
		}), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No pending grants."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: lines.map(({ student, spell }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col gap-2 rounded-md border border-border bg-card px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex flex-wrap items-center gap-2 font-medium",
							children: [student.name, spell.status === "overdue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "overdue",
								children: "overdue"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "grant",
								children: "pending"
							})]
						}),
						student.formId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tabular-nums text-subtle",
							children: student.formId
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								spell.name,
								" · T",
								spell.tier,
								" ",
								spell.school,
								" · ",
								formatShortDate(spell.taughtDate)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xs text-subtle",
							children: learnSpellCommand(spell.formId || "-", student.name)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: async () => {
							const ok = await copyText(learnSpellCommand(spell.formId || "-", student.name));
							toast(ok ? "Copied" : "Copy failed");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy"]
					}), canGrant ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => onGrant(spell.id),
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Granted"]
					}) : null]
				})]
			}, spell.id))
		})]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = (0, import_react.forwardRef)(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-lg max-h-[min(90dvh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-border)] duration-[var(--duration-fast)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-sm p-2 text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-8", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-xl font-semibold tracking-tight text-foreground", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = (0, import_react.forwardRef)(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	ref,
	className: cn("flex h-11 w-full rounded-sm border border-border bg-elevated px-3 text-sm text-foreground placeholder:text-subtle transition-[border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-40", className),
	...props
}));
Input.displayName = "Input";
var Label = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium uppercase tracking-wide text-muted-foreground", className),
	...props
}));
Label.displayName = Root.displayName;
var Select = Select$1;
var SelectGroup = SelectGroup$1;
var SelectValue = SelectValue$1;
var SelectTrigger = (0, import_react.forwardRef)(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-11 w-full items-center justify-between gap-2 rounded-sm border border-border bg-elevated px-3 text-sm text-foreground transition-[border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-out)] hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-40 data-[placeholder]:text-subtle [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectContent = (0, import_react.forwardRef)(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
	ref,
	position,
	className: cn("relative z-50 max-h-72 min-w-32 overflow-hidden rounded-md border border-border bg-card text-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
		className: cn("p-1", position === "popper" && "w-[var(--radix-select-trigger-width)]"),
		children
	})
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = (0, import_react.forwardRef)(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-pointer select-none items-center rounded-xs py-2 pl-8 pr-2 text-sm outline-none focus:bg-elevated data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex size-4 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var Textarea = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-24 w-full rounded-sm border border-border bg-elevated px-3 py-2 text-sm text-foreground placeholder:text-subtle transition-[border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-40", className),
	...props
}));
Textarea.displayName = "Textarea";
function LessonDialog({ open, onOpenChange, student, institutions, catalog, role, defaultInstitutionId, onSubmit, onGraduate, busy }) {
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [teacherName, setTeacherName] = (0, import_react.useState)("");
	const [institutionId, setInstitutionId] = (0, import_react.useState)(defaultInstitutionId ?? institutions[0]?.id ?? "");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [spellId, setSpellId] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [spec, setSpec] = (0, import_react.useState)("");
	const inst = institutions.find((i) => i.id === institutionId) ?? institutions[0] ?? null;
	const subjects = inst?.subjects ?? [];
	const available = (0, import_react.useMemo)(() => {
		if (!student) return [];
		const atCollege = (inst?.name ?? "").toLowerCase().includes("winterhold");
		return catalog.filter((spell) => {
			if (subject && spell.school !== subject) return false;
			if (subjects.length && !subjects.includes(spell.school)) return false;
			return canLearnSpell(student, spell, atCollege);
		});
	}, [
		student,
		catalog,
		subject,
		subjects,
		inst
	]);
	const grouped = groupSpellsByTier(available);
	const mustGraduate = Boolean(student && subject && available.length === 0 && (student.advancement ?? []).some((c) => c.school === subject));
	const knownEmpty = Boolean(student && subject && available.length === 0);
	function resetFor(next) {
		setDate(todayISO());
		setTeacherName("");
		const nextInst = defaultInstitutionId ?? institutions[0]?.id ?? "";
		setInstitutionId(nextInst);
		const list = (institutions.find((i) => i.id === nextInst) ?? institutions[0])?.subjects ?? [];
		setSubject(next?.specializationSchool && list.includes(next.specializationSchool) ? next.specializationSchool : "");
		setSpellId("");
		setNotes("");
		setSpec(next?.specializationSchool ?? "");
	}
	(0, import_react.useEffect)(() => {
		if (open && student) resetFor(student);
	}, [
		open,
		student?.id,
		defaultInstitutionId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (next && student) resetFor(student);
			onOpenChange(next);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Lesson" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [student?.name ?? "", student?.formId ? ` · ${student.formId}` : ""] })] }),
			student ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Teacher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: teacherName,
								onChange: (e) => setTeacherName(e.target.value)
							})]
						})]
					}),
					role === "gm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Institution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: institutionId,
							onValueChange: (v) => {
								setInstitutionId(v);
								setSubject("");
								setSpellId("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Institution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: institutions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: item.id,
								children: item.name
							}, item.id)) })]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: subject,
							onValueChange: (v) => {
								setSubject(v);
								setSpellId("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Spell" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: spellId,
							onValueChange: setSpellId,
							disabled: !subject || available.length === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: knownEmpty ? "None at this tier" : "Spell" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: grouped.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectLabel, { children: ["Tier ", group.tier] }), group.items.map((spell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: spell.id,
								disabled: alreadyKnowsSpell(student, spell),
								children: spell.name
							}, spell.id))] }, group.tier)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Specialization" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: spec || "__none",
							onValueChange: (v) => setSpec(v === "__none" ? "" : v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "None" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "__none",
								children: "None"
							}), subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3
						})]
					}),
					student.weekUsage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: role === "gm" ? usageLabel(student.weekUsage) : institutionUsageLabel(student.weekUsage, isCollegeInstitution(inst?.name ?? ""))
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [mustGraduate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "warn",
				className: cn("advance-cue sm:mr-auto"),
				onClick: () => subject && onGraduate(subject),
				disabled: busy,
				children: "Graduate"
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				disabled: !student || !subject || !spellId || busy,
				onClick: () => student && onSubmit({
					date,
					teacherName,
					subject,
					spellId,
					notes,
					specializationSchool: spec,
					institutionId: role === "gm" ? institutionId : void 0
				}),
				children: "Save"
			})] })
		] })
	});
}
function ListsPanel({ institutions, spells, perks, tiers, onSaveInstitution, onSaveSpell, onSavePerk, onSaveTiers, onSaveMasterPin, busy }) {
	const [instId, setInstId] = (0, import_react.useState)(institutions[0]?.id ?? "");
	const inst = institutions.find((i) => i.id === instId) ?? institutions[0];
	const [instName, setInstName] = (0, import_react.useState)(inst?.name ?? "");
	const [weekly, setWeekly] = (0, import_react.useState)(String(inst?.weeklySpellLimit ?? 1));
	const [perSchool, setPerSchool] = (0, import_react.useState)(String(inst?.perSchoolLimit ?? 0));
	const [advMin, setAdvMin] = (0, import_react.useState)(String(inst?.advancementMin ?? 1));
	const [antagonist, setAntagonist] = (0, import_react.useState)(Boolean(inst?.isAntagonist));
	const [subjects, setSubjects] = (0, import_react.useState)(inst?.subjects ?? []);
	const [newPin, setNewPin] = (0, import_react.useState)("");
	const [gmPin, setGmPin] = (0, import_react.useState)("");
	const [grantorPin, setGrantorPin] = (0, import_react.useState)("");
	const [tierDraft, setTierDraft] = (0, import_react.useState)(tiers.join(", "));
	const [spellName, setSpellName] = (0, import_react.useState)("");
	const [spellSchool, setSpellSchool] = (0, import_react.useState)(DEFAULT_SCHOOLS[0]);
	const [spellTier, setSpellTier] = (0, import_react.useState)("1");
	const [spellForm, setSpellForm] = (0, import_react.useState)("");
	const [perkSchool, setPerkSchool] = (0, import_react.useState)("Destruction");
	const [perkRank, setPerkRank] = (0, import_react.useState)("Adept");
	const [perkForm, setPerkForm] = (0, import_react.useState)("");
	const [perkUnlock, setPerkUnlock] = (0, import_react.useState)("");
	function loadInst(id) {
		const next = institutions.find((i) => i.id === id);
		setInstId(id);
		setInstName(next?.name ?? "");
		setWeekly(String(next?.weeklySpellLimit ?? 1));
		setPerSchool(String(next?.perSchoolLimit ?? 0));
		setAdvMin(String(next?.advancementMin ?? 1));
		setAntagonist(Boolean(next?.isAntagonist));
		setSubjects(next?.subjects ?? []);
		setNewPin("");
	}
	function toggleSubject(school) {
		setSubjects((prev) => prev.includes(school) ? prev.filter((s) => s !== school) : [...prev, school]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Institutions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Select" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "flex h-11 w-full rounded-sm border border-border bg-elevated px-3 text-sm",
								value: instId,
								onChange: (e) => loadInst(e.target.value),
								children: [institutions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: item.id,
									children: [item.name, item.isAntagonist ? " (antagonist)" : ""]
								}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "New"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: instName,
								onChange: (e) => setInstName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Weekly cap" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										value: weekly,
										onChange: (e) => setWeekly(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Per subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: perSchool,
										onChange: (e) => setPerSchool(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Graduate min" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										value: advMin,
										onChange: (e) => setAdvMin(e.target.value)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: antagonist,
								onChange: (e) => setAntagonist(e.target.checked)
							}), "Antagonist"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subjects" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: DEFAULT_SCHOOLS.map((school) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleSubject(school),
								className: cn("h-9 rounded-sm border px-3 text-sm transition-colors", subjects.includes(school) ? "border-accent bg-elevated text-foreground" : "border-border text-muted-foreground hover:bg-elevated"),
								children: school
							}, school))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								inputMode: "numeric",
								autoComplete: "new-password",
								maxLength: 6,
								value: newPin,
								onChange: (e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy || !instName.trim(),
							onClick: async () => {
								if (await onSaveInstitution({
									id: instId || void 0,
									name: instName,
									weeklySpellLimit: Number(weekly) || 1,
									perSchoolLimit: Number(perSchool) || 0,
									isAntagonist: antagonist,
									advancementMin: Number(advMin) || 1,
									subjects,
									newPin: newPin || void 0
								})) {
									toast("Institution saved");
									setNewPin("");
								}
							},
							children: "Save institution"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Access PINs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GM PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								inputMode: "numeric",
								autoComplete: "new-password",
								maxLength: 6,
								value: gmPin,
								onChange: (e) => setGmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Grantor PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								inputMode: "numeric",
								autoComplete: "new-password",
								maxLength: 6,
								value: grantorPin,
								onChange: (e) => setGrantorPin(e.target.value.replace(/\D/g, "").slice(0, 6))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							disabled: busy || gmPin.length !== 6,
							onClick: async () => {
								if (await onSaveMasterPin("gm", gmPin)) {
									toast("GM PIN saved");
									setGmPin("");
								}
							},
							children: "Save GM PIN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							disabled: busy || grantorPin.length !== 6,
							onClick: async () => {
								if (await onSaveMasterPin("grantor", grantorPin)) {
									toast("Grantor PIN saved");
									setGrantorPin("");
								}
							},
							children: "Save Grantor PIN"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Tiers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tierDraft,
						onChange: (e) => setTierDraft(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busy,
						onClick: async () => {
							if (await onSaveTiers(tierDraft.split(/[,\s]+/).map((n) => Number(n)).filter((n) => Number.isInteger(n) && n > 0))) toast("Tiers saved");
						},
						children: "Save tiers"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Spells"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Name",
								value: spellName,
								onChange: (e) => setSpellName(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Subject",
								value: spellSchool,
								onChange: (e) => setSpellSchool(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Tier",
								type: "number",
								value: spellTier,
								onChange: (e) => setSpellTier(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Form ID",
								value: spellForm,
								onChange: (e) => setSpellForm(e.target.value)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "secondary",
						disabled: busy || !spellName.trim(),
						onClick: async () => {
							if (await onSaveSpell({
								name: spellName,
								school: spellSchool,
								tier: Number(spellTier) || 1,
								formId: spellForm,
								hidden: false
							})) {
								toast("Spell saved");
								setSpellName("");
								setSpellForm("");
							}
						},
						children: "Add spell"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 max-h-64 space-y-1 overflow-y-auto text-sm",
						children: spells.map((spell) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2 border-b border-border/60 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								spell.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										"T",
										spell.tier,
										" ",
										spell.school
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-subtle",
								children: spell.formId
							})]
						}, spell.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Perks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "School",
								value: perkSchool,
								onChange: (e) => setPerkSchool(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Rank",
								value: perkRank,
								onChange: (e) => setPerkRank(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Form ID",
								value: perkForm,
								onChange: (e) => setPerkForm(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Unlock",
								value: perkUnlock,
								onChange: (e) => setPerkUnlock(e.target.value)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "secondary",
						disabled: busy || !perkSchool.trim() || !perkRank.trim(),
						onClick: async () => {
							if (await onSavePerk({
								school: perkSchool,
								rank: perkRank,
								formId: perkForm,
								unlock: perkUnlock,
								prohibited: false
							})) {
								toast("Perk saved");
								setPerkForm("");
							}
						},
						children: "Add perk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 max-h-64 space-y-1 overflow-y-auto text-sm",
						children: perks.map((perk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2 border-b border-border/60 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								perk.rank,
								" ",
								perk.school,
								perk.prohibited ? " · prohibited" : ""
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-subtle",
								children: perk.formId
							})]
						}, perk.id))
					})
				]
			})
		]
	});
}
var SESSION_KEY = "sovngarde-session-v1";
function isSixDigit(pin) {
	return /^\d{6}$/.test(pin);
}
function readSession() {
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || parsed.role !== "gm" && parsed.role !== "grantor" && parsed.role !== "teacher") return null;
		if (typeof parsed.pin !== "string" || !isSixDigit(parsed.pin)) return null;
		if (parsed.role === "teacher") {
			if (!parsed.institutionId || !parsed.institutionName) return null;
			return {
				role: "teacher",
				pin: parsed.pin,
				institutionId: parsed.institutionId,
				institutionName: parsed.institutionName
			};
		}
		return {
			role: parsed.role,
			pin: parsed.pin
		};
	} catch {
		return null;
	}
}
function writeSession(session) {
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function clearSession() {
	sessionStorage.removeItem(SESSION_KEY);
}
function PinGate({ onUnlock, error, busy, warping }) {
	const [pin, setPin] = (0, import_react.useState)("");
	const locked = busy || Boolean(warping);
	function submit(e) {
		e.preventDefault();
		if (!isSixDigit(pin) || locked) return;
		onUnlock(pin);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: cn("relative isolate min-h-dvh overflow-hidden bg-background text-foreground", warping && "landing-warp"),
		"aria-busy": locked,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "landing-veil",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "landing-portal",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-h-dvh items-center justify-center px-5 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "landing-panel w-full max-w-sm rounded-xl border border-border bg-card px-6 py-8 text-foreground shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/keizaal-mark.png",
								alt: "",
								width: 64,
								height: 64,
								draggable: false,
								className: "size-16 select-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-display text-3xl font-semibold leading-snug tracking-tight text-foreground",
								children: APP_NAME
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: APP_ORG
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4 border-t border-border pt-6",
						onSubmit: submit,
						autoComplete: "off",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: "PIN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "collegium-access-pin",
									type: "password",
									inputMode: "numeric",
									autoComplete: "new-password",
									autoCorrect: "off",
									autoCapitalize: "off",
									spellCheck: false,
									maxLength: 6,
									pattern: "\\d{6}",
									value: pin,
									onChange: (e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6)),
									placeholder: "",
									"aria-label": "PIN",
									suppressHydrationWarning: true,
									disabled: locked
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: !isSixDigit(pin) || locked,
								children: warping ? "Opening" : busy ? "Opening" : "Open"
							})
						]
					})]
				})
			})
		]
	});
}
function StudentCard({ student, open, onToggle, canTeach, isGm, perks, onLesson, onGraduate, onEdit, onStatus, onGrantPerk }) {
	const tiers = standingTiers(student);
	const overdue = overdueGrantCount(student);
	const pending = student.spells.filter((s) => s.status === "pending").length;
	const highlightGraduate = (student.advancement?.length ?? 0) > 0 && canTeach;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated/60",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm bg-elevated font-medium text-muted-foreground",
					children: initials(student.name)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: student.name
								}),
								tiers.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: schoolTone(tier.school),
									children: [
										"T",
										tier.level,
										" ",
										tier.school
									]
								}, tier.school)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: STATUS_BADGE[student.status],
									children: STATUS_LABEL[student.status]
								}),
								pending > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: "grant",
									children: [pending, " grant"]
								}) : null,
								overdue > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: "overdue",
									children: [overdue, " overdue"]
								}) : null,
								isGm && student.weeklyWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "limit",
									children: "Over limit"
								}) : null,
								isGm && (student.missingT2Perks?.length ?? 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "perk",
									children: "T2 no perk"
								}) : null,
								isGm && student.institutionAntagonist ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "antagonist",
									children: "Antagonist"
								}) : null
							]
						}),
						student.formId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-mono text-xs tabular-nums text-subtle",
							children: student.formId
						}) : null,
						student.lastLessonDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-muted-foreground",
							children: [
								formatShortDate(student.lastLessonDate),
								student.lastInstitution ? ` · ${student.lastInstitution}` : "",
								student.lastSubject ? ` · ${student.lastSubject}` : ""
							]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("mt-2 size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]", open && "rotate-180") })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid transition-[grid-template-rows] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)]", open ? "rows-expand" : "rows-collapse"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 overflow-hidden",
				inert: !open || void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 border-t border-border px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [canTeach ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: onLesson,
									children: "Lesson"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: highlightGraduate ? "warn" : "secondary",
									className: highlightGraduate ? "advance-cue" : void 0,
									onClick: onGraduate,
									children: "Graduate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: onEdit,
									children: "Edit"
								})
							] }) : null, canTeach ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: student.status,
								onValueChange: (v) => onStatus(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STUDENT_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: status,
									children: STATUS_LABEL[status]
								}, status)) })]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: "Spells"
						}), student.spells.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-subtle",
							children: "None"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1.5",
							children: student.spells.map((spell) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-baseline justify-between gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									spell.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"T",
											spell.tier,
											" ",
											spell.school
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [spell.status === "overdue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "overdue",
										children: "overdue"
									}) : spell.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "grant",
										children: "pending"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: spell.status }), spell.formId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: spell.formId
									}) : null]
								})]
							}, spell.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: "Lessons"
						}), student.lessons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-subtle",
							children: "None"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1.5",
							children: student.lessons.map((lesson) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [
									formatShortDate(lesson.date),
									" · ",
									lesson.subject,
									lesson.teacherName ? ` · ${lesson.teacherName}` : "",
									lesson.spellNames.length ? ` · ${lesson.spellNames.join(", ")}` : ""
								]
							}, lesson.id))
						})] }),
						isGm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Perks"
							}),
							student.perks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-subtle",
								children: "None"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: student.perks.map((perk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm",
									children: [
										perk.rank,
										" ",
										perk.school,
										perk.formId ? ` · ${perk.formId}` : ""
									]
								}, perk.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 max-w-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									onValueChange: onGrantPerk,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Grant perk" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: groupPerksBySchool(perks.filter((p) => !p.prohibited)).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground",
										children: group.school
									}), group.items.map((perk) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: perk.id,
										children: perkLabel(perk)
									}, perk.id))] }, group.school)) })]
								})
							})
						] }) : null,
						student.specializationSchool ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Specialization: ", student.specializationSchool]
						}) : null
					]
				})
			})
		})]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSub = Sub2;
var DropdownMenuSubTrigger = (0, import_react.forwardRef)(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-pointer select-none items-center gap-2 rounded-xs px-2 py-2 text-sm outline-none focus:bg-elevated data-[state=open]:bg-elevated", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-4 text-muted-foreground" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-36 overflow-hidden rounded-md border border-border bg-card p-1 text-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = (0, import_react.forwardRef)(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 min-w-44 overflow-hidden rounded-md border border-border bg-card p-1 text-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = (0, import_react.forwardRef)(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-xs px-2 py-2 text-sm outline-none transition-colors focus:bg-elevated data-[disabled]:pointer-events-none data-[disabled]:opacity-40", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = (0, import_react.forwardRef)(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	checked,
	className: cn("relative flex cursor-pointer select-none items-center rounded-xs py-2 pl-8 pr-2 text-sm outline-none focus:bg-elevated data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex size-4 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuSeparator = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-border", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuLabel = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var Tabs = Root2$1;
var TabsList = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-11 items-center gap-1 rounded-md bg-elevated p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-sm px-3 text-sm font-medium transition-[background-color,color] duration-[var(--duration-quick)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 data-[state=active]:bg-card data-[state=active]:text-foreground", className),
	...props
}));
TabsTrigger.displayName = Trigger$1.displayName;
var TabsContent = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-4 focus-visible:outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		position: "bottom-right",
		toastOptions: { classNames: {
			toast: "bg-card text-foreground border-border",
			description: "text-muted-foreground"
		} }
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var pinSchema = object({ pin: string().regex(/^\d{6}$/) });
var unlockWithPin = createServerFn({ method: "POST" }).validator((d) => pinSchema.parse(d)).handler(createSsrRpc("7540b6f2bccb7d4469b2651078fb68b639124f57e1e2ea1c75ec2b4111ed2f6b"));
var loadRosterFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.parse(d)).handler(createSsrRpc("c3fb9227e171ba64b21ae264bcdf224301fdefc670e9404a002dbe436398f7fc"));
var enrollStudentFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	name: string().min(1),
	formId: string().min(1),
	institutionId: string().optional()
}).parse(d)).handler(createSsrRpc("d16484a5156162a2d316eeb54d848bb86dea64ffff7046513c80c92957b682df"));
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
}).parse(d)).handler(createSsrRpc("6839b310ccdb5e58149bc1a4df6070b304fe16c35880ab851afaabef9f8e52bf"));
var logLessonFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	institutionId: string().optional(),
	date: string(),
	teacherName: string(),
	subject: string(),
	spellId: string(),
	notes: string().optional(),
	specializationSchool: string().optional()
}).parse(d)).handler(createSsrRpc("63afb81ede8ea14fa2745fd55c153aa47278f50611d8f6a7bb1a7a470df7ca18"));
var graduateStudentFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	school: string(),
	institutionId: string().optional()
}).parse(d)).handler(createSsrRpc("6c08b2f159a81511afd650df70d10406468a85285b5151328390bfc03b99487d"));
var revertGraduationFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	school: string(),
	institutionId: string().optional()
}).parse(d)).handler(createSsrRpc("68b316b748ac912c8a12c019331762830cd14999810163d957aabb894e5e5b67"));
var grantSpellFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({ spellRowId: string() }).parse(d)).handler(createSsrRpc("f0c6c80e7a8d2dac2baf31cdefcab915b5b9a237db897113a63a42c44540f9d6"));
var grantPerkFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	studentId: string(),
	perkId: string()
}).parse(d)).handler(createSsrRpc("97db0902be3e7a2c397568d935a29c655f5ce9b277d9356e74842442127f66b8"));
var saveInstitutionFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	id: string().optional(),
	name: string(),
	weeklySpellLimit: number(),
	perSchoolLimit: number(),
	isAntagonist: boolean(),
	advancementMin: number(),
	subjects: array(string()),
	newPin: string().optional()
}).parse(d)).handler(createSsrRpc("b7bb2f838efdb16995c2f7749b5860c0e484ee16fa7d9c5da6636e00f146db30"));
var saveMasterPinFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	kind: _enum(["gm", "grantor"]),
	nextPin: string()
}).parse(d)).handler(createSsrRpc("eabc0223f264d9610cd4dc250a5d7f3f4ddb81b8d24de5dfb7e87510af5d41d3"));
var saveSpellFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	id: string().optional(),
	name: string(),
	school: string(),
	tier: number(),
	formId: string(),
	hidden: boolean()
}).parse(d)).handler(createSsrRpc("0ae21a327e38144780deec767064fae9d280095dc390b2e804f8ed71d535ea44"));
var savePerkFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({
	id: string().optional(),
	school: string(),
	rank: string(),
	formId: string(),
	unlock: string(),
	prohibited: boolean()
}).parse(d)).handler(createSsrRpc("3e8310824f96140d921762f75ffb52b48c92eb76b46c3c3f8f6c71351bb2c438"));
var saveTiersFn = createServerFn({ method: "POST" }).validator((d) => pinSchema.extend({ levels: array(number()) }).parse(d)).handler(createSsrRpc("23ccf35c16844540f0fbd181500c85ef45fd6bc6a112232245bb08575c38a4b5"));
function sessionPin(session) {
	return session?.pin ?? null;
}
var PORTAL_MS = 500;
function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function LedgerApp() {
	const queryClient = useQueryClient();
	const [session, setSession] = (0, import_react.useState)(null);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [pinError, setPinError] = (0, import_react.useState)(null);
	const [unlocking, setUnlocking] = (0, import_react.useState)(false);
	const [warping, setWarping] = (0, import_react.useState)(false);
	const [fromPortal, setFromPortal] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("roster");
	const [lessonStudent, setLessonStudent] = (0, import_react.useState)(null);
	const [graduateStudent, setGraduateStudent] = (0, import_react.useState)(null);
	const [graduateSchool, setGraduateSchool] = (0, import_react.useState)("");
	const [enrollOpen, setEnrollOpen] = (0, import_react.useState)(false);
	const [enrollName, setEnrollName] = (0, import_react.useState)("");
	const [enrollFormId, setEnrollFormId] = (0, import_react.useState)("");
	const [enrollInstId, setEnrollInstId] = (0, import_react.useState)("");
	const [editStudent, setEditStudent] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editSpec, setEditSpec] = (0, import_react.useState)("");
	const [revertSchool, setRevertSchool] = (0, import_react.useState)("");
	const [suggestOpen, setSuggestOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSession(readSession());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpenId(null);
		setQuery("");
		setLessonStudent(null);
		setGraduateStudent(null);
		setEditStudent(null);
		if (session?.role === "grantor") setTab("grants");
		else setTab("roster");
	}, [session?.pin, session?.role]);
	const pin = sessionPin(session);
	const rosterQuery = useQuery({
		queryKey: ["roster", pin],
		enabled: Boolean(pin),
		queryFn: async () => {
			const result = await loadRosterFn({ data: { pin } });
			if (!result.ok) {
				clearSession();
				setSession(null);
				throw new Error(result.error);
			}
			return result.roster;
		}
	});
	const roster = rosterQuery.data;
	const parsed = parseRosterQuery(query);
	const visible = (0, import_react.useMemo)(() => {
		if (!roster) return [];
		const matched = roster.students.filter((student) => studentMatchesQuery(student, parsed, roster.role === "gm"));
		return sortRoster(matched, parsed.sort, roster.role !== "teacher");
	}, [roster, parsed]);
	const nameSuggestions = (0, import_react.useMemo)(() => {
		if (!roster) return [];
		const text = parsed.text.trim().toLowerCase();
		if (!text) return [];
		return roster.students.filter((s) => s.name.toLowerCase().includes(text) || s.formId.toLowerCase().includes(text)).slice(0, 8);
	}, [roster, parsed.text]);
	const subjects = (0, import_react.useMemo)(() => {
		if (!roster) return [];
		if (roster.role === "teacher") return roster.institutions[0]?.subjects ?? [];
		return uniqueSorted(roster.institutions.flatMap((i) => i.subjects));
	}, [roster]);
	async function handleUnlock(nextPin) {
		setUnlocking(true);
		setPinError(null);
		try {
			const result = await unlockWithPin({ data: { pin: nextPin } });
			if (!result.ok) {
				setPinError(result.error);
				return;
			}
			const next = result.role === "teacher" ? {
				role: "teacher",
				pin: nextPin,
				institutionId: result.institutionId,
				institutionName: result.institutionName
			} : {
				role: result.role,
				pin: nextPin
			};
			const skipMotion = prefersReducedMotion();
			if (!skipMotion) {
				setWarping(true);
				await new Promise((resolve) => window.setTimeout(resolve, PORTAL_MS));
			}
			writeSession(next);
			setFromPortal(!skipMotion);
			setSession(next);
			setTab(result.role === "grantor" ? "grants" : "roster");
		} catch {
			setPinError("PIN not recognized");
			setWarping(false);
		} finally {
			setUnlocking(false);
		}
	}
	function lock() {
		clearSession();
		setSession(null);
		setFromPortal(false);
		setWarping(false);
		queryClient.removeQueries({ queryKey: ["roster"] });
	}
	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["roster", pin] });
	const mutate = useMutation({
		mutationFn: async (fn) => {
			const result = await fn();
			if (!result.ok) throw new Error(result.error || "Failed");
			return result;
		},
		onSuccess: () => invalidate(),
		onError: (err) => toast(err.message)
	});
	if (!hydrated || !session) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinGate, {
		onUnlock: handleUnlock,
		error: pinError,
		busy: unlocking,
		warping
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] });
	const role = roster?.role ?? session.role;
	const canTeach = role === "gm" || role === "teacher";
	const canGrant = role === "gm" || role === "grantor";
	const canLists = role === "gm";
	const showRoster = role !== "grantor";
	const revertSchools = uniqueSorted((editStudent?.learnableTiers ?? editStudent?.tiers ?? []).filter((t) => t.level > 1).map((t) => t.school));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-h-dvh bg-background text-foreground", fromPortal && "app-arrive"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/keizaal-mark.png",
							alt: "",
							width: 36,
							height: 36,
							draggable: false,
							className: "size-9 shrink-0 select-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: role === "teacher" ? session.role === "teacher" ? session.institutionName : roster?.institutionName : role === "gm" ? "GM" : "Grantor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-semibold tracking-tight",
							children: APP_NAME
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: lock,
						className: "self-start sm:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), "Lock"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-6",
				children: [
					rosterQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading"
					}) : null,
					rosterQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: "Could not load roster."
					}) : null,
					roster ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: tab,
						onValueChange: setTab,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
								showRoster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "roster",
									children: "Roster"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "grants",
									children: "Needs Grant"
								}),
								canLists ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "lists",
									children: "Lists"
								}) : null
							] }),
							showRoster ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "roster",
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 sm:flex-row",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													className: "pl-9",
													value: query,
													placeholder: NAME_PLACEHOLDER,
													autoComplete: "off",
													onFocus: () => setSuggestOpen(true),
													onBlur: () => window.setTimeout(() => setSuggestOpen(false), 120),
													onChange: (e) => {
														setQuery(e.target.value);
														setSuggestOpen(true);
													}
												}),
												suggestOpen && nameSuggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-card py-1 shadow-[var(--shadow-border)]",
													children: nameSuggestions.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														className: "flex h-10 w-full items-center justify-between gap-3 px-3 text-left text-sm hover:bg-elevated",
														onMouseDown: (e) => e.preventDefault(),
														onClick: () => {
															setQuery(setQueryText(query, student.name));
															setSuggestOpen(false);
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: student.name }), student.formId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-xs tabular-nums text-subtle",
															children: student.formId
														}) : null]
													}) }, student.id))
												}) : null
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "secondary",
												className: "shrink-0",
												children: ["Filters", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "subject", "")),
													children: "Any"
												}), subjects.map((subject) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "subject", subject)),
													children: subject
												}, subject))] })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "status", "")),
													children: "Any"
												}), STUDENT_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "status", STATUS_LABEL[status])),
													children: STATUS_LABEL[status]
												}, status))] })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Enrolled" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "enrolled", "")),
													children: "Any"
												}), ENROLLED_FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "enrolled", item.value)),
													children: item.label
												}, item.value))] })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Grant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
														onSelect: () => setQuery(setQueryToken(query, "grant", "")),
														children: "Any"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
														onSelect: () => setQuery(setQueryToken(query, "grant", "pending")),
														children: "Pending"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
														onSelect: () => setQuery(setQueryToken(query, "grant", "overdue")),
														children: "Overdue"
													})
												] })] }),
												role === "gm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "week", parsed.week === "over" ? "" : "over")),
													children: "Over weekly limit"
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Sort" }),
												Object.keys(SORT_LABEL).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onSelect: () => setQuery(setQueryToken(query, "sort", key)),
													children: SORT_LABEL[key]
												}, key))
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "secondary",
											className: "shrink-0",
											onClick: () => downloadRosterWorkbook(roster.students),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), role === "gm" ? "Export full db" : "Export institution db"]
										}),
										canTeach ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => {
												setEnrollName(parsed.text);
												setEnrollFormId("");
												setEnrollInstId(roster.institutionId ?? roster.institutions.find((i) => i.name === "College of Winterhold")?.id ?? roster.institutions[0]?.id ?? "");
												setEnrollOpen(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Enroll"]
										}) : null
									]
								}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "No students."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: visible.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentCard, {
										student,
										open: openId === student.id,
										onToggle: () => setOpenId((id) => id === student.id ? null : student.id),
										canTeach,
										isGm: role === "gm",
										perks: roster.catalogPerks,
										onLesson: () => setLessonStudent(student),
										onGraduate: () => {
											setGraduateStudent(student);
											setGraduateSchool(student.advancement?.[0]?.school || student.tiers[0]?.school || "");
										},
										onEdit: () => {
											setEditStudent(student);
											setEditName(student.name);
											setEditSpec(student.specializationSchool ?? "");
											const schools = uniqueSorted((student.learnableTiers ?? student.tiers).filter((t) => t.level > 1).map((t) => t.school));
											setRevertSchool(schools[0] ?? "");
										},
										onStatus: (status) => mutate.mutate(() => updateStudentFn({ data: {
											pin,
											studentId: student.id,
											status
										} })),
										onGrantPerk: (perkId) => mutate.mutate(() => grantPerkFn({ data: {
											pin,
											studentId: student.id,
											perkId
										} }))
									}, student.id))
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "grants",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrantQueue, {
									students: roster.students,
									canGrant,
									busy: mutate.isPending,
									onGrant: (spellRowId) => mutate.mutate(() => grantSpellFn({ data: {
										pin,
										spellRowId
									} }))
								})
							}),
							canLists ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "lists",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListsPanel, {
									institutions: roster.institutions,
									spells: roster.catalogSpells,
									perks: roster.catalogPerks,
									tiers: roster.tiers,
									busy: mutate.isPending,
									onSaveInstitution: async (input) => {
										try {
											const result = await saveInstitutionFn({ data: {
												pin,
												...input
											} });
											if (!result.ok) throw new Error(result.error);
											await invalidate();
											return true;
										} catch (err) {
											toast(err instanceof Error ? err.message : "Failed");
											return false;
										}
									},
									onSaveSpell: async (input) => {
										try {
											const result = await saveSpellFn({ data: {
												pin,
												...input
											} });
											if (!result.ok) throw new Error(result.error);
											await invalidate();
											return true;
										} catch (err) {
											toast(err instanceof Error ? err.message : "Failed");
											return false;
										}
									},
									onSavePerk: async (input) => {
										try {
											const result = await savePerkFn({ data: {
												pin,
												...input
											} });
											if (!result.ok) throw new Error(result.error);
											await invalidate();
											return true;
										} catch (err) {
											toast(err instanceof Error ? err.message : "Failed");
											return false;
										}
									},
									onSaveTiers: async (levels) => {
										try {
											const result = await saveTiersFn({ data: {
												pin,
												levels
											} });
											if (!result.ok) throw new Error(result.error);
											await invalidate();
											return true;
										} catch (err) {
											toast(err instanceof Error ? err.message : "Failed");
											return false;
										}
									},
									onSaveMasterPin: async (kind, nextPin) => {
										try {
											const result = await saveMasterPinFn({ data: {
												pin,
												kind,
												nextPin
											} });
											if (!result.ok) throw new Error(result.error);
											return true;
										} catch (err) {
											toast(err instanceof Error ? err.message : "Failed");
											return false;
										}
									}
								})
							}) : null
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonDialog, {
				open: Boolean(lessonStudent),
				onOpenChange: (open) => {
					if (!open) setLessonStudent(null);
				},
				student: lessonStudent,
				institutions: roster?.institutions ?? [],
				catalog: roster?.catalogSpells ?? [],
				role,
				defaultInstitutionId: roster?.institutionId ?? roster?.institutions[0]?.id ?? null,
				busy: mutate.isPending,
				onGraduate: (school) => {
					if (!lessonStudent) return;
					mutate.mutate(async () => {
						const result = await graduateStudentFn({ data: {
							pin,
							studentId: lessonStudent.id,
							school,
							institutionId: roster?.institutionId ?? lessonStudent.tiers.find((t) => t.school === school)?.institutionId ?? void 0
						} });
						if (result.ok) setLessonStudent(null);
						return result;
					});
				},
				onSubmit: (input) => {
					if (!lessonStudent) return;
					mutate.mutate(async () => {
						const result = await logLessonFn({ data: {
							pin,
							studentId: lessonStudent.id,
							...input
						} });
						if (result.ok) {
							toast("Lesson saved");
							setLessonStudent(null);
						}
						return result;
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(graduateStudent),
				onOpenChange: (open) => !open && setGraduateStudent(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Graduate" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: graduateSchool,
						onValueChange: setGraduateSchool,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (graduateStudent?.tiers.length ? uniqueSorted(graduateStudent.tiers.map((t) => t.school)) : subjects).map((school) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: school,
							children: school
						}, school)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !graduateStudent || !graduateSchool || mutate.isPending,
						onClick: () => {
							if (!graduateStudent) return;
							mutate.mutate(async () => {
								const result = await graduateStudentFn({ data: {
									pin,
									studentId: graduateStudent.id,
									school: graduateSchool,
									institutionId: roster?.institutionId ?? graduateStudent.tiers.find((t) => t.school === graduateSchool)?.institutionId ?? roster?.institutions[0]?.id
								} });
								if (result.ok) setGraduateStudent(null);
								return result;
							});
						},
						children: "Graduate"
					}) })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: enrollOpen,
				onOpenChange: setEnrollOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Enroll" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "normal-case",
										children: "#refID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-normal normal-case tracking-normal text-muted-foreground",
										children: "Digits under the character's name"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: enrollFormId,
									onChange: (e) => setEnrollFormId(e.target.value),
									placeholder: FORM_ID_PLACEHOLDER,
									autoComplete: "off",
									spellCheck: false,
									className: "font-mono tabular-nums"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: enrollName,
									onChange: (e) => setEnrollName(e.target.value),
									placeholder: NAME_PLACEHOLDER,
									autoComplete: "off"
								})]
							}),
							role === "gm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Institution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: enrollInstId,
									onValueChange: setEnrollInstId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Institution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (roster?.institutions ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item.id,
										children: item.name
									}, item.id)) })]
								})]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !enrollName.trim() || !enrollFormId.trim() || role === "gm" && !enrollInstId || mutate.isPending,
						onClick: () => mutate.mutate(async () => {
							const result = await enrollStudentFn({ data: {
								pin,
								name: enrollName,
								formId: enrollFormId,
								institutionId: role === "gm" ? enrollInstId : roster?.institutionId ?? void 0
							} });
							if (result.ok) {
								setEnrollOpen(false);
								setQuery(setQueryText(query, enrollName.trim()));
								setEnrollFormId("");
							}
							return result;
						}),
						children: "Enroll"
					}) })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(editStudent),
				onOpenChange: (open) => !open && setEditStudent(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit" }) }),
					editStudent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "normal-case",
									children: "#refID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editStudent.formId,
									readOnly: true,
									className: "font-mono tabular-nums"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editName,
									onChange: (e) => setEditName(e.target.value),
									placeholder: NAME_PLACEHOLDER,
									autoComplete: "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Specialization" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editSpec || "__none",
									onValueChange: (v) => setEditSpec(v === "__none" ? "" : v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "None" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "__none",
										children: "None"
									}), subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s))] })]
								})]
							}),
							revertSchools.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Revert graduation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: revertSchool,
										onValueChange: setRevertSchool,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: revertSchools.map((school) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: school,
											children: school
										}, school)) })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										disabled: !revertSchool || mutate.isPending,
										onClick: () => {
											if (!editStudent || !revertSchool) return;
											mutate.mutate(async () => {
												return await revertGraduationFn({ data: {
													pin,
													studentId: editStudent.id,
													school: revertSchool,
													institutionId: roster?.institutionId ?? editStudent.tiers.find((t) => t.school === revertSchool)?.institutionId ?? roster?.institutions[0]?.id
												} });
											});
										},
										children: "Revert"
									})]
								})]
							}) : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !editStudent || !editName.trim() || mutate.isPending,
						onClick: () => {
							if (!editStudent) return;
							mutate.mutate(async () => {
								const result = await updateStudentFn({ data: {
									pin,
									studentId: editStudent.id,
									name: editName,
									specializationSchool: editSpec
								} });
								if (result.ok) setEditStudent(null);
								return result;
							});
						},
						children: "Save"
					}) })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerApp, {});
}
//#endregion
export { Home as component };

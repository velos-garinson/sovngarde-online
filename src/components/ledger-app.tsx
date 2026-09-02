import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, FileSpreadsheet, Lock, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { GrantQueue } from "@/components/grant-queue";
import { LessonDialog } from "@/components/lesson-dialog";
import { ListsPanel } from "@/components/lists-panel";
import { PinGate } from "@/components/pin-gate";
import { StudentCard } from "@/components/student-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import {
  enrollStudentFn,
  graduateStudentFn,
  grantPerkFn,
  grantSpellFn,
  loadRosterFn,
  logLessonFn,
  revertGraduationFn,
  saveInstitutionFn,
  saveMasterPinFn,
  savePerkFn,
  saveSpellFn,
  saveTiersFn,
  unlockWithPin,
  updateStudentFn,
} from "@/lib/api";
import { downloadRosterWorkbook } from "@/lib/excel";
import {
  APP_NAME,
  ENROLLED_FILTERS,
  FORM_ID_PLACEHOLDER,
  NAME_PLACEHOLDER,
  SORT_LABEL,
  STATUS_LABEL,
  STUDENT_STATUSES,
  parseRosterQuery,
  setQueryText,
  setQueryToken,
  sortRoster,
  studentMatchesQuery,
  uniqueSorted,
  type RosterPayload,
  type RosterSort,
  type Student,
  type StudentStatus,
} from "@/lib/ledger";
import { clearSession, readSession, writeSession, type ClientSession } from "@/lib/session";
import { cn } from "@/lib/utils";

function sessionPin(session: ClientSession | null): string | null {
  return session?.pin ?? null;
}

const PORTAL_MS = 500;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LedgerApp() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<ClientSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [warping, setWarping] = useState(false);
  const [fromPortal, setFromPortal] = useState(false);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState("roster");
  const [lessonStudent, setLessonStudent] = useState<Student | null>(null);
  const [graduateStudent, setGraduateStudent] = useState<Student | null>(null);
  const [graduateSchool, setGraduateSchool] = useState("");
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollName, setEnrollName] = useState("");
  const [enrollFormId, setEnrollFormId] = useState("");
  const [enrollInstId, setEnrollInstId] = useState("");
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState("");
  const [editSpec, setEditSpec] = useState("");
  const [revertSchool, setRevertSchool] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
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
      const result = await loadRosterFn({ data: { pin: pin! } });
      if (!result.ok) {
        clearSession();
        setSession(null);
        throw new Error(result.error);
      }
      return result.roster;
    },
  });

  const roster: RosterPayload | undefined = rosterQuery.data;
  const parsed = parseRosterQuery(query);

  const visible = useMemo(() => {
    if (!roster) return [];
    const matched = roster.students.filter((student) => studentMatchesQuery(student, parsed, roster.role === "gm"));
    return sortRoster(matched, parsed.sort, roster.role !== "teacher");
  }, [roster, parsed]);

  const nameSuggestions = useMemo(() => {
    if (!roster) return [];
    const text = parsed.text.trim().toLowerCase();
    if (!text) return [];
    return roster.students
      .filter((s) => s.name.toLowerCase().includes(text) || s.formId.toLowerCase().includes(text))
      .slice(0, 8);
  }, [roster, parsed.text]);

  const subjects = useMemo(() => {
    if (!roster) return [];
    if (roster.role === "teacher") return roster.institutions[0]?.subjects ?? [];
    return uniqueSorted(roster.institutions.flatMap((i) => i.subjects));
  }, [roster]);

  async function handleUnlock(nextPin: string) {
    setUnlocking(true);
    setPinError(null);
    try {
      const result = await unlockWithPin({ data: { pin: nextPin } });
      if (!result.ok) {
        setPinError(result.error);
        return;
      }
      const next: ClientSession =
        result.role === "teacher"
          ? { role: "teacher", pin: nextPin, institutionId: result.institutionId, institutionName: result.institutionName }
          : { role: result.role, pin: nextPin };
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
    mutationFn: async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
      const result = await fn();
      if (!result.ok) throw new Error(result.error || "Failed");
      return result;
    },
    onSuccess: () => invalidate(),
    onError: (err: Error) => toast(err.message),
  });

  if (!hydrated || !session) {
    return (
      <>
        <PinGate onUnlock={handleUnlock} error={pinError} busy={unlocking} warping={warping} />
        <Toaster />
      </>
    );
  }

  const role = roster?.role ?? session.role;
  const canTeach = role === "gm" || role === "teacher";
  const canGrant = role === "gm" || role === "grantor";
  const canLists = role === "gm";
  const showRoster = role !== "grantor";
  const revertSchools = uniqueSorted(
    (editStudent?.learnableTiers ?? editStudent?.tiers ?? []).filter((t) => t.level > 1).map((t) => t.school),
  );

  return (
    <div className={cn("min-h-dvh bg-background text-foreground", fromPortal && "app-arrive")}>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/keizaal-mark.png"
              alt=""
              width={36}
              height={36}
              draggable={false}
              className="size-9 shrink-0 select-none"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {role === "teacher"
                  ? session.role === "teacher"
                    ? session.institutionName
                    : roster?.institutionName
                  : role === "gm"
                    ? "GM"
                    : "Grantor"}
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
            </div>
          </div>
          <Button variant="ghost" onClick={lock} className="self-start sm:self-auto">
            <Lock className="size-4" />
            Lock
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {rosterQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading</p> : null}
        {rosterQuery.isError ? <p className="text-sm text-destructive">Could not load roster.</p> : null}
        {roster ? (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              {showRoster ? <TabsTrigger value="roster">Roster</TabsTrigger> : null}
              <TabsTrigger value="grants">Needs Grant</TabsTrigger>
              {canLists ? <TabsTrigger value="lists">Lists</TabsTrigger> : null}
            </TabsList>

            {showRoster ? (
              <TabsContent value="roster" className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
                    <Input
                      className="pl-9"
                      value={query}
                      placeholder={NAME_PLACEHOLDER}
                      autoComplete="off"
                      onFocus={() => setSuggestOpen(true)}
                      onBlur={() => window.setTimeout(() => setSuggestOpen(false), 120)}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSuggestOpen(true);
                      }}
                    />
                    {suggestOpen && nameSuggestions.length > 0 ? (
                      <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-card py-1 shadow-[var(--shadow-border)]">
                        {nameSuggestions.map((student) => (
                          <li key={student.id}>
                            <button
                              type="button"
                              className="flex h-10 w-full items-center justify-between gap-3 px-3 text-left text-sm hover:bg-elevated"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setQuery(setQueryText(query, student.name));
                                setSuggestOpen(false);
                              }}
                            >
                              <span>{student.name}</span>
                              {student.formId ? (
                                <span className="font-mono text-xs tabular-nums text-subtle">{student.formId}</span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" className="shrink-0">
                        Filters
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Subject</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "subject", ""))}>Any</DropdownMenuItem>
                          {subjects.map((subject) => (
                            <DropdownMenuItem key={subject} onSelect={() => setQuery(setQueryToken(query, "subject", subject))}>
                              {subject}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "status", ""))}>Any</DropdownMenuItem>
                          {STUDENT_STATUSES.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onSelect={() => setQuery(setQueryToken(query, "status", STATUS_LABEL[status]))}
                            >
                              {STATUS_LABEL[status]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Enrolled</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "enrolled", ""))}>Any</DropdownMenuItem>
                          {ENROLLED_FILTERS.map((item) => (
                            <DropdownMenuItem key={item.value} onSelect={() => setQuery(setQueryToken(query, "enrolled", item.value))}>
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Grant</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "grant", ""))}>Any</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "grant", "pending"))}>Pending</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "grant", "overdue"))}>Overdue</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      {role === "gm" ? (
                        <DropdownMenuItem onSelect={() => setQuery(setQueryToken(query, "week", parsed.week === "over" ? "" : "over"))}>
                          Over weekly limit
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Sort</DropdownMenuLabel>
                      {(Object.keys(SORT_LABEL) as RosterSort[]).map((key) => (
                        <DropdownMenuItem key={key} onSelect={() => setQuery(setQueryToken(query, "sort", key))}>
                          {SORT_LABEL[key]}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="secondary" className="shrink-0" onClick={() => downloadRosterWorkbook(roster.students)}>
                    <FileSpreadsheet className="size-4" />
                    {role === "gm" ? "Export full db" : "Export institution db"}
                  </Button>
                  {canTeach ? (
                    <Button
                      onClick={() => {
                        setEnrollName(parsed.text);
                        setEnrollFormId("");
                        setEnrollInstId(
                          roster.institutionId ??
                            roster.institutions.find((i) => i.name === "College of Winterhold")?.id ??
                            roster.institutions[0]?.id ??
                            "",
                        );
                        setEnrollOpen(true);
                      }}
                    >
                      <Plus className="size-4" />
                      Enroll
                    </Button>
                  ) : null}
                </div>

                {visible.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No students.</p>
                ) : (
                  <div className="space-y-2">
                    {visible.map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        open={openId === student.id}
                        onToggle={() => setOpenId((id) => (id === student.id ? null : student.id))}
                        canTeach={canTeach}
                        isGm={role === "gm"}
                        perks={roster.catalogPerks}
                        onLesson={() => setLessonStudent(student)}
                        onGraduate={() => {
                          setGraduateStudent(student);
                          setGraduateSchool(student.advancement?.[0]?.school || student.tiers[0]?.school || "");
                        }}
                        onEdit={() => {
                          setEditStudent(student);
                          setEditName(student.name);
                          setEditSpec(student.specializationSchool ?? "");
                          const schools = uniqueSorted(
                            (student.learnableTiers ?? student.tiers).filter((t) => t.level > 1).map((t) => t.school),
                          );
                          setRevertSchool(schools[0] ?? "");
                        }}
                        onStatus={(status) =>
                          mutate.mutate(() => updateStudentFn({ data: { pin: pin!, studentId: student.id, status } }))
                        }
                        onGrantPerk={(perkId) =>
                          mutate.mutate(() => grantPerkFn({ data: { pin: pin!, studentId: student.id, perkId } }))
                        }
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ) : null}

            <TabsContent value="grants">
              <GrantQueue
                students={roster.students}
                canGrant={canGrant}
                busy={mutate.isPending}
                onGrant={(spellRowId) => mutate.mutate(() => grantSpellFn({ data: { pin: pin!, spellRowId } }))}
              />
            </TabsContent>

            {canLists ? (
              <TabsContent value="lists">
                <ListsPanel
                  institutions={roster.institutions}
                  spells={roster.catalogSpells}
                  perks={roster.catalogPerks}
                  tiers={roster.tiers}
                  busy={mutate.isPending}
                  onSaveInstitution={async (input) => {
                    try {
                      const result = await saveInstitutionFn({ data: { pin: pin!, ...input } });
                      if (!result.ok) throw new Error(result.error);
                      await invalidate();
                      return true;
                    } catch (err) {
                      toast(err instanceof Error ? err.message : "Failed");
                      return false;
                    }
                  }}
                  onSaveSpell={async (input) => {
                    try {
                      const result = await saveSpellFn({ data: { pin: pin!, ...input } });
                      if (!result.ok) throw new Error(result.error);
                      await invalidate();
                      return true;
                    } catch (err) {
                      toast(err instanceof Error ? err.message : "Failed");
                      return false;
                    }
                  }}
                  onSavePerk={async (input) => {
                    try {
                      const result = await savePerkFn({ data: { pin: pin!, ...input } });
                      if (!result.ok) throw new Error(result.error);
                      await invalidate();
                      return true;
                    } catch (err) {
                      toast(err instanceof Error ? err.message : "Failed");
                      return false;
                    }
                  }}
                  onSaveTiers={async (levels) => {
                    try {
                      const result = await saveTiersFn({ data: { pin: pin!, levels } });
                      if (!result.ok) throw new Error(result.error);
                      await invalidate();
                      return true;
                    } catch (err) {
                      toast(err instanceof Error ? err.message : "Failed");
                      return false;
                    }
                  }}
                  onSaveMasterPin={async (kind, nextPin) => {
                    try {
                      const result = await saveMasterPinFn({ data: { pin: pin!, kind, nextPin } });
                      if (!result.ok) throw new Error(result.error);
                      return true;
                    } catch (err) {
                      toast(err instanceof Error ? err.message : "Failed");
                      return false;
                    }
                  }}
                />
              </TabsContent>
            ) : null}
          </Tabs>
        ) : null}
      </main>

      <LessonDialog
        open={Boolean(lessonStudent)}
        onOpenChange={(open) => {
          if (!open) setLessonStudent(null);
        }}
        student={lessonStudent}
        institutions={roster?.institutions ?? []}
        catalog={roster?.catalogSpells ?? []}
        role={role}
        defaultInstitutionId={roster?.institutionId ?? roster?.institutions[0]?.id ?? null}
        busy={mutate.isPending}
        onGraduate={(school) => {
          if (!lessonStudent) return;
          mutate.mutate(async () => {
            const result = await graduateStudentFn({
              data: {
                pin: pin!,
                studentId: lessonStudent.id,
                school,
                institutionId:
                  roster?.institutionId ?? lessonStudent.tiers.find((t) => t.school === school)?.institutionId ?? undefined,
              },
            });
            if (result.ok) setLessonStudent(null);
            return result;
          });
        }}
        onSubmit={(input) => {
          if (!lessonStudent) return;
          mutate.mutate(async () => {
            const result = await logLessonFn({
              data: {
                pin: pin!,
                studentId: lessonStudent.id,
                ...input,
              },
            });
            if (result.ok) {
              toast("Lesson saved");
              setLessonStudent(null);
            }
            return result;
          });
        }}
      />

      <Dialog open={Boolean(graduateStudent)} onOpenChange={(open) => !open && setGraduateStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Graduate</DialogTitle>
          </DialogHeader>
          <Select value={graduateSchool} onValueChange={setGraduateSchool}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {(graduateStudent?.tiers.length
                ? uniqueSorted(graduateStudent.tiers.map((t) => t.school))
                : subjects
              ).map((school) => (
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              disabled={!graduateStudent || !graduateSchool || mutate.isPending}
              onClick={() => {
                if (!graduateStudent) return;
                mutate.mutate(async () => {
                  const result = await graduateStudentFn({
                    data: {
                      pin: pin!,
                      studentId: graduateStudent.id,
                      school: graduateSchool,
                      institutionId:
                        roster?.institutionId ??
                        graduateStudent.tiers.find((t) => t.school === graduateSchool)?.institutionId ??
                        roster?.institutions[0]?.id,
                    },
                  });
                  if (result.ok) setGraduateStudent(null);
                  return result;
                });
              }}
            >
              Graduate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <label className="space-y-1.5">
              <span className="block space-y-0.5">
                <Label className="normal-case">#refID</Label>
                <span className="block text-xs font-normal normal-case tracking-normal text-muted-foreground">
                  Digits under the character's name
                </span>
              </span>
              <Input
                value={enrollFormId}
                onChange={(e) => setEnrollFormId(e.target.value)}
                placeholder={FORM_ID_PLACEHOLDER}
                autoComplete="off"
                spellCheck={false}
                className="font-mono tabular-nums"
              />
            </label>
            <label className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={enrollName}
                onChange={(e) => setEnrollName(e.target.value)}
                placeholder={NAME_PLACEHOLDER}
                autoComplete="off"
              />
            </label>
            {role === "gm" ? (
              <label className="space-y-1.5">
                <Label>Institution</Label>
                <Select value={enrollInstId} onValueChange={setEnrollInstId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roster?.institutions ?? []).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              disabled={!enrollName.trim() || !enrollFormId.trim() || (role === "gm" && !enrollInstId) || mutate.isPending}
              onClick={() =>
                mutate.mutate(async () => {
                  const result = await enrollStudentFn({
                    data: {
                      pin: pin!,
                      name: enrollName,
                      formId: enrollFormId,
                      institutionId: role === "gm" ? enrollInstId : (roster?.institutionId ?? undefined),
                    },
                  });
                  if (result.ok) {
                    setEnrollOpen(false);
                    setQuery(setQueryText(query, enrollName.trim()));
                    setEnrollFormId("");
                  }
                  return result;
                })
              }
            >
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editStudent)} onOpenChange={(open) => !open && setEditStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
          </DialogHeader>
          {editStudent ? (
            <div className="grid gap-3">
              <label className="space-y-1.5">
                <Label className="normal-case">#refID</Label>
                <Input value={editStudent.formId} readOnly className="font-mono tabular-nums" />
              </label>
              <label className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={NAME_PLACEHOLDER}
                  autoComplete="off"
                />
              </label>
              <label className="space-y-1.5">
                <Label>Specialization</Label>
                <Select value={editSpec || "__none"} onValueChange={(v) => setEditSpec(v === "__none" ? "" : v)}>
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
              {revertSchools.length > 0 ? (
                <div className="space-y-1.5">
                  <Label>Revert graduation</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Select value={revertSchool} onValueChange={setRevertSchool}>
                      <SelectTrigger>
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {revertSchools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="secondary"
                      disabled={!revertSchool || mutate.isPending}
                      onClick={() => {
                        if (!editStudent || !revertSchool) return;
                        mutate.mutate(async () => {
                          const result = await revertGraduationFn({
                            data: {
                              pin: pin!,
                              studentId: editStudent.id,
                              school: revertSchool,
                              institutionId:
                                roster?.institutionId ??
                                editStudent.tiers.find((t) => t.school === revertSchool)?.institutionId ??
                                roster?.institutions[0]?.id,
                            },
                          });
                          return result;
                        });
                      }}
                    >
                      Revert
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              disabled={!editStudent || !editName.trim() || mutate.isPending}
              onClick={() => {
                if (!editStudent) return;
                mutate.mutate(async () => {
                  const result = await updateStudentFn({
                    data: {
                      pin: pin!,
                      studentId: editStudent.id,
                      name: editName,
                      specializationSchool: editSpec,
                    },
                  });
                  if (result.ok) setEditStudent(null);
                  return result;
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}

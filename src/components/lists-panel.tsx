import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SCHOOLS } from "@/lib/catalog";
import type { CatalogPerk, CatalogSpell, InstitutionRecord } from "@/lib/ledger";
import { cn } from "@/lib/utils";

export function ListsPanel({
  institutions,
  spells,
  perks,
  tiers,
  onSaveInstitution,
  onSaveSpell,
  onSavePerk,
  onSaveTiers,
  onSaveMasterPin,
  busy,
}: {
  institutions: InstitutionRecord[];
  spells: CatalogSpell[];
  perks: CatalogPerk[];
  tiers: number[];
  onSaveInstitution: (input: {
    id?: string;
    name: string;
    weeklySpellLimit: number;
    perSchoolLimit: number;
    isAntagonist: boolean;
    advancementMin: number;
    subjects: string[];
    newPin?: string;
  }) => Promise<boolean>;
  onSaveSpell: (input: { id?: string; name: string; school: string; tier: number; formId: string; hidden: boolean }) => Promise<boolean>;
  onSavePerk: (input: { id?: string; school: string; rank: string; formId: string; unlock: string; prohibited: boolean }) => Promise<boolean>;
  onSaveTiers: (levels: number[]) => Promise<boolean>;
  onSaveMasterPin: (kind: "gm" | "grantor", nextPin: string) => Promise<boolean>;
  busy: boolean;
}) {
  const [instId, setInstId] = useState(institutions[0]?.id ?? "");
  const inst = institutions.find((i) => i.id === instId) ?? institutions[0];
  const [instName, setInstName] = useState(inst?.name ?? "");
  const [weekly, setWeekly] = useState(String(inst?.weeklySpellLimit ?? 1));
  const [perSchool, setPerSchool] = useState(String(inst?.perSchoolLimit ?? 0));
  const [advMin, setAdvMin] = useState(String(inst?.advancementMin ?? 1));
  const [antagonist, setAntagonist] = useState(Boolean(inst?.isAntagonist));
  const [subjects, setSubjects] = useState<string[]>(inst?.subjects ?? []);
  const [newPin, setNewPin] = useState("");
  const [gmPin, setGmPin] = useState("");
  const [grantorPin, setGrantorPin] = useState("");
  const [tierDraft, setTierDraft] = useState(tiers.join(", "));
  const [spellName, setSpellName] = useState("");
  const [spellSchool, setSpellSchool] = useState<string>(DEFAULT_SCHOOLS[0]);
  const [spellTier, setSpellTier] = useState("1");
  const [spellForm, setSpellForm] = useState("");
  const [perkSchool, setPerkSchool] = useState("Destruction");
  const [perkRank, setPerkRank] = useState("Adept");
  const [perkForm, setPerkForm] = useState("");
  const [perkUnlock, setPerkUnlock] = useState("");

  function loadInst(id: string) {
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

  function toggleSubject(school: string) {
    setSubjects((prev) => (prev.includes(school) ? prev.filter((s) => s !== school) : [...prev, school]));
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Institutions</h2>
        <div className="mt-3 grid gap-3">
          <label className="space-y-1.5">
            <Label>Select</Label>
            <select
              className="flex h-11 w-full rounded-sm border border-border bg-elevated px-3 text-sm"
              value={instId}
              onChange={(e) => loadInst(e.target.value)}
            >
              {institutions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                  {item.isAntagonist ? " (antagonist)" : ""}
                </option>
              ))}
              <option value="">New</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <Label>Name</Label>
            <Input value={instName} onChange={(e) => setInstName(e.target.value)} />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5">
              <Label>Weekly cap</Label>
              <Input type="number" min={1} value={weekly} onChange={(e) => setWeekly(e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <Label>Per subject</Label>
              <Input type="number" min={0} value={perSchool} onChange={(e) => setPerSchool(e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <Label>Graduate min</Label>
              <Input type="number" min={1} value={advMin} onChange={(e) => setAdvMin(e.target.value)} />
            </label>
          </div>
          <label className="flex h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={antagonist} onChange={(e) => setAntagonist(e.target.checked)} />
            Antagonist
          </label>
          <div>
            <Label>Subjects</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEFAULT_SCHOOLS.map((school) => (
                <button
                  key={school}
                  type="button"
                  onClick={() => toggleSubject(school)}
                  className={cn(
                    "h-9 rounded-sm border px-3 text-sm transition-colors",
                    subjects.includes(school)
                      ? "border-accent bg-elevated text-foreground"
                      : "border-border text-muted-foreground hover:bg-elevated",
                  )}
                >
                  {school}
                </button>
              ))}
            </div>
          </div>
          <label className="space-y-1.5">
            <Label>New PIN</Label>
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          <Button
            disabled={busy || !instName.trim()}
            onClick={async () => {
              const ok = await onSaveInstitution({
                id: instId || undefined,
                name: instName,
                weeklySpellLimit: Number(weekly) || 1,
                perSchoolLimit: Number(perSchool) || 0,
                isAntagonist: antagonist,
                advancementMin: Number(advMin) || 1,
                subjects,
                newPin: newPin || undefined,
              });
              if (ok) {
                toast("Institution saved");
                setNewPin("");
              }
            }}
          >
            Save institution
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Access PINs</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <Label>GM PIN</Label>
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={6}
              value={gmPin}
              onChange={(e) => setGmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          <label className="space-y-1.5">
            <Label>Grantor PIN</Label>
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={6}
              value={grantorPin}
              onChange={(e) => setGrantorPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={busy || gmPin.length !== 6}
            onClick={async () => {
              if (await onSaveMasterPin("gm", gmPin)) {
                toast("GM PIN saved");
                setGmPin("");
              }
            }}
          >
            Save GM PIN
          </Button>
          <Button
            variant="secondary"
            disabled={busy || grantorPin.length !== 6}
            onClick={async () => {
              if (await onSaveMasterPin("grantor", grantorPin)) {
                toast("Grantor PIN saved");
                setGrantorPin("");
              }
            }}
          >
            Save Grantor PIN
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Tiers</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input value={tierDraft} onChange={(e) => setTierDraft(e.target.value)} />
          <Button
            variant="secondary"
            disabled={busy}
            onClick={async () => {
              const levels = tierDraft
                .split(/[,\s]+/)
                .map((n) => Number(n))
                .filter((n) => Number.isInteger(n) && n > 0);
              if (await onSaveTiers(levels)) toast("Tiers saved");
            }}
          >
            Save tiers
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Spells</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input placeholder="Name" value={spellName} onChange={(e) => setSpellName(e.target.value)} />
          <Input placeholder="Subject" value={spellSchool} onChange={(e) => setSpellSchool(e.target.value)} />
          <Input placeholder="Tier" type="number" value={spellTier} onChange={(e) => setSpellTier(e.target.value)} />
          <Input placeholder="Form ID" value={spellForm} onChange={(e) => setSpellForm(e.target.value)} />
        </div>
        <Button
          className="mt-3"
          variant="secondary"
          disabled={busy || !spellName.trim()}
          onClick={async () => {
            const ok = await onSaveSpell({
              name: spellName,
              school: spellSchool,
              tier: Number(spellTier) || 1,
              formId: spellForm,
              hidden: false,
            });
            if (ok) {
              toast("Spell saved");
              setSpellName("");
              setSpellForm("");
            }
          }}
        >
          Add spell
        </Button>
        <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm">
          {spells.map((spell) => (
            <li key={spell.id} className="flex justify-between gap-2 border-b border-border/60 py-1.5">
              <span>
                {spell.name}{" "}
                <span className="text-muted-foreground">
                  T{spell.tier} {spell.school}
                </span>
              </span>
              <span className="font-mono text-xs text-subtle">{spell.formId}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-semibold">Perks</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input placeholder="School" value={perkSchool} onChange={(e) => setPerkSchool(e.target.value)} />
          <Input placeholder="Rank" value={perkRank} onChange={(e) => setPerkRank(e.target.value)} />
          <Input placeholder="Form ID" value={perkForm} onChange={(e) => setPerkForm(e.target.value)} />
          <Input placeholder="Unlock" value={perkUnlock} onChange={(e) => setPerkUnlock(e.target.value)} />
        </div>
        <Button
          className="mt-3"
          variant="secondary"
          disabled={busy || !perkSchool.trim() || !perkRank.trim()}
          onClick={async () => {
            const ok = await onSavePerk({
              school: perkSchool,
              rank: perkRank,
              formId: perkForm,
              unlock: perkUnlock,
              prohibited: false,
            });
            if (ok) {
              toast("Perk saved");
              setPerkForm("");
            }
          }}
        >
          Add perk
        </Button>
        <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm">
          {perks.map((perk) => (
            <li key={perk.id} className="flex justify-between gap-2 border-b border-border/60 py-1.5">
              <span>
                {perk.rank} {perk.school}
                {perk.prohibited ? " · prohibited" : ""}
              </span>
              <span className="font-mono text-xs text-subtle">{perk.formId}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

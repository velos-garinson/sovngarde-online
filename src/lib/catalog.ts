export const DEFAULT_INSTITUTIONS = [
  "College of Winterhold",
  "Synod",
  "Thalmor",
  "Vigil",
  "Other",
] as const;

export const DEFAULT_SCHOOLS = [
  "Pyromancy",
  "Cryomancy",
  "Aeromancy",
  "Restoration",
  "Alteration",
  "Illusion",
  "Conjuration",
  "Necromancy",
  "Vigil",
] as const;

export const COLLEGE_SUBJECTS = [
  "Pyromancy",
  "Cryomancy",
  "Aeromancy",
  "Restoration",
  "Alteration",
  "Illusion",
  "Conjuration",
] as const;

export const DEFAULT_SUBJECTS_BY_INSTITUTION: Record<string, readonly string[]> = {
  "College of Winterhold": COLLEGE_SUBJECTS,
  Synod: COLLEGE_SUBJECTS,
  Thalmor: [...COLLEGE_SUBJECTS, "Necromancy"],
  Vigil: ["Vigil", "Restoration", "Alteration", "Illusion"],
  Other: COLLEGE_SUBJECTS,
};

export const DEFAULT_TIERS = [1, 2, 3, 4, 5] as const;

export interface CatalogSpell {
  id: string;
  name: string;
  school: string;
  tier: number;
  formId: string;
  hidden: boolean;
}

export interface CatalogPerk {
  id: string;
  school: string;
  rank: string;
  formId: string;
  unlock: string;
  prohibited: boolean;
}

type SpellRow = [school: string, tier: number, name: string, formId: string];

const SPELL_ROWS: SpellRow[] = [
  ["Pyromancy", 1, "Firebolt", "0x12FD0"],
  ["Pyromancy", 2, "Flame Cloak", "0x3AE9F"],
  ["Pyromancy", 2, "Ignite", "0x402732B"],
  ["Pyromancy", 3, "Fire Rune", "0x5DB90"],
  ["Pyromancy", 3, "Fireball", "0x1C789"],
  ["Pyromancy", 4, "Fire Flow", "0x4028587"],
  ["Pyromancy", 4, "Flames", "0x12FCD"],
  ["Pyromancy", 4, "Incinerate", "0x10F7ED"],
  ["Cryomancy", 1, "Ice Spike", "0x2B96C"],
  ["Cryomancy", 2, "Frost Cloak", "0x3AEA2"],
  ["Cryomancy", 2, "Freeze", "0x402732D"],
  ["Cryomancy", 2, "Icy Spear", "0x10F7EC"],
  ["Cryomancy", 3, "Frost Rune", "0x6796F"],
  ["Cryomancy", 3, "Ice Volley", "0xEFC5F"],
  ["Cryomancy", 4, "Frost Flow", "0x4028589"],
  ["Cryomancy", 4, "Frostbite", "0x2B96B"],
  ["Cryomancy", 4, "Ice Storm", "0x45F9C"],
  ["Aeromancy", 1, "Lightning Bolt", "0x02DD29"],
  ["Aeromancy", 2, "Lightning Cloak", "0x3AEA3"],
  ["Aeromancy", 2, "Whirlwind Cloak", "0x401772D"],
  ["Aeromancy", 2, "Thunderbolt", "0x10F7EE"],
  ["Aeromancy", 3, "Lightning Rune", "0x67970"],
  ["Aeromancy", 3, "Cyclone", "0x401AAAE"],
  ["Aeromancy", 4, "Storm Flow", "0x402858A"],
  ["Aeromancy", 4, "Sparks", "0x2DD2A"],
  ["Aeromancy", 4, "Chain Lightning", "0x401AAAE"],
  ["Restoration", 1, "Lesser Ward", "0x13018"],
  ["Restoration", 1, "Fast Healing", "0x2F3B8"],
  ["Restoration", 1, "Heal Other", "0x12FD2"],
  ["Restoration", 1, "Turn Lesser Undead", "0x4B146"],
  ["Restoration", 2, "Steadfast Ward", "0x211F1"],
  ["Restoration", 2, "Close Wounds", "0xB62EF"],
  ["Restoration", 2, "Turn Undead", "0x5DD5D"],
  ["Restoration", 3, "Avoid Death", "0xA3F63"],
  ["Restoration", 3, "Greater Ward", "0x211F0"],
  ["Restoration", 3, "Repel Lesser Undead", "0x4D3F8"],
  ["Restoration", 3, "Poison Rune", "0x401D74B"],
  ["Restoration", 4, "Healing", "0x12FCC"],
  ["Restoration", 4, "Healing Hands", "0x4D3F2"],
  ["Restoration", 4, "Meridia's Light", "0xFEE36"],
  ["Restoration", 4, "Mora's Curse", "0x403B548"],
  ["Alteration", 1, "Magelight", "0x43323"],
  ["Alteration", 1, "Candlelight", "0x43324"],
  ["Alteration", 1, "Oakflesh", "0x5AD5C"],
  ["Alteration", 2, "Waterbreathing", "0x5D175"],
  ["Alteration", 2, "Stoneflesh", "0x5AD5D"],
  ["Alteration", 2, "Ash Shell", "0x4017731"],
  ["Alteration", 3, "Ash Rune", "0x40177AF"],
  ["Alteration", 3, "Ironflesh", "0x51B16"],
  ["Alteration", 3, "Telekinesis", "0x1A4CC"],
  ["Alteration", 4, "Paralyze", "0x5AD5F"],
  ["Alteration", 4, "Ebonyflesh", "0x5AD5E"],
  ["Alteration", 4, "Equilibrium", "0xDA746"],
  ["Illusion", 1, "Clairvoyance", "0x21143"],
  ["Illusion", 1, "Courage", "0x4DEE8"],
  ["Illusion", 1, "Fury", "0x4DEEB"],
  ["Illusion", 2, "Calm", "0x4DEE9"],
  ["Illusion", 2, "Fear", "0x4DEEA"],
  ["Illusion", 2, "Muffle", "0x8F3EB"],
  ["Illusion", 3, "Frenzy", "0x4DEEE"],
  ["Illusion", 3, "Rally", "0x4DEEC"],
  ["Illusion", 3, "Frenzy Rune", "0x40177B7"],
  ["Illusion", 3, "Invisibility", "0x27EB6"],
  ["Illusion", 4, "Rout", "0x4DEEF"],
  ["Illusion", 4, "Pacify", "0x4DEED"],
  ["Illusion", 4, "Knowledge Drain", "0x4028E81"],
  ["Illusion", 4, "Seeker Drain", "0x4028e80"],
  ["Conjuration", 1, "Bound Dagger", ""],
  ["Conjuration", 1, "Conjure Familiar", "0x640B6"],
  ["Conjuration", 2, "Bound Sword", ""],
  ["Conjuration", 2, "Bound Battleaxe", ""],
  ["Conjuration", 2, "Banish Daedra", "0x6D22C"],
  ["Conjuration", 3, "Bound Bow", ""],
  ["Conjuration", 3, "Conjure Flame Atronach", ""],
  ["Conjuration", 3, "Conjure Frost Atronach", ""],
  ["Conjuration", 3, "Conjure Storm Atronach", ""],
  ["Conjuration", 3, "Vortex", "0x2010ff3"],
  ["Conjuration", 4, "Ash Guardian", "0x40296ba"],
  ["Conjuration", 4, "Summon Unbound Dremora", "0x99f39"],
  ["Conjuration", 4, "Spectral Arrow", "0xAB23D"],
  ["Conjuration", 5, "Command Daedra", "0x6F953"],
  ["Conjuration", 5, "Soul Trap", "0x4DBA4"],
  ["Conjuration", 5, "Summon Portal", "0xC3EC0"],
  ["Necromancy", 1, "Raise Zombie", "0x7E8E1"],
  ["Necromancy", 2, "Heal Undead", "0x200E8D4"],
  ["Necromancy", 2, "Reanimate Corpse", "0x65BD7"],
  ["Necromancy", 3, "Vortex", "0x2010ff3"],
  ["Necromancy", 3, "Revenant", "0x96D94"],
  ["Necromancy", 4, "Equilibrium", "0xDA746"],
  ["Necromancy", 4, "Dread Zombie", "0x96D95"],
  ["Necromancy", 5, "Soul Trap", "0x4DBA4"],
  ["Necromancy", 5, "Dead Thrall", "0x7E8DF"],
  ["Vigil", 1, "Lesser Ward", "0x13018"],
  ["Vigil", 1, "Fast Healing", "0x2F3B8"],
  ["Vigil", 1, "Heal Other", "0x12FD2"],
  ["Vigil", 1, "Magelight", "0x43323"],
  ["Vigil", 1, "Turn Lesser Undead", "0x4B146"],
  ["Vigil", 2, "Steadfast Ward", "0x211F1"],
  ["Vigil", 2, "Courage", "0x4DEE8"],
  ["Vigil", 2, "Banish Daedra", "0x6D22C"],
  ["Vigil", 2, "Turn Undead", "0x5DD5D"],
  ["Vigil", 3, "Avoid Death", "0xA3F63"],
  ["Vigil", 3, "Greater Ward", "0x211F0"],
  ["Vigil", 3, "Repel Lesser Undead", "0x4D3F8"],
  ["Vigil", 3, "Fear", "0x4DEEA"],
  ["Vigil", 4, "Healing", "0x12FCC"],
  ["Vigil", 4, "Healing Hands", "0x4D3F2"],
  ["Vigil", 4, "Rally", "0x4DEEC"],
  ["Vigil", 4, "Circle of Protection", "0x5312D"],
  ["Vigil", 5, "Vision of the 10th Eye", ""],
  ["Vigil", 5, "Grand Healing", ""],
];

function slug(...parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const DEFAULT_SPELLS: CatalogSpell[] = SPELL_ROWS.map(([school, tier, name, formId]) => ({
  id: slug(school, name),
  name,
  school,
  tier,
  formId,
  hidden: false,
}));

const PERK_SCHOOLS = ["Destruction", "Alteration", "Illusion", "Restoration", "Conjuration"] as const;

const PERK_FORMS: Record<string, Record<string, string>> = {
  Destruction: { Novice: "0xF2CA8", Adept: "0xC44C0", Expert: "0xC44C1", Master: "0xC44C2" },
  Alteration: { Novice: "0xF2CA6", Adept: "0xC44B8", Expert: "0xC44B9", Master: "0xC44BA" },
  Illusion: { Novice: "0xF2CA9", Adept: "0xC44C4", Expert: "0xC44C5", Master: "0xC44C6" },
  Restoration: { Novice: "0xF2CAA", Adept: "0xC44C8", Expert: "0xC44C9", Master: "0xC44CA" },
  Conjuration: { Novice: "0xF2CA6", Adept: "0xC44BC", Expert: "0xC44BD", Master: "0xC44BE" },
};

const PERK_RANKS: { rank: string; unlock: string; prohibited: boolean }[] = [
  { rank: "Novice", unlock: "Unlocked at T5", prohibited: false },
  { rank: "Apprentice", unlock: "FORBIDDEN", prohibited: true },
  { rank: "Adept", unlock: "Unlocked at T2", prohibited: false },
  { rank: "Expert", unlock: "Unlocked at T2", prohibited: false },
  { rank: "Master", unlock: "RP LOCKED", prohibited: false },
];

export const DEFAULT_PERKS: CatalogPerk[] = PERK_SCHOOLS.flatMap((school) =>
  PERK_RANKS.map((row) => ({
    id: slug(school, row.rank),
    school,
    rank: row.rank,
    formId: row.prohibited ? "PROHIBITED" : (PERK_FORMS[school]?.[row.rank] ?? ""),
    unlock: row.unlock,
    prohibited: row.prohibited,
  })),
);

export const PERK_RANK_ORDER = ["Adept", "Expert", "Master", "Novice", "Apprentice"] as const;

export function perkLabel(perk: Pick<CatalogPerk, "rank" | "school">): string {
  return `${perk.rank} ${perk.school}`;
}

export function addPerkCommand(characterName: string, perk: CatalogPerk): string {
  return `/addperk ${characterName} ${perk.formId}`;
}

export function learnSpellCommand(formId: string, playerName: string): string {
  return `/learnspell ${formId} ${playerName}`;
}

export function rankIndex(rank: string): number {
  const i = PERK_RANK_ORDER.indexOf(rank as (typeof PERK_RANK_ORDER)[number]);
  return i === -1 ? PERK_RANK_ORDER.length : i;
}

export function groupPerksBySchool(perks: CatalogPerk[]): { school: string; items: CatalogPerk[] }[] {
  const map = new Map<string, CatalogPerk[]>();
  for (const perk of perks) {
    const list = map.get(perk.school) ?? [];
    list.push(perk);
    map.set(perk.school, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([school, items]) => ({
      school,
      items: [...items].sort((a, b) => rankIndex(a.rank) - rankIndex(b.rank) || a.rank.localeCompare(b.rank)),
    }));
}

export function perkMatchesSubjects(perkSchool: string, subjects: string[]): boolean {
  if (subjects.length === 0) return true;
  const related: Record<string, string[]> = {
    Destruction: ["Pyromancy", "Cryomancy", "Aeromancy"],
    Restoration: ["Restoration", "Vigil"],
    Alteration: ["Alteration", "Vigil"],
    Illusion: ["Illusion", "Vigil"],
    Conjuration: ["Conjuration", "Necromancy"],
  };
  const keys = related[perkSchool] ?? [perkSchool];
  return subjects.some((subject) => {
    const s = subject.toLowerCase();
    if (s === perkSchool.toLowerCase()) return true;
    return keys.some((k) => k.toLowerCase() === s);
  });
}

export function groupSpellsByTier<T extends { tier: number; name: string }>(
  spells: T[],
): { tier: number; items: T[] }[] {
  const map = new Map<number, T[]>();
  for (const spell of spells) {
    const list = map.get(spell.tier) ?? [];
    list.push(spell);
    map.set(spell.tier, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([tier, items]) => ({
      tier,
      items: [...items].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

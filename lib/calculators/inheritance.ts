import type {
  InheritanceInput,
  InheritanceResult,
  InheritanceHeirShare,
  HeirType,
  InheritanceSchool,
} from "./types";
import { getHeirLabel } from "./data/inheritance-rules";

// ============================================================
// Inheritance Calculator — Hanafi & Shia (Ja'fari)
// Muslim Personal Law (Shariat) Application Act 1962
// Quranic injunctions: Surah An-Nisa 4:11-12, 4:176
// ============================================================

// --- Fraction arithmetic helpers ---
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

type Frac = [number, number]; // [numerator, denominator]

function fracAdd(a: Frac, b: Frac): Frac {
  const d = lcm(a[1], b[1]);
  const n = a[0] * (d / a[1]) + b[0] * (d / b[1]);
  const g = gcd(Math.abs(n), d);
  return [n / g, d / g];
}

function fracToDecimal(f: Frac): number {
  return f[1] === 0 ? 0 : f[0] / f[1];
}

// --- Helper: check presence of heir types ---
function has(heirs: Partial<Record<HeirType, number>>, type: HeirType): boolean {
  return (heirs[type] ?? 0) > 0;
}

function count(heirs: Partial<Record<HeirType, number>>, type: HeirType): number {
  return heirs[type] ?? 0;
}

function hasChild(heirs: Partial<Record<HeirType, number>>): boolean {
  return has(heirs, "son") || has(heirs, "daughter") || has(heirs, "sons-son") || has(heirs, "sons-daughter");
}

function hasSon(heirs: Partial<Record<HeirType, number>>): boolean {
  return has(heirs, "son");
}

// ============================================================
// HANAFI ALGORITHM
// ============================================================

function calculateHanafi(input: InheritanceInput): InheritanceResult {
  const { deceasedGender, heirs, estateValue, debts, funeralExpenses, wasiyyah } = input;
  const netEstate = Math.max(0, estateValue - debts - funeralExpenses - wasiyyah);

  // Track shares as fractions
  const shareMap: { type: HeirType; fraction: Frac; basis: string }[] = [];
  const blockedHeirs: { heir: string; blockedBy: string }[] = [];

  // --- Step 1: Apply blocking rules ---
  const blocked = new Set<HeirType>();

  // Son blocks: sons-son, sons-daughter, brothers, sisters
  if (has(heirs, "son")) {
    for (const t of ["sons-son", "sons-daughter", "full-brother", "full-sister", "paternal-half-brother", "paternal-half-sister"] as HeirType[]) {
      if (has(heirs, t)) {
        blocked.add(t);
        blockedHeirs.push({ heir: getHeirLabel(t), blockedBy: "Son" });
      }
    }
  }

  // Father blocks: grandfather, paternal grandmother, brothers, sisters
  if (has(heirs, "father")) {
    for (const t of ["paternal-grandfather", "full-brother", "full-sister", "paternal-half-brother", "paternal-half-sister", "maternal-half-brother", "maternal-half-sister"] as HeirType[]) {
      if (has(heirs, t) && !blocked.has(t)) {
        blocked.add(t);
        blockedHeirs.push({ heir: getHeirLabel(t), blockedBy: "Father" });
      }
    }
  }

  // Full brother blocks: paternal half-brother, paternal half-sister
  if (has(heirs, "full-brother") && !blocked.has("full-brother")) {
    for (const t of ["paternal-half-brother", "paternal-half-sister"] as HeirType[]) {
      if (has(heirs, t) && !blocked.has(t)) {
        blocked.add(t);
        blockedHeirs.push({ heir: getHeirLabel(t), blockedBy: "Full Brother" });
      }
    }
  }

  // Mother blocks: grandmothers
  if (has(heirs, "mother")) {
    for (const t of ["paternal-grandmother", "maternal-grandmother"] as HeirType[]) {
      if (has(heirs, t) && !blocked.has(t)) {
        blocked.add(t);
        blockedHeirs.push({ heir: getHeirLabel(t), blockedBy: "Mother" });
      }
    }
  }

  // Grandfather acts like father if father is absent (blocks siblings in Hanafi)
  if (!has(heirs, "father") && has(heirs, "paternal-grandfather") && !blocked.has("paternal-grandfather")) {
    for (const t of ["full-brother", "full-sister", "paternal-half-brother", "paternal-half-sister", "maternal-half-brother", "maternal-half-sister"] as HeirType[]) {
      if (has(heirs, t) && !blocked.has(t)) {
        blocked.add(t);
        blockedHeirs.push({ heir: getHeirLabel(t), blockedBy: "Paternal Grandfather (acts as Father in Hanafi)" });
      }
    }
  }

  // Two+ daughters block sons-daughter (unless sons-son present)
  if (count(heirs, "daughter") >= 2 && has(heirs, "sons-daughter") && !has(heirs, "sons-son") && !blocked.has("sons-daughter")) {
    blocked.add("sons-daughter");
    blockedHeirs.push({ heir: getHeirLabel("sons-daughter"), blockedBy: "Two or more Daughters" });
  }

  const _has = (t: HeirType) => has(heirs, t) && !blocked.has(t);
  const _count = (t: HeirType) => blocked.has(t) ? 0 : count(heirs, t);
  const _hasChild = () => _has("son") || _has("daughter") || _has("sons-son") || _has("sons-daughter");

  // --- Step 2: Assign fixed shares ---

  // Husband
  if (_has("husband")) {
    const frac: Frac = _hasChild() ? [1, 4] : [1, 2];
    shareMap.push({ type: "husband", fraction: frac, basis: _hasChild() ? "1/4 (with children)" : "1/2 (no children)" });
  }

  // Wife
  if (_has("wife")) {
    const frac: Frac = _hasChild() ? [1, 8] : [1, 4];
    shareMap.push({ type: "wife", fraction: frac, basis: _hasChild() ? "1/8 (with children)" : "1/4 (no children)" });
  }

  // Mother
  if (_has("mother")) {
    const hasChildOrGrandchild = _hasChild();
    const has2PlusSiblings = (_count("full-brother") + _count("full-sister") + _count("paternal-half-brother") + _count("paternal-half-sister") + _count("maternal-half-brother") + _count("maternal-half-sister")) >= 2;

    if (hasChildOrGrandchild || has2PlusSiblings) {
      shareMap.push({ type: "mother", fraction: [1, 6], basis: "1/6 (with children or 2+ siblings)" });
    } else if (!hasChildOrGrandchild && (_has("husband") || _has("wife")) && _has("father")) {
      // Special case: 1/3 of remainder after spouse share
      const spouseShare: Frac = _has("husband") ? [1, 2] : [1, 4];
      const remainder: Frac = [spouseShare[1] - spouseShare[0], spouseShare[1]];
      const motherShare: Frac = [remainder[0], remainder[1] * 3];
      const g = gcd(Math.abs(motherShare[0]), motherShare[1]);
      shareMap.push({ type: "mother", fraction: [motherShare[0] / g, motherShare[1] / g], basis: "1/3 of remainder after spouse (Umariyyatan case)" });
    } else {
      shareMap.push({ type: "mother", fraction: [1, 3], basis: "1/3 (no children, <2 siblings)" });
    }
  }

  // Father
  if (_has("father")) {
    if (_has("son") || _has("sons-son")) {
      shareMap.push({ type: "father", fraction: [1, 6], basis: "1/6 (with male descendant)" });
    } else if (_has("daughter") || _has("sons-daughter")) {
      shareMap.push({ type: "father", fraction: [1, 6], basis: "1/6 + residue (with female descendant only)" });
      // Residue will be handled later
    }
    // If no children at all, father takes residue (handled in residuary step)
  }

  // Paternal Grandfather (same as father in his absence, in Hanafi)
  if (_has("paternal-grandfather") && !_has("father")) {
    if (_has("son") || _has("sons-son")) {
      shareMap.push({ type: "paternal-grandfather", fraction: [1, 6], basis: "1/6 (as father, with male descendant)" });
    } else if (_has("daughter") || _has("sons-daughter")) {
      shareMap.push({ type: "paternal-grandfather", fraction: [1, 6], basis: "1/6 + residue (as father, with female descendant)" });
    }
  }

  // Grandmother(s)
  if (_has("paternal-grandmother") || _has("maternal-grandmother")) {
    const grandmotherCount = (_has("paternal-grandmother") ? 1 : 0) + (_has("maternal-grandmother") ? 1 : 0);
    if (_has("paternal-grandmother")) {
      shareMap.push({ type: "paternal-grandmother", fraction: grandmotherCount === 2 ? [1, 12] : [1, 6], basis: grandmotherCount === 2 ? "1/6 shared equally" : "1/6" });
    }
    if (_has("maternal-grandmother")) {
      shareMap.push({ type: "maternal-grandmother", fraction: grandmotherCount === 2 ? [1, 12] : [1, 6], basis: grandmotherCount === 2 ? "1/6 shared equally" : "1/6" });
    }
  }

  // Daughters (only if no son)
  if (_has("daughter") && !_has("son")) {
    if (_count("daughter") === 1) {
      shareMap.push({ type: "daughter", fraction: [1, 2], basis: "1/2 (one daughter, no son)" });
    } else {
      shareMap.push({ type: "daughter", fraction: [2, 3], basis: "2/3 shared (two+ daughters, no son)" });
    }
  }

  // Son's Daughter (only if no son, with conditions)
  if (_has("sons-daughter") && !_has("son")) {
    if (_count("daughter") === 0) {
      if (_count("sons-daughter") === 1) {
        shareMap.push({ type: "sons-daughter", fraction: [1, 2], basis: "1/2 (one son's daughter, no daughter, no son)" });
      } else {
        shareMap.push({ type: "sons-daughter", fraction: [2, 3], basis: "2/3 shared (two+ son's daughters)" });
      }
    } else if (_count("daughter") === 1) {
      shareMap.push({ type: "sons-daughter", fraction: [1, 6], basis: "1/6 (completing 2/3 with one daughter)" });
    }
  }

  // Full Sisters (only if no children, no father, no grandfather)
  if (_has("full-sister") && !_hasChild() && !_has("father") && !_has("paternal-grandfather")) {
    if (!_has("full-brother")) {
      if (_count("full-sister") === 1) {
        shareMap.push({ type: "full-sister", fraction: [1, 2], basis: "1/2 (one full sister, no children, no father)" });
      } else {
        shareMap.push({ type: "full-sister", fraction: [2, 3], basis: "2/3 shared (two+ full sisters)" });
      }
    }
  }

  // Paternal Half-Sisters
  if (_has("paternal-half-sister") && !_hasChild() && !_has("father") && !_has("paternal-grandfather") && !_has("full-brother")) {
    if (!_has("full-sister")) {
      if (_count("paternal-half-sister") === 1) {
        shareMap.push({ type: "paternal-half-sister", fraction: [1, 2], basis: "1/2 (one paternal half-sister)" });
      } else {
        shareMap.push({ type: "paternal-half-sister", fraction: [2, 3], basis: "2/3 shared (two+ paternal half-sisters)" });
      }
    } else if (_count("full-sister") === 1) {
      shareMap.push({ type: "paternal-half-sister", fraction: [1, 6], basis: "1/6 (completing 2/3 with one full sister)" });
    }
  }

  // Maternal Half-Siblings
  if ((_has("maternal-half-brother") || _has("maternal-half-sister")) && !_hasChild() && !_has("father") && !_has("paternal-grandfather")) {
    const totalMaternal = _count("maternal-half-brother") + _count("maternal-half-sister");
    if (totalMaternal === 1) {
      const type = _has("maternal-half-brother") ? "maternal-half-brother" : "maternal-half-sister";
      shareMap.push({ type: type as HeirType, fraction: [1, 6], basis: "1/6 (one maternal half-sibling)" });
    } else {
      // 1/3 shared equally
      if (_has("maternal-half-brother")) {
        shareMap.push({ type: "maternal-half-brother", fraction: [1, 3], basis: "1/3 shared equally among maternal half-siblings" });
      }
      if (_has("maternal-half-sister")) {
        // If both types exist, they share the 1/3
        if (!_has("maternal-half-brother")) {
          shareMap.push({ type: "maternal-half-sister", fraction: [1, 3], basis: "1/3 shared equally among maternal half-siblings" });
        }
      }
    }
  }

  // --- Step 3: Calculate total fixed shares ---
  let totalFrac: Frac = [0, 1];
  for (const s of shareMap) {
    totalFrac = fracAdd(totalFrac, s.fraction);
  }

  const totalDecimal = fracToDecimal(totalFrac);
  let hasAwl = false;
  let hasRadd = false;
  let adjustmentNote: string | undefined;

  // --- Step 4: Handle residuary heirs ---
  const residuaryTypes: HeirType[] = [];

  // Sons and daughters as residuary (2:1 ratio)
  if (_has("son")) {
    residuaryTypes.push("son");
    if (_has("daughter")) residuaryTypes.push("daughter");
  }
  // Father as residuary (if no sons)
  else if (_has("father") && !shareMap.some(s => s.type === "father")) {
    residuaryTypes.push("father");
  }
  // Grandfather as residuary
  else if (_has("paternal-grandfather") && !_has("father") && !shareMap.some(s => s.type === "paternal-grandfather")) {
    residuaryTypes.push("paternal-grandfather");
  }
  // Full brothers/sisters as residuary
  else if (_has("full-brother")) {
    residuaryTypes.push("full-brother");
    if (_has("full-sister")) residuaryTypes.push("full-sister");
  }
  // Paternal half-brothers
  else if (_has("paternal-half-brother")) {
    residuaryTypes.push("paternal-half-brother");
  }

  // Father also gets residue with female-only descendants
  if (_has("father") && (_has("daughter") || _has("sons-daughter")) && !_has("son") && !_has("sons-son")) {
    // Father already has 1/6, residue goes to him too
    if (!residuaryTypes.includes("father")) {
      residuaryTypes.push("father");
    }
  }

  // Grandfather as father substitute
  if (_has("paternal-grandfather") && !_has("father") && (_has("daughter") || _has("sons-daughter")) && !_has("son") && !_has("sons-son")) {
    if (!residuaryTypes.includes("paternal-grandfather")) {
      residuaryTypes.push("paternal-grandfather");
    }
  }

  // --- Step 5: Apply Awl, Radd, or Residue ---
  if (totalDecimal > 1 && residuaryTypes.length === 0) {
    // AWL: proportional reduction
    hasAwl = true;
    adjustmentNote = `Total fixed shares exceed 100% (${(totalDecimal * 100).toFixed(1)}%). Awl (proportional reduction) applied.`;
  } else if (totalDecimal < 1 && residuaryTypes.length === 0) {
    // RADD: return surplus to fixed-share holders except spouse
    hasRadd = true;
    adjustmentNote = "Surplus estate returned (Radd) to fixed-share holders excluding spouse.";
  } else if (totalDecimal < 1 && residuaryTypes.length > 0) {
    // Give residue to residuary heirs
  }

  // --- Step 6: Build final share list with PKR amounts ---
  const shares: InheritanceHeirShare[] = [];

  if (hasAwl) {
    // Proportional reduction: each share's PKR = (fraction / totalFrac) × netEstate
    for (const s of shareMap) {
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction) / totalDecimal;
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis + " (reduced by Awl)",
      });
    }
  } else if (residuaryTypes.length > 0 && totalDecimal < 1) {
    // Fixed share holders get their exact share
    for (const s of shareMap) {
      if (residuaryTypes.includes(s.type)) continue; // Will be handled in residue
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction);
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis,
      });
    }

    // Residue calculation
    const residueDecimal = 1 - totalDecimal;
    // If father/grandfather is both fixed + residuary, combine
    const fatherHasFixed = shareMap.some(s => s.type === "father");
    const gfatherHasFixed = shareMap.some(s => s.type === "paternal-grandfather");

    if (residuaryTypes.includes("father") && fatherHasFixed) {
      // Father gets 1/6 fixed + residue
      const fixedPct = fracToDecimal([1, 6]);
      const totalPct = fixedPct + residueDecimal;
      const totalAmt = Math.round(netEstate * totalPct);
      shares.push({
        heir: "Father",
        heirType: "father",
        count: 1,
        fraction: [Math.round(totalPct * 6), 6],
        sharePercentage: totalPct * 100,
        totalAmount: totalAmt,
        perPersonAmount: totalAmt,
        basis: "1/6 fixed + residue",
      });
    } else if (residuaryTypes.includes("paternal-grandfather") && gfatherHasFixed && !residuaryTypes.includes("father")) {
      const fixedPct = fracToDecimal([1, 6]);
      const totalPct = fixedPct + residueDecimal;
      const totalAmt = Math.round(netEstate * totalPct);
      shares.push({
        heir: "Paternal Grandfather",
        heirType: "paternal-grandfather",
        count: 1,
        fraction: [Math.round(totalPct * 6), 6],
        sharePercentage: totalPct * 100,
        totalAmount: totalAmt,
        perPersonAmount: totalAmt,
        basis: "1/6 fixed + residue (as Father)",
      });
    } else if (residuaryTypes.includes("son")) {
      // Sons (and daughters): 2:1 ratio
      const sons = _count("son");
      const daughters = residuaryTypes.includes("daughter") ? _count("daughter") : 0;
      const totalParts = sons * 2 + daughters;
      const residueAmt = Math.round(netEstate * residueDecimal);
      const perPart = totalParts > 0 ? residueAmt / totalParts : 0;

      shares.push({
        heir: "Son",
        heirType: "son",
        count: sons,
        fraction: [Math.round(residueDecimal * sons * 2 / totalParts * 100), 100],
        sharePercentage: (residueDecimal * sons * 2 / totalParts) * 100,
        totalAmount: Math.round(perPart * 2 * sons),
        perPersonAmount: Math.round(perPart * 2),
        basis: "Residuary (2 shares per son)",
      });

      if (daughters > 0) {
        shares.push({
          heir: "Daughter",
          heirType: "daughter",
          count: daughters,
          fraction: [Math.round(residueDecimal * daughters / totalParts * 100), 100],
          sharePercentage: (residueDecimal * daughters / totalParts) * 100,
          totalAmount: Math.round(perPart * daughters),
          perPersonAmount: Math.round(perPart),
          basis: "Residuary (1 share per daughter, with son)",
        });
      }
    } else if (residuaryTypes.includes("full-brother")) {
      const brothers = _count("full-brother");
      const sisters = residuaryTypes.includes("full-sister") ? _count("full-sister") : 0;
      const totalParts = brothers * 2 + sisters;
      const residueAmt = Math.round(netEstate * residueDecimal);
      const perPart = totalParts > 0 ? residueAmt / totalParts : 0;

      shares.push({
        heir: "Full Brother",
        heirType: "full-brother",
        count: brothers,
        fraction: [Math.round(residueDecimal * brothers * 2 / totalParts * 100), 100],
        sharePercentage: (residueDecimal * brothers * 2 / totalParts) * 100,
        totalAmount: Math.round(perPart * 2 * brothers),
        perPersonAmount: Math.round(perPart * 2),
        basis: "Residuary (2 shares per brother)",
      });

      if (sisters > 0) {
        shares.push({
          heir: "Full Sister",
          heirType: "full-sister",
          count: sisters,
          fraction: [Math.round(residueDecimal * sisters / totalParts * 100), 100],
          sharePercentage: (residueDecimal * sisters / totalParts) * 100,
          totalAmount: Math.round(perPart * sisters),
          perPersonAmount: Math.round(perPart),
          basis: "Residuary (1 share per sister, with brother)",
        });
      }
    } else if (residuaryTypes.includes("father") && !fatherHasFixed) {
      shares.push({
        heir: "Father",
        heirType: "father",
        count: 1,
        fraction: [Math.round(residueDecimal * 100), 100],
        sharePercentage: residueDecimal * 100,
        totalAmount: Math.round(netEstate * residueDecimal),
        perPersonAmount: Math.round(netEstate * residueDecimal),
        basis: "Residuary (no children)",
      });
    } else if (residuaryTypes.includes("paternal-grandfather") && !gfatherHasFixed) {
      shares.push({
        heir: "Paternal Grandfather",
        heirType: "paternal-grandfather",
        count: 1,
        fraction: [Math.round(residueDecimal * 100), 100],
        sharePercentage: residueDecimal * 100,
        totalAmount: Math.round(netEstate * residueDecimal),
        perPersonAmount: Math.round(netEstate * residueDecimal),
        basis: "Residuary (as Father, no children)",
      });
    } else if (residuaryTypes.includes("paternal-half-brother")) {
      const phb = _count("paternal-half-brother");
      const residueAmt = Math.round(netEstate * residueDecimal);
      shares.push({
        heir: "Paternal Half-Brother",
        heirType: "paternal-half-brother",
        count: phb,
        fraction: [Math.round(residueDecimal * 100), 100],
        sharePercentage: residueDecimal * 100,
        totalAmount: residueAmt,
        perPersonAmount: phb > 0 ? Math.round(residueAmt / phb) : 0,
        basis: "Residuary",
      });
    }
  } else if (hasRadd) {
    // Radd: return surplus to non-spouse fixed-share holders proportionally
    const spouseTypes: HeirType[] = ["husband", "wife"];
    const spouseShares = shareMap.filter(s => spouseTypes.includes(s.type));
    const nonSpouseShares = shareMap.filter(s => !spouseTypes.includes(s.type));

    // Spouse gets exact share
    for (const s of spouseShares) {
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction);
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis,
      });
    }

    // Non-spouse get proportional radd
    const spouseTotalDecimal = spouseShares.reduce((sum, s) => sum + fracToDecimal(s.fraction), 0);
    const remainingEstate = netEstate - Math.round(netEstate * spouseTotalDecimal);
    const nonSpouseTotalDecimal = nonSpouseShares.reduce((sum, s) => sum + fracToDecimal(s.fraction), 0);

    for (const s of nonSpouseShares) {
      const heirCount = _count(s.type);
      const proportion = nonSpouseTotalDecimal > 0 ? fracToDecimal(s.fraction) / nonSpouseTotalDecimal : 0;
      const totalAmt = Math.round(remainingEstate * proportion);
      const pct = netEstate > 0 ? (totalAmt / netEstate) * 100 : 0;
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis + " (with Radd)",
      });
    }

    adjustmentNote = "Surplus returned proportionally to non-spouse heirs (Radd). Spouse does not receive Radd in Hanafi school.";
  } else {
    // Normal distribution: total = 1 or close to it
    for (const s of shareMap) {
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction);
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis,
      });
    }
  }

  return {
    school: "hanafi",
    grossEstate: estateValue,
    debts,
    funeralExpenses,
    wasiyyah,
    netEstate,
    shares,
    blockedHeirs,
    hasAwl,
    hasRadd,
    adjustmentNote,
  };
}

// ============================================================
// SHIA (JA'FARI) ALGORITHM
// ============================================================

function calculateShia(input: InheritanceInput): InheritanceResult {
  const { deceasedGender, heirs, estateValue, debts, funeralExpenses, wasiyyah } = input;
  const netEstate = Math.max(0, estateValue - debts - funeralExpenses - wasiyyah);

  const shareMap: { type: HeirType; fraction: Frac; basis: string }[] = [];
  const blockedHeirs: { heir: string; blockedBy: string }[] = [];

  // --- Class system ---
  // Class I: Parents + Children
  // Class II: Grandparents + Siblings
  // Class III: Uncles/Aunts (not implemented — rare)
  const hasClassI = has(heirs, "father") || has(heirs, "mother") || has(heirs, "son") || has(heirs, "daughter") || has(heirs, "sons-son") || has(heirs, "sons-daughter");
  const hasClassII = has(heirs, "paternal-grandfather") || has(heirs, "paternal-grandmother") || has(heirs, "maternal-grandmother") || has(heirs, "full-brother") || has(heirs, "full-sister") || has(heirs, "paternal-half-brother") || has(heirs, "paternal-half-sister") || has(heirs, "maternal-half-brother") || has(heirs, "maternal-half-sister");

  // Block lower classes
  if (hasClassI && hasClassII) {
    for (const t of ["paternal-grandfather", "paternal-grandmother", "maternal-grandmother", "full-brother", "full-sister", "paternal-half-brother", "paternal-half-sister", "maternal-half-brother", "maternal-half-sister"] as HeirType[]) {
      if (has(heirs, t)) {
        blockedHeirs.push({ heir: getHeirLabel(t), blockedBy: "Class I heirs present (Shia class system)" });
      }
    }
  }

  const _has = (t: HeirType) => {
    if (hasClassI && ["paternal-grandfather", "paternal-grandmother", "maternal-grandmother", "full-brother", "full-sister", "paternal-half-brother", "paternal-half-sister", "maternal-half-brother", "maternal-half-sister"].includes(t)) return false;
    return has(heirs, t);
  };
  const _count = (t: HeirType) => _has(t) ? count(heirs, t) : 0;
  const _hasChild = () => _has("son") || _has("daughter") || _has("sons-son") || _has("sons-daughter");

  // --- Spouse always inherits ---
  if (_has("husband")) {
    const frac: Frac = _hasChild() ? [1, 4] : [1, 2];
    shareMap.push({ type: "husband", fraction: frac, basis: _hasChild() ? "1/4 (with children)" : "1/2 (no children)" });
  }
  if (_has("wife")) {
    const frac: Frac = _hasChild() ? [1, 8] : [1, 4];
    shareMap.push({ type: "wife", fraction: frac, basis: _hasChild() ? "1/8 (with children)" : "1/4 (no children)" });
  }

  if (hasClassI) {
    // Mother
    if (_has("mother")) {
      if (_hasChild()) {
        shareMap.push({ type: "mother", fraction: [1, 6], basis: "1/6 (with children)" });
      } else {
        shareMap.push({ type: "mother", fraction: [1, 3], basis: "1/3 (no children)" });
      }
    }

    // Father
    if (_has("father")) {
      if (_has("son") || _has("sons-son")) {
        shareMap.push({ type: "father", fraction: [1, 6], basis: "1/6 (with male descendant)" });
      }
      // If no son, father takes residue
    }

    // Daughters (no son)
    if (_has("daughter") && !_has("son")) {
      if (_count("daughter") === 1) {
        shareMap.push({ type: "daughter", fraction: [1, 2], basis: "1/2 (one daughter, no son)" });
      } else {
        shareMap.push({ type: "daughter", fraction: [2, 3], basis: "2/3 shared (two+ daughters)" });
      }
    }
  } else if (hasClassII) {
    // Grandparents and siblings
    if (_has("paternal-grandfather")) {
      shareMap.push({ type: "paternal-grandfather", fraction: [1, 6], basis: "1/6 (Class II, grandfather)" });
    }
    if (_has("full-sister") && !_has("full-brother")) {
      if (_count("full-sister") === 1) {
        shareMap.push({ type: "full-sister", fraction: [1, 2], basis: "1/2 (one full sister)" });
      } else {
        shareMap.push({ type: "full-sister", fraction: [2, 3], basis: "2/3 shared (two+ full sisters)" });
      }
    }
  }

  // Calculate total and residue
  let totalFrac: Frac = [0, 1];
  for (const s of shareMap) {
    totalFrac = fracAdd(totalFrac, s.fraction);
  }
  const totalDecimal = fracToDecimal(totalFrac);

  // Residuary
  const residuaryTypes: HeirType[] = [];
  if (_has("son")) {
    residuaryTypes.push("son");
    if (_has("daughter")) residuaryTypes.push("daughter");
  } else if (_has("father") && !shareMap.some(s => s.type === "father")) {
    residuaryTypes.push("father");
  } else if (_has("father") && (_has("daughter") || _has("sons-daughter"))) {
    residuaryTypes.push("father");
  } else if (_has("full-brother")) {
    residuaryTypes.push("full-brother");
    if (_has("full-sister")) residuaryTypes.push("full-sister");
  }

  let hasAwl = false;
  let hasRadd = false;
  let adjustmentNote: string | undefined;

  // In Shia: no Awl. If shares exceed 1, reduce daughters/sisters
  if (totalDecimal > 1 && residuaryTypes.length === 0) {
    adjustmentNote = "Shia school: no Awl. Reduction applied to daughters/sisters share.";
  } else if (totalDecimal < 1 && residuaryTypes.length === 0) {
    hasRadd = true;
    adjustmentNote = "Surplus returned to ALL fixed-share holders including spouse (Shia Radd).";
  }

  // Build shares
  const shares: InheritanceHeirShare[] = [];

  if (totalDecimal > 1 && residuaryTypes.length === 0) {
    // Reduce daughters/sisters proportionally (Shia rule)
    for (const s of shareMap) {
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction) / totalDecimal;
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis + (["daughter", "full-sister", "paternal-half-sister"].includes(s.type) ? " (reduced)" : ""),
      });
    }
  } else if (hasRadd) {
    // Radd to ALL including spouse in Shia
    for (const s of shareMap) {
      const heirCount = _count(s.type);
      const proportion = totalDecimal > 0 ? fracToDecimal(s.fraction) / totalDecimal : 0;
      const totalAmt = Math.round(netEstate * proportion);
      const pct = netEstate > 0 ? (totalAmt / netEstate) * 100 : 0;
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis + " (with Radd to all)",
      });
    }
  } else if (residuaryTypes.length > 0 && totalDecimal < 1) {
    // Fixed shares + residue
    for (const s of shareMap) {
      if (residuaryTypes.includes(s.type)) continue;
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction);
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis,
      });
    }

    const residueDecimal = 1 - totalDecimal;
    const fatherHasFixed = shareMap.some(s => s.type === "father");

    if (residuaryTypes.includes("son")) {
      const sons = _count("son");
      const daughters = residuaryTypes.includes("daughter") ? _count("daughter") : 0;
      const totalParts = sons * 2 + daughters;
      const residueAmt = Math.round(netEstate * residueDecimal);
      const perPart = totalParts > 0 ? residueAmt / totalParts : 0;

      shares.push({
        heir: "Son", heirType: "son", count: sons,
        fraction: [Math.round(residueDecimal * sons * 2 / totalParts * 100), 100],
        sharePercentage: (residueDecimal * sons * 2 / totalParts) * 100,
        totalAmount: Math.round(perPart * 2 * sons),
        perPersonAmount: Math.round(perPart * 2),
        basis: "Residuary (2:1 ratio)",
      });
      if (daughters > 0) {
        shares.push({
          heir: "Daughter", heirType: "daughter", count: daughters,
          fraction: [Math.round(residueDecimal * daughters / totalParts * 100), 100],
          sharePercentage: (residueDecimal * daughters / totalParts) * 100,
          totalAmount: Math.round(perPart * daughters),
          perPersonAmount: Math.round(perPart),
          basis: "Residuary (2:1 ratio with son)",
        });
      }
    } else if (residuaryTypes.includes("father")) {
      if (fatherHasFixed) {
        const fixedPct = fracToDecimal([1, 6]);
        const totalPct = fixedPct + residueDecimal;
        shares.push({
          heir: "Father", heirType: "father", count: 1,
          fraction: [Math.round(totalPct * 6), 6],
          sharePercentage: totalPct * 100,
          totalAmount: Math.round(netEstate * totalPct),
          perPersonAmount: Math.round(netEstate * totalPct),
          basis: "1/6 fixed + residue",
        });
      } else {
        shares.push({
          heir: "Father", heirType: "father", count: 1,
          fraction: [Math.round(residueDecimal * 100), 100],
          sharePercentage: residueDecimal * 100,
          totalAmount: Math.round(netEstate * residueDecimal),
          perPersonAmount: Math.round(netEstate * residueDecimal),
          basis: "Residuary",
        });
      }
    } else if (residuaryTypes.includes("full-brother")) {
      const brothers = _count("full-brother");
      const sisters = residuaryTypes.includes("full-sister") ? _count("full-sister") : 0;
      const totalParts = brothers * 2 + sisters;
      const residueAmt = Math.round(netEstate * residueDecimal);
      const perPart = totalParts > 0 ? residueAmt / totalParts : 0;

      shares.push({
        heir: "Full Brother", heirType: "full-brother", count: brothers,
        fraction: [Math.round(residueDecimal * brothers * 2 / totalParts * 100), 100],
        sharePercentage: (residueDecimal * brothers * 2 / totalParts) * 100,
        totalAmount: Math.round(perPart * 2 * brothers),
        perPersonAmount: Math.round(perPart * 2),
        basis: "Residuary (2:1)",
      });
      if (sisters > 0) {
        shares.push({
          heir: "Full Sister", heirType: "full-sister", count: sisters,
          fraction: [Math.round(residueDecimal * sisters / totalParts * 100), 100],
          sharePercentage: (residueDecimal * sisters / totalParts) * 100,
          totalAmount: Math.round(perPart * sisters),
          perPersonAmount: Math.round(perPart),
          basis: "Residuary (2:1 with brother)",
        });
      }
    }
  } else {
    for (const s of shareMap) {
      const heirCount = _count(s.type);
      const pct = fracToDecimal(s.fraction);
      const totalAmt = Math.round(netEstate * pct);
      shares.push({
        heir: getHeirLabel(s.type),
        heirType: s.type,
        count: heirCount,
        fraction: s.fraction,
        sharePercentage: pct * 100,
        totalAmount: totalAmt,
        perPersonAmount: heirCount > 0 ? Math.round(totalAmt / heirCount) : 0,
        basis: s.basis,
      });
    }
  }

  return {
    school: "shia",
    grossEstate: estateValue,
    debts,
    funeralExpenses,
    wasiyyah,
    netEstate,
    shares,
    blockedHeirs,
    hasAwl,
    hasRadd,
    adjustmentNote,
  };
}

// ============================================================
// PUBLIC API
// ============================================================

export function calculateInheritance(input: InheritanceInput): InheritanceResult {
  return input.school === "hanafi" ? calculateHanafi(input) : calculateShia(input);
}

export function getInheritanceBreakdown(result: InheritanceResult) {
  const steps = [
    {
      step: 1,
      label: "Gross Estate",
      calculation: "Total value of deceased's estate",
      result: `Rs. ${result.grossEstate.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: "Deductions",
      calculation: `Debts (Rs. ${result.debts.toLocaleString("en-PK")}) + Funeral (Rs. ${result.funeralExpenses.toLocaleString("en-PK")}) + Wasiyyah (Rs. ${result.wasiyyah.toLocaleString("en-PK")})`,
      result: `Rs. ${(result.debts + result.funeralExpenses + result.wasiyyah).toLocaleString("en-PK")}`,
    },
    {
      step: 3,
      label: "Net Distributable Estate",
      calculation: `Rs. ${result.grossEstate.toLocaleString("en-PK")} − Rs. ${(result.debts + result.funeralExpenses + result.wasiyyah).toLocaleString("en-PK")}`,
      result: `Rs. ${result.netEstate.toLocaleString("en-PK")}`,
    },
  ];

  let stepNum = 4;
  for (const share of result.shares) {
    steps.push({
      step: stepNum++,
      label: `${share.heir} (×${share.count})`,
      calculation: share.basis,
      result: `Rs. ${share.totalAmount.toLocaleString("en-PK")} (${share.sharePercentage.toFixed(1)}%)`,
    });
  }

  return steps;
}

import type {
  ExtractedCaseData,
  EnhancedBriefSection,
  SourceReference,
} from "./types";
import type { RAGSearchResult } from "@/lib/rag/types";

function makeSection(
  id: string,
  title: string,
  content: string,
  sources: SourceReference[]
): EnhancedBriefSection {
  return {
    id,
    title,
    content,
    sources,
    reviewStatus: "pending_review",
    regenerationCount: 0,
  };
}

export function renderCaseHeader(data: ExtractedCaseData): EnhancedBriefSection {
  const info = data.courtInfo;
  const lines: string[] = [];
  const sources: SourceReference[] = [];

  if (info) {
    if (info.caseNumber !== "Not identified") lines.push(info.caseNumber);
    if (info.caseType !== "Not identified") lines.push(`Filed as ${info.caseType}`);
    if (info.courtName !== "Not identified") lines.push(info.courtName);
    if (info.judge) lines.push(`Before: ${info.judge}`);
    sources.push(...info.sources);
  } else {
    lines.push("Case information could not be extracted from uploaded documents.");
  }

  return makeSection("gen-s1", "Case Header", lines.join("\n"), sources);
}

export function renderPartiesSection(data: ExtractedCaseData): EnhancedBriefSection {
  const sources: SourceReference[] = [];
  const parts: string[] = [];

  const petitioners = data.parties.filter(p => p.role === "petitioner" || p.role === "appellant");
  const respondents = data.parties.filter(p => p.role === "respondent");

  if (petitioners.length > 0) {
    for (const p of petitioners) {
      const label = p.role === "appellant" ? "APPELLANT" : "PETITIONER";
      let line = `${label}: ${p.name}`;
      if (p.counsel) line += `\nCounsel: ${p.counsel}`;
      parts.push(line);
      sources.push(...p.sources);
    }
  } else {
    parts.push("PETITIONER: Not identified from documents.");
  }

  if (respondents.length > 0) {
    for (const p of respondents) {
      let line = `RESPONDENT: ${p.name}`;
      if (p.counsel) line += `\nCounsel: ${p.counsel}`;
      parts.push(line);
      sources.push(...p.sources);
    }
  } else {
    parts.push("RESPONDENT: Not identified from documents.");
  }

  return makeSection("gen-s2", "Parties & Representation", parts.join("\n\n"), sources);
}

export function renderMaterialFacts(data: ExtractedCaseData): EnhancedBriefSection {
  const sources: SourceReference[] = [];

  if (data.facts.length === 0) {
    return makeSection(
      "gen-s3",
      "Material Facts",
      "No material facts could be extracted from uploaded documents. Please review the documents and add facts manually.",
      []
    );
  }

  const lines = data.facts.map((f, i) => {
    sources.push(...f.sources);
    return `${i + 1}. ${f.content}`;
  });

  return makeSection("gen-s3", "Material Facts", lines.join("\n"), sources);
}

export function renderLegalIssues(data: ExtractedCaseData): EnhancedBriefSection {
  const sources: SourceReference[] = [];

  if (data.legalIssues.length === 0) {
    return makeSection(
      "gen-s4",
      "Legal Issues",
      "No legal issues could be identified from uploaded documents. Please review and add legal issues manually.",
      []
    );
  }

  const lines = data.legalIssues.map((issue, i) => {
    sources.push(...issue.sources);
    return `${i + 1}. ${issue.content}`;
  });

  return makeSection("gen-s4", "Legal Issues", lines.join("\n"), sources);
}

export function renderApplicableStatutes(data: ExtractedCaseData): EnhancedBriefSection {
  const sources: SourceReference[] = [];

  if (data.statutes.length === 0) {
    return makeSection(
      "gen-s5",
      "Applicable Statutes",
      "No statutory references could be identified from uploaded documents.",
      []
    );
  }

  const lines = data.statutes.map(s => {
    sources.push(...s.sources);
    const provisions = s.provisions.length > 0 ? `: ${s.provisions.join(", ")}` : "";
    return `- ${s.name}${provisions}`;
  });

  return makeSection("gen-s5", "Applicable Statutes", lines.join("\n"), sources);
}

export function renderPetitionerArguments(data: ExtractedCaseData): EnhancedBriefSection {
  const sources: SourceReference[] = [];
  const petArgs = data.arguments.filter(a => a.side === "petitioner");

  if (petArgs.length === 0) {
    return makeSection(
      "gen-s6",
      "Petitioner's Arguments",
      "No petitioner arguments could be extracted from uploaded documents. Please review and add arguments manually.",
      []
    );
  }

  const lines = petArgs.map((arg, i) => {
    sources.push(...arg.sources);
    return `${i + 1}. ${arg.content}`;
  });

  return makeSection("gen-s6", "Petitioner's Arguments", lines.join("\n"), sources);
}

export function renderRespondentArguments(data: ExtractedCaseData): EnhancedBriefSection {
  const sources: SourceReference[] = [];
  const resArgs = data.arguments.filter(a => a.side === "respondent");

  if (resArgs.length === 0) {
    return makeSection(
      "gen-s7",
      "Respondent's Arguments",
      "No respondent arguments could be extracted from uploaded documents. Please review and add arguments manually.",
      []
    );
  }

  const lines = resArgs.map((arg, i) => {
    sources.push(...arg.sources);
    return `${i + 1}. ${arg.content}`;
  });

  return makeSection("gen-s7", "Respondent's Arguments", lines.join("\n"), sources);
}

export function renderRelevantPrecedents(
  data: ExtractedCaseData,
  ragResults: RAGSearchResult[]
): EnhancedBriefSection {
  if (ragResults.length === 0) {
    return makeSection(
      "gen-s8",
      "Relevant Precedents",
      "No relevant precedents were found in the database for the identified legal issues.",
      []
    );
  }

  const lines = ragResults.slice(0, 6).map((r, i) => {
    const p = r.precedent;
    return `${i + 1}. ${p.caseName} (${p.citation}): ${p.summary}`;
  });

  return makeSection("gen-s8", "Relevant Precedents", lines.join("\n"), []);
}

export function renderComparativeMatrix(
  data: ExtractedCaseData,
  ragResults: RAGSearchResult[]
): EnhancedBriefSection {
  const petArgs = data.arguments.filter(a => a.side === "petitioner");
  const resArgs = data.arguments.filter(a => a.side === "respondent");
  const sources: SourceReference[] = [];

  if (data.legalIssues.length === 0) {
    return makeSection(
      "gen-s9",
      "Comparative Matrix",
      "Comparative matrix could not be generated without identified legal issues.",
      []
    );
  }

  const rows: string[] = [];
  data.legalIssues.forEach((issue, i) => {
    const petArg = petArgs[i]?.content || "Not available";
    const resArg = resArgs[i]?.content || "Not available";

    if (petArgs[i]) sources.push(...petArgs[i].sources);
    if (resArgs[i]) sources.push(...resArgs[i].sources);
    sources.push(...issue.sources);

    rows.push(`Issue ${i + 1}: ${issue.content}`);
    rows.push(`  Petitioner: ${petArg}`);
    rows.push(`  Respondent: ${resArg}`);
    rows.push("");
  });

  return makeSection("gen-s9", "Comparative Matrix", rows.join("\n"), sources);
}

export function renderPreliminaryAnalysis(
  data: ExtractedCaseData,
  ragResults: RAGSearchResult[]
): EnhancedBriefSection {
  const sources: SourceReference[] = [];
  const lines: string[] = [];

  // Build analysis from extracted data
  const caseType = data.courtInfo?.caseType || "legal matter";
  lines.push(
    `This ${caseType} involves ${data.legalIssues.length} legal issue(s) identified from the uploaded documents.`
  );

  if (data.parties.length > 0) {
    const petitioner = data.parties.find(p => p.role === "petitioner" || p.role === "appellant");
    const respondent = data.parties.find(p => p.role === "respondent");
    if (petitioner && respondent) {
      lines.push(
        `The matter is between ${petitioner.name} and ${respondent.name}.`
      );
    }
  }

  if (data.facts.length > 0) {
    lines.push(
      `${data.facts.length} material fact(s) have been identified from the case documents.`
    );
    data.facts.forEach(f => sources.push(...f.sources));
  }

  if (data.statutes.length > 0) {
    lines.push(
      `The case engages ${data.statutes.length} statutory framework(s): ${data.statutes.map(s => s.name).join(", ")}.`
    );
  }

  if (ragResults.length > 0) {
    const topPrecedents = ragResults.slice(0, 3);
    lines.push(
      `${ragResults.length} relevant precedent(s) have been identified from the database. The most relevant are: ${topPrecedents.map(r => `${r.precedent.caseName} (${r.precedent.citation})`).join("; ")}.`
    );
  }

  lines.push(
    "\nNote: This preliminary analysis is generated from extracted document data and matched precedents. All facts and citations trace to uploaded source documents. Please review each section for accuracy before relying on this brief."
  );

  return makeSection("gen-s10", "Preliminary Analysis", lines.join(" "), sources);
}

export function generateAllSections(
  data: ExtractedCaseData,
  ragResults: RAGSearchResult[]
): EnhancedBriefSection[] {
  return [
    renderCaseHeader(data),
    renderPartiesSection(data),
    renderMaterialFacts(data),
    renderLegalIssues(data),
    renderApplicableStatutes(data),
    renderPetitionerArguments(data),
    renderRespondentArguments(data),
    renderRelevantPrecedents(data, ragResults),
    renderComparativeMatrix(data, ragResults),
    renderPreliminaryAnalysis(data, ragResults),
  ];
}

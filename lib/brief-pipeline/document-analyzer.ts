import type {
  UploadedDocument,
  SourceReference,
  ExtractedCaseData,
  ExtractedCourtInfo,
  ExtractedParty,
  ExtractedFact,
  ExtractedLegalIssue,
  ExtractedStatuteRef,
  ExtractedArgument,
} from "./types";

function makeSource(doc: UploadedDocument, pageNumber: number, snippet?: string): SourceReference {
  return {
    documentId: doc.id,
    documentName: doc.fileName,
    documentType: doc.documentType,
    pageNumber,
    snippet,
  };
}

/** ES5-safe matchAll alternative using exec loop */
function execAll(regex: RegExp, text: string): RegExpExecArray[] {
  const results: RegExpExecArray[] = [];
  // Clone with global flag
  const re = new RegExp(regex.source, regex.flags.indexOf("g") === -1 ? regex.flags + "g" : regex.flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    results.push(m);
  }
  return results;
}

function extractCourtInfo(docs: UploadedDocument[]): ExtractedCourtInfo | null {
  const courtPatterns = [
    /IN\s+THE\s+(SUPREME\s+COURT\s+OF\s+PAKISTAN|HIGH\s+COURT\s+OF\s+[A-Z\s]+|[\w\s]+COURT[\w\s,]*)/i,
    /(Supreme\s+Court|High\s+Court|Sessions\s+Court|Family\s+Court|District\s+Court|Civil\s+Court)[\s,]*(of\s+[A-Za-z\s]+)?/i,
  ];
  const caseNumberPatterns = [
    /((?:CP|WP|Crl\.?\s*A|Crl\.?\s*R|Criminal\s+Appeal|Criminal\s+Revision|Writ\s+Petition|Constitutional\s+Petition|Civil\s+Appeal|Family\s+Appeal|Corporate\s+Original)\s*(?:No\.?\s*)?[\d\/]+(?:\/\d{4})?)/i,
    /((?:FIR|Case)\s*(?:No\.?\s*)[\d\/]+(?:\/\d{4})?)/i,
  ];
  const caseTypePatterns = [
    { pattern: /Constitutional\s+Petition/i, type: "Constitutional Petition" },
    { pattern: /Criminal\s+Appeal/i, type: "Criminal Appeal" },
    { pattern: /Criminal\s+Revision/i, type: "Criminal Revision" },
    { pattern: /Writ\s+Petition/i, type: "Writ Petition" },
    { pattern: /Family\s+Appeal/i, type: "Family Appeal" },
    { pattern: /Civil\s+Appeal/i, type: "Civil Appeal" },
    { pattern: /Corporate\s+Original/i, type: "Corporate Original" },
  ];
  const judgePatterns = [
    /(?:Before|Hon(?:ourable)?\.?\s*(?:Mr\.?|Ms\.?|Mrs\.?)?\s*Justice)\s+([A-Z][A-Za-z\s.]+)/i,
    /Justice\s+([A-Z][A-Za-z\s.]+?)(?:\s*,|\s*CJ|\n)/i,
  ];

  let courtName = "";
  let caseNumber = "";
  let caseType = "";
  let judge = "";
  const sources: SourceReference[] = [];

  for (const doc of docs) {
    for (const page of doc.pages) {
      const text = page.text;

      if (!courtName) {
        for (const cp of courtPatterns) {
          const m = text.match(cp);
          if (m) {
            courtName = m[1].trim();
            sources.push(makeSource(doc, page.pageNumber, m[0].trim()));
            break;
          }
        }
      }

      if (!caseNumber) {
        for (const cnp of caseNumberPatterns) {
          const m = text.match(cnp);
          if (m) {
            caseNumber = m[1].trim();
            sources.push(makeSource(doc, page.pageNumber, m[0].trim()));
            break;
          }
        }
      }

      if (!caseType) {
        for (const ctp of caseTypePatterns) {
          if (ctp.pattern.test(text)) {
            caseType = ctp.type;
            break;
          }
        }
      }

      if (!judge) {
        for (const jp of judgePatterns) {
          const m = text.match(jp);
          if (m) {
            judge = m[1].trim();
            sources.push(makeSource(doc, page.pageNumber, m[0].trim()));
            break;
          }
        }
      }
    }
  }

  if (!courtName && !caseNumber) return null;

  return {
    courtName: courtName || "Not identified",
    caseNumber: caseNumber || "Not identified",
    caseType: caseType || "Not identified",
    judge: judge || undefined,
    sources,
  };
}

function extractParties(docs: UploadedDocument[]): ExtractedParty[] {
  const parties: ExtractedParty[] = [];
  const petitionerPattern = /(?:PETITIONER|APPELLANT)\s*[:\-]?\s*([^\n]+)/i;
  const respondentPattern = /(?:RESPONDENT|DEFENDANT)\s*[:\-]?\s*([^\n]+)/i;
  const versusPattern = /([A-Z][A-Za-z.\s]+(?:s\/o|d\/o|w\/o)[A-Za-z\s.]+)\s+(?:v\.|versus|Vs\.?)\s+([A-Z][A-Za-z.\s]+)/i;

  for (const doc of docs) {
    for (const page of doc.pages) {
      const text = page.text;

      const petMatch = text.match(petitionerPattern);
      if (petMatch) {
        const existing = parties.find(p => p.role === "petitioner");
        if (!existing) {
          parties.push({
            name: petMatch[1].trim().replace(/[,.]$/, ""),
            role: "petitioner",
            sources: [makeSource(doc, page.pageNumber, petMatch[0].trim())],
          });
        }
      }

      const resMatch = text.match(respondentPattern);
      if (resMatch) {
        const existing = parties.find(p => p.role === "respondent");
        if (!existing) {
          parties.push({
            name: resMatch[1].trim().replace(/[,.]$/, ""),
            role: "respondent",
            sources: [makeSource(doc, page.pageNumber, resMatch[0].trim())],
          });
        }
      }

      if (parties.length === 0) {
        const vsMatch = text.match(versusPattern);
        if (vsMatch) {
          parties.push({
            name: vsMatch[1].trim(),
            role: "petitioner",
            sources: [makeSource(doc, page.pageNumber, vsMatch[0].trim())],
          });
          parties.push({
            name: vsMatch[2].trim(),
            role: "respondent",
            sources: [makeSource(doc, page.pageNumber, vsMatch[0].trim())],
          });
        }
      }
    }
  }

  return parties;
}

function extractFacts(docs: UploadedDocument[]): ExtractedFact[] {
  const facts: ExtractedFact[] = [];
  const factPatterns = [
    /(?:FACTS|Respectfully\s+Sheweth|MATERIAL\s+FACTS)/i,
    /(?:That\s+the\s+)/i,
  ];
  const numberedFactPattern = /(\d+)\.\s+(.+?)(?=\n\d+\.|$)/g;

  for (const doc of docs) {
    for (const page of doc.pages) {
      const text = page.text;
      const hasFactSection = factPatterns.some(p => p.test(text));

      if (hasFactSection || doc.documentType === "Petition" || doc.documentType === "FIR") {
        const matches = execAll(numberedFactPattern, text);
        for (const match of matches) {
          const content = match[2].trim();
          if (content.length > 20) {
            const dateMatch = content.match(/(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}|\d{2}[.\/-]\d{2}[.\/-]\d{4})/);
            facts.push({
              content,
              date: dateMatch ? dateMatch[1] : undefined,
              order: facts.length + 1,
              sources: [makeSource(doc, page.pageNumber, content.slice(0, 80))],
            });
          }
        }
      }
    }
  }

  return facts;
}

function extractLegalIssues(docs: UploadedDocument[]): ExtractedLegalIssue[] {
  const issues: ExtractedLegalIssue[] = [];
  const issuePatterns = [
    /Whether\s+(.+?\?)/gi,
    /Issue\s+No\.?\s*\d+[:\-]?\s*(.+?)(?=Issue\s+No\.?\s*\d+|$)/gi,
  ];
  const statuteRefPattern = /(?:Article|Section)\s+\d+[\w\-()]*/gi;

  for (const doc of docs) {
    for (const page of doc.pages) {
      const text = page.text;

      for (const pattern of issuePatterns) {
        const matches = execAll(pattern, text);
        for (const match of matches) {
          const content = match[0].trim();
          const statuteMatches = content.match(statuteRefPattern) || [];
          const statutes = statuteMatches.map((s: string) => s.trim());
          const existing = issues.find(i => i.content === content);
          if (!existing) {
            issues.push({
              content,
              relatedStatutes: statutes,
              sources: [makeSource(doc, page.pageNumber, content.slice(0, 80))],
            });
          }
        }
      }
    }
  }

  return issues;
}

function extractStatutes(docs: UploadedDocument[]): ExtractedStatuteRef[] {
  const statutes: ExtractedStatuteRef[] = [];
  const actPattern = /(?:the\s+)?([A-Z][A-Za-z\s]+(?:Act|Ordinance|Order|Code|Rules|Regulation)[\s,]*\d{4})/gi;
  const articlePattern = /Article\s+(\d+[\w\-()]*)/gi;
  const sectionPattern = /Section\s+(\d+[\w\-()\/]*)/gi;

  // Use a plain object instead of Map for ES5 compat
  const statuteKeys: string[] = [];
  const statuteData: Record<string, { provisions: string[]; sources: SourceReference[] }> = {};

  function getOrCreate(name: string) {
    if (!statuteData[name]) {
      statuteKeys.push(name);
      statuteData[name] = { provisions: [], sources: [] };
    }
    return statuteData[name];
  }

  function addProvision(name: string, provision: string) {
    const entry = getOrCreate(name);
    if (entry.provisions.indexOf(provision) === -1) {
      entry.provisions.push(provision);
    }
  }

  for (const doc of docs) {
    for (const page of doc.pages) {
      const text = page.text;

      const actMatches = execAll(actPattern, text);
      for (const match of actMatches) {
        const name = match[1].trim();
        const entry = getOrCreate(name);
        entry.sources.push(makeSource(doc, page.pageNumber, match[0].trim()));
      }

      const articleMatches = execAll(articlePattern, text);
      const sectionMatches = execAll(sectionPattern, text);

      for (const aMatch of articleMatches) {
        const key = "Constitution of Pakistan, 1973";
        addProvision(key, "Article " + aMatch[1]);
        getOrCreate(key).sources.push(makeSource(doc, page.pageNumber, aMatch[0]));
      }

      for (const sMatch of sectionMatches) {
        const nearbyAct = actMatches.find(a => {
          const idx = text.indexOf(a[0]);
          const sIdx = text.indexOf(sMatch[0]);
          return Math.abs(idx - sIdx) < 200;
        });
        if (nearbyAct) {
          const key = nearbyAct[1].trim();
          addProvision(key, "Section " + sMatch[1]);
        }
      }
    }
  }

  for (const name of statuteKeys) {
    const data = statuteData[name];
    const uniqueSources = data.sources.filter(
      (s: SourceReference, i: number, arr: SourceReference[]) =>
        i === arr.findIndex((o: SourceReference) => o.documentId === s.documentId && o.pageNumber === s.pageNumber)
    );
    statutes.push({
      name,
      provisions: data.provisions,
      sources: uniqueSources.slice(0, 3),
    });
  }

  return statutes;
}

function extractArguments(docs: UploadedDocument[]): ExtractedArgument[] {
  const args: ExtractedArgument[] = [];
  const petArgPatterns = [
    /(?:petitioner|appellant)(?:'s)?\s+(?:argument|submission|contention)/i,
  ];
  const resArgPatterns = [
    /(?:respondent|defendant)(?:'s)?\s+(?:argument|submission|contention)/i,
  ];
  const citationPattern = /([A-Z][A-Za-z.\s]+v\.?\s+[A-Z][A-Za-z.\s]+)\s*\([^)]+\)/g;
  const numberedArgPattern = /(\d+)\.\s+(.+?)(?=\n\d+\.|$)/g;

  for (const doc of docs) {
    for (const page of doc.pages) {
      const text = page.text;
      let side: "petitioner" | "respondent" | null = null;

      if (petArgPatterns.some(p => p.test(text))) side = "petitioner";
      else if (resArgPatterns.some(p => p.test(text))) side = "respondent";

      if (side) {
        const matches = execAll(numberedArgPattern, text);
        for (const match of matches) {
          const content = match[2].trim();
          if (content.length > 20) {
            const citations = execAll(citationPattern, content).map(m => m[0].trim());
            args.push({
              content,
              side,
              supportingCitations: citations,
              sources: [makeSource(doc, page.pageNumber, content.slice(0, 80))],
            });
          }
        }
      }
    }
  }

  return args;
}

export function analyzeDocuments(docs: UploadedDocument[]): ExtractedCaseData {
  const extractedDocs = docs.filter(d => d.status === "extracted");

  return {
    courtInfo: extractCourtInfo(extractedDocs),
    parties: extractParties(extractedDocs),
    facts: extractFacts(extractedDocs),
    legalIssues: extractLegalIssues(extractedDocs),
    statutes: extractStatutes(extractedDocs),
    arguments: extractArguments(extractedDocs),
    rawDocuments: extractedDocs.map(d => ({
      id: d.id,
      fileName: d.fileName,
      documentType: d.documentType,
      totalPages: d.totalPages,
    })),
  };
}

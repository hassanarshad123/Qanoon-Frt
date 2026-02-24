import type { Note } from "./types";

export const notes: Note[] = [
  // General folder (5 notes)
  {
    id: "note-001",
    title: "Key Constitutional Provisions for Fundamental Rights Cases",
    content: "Quick reference for constitutional petitions:\n\n- Article 4: Right to be dealt with in accordance with law\n- Article 9: Security of person (includes right to life, livelihood, dignity)\n- Article 10: Safeguards as to arrest and detention\n- Article 10-A: Right to fair trial and due process\n- Article 14: Inviolability of dignity of man\n- Article 16: Freedom of assembly\n- Article 17: Freedom of association\n- Article 18: Freedom of trade, business or profession\n- Article 19: Freedom of speech\n- Article 19-A: Right to information\n- Article 23: Provision as to property\n- Article 24: Protection of property rights\n- Article 25: Equality of citizens\n- Article 25-A: Right to education\n\nNote: Article 184(3) jurisdiction requires BOTH public importance AND fundamental rights nexus.",
    folder: "General",
    tags: ["tag-001", "tag-003"],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-03-01T14:30:00Z"
  },
  {
    id: "note-002",
    title: "Court Hierarchy and Citation Formats",
    content: "Pakistan Court Hierarchy and Citation Reference:\n\n1. Supreme Court of Pakistan:\n   - PLD [Year] SC [Page]\n   - SCMR [Year] SC [Page]\n   - Example: PLD 2024 SC 112\n\n2. Federal Shariat Court:\n   - PLD [Year] FSC [Page]\n\n3. High Courts:\n   - Lahore: PLD [Year] Lah [Page] or CLC [Year] Lah [Page]\n   - Sindh: PLD [Year] Kar [Page] or CLC [Year] Kar [Page]\n   - Islamabad: CLC [Year] Isb [Page]\n   - Peshawar: PLD [Year] Pesh [Page]\n   - Balochistan: PLD [Year] Bal [Page]\n\n4. Subordinate Courts:\n   - Sessions Courts, Family Courts, Civil Courts\n   - Generally unreported\n\nKey Reporters: PLD (Pakistan Legal Decisions), SCMR (Supreme Court Monthly Review), CLC (Civil Law Cases), PCrLJ (Pakistan Criminal Law Journal), PLC (Pakistan Labour Cases), PTD (Pakistan Tax Decisions).",
    folder: "General",
    tags: ["tag-004"],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "note-003",
    title: "Limitation Periods - Common References",
    content: "Quick reference for limitation periods under the Limitation Act, 1908:\n\n- Civil suit for recovery of money: 3 years from cause of action\n- Suit for possession of immovable property: 12 years\n- Appeal to District Court: 30 days\n- Appeal to High Court: 90 days\n- Revision application: 90 days\n- Constitutional petition: No fixed limitation (but laches may apply)\n- Criminal appeal: 7 days (death sentence), 30 days (other sentences)\n- Application under Section 12(2) CPC: 30 days from discovery of fraud\n\nNote: Section 5 of the Limitation Act allows condonation of delay on showing 'sufficient cause.' Courts have been liberal in criminal matters but strict in civil/tax matters.",
    folder: "General",
    tags: ["tag-003"],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-15T12:00:00Z"
  },
  {
    id: "note-004",
    title: "Standard Bail Test - Criminal Cases",
    content: "Standard test for bail in criminal cases under Section 497 CrPC:\n\n1. Offences not punishable with death or life imprisonment:\n   - Bail is a right (unless court has reasonable grounds to refuse)\n   - Refusal must be based on specific grounds\n\n2. Offences punishable with death or life imprisonment:\n   - Restrictive clause applies\n   - Bail only if 'reasonable grounds for believing that the accused is not guilty'\n   - Further inquiry test from Tariq Bashir v. State (2019 SCMR 120)\n\n3. Special statutes with restrictive clauses:\n   - CNSA Section 51: Extreme caution required\n   - ATA Section 21-D: Similar restriction\n   - NAB Ordinance Section 9(b): Additional bar\n\n4. Factors: Flight risk, tampering with evidence, severity of offence, health, period of incarceration.\n\nGolden rule: Bail is the rule, jail is the exception.",
    folder: "General",
    tags: ["tag-002", "tag-003"],
    createdAt: "2024-02-10T11:00:00Z",
    updatedAt: "2024-03-05T16:00:00Z"
  },
  {
    id: "note-005",
    title: "Recent Supreme Court Practice Directions 2024",
    content: "Summary of SC Practice Directions issued in 2024:\n\n1. Filing of written synopses mandatory in constitutional petitions (max 10 pages)\n2. Hearing time limited to 45 minutes per side unless extended by bench\n3. All references to international conventions must include ratification status\n4. E-filing now mandatory for all Supreme Court matters\n5. Video link hearings available for counsel in other cities upon application\n\nThese directions apply from 01.02.2024.",
    folder: "General",
    tags: ["tag-003"],
    createdAt: "2024-02-20T08:00:00Z",
    updatedAt: "2024-02-20T08:00:00Z"
  },

  // Case Research folder (6 notes)
  {
    id: "note-006",
    title: "Section 144 CrPC - Case Law Analysis",
    content: "Comprehensive analysis of Section 144 CrPC jurisprudence:\n\n1. Benazir Bhutto v. Federation (PLD 1988 SC 416): Cannot curtail fundamental right of assembly through blanket orders.\n\n2. Dr. Mobashir Hassan v. Federation (PLD 2010 SC 265): Right to peaceful assembly includes the right to protest.\n\n3. Baz Muhammad Kakar v. Federation (PLD 2012 SC 870): Section 144 orders must be specific, temporary, and proportionate.\n\n4. Key requirements for valid Section 144 order:\n   - Must specify the area\n   - Must have temporal limitation (max 2 months under CrPC)\n   - Must demonstrate imminent threat\n   - Must be proportionate to the threat\n\n5. Orders can be challenged through:\n   - Article 199 writ petition (mandamus/certiorari)\n   - Article 184(3) if public importance element exists\n\nThis research directly supports the brief in CP No. 1247/2024 (Muhammad Aslam case).",
    folder: "Case Research",
    tags: ["tag-001", "tag-004"],
    sourceId: "brief-001",
    sourceType: "brief",
    sourceLabel: "Brief: Muhammad Aslam v. Federation",
    createdAt: "2024-02-18T14:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z"
  },
  {
    id: "note-007",
    title: "Eyewitness Testimony Standards in Capital Cases",
    content: "Research on reliability of eyewitness testimony in capital punishment cases:\n\n1. Tariq Pervez v. The State (1995 SCMR 1345): Interested witnesses require independent corroboration.\n\n2. Muhammad Akram v. The State (2009 SCMR 230): Material contradictions regarding time, place, or manner of occurrence render testimony unreliable.\n\n3. Hashim Qasim v. The State (2017 SCMR 986): Single circumstance of doubt sufficient for acquittal.\n\n4. Key factors for assessing eyewitness reliability:\n   - Relationship to the deceased (interested vs. independent)\n   - Consistency between oral testimony and prior statements (Section 161/162 CrPC)\n   - Corroboration by medical evidence\n   - Corroboration by recovery evidence\n   - Explanation for delayed report\n\n5. Standard: In capital cases, prosecution must prove case 'beyond reasonable shadow of doubt' not just 'beyond reasonable doubt.'",
    folder: "Case Research",
    tags: ["tag-002", "tag-004"],
    sourceId: "brief-002",
    sourceType: "brief",
    sourceLabel: "Brief: State v. Imran Shahzad",
    createdAt: "2024-02-25T15:00:00Z",
    updatedAt: "2024-03-12T09:00:00Z"
  },
  {
    id: "note-008",
    title: "Khula Jurisprudence - Post Khurshid Bibi Developments",
    content: "Evolution of Khula law after the landmark Khurshid Bibi decision:\n\n1. Khurshid Bibi v. Muhammad Amin (PLD 1967 SC 97): Established wife's inherent right to Khula.\n\n2. Post-2002 developments: Family Courts Act amendments streamlined Khula proceedings.\n\n3. Current position:\n   - Wife's aversion to continue marriage is sufficient ground\n   - Reconciliation period reduced to 90 days\n   - Court has discretion regarding return of dower\n   - Where husband's cruelty established, return of benefits may be waived\n\n4. Quantum of return in Khula:\n   - Traditional view: Wife must return haq mehr and benefits received\n   - Modern approach: Court considers circumstances, including fault\n   - If dower was never paid, nothing to return\n\n5. Effect on children's custody: Khula does not affect custody rights. Custody determined independently under welfare principle.",
    folder: "Case Research",
    tags: ["tag-005", "tag-004"],
    sourceId: "brief-003",
    sourceType: "brief",
    sourceLabel: "Brief: Fatima Bibi v. Muhammad Tariq",
    createdAt: "2024-02-05T12:00:00Z",
    updatedAt: "2024-02-28T16:00:00Z"
  },
  {
    id: "note-009",
    title: "Retrospective Taxation Case Law Compilation",
    content: "Key cases on retrospective taxation in Pakistan:\n\n1. Elahi Cotton Mills v. Federation (PLD 1997 SC 582): Retrospective tax not per se unconstitutional but cannot be confiscatory.\n\n2. Eli Lilly Pakistan (PLD 2009 SC 1): Legislature has plenary power in taxation but legitimate expectations must be considered.\n\n3. Gadoon Textile Mills v. WAPDA (PLD 1997 SC 641): Fiscal incentives once granted create promissory estoppel.\n\n4. Tests for validity of retrospective tax:\n   a. Must serve legitimate purpose\n   b. Must not be arbitrary\n   c. Must not impose impossible obligation\n   d. Period of retrospectivity must be reasonable\n   e. Must not amount to confiscation\n\nRelevant to the Pakistan Steel Mills case (CP No. 2891/2024) and Rana Enterprises case (CP No. 4512/2024).",
    folder: "Case Research",
    tags: ["tag-006", "tag-004"],
    sourceId: "conv-011",
    sourceType: "research",
    sourceLabel: "Research: Retrospective Taxation",
    createdAt: "2024-01-28T09:00:00Z",
    updatedAt: "2024-03-08T11:00:00Z"
  },
  {
    id: "note-010",
    title: "Access to Justice - Balochistan Context",
    content: "Research on access to justice challenges in Balochistan:\n\n1. Statistics (as of Dec 2023):\n   - 52% judicial vacancy rate\n   - 87,456 pending cases\n   - 5.2 years average case duration (national: 2.8 years)\n   - 30 districts, many without resident judges\n\n2. Constitutional framework:\n   - Article 10-A: Right to fair trial\n   - Article 9: Right to life (includes access to justice)\n   - Article 175: Establishment of courts\n\n3. Relevant precedents:\n   - Al-Jehad Trust v. Federation (PLD 1996 SC 324)\n   - Watan Party v. Federation (PLD 2011 SC 997)\n\n4. Potential remedies:\n   - Mandatory directions to fill vacancies\n   - Timeline for recruitment through BPSC\n   - Mobile courts for remote districts\n   - Technology-based solutions (video link hearings)",
    folder: "Case Research",
    tags: ["tag-001", "tag-008"],
    sourceId: "brief-009",
    sourceType: "brief",
    sourceLabel: "Brief: Balochistan Bar Council v. Province",
    createdAt: "2024-02-20T13:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  },
  {
    id: "note-011",
    title: "CNSA Section 51 - Restrictive Clause Analysis",
    content: "Detailed analysis of the restrictive clause under Section 51 CNSA:\n\n1. Text of Section 51: Creates statutory bar against bail where court finds 'reasonable grounds for believing that the accused is guilty' of offence punishable with death/life.\n\n2. Threshold quantities (Third Schedule):\n   - Heroin: 1 kg (Section 9(c))\n   - Opium: 10 kg (Section 9(c))\n   - Cocaine: 1 kg (Section 9(c))\n   - Cannabis: 100 kg (Section 9(c))\n\n3. Key holdings:\n   - Muhammad Tanveer (2022 SCMR 1140): 'Extreme caution'\n   - Zafar Iqbal (2019 SCMR 2008): Strong presumption against bail\n   - Muhammad Hussain (PLD 2018 SC 678): Not absolute bar - exceptional circumstances\n   - Aamir Iqbal (2020 SCMR 567): Quantity above threshold strengthens presumption\n\n4. Exceptional circumstances for bail despite restrictive clause:\n   - Prolonged incarceration without trial (beyond reasonable period)\n   - Serious illness/medical emergency\n   - Weak prosecution evidence (where prima facie case not established)\n   - Delay attributable to prosecution",
    folder: "Case Research",
    tags: ["tag-002", "tag-004"],
    sourceId: "brief-010",
    sourceType: "brief",
    sourceLabel: "Brief: State v. Nasir Mehmood",
    createdAt: "2024-02-01T14:00:00Z",
    updatedAt: "2024-03-14T09:00:00Z"
  },

  // Brief Notes folder (4 notes)
  {
    id: "note-012",
    title: "Brief Review Notes - Muhammad Aslam Case",
    content: "Review points for the Constitutional Petition brief:\n\n1. STRONG POINTS:\n   - Blanket and indefinite nature of order is clearly unreasonable\n   - Strong precedent support (Benazir Bhutto, I.A. Sharwani)\n   - Court's interim order shows favorable inclination\n\n2. AREAS TO STRENGTHEN:\n   - Add international law arguments (ICCPR Articles 19, 21)\n   - Include comparative jurisprudence from India (Shreya Singhal)\n   - Quantify the impact (how many assemblies denied)\n\n3. POTENTIAL WEAKNESSES:\n   - State's security argument needs to be addressed more robustly\n   - May need to concede that some restrictions are permissible\n   - Address the State's argument about executive discretion in public order\n\n4. RECOMMENDED STRATEGY:\n   - Focus on proportionality argument\n   - Highlight the indefinite nature as the strongest point\n   - Propose alternative: regulated assembly with conditions instead of blanket ban",
    folder: "Brief Notes",
    tags: ["tag-001", "tag-003"],
    sourceId: "brief-001",
    sourceType: "brief",
    sourceLabel: "Brief: Muhammad Aslam v. Federation",
    createdAt: "2024-02-19T10:00:00Z",
    updatedAt: "2024-03-10T15:00:00Z"
  },
  {
    id: "note-013",
    title: "Brief Review Notes - Imran Shahzad Criminal Appeal",
    content: "Critical analysis of the criminal appeal brief:\n\n1. STRONGEST ARGUMENTS:\n   - 45-minute time discrepancy between PW-1 and PW-3 is material, not minor\n   - Weapon recovery without independent witnesses (Naveed Asghar principle)\n   - Number of wounds (4) vs. claimed shots (2) - medical vs. ocular inconsistency\n\n2. PROSECUTION VULNERABILITIES:\n   - Both eyewitnesses are related (interested witnesses)\n   - No independent witness from the busy commercial area\n   - Motive not established\n   - Delay in recovery of weapon (3 days)\n\n3. RISK FACTORS:\n   - Forensic match between weapon and bullet is strong corroborative evidence\n   - PW-1 was present at the scene (natural witness argument)\n   - Trial court's assessment of demeanor carries weight\n\n4. RECOMMENDATION:\n   - Lead with the medical evidence inconsistency\n   - Emphasize the golden rule: benefit of doubt as a matter of RIGHT",
    folder: "Brief Notes",
    tags: ["tag-002", "tag-008"],
    sourceId: "brief-002",
    sourceType: "brief",
    sourceLabel: "Brief: State v. Imran Shahzad",
    createdAt: "2024-02-26T09:00:00Z",
    updatedAt: "2024-03-15T11:00:00Z"
  },
  {
    id: "note-014",
    title: "Brief Comparison - HBL v. SECP vs Similar Corporate Cases",
    content: "Comparative analysis of the HBL case with similar corporate regulatory challenges:\n\n1. HBL v. SECP (CO No. 178/2024):\n   - Challenge to cross-holding divestiture circular\n   - Key issue: Scope of SECP's regulatory power\n   - Estimated loss from forced divestiture: Rs. 12 billion\n\n2. Similar cases:\n   - Pak-Arab Fertilizers v. SECP (2019 CLC 678 Isb): SECP's authority is bounded\n   - MCB Bank v. SBP (2016 SCMR 1890): Financial regulators must balance objectives\n   - Government of Pakistan v. Asghar Ali (PLD 2013 SC 61): Proportionality in regulation\n\n3. Distinguishing factors:\n   - The divestiture circular is sector-wide, not targeted\n   - Banking cross-holdings serve strategic purposes\n   - No prior consultation (natural justice violation)\n\n4. Likely outcome: Court may direct SECP to reconsider with consultation, rather than striking down entirely.",
    folder: "Brief Notes",
    tags: ["tag-003", "tag-007"],
    sourceId: "brief-005",
    sourceType: "brief",
    sourceLabel: "Brief: HBL v. SECP",
    createdAt: "2024-03-06T14:00:00Z",
    updatedAt: "2024-03-12T16:00:00Z"
  },
  {
    id: "note-015",
    title: "Zainab Noor Case - Brief Strategy Notes",
    content: "Strategy notes for the FIR registration case:\n\n1. This is a straightforward case given Sughran Bibi (PLD 2018 SC 595).\n\n2. Key argument: Section 154 CrPC imposes MANDATORY duty. The SHO has ZERO discretion.\n\n3. Additional considerations:\n   - The case involves sexual violence - heightened scrutiny applies\n   - Article 14 (dignity) is directly engaged\n   - Police accountability angle should be emphasized\n\n4. Post-FIR monitoring needed:\n   - The court order directs FIR registration - ensure compliance\n   - DIG Operations tasked with oversight\n   - Request progress report at next hearing\n\n5. Systemic issue: This is not an isolated incident. Consider requesting court to issue general directions for police training on Section 154 compliance.",
    folder: "Brief Notes",
    tags: ["tag-002", "tag-008"],
    sourceId: "brief-006",
    sourceType: "brief",
    sourceLabel: "Brief: Zainab Noor v. SHO Gulberg",
    createdAt: "2024-03-10T17:00:00Z",
    updatedAt: "2024-03-13T09:00:00Z"
  },

  // Judgment Drafts folder (3 notes)
  {
    id: "note-016",
    title: "Judgment Draft Notes - Section 144 Case",
    content: "Notes for the judgment draft in Muhammad Aslam v. Federation:\n\n1. STRUCTURE:\n   - Begin with the constitutional significance of the right to assembly\n   - Trace the history of Section 144 as a colonial-era provision\n   - Apply the proportionality test systematically\n\n2. KEY HOLDINGS TO INCLUDE:\n   - Blanket + indefinite = per se unreasonable\n   - Section 144 must specify: area, duration, threat, justification\n   - State must demonstrate necessity through evidence\n\n3. RELIEF CONSIDERATIONS:\n   - Strike down the specific order\n   - Issue prospective guidelines\n   - Direct the government to frame regulations for peaceful assemblies\n   - Consider directing notice requirement for assemblies (balance)\n\n4. TONE: Affirm the fundamental nature of the right while acknowledging legitimate security concerns. Avoid confrontational language vis-a-vis the executive.\n\n5. International law references: Cite ICCPR and UNHRC General Comment No. 37 on peaceful assembly.",
    folder: "Judgment Drafts",
    tags: ["tag-001", "tag-003"],
    sourceId: "jdg-001",
    sourceType: "judgment",
    sourceLabel: "Judgment: Muhammad Aslam v. Federation",
    createdAt: "2024-03-15T09:00:00Z",
    updatedAt: "2024-03-18T14:00:00Z"
  },
  {
    id: "note-017",
    title: "Judgment Review Checklist - Imran Shahzad Appeal",
    content: "Checklist for criminal appeal judgment:\n\n[ ] Verify all case law citations are correct and current\n[ ] Check that the analysis of PW testimony contradictions is precise\n[ ] Confirm the medical evidence analysis matches the post-mortem report\n[ ] Verify the weapons recovery timeline (arrest date, recovery date, memo date)\n[ ] Ensure the holding addresses each issue framed\n[ ] Check that the relief section includes direction for release\n[ ] Verify compliance with Hashim Qasim principle (benefit of doubt)\n[ ] Review whether trial court judgment errors are specifically identified\n[ ] Confirm that the standard of proof for capital cases is correctly stated\n[ ] Final review by senior for tone and legal accuracy\n\nDeadline: Judgment to be announced by 22.03.2024.",
    folder: "Judgment Drafts",
    tags: ["tag-002", "tag-007"],
    sourceId: "jdg-002",
    sourceType: "judgment",
    sourceLabel: "Judgment: State v. Imran Shahzad",
    createdAt: "2024-03-18T11:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z"
  },
  {
    id: "note-018",
    title: "Workers' Federation Judgment - Relief Formulation",
    content: "Notes on formulating relief in the minimum wages case:\n\n1. DILEMMA: Court cannot fix wages (executive function) but must ensure constitutional compliance.\n\n2. APPROACH:\n   - Direct reconvening of Minimum Wages Board\n   - Prescribe methodology: must consider PBS data, inflation, cost of living\n   - Set timeline for compliance (60-90 days)\n   - Require annual automatic adjustment mechanism\n   - Retain jurisdiction for monitoring\n\n3. CONSTITUTIONAL BASIS:\n   - Article 38(a) creates binding obligation\n   - Court can enforce through Article 199 directions\n   - Precedent: Pakistan Tobacco Co. (PLD 2002 SC 460)\n\n4. CAUTION: Avoid specific wage figure in the judgment. Focus on process and methodology. Let the executive determine the exact figure through the Board, but with constitutionally compliant criteria.\n\n5. International reference: ILO Convention No. 131 criteria for minimum wage fixing.",
    folder: "Judgment Drafts",
    tags: ["tag-001", "tag-007"],
    sourceId: "jdg-004",
    sourceType: "judgment",
    sourceLabel: "Judgment: Workers' Federation v. Punjab",
    createdAt: "2024-03-16T15:00:00Z",
    updatedAt: "2024-03-17T12:00:00Z"
  },

  // Hearing Prep folder (4 notes)
  {
    id: "note-019",
    title: "Hearing Prep - Muhammad Aslam (22.03.2024)",
    content: "Preparation notes for the hearing on 22nd March 2024:\n\n1. STATUS: AG Pakistan was directed to file concise statement. Verify if filed.\n\n2. EXPECTED PROCEEDINGS:\n   - AG's submissions on the concise statement\n   - Court may ask specific questions on proportionality\n   - Possible reservation for judgment\n\n3. KEY ARGUMENTS TO ADVANCE:\n   - If AG argues security concerns: demand specific intelligence evidence\n   - If AG argues executive discretion: cite Baz Muhammad Kakar (PLD 2012 SC 870)\n   - If court questions the scope of relief: propose graduated approach\n\n4. DOCUMENTS TO CARRY:\n   - Complete case file\n   - Copies of all cited precedents\n   - International law materials (ICCPR, UNHRC General Comment No. 37)\n   - Comparative jurisprudence from India and UK\n\n5. BENCH: CJ Qazi Faez Isa likely to be focused on proportionality. Prepare specific examples of how the blanket ban affects ordinary citizens.",
    folder: "Hearing Prep",
    tags: ["tag-001", "tag-008"],
    createdAt: "2024-03-20T08:00:00Z",
    updatedAt: "2024-03-21T18:00:00Z"
  },
  {
    id: "note-020",
    title: "Hearing Prep - Imran Shahzad (18.03.2024)",
    content: "Preparation for the criminal appeal hearing:\n\n1. STATUS: Sentence suspended, bail granted. Main hearing on appeal.\n\n2. ARGUMENTS TO BE MADE:\n   - Open with the medical evidence vs. ocular account contradiction\n   - Follow with the time discrepancy between PW-1 and PW-3\n   - Then address the weapon recovery issues\n   - Conclude with the absence of motive\n\n3. PROSECUTION LIKELY TO ARGUE:\n   - PW-1 is a natural witness\n   - Forensic match of weapon and bullet\n   - Minor discrepancies are expected in shock situations\n\n4. COUNTER-ARGUMENTS READY:\n   - 45-minute gap is not 'minor' - it's material\n   - 4 wounds vs. 2 shots is a medical impossibility with the prosecution story\n   - Recovery was after 3 days - planted evidence argument\n\n5. BENCH: Justice Malik Shahzad Ahmad Khan - known for meticulous evidence analysis. Focus on the evidence inconsistencies.",
    folder: "Hearing Prep",
    tags: ["tag-002", "tag-008"],
    createdAt: "2024-03-16T10:00:00Z",
    updatedAt: "2024-03-17T20:00:00Z"
  },
  {
    id: "note-021",
    title: "Hearing Prep - Fatima Bibi (25.03.2024)",
    content: "Preparation notes for the family appeal hearing:\n\n1. STATUS: Arguments from both sides complete. May be reserved or additional arguments.\n\n2. KEY ISSUES FOR THE BENCH:\n   - Custody of the 7-year-old boy: Hanafi age vs. welfare principle\n   - Quantum of maintenance: Petitioner seeks Rs. 80,000, respondent offers Rs. 30,000\n   - Dower recovery: Clear from nikahnama\n\n3. STRATEGY:\n   - On custody: Lead with Rana Abdul Khaliq (2019 SCMR 367) - welfare overrides age rule\n   - Emphasize continuity of care and emotional stability\n   - On maintenance: Submit cost of living evidence, school fees, medical expenses\n   - On dower: Straightforward - nikahnama is the best evidence\n\n4. OPPOSING COUNSEL STRATEGY:\n   - Likely to push hard on the age argument for the boy\n   - Will argue excessive maintenance quantum\n   - May raise Khula dower return issue\n\n5. BENCH: Justice Ayesha Malik - progressive on family law matters. Likely to prioritize child welfare.",
    folder: "Hearing Prep",
    tags: ["tag-005", "tag-003"],
    createdAt: "2024-03-22T08:00:00Z",
    updatedAt: "2024-03-24T15:00:00Z"
  },
  {
    id: "note-022",
    title: "Hearing Prep - Zainab Noor FIR Case (20.03.2024)",
    content: "Preparation for compliance hearing:\n\n1. STATUS: Court directed FIR registration on 12.03.2024. Compliance hearing on 20.03.2024.\n\n2. EXPECTED PROCEEDINGS:\n   - SHO to file compliance report\n   - DIG Operations to report on compliance\n   - If FIR registered, review investigation progress\n   - If not registered, contempt proceedings may be initiated\n\n3. POSSIBLE SCENARIOS:\n   a) FIR registered, investigation underway: Request timeline for investigation completion\n   b) FIR registered but no progress: Request transfer of investigation to senior officer\n   c) Non-compliance: Argue for contempt proceedings and personal liability of SHO\n\n4. ADDITIONAL RELIEF TO SEEK:\n   - Protection for the petitioner (witness protection)\n   - Direction for periodic investigation progress reports\n   - General direction for police training on Section 154 compliance\n\n5. DOCUMENTS: Court order dated 12.03.2024, original complaint, any evidence collected.\n\nNote: Petitioner's safety is paramount. Discuss security concerns with the bench if necessary.",
    folder: "Hearing Prep",
    tags: ["tag-002", "tag-008"],
    createdAt: "2024-03-18T16:00:00Z",
    updatedAt: "2024-03-19T14:00:00Z"
  }
];

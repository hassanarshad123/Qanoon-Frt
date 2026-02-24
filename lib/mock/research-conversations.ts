import type { ResearchConversation } from "./types";

export const researchConversations: ResearchConversation[] = [
  {
    id: "conv-001",
    title: "Scope of Article 184(3) Jurisdiction",
    createdAt: "2024-03-10",
    messages: [
      {
        id: "conv-001-m1",
        role: "user",
        content: "What is the current scope of Article 184(3) jurisdiction of the Supreme Court of Pakistan? Can it be invoked for enforcement of all fundamental rights?",
        timestamp: "2024-03-10T09:00:00Z"
      },
      {
        id: "conv-001-m2",
        role: "assistant",
        content: "Article 184(3) of the Constitution of Pakistan, 1973 confers original jurisdiction on the Supreme Court for enforcement of fundamental rights. However, this jurisdiction is subject to two preconditions:\n\n1. **Public Importance**: The matter must involve a question of public importance with reference to enforcement of fundamental rights.\n2. **Fundamental Rights**: The rights sought to be enforced must be guaranteed under Part II, Chapter 1 of the Constitution (Articles 8-28).\n\nThe Supreme Court has progressively expanded the scope of this jurisdiction. In **Benazir Bhutto v. Federation of Pakistan (PLD 1988 SC 416)**, the Court adopted a liberal interpretation allowing suo motu action. In **Workers' Party Pakistan v. Federation of Pakistan (PLD 2012 SC 681)**, the Court held that Article 184(3) encompasses all fundamental rights and can be invoked where a significant segment of the population is affected.\n\nHowever, the Court has also shown restraint. In **Maulvi Iqbal Haider v. Capital Development Authority (PLD 2006 SC 394)**, it was held that Article 184(3) cannot be invoked where an adequate alternative remedy exists, unless exceptional circumstances warrant bypass of the normal judicial hierarchy.\n\nThe key limitation is that individual grievances without a 'public importance' element should be pursued through Article 199 (High Court writ jurisdiction) rather than Article 184(3).",
        timestamp: "2024-03-10T09:01:00Z",
        citations: [
          {
            id: "cit-r001",
            caseName: "Workers' Party Pakistan v. Federation of Pakistan",
            citation: "PLD 2012 SC 681",
            court: "Supreme Court of Pakistan",
            year: "2012",
            relevance: "Expanded scope of Article 184(3)",
            snippet: "Article 184(3) jurisdiction encompasses all fundamental rights and can be invoked where a question of public importance is involved and a significant segment of the population is affected."
          },
          {
            id: "cit-r002",
            caseName: "Benazir Bhutto v. Federation of Pakistan",
            citation: "PLD 1988 SC 416",
            court: "Supreme Court of Pakistan",
            year: "1988",
            relevance: "Liberal interpretation of public importance",
            snippet: "The Court adopted a liberal interpretation of Article 184(3), holding that public importance must be given a wide meaning to ensure effective enforcement of fundamental rights."
          }
        ]
      },
      {
        id: "conv-001-m3",
        role: "user",
        content: "Can the Principles of Policy be enforced through Article 184(3)?",
        timestamp: "2024-03-10T09:10:00Z"
      },
      {
        id: "conv-001-m4",
        role: "assistant",
        content: "The Principles of Policy (Part II, Chapter 2, Articles 29-40) are not directly enforceable through Article 184(3), as that provision specifically refers to \"Fundamental Rights conferred by Chapter 1 of Part II.\" However, the Supreme Court has adopted an interpretive approach that bridges this gap:\n\n1. In **Khan Asfandyar Wali v. Federation of Pakistan (PLD 2001 SC 607)**, the Court held that Principles of Policy inform the interpretation of fundamental rights and create a constitutional framework for governance.\n\n2. More significantly, in **Shehla Zia v. WAPDA (PLD 1994 SC 693)**, the Court expanded the definition of \"right to life\" under Article 9 to include the right to a dignified existence, effectively incorporating aspects of the Principles of Policy into enforceable fundamental rights.\n\n3. Article 38 (promotion of social and economic well-being) has been given teeth through this interpretive expansion. For instance, the right to a living wage (Article 38(a)) has been enforced through Article 9.\n\nThus, while Principles of Policy cannot be directly invoked under Article 184(3), they can be indirectly enforced when read in conjunction with fundamental rights, particularly Articles 9 (right to life), 14 (dignity of man), and 25 (equality).",
        timestamp: "2024-03-10T09:11:00Z",
        citations: [
          {
            id: "cit-r003",
            caseName: "Shehla Zia v. WAPDA",
            citation: "PLD 1994 SC 693",
            court: "Supreme Court of Pakistan",
            year: "1994",
            relevance: "Expanded right to life includes Principles of Policy",
            snippet: "The right to life under Article 9 is not limited to mere physical existence but includes the right to live with dignity, thereby incorporating aspects of the Principles of Policy into enforceable fundamental rights."
          }
        ]
      }
    ]
  },
  {
    id: "conv-002",
    title: "Bail Jurisprudence under CNSA",
    createdAt: "2024-03-08",
    messages: [
      {
        id: "conv-002-m1",
        role: "user",
        content: "What is the current position on bail in cases under Section 9(c) of the Control of Narcotic Substances Act, 1997?",
        timestamp: "2024-03-08T14:00:00Z"
      },
      {
        id: "conv-002-m2",
        role: "assistant",
        content: "Bail in cases under Section 9(c) of the CNSA, 1997 is governed by the restrictive clause in Section 51, which creates a statutory bar against bail where:\n\n1. The offence is punishable with death or imprisonment for life (Section 9(c) carries both), AND\n2. The Court finds reasonable grounds for believing that the accused is guilty.\n\n**Key principles from recent Supreme Court jurisprudence:**\n\n- **Muhammad Tanveer v. The State (2022 SCMR 1140)**: Bail in CNSA cases must be considered with \"extreme caution\" given the societal impact of narcotics offences. The court must specifically address the restrictive clause before granting bail.\n\n- **Zafar Iqbal v. ANF (2019 SCMR 2008)**: The restrictive clause creates a strong presumption against bail. The bail court must record specific reasons for departing from this presumption.\n\n- **Muhammad Hussain v. The State (PLD 2018 SC 678)**: Even the restrictive clause is not an absolute bar. In exceptional circumstances (e.g., prolonged incarceration exceeding the likely sentence, serious illness, or where the case against the accused is based on weak evidence), bail may be granted.\n\n**Practical application:**\nThe quantity of narcotics is a critical factor. Where the quantity significantly exceeds the Third Schedule threshold, courts are less inclined to grant bail. Delay in trial may be a ground, but only where the delay is attributable to the prosecution.",
        timestamp: "2024-03-08T14:01:00Z",
        citations: [
          {
            id: "cit-r004",
            caseName: "Muhammad Tanveer v. The State",
            citation: "2022 SCMR 1140",
            court: "Supreme Court of Pakistan",
            year: "2022",
            relevance: "Extreme caution in CNSA bail cases",
            snippet: "Bail in cases under the CNSA must be considered with extreme caution. The bail granting court must specifically address the restrictive clause under Section 51 and record reasons for its non-application."
          }
        ]
      }
    ]
  },
  {
    id: "conv-003",
    title: "Land Acquisition Compensation Standards",
    createdAt: "2024-03-05",
    messages: [
      {
        id: "conv-003-m1",
        role: "user",
        content: "What is the standard for determining just compensation in land acquisition cases under the Land Acquisition Act, 1894?",
        timestamp: "2024-03-05T10:00:00Z"
      },
      {
        id: "conv-003-m2",
        role: "assistant",
        content: "The determination of just compensation in land acquisition cases is governed by Section 23 of the Land Acquisition Act, 1894, read with Article 24 of the Constitution of Pakistan. The key principles are:\n\n**1. Market Value (Section 23(1))**:\nThe primary criterion is the market value of the land at the date of publication of the notification under Section 4. This is determined by:\n- Comparable sales in the vicinity\n- The potential use of the land\n- Location advantages and development potential\n\n**2. Additional Compensation (Section 23(1A))**:\nA solatium of 15% on the market value is payable as additional compensation for compulsory acquisition.\n\n**3. Damage to Remaining Land (Section 23(1)(c))**:\nCompensation for damage to the owner's remaining land due to severance.\n\n**4. Constitutional Standard (Article 24)**:\nThe Supreme Court in **Ghulam Abbas v. Province of Punjab (PLD 2004 SC 485)** held that Article 24 requires \"adequate compensation\" which must be at or near market value, not arbitrary or confiscatory.\n\n**5. Province of Sindh v. Akhtar Hussain (2015 SCMR 1299)**: Compensation must be assessed on the date of notification, not the date of actual possession, and must reflect the true market conditions prevailing at that time.\n\n**6. Increase over time**: If there is unreasonable delay between notification and award, the owner is entitled to enhanced compensation reflecting the market appreciation during that period.",
        timestamp: "2024-03-05T10:01:00Z",
        citations: [
          {
            id: "cit-r005",
            caseName: "Ghulam Abbas v. Province of Punjab",
            citation: "PLD 2004 SC 485",
            court: "Supreme Court of Pakistan",
            year: "2004",
            relevance: "Adequate compensation standard",
            snippet: "Article 24 of the Constitution requires that compensation for compulsorily acquired property must be adequate and at or near the market value, ensuring the dispossessed owner is placed in the same economic position."
          }
        ]
      },
      {
        id: "conv-003-m3",
        role: "user",
        content: "Can the landowner challenge the compensation amount in court?",
        timestamp: "2024-03-05T10:15:00Z"
      },
      {
        id: "conv-003-m4",
        role: "assistant",
        content: "Yes, the landowner has multiple avenues to challenge inadequate compensation:\n\n**1. Reference to Civil Court (Section 18)**:\nThe landowner can seek a reference to the Civil Court if dissatisfied with the Collector's award. The court then determines the market value de novo based on evidence presented by both parties. This is the primary statutory remedy.\n\n**2. High Court Writ Jurisdiction (Article 199)**:\nWhere the entire acquisition proceedings are challenged as being ultra vires or unconstitutional, the High Court can be approached under Article 199. This includes challenges to inadequacy of compensation where it amounts to confiscation (Province of Sindh v. Akhtar Hussain, 2015 SCMR 1299).\n\n**3. Supreme Court (Article 185)**:\nAppeal by leave to the Supreme Court from the High Court's decision.\n\nImportantly, the Supreme Court in **Muhammad Rafique v. Government of Pakistan (2018 CLC 1023 Kar)** held that where the disparity between the Collector's assessment and the actual market value exceeds 100%, it creates a strong presumption of arbitrariness warranting judicial intervention.",
        timestamp: "2024-03-05T10:16:00Z",
        citations: [
          {
            id: "cit-r006",
            caseName: "Province of Sindh v. Akhtar Hussain",
            citation: "2015 SCMR 1299",
            court: "Supreme Court of Pakistan",
            year: "2015",
            relevance: "Challenging land acquisition compensation",
            snippet: "Where compensation is grossly inadequate amounting to confiscation, the High Court's writ jurisdiction under Article 199 can be invoked to ensure compliance with Article 24 of the Constitution."
          }
        ]
      }
    ]
  },
  {
    id: "conv-004",
    title: "Custody Rights under Hanafi Law",
    createdAt: "2024-02-28",
    messages: [
      {
        id: "conv-004-m1",
        role: "user",
        content: "What are the custody rights of mothers under Hanafi law in Pakistan, particularly regarding the age of hizanat?",
        timestamp: "2024-02-28T11:00:00Z"
      },
      {
        id: "conv-004-m2",
        role: "assistant",
        content: "Under Hanafi jurisprudence, as applied in Pakistan, the mother has a preferential right to custody (hizanat) of minor children. The traditional age limits are:\n\n- **Boys**: Until age 7 (age of discretion/tamyiz)\n- **Girls**: Until puberty (approximately 12-14 years)\n\nHowever, modern Pakistani jurisprudence has significantly evolved:\n\n**1. Welfare Principle Override**:\nThe Supreme Court in **Rana Abdul Khaliq v. Mst. Tahira (2019 SCMR 367)** held that the traditional age-based rules are not rigid and the welfare of the child is the paramount consideration. Custody may be extended beyond the prescribed age where the child's welfare demands it.\n\n**2. Mst. Salma Agha v. The State (2018 SCMR 1196)**:\nThe Court emphasized a holistic welfare assessment including:\n- Emotional bonding with the custodial parent\n- Educational stability\n- Physical well-being and safety\n- The child's own preference (if of sufficient understanding)\n\n**3. Section 12 of the Guardians and Wards Act, 1890**:\nThe court must consider the welfare of the minor as the paramount consideration, and the personal law (Hanafi rules) serves as a guideline, not a rigid rule.\n\n**4. Disqualifying factors for the mother include**:\n- Remarriage to a stranger (non-mahram of the child)\n- Moral turpitude\n- Inability to maintain the child\n- Neglect or abuse",
        timestamp: "2024-02-28T11:01:00Z",
        citations: [
          {
            id: "cit-r007",
            caseName: "Rana Abdul Khaliq v. Mst. Tahira",
            citation: "2019 SCMR 367",
            court: "Supreme Court of Pakistan",
            year: "2019",
            relevance: "Hizanat age not rigid under welfare principle",
            snippet: "The traditional age-based rules for hizanat are guidelines, not rigid rules. The welfare of the child is the paramount consideration and custody may be awarded to the mother beyond the prescribed age."
          },
          {
            id: "cit-r008",
            caseName: "Mst. Salma Agha v. The State",
            citation: "2018 SCMR 1196",
            court: "Supreme Court of Pakistan",
            year: "2018",
            relevance: "Holistic welfare assessment in custody",
            snippet: "Custody must be determined through a holistic assessment of the child's welfare including emotional, physical, and educational factors. The child's own preference is relevant where the child has sufficient understanding."
          }
        ]
      }
    ]
  },
  {
    id: "conv-005",
    title: "FIR Registration - Mandatory Duty of Police",
    createdAt: "2024-02-25",
    messages: [
      {
        id: "conv-005-m1",
        role: "user",
        content: "Is FIR registration mandatory under Section 154 CrPC? What remedies are available if police refuse to register?",
        timestamp: "2024-02-25T16:00:00Z"
      },
      {
        id: "conv-005-m2",
        role: "assistant",
        content: "Yes, FIR registration is mandatory under Section 154 CrPC. The law is now well-settled following the Supreme Court's landmark judgment in **Mst. Sughran Bibi v. Government of Punjab (PLD 2018 SC 595)**.\n\n**Legal Position:**\n\nSection 154(1) CrPC provides: \"Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction.\"\n\n**Key Points:**\n1. The duty is **ministerial** - the officer has no discretion to refuse.\n2. No preliminary inquiry is required before registration.\n3. The merits of the information or the identity of the accused are irrelevant at the stage of registration.\n4. The information need only disclose commission of a cognizable offence.\n\n**Remedies if police refuse:**\n\n1. **Section 154(3) CrPC**: Send the information by post to the Superintendent of Police who shall investigate or direct investigation.\n2. **Section 22-A CrPC (as amended)**: Application to the Justice of Peace (Sessions Judge) for direction to register FIR.\n3. **Article 199**: Writ petition before the High Court seeking mandamus for FIR registration.\n4. **Departmental complaint**: Against the SHO for dereliction of duty.\n\nThe Supreme Court in **Muhammad Bashir v. SHO (2020 SCMR 1540)** directed that any officer refusing to register FIR shall face departmental proceedings.",
        timestamp: "2024-02-25T16:01:00Z",
        citations: [
          {
            id: "cit-r009",
            caseName: "Mst. Sughran Bibi v. Government of Punjab",
            citation: "PLD 2018 SC 595",
            court: "Supreme Court of Pakistan",
            year: "2018",
            relevance: "Mandatory nature of FIR registration",
            snippet: "Registration of FIR under Section 154 CrPC is a mandatory ministerial duty. The police officer has no discretion to refuse registration or to conduct any preliminary inquiry before registration."
          }
        ]
      }
    ]
  },
  {
    id: "conv-006",
    title: "Tax Assessment Reopening under Section 122(5A)",
    createdAt: "2024-02-20",
    messages: [
      {
        id: "conv-006-m1",
        role: "user",
        content: "Under what circumstances can the Commissioner reopen a concluded tax assessment under Section 122(5A) of the Income Tax Ordinance, 2001?",
        timestamp: "2024-02-20T13:00:00Z"
      },
      {
        id: "conv-006-m2",
        role: "assistant",
        content: "Section 122(5A) of the Income Tax Ordinance, 2001 empowers the Commissioner to amend a concluded assessment where \"definite information\" comes to the notice of the Commissioner. The key principles are:\n\n**1. Definite Information Requirement:**\nThe Commissioner must possess \"definite information\" which was not available at the time of the original assessment. Vague suspicions or change of opinion do not constitute definite information. In **Commissioner of Income Tax v. Messrs Sargodha Spinning Mills (2009 SCMR 1423)**, the Supreme Court held that the information must be specific, concrete, and verifiable.\n\n**2. Time Limitation:**\nAmendment under Section 122(5A) can be made within five years from the end of the financial year in which the Commissioner becomes aware of the definite information. For tax years prior to Tax Year 2020, the limitation was six years.\n\n**3. Procedural Requirements:**\n- Issuance of show cause notice specifying the definite information\n- Providing adequate opportunity of hearing (audi alteram partem)\n- Recording of reasons in writing before passing the order\n\n**4. Judicial Limitations:**\nThe Lahore High Court in **Packages Limited v. Commissioner (2017 PTD 1842)** held that Section 122(5A) cannot be used as a tool for roving inquiry or fishing expedition. The Commissioner must demonstrate a nexus between the definite information and the proposed amendment.",
        timestamp: "2024-02-20T13:01:00Z",
        citations: [
          {
            id: "cit-r010",
            caseName: "Commissioner of Income Tax v. Messrs Sargodha Spinning Mills",
            citation: "2009 SCMR 1423",
            court: "Supreme Court of Pakistan",
            year: "2009",
            relevance: "Definition of 'definite information' under Section 122(5A)",
            snippet: "Definite information must be specific, concrete, and verifiable. Change of opinion by the tax officer does not constitute definite information warranting reopening of a concluded assessment."
          }
        ]
      },
      {
        id: "conv-006-m3",
        role: "user",
        content: "What constitutes a valid show cause notice under Section 122(5A)?",
        timestamp: "2024-02-20T13:15:00Z"
      },
      {
        id: "conv-006-m4",
        role: "assistant",
        content: "A valid show cause notice under Section 122(5A) must satisfy the following requirements:\n\n**1. Specificity of Information:**\nThe notice must clearly state the \"definite information\" that has come to the Commissioner's notice. In **Federation of Pakistan v. Messrs Bhatti Industries (2014 PTD 2156 SC)**, the Supreme Court struck down an assessment order where the show cause notice merely stated \"information received\" without specifying the nature of the information.\n\n**2. Proposed Amendment:**\nThe notice must specify the proposed amendment to the original assessment, including the particular head of income, the amount of income proposed to be added, and the provision of law under which the amendment is proposed.\n\n**3. Reasonable Time:**\nThe taxpayer must be given a reasonable time (minimum 15 days under the Rules) to respond to the notice.\n\n**4. Jurisdictional Fact:**\nThe notice must be issued by the Commissioner having jurisdiction over the taxpayer's assessment.\n\nA defective show cause notice renders the entire reassessment proceedings void ab initio, as held in **Messrs Habib Bank Limited v. Federation of Pakistan (2018 PTD 1890 Kar)**.",
        timestamp: "2024-02-20T13:16:00Z",
        citations: [
          {
            id: "cit-r011",
            caseName: "Federation of Pakistan v. Messrs Bhatti Industries",
            citation: "2014 PTD 2156 SC",
            court: "Supreme Court of Pakistan",
            year: "2014",
            relevance: "Validity of show cause notice",
            snippet: "A show cause notice that does not specify the definite information or the proposed amendment is defective and renders the reassessment proceedings void ab initio."
          }
        ]
      }
    ]
  },
  {
    id: "conv-007",
    title: "Proportionality in Fundamental Rights Restrictions",
    createdAt: "2024-02-15",
    messages: [
      {
        id: "conv-007-m1",
        role: "user",
        content: "How does the proportionality test apply when evaluating restrictions on fundamental rights in Pakistan?",
        timestamp: "2024-02-15T08:00:00Z"
      },
      {
        id: "conv-007-m2",
        role: "assistant",
        content: "The proportionality test in Pakistani constitutional law has been developed through a series of landmark judgments and applies a structured analysis to evaluate restrictions on fundamental rights:\n\n**The Four-Part Test:**\n\n1. **Legitimate Objective**: The restriction must pursue a legitimate constitutional objective (e.g., public order, morality, national security).\n\n2. **Rational Connection**: There must be a rational nexus between the restriction and the objective sought to be achieved.\n\n3. **Necessity (Least Restrictive Means)**: The restriction must be the least restrictive means available to achieve the objective. If a less restrictive alternative exists, the more restrictive measure fails this test.\n\n4. **Proportionality Stricto Sensu**: The impact of the restriction on the fundamental right must not be disproportionate to the benefit gained.\n\n**Key Precedents:**\n\n- **I.A. Sharwani v. Government of Pakistan (PLD 1991 SC 734)**: Introduced the proportionality principle in Pakistani constitutional law.\n- **Baz Muhammad Kakar v. Federation of Pakistan (PLD 2012 SC 870)**: Applied the four-part test to fundamental rights restrictions.\n- **Dr. Mobashir Hassan v. Federation of Pakistan (PLD 2010 SC 265)**: The proportionality analysis must be context-specific and consider the importance of the right at stake.\n\nThe proportionality test is most frequently applied to restrictions under Articles 15-19 and Article 25 of the Constitution.",
        timestamp: "2024-02-15T08:01:00Z",
        citations: [
          {
            id: "cit-r012",
            caseName: "I.A. Sharwani v. Government of Pakistan",
            citation: "PLD 1991 SC 734",
            court: "Supreme Court of Pakistan",
            year: "1991",
            relevance: "Origin of proportionality principle in Pakistan",
            snippet: "The proportionality principle requires that any restriction on fundamental rights must be rationally connected to a legitimate objective, be the least restrictive means available, and not impose a disproportionate burden on the right-holder."
          }
        ]
      }
    ]
  },
  {
    id: "conv-008",
    title: "Right to Fair Trial - Article 10-A",
    createdAt: "2024-02-10",
    messages: [
      {
        id: "conv-008-m1",
        role: "user",
        content: "What is the scope of the right to fair trial under Article 10-A of the Constitution?",
        timestamp: "2024-02-10T10:30:00Z"
      },
      {
        id: "conv-008-m2",
        role: "assistant",
        content: "Article 10-A, inserted by the 18th Constitutional Amendment in 2010, provides: \"For the determination of his civil rights and obligations or in any criminal charge against him, a person shall be entitled to a fair trial and due process.\"\n\n**Components of Fair Trial under Article 10-A:**\n\n1. **Right to be heard (Audi Alteram Partem)**: No adverse order can be passed without giving the affected person an opportunity of hearing.\n\n2. **Right to counsel**: The right to be represented by a legal practitioner of one's choice.\n\n3. **Right to speedy trial**: Cases must be decided within a reasonable timeframe. In **Watan Party v. Federation of Pakistan (PLD 2011 SC 997)**, excessive delay was held to violate Article 10-A.\n\n4. **Right against self-incrimination**: Under Article 13 read with Article 10-A.\n\n5. **Right to cross-examine**: An essential component of fair trial.\n\n6. **Impartial tribunal**: The adjudicator must be free from bias.\n\n7. **Reasoned decision**: Every judicial or quasi-judicial order must contain reasons.\n\n**Notable Developments:**\n\n- The Supreme Court in **Government of KPK v. Khan Zaman (2014 SCMR 1469)** held that Article 10-A applies to all proceedings, civil and criminal, and also to quasi-judicial proceedings before tribunals.\n- In **Al-Jehad Trust v. Federation of Pakistan (PLD 1996 SC 324)**, even before Article 10-A was enacted, the Court recognized fair trial as an inherent right.",
        timestamp: "2024-02-10T10:31:00Z",
        citations: [
          {
            id: "cit-r013",
            caseName: "Government of KPK v. Khan Zaman",
            citation: "2014 SCMR 1469",
            court: "Supreme Court of Pakistan",
            year: "2014",
            relevance: "Broad scope of Article 10-A",
            snippet: "Article 10-A applies to all proceedings where civil rights and obligations are determined, including administrative and quasi-judicial proceedings, not just court proceedings."
          }
        ]
      },
      {
        id: "conv-008-m3",
        role: "user",
        content: "How does Article 10-A interact with anti-terrorism proceedings?",
        timestamp: "2024-02-10T10:45:00Z"
      },
      {
        id: "conv-008-m4",
        role: "assistant",
        content: "The interaction between Article 10-A and anti-terrorism proceedings under the Anti-Terrorism Act, 1997 raises significant constitutional questions:\n\n**1. In-camera proceedings**: Section 19 of the ATA allows in-camera trials. The Supreme Court in **Mehram Ali v. Federation of Pakistan (PLD 1998 SC 1445)** upheld this provision as a reasonable restriction in the interest of national security, subject to the accused's right to counsel and cross-examination being preserved.\n\n**2. Witness protection**: Anonymous witness testimony is permissible under the ATA but must be balanced against the accused's right to effective cross-examination under Article 10-A.\n\n**3. Time-bound trials**: Section 19(7) of the ATA mandates completion of trial within 7 working days (extendable to 30 days). While intended to ensure speedy justice, the Supreme Court has cautioned that speed cannot override fairness.\n\n**4. Confession before police**: Section 21-H of the ATA makes confessions before police admissible, departing from the general rule. The Federal Shariat Court in **Maulvi Noor Muhammad v. Federation of Pakistan (PLD 2015 FSC 1)** examined this provision's compatibility with Article 10-A.\n\nThe key principle is that while special anti-terrorism procedures are constitutionally permissible, they cannot derogate from the irreducible minimum requirements of Article 10-A: the right to counsel, the right to cross-examine, and the right to a reasoned judgment.",
        timestamp: "2024-02-10T10:46:00Z",
        citations: [
          {
            id: "cit-r014",
            caseName: "Mehram Ali v. Federation of Pakistan",
            citation: "PLD 1998 SC 1445",
            court: "Supreme Court of Pakistan",
            year: "1998",
            relevance: "Anti-terrorism proceedings and fair trial",
            snippet: "Special anti-terrorism procedures are constitutionally permissible as reasonable restrictions but cannot derogate from the irreducible minimum requirements of fair trial including the right to counsel and cross-examination."
          }
        ]
      }
    ]
  },
  {
    id: "conv-009",
    title: "Corporate Regulatory Powers of SECP",
    createdAt: "2024-02-05",
    messages: [
      {
        id: "conv-009-m1",
        role: "user",
        content: "What are the limits of SECP's regulatory powers under the Companies Act, 2017?",
        timestamp: "2024-02-05T14:00:00Z"
      },
      {
        id: "conv-009-m2",
        role: "assistant",
        content: "The Securities and Exchange Commission of Pakistan (SECP) derives its regulatory powers from the SECP Act, 1997 and the Companies Act, 2017. Its powers are broad but constitutionally circumscribed:\n\n**Scope of Powers:**\n\n1. **Registration & Regulation (Part III)**: Power to register, regulate, and deregister companies.\n2. **Inspection & Investigation (Sections 247-256)**: Power to inspect books, conduct investigations, and appoint inspectors.\n3. **Enforcement (Sections 506-512)**: Power to issue directives, impose penalties, and prosecute offences.\n4. **Market Regulation**: Oversight of the securities market, stock exchanges, and listed companies.\n\n**Constitutional Limits:**\n\nSECP's powers are subject to:\n\n1. **Article 18 (Freedom of Trade)**: SECP cannot impose unreasonable restrictions on lawful business activities. In **Messrs Pak-Arab Fertilizers v. SECP (2019 CLC 678 Isb)**, the Islamabad High Court held that regulatory directives must not be arbitrary or unreasonable.\n\n2. **Article 23/24 (Property Rights)**: Regulatory actions that amount to confiscation or deprivation of property require due process.\n\n3. **Natural Justice**: SECP must observe principles of natural justice (audi alteram partem) before issuing adverse orders. In **MCB Bank Ltd. v. SBP (2016 SCMR 1890)**, the Supreme Court emphasized that financial regulators must balance efficiency with procedural fairness.\n\n4. **Proportionality**: Regulatory measures must be proportionate to the objective. Overly broad directives affecting an entire sector may be challenged on proportionality grounds.",
        timestamp: "2024-02-05T14:01:00Z",
        citations: [
          {
            id: "cit-r015",
            caseName: "Messrs Pak-Arab Fertilizers v. SECP",
            citation: "2019 CLC 678 Isb",
            court: "Islamabad High Court",
            year: "2019",
            relevance: "Limits of SECP regulatory authority",
            snippet: "SECP's regulatory authority under the Companies Act is not unbounded. Directives that are arbitrary, unreasonable, or disproportionate to the regulatory objective are amenable to judicial review."
          }
        ]
      }
    ]
  },
  {
    id: "conv-010",
    title: "Compassionate Appointment in Government Service",
    createdAt: "2024-01-30",
    messages: [
      {
        id: "conv-010-m1",
        role: "user",
        content: "What is the legal framework for compassionate appointment in Pakistan?",
        timestamp: "2024-01-30T09:00:00Z"
      },
      {
        id: "conv-010-m2",
        role: "assistant",
        content: "Compassionate appointment in Pakistan is governed by a combination of constitutional provisions, executive policies, and judicial pronouncements:\n\n**Constitutional Basis:**\n- Article 9: Right to life (includes right to livelihood)\n- Article 38(a): State obligation to secure well-being of the people\n- Article 25: Equality before law\n\n**Policy Framework:**\nEach province and the Federal Government have separate compassionate appointment policies:\n- Federal: Establishment Division O.M. No. 8/9/2010-R-II\n- Punjab: Services & General Administration Department Policy 2016\n- KPK: Compassionate Appointment Policy 2015\n- Sindh: Services Department Policy 2018\n- Balochistan: Services Department Policy 2017\n\n**Key Judicial Pronouncements:**\n\n1. **Muhammad Sajid v. Government of KPK (PLD 2019 SC 675)**: Compassionate appointment is a constitutional obligation when the dependent family faces destitution. Technical requirements like educational qualifications can be relaxed.\n\n2. **Government of Punjab v. Rafaqat Ali (2017 SCMR 2045)**: The purpose is to prevent the family from being thrown into destitution. Relaxation of age and qualification is not only permissible but expected.\n\n3. **Mst. Yasmeen v. Government of Punjab (2020 PLC (CS) 789)**: The widow of a deceased government servant has a preferential right to compassionate appointment over other dependents.\n\n**Eligibility:**\n- Dependent spouse, children, or parents of a deceased government servant\n- Death must have occurred during service\n- The family must be in financial hardship\n- Application must be made within a prescribed time (usually 5 years)",
        timestamp: "2024-01-30T09:01:00Z",
        citations: [
          {
            id: "cit-r016",
            caseName: "Muhammad Sajid v. Government of KPK",
            citation: "PLD 2019 SC 675",
            court: "Supreme Court of Pakistan",
            year: "2019",
            relevance: "Compassionate appointment as constitutional right",
            snippet: "Compassionate appointment is a constitutional obligation flowing from Articles 9 and 38. The State cannot reject an application on technical grounds when the family faces genuine destitution."
          }
        ]
      }
    ]
  },
  {
    id: "conv-011",
    title: "Retrospective Taxation and Constitutional Limits",
    createdAt: "2024-01-25",
    messages: [
      {
        id: "conv-011-m1",
        role: "user",
        content: "Can the Parliament impose taxes with retrospective effect? What are the constitutional limitations?",
        timestamp: "2024-01-25T15:00:00Z"
      },
      {
        id: "conv-011-m2",
        role: "assistant",
        content: "The Parliament has the power to impose taxes with retrospective effect under its plenary taxing power, but this power is subject to constitutional limitations:\n\n**General Principle:**\nThe Supreme Court in **Messrs Elahi Cotton Mills v. Federation of Pakistan (PLD 1997 SC 582)** held that retrospective taxation is not per se unconstitutional. The Legislature has competence to enact laws with retrospective operation, including tax laws.\n\n**Constitutional Limitations:**\n\n1. **Article 77**: No tax shall be levied except by or under the authority of an Act of Parliament. The retrospective legislation must still comply with this requirement.\n\n2. **Article 24 (Property Rights)**: Retrospective taxation cannot be confiscatory. If the tax burden is so excessive that it effectively confiscates property, it violates Article 24.\n\n3. **Article 4 (Right to due treatment)**: Retrospective legislation must not violate the right to be dealt with in accordance with law.\n\n4. **Principle of Legitimate Expectation**: Where taxpayers have organized their affairs based on existing law, abrupt retrospective changes may violate the principle of legitimate expectation recognized in **Commissioner of Income Tax v. Eli Lilly Pakistan (PLD 2009 SC 1)**.\n\n**Key Limitations from Jurisprudence:**\n\n- Retrospective taxation must serve a legitimate purpose (e.g., closing loopholes, validating existing practice)\n- It must not be arbitrary or unreasonable\n- It must not impose an impossible obligation (e.g., taxing income that was exempt when earned)\n- The period of retrospectivity must be reasonable\n\nThe Sindh High Court in **Pakistan Steel Mills v. FBR (under consideration)** is currently examining whether retrospective super tax on loss-making entities violates these principles.",
        timestamp: "2024-01-25T15:01:00Z",
        citations: [
          {
            id: "cit-r017",
            caseName: "Messrs Elahi Cotton Mills v. Federation of Pakistan",
            citation: "PLD 1997 SC 582",
            court: "Supreme Court of Pakistan",
            year: "1997",
            relevance: "Parliament's power of retrospective taxation",
            snippet: "Retrospective taxation is not per se unconstitutional. The Legislature has competence to enact laws with retrospective operation, provided such legislation does not amount to confiscation or violation of fundamental rights."
          }
        ]
      },
      {
        id: "conv-011-m3",
        role: "user",
        content: "How does the doctrine of legitimate expectation apply to tax cases?",
        timestamp: "2024-01-25T15:20:00Z"
      },
      {
        id: "conv-011-m4",
        role: "assistant",
        content: "The doctrine of legitimate expectation in the context of taxation has been recognized in Pakistani jurisprudence, though its application remains developing:\n\n**The Doctrine:**\nLegitimate expectation arises when a taxpayer has arranged their affairs based on existing law or published government policy, and the government subsequently changes the law retrospectively to their detriment.\n\n**Application in Tax Cases:**\n\n1. **Commissioner of Income Tax v. Eli Lilly Pakistan (PLD 2009 SC 1)**: The Supreme Court recognized that taxpayers have a legitimate expectation that the tax laws in force at the time of their transactions will apply. Retrospective changes undermining this expectation require strong justification.\n\n2. **Pakistan Tobacco Company v. Government of Pakistan (2011 PTD 1247)**: Tax exemptions granted under SROs create legitimate expectations that cannot be withdrawn retrospectively without reasonable cause.\n\n3. **Messrs Gadoon Textile Mills v. WAPDA (PLD 1997 SC 641)**: Where the government induces investment through specific fiscal incentives, the retrospective withdrawal of those incentives violates the principle of promissory estoppel, which is closely related to legitimate expectation.\n\n**Limitations:**\nThe doctrine does not prevent the government from changing tax policy prospectively. It only restrains retrospective changes that undermine vested rights or settled expectations based on clear and unambiguous representations by the State.",
        timestamp: "2024-01-25T15:21:00Z",
        citations: [
          {
            id: "cit-r018",
            caseName: "Commissioner of Income Tax v. Eli Lilly Pakistan",
            citation: "PLD 2009 SC 1",
            court: "Supreme Court of Pakistan",
            year: "2009",
            relevance: "Legitimate expectation in tax law",
            snippet: "Taxpayers have a legitimate expectation that the tax laws in force at the time of their transactions will apply. Retrospective changes require strong justification and must not amount to confiscation."
          }
        ]
      }
    ]
  },
  {
    id: "conv-012",
    title: "Writ Jurisdiction of High Courts - Article 199",
    createdAt: "2024-01-20",
    messages: [
      {
        id: "conv-012-m1",
        role: "user",
        content: "What are the different types of writs available under Article 199 and their scope?",
        timestamp: "2024-01-20T11:00:00Z"
      },
      {
        id: "conv-012-m2",
        role: "assistant",
        content: "Article 199 of the Constitution confers writ jurisdiction on the High Courts. The following writs are available:\n\n**1. Certiorari (Article 199(1)(a)(ii))**:\n- **Purpose**: To quash an order or proceedings of a person performing functions in connection with the affairs of the Federation, Province, or local authority.\n- **Scope**: Available against quasi-judicial and administrative orders. Grounds include: lack of jurisdiction, error of law on the face of record, violation of natural justice, and perversity of findings.\n- **Key case**: **Tariq Transport v. Sargodha-Bhera Bus Service (PLD 1958 SC 437)** - established the grounds for certiorari in Pakistan.\n\n**2. Mandamus (Article 199(1)(a)(i))**:\n- **Purpose**: To direct a person performing public functions to do what their duty requires.\n- **Scope**: Available only where there is a clear legal duty and a corresponding right. The duty must be ministerial (non-discretionary).\n- **Key case**: **Muhammad Bashir v. SHO (2020 SCMR 1540)** - mandamus for FIR registration.\n\n**3. Prohibition (Article 199(1)(a)(ii))**:\n- **Purpose**: To prevent a subordinate court or tribunal from acting without or in excess of jurisdiction.\n- **Scope**: Available before the order is made (unlike certiorari which is post-order). Acts as a preventive remedy.\n\n**4. Quo Warranto (Article 199(1)(b)(ii))**:\n- **Purpose**: To challenge the legality of a person's claim to hold public office.\n- **Scope**: Any person can challenge the authority of a public office holder.\n\n**5. Habeas Corpus (Article 199(1)(b)(i))**:\n- **Purpose**: To secure the release of a person who is unlawfully detained.\n- **Scope**: The widest of all writs. Available against both State and private detention.\n- **Key case**: **Government of West Pakistan v. Begum Agha Abdul Karim Shorish Kashmiri (PLD 1969 SC 14)** - scope of habeas corpus in Pakistan.\n\n**General Limitations:**\n- Adequate alternative remedy bars writ jurisdiction (except in cases of violation of fundamental rights)\n- Laches and delay may disentitle the petitioner\n- Disputed questions of fact cannot be resolved in writ jurisdiction",
        timestamp: "2024-01-20T11:01:00Z",
        citations: [
          {
            id: "cit-r019",
            caseName: "Tariq Transport v. Sargodha-Bhera Bus Service",
            citation: "PLD 1958 SC 437",
            court: "Supreme Court of Pakistan",
            year: "1958",
            relevance: "Grounds for certiorari",
            snippet: "Certiorari lies to quash orders of tribunals and authorities acting in a quasi-judicial capacity on grounds of lack of jurisdiction, error of law apparent on the face of the record, violation of natural justice, or perversity of findings."
          }
        ]
      }
    ]
  }
];

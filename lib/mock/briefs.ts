import type { Brief, EnhancedBrief } from "./types";

export const briefs: (Brief | EnhancedBrief)[] = [
  {
    id: "brief-001",
    caseId: "case-001",
    caseTitle: "Muhammad Aslam v. Federation of Pakistan",
    status: "Complete",
    createdAt: "2024-02-18",
    sections: [
      {
        id: "brief-001-s1",
        title: "Case Header",
        content: "Constitutional Petition No. 1247/2024\nFiled under Article 184(3) of the Constitution of the Islamic Republic of Pakistan, 1973\nSupreme Court of Pakistan\nBefore: Hon. Mr. Justice Qazi Faez Isa, CJ"
      },
      {
        id: "brief-001-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Muhammad Aslam s/o Abdul Rasheed, citizen of Pakistan and resident of Islamabad Capital Territory, social activist.\nCounsel: Mr. Makhdoom Ali Khan, Senior Advocate Supreme Court.\n\nRESPONDENT: Federation of Pakistan through Secretary Ministry of Interior.\nCounsel: Mr. Khalid Jawed Khan, Attorney General for Pakistan."
      },
      {
        id: "brief-001-s3",
        title: "Material Facts",
        content: "1. On 15th December 2023, the District Magistrate Islamabad imposed a blanket ban under Section 144 CrPC on all public assemblies within ICT for an indefinite period.\n2. The petitioner, a social activist engaged in peaceful democratic activities, was directly affected by the impugned order.\n3. No specific law and order situation was cited to justify the blanket imposition.\n4. The order lacks temporal limitation and geographical specificity.\n5. Multiple requests by civil society organizations for permission to hold peaceful assemblies were denied citing the impugned order.\n6. The petitioner filed representations before the District Administration which went unheeded."
      },
      {
        id: "brief-001-s4",
        title: "Legal Issues",
        content: "1. Whether a blanket and indefinite imposition of Section 144 CrPC violates the fundamental right of peaceful assembly guaranteed under Article 16 of the Constitution?\n2. Whether the impugned order constitutes an unreasonable restriction on freedom of speech and expression under Article 19?\n3. Whether the exercise of power under Section 144 CrPC is subject to judicial review on the touchstone of proportionality and necessity?\n4. Whether Article 184(3) jurisdiction is attracted given the public importance of the questions involved?"
      },
      {
        id: "brief-001-s5",
        title: "Applicable Statutes",
        content: "- Constitution of Pakistan, 1973: Articles 16, 19, 184(3), 199\n- Code of Criminal Procedure, 1898: Section 144\n- Pakistan Penal Code, 1860: Section 188 (punishment for disobedience)\n- Peaceful Assembly and Public Order Act, 2002 (if applicable)\n- International Covenant on Civil and Political Rights (ICCPR), Articles 19, 21 (ratified by Pakistan)"
      },
      {
        id: "brief-001-s6",
        title: "Petitioner's Arguments",
        content: "1. The blanket and indefinite nature of the impugned order renders it unreasonable per se, as Section 144 CrPC contemplates temporary measures in response to specific and imminent threats to public order.\n2. Article 16 permits restrictions only in the interest of public order, and the burden lies on the State to demonstrate a nexus between the restriction and the stated objective.\n3. The principle of proportionality, recognized by the Supreme Court in I.A. Sharwani v. Government of Pakistan (PLD 1991 SC 734), requires the least restrictive means to achieve the legitimate objective.\n4. Reliance is placed on Benazir Bhutto v. Federation of Pakistan (PLD 1988 SC 416) and Dr. Mobashir Hassan v. Federation of Pakistan (PLD 2010 SC 265)."
      },
      {
        id: "brief-001-s7",
        title: "Respondent's Arguments",
        content: "1. The imposition of Section 144 CrPC is an executive action taken in the interest of public order and safety, which falls within the domain of executive discretion.\n2. The security situation in Islamabad necessitated the impugned measure, particularly in view of threats of public unrest.\n3. The restriction is reasonable and proportionate to the objective of maintaining public order in the federal capital.\n4. Judicial review of executive discretion in matters of public order should be exercised with restraint."
      },
      {
        id: "brief-001-s8",
        title: "Relevant Precedents",
        content: "1. Benazir Bhutto v. Federation of Pakistan (PLD 1988 SC 416): Recognized the right of peaceful assembly as a fundamental right not to be curtailed by blanket executive orders.\n2. I.A. Sharwani v. Government of Pakistan (PLD 1991 SC 734): Established the proportionality principle in evaluating restrictions on fundamental rights.\n3. Baz Muhammad Kakar v. Federation of Pakistan (PLD 2012 SC 870): Held that fundamental rights under the Constitution are inviolable and any restriction must satisfy the test of reasonableness.\n4. Mst. Sughran Bibi v. Government of Punjab (PLD 2018 SC 595): Emphasized mandatory compliance with statutory provisions."
      },
      {
        id: "brief-001-s9",
        title: "Preliminary Analysis",
        content: "The case presents a significant constitutional question regarding the permissible scope of restrictions on the fundamental right of peaceful assembly. The blanket and indefinite nature of the impugned order under Section 144 CrPC appears to exceed the scope of power conferred by the provision, which is designed for temporary and localized measures. The Court's order dated 20.02.2024 indicates a prima facie inclination towards examining the order on the touchstone of Articles 16 and 19. Given the well-established proportionality doctrine in Pakistani constitutional jurisprudence, the petitioner appears to have a strong case. However, the State's argument regarding security concerns and executive discretion in public order matters will require careful consideration."
      }
    ],
    conversation: [
      {
        id: "brief-001-c1",
        role: "user",
        content: "What is the strongest argument for the petitioner in this case?",
        timestamp: "2024-02-18T10:30:00Z"
      },
      {
        id: "brief-001-c2",
        role: "assistant",
        content: "The strongest argument for the petitioner is the blanket and indefinite nature of the Section 144 order. Section 144 CrPC is inherently a temporary provision designed to address imminent threats to public order. The Supreme Court in Benazir Bhutto v. Federation of Pakistan (PLD 1988 SC 416) and subsequent cases has consistently held that the power under Section 144 cannot be exercised in a manner that amounts to a permanent prohibition of a fundamental right. The absence of any temporal limitation or geographical specificity in the impugned order makes it per se unreasonable under the proportionality test established in I.A. Sharwani (PLD 1991 SC 734).",
        timestamp: "2024-02-18T10:30:45Z",
        citations: [
          {
            id: "cit-001",
            caseName: "Benazir Bhutto v. Federation of Pakistan",
            citation: "PLD 1988 SC 416",
            court: "Supreme Court of Pakistan",
            year: "1988",
            relevance: "Right of peaceful assembly as fundamental right",
            snippet: "The right to assemble peacefully is a fundamental right guaranteed by the Constitution and cannot be curtailed by blanket executive orders without demonstrating imminent threat to public order."
          }
        ]
      },
      {
        id: "brief-001-c3",
        role: "user",
        content: "Are there any international law arguments that could strengthen the petition?",
        timestamp: "2024-02-18T10:35:00Z"
      }
    ]
  },
  {
    id: "brief-002",
    caseId: "case-002",
    caseTitle: "State v. Imran Shahzad",
    status: "Complete",
    createdAt: "2024-02-25",
    sections: [
      {
        id: "brief-002-s1",
        title: "Case Header",
        content: "Criminal Appeal No. 389/2024\nFiled under Section 410 CrPC against conviction under Section 302/34 PPC\nLahore High Court, Lahore\nBefore: Hon. Mr. Justice Malik Shahzad Ahmad Khan"
      },
      {
        id: "brief-002-s2",
        title: "Parties & Representation",
        content: "APPELLANT: Imran Shahzad s/o Ghulam Mustafa, convicted under Section 302/34 PPC.\nCounsel: Barrister Salman Safdar.\n\nRESPONDENT: The State through Prosecutor General Punjab.\nCounsel: Mr. Ahmad Raza Kasuri, Prosecutor General Punjab."
      },
      {
        id: "brief-002-s3",
        title: "Material Facts",
        content: "1. FIR No. 234/2023 was registered at Police Station Ichhra, Lahore under Section 302/34 PPC on the complaint of Muhammad Zahid (PW-1).\n2. The deceased Muhammad Akbar was allegedly shot on 15th October 2023 at approximately 10:30 PM at his shop on Main Boulevard, Shah Jamal.\n3. PW-1 claimed to be an eyewitness and identified the appellant and an unknown accomplice.\n4. The appellant was arrested on 18th October 2023 and a 30-bore pistol was allegedly recovered from his possession.\n5. The trial court convicted the appellant under Section 302/34 PPC and sentenced him to death.\n6. The sentence has been suspended and bail granted pending appeal."
      },
      {
        id: "brief-002-s4",
        title: "Legal Issues",
        content: "1. Whether the prosecution has proved its case beyond reasonable doubt through credible and consistent ocular testimony?\n2. Whether the recovery of the weapon can be relied upon given the alleged procedural deficiencies in the recovery proceedings?\n3. Whether the conviction can be sustained on the basis of circumstantial evidence alone where the eyewitness testimony is found unreliable?\n4. Whether the motive has been adequately established by the prosecution?"
      },
      {
        id: "brief-002-s5",
        title: "Applicable Statutes",
        content: "- Pakistan Penal Code, 1860: Sections 302 (murder), 34 (common intention)\n- Code of Criminal Procedure, 1898: Sections 154, 161, 164, 265-F, 410\n- Qanun-e-Shahadat Order, 1984: Articles 46, 71, 129"
      },
      {
        id: "brief-002-s6",
        title: "Petitioner's Arguments",
        content: "1. PW-1 and PW-3 are closely related to the deceased and are interested witnesses whose testimony requires independent corroboration under settled law (Tariq Pervez v. The State, 1995 SCMR 1345).\n2. PW-1 stated the incident occurred at 10:30 PM but PW-3 placed it at 9:45 PM, constituting a material contradiction regarding the time of occurrence.\n3. The alleged 30-bore pistol recovery was not conducted in the presence of independent witnesses and the recovery memo was prepared with a delay of 3 days.\n4. The prosecution failed to establish motive, a crucial factor in cases of capital punishment."
      },
      {
        id: "brief-002-s7",
        title: "Respondent's Arguments",
        content: "1. PW-1 is a natural witness being present at the scene and his relationship with the deceased does not render his testimony unreliable per se.\n2. Minor discrepancies in timings are natural in cases of shock and do not constitute material contradictions.\n3. The recovery of the weapon, corroborated by the forensic report matching the weapon with the crime bullet, constitutes strong corroborative evidence.\n4. The chain of evidence is complete and supports the conviction."
      },
      {
        id: "brief-002-s8",
        title: "Relevant Precedents",
        content: "1. Tariq Pervez v. The State (1995 SCMR 1345): Testimony of interested witnesses requires independent corroboration.\n2. Muhammad Akram v. The State (2009 SCMR 230): Material contradictions in ocular testimony render it unreliable.\n3. Hashim Qasim v. The State (2017 SCMR 986): Benefit of doubt must be extended to the accused when prosecution fails to prove its case beyond reasonable doubt.\n4. Naveed Asghar v. The State (PLD 2021 SC 600): Delayed recovery without independent witnesses diminishes evidentiary value."
      },
      {
        id: "brief-002-s9",
        title: "Preliminary Analysis",
        content: "The criminal appeal raises substantial questions regarding the reliability of prosecution evidence. The material contradictions between PW-1 and PW-3 regarding the time of occurrence, combined with the procedural deficiencies in the recovery of the weapon and the failure to establish motive, create reasonable doubt in the prosecution's case. Under the golden principle of criminal law, the benefit of doubt must be extended in favor of the accused. The suspension of sentence by the High Court indicates recognition of arguable merits in the appeal."
      }
    ],
    conversation: [
      {
        id: "brief-002-c1",
        role: "user",
        content: "What are the key contradictions in the prosecution evidence?",
        timestamp: "2024-02-25T14:00:00Z"
      },
      {
        id: "brief-002-c2",
        role: "assistant",
        content: "The prosecution evidence contains several significant contradictions: (1) Time discrepancy - PW-1 places the occurrence at 10:30 PM while PW-3 states 9:45 PM, a 45-minute gap that is material and not a minor discrepancy. (2) Weapon recovery issues - the recovery was made 3 days after arrest without independent witnesses, violating the principles laid down in Naveed Asghar v. The State (PLD 2021 SC 600). (3) Medical evidence inconsistency - the post-mortem report timing does not align with PW-1's version of events. Under Muhammad Akram v. The State (2009 SCMR 230), such material contradictions are sufficient to render ocular testimony unreliable.",
        timestamp: "2024-02-25T14:01:00Z",
        citations: [
          {
            id: "cit-002",
            caseName: "Muhammad Akram v. The State",
            citation: "2009 SCMR 230",
            court: "Supreme Court of Pakistan",
            year: "2009",
            relevance: "Material contradictions in ocular testimony",
            snippet: "Where material contradictions exist between prosecution witnesses regarding the time, manner, and circumstances of the occurrence, such testimony cannot form the sole basis for conviction in a capital charge."
          }
        ]
      }
    ]
  },
  {
    id: "brief-003",
    caseId: "case-003",
    caseTitle: "Fatima Bibi v. Muhammad Tariq",
    status: "Complete",
    createdAt: "2024-02-05",
    sections: [
      {
        id: "brief-003-s1",
        title: "Case Header",
        content: "Family Appeal No. 56/2024\nFamily Court, Lahore\nBefore: Hon. Ms. Justice Ayesha Malik\nSubject: Dissolution of Marriage, Dower, Maintenance, Custody"
      },
      {
        id: "brief-003-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Mst. Fatima Bibi d/o Haji Muhammad Nawaz, married on 10th March 2018, mother of two minor children.\nCounsel: Ms. Hina Jilani, Advocate.\n\nRESPONDENT: Muhammad Tariq s/o Rana Shamshad Ali, government servant.\nCounsel: Mr. Sardar Latif Khosa, ASC."
      },
      {
        id: "brief-003-s3",
        title: "Material Facts",
        content: "1. Marriage solemnized on 10th March 2018 at Masjid-e-Noor, Township, Lahore.\n2. Agreed dower: Rs. 500,000/- prompt and 10 tola gold deferred, unpaid to date.\n3. Two children born from the wedlock: Muhammad Abdullah (aged 7) and Mst. Ayesha (aged 4).\n4. Respondent subjected petitioner to habitual cruelty including physical and mental abuse.\n5. Respondent failed to provide maintenance since January 2023.\n6. Petitioner seeks Khula, recovery of dower, maintenance, and custody of minor children."
      },
      {
        id: "brief-003-s4",
        title: "Legal Issues",
        content: "1. Whether the petitioner is entitled to dissolution of marriage by way of Khula under the Dissolution of Muslim Marriages Act, 1939?\n2. Whether the petitioner is entitled to recovery of unpaid prompt dower and deferred dower?\n3. What is the appropriate quantum of maintenance for the petitioner and the minor children?\n4. Whether the welfare of the minor children requires their custody to remain with the mother?"
      },
      {
        id: "brief-003-s5",
        title: "Applicable Statutes",
        content: "- Dissolution of Muslim Marriages Act, 1939: Section 2(viii)(a)\n- Muslim Family Laws Ordinance, 1961: Sections 9, 10\n- West Pakistan Family Courts Act, 1964: Sections 5, 14\n- Guardians and Wards Act, 1890: Sections 7, 12, 17, 25\n- Pakistan Penal Code, 1860: Section 498-A (cruelty)\n- Constitution of Pakistan, 1973: Article 35 (protection of family)"
      },
      {
        id: "brief-003-s6",
        title: "Petitioner's Arguments",
        content: "1. The petitioner is entitled to Khula as the marriage has irretrievably broken down due to the respondent's habitual cruelty and non-maintenance, constituting valid grounds under Section 2(viii)(a) of the Dissolution of Muslim Marriages Act, 1939.\n2. The unpaid dower is an enforceable debt under Muslim Personal Law and must be recovered in full.\n3. The mother is the natural guardian of minor children under the age of 7 (female) and during hizanat period, and the welfare of the children demands continuity of custody with the mother.\n4. Maintenance should be assessed at Rs. 80,000/- per month considering the standard of living and needs of the children."
      },
      {
        id: "brief-003-s7",
        title: "Respondent's Arguments",
        content: "1. The allegations of cruelty are fabricated and the petitioner left the matrimonial home on her own volition.\n2. If Khula is decreed, the petitioner should return the dower amount and gifts as per settled law.\n3. The male child Muhammad Abdullah has crossed the age of hizanat (7 years) under Hanafi school and custody should transfer to the father.\n4. The maintenance demand of Rs. 80,000/- is excessive compared to the respondent's salary of Rs. 95,000/-."
      },
      {
        id: "brief-003-s8",
        title: "Relevant Precedents",
        content: "1. Khurshid Bibi v. Muhammad Amin (PLD 1967 SC 97): Landmark case on Khula establishing that a wife's right to seek dissolution is an inherent right in Muslim law.\n2. Mst. Salma Agha v. The State (2018 SCMR 1196): Child welfare is the paramount consideration in custody matters.\n3. Muhammad Nawaz v. Mst. Ghulam Fatima (2020 CLC 1245 Lah): Dower is a debt and must be recovered irrespective of the mode of dissolution.\n4. Rana Abdul Khaliq v. Mst. Tahira (2019 SCMR 367): Age of hizanat is not rigid and the welfare of the child is the overriding consideration."
      },
      {
        id: "brief-003-s9",
        title: "Preliminary Analysis",
        content: "The petitioner has a strong case for Khula given the alleged cruelty and non-maintenance. The respondent's argument regarding return of dower in Khula proceedings is legally tenable but subject to court's discretion. The custody dispute regarding the male child will require careful evaluation under the welfare principle established in Mst. Salma Agha (2018 SCMR 1196). The quantum of maintenance will likely be moderated by the court considering the respondent's income. The case for the female child's custody with the mother is particularly strong given her age of 4 years."
      }
    ],
    conversation: [
      {
        id: "brief-003-c1",
        role: "user",
        content: "What happens to the dower if Khula is granted?",
        timestamp: "2024-02-05T09:15:00Z"
      },
      {
        id: "brief-003-c2",
        role: "assistant",
        content: "In cases of Khula, the question of dower depends on the circumstances. Traditionally, Khula involves the wife returning the dower (haq mehr) or some consideration. However, under Pakistani jurisprudence, particularly following Khurshid Bibi v. Muhammad Amin (PLD 1967 SC 97), the court has discretion in this matter. If the husband's cruelty is the cause of the breakdown, the court may grant Khula without requiring the wife to return the full dower. In Muhammad Nawaz v. Mst. Ghulam Fatima (2020 CLC 1245 Lah), the Lahore High Court held that unpaid prompt dower remains recoverable even in Khula proceedings where the wife did not receive the dower in the first place.",
        timestamp: "2024-02-05T09:16:00Z",
        citations: [
          {
            id: "cit-003",
            caseName: "Khurshid Bibi v. Muhammad Amin",
            citation: "PLD 1967 SC 97",
            court: "Supreme Court of Pakistan",
            year: "1967",
            relevance: "Wife's right to Khula and dower considerations",
            snippet: "The right of a Muslim wife to seek dissolution of marriage through Khula is an inherent right recognized by Muslim personal law, and the court has discretion regarding the return of dower based on the circumstances of each case."
          }
        ]
      },
      {
        id: "brief-003-c3",
        role: "user",
        content: "What is the current position on custody of a 7-year-old boy under Hanafi law?",
        timestamp: "2024-02-05T09:20:00Z"
      }
    ]
  },
  {
    id: "brief-004",
    caseId: "case-004",
    caseTitle: "Pakistan Steel Mills v. FBR",
    status: "Generating",
    createdAt: "2024-03-12",
    sections: [
      {
        id: "brief-004-s1",
        title: "Case Header",
        content: "Constitutional Petition No. 2891/2024\nSindh High Court, Karachi\nBefore: Hon. Mr. Justice Muhammad Ali Mazhar\nSubject: Challenge to Super Tax under Section 4C of Income Tax Ordinance, 2001"
      },
      {
        id: "brief-004-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Pakistan Steel Mills Corporation (Pvt.) Ltd., public sector enterprise.\nCounsel: Mr. Abid Hassan Minto, Senior Advocate Supreme Court.\n\nRESPONDENT: Federation of Pakistan through Chairman FBR.\nCounsel: Mr. Ashtar Ausaf Ali, Attorney General for Pakistan."
      },
      {
        id: "brief-004-s3",
        title: "Material Facts",
        content: "1. Petitioner is a public sector enterprise engaged in steel manufacturing.\n2. Finance Act 2024 imposed super tax at 10% under Section 4C of the Income Tax Ordinance, 2001.\n3. The tax was imposed with retrospective effect from Tax Year 2022.\n4. Petitioner is a loss-making entity and the retrospective imposition is confiscatory.\n5. The petitioner contends the tax violates Articles 4, 23, 24, 25, and 77 of the Constitution."
      },
      {
        id: "brief-004-s4",
        title: "Legal Issues",
        content: "1. Whether retrospective imposition of super tax on a loss-making public sector entity is ultra vires the Constitution?\n2. Whether Section 4C of the Income Tax Ordinance violates the principle of legitimate expectation?\n3. Whether the tax amounts to confiscation of property in violation of Article 24?"
      },
      {
        id: "brief-004-s5",
        title: "Applicable Statutes",
        content: "- Income Tax Ordinance, 2001: Sections 4C, 148, 153\n- Finance Act, 2024\n- Constitution of Pakistan, 1973: Articles 4, 23, 24, 25, 77, 162"
      },
      {
        id: "brief-004-s6",
        title: "Petitioner's Arguments",
        content: "Generating analysis of petitioner's submissions based on constitutional provisions and tax jurisprudence..."
      },
      {
        id: "brief-004-s7",
        title: "Respondent's Arguments",
        content: "Generating analysis of FBR's response and defense of legislative competence..."
      },
      {
        id: "brief-004-s8",
        title: "Relevant Precedents",
        content: "1. Messrs Elahi Cotton Mills v. Federation of Pakistan (PLD 1997 SC 582): Parliament's competence to enact retrospective tax legislation.\n2. Commissioner of Income Tax v. Eli Lilly Pakistan (PLD 2009 SC 1): Legislative plenary power in taxation matters."
      },
      {
        id: "brief-004-s9",
        title: "Preliminary Analysis",
        content: "Generating preliminary analysis..."
      }
    ],
    conversation: [
      {
        id: "brief-004-c1",
        role: "user",
        content: "Generate a complete brief for the Pakistan Steel Mills tax case.",
        timestamp: "2024-03-12T11:00:00Z"
      },
      {
        id: "brief-004-c2",
        role: "assistant",
        content: "I am generating the brief for Constitutional Petition No. 2891/2024. The case involves a challenge to the super tax imposed under Section 4C of the Income Tax Ordinance, 2001. I have completed the case header, parties, material facts, legal issues, applicable statutes, and initial precedent analysis. The petitioner's arguments, respondent's arguments, and preliminary analysis sections are still being generated. Key precedents being analyzed include Elahi Cotton Mills (PLD 1997 SC 582) and Eli Lilly Pakistan (PLD 2009 SC 1).",
        timestamp: "2024-03-12T11:01:00Z"
      }
    ]
  },
  {
    id: "brief-005",
    caseId: "case-005",
    caseTitle: "Habib Bank Ltd. v. SECP",
    status: "Complete",
    createdAt: "2024-03-05",
    sections: [
      {
        id: "brief-005-s1",
        title: "Case Header",
        content: "Corporate Original No. 178/2024\nIslamabad High Court\nBefore: Hon. Mr. Justice Aamer Farooq\nSubject: Challenge to SECP Directives on Cross-Holdings Divestiture"
      },
      {
        id: "brief-005-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Habib Bank Limited, largest commercial bank in Pakistan.\nCounsel: Mr. Salman Akram Raja, Advocate Supreme Court.\n\nRESPONDENT: Securities and Exchange Commission of Pakistan.\nCounsel: Mr. Faisal Siddiqui, Advocate."
      },
      {
        id: "brief-005-s3",
        title: "Material Facts",
        content: "1. SECP issued Circular No. 03/2024 directing divestiture of cross-holdings exceeding 5% within 6 months.\n2. HBL holds strategic investments in subsidiaries forming part of its long-term investment portfolio.\n3. Forced divestiture would crystallize losses estimated at Rs. 12 billion.\n4. HBL contends the directive exceeds SECP's regulatory authority under the Companies Act, 2017.\n5. The circular was issued without prior consultation with affected entities."
      },
      {
        id: "brief-005-s4",
        title: "Legal Issues",
        content: "1. Whether SECP has the power under Section 506 of the Companies Act, 2017 to mandate divestiture of cross-holdings?\n2. Whether the impugned circular violates the petitioner's property rights under Article 23 of the Constitution?\n3. Whether principles of natural justice were violated by not affording a hearing before issuance of the circular?"
      },
      {
        id: "brief-005-s5",
        title: "Applicable Statutes",
        content: "- Companies Act, 2017: Sections 199, 452, 506, 510, 512\n- SECP Act, 1997: Sections 20, 33\n- Securities Act, 2015\n- Banking Companies Ordinance, 1962\n- Constitution of Pakistan, 1973: Articles 18, 23, 24, 25"
      },
      {
        id: "brief-005-s6",
        title: "Petitioner's Arguments",
        content: "1. SECP's regulatory power under Section 506 is circumscribed and does not extend to mandatory divestiture of lawfully acquired holdings.\n2. The forced divestiture of strategic investments constitutes deprivation of property without lawful authority, violating Article 24 of the Constitution.\n3. The circular was issued without following principles of natural justice, particularly the right to be heard (audi alteram partem).\n4. The circular disproportionately impacts banking companies and creates competitive disadvantage in the financial sector."
      },
      {
        id: "brief-005-s7",
        title: "Respondent's Arguments",
        content: "1. SECP has a broad regulatory mandate under the Companies Act, 2017 and the SECP Act, 1997 to ensure market transparency.\n2. Cross-holdings create systemic risks and hinder price discovery in the securities market.\n3. The circular is regulatory in nature and does not constitute deprivation of property.\n4. The 6-month timeline provides adequate opportunity for orderly divestiture."
      },
      {
        id: "brief-005-s8",
        title: "Relevant Precedents",
        content: "1. Government of Pakistan v. Asghar Ali (PLD 2013 SC 61): Regulatory actions must be proportionate to the objective.\n2. Messrs Pak-Arab Fertilizers v. SECP (2019 CLC 678 Isb): SECP's regulatory authority is not unbounded and subject to constitutional limits.\n3. MCB Bank Ltd. v. SBP (2016 SCMR 1890): Financial sector regulation must balance regulatory objectives with property rights."
      },
      {
        id: "brief-005-s9",
        title: "Preliminary Analysis",
        content: "The case raises important questions about the limits of SECP's regulatory authority vis-a-vis constitutionally protected property rights. The petitioner's argument regarding violation of natural justice principles has merit, as mandatory divestiture without prior hearing affects vested rights. The respondent's position on systemic risk is valid from a regulatory perspective but must be weighed against the proportionality requirement. The outcome may depend on whether the court characterizes the circular as a regulatory measure or as an order affecting property rights."
      }
    ],
    conversation: [
      {
        id: "brief-005-c1",
        role: "user",
        content: "How does the proportionality test apply to SECP regulations?",
        timestamp: "2024-03-05T15:00:00Z"
      },
      {
        id: "brief-005-c2",
        role: "assistant",
        content: "The proportionality test in the context of SECP regulations requires examination of four factors: (1) whether the regulatory objective is legitimate; (2) whether the measure adopted is rationally connected to the objective; (3) whether less restrictive alternatives were available; and (4) whether the impact on the affected party is proportionate to the public benefit. In Government of Pakistan v. Asghar Ali (PLD 2013 SC 61), the Supreme Court emphasized that even legitimate regulatory objectives cannot be achieved through disproportionate means. For SECP's cross-holding circular, the question is whether mandatory divestiture is the least restrictive means to address systemic risk, or whether alternatives like enhanced disclosure requirements could achieve the same objective.",
        timestamp: "2024-03-05T15:01:00Z",
        citations: [
          {
            id: "cit-004",
            caseName: "Government of Pakistan v. Asghar Ali",
            citation: "PLD 2013 SC 61",
            court: "Supreme Court of Pakistan",
            year: "2013",
            relevance: "Proportionality in regulatory actions",
            snippet: "Regulatory actions must be proportionate to the objective sought to be achieved and the least restrictive means must be employed where fundamental rights are affected."
          }
        ]
      }
    ]
  },
  {
    id: "brief-006",
    caseId: "case-008",
    caseTitle: "Zainab Noor v. SHO Police Station Gulberg",
    status: "Complete",
    createdAt: "2024-03-10",
    sections: [
      {
        id: "brief-006-s1",
        title: "Case Header",
        content: "Writ Petition No. 8976/2024\nLahore High Court, Lahore\nBefore: Hon. Ms. Justice Aalia Neelum\nSubject: Direction for Registration of FIR under Section 154 CrPC"
      },
      {
        id: "brief-006-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Mst. Zainab Noor d/o Khalid Mehmood, aggrieved citizen.\nCounsel: Barrister Aitzaz Ahsan, Senior Advocate Supreme Court.\n\nRESPONDENT: SHO Police Station Gulberg, Lahore & 3 Others.\nCounsel: Deputy Prosecutor General Punjab."
      },
      {
        id: "brief-006-s3",
        title: "Material Facts",
        content: "1. On 20th February 2024, the petitioner was subjected to an attempted assault near Model Town Link Road, Lahore at approximately 8:00 PM.\n2. The petitioner identified the culprit as one Hamza Malik.\n3. A written complaint was submitted at Police Station Gulberg for registration of FIR under Sections 376/511 and 354-A PPC.\n4. The SHO refused to register the FIR without lawful justification.\n5. The court issued directions on 12.03.2024 for immediate FIR registration."
      },
      {
        id: "brief-006-s4",
        title: "Legal Issues",
        content: "1. Whether the SHO is legally bound to register an FIR upon receipt of information disclosing a cognizable offence under Section 154 CrPC?\n2. Whether refusal to register FIR violates the petitioner's fundamental right to access to justice under Article 10-A of the Constitution?\n3. What directions can the High Court issue under Article 199 to ensure compliance?"
      },
      {
        id: "brief-006-s5",
        title: "Applicable Statutes",
        content: "- Code of Criminal Procedure, 1898: Sections 154, 155, 156, 157\n- Pakistan Penal Code, 1860: Sections 354-A, 376, 511\n- Constitution of Pakistan, 1973: Articles 9, 10-A, 14, 25, 199\n- Police Order, 2002: Article 156"
      },
      {
        id: "brief-006-s6",
        title: "Petitioner's Arguments",
        content: "1. Section 154 CrPC mandates registration of FIR upon receipt of information disclosing commission of a cognizable offence. The SHO has no discretion to refuse registration.\n2. The Supreme Court in Mst. Sughran Bibi v. Government of Punjab (PLD 2018 SC 595) categorically held that police cannot refuse to register FIR.\n3. The refusal to register FIR in cases of sexual violence is particularly egregious and violates the petitioner's fundamental right to dignity under Article 14 of the Constitution.\n4. The DIG Operations should be directed to ensure institutional compliance."
      },
      {
        id: "brief-006-s7",
        title: "Respondent's Arguments",
        content: "1. The police conducted preliminary inquiry before deciding on FIR registration, which is permissible.\n2. The identity of the accused requires verification before formal registration.\n3. The police are committed to investigating the matter and have not refused outright."
      },
      {
        id: "brief-006-s8",
        title: "Relevant Precedents",
        content: "1. Mst. Sughran Bibi v. Government of Punjab (PLD 2018 SC 595): Police have a mandatory duty to register FIR under Section 154 CrPC.\n2. Lalita Kumari v. Government of UP (AIR 2014 SC 187): Influential Indian precedent on mandatory FIR registration frequently cited in Pakistani courts.\n3. Muhammad Bashir v. SHO (2020 SCMR 1540): Refusal to register FIR is a violation of statutory duty and actionable under Article 199."
      },
      {
        id: "brief-006-s9",
        title: "Preliminary Analysis",
        content: "The law on this point is well-settled following Mst. Sughran Bibi (PLD 2018 SC 595). The SHO's refusal to register the FIR is clearly in violation of Section 154 CrPC which imposes a mandatory duty. The court's interim order dated 12.03.2024 directing immediate registration is consistent with established jurisprudence. The case is straightforward and the petitioner's position is legally unassailable."
      }
    ],
    conversation: [
      {
        id: "brief-006-c1",
        role: "user",
        content: "Summarize the key holding of Sughran Bibi case on FIR registration.",
        timestamp: "2024-03-10T16:00:00Z"
      },
      {
        id: "brief-006-c2",
        role: "assistant",
        content: "In Mst. Sughran Bibi v. Government of Punjab (PLD 2018 SC 595), the Supreme Court of Pakistan held that registration of FIR under Section 154 CrPC is mandatory upon receipt of information disclosing commission of a cognizable offence. The Court emphasized that the SHO has no discretion to refuse registration or conduct a preliminary inquiry before registration. The duty to register is ministerial in nature and non-compliance constitutes dereliction of duty. The Court directed that disciplinary action should be taken against officers who refuse to register FIRs.",
        timestamp: "2024-03-10T16:01:00Z",
        citations: [
          {
            id: "cit-005",
            caseName: "Mst. Sughran Bibi v. Government of Punjab",
            citation: "PLD 2018 SC 595",
            court: "Supreme Court of Pakistan",
            year: "2018",
            relevance: "Mandatory FIR registration duty",
            snippet: "Registration of FIR under Section 154 CrPC is a mandatory duty of the police officer upon receipt of information disclosing commission of a cognizable offence. The officer has no discretion to refuse such registration."
          }
        ]
      }
    ]
  },
  {
    id: "brief-007",
    caseId: "case-009",
    caseTitle: "Abdul Karim v. Province of Sindh",
    status: "Draft",
    createdAt: "2024-02-15",
    sections: [
      {
        id: "brief-007-s1",
        title: "Case Header",
        content: "Constitutional Petition No. 7723/2024\nSindh High Court, Karachi\nBefore: Hon. Mr. Justice Aqeel Ahmed Abbasi\nSubject: Challenge to Land Acquisition for Malir Expressway"
      },
      {
        id: "brief-007-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Abdul Karim s/o Muhammad Hashim, landowner.\nCounsel: Mr. Faisal Hussain Naqvi, Advocate.\n\nRESPONDENT: Province of Sindh through Secretary Revenue Department.\nCounsel: Advocate General Sindh."
      },
      {
        id: "brief-007-s3",
        title: "Material Facts",
        content: "1. Petitioner owns 25 acres of agricultural land in Deh Malir, Karachi (Survey No. 45/2, 45/3, 46/1).\n2. Government of Sindh issued Section 4 notification under Land Acquisition Act, 1894 for Malir Expressway.\n3. No notice was served upon the petitioner before the notification.\n4. Compensation assessed at Rs. 500,000/- per acre against market value of Rs. 5-8 million per acre.\n5. Independent valuation report assesses fair market value at Rs. 6,500,000/- per acre."
      },
      {
        id: "brief-007-s4",
        title: "Legal Issues",
        content: "1. Whether the acquisition proceedings are valid without proper service of notice under Section 4 of the Land Acquisition Act, 1894?\n2. Whether the compensation offered is adequate and just under Article 24 of the Constitution?\n3. Whether the acquisition is for a valid public purpose?"
      },
      {
        id: "brief-007-s5",
        title: "Applicable Statutes",
        content: "- Land Acquisition Act, 1894: Sections 4, 5-A, 6, 11, 18, 23\n- Constitution of Pakistan, 1973: Articles 23, 24\n- Specific Relief Act, 1877: Section 42\n- Transfer of Property Act, 1882"
      },
      {
        id: "brief-007-s6",
        title: "Petitioner's Arguments",
        content: "1. The acquisition is vitiated ab initio due to failure to serve mandatory notice under Section 4 of the Land Acquisition Act, depriving the petitioner of the right to file objections under Section 5-A.\n2. The compensation of Rs. 500,000/- per acre is grossly inadequate and does not reflect fair market value as required under Article 24 of the Constitution.\n3. The independent valuation report establishes that the market value is Rs. 6,500,000/- per acre based on comparable transactions.\n4. The principle of just compensation requires that the owner be placed in the same economic position as before the acquisition."
      },
      {
        id: "brief-007-s7",
        title: "Respondent's Arguments",
        content: "Draft pending - awaiting respondent's written statement."
      },
      {
        id: "brief-007-s8",
        title: "Relevant Precedents",
        content: "1. Province of Sindh v. Akhtar Hussain (2015 SCMR 1299): Mandatory compliance with Section 4 notice requirements.\n2. Ghulam Abbas v. Province of Punjab (PLD 2004 SC 485): Just compensation must reflect market value at the time of notification.\n3. Muhammad Rafique v. Government of Pakistan (2018 CLC 1023 Kar): Non-service of notice vitiates acquisition proceedings."
      },
      {
        id: "brief-007-s9",
        title: "Preliminary Analysis",
        content: "The petitioner has strong grounds on two fronts: (1) procedural irregularity in non-service of Section 4 notice, and (2) inadequacy of compensation. The disparity between the assessed compensation and the market value (over 1200%) is significant and supports the petitioner's case. However, the respondent may argue that agricultural land classification justifies lower valuation. The court may direct enhanced compensation rather than setting aside the acquisition in the public interest."
      }
    ],
    conversation: [
      {
        id: "brief-007-c1",
        role: "user",
        content: "What compensation formula applies in land acquisition cases in Sindh?",
        timestamp: "2024-02-15T10:00:00Z"
      },
      {
        id: "brief-007-c2",
        role: "assistant",
        content: "In land acquisition cases in Sindh, compensation is determined under Section 23 of the Land Acquisition Act, 1894 which requires consideration of: (1) market value at the date of notification under Section 4; (2) damage sustained by the person by reason of severance from other land; (3) damage by reason of the acquisition injuriously affecting other property; (4) reasonable expenses incidental to change of residence or place of business. Additionally, under Section 23(1A), a 15% solatium on the market value is awarded. The Supreme Court in Ghulam Abbas v. Province of Punjab (PLD 2004 SC 485) held that market value must be determined based on comparable sales in the vicinity.",
        timestamp: "2024-02-15T10:01:00Z",
        citations: [
          {
            id: "cit-006",
            caseName: "Ghulam Abbas v. Province of Punjab",
            citation: "PLD 2004 SC 485",
            court: "Supreme Court of Pakistan",
            year: "2004",
            relevance: "Just compensation in land acquisition",
            snippet: "The market value for purposes of compensation must be determined on the basis of comparable sales in the vicinity and the potential use of the land, ensuring the dispossessed owner is placed in the same economic position."
          }
        ]
      }
    ]
  },
  {
    id: "brief-008",
    caseId: "case-011",
    caseTitle: "Mst. Rukhsana Bibi v. Government of KPK",
    status: "Complete",
    createdAt: "2024-03-14",
    sections: [
      {
        id: "brief-008-s1",
        title: "Case Header",
        content: "Writ Petition No. 2345/2024\nPeshawar High Court, Peshawar\nBefore: Hon. Mr. Justice Ibrahim Khan\nSubject: Compassionate Appointment of Widow of Deceased Government Servant"
      },
      {
        id: "brief-008-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Mst. Rukhsana Bibi w/o Late Sher Afzal Khan, widow with 4 minor dependents.\nCounsel: Mr. Qazi Anwar, Advocate.\n\nRESPONDENT: Government of Khyber Pakhtunkhwa through Chief Secretary.\nCounsel: Advocate General KPK."
      },
      {
        id: "brief-008-s3",
        title: "Material Facts",
        content: "1. Late Sher Afzal Khan was a BPS-14 employee in the Education Department, Government of KPK, who died in service on 15th November 2023.\n2. The petitioner is the sole surviving spouse with 4 minor children.\n3. Application for compassionate appointment was submitted under KPK Government policy.\n4. Application was rejected on the ground that the petitioner lacks minimum educational qualification.\n5. The settled policy allows relaxation of qualifications in compassionate appointment cases.\n6. The petitioner and her children have no other source of income."
      },
      {
        id: "brief-008-s4",
        title: "Legal Issues",
        content: "1. Whether the denial of compassionate appointment on the sole ground of educational qualification is lawful when the policy provides for relaxation?\n2. Whether the denial violates Articles 4, 9, and 25 of the Constitution?\n3. Whether the doctrine of legitimate expectation applies to the petitioner's case?"
      },
      {
        id: "brief-008-s5",
        title: "Applicable Statutes",
        content: "- KPK Civil Servants Act, 1973\n- KPK Civil Servants (Appointment, Promotion and Transfer) Rules, 1989\n- Constitution of Pakistan, 1973: Articles 4, 9, 14, 25, 38\n- KPK Compassionate Appointment Policy, 2015"
      },
      {
        id: "brief-008-s6",
        title: "Petitioner's Arguments",
        content: "1. The compassionate appointment policy of 2015 explicitly provides for relaxation of educational qualification in deserving cases, which the respondent failed to consider.\n2. The rejection is violative of Article 9 (right to life includes right to livelihood) and Article 25 (equality before law).\n3. The Supreme Court in PLD 2019 SC 675 recognized compassionate appointment as a constitutional right flowing from the State's obligation under Article 38.\n4. The petitioner's destitute condition with 4 minor dependents makes this a compelling case for the exercise of relaxation power."
      },
      {
        id: "brief-008-s7",
        title: "Respondent's Arguments",
        content: "1. The minimum educational qualification is a statutory requirement under the Civil Servants Rules and cannot be relaxed by executive order.\n2. Compassionate appointment is a concession, not a right, and the government retains discretion.\n3. The petitioner may be considered for lower posts matching her educational qualification."
      },
      {
        id: "brief-008-s8",
        title: "Relevant Precedents",
        content: "1. PLD 2019 SC 675 (Muhammad Sajid v. Government of KPK): Compassionate appointment is recognized as a constitutional right in cases of genuine destitution.\n2. Government of Punjab v. Rafaqat Ali (2017 SCMR 2045): Relaxation of qualification is permissible and expected in compassionate appointment cases.\n3. Mst. Yasmeen v. Government of Punjab (2020 PLC (CS) 789): The purpose of compassionate appointment is to prevent the family from destitution."
      },
      {
        id: "brief-008-s9",
        title: "Preliminary Analysis",
        content: "The petitioner's case is strong given the Supreme Court's clear pronouncement in PLD 2019 SC 675 recognizing compassionate appointment as a constitutional entitlement. The respondent's argument that qualification cannot be relaxed is contradicted by the express terms of the 2015 policy. The court is likely to direct the government to consider the petitioner's application with due regard to the relaxation provision, given the humanitarian circumstances of the case."
      }
    ],
    conversation: [
      {
        id: "brief-008-c1",
        role: "user",
        content: "What is the constitutional basis for compassionate appointment in Pakistan?",
        timestamp: "2024-03-14T08:30:00Z"
      },
      {
        id: "brief-008-c2",
        role: "assistant",
        content: "The constitutional basis for compassionate appointment in Pakistan rests primarily on Articles 9 and 38 of the Constitution. Article 9 guarantees the right to life, which the Supreme Court has interpreted expansively to include the right to livelihood (Shehla Zia v. WAPDA, PLD 1994 SC 693). Article 38(a) imposes a duty on the State to secure the well-being of the people. In Muhammad Sajid v. Government of KPK (PLD 2019 SC 675), the Supreme Court held that compassionate appointment is a constitutional obligation when the dependent family of a deceased government servant is left in destitution, and the State cannot abdicate this responsibility on technical grounds.",
        timestamp: "2024-03-14T08:31:00Z",
        citations: [
          {
            id: "cit-007",
            caseName: "Muhammad Sajid v. Government of KPK",
            citation: "PLD 2019 SC 675",
            court: "Supreme Court of Pakistan",
            year: "2019",
            relevance: "Constitutional basis of compassionate appointment",
            snippet: "Compassionate appointment is a constitutional obligation flowing from Articles 9 and 38 of the Constitution when the family of a deceased government servant faces destitution."
          }
        ]
      }
    ]
  },
  {
    id: "brief-009",
    caseId: "case-012",
    caseTitle: "Balochistan Bar Council v. Province of Balochistan",
    status: "Complete",
    createdAt: "2024-02-20",
    sections: [
      {
        id: "brief-009-s1",
        title: "Case Header",
        content: "Constitutional Petition No. 567/2024\nBalochistan High Court, Quetta\nBefore: Hon. Mr. Justice Naeem Akhtar Afghan, CJ BHC\nSubject: Enforcement of Right to Access to Justice - Judicial Vacancies"
      },
      {
        id: "brief-009-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Balochistan Bar Council through Vice Chairman, statutory body representing legal profession in Balochistan.\nCounsel: Mr. Abdul Rahim Ziaratwal, Advocate.\n\nRESPONDENT: Province of Balochistan through Chief Secretary.\nCounsel: Advocate General Balochistan."
      },
      {
        id: "brief-009-s3",
        title: "Material Facts",
        content: "1. 186 sanctioned positions of Civil Judges/Judicial Magistrates in Balochistan.\n2. Only 89 positions are filled, resulting in a 52% vacancy rate.\n3. Average case pendency of 5.2 years versus national average of 2.8 years.\n4. Total pendency of 87,456 cases in subordinate courts as of 31.12.2023.\n5. Citizens in remote districts (Chagai, Washuk, Awaran) must travel hundreds of kilometers to access courts.\n6. Multiple representations to the Provincial Government have gone unheeded."
      },
      {
        id: "brief-009-s4",
        title: "Legal Issues",
        content: "1. Whether the chronic shortage of judicial officers in Balochistan amounts to denial of the fundamental right to fair trial under Article 10-A?\n2. Whether the Provincial Government's failure to fill judicial vacancies violates Article 9 (right to life includes access to justice)?\n3. What directions can the High Court issue to ensure timely filling of judicial vacancies?"
      },
      {
        id: "brief-009-s5",
        title: "Applicable Statutes",
        content: "- Constitution of Pakistan, 1973: Articles 4, 9, 10-A, 175, 203\n- Balochistan Judicial Service Rules\n- Legal Practitioners and Bar Councils Act, 1973\n- West Pakistan Civil Courts Ordinance, 1962"
      },
      {
        id: "brief-009-s6",
        title: "Petitioner's Arguments",
        content: "1. Article 10-A, inserted by the 18th Constitutional Amendment, guarantees fair trial and due process, which necessarily includes the right to have cases heard and decided within a reasonable time.\n2. A 52% vacancy rate in the judiciary is a systemic failure that violates the constitutional right of the people of Balochistan.\n3. The Supreme Court in Al-Jehad Trust v. Federation of Pakistan (PLD 1996 SC 324) recognized the independence and adequate strength of the judiciary as a constitutional imperative.\n4. The Provincial Government has a constitutional duty to ensure adequate judicial infrastructure."
      },
      {
        id: "brief-009-s7",
        title: "Respondent's Arguments",
        content: "1. The Provincial Government is making efforts to fill vacancies through the Balochistan Public Service Commission.\n2. Budgetary constraints and the security situation in the province have hindered recruitment.\n3. The separation of powers doctrine limits the court's ability to direct executive action on budgetary matters."
      },
      {
        id: "brief-009-s8",
        title: "Relevant Precedents",
        content: "1. Al-Jehad Trust v. Federation of Pakistan (PLD 1996 SC 324): Independence and adequate strength of the judiciary is a constitutional imperative.\n2. Watan Party v. Federation of Pakistan (PLD 2011 SC 997): Access to justice is a fundamental right.\n3. Government of Balochistan v. Azizullah Memon (2014 SCMR 1625): Provincial Government has constitutional obligation to provide judicial infrastructure."
      },
      {
        id: "brief-009-s9",
        title: "Preliminary Analysis",
        content: "This is a public interest litigation raising systemic issues of access to justice in Balochistan. The statistics are compelling and demonstrate a clear constitutional violation. The court is likely to issue mandatory directions for filling vacancies within a fixed timeframe, following the precedent of Al-Jehad Trust. The respondent's budgetary argument is unlikely to succeed given the fundamental nature of the right involved. The case has significant implications for judicial infrastructure reform across Pakistan."
      }
    ],
    conversation: [
      {
        id: "brief-009-c1",
        role: "user",
        content: "How does Article 10-A apply to judicial delays caused by vacancies?",
        timestamp: "2024-02-20T11:00:00Z"
      },
      {
        id: "brief-009-c2",
        role: "assistant",
        content: "Article 10-A of the Constitution, introduced by the 18th Amendment in 2010, provides that 'For the determination of his civil rights and obligations or in any criminal charge against him, a person shall be entitled to a fair trial and due process.' The right to a fair trial has been interpreted by the Supreme Court to include the right to a speedy trial. When judicial vacancies systematically prevent timely adjudication, it constitutes a structural violation of Article 10-A. In Watan Party v. Federation of Pakistan (PLD 2011 SC 997), the Court held that access to justice is not merely an abstract right but requires concrete institutional arrangements for its realization. The chronic vacancy rate of 52% in Balochistan's subordinate judiciary creates a systemic inability to provide fair trial within a reasonable time, directly engaging Article 10-A.",
        timestamp: "2024-02-20T11:01:00Z",
        citations: [
          {
            id: "cit-008",
            caseName: "Watan Party v. Federation of Pakistan",
            citation: "PLD 2011 SC 997",
            court: "Supreme Court of Pakistan",
            year: "2011",
            relevance: "Access to justice as fundamental right",
            snippet: "Access to justice is a fundamental right which requires concrete institutional arrangements including an adequately staffed judiciary for its meaningful realization."
          }
        ]
      },
      {
        id: "brief-009-c3",
        role: "user",
        content: "What remedies can the High Court direct?",
        timestamp: "2024-02-20T11:10:00Z"
      }
    ]
  },
  {
    id: "brief-010",
    caseId: "case-013",
    caseTitle: "State v. Nasir Mehmood & 4 Others",
    status: "Draft",
    createdAt: "2024-02-01",
    sections: [
      {
        id: "brief-010-s1",
        title: "Case Header",
        content: "Criminal Revision No. 112/2024\nIslamabad High Court\nBefore: Hon. Mr. Justice Miangul Hassan Aurangzeb\nSubject: Criminal Revision against Bail Order in CNSA Case"
      },
      {
        id: "brief-010-s2",
        title: "Parties & Representation",
        content: "PETITIONER (STATE): The State through Anti-Narcotics Force.\nCounsel: Mr. Jahanzeb Bharwana, Special Prosecutor ANF.\n\nRESPONDENTS: Nasir Mehmood s/o Ghulam Qadir & 4 Others, accused of narcotics trafficking.\nCounsel: Ch. Akhtar Ali, Advocate Supreme Court."
      },
      {
        id: "brief-010-s3",
        title: "Material Facts",
        content: "1. FIR No. 15/2023 was registered at PS ANF Islamabad under Section 9(c) of CNSA, 1997.\n2. Respondents were apprehended on 05.08.2023 at Motorway Toll Plaza, Islamabad.\n3. 15 kg heroin was recovered from a modified fuel tank of vehicle No. LEA-1234.\n4. The Special Judge CNS granted post-arrest bail on 10.01.2024.\n5. The State contends bail was granted in violation of Section 51 of the CNSA.\n6. The quantity of 15 kg heroin attracts the maximum penalty under Section 9(c)."
      },
      {
        id: "brief-010-s4",
        title: "Legal Issues",
        content: "1. Whether the learned Special Judge CNS was justified in granting bail in a case falling under Section 9(c) of the CNSA, 1997?\n2. Whether the restrictive clause under Section 51 of the CNSA creates a statutory bar against bail where the quantity exceeds the prescribed threshold?\n3. Whether the grounds cited for bail (period of incarceration and completion of investigation) override the statutory restriction?"
      },
      {
        id: "brief-010-s5",
        title: "Applicable Statutes",
        content: "- Control of Narcotic Substances Act, 1997: Sections 9(c), 51, 52\n- Code of Criminal Procedure, 1898: Sections 426, 439, 497\n- Constitution of Pakistan, 1973: Article 10 (right against arbitrary detention)"
      },
      {
        id: "brief-010-s6",
        title: "Petitioner's Arguments",
        content: "1. Section 51 of the CNSA creates a statutory bar against bail for offences punishable with death or life imprisonment where reasonable grounds exist for believing guilt.\n2. Recovery of 15 kg heroin establishes prima facie guilt and engages the mandatory minimum sentence under Section 9(c).\n3. The Special Judge failed to apply the restrictive clause and granted bail on irrelevant considerations.\n4. Reliance on Muhammad Tanveer v. The State (2022 SCMR 1140) where the Supreme Court held that bail in CNSA cases must be considered with extreme caution."
      },
      {
        id: "brief-010-s7",
        title: "Respondent's Arguments",
        content: "1. The respondents have been in custody for over 5 months and the trial is unlikely to conclude in the near future.\n2. The right to bail is a constitutional right under Article 10 and prolonged incarceration without trial violates this right.\n3. The investigation is complete and there is no risk of absconding or tampering with evidence.\n4. The restrictive clause is not an absolute bar and the court retains discretion to grant bail."
      },
      {
        id: "brief-010-s8",
        title: "Relevant Precedents",
        content: "1. Muhammad Tanveer v. The State (2022 SCMR 1140): Bail in CNSA cases must be granted with extreme caution given the severity of the offence.\n2. Zafar Iqbal v. ANF (2019 SCMR 2008): Section 51 creates a presumption against bail in serious narcotics offences.\n3. Muhammad Hussain v. The State (PLD 2018 SC 678): Even restrictive clauses do not create an absolute bar; bail may be granted in exceptional circumstances."
      },
      {
        id: "brief-010-s9",
        title: "Preliminary Analysis",
        content: "The State has a strong case for cancellation of bail given the quantity of narcotics involved (15 kg heroin) and the restrictive clause under Section 51 of the CNSA. The Special Judge's order appears to have been passed without adequate consideration of the statutory restriction. However, the respondents' argument regarding prolonged incarceration carries weight under Article 10 of the Constitution. The outcome will likely depend on whether the High Court finds that the Special Judge applied the correct legal test under Section 51."
      }
    ],
    conversation: [
      {
        id: "brief-010-c1",
        role: "user",
        content: "What is the threshold quantity under Section 9(c) of CNSA?",
        timestamp: "2024-02-01T13:00:00Z"
      },
      {
        id: "brief-010-c2",
        role: "assistant",
        content: "Under Section 9(c) of the Control of Narcotic Substances Act, 1997, any person who owns, possesses, or controls narcotic drugs or psychotropic substances exceeding the quantity specified in the Third Schedule shall be punished with death or imprisonment for life, and shall also be liable to fine. For heroin, the Third Schedule specifies that quantities exceeding 1 kg attract Section 9(c). In this case, the recovery of 15 kg heroin is fifteen times the threshold, placing the case squarely within the most serious category of narcotics offences.",
        timestamp: "2024-02-01T13:01:00Z"
      }
    ]
  },
  // Enhanced Brief (with source references and review workflow)
  {
    id: "brief-011",
    caseId: "case-014",
    caseTitle: "Mst. Nadia Khalil v. Province of Punjab",
    status: "in_review" as const,
    createdAt: "2024-03-18",
    sections: [
      {
        id: "brief-011-s1",
        title: "Case Header",
        content: "Writ Petition No. 4521/2024\nFiled under Article 199 of the Constitution\nLahore High Court, Lahore\nBefore: Hon. Ms. Justice Aalia Neelum",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 1, snippet: "Writ Petition No. 4521/2024" }
        ],
        reviewStatus: "approved" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s2",
        title: "Parties & Representation",
        content: "PETITIONER: Mst. Nadia Khalil d/o Muhammad Khalil, school teacher, resident of Lahore.\nCounsel: Ms. Asma Jahangir Foundation Legal Aid.\n\nRESPONDENT: Province of Punjab through Secretary Education Department.\nCounsel: Advocate General Punjab.",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 1, snippet: "PETITIONER: Mst. Nadia Khalil d/o Muhammad Khalil" },
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 2, snippet: "RESPONDENT: Province of Punjab through Secretary" }
        ],
        reviewStatus: "approved" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s3",
        title: "Material Facts",
        content: "1. The petitioner is a BPS-16 school teacher in the Education Department, Government of Punjab since 2015.\n2. On 10th January 2024, the petitioner was transferred from Lahore to Rajanpur without any reason or prior notice.\n3. The transfer order was issued without following the Punjab Government Servants (Transfer) Policy, 2019.\n4. The petitioner has two school-going children and an ailing mother dependent on her.\n5. Multiple representations to the Secretary Education were submitted but went unheeded.\n6. Similarly situated male teachers were not transferred, suggesting gender discrimination.",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 3, snippet: "transferred from Lahore to Rajanpur without any reason" },
          { documentId: "doc-a2", documentName: "Transfer_Order.pdf", documentType: "Court Order" as const, pageNumber: 1, snippet: "Order No. EDU/2024/1234 dated 10.01.2024" },
          { documentId: "doc-a3", documentName: "Evidence_Bundle.pdf", documentType: "Evidence" as const, pageNumber: 5, snippet: "male teachers were not transferred from the same school" }
        ],
        reviewStatus: "pending_review" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s4",
        title: "Legal Issues",
        content: "1. Whether the transfer order dated 10.01.2024 was issued in violation of the Punjab Government Servants (Transfer) Policy, 2019?\n2. Whether the transfer amounts to discrimination on the basis of gender in violation of Article 25 of the Constitution?\n3. Whether the petitioner has a legitimate expectation of being heard before a punitive transfer?",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 5, snippet: "Whether the transfer order dated 10.01.2024 was issued" }
        ],
        reviewStatus: "pending_review" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s5",
        title: "Applicable Statutes",
        content: "- Constitution of Pakistan, 1973: Articles 4, 9, 14, 25, 199\n- Punjab Civil Servants Act, 1974: Section 10\n- Punjab Government Servants (Transfer) Policy, 2019\n- Punjab Government Efficiency and Discipline Rules, 2001",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 6 }
        ],
        reviewStatus: "approved" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s6",
        title: "Petitioner's Arguments",
        content: "1. The transfer order violates the mandatory provisions of the Punjab Transfer Policy, 2019 which requires: (a) minimum 3-year tenure before transfer, (b) consultation with the teacher, and (c) consideration of personal circumstances.\n2. The transfer is discriminatory as male teachers in the same school were not transferred, violating Article 25 of the Constitution.\n3. The transfer is punitive in nature as it coincides with the petitioner's complaint against the headmaster for misappropriation of school funds.",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 7, snippet: "mandatory provisions of the Punjab Transfer Policy" },
          { documentId: "doc-a3", documentName: "Evidence_Bundle.pdf", documentType: "Evidence" as const, pageNumber: 8, snippet: "complaint against the headmaster for misappropriation" }
        ],
        reviewStatus: "pending_review" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s7",
        title: "Respondent's Arguments",
        content: "1. Transfer is an incident of service and the government has administrative discretion in posting and transfers.\n2. The Transfer Policy is a guideline and not a binding statutory instrument.\n3. The transfer was made in public interest to address teacher shortages in Rajanpur district.",
        sources: [
          { documentId: "doc-a4", documentName: "Written_Statement.pdf", documentType: "Written Arguments" as const, pageNumber: 2, snippet: "Transfer is an incident of service" }
        ],
        reviewStatus: "pending_review" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s8",
        title: "Relevant Precedents",
        content: "1. Government of Punjab v. Rafaqat Ali (2017 SCMR 2045): Government policies on transfers create legitimate expectations.\n2. Muhammad Sajid v. Government of KPK (PLD 2019 SC 675): State obligations towards government servants must be exercised fairly.\n3. Mst. Sughran Bibi v. Government of Punjab (PLD 2018 SC 595): Mandatory compliance with statutory provisions is required.",
        sources: [],
        reviewStatus: "pending_review" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s9",
        title: "Comparative Matrix",
        content: "Issue 1: Whether the transfer order violated the Transfer Policy\n  Petitioner: Transfer Policy mandates 3-year minimum tenure and consultation\n  Respondent: Policy is a guideline, not binding\n\nIssue 2: Whether the transfer is discriminatory\n  Petitioner: Male teachers in same school not transferred\n  Respondent: Administrative discretion in public interest\n\nIssue 3: Whether the petitioner had legitimate expectation\n  Petitioner: Policy creates legitimate expectation of fair treatment\n  Respondent: Transfer is an incident of service",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 7 },
          { documentId: "doc-a4", documentName: "Written_Statement.pdf", documentType: "Written Arguments" as const, pageNumber: 2 }
        ],
        reviewStatus: "pending_review" as const,
        regenerationCount: 0,
      },
      {
        id: "brief-011-s10",
        title: "Preliminary Analysis",
        content: "The petitioner has a reasonably strong case given the clear provisions of the Transfer Policy, 2019 requiring minimum tenure and consultation. The allegation of gender discrimination, if supported by comparative data showing male teachers were not transferred, strengthens the constitutional dimension of the case. The timing of the transfer coinciding with the petitioner's complaint against the headmaster suggests retaliatory motive. The respondent's argument that the policy is merely a guideline is likely to be rejected given the Supreme Court's consistent position on government policies creating legitimate expectations.",
        sources: [
          { documentId: "doc-a1", documentName: "Petition.pdf", documentType: "Petition" as const, pageNumber: 3 },
          { documentId: "doc-a3", documentName: "Evidence_Bundle.pdf", documentType: "Evidence" as const, pageNumber: 8 }
        ],
        reviewStatus: "flagged" as const,
        flagNote: "Verify the comparative data on male teacher transfers before finalizing",
        regenerationCount: 0,
      }
    ],
    conversation: [],
    uploadedDocuments: [
      { id: "doc-a1", fileName: "Petition.pdf", documentType: "Petition" as const, totalPages: 12 },
      { id: "doc-a2", fileName: "Transfer_Order.pdf", documentType: "Court Order" as const, totalPages: 2 },
      { id: "doc-a3", fileName: "Evidence_Bundle.pdf", documentType: "Evidence" as const, totalPages: 15 },
      { id: "doc-a4", fileName: "Written_Statement.pdf", documentType: "Written Arguments" as const, totalPages: 8 }
    ],
    reviewProgress: { total: 10, approved: 3, flagged: 1 },
  }
];

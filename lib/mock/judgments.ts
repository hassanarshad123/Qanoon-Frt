import type { Judgment } from "./types";

export const judgments: Judgment[] = [
  {
    id: "jdg-001",
    caseId: "case-001",
    caseTitle: "Muhammad Aslam v. Federation of Pakistan",
    status: "Under Review",
    createdAt: "2024-03-15",
    sections: [
      {
        id: "jdg-001-s1",
        title: "Facts",
        content: "The petitioner Muhammad Aslam, a citizen of Pakistan and social activist, filed this Constitutional Petition under Article 184(3) of the Constitution challenging the blanket imposition of Section 144 CrPC by the District Magistrate, Islamabad Capital Territory. The impugned order dated 15th December 2023 prohibited all public assemblies within ICT for an indefinite period without specifying any temporal limitation or geographical boundaries. The petitioner contended that he was directly affected as his planned peaceful gatherings for promotion of democratic values were prohibited. The Federation, through the Attorney General, defended the order on grounds of public safety and security concerns in the federal capital. On 20th February 2024, this Court issued notice and directed the respondent to file a concise statement.",
        order: 1
      },
      {
        id: "jdg-001-s2",
        title: "Issues",
        content: "The following issues arise for determination:\n\n(i) Whether a blanket and indefinite order under Section 144 CrPC restricting all public assemblies within the territorial limits of Islamabad Capital Territory is constitutionally valid?\n\n(ii) Whether the impugned order violates the fundamental rights guaranteed under Articles 16 (right to assemble peacefully) and 19 (freedom of speech and expression) of the Constitution?\n\n(iii) Whether the restriction imposed is 'reasonable' within the meaning of Article 16 and satisfies the test of proportionality?\n\n(iv) Whether this Court, in exercise of its jurisdiction under Article 184(3), can strike down or modify an executive order under Section 144 CrPC?",
        order: 2
      },
      {
        id: "jdg-001-s3",
        title: "Analysis",
        content: "We have given our anxious consideration to the submissions advanced by the learned counsel for both parties and have perused the record with care.\n\nThe right to assemble peacefully is a cherished fundamental right enshrined in Article 16 of the Constitution. It is the hallmark of a democratic society that citizens may gather peacefully to express their views on matters of public concern. However, this right is not absolute and is subject to 'reasonable restrictions imposed by law in the interest of public order.'\n\nThe key question is what constitutes a 'reasonable restriction.' In our constitutional framework, the word 'reasonable' imposes a qualitative limitation on the nature and extent of restrictions. A restriction that is blanket in its application, indefinite in its duration, and disproportionate to the objective sought to be achieved cannot be termed 'reasonable' under any standard of constitutional interpretation.\n\nSection 144 CrPC is a colonial-era provision designed as a temporary measure to address imminent threats to public order in specific areas. Its blanket application across an entire territory for an indefinite period transforms a temporary emergency measure into a permanent prohibition of a fundamental right, which is anathema to constitutional governance.",
        order: 3
      },
      {
        id: "jdg-001-s4",
        title: "Applicable Law",
        content: "The following statutory and constitutional provisions are relevant:\n\n1. Article 16 of the Constitution: 'Every citizen shall have the right to assemble peacefully and without arms, subject to any reasonable restrictions imposed by law in the interest of public order.'\n\n2. Article 19 of the Constitution: 'Every citizen shall have the right to freedom of speech and expression, and there shall be freedom of the press, subject to any reasonable restrictions imposed by law in the interest of the glory of Islam or the integrity, security or defence of Pakistan...'\n\n3. Section 144 CrPC: Empowers the District Magistrate to issue orders 'in cases of nuisance or apprehended danger' for a period not exceeding two months.\n\n4. Article 184(3) of the Constitution: Confers original jurisdiction on the Supreme Court in matters involving questions of public importance with reference to enforcement of fundamental rights.",
        order: 4
      },
      {
        id: "jdg-001-s5",
        title: "Precedents",
        content: "We have been guided by the following precedents:\n\n1. Benazir Bhutto v. Federation of Pakistan (PLD 1988 SC 416): This Court held that the right to peaceful assembly is a fundamental right which forms part of the basic structure of the Constitution and cannot be curtailed through blanket executive orders.\n\n2. I.A. Sharwani v. Government of Pakistan (PLD 1991 SC 734): The proportionality principle was established as a cornerstone of judicial review of restrictions on fundamental rights.\n\n3. Baz Muhammad Kakar v. Federation of Pakistan (PLD 2012 SC 870): This Court reaffirmed that fundamental rights are inviolable and any restriction must satisfy the dual test of legality and reasonableness.\n\n4. Indian Supreme Court in Shreya Singhal v. Union of India (AIR 2015 SC 1523): While not binding, the comparative jurisprudence on proportionality in restricting assembly rights provides useful guidance.",
        order: 5
      },
      {
        id: "jdg-001-s6",
        title: "Holding",
        content: "In light of the foregoing analysis, we hold as follows:\n\n(i) The impugned order dated 15.12.2023 passed by the District Magistrate, Islamabad, imposing a blanket and indefinite ban on all public assemblies within ICT under Section 144 CrPC is UNCONSTITUTIONAL and is hereby STRUCK DOWN.\n\n(ii) The power under Section 144 CrPC must be exercised with temporal limitation (not exceeding two months as per the provision itself), geographical specificity, and in proportion to the demonstrated threat to public order.\n\n(iii) Any future orders under Section 144 CrPC must specify: (a) the area to which the order applies; (b) the duration of the order; (c) the specific threat to public order that necessitates the restriction; and (d) reasons demonstrating that the restriction is the least restrictive means to address the identified threat.\n\n(iv) The blanket prohibition of peaceful assembly through indefinite executive orders constitutes a violation of Articles 16 and 19 of the Constitution.",
        order: 6
      },
      {
        id: "jdg-001-s7",
        title: "Relief",
        content: "The petition is ALLOWED with the following directions:\n\n1. The impugned order dated 15.12.2023 is declared unconstitutional and set aside.\n\n2. The District Administration, Islamabad is directed to frame guidelines for the exercise of power under Section 144 CrPC in accordance with the principles laid down in this judgment.\n\n3. Any person seeking to hold a peaceful assembly shall be entitled to do so upon giving reasonable notice to the District Administration, which may impose reasonable conditions regarding time, place, and manner of the assembly.\n\n4. The District Administration shall not refuse permission for a peaceful assembly except on demonstrated grounds of imminent threat to public order, supported by documented intelligence assessment.\n\n5. No order of costs.",
        order: 7
      }
    ],
    suggestedPrecedents: [
      {
        id: "prec-001",
        caseName: "Benazir Bhutto v. Federation of Pakistan",
        citation: "PLD 1988 SC 416",
        court: "Supreme Court of Pakistan",
        year: "1988",
        relevance: "Right to peaceful assembly as fundamental right",
        summary: "The Supreme Court held that the right to assemble peacefully is a fundamental right forming part of the basic structure of the Constitution. Blanket executive orders restricting this right without demonstrating an imminent threat to public order are unconstitutional.",
        relevanceScore: 95
      },
      {
        id: "prec-002",
        caseName: "I.A. Sharwani v. Government of Pakistan",
        citation: "PLD 1991 SC 734",
        court: "Supreme Court of Pakistan",
        year: "1991",
        relevance: "Proportionality principle in fundamental rights restrictions",
        summary: "Established the proportionality principle as a cornerstone of judicial review of restrictions on fundamental rights. Any restriction must be narrowly tailored, use the least restrictive means, and be proportionate to the objective sought to be achieved.",
        relevanceScore: 92
      },
      {
        id: "prec-003",
        caseName: "Baz Muhammad Kakar v. Federation of Pakistan",
        citation: "PLD 2012 SC 870",
        court: "Supreme Court of Pakistan",
        year: "2012",
        relevance: "Inviolability of fundamental rights",
        summary: "Reaffirmed that fundamental rights guaranteed by the Constitution are inviolable and any restriction must satisfy the dual test of legality (authorized by law) and reasonableness (proportionate and necessary).",
        relevanceScore: 88
      },
      {
        id: "prec-004",
        caseName: "Workers' Party Pakistan v. Federation of Pakistan",
        citation: "PLD 2012 SC 681",
        court: "Supreme Court of Pakistan",
        year: "2012",
        relevance: "Scope of Article 184(3) jurisdiction",
        summary: "Clarified the scope of the Supreme Court's jurisdiction under Article 184(3) and held that matters involving enforcement of fundamental rights that raise questions of public importance fall within the Court's original jurisdiction.",
        relevanceScore: 82
      }
    ]
  },
  {
    id: "jdg-002",
    caseId: "case-002",
    caseTitle: "State v. Imran Shahzad",
    status: "Draft",
    createdAt: "2024-03-18",
    sections: [
      {
        id: "jdg-002-s1",
        title: "Facts",
        content: "This criminal appeal has been filed by the appellant Imran Shahzad s/o Ghulam Mustafa against the judgment dated 05.01.2024 passed by the learned Additional Sessions Judge, Lahore, whereby the appellant was convicted under Section 302/34 PPC and sentenced to death with direction to pay Rs. 500,000/- as compensation under Section 544-A CrPC.\n\nThe prosecution case, as set up in FIR No. 234/2023 registered at Police Station Ichhra, Lahore, is that on 15th October 2023, at approximately 10:30 PM, the appellant along with an unknown accomplice fired at the deceased Muhammad Akbar at his shop on Main Boulevard, Shah Jamal, Lahore. The complainant Muhammad Zahid (PW-1) claimed to be an eyewitness. The appellant was arrested on 18th October 2023 and a 30-bore pistol was recovered from his possession.",
        order: 1
      },
      {
        id: "jdg-002-s2",
        title: "Issues",
        content: "(i) Whether the prosecution has proved its case beyond reasonable doubt through consistent and reliable ocular testimony?\n\n(ii) Whether the material contradictions between PW-1 and PW-3 regarding the time and circumstances of the occurrence vitiate the prosecution's case?\n\n(iii) Whether the recovery of the weapon, made without independent witnesses and after a delay of 3 days, can be relied upon as corroborative evidence?\n\n(iv) Whether the failure to establish motive casts doubt on the prosecution's case in a capital charge?",
        order: 2
      },
      {
        id: "jdg-002-s3",
        title: "Analysis",
        content: "We have carefully examined the testimony of the prosecution witnesses and the material placed on record.\n\nPW-1 Muhammad Zahid stated that the occurrence took place at 10:30 PM, while PW-3 Rizwan Ahmad placed the time at 9:45 PM. This 45-minute discrepancy is not a minor variation but a material contradiction going to the root of the prosecution's case, as it raises questions about the actual presence of these witnesses at the scene.\n\nFurthermore, PW-1 stated that the appellant fired two shots from a 30-bore pistol, whereas the medico-legal evidence shows four entry wounds on the deceased. This inconsistency between the ocular account and the medical evidence is significant.\n\nThe recovery of the 30-bore pistol was effected on 21st October 2023, three days after the arrest, without any independent witness. The recovery memo was prepared with a patent delay and bears no corroboration from any independent source.",
        order: 3
      },
      {
        id: "jdg-002-s4",
        title: "Applicable Law",
        content: "Section 302 PPC: 'Whoever commits qatl-e-amd shall, subject to the provisions of this Chapter, be punished with death as qisas, or imprisonment for life as ta'zir...'\n\nSection 34 PPC: 'When a criminal act is done by several persons, in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if the act were done by him alone.'\n\nArticle 129 of the Qanun-e-Shahadat Order, 1984: The court may presume the existence of any fact which it thinks likely to have happened, regard being had to the common course of natural events.\n\nThe golden principle of criminal law that the prosecution must prove its case beyond reasonable doubt, and that the benefit of every reasonable doubt must be extended to the accused (Muhammad Akram v. The State, 2009 SCMR 230).",
        order: 4
      },
      {
        id: "jdg-002-s5",
        title: "Precedents",
        content: "1. Tariq Pervez v. The State (1995 SCMR 1345): The testimony of interested and related witnesses must be scrutinized with care and caution, and independent corroboration is required.\n\n2. Muhammad Akram v. The State (2009 SCMR 230): Material contradictions in the testimony of prosecution witnesses regarding fundamental aspects of the occurrence render such testimony unreliable.\n\n3. Hashim Qasim v. The State (2017 SCMR 986): The benefit of doubt must be extended to the accused, and it is not necessary that there should be many circumstances creating doubt; a single circumstance creating reasonable doubt is sufficient for acquittal.\n\n4. Naveed Asghar v. The State (PLD 2021 SC 600): Recovery of a weapon without independent witnesses and with unexplained delay diminishes its evidentiary value to the point of being unreliable.",
        order: 5
      },
      {
        id: "jdg-002-s6",
        title: "Holding",
        content: "In view of the foregoing discussion, we hold:\n\n(i) The prosecution has failed to prove its case beyond reasonable doubt. The material contradictions between PW-1 and PW-3 regarding the time of occurrence, the inconsistency between the ocular account and the medical evidence, and the unreliable recovery proceedings collectively create reasonable doubt.\n\n(ii) The learned trial court committed a grave error in relying upon the testimony of interested witnesses without adequate independent corroboration, in contravention of the principles laid down in Tariq Pervez (1995 SCMR 1345).\n\n(iii) The benefit of every reasonable doubt must be extended in favor of the accused, as a matter of right, not concession.\n\n(iv) The conviction and sentence awarded by the learned trial court cannot be sustained.",
        order: 6
      },
      {
        id: "jdg-002-s7",
        title: "Relief",
        content: "For the foregoing reasons, the criminal appeal is ALLOWED.\n\n1. The judgment and order of conviction dated 05.01.2024 passed by the learned Additional Sessions Judge, Lahore in Sessions Trial No. 189/2023 is hereby SET ASIDE.\n\n2. The appellant Imran Shahzad s/o Ghulam Mustafa is ACQUITTED of the charge under Section 302/34 PPC.\n\n3. The appellant shall be released forthwith from jail if not required in any other case.\n\n4. The surety bonds furnished by the appellant shall stand discharged.\n\n5. The Superintendent Jail shall ensure compliance with this order within 24 hours and submit compliance report to the Registrar of this Court.",
        order: 7
      }
    ],
    suggestedPrecedents: [
      {
        id: "prec-005",
        caseName: "Tariq Pervez v. The State",
        citation: "1995 SCMR 1345",
        court: "Supreme Court of Pakistan",
        year: "1995",
        relevance: "Interested witness testimony requires corroboration",
        summary: "The Supreme Court held that testimony of interested and closely related witnesses must be scrutinized with extreme care and caution. Such testimony requires independent corroboration before it can form the basis of a conviction, particularly in capital charges.",
        relevanceScore: 96
      },
      {
        id: "prec-006",
        caseName: "Muhammad Akram v. The State",
        citation: "2009 SCMR 230",
        court: "Supreme Court of Pakistan",
        year: "2009",
        relevance: "Material contradictions in prosecution evidence",
        summary: "Material contradictions in the testimony of prosecution witnesses regarding the time, place, and manner of occurrence render the testimony unreliable and create reasonable doubt sufficient for acquittal.",
        relevanceScore: 94
      },
      {
        id: "prec-007",
        caseName: "Hashim Qasim v. The State",
        citation: "2017 SCMR 986",
        court: "Supreme Court of Pakistan",
        year: "2017",
        relevance: "Single circumstance of doubt sufficient for acquittal",
        summary: "The benefit of doubt is a right of the accused, not a concession. A single circumstance creating reasonable doubt is sufficient to warrant acquittal in a criminal case.",
        relevanceScore: 91
      },
      {
        id: "prec-008",
        caseName: "Naveed Asghar v. The State",
        citation: "PLD 2021 SC 600",
        court: "Supreme Court of Pakistan",
        year: "2021",
        relevance: "Recovery without independent witnesses unreliable",
        summary: "Recovery of a crime weapon effected without independent witnesses and with unexplained delay has diminished evidentiary value and cannot serve as reliable corroborative evidence.",
        relevanceScore: 89
      },
      {
        id: "prec-009",
        caseName: "Ayub Masih v. The State",
        citation: "PLD 2002 SC 1048",
        court: "Supreme Court of Pakistan",
        year: "2002",
        relevance: "Standard of proof in capital cases",
        summary: "In cases involving capital punishment, the standard of proof is higher and the prosecution must establish guilt through unimpeachable evidence leaving no room for any reasonable doubt.",
        relevanceScore: 85
      }
    ]
  },
  {
    id: "jdg-003",
    caseId: "case-003",
    caseTitle: "Fatima Bibi v. Muhammad Tariq",
    status: "Finalized",
    createdAt: "2024-03-10",
    sections: [
      {
        id: "jdg-003-s1",
        title: "Facts",
        content: "The petitioner Mst. Fatima Bibi d/o Haji Muhammad Nawaz filed this family appeal seeking dissolution of marriage (Khula), recovery of dower (haq mehr), maintenance (nafqa), and custody (hizanat) of two minor children.\n\nThe petitioner was married to the respondent Muhammad Tariq on 10th March 2018. The agreed dower was Rs. 500,000/- prompt and 10 tola gold deferred. Two children were born: Muhammad Abdullah (aged 7) and Mst. Ayesha (aged 4). The petitioner alleged habitual cruelty and non-maintenance since January 2023. The respondent denied the allegations and contested the custody and maintenance claims.",
        order: 1
      },
      {
        id: "jdg-003-s2",
        title: "Issues",
        content: "(i) Whether the petitioner has established grounds for dissolution of marriage through Khula?\n\n(ii) Whether the petitioner is entitled to recovery of unpaid dower?\n\n(iii) What is the appropriate quantum of maintenance for the petitioner and the minor children?\n\n(iv) Whether the welfare of the minor children requires their custody to remain with the mother?",
        order: 2
      },
      {
        id: "jdg-003-s3",
        title: "Analysis",
        content: "Regarding Khula, the petitioner has expressed her unwillingness to continue the marriage and has stated that she cannot live within the limits prescribed by God (hudood Allah). Under the Dissolution of Muslim Marriages Act, 1939 and the landmark judgment in Khurshid Bibi v. Muhammad Amin (PLD 1967 SC 97), a wife has an inherent right to seek Khula. The evidence of cruelty, including medical reports and witness testimony, strengthens the petitioner's case.\n\nRegarding dower, the nikahnama clearly stipulates Rs. 500,000/- prompt and 10 tola gold deferred. The respondent has not produced any evidence of payment. Dower is an enforceable debt under Muslim personal law.\n\nRegarding custody, the paramount consideration is the welfare of the children. The daughter Mst. Ayesha at age 4 is well within the hizanat period for females. The son Muhammad Abdullah at age 7 has reached the traditional age of discretion under Hanafi law, but the Supreme Court in Rana Abdul Khaliq v. Mst. Tahira (2019 SCMR 367) held that age is not the sole determinant; the welfare principle overrides.\n\nRegarding maintenance, the respondent's salary of Rs. 95,000/- must be balanced against the reasonable needs of the wife and children, considering the prevailing cost of living.",
        order: 3
      },
      {
        id: "jdg-003-s4",
        title: "Applicable Law",
        content: "1. Dissolution of Muslim Marriages Act, 1939: Section 2(viii)(a) - grounds for dissolution including cruelty.\n\n2. Muslim Family Laws Ordinance, 1961: Sections 9 and 10 - maintenance and dower provisions.\n\n3. West Pakistan Family Courts Act, 1964: Sections 5 and 14 - jurisdiction and execution.\n\n4. Guardians and Wards Act, 1890: Sections 7, 12, 17, and 25 - custody and welfare of minors.\n\n5. Constitution of Pakistan, 1973: Article 35 - 'The State shall protect the marriage, the family, the mother and the child.'",
        order: 4
      },
      {
        id: "jdg-003-s5",
        title: "Precedents",
        content: "1. Khurshid Bibi v. Muhammad Amin (PLD 1967 SC 97): A wife has an inherent right under Muslim law to seek dissolution of marriage through Khula, and the court shall grant Khula where the wife states she cannot live within the limits prescribed by Allah.\n\n2. Mst. Salma Agha v. The State (2018 SCMR 1196): The paramount consideration in custody disputes is the welfare of the child, which must be assessed holistically considering emotional, physical, and educational needs.\n\n3. Rana Abdul Khaliq v. Mst. Tahira (2019 SCMR 367): The rigid application of age-based rules for custody is not in consonance with the welfare principle; each case must be decided on its own facts.\n\n4. Muhammad Nawaz v. Mst. Ghulam Fatima (2020 CLC 1245 Lah): Unpaid dower is an enforceable debt and remains payable irrespective of the mode of dissolution of marriage.",
        order: 5
      },
      {
        id: "jdg-003-s6",
        title: "Holding",
        content: "Based on the evidence and applicable law, we hold as follows:\n\n(i) The marriage between the petitioner and the respondent stands dissolved by way of Khula effective from the date of this decree.\n\n(ii) The respondent is liable to pay the unpaid prompt dower of Rs. 500,000/- and the deferred dower of 10 tola gold (or market equivalent) to the petitioner.\n\n(iii) The petitioner shall return Rs. 100,000/- as consideration for Khula, taking into account the established cruelty.\n\n(iv) Custody of both minor children shall remain with the mother, the welfare of the children being the paramount consideration.\n\n(v) The respondent shall pay monthly maintenance of Rs. 60,000/- (Rs. 20,000/- per child and Rs. 20,000/- for iddat period maintenance) subject to annual increase of 10%.\n\n(vi) The respondent shall have visitation rights every alternate weekend from Saturday 10:00 AM to Sunday 6:00 PM.",
        order: 6
      },
      {
        id: "jdg-003-s7",
        title: "Relief",
        content: "The family appeal is PARTLY ALLOWED in the following terms:\n\n1. Decree of Khula is granted dissolving the marriage between the parties.\n\n2. The respondent shall pay the unpaid dower of Rs. 500,000/- and 10 tola gold within 30 days of this decree.\n\n3. The petitioner shall return Rs. 100,000/- to the respondent as Khula consideration.\n\n4. Custody of Muhammad Abdullah and Mst. Ayesha shall remain with the petitioner mother.\n\n5. Monthly maintenance of Rs. 60,000/- shall be paid by the 7th of each month with 10% annual increase.\n\n6. The respondent shall have visitation rights as specified.\n\n7. The respondent shall bear the educational expenses of the children in addition to the maintenance amount.\n\n8. Decree shall be drawn up accordingly.",
        order: 7
      }
    ],
    suggestedPrecedents: [
      {
        id: "prec-010",
        caseName: "Khurshid Bibi v. Muhammad Amin",
        citation: "PLD 1967 SC 97",
        court: "Supreme Court of Pakistan",
        year: "1967",
        relevance: "Wife's inherent right to Khula",
        summary: "Landmark judgment establishing that Khula is an inherent right of a Muslim wife. Where the wife expresses inability to live within the limits prescribed by Allah, the court is bound to grant Khula subject to conditions regarding return of dower.",
        relevanceScore: 97
      },
      {
        id: "prec-011",
        caseName: "Mst. Salma Agha v. The State",
        citation: "2018 SCMR 1196",
        court: "Supreme Court of Pakistan",
        year: "2018",
        relevance: "Welfare principle in custody disputes",
        summary: "The Supreme Court held that the welfare of the child is the paramount and overriding consideration in custody disputes, to be assessed holistically considering all factors including the child's emotional, physical, and educational well-being.",
        relevanceScore: 93
      },
      {
        id: "prec-012",
        caseName: "Rana Abdul Khaliq v. Mst. Tahira",
        citation: "2019 SCMR 367",
        court: "Supreme Court of Pakistan",
        year: "2019",
        relevance: "Age-based custody rules are not rigid",
        summary: "The traditional age-based rules for hizanat are guidelines, not rigid rules. The welfare of the child must be the primary consideration, and custody may be awarded to the mother beyond the prescribed age where the child's welfare so demands.",
        relevanceScore: 90
      }
    ]
  },
  {
    id: "jdg-004",
    caseId: "case-006",
    caseTitle: "Workers' Federation v. Government of Punjab",
    status: "Under Review",
    createdAt: "2024-03-16",
    sections: [
      {
        id: "jdg-004-s1",
        title: "Facts",
        content: "The petitioner All Pakistan Workers' Federation, a registered trade union representing over 2 million workers in Punjab, filed this writ petition challenging the Punjab Minimum Wages Notification 2024 which fixed the minimum wage at Rs. 32,000/- per month. The petitioner contended that this amount is grossly inadequate in view of inflation exceeding 30% and rising cost of essential commodities. The Secretary Labour Department filed an affidavit stating that the wage was determined by the Minimum Wages Board after considering economic conditions, employer capacity, and the consumer price index. The case was reserved for judgment on 15.03.2024.",
        order: 1
      },
      {
        id: "jdg-004-s2",
        title: "Issues",
        content: "(i) Whether the minimum wage of Rs. 32,000/- per month is adequate in light of the prevailing inflation rate and cost of living?\n\n(ii) Whether the Minimum Wages Board properly discharged its statutory function in determining the minimum wage?\n\n(iii) Whether the inadequacy of minimum wages violates Article 38(a) of the Constitution which mandates the State to secure the well-being of the people?\n\n(iv) Whether this Court can direct the Government to revise the minimum wage?",
        order: 2
      },
      {
        id: "jdg-004-s3",
        title: "Analysis",
        content: "Article 38(a) of the Constitution imposes a solemn obligation on the State to 'secure the well-being of the people, irrespective of sex, caste, creed or race, by raising their standard of living.' While this provision falls within the Principles of Policy (Part II, Chapter 2), the Supreme Court has consistently held that these principles are not mere guidelines but impose enforceable obligations on the State.\n\nThe evidence placed on record demonstrates that the minimum wage of Rs. 32,000/- covers only 45% of the minimum food basket for a family of 4.5 persons as calculated by the Pakistan Bureau of Statistics. The consumer price index has risen by 32% since the last wage revision. The Government's argument about SME capacity, while legitimate, cannot override the fundamental obligation to ensure a living wage.\n\nThe Minimum Wages Board's deliberations, as evidenced by the minutes produced, show inadequate consideration of the actual cost of living data and an overemphasis on employer submissions without balancing worker welfare.",
        order: 3
      },
      {
        id: "jdg-004-s4",
        title: "Applicable Law",
        content: "1. Constitution of Pakistan, 1973: Article 38(a) - State shall secure the well-being of the people.\n\n2. Punjab Minimum Wages Ordinance, 1961: Section 19 - Constitution and functions of Minimum Wages Board.\n\n3. Factories Act, 1934: Section 2(f) - Definition of wages.\n\n4. ILO Convention No. 131 (Minimum Wage Fixing Convention, 1970): Though not ratified by Pakistan, it provides persuasive guidance on minimum wage determination criteria.\n\n5. Article 11 of the International Covenant on Economic, Social and Cultural Rights (ICESCR): Right to an adequate standard of living.",
        order: 4
      },
      {
        id: "jdg-004-s5",
        title: "Precedents",
        content: "1. Messrs Pakistan Tobacco Co. v. Government of NWFP (PLD 2002 SC 460): The State has an enforceable constitutional obligation to ensure the well-being of workers under Article 38.\n\n2. Khan Asfandyar Wali v. Federation of Pakistan (PLD 2001 SC 607): Principles of Policy, while not independently enforceable, inform the interpretation of fundamental rights and State obligations.\n\n3. Shehla Zia v. WAPDA (PLD 1994 SC 693): The right to life under Article 9 includes the right to a dignified existence, which encompasses the right to a living wage.\n\n4. Indian Supreme Court in People's Union for Democratic Rights v. Union of India (AIR 1982 SC 1473): Minimum wages below the subsistence level constitute forced labour.",
        order: 5
      },
      {
        id: "jdg-004-s6",
        title: "Holding",
        content: "(i) The current minimum wage of Rs. 32,000/- per month is inadequate and does not satisfy the State's constitutional obligation under Article 38(a) to secure the well-being of the working class.\n\n(ii) The Minimum Wages Board failed to adequately consider the actual cost of living data and the prevailing inflation rate in its deliberations.\n\n(iii) While the Court cannot fix a specific wage amount (that being a function of the executive), it can and must ensure that the constitutional mandate is fulfilled.\n\n(iv) The Government of Punjab is under a constitutional obligation to revise the minimum wage to ensure it reflects a living wage that meets the basic needs of workers and their families.",
        order: 6
      },
      {
        id: "jdg-004-s7",
        title: "Relief",
        content: "The writ petition is ALLOWED with the following directions:\n\n1. The Government of Punjab shall reconvene the Minimum Wages Board within 30 days to reconsider the minimum wage in light of the current cost of living, inflation data, and the constitutional mandate under Article 38(a).\n\n2. The Board shall ensure adequate representation of workers in its deliberations and shall give due weight to the Pakistan Bureau of Statistics data on the consumer price index and minimum food basket.\n\n3. The revised minimum wage notification shall be issued within 60 days of the reconvening of the Board.\n\n4. The Government shall develop a mechanism for annual automatic adjustment of the minimum wage linked to the consumer price index.\n\n5. Compliance report shall be submitted to this Court within 90 days.",
        order: 7
      }
    ],
    suggestedPrecedents: [
      {
        id: "prec-013",
        caseName: "Messrs Pakistan Tobacco Co. v. Government of NWFP",
        citation: "PLD 2002 SC 460",
        court: "Supreme Court of Pakistan",
        year: "2002",
        relevance: "State obligation to ensure worker well-being",
        summary: "The Supreme Court held that the State has an enforceable constitutional obligation under Article 38 to ensure the well-being of workers. Minimum wage legislation must be interpreted in light of this constitutional mandate.",
        relevanceScore: 93
      },
      {
        id: "prec-014",
        caseName: "Shehla Zia v. WAPDA",
        citation: "PLD 1994 SC 693",
        court: "Supreme Court of Pakistan",
        year: "1994",
        relevance: "Right to life includes right to dignified existence",
        summary: "The right to life under Article 9 of the Constitution is not limited to the mere right of physical existence but encompasses the right to live with dignity, which includes access to basic necessities and a living wage.",
        relevanceScore: 90
      },
      {
        id: "prec-015",
        caseName: "Khan Asfandyar Wali v. Federation of Pakistan",
        citation: "PLD 2001 SC 607",
        court: "Supreme Court of Pakistan",
        year: "2001",
        relevance: "Principles of Policy inform State obligations",
        summary: "While Principles of Policy are not independently enforceable as fundamental rights, they inform the interpretation of constitutional provisions and create binding obligations on the State to work towards their realization.",
        relevanceScore: 86
      },
      {
        id: "prec-016",
        caseName: "All Pakistan Workers' Federation v. Federation of Pakistan",
        citation: "2010 SCMR 1481",
        court: "Supreme Court of Pakistan",
        year: "2010",
        relevance: "Workers' rights and constitutional protection",
        summary: "The Supreme Court recognized the constitutional importance of workers' rights and held that the State must actively protect the interests of the working class through adequate legislation and enforcement.",
        relevanceScore: 84
      }
    ]
  },
  {
    id: "jdg-005",
    caseId: "case-013",
    caseTitle: "State v. Nasir Mehmood & 4 Others",
    status: "Draft",
    createdAt: "2024-03-20",
    sections: [
      {
        id: "jdg-005-s1",
        title: "Facts",
        content: "The State through the Anti-Narcotics Force filed this criminal revision against the order dated 10.01.2024 passed by the learned Special Judge CNS, Islamabad, whereby the respondents Nasir Mehmood and 4 co-accused were granted post-arrest bail in Case FIR No. 15/2023 under Section 9(c) of the Control of Narcotic Substances Act, 1997.\n\nThe respondents were apprehended on 05.08.2023 at the Motorway Toll Plaza, Islamabad. During search of the vehicle (No. LEA-1234), 15 kg of heroin was recovered from a modified fuel tank. The Special Prosecutor ANF contended that bail was granted in violation of the restrictive clause under Section 51 of the CNSA without proper appreciation of the severity of the offence and the quantity of contraband recovered.",
        order: 1
      },
      {
        id: "jdg-005-s2",
        title: "Issues",
        content: "(i) Whether the learned Special Judge CNS applied the correct legal test under Section 51 of the CNSA, 1997 while granting bail?\n\n(ii) Whether the quantity of narcotic substance (15 kg heroin) triggers the restrictive clause against bail under Section 51 read with Section 9(c)?\n\n(iii) Whether the grounds cited by the respondents (period of incarceration and completion of investigation) are sufficient to override the statutory bar?\n\n(iv) Whether this Court, in its revisional jurisdiction, should cancel the bail granted by the Special Judge?",
        order: 2
      },
      {
        id: "jdg-005-s3",
        title: "Analysis",
        content: "Section 51 of the CNSA, 1997 provides: 'Notwithstanding anything contained in the Code of Criminal Procedure, 1898, no person accused of an offence under this Act shall be released on bail... if the Court on a perusal of the case diary or the report under section 173 of the Code of Criminal Procedure, 1898, considers that there are reasonable grounds for believing that the accused is guilty of an offence punishable with death or imprisonment for life.'\n\nThe recovery of 15 kg heroin is fifteen times the threshold prescribed under the Third Schedule for invoking Section 9(c), which carries the death penalty or imprisonment for life. The Special Judge's order is conspicuously silent on the application of Section 51 and does not record any finding that reasonable grounds for believing guilt are absent.\n\nHowever, this Court must also consider that the respondents have been incarcerated for over 5 months and the right to liberty under Article 10 of the Constitution is a fundamental right. The Supreme Court in Muhammad Hussain v. The State (PLD 2018 SC 678) held that even the restrictive clause does not create an absolute bar against bail in exceptional circumstances.",
        order: 3
      },
      {
        id: "jdg-005-s4",
        title: "Applicable Law",
        content: "1. Control of Narcotic Substances Act, 1997:\n   - Section 9(c): Offence of possession exceeding prescribed quantity, punishable with death or life imprisonment.\n   - Section 51: Restrictive clause against bail.\n   - Section 52: Presumption against bail.\n\n2. Code of Criminal Procedure, 1898: Sections 426, 439, 497.\n\n3. Constitution of Pakistan, 1973: Article 10 - Safeguards as to arrest and detention.\n\n4. Third Schedule to the CNSA: Heroin threshold quantity of 1 kg for Section 9(c).",
        order: 4
      },
      {
        id: "jdg-005-s5",
        title: "Precedents",
        content: "1. Muhammad Tanveer v. The State (2022 SCMR 1140): Bail in cases under the CNSA must be considered with extreme caution given the severity of the offence and its societal impact. The restrictive clause under Section 51 creates a strong presumption against bail.\n\n2. Zafar Iqbal v. ANF (2019 SCMR 2008): Section 51 of the CNSA creates a statutory bar against bail where reasonable grounds exist for believing guilt, and this bar can only be overcome in the most exceptional circumstances.\n\n3. Muhammad Hussain v. The State (PLD 2018 SC 678): Even restrictive clauses do not create an absolute bar; in exceptional circumstances such as prolonged incarceration without trial, bail may be granted.\n\n4. Aamir Iqbal v. ANF (2020 SCMR 567): Where the quantity of recovered narcotics is significantly above the threshold, the presumption of guilt is stronger and bail should not ordinarily be granted.",
        order: 5
      },
      {
        id: "jdg-005-s6",
        title: "Holding",
        content: "(i) The learned Special Judge CNS failed to apply the correct legal test under Section 51 of the CNSA, 1997. The bail order is silent on the restrictive clause and does not record any reasoning as to why the statutory bar should not apply.\n\n(ii) The recovery of 15 kg heroin, being fifteen times the threshold quantity under the Third Schedule, creates a strong presumption of guilt engaging the restrictive clause of Section 51.\n\n(iii) The grounds cited by the respondents, namely period of incarceration and completion of investigation, while relevant considerations, are not sufficient to override the statutory bar in the absence of exceptional circumstances as envisaged in Muhammad Hussain (PLD 2018 SC 678).\n\n(iv) The bail order is not well-reasoned and suffers from non-application of the mandatory statutory test.",
        order: 6
      },
      {
        id: "jdg-005-s7",
        title: "Relief",
        content: "The criminal revision is ALLOWED.\n\n1. The order dated 10.01.2024 passed by the learned Special Judge CNS, Islamabad granting bail to the respondents in Case FIR No. 15/2023 is hereby SET ASIDE and the bail is CANCELLED.\n\n2. The respondents shall surrender before the Special Judge within 7 days of this order, failing which non-bailable warrants of arrest shall be issued.\n\n3. The learned Special Judge is directed to expedite the trial and conclude it within 6 months, with day-to-day hearings.\n\n4. The Registrar of this Court shall send copy of this order to the learned Special Judge for compliance.\n\n5. The respondents' right to file fresh bail application shall not be affected by this order, subject to change in circumstances.",
        order: 7
      }
    ],
    suggestedPrecedents: [
      {
        id: "prec-017",
        caseName: "Muhammad Tanveer v. The State",
        citation: "2022 SCMR 1140",
        court: "Supreme Court of Pakistan",
        year: "2022",
        relevance: "Bail in CNSA cases requires extreme caution",
        summary: "The Supreme Court held that bail in cases under the CNSA must be considered with extreme caution, given the severity of narcotics offences and their devastating impact on society. The restrictive clause under Section 51 creates a strong presumption against bail.",
        relevanceScore: 96
      },
      {
        id: "prec-018",
        caseName: "Zafar Iqbal v. ANF",
        citation: "2019 SCMR 2008",
        court: "Supreme Court of Pakistan",
        year: "2019",
        relevance: "Section 51 statutory bar against bail",
        summary: "Section 51 of the CNSA creates a statutory bar against bail where the court finds reasonable grounds for believing the accused guilty. This bar can only be overcome in the most exceptional circumstances, and the bail granting court must record specific reasons for departing from the statutory mandate.",
        relevanceScore: 94
      },
      {
        id: "prec-019",
        caseName: "Muhammad Hussain v. The State",
        citation: "PLD 2018 SC 678",
        court: "Supreme Court of Pakistan",
        year: "2018",
        relevance: "Restrictive clause not absolute bar",
        summary: "Even restrictive clauses against bail do not create an absolute bar. In exceptional circumstances, particularly where the accused has been incarcerated for an unreasonably long period without conclusion of trial, bail may be granted as a matter of constitutional right under Article 10.",
        relevanceScore: 88
      },
      {
        id: "prec-020",
        caseName: "Aamir Iqbal v. ANF",
        citation: "2020 SCMR 567",
        court: "Supreme Court of Pakistan",
        year: "2020",
        relevance: "Quantity of narcotics strengthens presumption of guilt",
        summary: "Where the quantity of recovered narcotics significantly exceeds the threshold prescribed in the Third Schedule, the presumption of guilt under Section 51 is strengthened and bail should not ordinarily be granted.",
        relevanceScore: 91
      },
      {
        id: "prec-021",
        caseName: "Imam Bakhsh v. The State",
        citation: "2015 SCMR 1218",
        court: "Supreme Court of Pakistan",
        year: "2015",
        relevance: "Day-to-day trial in CNSA cases",
        summary: "In CNSA cases, courts are obligated to ensure expeditious trial. Where bail is cancelled, the trial court must hold day-to-day hearings and conclude the trial within a reasonable timeframe to protect the accused's right to speedy trial.",
        relevanceScore: 79
      }
    ]
  }
];

import type { LimitationArticle } from "../types";

// ============================================================
// Limitation Act 1908 — First Schedule (Selected Articles)
// Top 30+ articles commonly encountered in Pakistani legal practice
// ============================================================

export const LIMITATION_CATEGORIES = [
  "Suits for Money",
  "Suits Relating to Accounts",
  "Suits Relating to Contracts",
  "Suits Relating to Declarations",
  "Suits Relating to Decrees & Instruments",
  "Suits Relating to Immovable Property",
  "Suits Relating to Movable Property",
  "Suits Relating to Torts",
  "Suits Relating to Trusts & Trust Property",
  "Appeals",
  "Applications",
] as const;

export const LIMITATION_ARTICLES: LimitationArticle[] = [
  // --- Suits for Money ---
  {
    article: 14,
    description: "Suit for the balance due on a mutual, open, and current account",
    period: "3 years",
    periodDays: 1095,
    category: "Suits for Money",
    startPoint: "The close of the year in which the last item admitted or proved is entered in the account",
  },
  {
    article: 15,
    description: "Suit for the price of goods sold and delivered",
    period: "3 years",
    periodDays: 1095,
    category: "Suits for Money",
    startPoint: "The date of the delivery of the goods",
  },
  {
    article: 18,
    description: "Suit for money payable for money lent",
    period: "3 years",
    periodDays: 1095,
    category: "Suits for Money",
    startPoint: "When the loan is made",
  },
  {
    article: 19,
    description: "Suit for money lent under an agreement that it shall be payable on demand",
    period: "3 years",
    periodDays: 1095,
    category: "Suits for Money",
    startPoint: "When the loan is made",
  },
  {
    article: 21,
    description: "Suit for money payable by the maker of a promissory note or a bill of exchange",
    period: "3 years",
    periodDays: 1095,
    category: "Suits for Money",
    startPoint: "When the bill or note falls due",
  },
  {
    article: 22,
    description: "Suit for money deposited under an agreement that it shall be payable on demand",
    period: "3 years",
    periodDays: 1095,
    category: "Suits for Money",
    startPoint: "When the demand is made",
  },

  // --- Suits Relating to Contracts ---
  {
    article: 23,
    description: "Suit for compensation for breach of a promise or contract not in writing and not otherwise expressly provided for",
    period: "3 years",
    periodDays: 1095,
    category: "Suits Relating to Contracts",
    startPoint: "When the contract is broken, or when the breach is known to the plaintiff",
  },
  {
    article: 24,
    description: "Suit for compensation for breach of a contract in writing but not registered",
    period: "3 years",
    periodDays: 1095,
    category: "Suits Relating to Contracts",
    startPoint: "When the contract is broken, or when the breach is known to the plaintiff",
  },
  {
    article: 25,
    description: "Suit upon a single bond or other contract under seal where no time for performance is specified",
    period: "6 years",
    periodDays: 2190,
    category: "Suits Relating to Contracts",
    startPoint: "The date of the bond or contract",
  },
  {
    article: 27,
    description: "Suit for compensation for the breach of a registered contract",
    period: "6 years",
    periodDays: 2190,
    category: "Suits Relating to Contracts",
    startPoint: "When the contract is broken, or when the breach is known to the plaintiff",
  },

  // --- Suits Relating to Declarations ---
  {
    article: 42,
    description: "Suit for a declaratory decree where consequential relief is not claimed",
    period: "6 years",
    periodDays: 2190,
    category: "Suits Relating to Declarations",
    startPoint: "When the right to sue first accrues",
  },

  // --- Suits Relating to Decrees & Instruments ---
  {
    article: 43,
    description: "Suit on a decree of a civil court or an award where no time is specified",
    period: "3 years",
    periodDays: 1095,
    category: "Suits Relating to Decrees & Instruments",
    startPoint: "The date of the decree or award",
  },
  {
    article: 44,
    description: "Suit for arrears of rent",
    period: "3 years",
    periodDays: 1095,
    category: "Suits Relating to Decrees & Instruments",
    startPoint: "When the arrears become due",
  },

  // --- Suits Relating to Immovable Property ---
  {
    article: 64,
    description: "Suit for possession of immovable property based on title",
    period: "12 years",
    periodDays: 4380,
    category: "Suits Relating to Immovable Property",
    startPoint: "When the possession of the defendant becomes adverse to the plaintiff",
  },
  {
    article: 65,
    description: "Suit for possession of immovable property when the plaintiff has been dispossessed",
    period: "12 years",
    periodDays: 4380,
    category: "Suits Relating to Immovable Property",
    startPoint: "The date of dispossession",
  },
  {
    article: 67,
    description: "Suit for possession of immovable property based on previous possession (not on title), being dispossessed",
    period: "12 years",
    periodDays: 4380,
    category: "Suits Relating to Immovable Property",
    startPoint: "The date of dispossession",
  },
  {
    article: 69,
    description: "Suit to enforce a right of pre-emption",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Immovable Property",
    startPoint: "When the purchaser takes possession of the property sold or when the sale is first known to the plaintiff",
  },
  {
    article: 97,
    description: "Suit for possession of immovable property or any interest therein based on title — by the government",
    period: "30 years",
    periodDays: 10950,
    category: "Suits Relating to Immovable Property",
    startPoint: "When the possession of the defendant becomes adverse to the government",
  },

  // --- Suits Relating to Movable Property ---
  {
    article: 49,
    description: "Suit for specific movable property lost or acquired by theft, or by dishonest misappropriation or conversion",
    period: "3 years",
    periodDays: 1095,
    category: "Suits Relating to Movable Property",
    startPoint: "When the person having the right to possession first learns in whose possession the property is",
  },

  // --- Suits Relating to Torts ---
  {
    article: 1,
    description: "Suit for compensation for loss or injury caused by an act or omission not arising from contract (general tort)",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Torts",
    startPoint: "The date of the act or omission complained of",
  },
  {
    article: 2,
    description: "Suit for compensation for acts not actionable without special damage",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Torts",
    startPoint: "When the special damage results or is known to the plaintiff",
  },
  {
    article: 3,
    description: "Suit for compensation for an act not amounting to defamation or malicious prosecution",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Torts",
    startPoint: "The date of the act complained of",
  },
  {
    article: 4,
    description: "Suit for compensation for libel",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Torts",
    startPoint: "The date of the publication of the libel",
  },
  {
    article: 5,
    description: "Suit for compensation for slander",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Torts",
    startPoint: "The date when the words are spoken",
  },
  {
    article: 6,
    description: "Suit for compensation for malicious prosecution",
    period: "1 year",
    periodDays: 365,
    category: "Suits Relating to Torts",
    startPoint: "The date of acquittal or withdrawal of prosecution",
  },

  // --- Suits Relating to Trusts ---
  {
    article: 92,
    description: "Suit by the beneficiary of a trust to recover trust property wrongly transferred by trustee",
    period: "3 years",
    periodDays: 1095,
    category: "Suits Relating to Trusts & Trust Property",
    startPoint: "When the beneficiary first learns of the transfer",
  },

  // --- Appeals ---
  {
    article: 151,
    description: "Appeal from a decree or order of a civil court (to a court other than the High Court)",
    period: "30 days",
    periodDays: 30,
    category: "Appeals",
    startPoint: "The date of the decree or order",
  },
  {
    article: 152,
    description: "Appeal to the High Court from a decree or order of a court subordinate to the High Court",
    period: "90 days",
    periodDays: 90,
    category: "Appeals",
    startPoint: "The date of the decree or order",
  },
  {
    article: 156,
    description: "Memorandum of appeal to the Supreme Court",
    period: "30 days",
    periodDays: 30,
    category: "Appeals",
    startPoint: "The date of the decree or order appealed from",
  },

  // --- Applications ---
  {
    article: 181,
    description: "Application for execution of a decree or order of any civil court",
    period: "3 years",
    periodDays: 1095,
    category: "Applications",
    startPoint: "The date of the decree or order, or where the decree directs a payment of money on a specified date, when default is made",
  },
  {
    article: 182,
    description: "Application for review of judgment by a court other than the Supreme Court",
    period: "30 days",
    periodDays: 30,
    category: "Applications",
    startPoint: "The date of the decree or order",
  },
];

export function getLimitationArticle(articleNumber: number): LimitationArticle | undefined {
  return LIMITATION_ARTICLES.find((a) => a.article === articleNumber);
}

export function getLimitationArticlesByCategory(category: string): LimitationArticle[] {
  return LIMITATION_ARTICLES.filter((a) => a.category === category);
}

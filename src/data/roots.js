// ─── GRE ROOT/PREFIX/SUFFIX DATABASE ──────────────────────────────────────────
// The most high-yield roots for GRE vocabulary

export const ROOTS = [
  // ─── POSITIVE ROOTS ───
  { root: 'bene-', meaning: 'good, well', examples: ['benevolent','benefactor','benediction','benign'], category: 'Positive' },
  { root: 'eu-', meaning: 'good, well', examples: ['euphemism','eulogy','euphoria','euthanasia'], category: 'Positive' },
  { root: 'phil-', meaning: 'love', examples: ['philanthropy','philosophy','philharmonic','bibliophile'], category: 'Positive' },
  { root: 'magn-', meaning: 'great, large', examples: ['magnanimous','magnificent','magnate','magnitude'], category: 'Positive' },

  // ─── NEGATIVE ROOTS ───
  { root: 'mal-', meaning: 'bad, evil', examples: ['malevolent','malicious','malady','malfeasance'], category: 'Negative' },
  { root: 'mis-', meaning: 'bad, wrong, hate', examples: ['misanthrope','misnomer','miscreant','misogyny'], category: 'Negative' },
  { root: 'dys-', meaning: 'bad, difficult', examples: ['dysfunctional','dystopia','dyslexia','dyspeptic'], category: 'Negative' },
  { root: 'anti-', meaning: 'against', examples: ['antipathy','antithesis','antidote','antagonist'], category: 'Negative' },
  { root: 'contra-', meaning: 'against', examples: ['contradict','contravene','contrary','contrast'], category: 'Negative' },

  // ─── SPEECH/WORDS ───
  { root: 'loqu-/locu-', meaning: 'speak', examples: ['loquacious','eloquent','colloquial','circumlocution'], category: 'Speech' },
  { root: 'dict-', meaning: 'say, speak', examples: ['dictate','contradict','benediction','edict'], category: 'Speech' },
  { root: 'voc-/vok-', meaning: 'call, voice', examples: ['vociferous','evocative','provoke','equivocate'], category: 'Speech' },
  { root: 'tacit-', meaning: 'silent', examples: ['taciturn','tacit','reticent'], category: 'Speech' },

  // ─── MIND/KNOWLEDGE ───
  { root: 'cogn-', meaning: 'know', examples: ['cognizant','incognito','recognize','cognoscenti'], category: 'Mind' },
  { root: 'sci-', meaning: 'know', examples: ['prescient','omniscient','conscious','nescient'], category: 'Mind' },
  { root: 'cred-', meaning: 'believe', examples: ['credulous','incredulous','credible','creed'], category: 'Mind' },
  { root: 'soph-', meaning: 'wisdom', examples: ['sophisticated','philosophy','sophomore','sophistry'], category: 'Mind' },

  // ─── FEELING/EMOTION ───
  { root: 'path-', meaning: 'feeling, suffering', examples: ['apathy','empathy','antipathy','pathology'], category: 'Feeling' },
  { root: 'anim-', meaning: 'spirit, life', examples: ['animosity','magnanimous','equanimity','pusillanimous'], category: 'Feeling' },
  { root: 'ferv-', meaning: 'boil, intense', examples: ['fervent','fervid','effervescent'], category: 'Feeling' },

  // ─── SIZE/AMOUNT ───
  { root: 'micro-', meaning: 'small', examples: ['microscopic','microcosm','microbe'], category: 'Size' },
  { root: 'macro-', meaning: 'large', examples: ['macrocosm','macroscopic','macroeconomics'], category: 'Size' },
  { root: 'poly-', meaning: 'many', examples: ['polyglot','polygamous','polymath','polyphony'], category: 'Size' },
  { root: 'pauci-/pau-', meaning: 'few, little', examples: ['paucity','pauper','pauperize'], category: 'Size' },
  { root: 'omni-', meaning: 'all', examples: ['omniscient','omnipotent','omnipresent','omnivorous'], category: 'Size' },

  // ─── MOVEMENT/CHANGE ───
  { root: 'vert-/vers-', meaning: 'turn', examples: ['aversion','divert','subvert','revert','perverse'], category: 'Change' },
  { root: 'mut-', meaning: 'change', examples: ['immutable','mutation','transmute','commute'], category: 'Change' },
  { root: 'grad-/gress-', meaning: 'step, go', examples: ['transgression','digress','regress','egress'], category: 'Change' },
  { root: 'ced-/cess-', meaning: 'go, yield', examples: ['precede','concede','accession','precedent'], category: 'Change' },

  // ─── POWER/RULE ───
  { root: 'arch-', meaning: 'rule, chief', examples: ['anarchy','monarchy','oligarchy','archetype'], category: 'Power' },
  { root: 'crat-/cracy-', meaning: 'rule, power', examples: ['autocrat','bureaucracy','democracy','plutocracy'], category: 'Power' },
  { root: 'reg-', meaning: 'rule, straight', examples: ['regal','regimen','regulate','deregulate'], category: 'Power' },

  // ─── CRITICAL PREFIXES ───
  { root: 'a-/an-', meaning: 'without, not', examples: ['apathy','anarchy','amoral','atypical','anachronism'], category: 'Prefix' },
  { root: 'circum-', meaning: 'around', examples: ['circumscribe','circumvent','circumlocution','circumspect'], category: 'Prefix' },
  { root: 'ex-/e-', meaning: 'out of, from', examples: ['extricate','expatriate','exonerate','effusive'], category: 'Prefix' },
  { root: 'in-/im-', meaning: 'not (or into)', examples: ['implacable','indelible','intractable','immutable'], category: 'Prefix' },
  { root: 'pre-', meaning: 'before', examples: ['prescient','precursor','precedent','preempt'], category: 'Prefix' },
  { root: 'ob-', meaning: 'against, in the way', examples: ['obdurate','obstreperous','obsequious','obstinate'], category: 'Prefix' },
  { root: 'per-', meaning: 'through, completely', examples: ['pervasive','perfunctory','pernicious','perspicacious'], category: 'Prefix' },
  { root: 'pro-', meaning: 'forward, for', examples: ['prodigious','profligate','propitious','proliferate'], category: 'Prefix' },
  { root: 'sub-', meaning: 'under, below', examples: ['subvert','subtle','subordinate','subjugate'], category: 'Prefix' },
];

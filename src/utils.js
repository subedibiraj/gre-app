import C from './theme';

export const norm = s => s.trim().toUpperCase().replace(/[^A-Z]/g, '');
export const chk = (inp, ans) => norm(inp) === norm(ans);

export const clusterColor = cl => {
  const map = {
    // Days 1-7 originals
    Quiet: C.blue, Talkative: '#E4A060', Wordy: '#9B6BDB', Brief: '#4CAF9C',
    Loud: '#E4A060', Sharp: C.green, Gentle: '#4CAF9C', Sharp2: C.gold,
    Harsh: C.gold, Savage: C.red,
    Liar: C.red, Evader: '#E4A060', Manipulator: '#9B6BDB',
    Logic: C.blue, Betrayer: C.red, Antonym: C.greenBr, Genuine: C.green,
    Formal: C.blue, Excessive: C.red, Sincere: C.green,
    Stubborn: '#E4A060', Aggressive: C.red, Moody: '#9B6BDB', Lone: C.textMid,
    Generous: C.green, 'Brave/Wise': C.blue, Sociable: '#4CAF9C',
    Arrogant: C.red, Bold: C.gold, Cautious: C.blue, Restrained: '#4CAF9C',
    Bonus: C.green,

    // Days 8+ clusters
    Careful: C.blue, Economical: '#4CAF9C', Change: '#E4A060',
    Support: C.green, Opposition: C.red,
    Clarity: C.greenBr, Obscurity: '#9B6BDB',
    Excess: C.red, Lack: '#E4A060',
    Intellectual: C.blue, Emotional: '#9B6BDB',
    Proof: C.greenBr, Argument: C.blue,
    Money: C.gold, Art: '#E4A060',
    Vice: C.red, Virtue: C.green,
    Power: C.gold, Conformity: C.blue, Dissent: C.red,
    Important: C.gold, Trivial: C.textMid,
    Speed: '#4CAF9C', Conflict: C.red, Peace: C.green, Resolution: C.greenBr,
    Rhetoric: '#E4A060', Illusion: '#9B6BDB', Reality: C.greenBr,

    // Days 31-40 clusters
    'Sharp Writing': C.greenBr, 'Inflated Writing': C.red,
    Unfocused: '#9B6BDB', Concise: '#4CAF9C', Biased: C.red,
    Foreknowledge: C.gold, Wisdom: C.blue, Learning: C.blue,
    Awareness: C.greenBr, Unawareness: '#9B6BDB',
    Ignorance: C.red, Memory: '#4CAF9C', Forgetting: C.textMid,
    Remnant: '#E4A060', Fleeting: C.textMid, Time: C.gold,
    Evidence: C.greenBr, Beginning: C.green, Weaken: C.red,
    Grow: C.greenBr, Transform: '#E4A060', Decay: C.red,
    Enduring: C.gold, Rigidity: '#9B6BDB',
    Dominance: C.red, 'Power Structure': C.gold,
    Leadership: '#E4A060', Resistance: C.red,
    Rights: C.greenBr, Values: C.blue,
    Institutions: C.textMid, Agreement: C.green,
    Practical: C.blue, Profitable: C.gold, Risk: '#E4A060',
    'Financial Health': C.green, Greed: C.red,
    Poverty: C.textMid, Waste: C.red, Wise: C.blue,
    Severe: '#E4A060', 'Self-Interest': C.red,
    Urge: C.gold, Beg: '#4CAF9C', Persuasion: C.blue,
    'Figures of Speech': '#9B6BDB', 'Empty Speech': C.textMid,
    'Harsh Speech': C.red, 'Evasive Speech': '#E4A060',
    'Large/Remarkable': C.gold, 'Small/Unimportant': C.textMid,
    Majority: C.blue, Supreme: C.gold, Notable: C.greenBr,
    Edge: C.textMid, 'Trap Pair': C.red,
    Attitude: C.blue, Tone: '#E4A060', Skepticism: '#9B6BDB',
    Objectivity: C.greenBr, Bias: C.red, Qualification: C.gold,
    Reasoning: C.blue,
    Praise: C.green, Criticize: C.red, Speech: C.blue,
    Deception: '#9B6BDB', Character: C.gold, Mood: '#4CAF9C',
    TRAP: C.red,

    // Roots categories
    Positive: C.greenBr, Negative: C.red, Mind: C.blue,
    Feeling: '#9B6BDB', Size: C.gold, Truth: C.greenBr,
    Prefix: C.blue, Suffix: '#4CAF9C',
  };
  return map[cl] || C.gold;
};

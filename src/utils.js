import C from './theme';

export const norm = s => s.trim().toUpperCase().replace(/[^A-Z]/g,'');
export const chk  = (inp, ans) => norm(inp) === norm(ans);

export const clusterColor = cl => {
  const map = {
    Quiet:C.blue, Loud:'#E4A060', Wordy:'#9B6BDB', Sharp:C.green,
    Gentle:'#4CAF9C', Sharp2:C.gold, Harsh:C.gold, Savage:C.red,
    Liar:C.red, Evader:'#E4A060', Manipulator:'#9B6BDB', Logic:C.blue, Betrayer:C.red, Bonus:C.green,
    Genuine:C.green, Formal:C.blue, Excessive:C.red,
    Stubborn:'#E4A060', Aggressive:C.red, Moody:'#9B6BDB', Lone:C.textMid,
    Generous:C.green, 'Brave/Wise':C.blue, Sociable:'#4CAF9C',
    Arrogant:C.red, Bold:C.gold,
  };
  return map[cl] || C.gold;
};

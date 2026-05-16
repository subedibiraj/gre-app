// ─── GRE QUANT CONCEPT LESSONS ────────────────────────────────────────────────
// Each concept has: explanation, worked examples, GRE tricks, traps, frequency

export const CONCEPTS = {
  arithmetic: [
    {
      title: 'Number Properties & Divisibility',
      freq: 'Very High',
      core: 'Integers, even/odd rules, divisibility tests, remainders. GRE loves testing whether you ASSUME positivity or integrality.',
      rules: [
        'Even ± Even = Even, Odd ± Odd = Even, Even ± Odd = Odd',
        'Even × anything = Even, Odd × Odd = Odd',
        'Zero is even, neither positive nor negative',
        'Negative × Negative = Positive',
      ],
      examples: [
        { q: 'If n is an integer and n² is even, what must be true about n?', work: 'If n were odd, n² = odd×odd = odd. But n² is even. So n must be even.', ans: 'n is even', trick: 'Don\'t just test one case — prove by contradiction.' },
        { q: 'What is the remainder when 2⁴⁰ is divided by 3?', work: '2¹=2 (rem 2), 2²=4 (rem 1), 2³=8 (rem 2), 2⁴=16 (rem 1). Pattern: rem cycles 2,1,2,1... Even powers → rem 1.', ans: '1', trick: 'Find the remainder CYCLE. Powers of 2 mod 3 cycle every 2.' },
        { q: 'If x is a positive integer and 12x is a perfect square, what is the least value of x?', work: '12x = 2²×3×x. For a perfect square, all prime factors need even exponents. 3 has exponent 1, so x must supply another 3. Minimum x = 3.', ans: '3', trick: 'Factor into primes, then make all exponents even.' },
      ],
      traps: ['Forgetting that 0 is an integer and is even', 'Assuming "number" means "positive integer" — it could be negative, zero, or a fraction'],
    },
    {
      title: 'Fractions, Decimals & Percentages',
      freq: 'Very High',
      core: 'Converting between forms, comparing fractions, percent change. The GRE tests your speed with these — learn shortcuts.',
      rules: [
        'Percent change = (New-Old)/Old × 100, always divide by ORIGINAL',
        'Successive % changes: multiply the multipliers (1.1 × 0.9 = 0.99, not 1.0)',
        'To compare fractions: cross-multiply. a/b vs c/d → compare ad vs bc',
        'x% of y = y% of x (e.g., 8% of 25 = 25% of 8 = 2)',
      ],
      examples: [
        { q: 'A price increases by 20% then decreases by 20%. What is the net change?', work: '100 × 1.20 = 120. Then 120 × 0.80 = 96. Net change = -4%.', ans: '-4% (net decrease)', trick: 'Successive % changes: multiply multipliers. 1.2 × 0.8 = 0.96, NOT back to 1.0.' },
        { q: 'Which is greater: 7/11 or 5/8?', work: 'Cross multiply: 7×8 = 56 vs 5×11 = 55. Since 56 > 55, 7/11 > 5/8.', ans: '7/11', trick: 'Cross-multiply to compare fractions instantly.' },
        { q: 'What is 35% of 80?', work: '35% of 80 = 80% of 35 = 0.8 × 35 = 28. (Swap trick: x% of y = y% of x)', ans: '28', trick: 'Always swap if one direction is easier to compute mentally.' },
      ],
      traps: ['Thinking +20% then -20% = 0% change', 'Dividing by the NEW value instead of the OLD for percent change'],
    },
    {
      title: 'Ratios & Proportions',
      freq: 'High',
      core: 'Ratios, direct/inverse proportion, mixtures. Think of ratios as MULTIPLIERS of an unknown unit.',
      rules: [
        'Ratio a:b means a=kx, b=ky for some multiplier k',
        'Part/Whole = Part/(Sum of ratio parts)',
        'Direct proportion: y = kx. Inverse: y = k/x',
        'Weighted average: closer to the value with more weight',
      ],
      examples: [
        { q: 'Boys and girls in a class are in ratio 3:5. If there are 40 students, how many boys?', work: 'Total parts = 3+5 = 8. Each part = 40/8 = 5. Boys = 3×5 = 15.', ans: '15', trick: 'Ratio parts × multiplier = actual counts.' },
        { q: 'Mix 4L of 20% salt with 6L of 50% salt. What % is the mixture?', work: 'Salt = 4×0.20 + 6×0.50 = 0.8 + 3.0 = 3.8L. Total = 10L. Concentration = 38%.', ans: '38%', trick: 'Total solute / Total solution. Never average the percentages directly.' },
      ],
      traps: ['Averaging percentages without weighting by quantity', 'Confusing part-to-part ratio with part-to-whole'],
    },
    {
      title: 'Exponents & Roots',
      freq: 'High',
      core: 'Exponent rules, simplifying radicals, fractional exponents. GRE loves testing whether you know 0 < x < 1 behavior.',
      rules: [
        'a^m × a^n = a^(m+n), a^m / a^n = a^(m-n)',
        '(a^m)^n = a^(mn), (ab)^n = a^n × b^n',
        'a^0 = 1 (for a≠0), a^(-n) = 1/a^n',
        'a^(1/n) = ⁿ√a, a^(m/n) = (ⁿ√a)^m',
        'If 0 < x < 1: x² < x < √x',
      ],
      examples: [
        { q: 'Simplify: (2^15 - 2^14) / 2^14', work: 'Factor: 2^14(2-1) / 2^14 = 1.', ans: '1', trick: 'Factor out the SMALLER power. This is a classic GRE move.' },
        { q: 'If 0 < x < 1, rank: x, x², x³, √x', work: 'Try x=0.5: √0.5≈0.71, x=0.5, x²=0.25, x³=0.125. Order: √x > x > x² > x³.', ans: '√x > x > x² > x³', trick: 'For 0<x<1, higher powers make it SMALLER, roots make it LARGER. Opposite of x>1.' },
      ],
      traps: ['Thinking x² > x always (fails for 0 < x < 1)', 'Forgetting that (-2)^2 = 4 but -2^2 = -4 (order of operations)'],
    },
  ],

  algebra: [
    {
      title: 'Linear Equations & Inequalities',
      freq: 'Very High',
      core: 'Solving for unknowns, systems, inequality rules. #1 GRE algebra topic.',
      rules: [
        'When multiplying/dividing inequality by negative → FLIP the sign',
        '|x| < a means -a < x < a. |x| > a means x < -a OR x > a',
        'System with 2 equations, 2 unknowns: substitution or elimination',
        'If asked for an EXPRESSION (like 3x+2y), you may not need individual values',
      ],
      examples: [
        { q: 'If 3x + 5 > 2x - 1, and x is an integer, what is the smallest value of x?', work: '3x + 5 > 2x - 1 → x > -6. Smallest integer > -6 is -5.', ans: '-5', trick: 'Solve the inequality first, then find the integer boundary.' },
        { q: 'If 2x + 3y = 12 and 4x + 6y = ?', work: 'The second equation is exactly 2× the first. So 4x + 6y = 2(2x+3y) = 24.', ans: '24', trick: 'Look for MULTIPLES of given equations. GRE often tests this — you don\'t need x or y individually.' },
        { q: 'If |2x - 3| = 7, what are the values of x?', work: 'Case 1: 2x-3=7 → x=5. Case 2: 2x-3=-7 → x=-2.', ans: 'x = 5 or x = -2', trick: 'Always split absolute value into two cases.' },
      ],
      traps: ['Forgetting to flip inequality when multiplying by negative', 'Solving for individual variables when the question asks for an expression'],
    },
    {
      title: 'Quadratic Equations',
      freq: 'High',
      core: 'Factoring, quadratic formula, sum/product of roots. The GRE favors factoring over formula.',
      rules: [
        'ax² + bx + c = 0: roots sum = -b/a, roots product = c/a',
        'Discriminant b²-4ac: >0 → 2 real roots, =0 → 1 root, <0 → no real roots',
        'Difference of squares: a²-b² = (a+b)(a-b) — VERY common on GRE',
        'Perfect square: (a+b)² = a²+2ab+b²',
      ],
      examples: [
        { q: 'What is 997 × 1003?', work: 'This is (1000-3)(1000+3) = 1000² - 3² = 1,000,000 - 9 = 999,991.', ans: '999,991', trick: 'Difference of squares shortcut. Whenever you see (x-a)(x+a), use it.' },
        { q: 'If x² - 5x + 6 = 0, what is x² + 1/x²? (x > 0)', work: 'Factor: (x-2)(x-3)=0 → x=2 or x=3. If x=2: 4+1/4=17/4. If x=3: 9+1/9=82/9.', ans: 'Depends on which root', trick: 'Factor first, test both roots.' },
      ],
      traps: ['Forgetting ± when taking square roots of both sides', 'Canceling x from both sides of x²=5x (losing the x=0 solution)'],
    },
    {
      title: 'Word Problems (Rate, Work, Mixture)',
      freq: 'Very High',
      core: 'Translation of words to equations. Rate×Time=Distance, Rate×Time=Work.',
      rules: [
        'Rate × Time = Distance (or Work)',
        'Combined work: 1/T = 1/A + 1/B (A,B = individual times)',
        'Average speed = Total distance / Total time (NOT average of speeds)',
        'Relative speed: same direction = subtract, opposite = add',
      ],
      examples: [
        { q: 'A can do a job in 6 hours, B in 12 hours. How long working together?', work: 'Combined rate: 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4. Time = 4 hours.', ans: '4 hours', trick: 'Add the rates (1/time), then flip back to get time.' },
        { q: 'Driving 60mph for 2hr, then 40mph for 3hr. Average speed?', work: 'Total dist = 120+120 = 240mi. Total time = 5hr. Avg speed = 240/5 = 48mph.', ans: '48 mph (not 50!)', trick: 'NEVER average the speeds. Always use total distance / total time.' },
      ],
      traps: ['Averaging speeds instead of using total distance/total time', 'Forgetting to convert units (minutes to hours, etc.)'],
    },
  ],

  geometry: [
    {
      title: 'Triangles & Pythagorean Theorem',
      freq: 'Very High',
      core: 'Triangle properties, special triangles, area. The most tested geometry topic.',
      rules: [
        'Angles sum to 180°. Exterior angle = sum of remote interior angles.',
        'Triangle inequality: |a-b| < c < a+b for any side c',
        'Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25 (and multiples)',
        '45-45-90: sides s, s, s√2. 30-60-90: sides s, s√3, 2s',
        'Area = ½ × base × height (height MUST be perpendicular)',
      ],
      examples: [
        { q: 'A right triangle has legs 6 and 8. What is the hypotenuse?', work: '6-8-? is a multiple of 3-4-5 (×2). Hypotenuse = 10. (Or: √(36+64) = √100 = 10)', ans: '10', trick: 'Recognize Pythagorean triples instantly. 3-4-5 family: 6-8-10, 9-12-15, 12-16-20.' },
        { q: 'An equilateral triangle has side 6. What is its area?', work: 'Equilateral = two 30-60-90 triangles. Height = 3√3. Area = ½×6×3√3 = 9√3.', ans: '9√3', trick: 'Equilateral triangle area = (s²√3)/4. Memorize this formula.' },
        { q: 'Can a triangle have sides 3, 7, and 11?', work: 'Check: 3+7=10 < 11. The sum of two sides must EXCEED the third. No triangle.', ans: 'No', trick: 'Triangle inequality: the two shorter sides must sum to MORE than the longest.' },
      ],
      traps: ['Assuming diagrams are drawn to scale (they are NOT on the GRE)', 'Using the slant side as the height instead of the perpendicular'],
    },
    {
      title: 'Circles',
      freq: 'High',
      core: 'Area, circumference, arcs, sectors, inscribed angles.',
      rules: [
        'Area = πr², Circumference = 2πr',
        'Arc length = (θ/360)×2πr, Sector area = (θ/360)×πr²',
        'Central angle = arc, Inscribed angle = ½ arc',
        'Tangent line ⊥ radius at point of tangency',
      ],
      examples: [
        { q: 'A circle has area 49π. What is its circumference?', work: 'πr² = 49π → r=7. Circumference = 2π(7) = 14π.', ans: '14π', trick: 'Extract r from area, then plug into circumference. Two-step pattern.' },
        { q: 'A 60° sector of a circle with radius 6. What is the arc length?', work: '(60/360)×2π(6) = (1/6)×12π = 2π.', ans: '2π', trick: 'Sector = fraction of the full circle. Fraction = angle/360.' },
      ],
      traps: ['Confusing radius and diameter (area uses r, not d)', 'Forgetting inscribed angle is HALF the central angle'],
    },
    {
      title: 'Coordinate Geometry',
      freq: 'High',
      core: 'Slope, distance, midpoint, line equations, area on coordinate plane.',
      rules: [
        'Slope = rise/run = (y2-y1)/(x2-x1)',
        'Parallel lines: same slope. Perpendicular: slopes multiply to -1',
        'Distance = √((x2-x1)²+(y2-y1)²)',
        'Midpoint = ((x1+x2)/2, (y1+y2)/2)',
      ],
      examples: [
        { q: 'Line passes through (2,3) and (6,11). What is its slope?', work: 'm = (11-3)/(6-2) = 8/4 = 2.', ans: '2', trick: 'Rise over run. Always subtract in the same order.' },
        { q: 'A line has slope 3 and passes through (1,5). What is the y-intercept?', work: 'y = mx + b → 5 = 3(1) + b → b = 2. Line: y = 3x + 2.', ans: 'b = 2', trick: 'Plug the known point into y=mx+b to find b.' },
      ],
      traps: ['Subtracting coordinates in different order (inconsistent signs)', 'Forgetting vertical lines have undefined slope (not 0)'],
    },
  ],

  data: [
    {
      title: 'Mean, Median, Mode & Range',
      freq: 'Very High',
      core: 'Central tendency and spread. GRE loves testing how ADDING or REMOVING values affects these.',
      rules: [
        'Mean = Sum/Count → Sum = Mean × Count (use this form!)',
        'Median: middle value when sorted. Even count = average of two middle values',
        'Adding a value equal to the mean doesn\'t change the mean',
        'Range = Max - Min. Affected by outliers.',
      ],
      examples: [
        { q: 'The average of 5 numbers is 20. What is their sum?', work: 'Sum = Mean × Count = 20 × 5 = 100.', ans: '100', trick: 'Always convert "average of n things is x" to "sum = nx". This unlocks most mean problems.' },
        { q: 'Set: {3, 7, 7, 10, 13}. If 13 is replaced by 23, what changes?', work: 'Mean changes (sum increases by 10). Median stays 7 (middle unchanged). Mode stays 7. Range increases from 10 to 20.', ans: 'Mean and Range change; Median and Mode don\'t', trick: 'Check each stat independently. Changing an extreme value affects mean and range but often not median.' },
      ],
      traps: ['Confusing mean and median behavior when adding outliers', 'Forgetting median of even count is the AVERAGE of two middle values'],
    },
    {
      title: 'Probability',
      freq: 'High',
      core: 'Basic probability, complement rule, "at least one" problems.',
      rules: [
        'P(A) = favorable / total, always between 0 and 1',
        'P(not A) = 1 - P(A) — the complement trick',
        '"At least one" = 1 - P(none) — ALWAYS use complement',
        'Independent events: P(A and B) = P(A) × P(B)',
        'Mutually exclusive: P(A or B) = P(A) + P(B)',
      ],
      examples: [
        { q: 'Flip a coin 3 times. Probability of at least one head?', work: 'P(no heads) = (1/2)³ = 1/8. P(at least one head) = 1 - 1/8 = 7/8.', ans: '7/8', trick: '"At least one" = complement of "none". NEVER count cases individually.' },
        { q: 'Bag has 3 red, 5 blue. Pick 2 without replacement. P(both red)?', work: 'P(1st red) = 3/8. P(2nd red|1st red) = 2/7. P(both) = 3/8 × 2/7 = 6/56 = 3/28.', ans: '3/28', trick: 'Without replacement: denominator decreases by 1 each time.' },
      ],
      traps: ['Using "with replacement" logic for "without replacement" problems', 'Confusing "at least one" with "exactly one"'],
    },
    {
      title: 'Counting: Permutations & Combinations',
      freq: 'Medium',
      core: 'Order matters = permutation. Order doesn\'t matter = combination.',
      rules: [
        'Permutation: nPr = n!/(n-r)! — arrangements, order matters',
        'Combination: nCr = n!/(r!(n-r)!) — selections, order doesn\'t matter',
        'Keyword test: "arrange", "order", "rank" → permutation. "choose", "select", "group" → combination',
        'With repetition: n^r (r picks from n options with replacement)',
      ],
      examples: [
        { q: 'How many ways to choose 3 people from 8 for a committee?', work: 'Committee = no order → combination. 8C3 = 8!/(3!5!) = (8×7×6)/(3×2×1) = 56.', ans: '56', trick: 'Committee/group = combination. Lineup/ranking = permutation.' },
        { q: 'How many 4-digit PINs using digits 0-9 (repetition allowed)?', work: '10 choices per digit, 4 digits = 10⁴ = 10,000.', ans: '10,000', trick: 'With repetition: multiply choices. Without: permutation.' },
      ],
      traps: ['Using permutation when combination is needed (or vice versa)', 'Forgetting to account for identical items in arrangements'],
    },
    {
      title: 'Data Interpretation (Graphs & Tables)',
      freq: 'Very High',
      core: 'Read charts accurately. GRE uses bar charts, line graphs, pie charts, tables.',
      rules: [
        'Always check axis labels, units, and scale FIRST',
        'Pie chart: each slice = percentage × total',
        '"Approximately" means you can estimate — don\'t waste time on exact calc',
        'Percent change between bars: (new-old)/old × 100',
      ],
      examples: [
        { q: 'Bar chart shows 2019: $40M, 2020: $52M. What is the percent increase?', work: '(52-40)/40 × 100 = 12/40 × 100 = 30%.', ans: '30%', trick: 'Always divide by the EARLIER value for percent change.' },
        { q: 'Pie chart: 200 students. "Science" slice is 72°. How many study science?', work: '72/360 = 1/5 of total. 200 × 1/5 = 40 students.', ans: '40', trick: 'Degrees/360 = fraction of total. Or: every 3.6° = 1%.' },
      ],
      traps: ['Misreading axis scales (especially if they don\'t start at 0)', 'Using the wrong base for percent calculations'],
    },
  ],
};

// ─── GRE QUANT STRATEGIES (170-level) ─────────────────────────────────────────
export const STRATEGIES = [
  {
    name: 'Plug In Numbers',
    when: 'Variables in answer choices, or "must be true" questions',
    how: 'Pick SMART numbers: try 2, 3, 0, -1, 1/2. Test all answer choices.',
    example: 'Q: If x > 0, which is greatest? A) x  B) x²  C) √x  D) 1/x  E) Cannot determine\nTry x=2: A=2, B=4, C=1.4, D=0.5 → B wins.\nTry x=0.5: A=0.5, B=0.25, C=0.71, D=2 → D wins.\nAnswer: E (Cannot determine)',
    level: '170 essential',
  },
  {
    name: 'Back-Solve from Answers',
    when: 'Numeric answer choices, especially "what value of x..."',
    how: 'Start with choice C (middle value). If too big, go smaller; too small, go bigger.',
    example: 'Q: If x² - 5x + 6 = 0, x = ? Options: A)1 B)2 C)3 D)4 E)5\nTry C (x=3): 9-15+6=0 ✓. Done in one step.',
    level: '170 essential',
  },
  {
    name: 'QC: Simplify Both Sides',
    when: 'Quantitative Comparison — always simplify before comparing',
    how: 'Add/subtract the same thing from both quantities. Factor. Cancel common terms.',
    example: 'Qty A: 3x+7  Qty B: 3x+5\nSubtract 3x from both → compare 7 vs 5. A is greater. (No matter what x is!)',
    level: '170 essential',
  },
  {
    name: 'QC: Test Edge Cases',
    when: 'QC with variables — test positives, negatives, zero, fractions',
    how: 'MUST test: positive integer, negative, 0, fraction (0<x<1), 1, -1.',
    example: 'Qty A: x²  Qty B: x\nTest x=2: A=4>2=B ✓. Test x=0.5: A=0.25<0.5=B. DIFFERENT results → D (Cannot determine).',
    level: '170 essential',
  },
  {
    name: 'Estimation',
    when: '"Approximately" in the question, or answer choices are spread apart',
    how: 'Round numbers to make mental math easy. 49% ≈ 50%, √48 ≈ 7.',
    example: 'Q: What is 48% of 612? Estimate: 50% of 600 = 300. (Actual: 293.76). Pick closest.',
    level: 'Time saver',
  },
  {
    name: 'Number Properties for QC',
    when: 'QC asking about even/odd, positive/negative outcomes',
    how: 'Don\'t solve — use properties. Even+Even=Even, Neg×Neg=Pos, etc.',
    example: 'Qty A: (-3)⁴  Qty B: (-3)⁵\nEven power of negative = positive. Odd power = negative. Positive > Negative → A.',
    level: '165+',
  },
];

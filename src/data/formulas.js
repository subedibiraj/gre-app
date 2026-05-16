// ─── GRE QUANT FORMULA REFERENCE (170-LEVEL COMPLETE) ─────────────────────────
// Uses Unicode superscripts/subscripts for clean rendering

export const FORMULAS = [
  // ─── ARITHMETIC ───
  {
    category: 'Arithmetic',
    formulas: [
      { name: 'Percent Change', formula: '((New − Old) / Old) × 100', note: 'Always divide by the ORIGINAL value. A 50% increase then 50% decrease ≠ original.' },
      { name: 'Successive % Change', formula: 'Multiply multipliers: (1+r₁)(1+r₂)', note: '20% up then 20% down: 1.2 × 0.8 = 0.96 = 4% net decrease.' },
      { name: 'Percent of a Number', formula: 'Part = (Percent/100) × Whole', note: '"is" = equals, "of" = multiply, "what" = x. Also: x% of y = y% of x.' },
      { name: 'Profit/Loss %', formula: '((Selling − Cost) / Cost) × 100', note: 'Always divide by Cost Price, not Selling Price.' },
      { name: 'Simple Interest', formula: 'I = P × r × t', note: 'P = principal, r = annual rate (decimal), t = time in years.' },
      { name: 'Compound Interest', formula: 'A = P(1 + r/n)ⁿᵗ', note: 'n = compounds per year. Annual: n=1, Monthly: n=12.' },
      { name: 'Exponent Rules', formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ   aᵐ ÷ aⁿ = aᵐ⁻ⁿ   (aᵐ)ⁿ = aᵐⁿ', note: 'a⁰ = 1 (a≠0). a⁻ⁿ = 1/aⁿ. (ab)ⁿ = aⁿbⁿ.' },
      { name: 'Root Rules', formula: '√(ab) = √a × √b   √(a/b) = √a / √b', note: 'a¹ᐟⁿ = ⁿ√a. For 0<x<1: x² < x < √x.' },
      { name: 'Divisibility Tests', formula: '2: even  3: digit sum÷3  5: ends 0,5  9: digit sum÷9', note: '4: last 2 digits÷4. 6: divisible by both 2 and 3. 8: last 3 digits÷8.' },
      { name: 'Number of Factors', formula: 'N = p₁ᵃ × p₂ᵇ → (a+1)(b+1) factors', note: 'Prime factorize first. Example: 12 = 2² × 3¹ → 3×2 = 6 factors.' },
      { name: 'LCM & GCF', formula: 'LCM(a,b) × GCF(a,b) = a × b', note: 'LCM = smallest common multiple. GCF = largest common factor. LCM ≥ max.' },
      { name: 'Average (Mean)', formula: 'Mean = Sum / Count  →  Sum = Mean × Count', note: 'ALWAYS convert to Sum form. "Average of 5 numbers is 20" means Sum=100.' },
      { name: 'Weighted Average', formula: '(w₁v₁ + w₂v₂) / (w₁ + w₂)', note: 'Result is CLOSER to the value with more weight. Never just average %s.' },
      { name: 'Even/Odd Rules', formula: 'E±E=E  O±O=E  E±O=O  E×any=E  O×O=O', note: 'Zero is EVEN. Negative numbers follow the same even/odd rules.' },
      { name: 'Remainder Pattern', formula: 'For cycles: find pattern length, then use mod', note: 'Powers of 2 mod 3 cycle: 2,1,2,1... Last digit cycles: check last digit patterns.' },
    ]
  },

  // ─── ALGEBRA ───
  {
    category: 'Algebra',
    formulas: [
      { name: 'Slope', formula: 'm = (y₂ − y₁) / (x₂ − x₁)', note: 'Positive=uphill, Negative=downhill, 0=flat, Undefined=vertical.' },
      { name: 'Slope-Intercept Form', formula: 'y = mx + b', note: 'm = slope, b = y-intercept. Parallel lines: same m. Perpendicular: m₁ × m₂ = −1.' },
      { name: 'Point-Slope Form', formula: 'y − y₁ = m(x − x₁)', note: 'Use when you have a point and slope. Convert to y=mx+b for comparisons.' },
      { name: 'Distance Formula', formula: 'd = √((x₂−x₁)² + (y₂−y₁)²)', note: 'Pythagorean theorem on the coordinate plane. Sometimes faster to count grid squares.' },
      { name: 'Midpoint', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', note: 'Average of x-coordinates, average of y-coordinates.' },
      { name: 'Quadratic Formula', formula: 'x = (−b ± √(b²−4ac)) / 2a', note: 'Discriminant: b²−4ac > 0 = 2 roots, = 0 = 1 root, < 0 = no real roots.' },
      { name: 'Sum & Product of Roots', formula: 'Sum = −b/a    Product = c/a', note: 'For ax² + bx + c = 0. Often faster than solving the full quadratic.' },
      { name: 'Difference of Squares', formula: 'a² − b² = (a+b)(a−b)', note: 'VERY common! 997×1003 = (1000−3)(1000+3) = 1000² − 9 = 999,991.' },
      { name: 'Perfect Square', formula: '(a±b)² = a² ± 2ab + b²', note: 'Don\'t forget the middle term 2ab! (x+3)² = x² + 6x + 9, NOT x² + 9.' },
      { name: 'Absolute Value', formula: '|x| < a → −a < x < a   |x| > a → x < −a or x > a', note: 'Split into two cases when solving. |x−3| = distance from x to 3.' },
      { name: 'Rate × Time = Distance', formula: 'D = R × T   →   R = D/T   →   T = D/R', note: 'Also: Work = Rate × Time. Average speed = Total Distance / Total Time.' },
      { name: 'Combined Work Rate', formula: '1/T = 1/A + 1/B', note: 'A,B = individual times. Together always faster than the faster worker alone.' },
      { name: 'Mixture Formula', formula: 'C₁V₁ + C₂V₂ = C_f(V₁+V₂)', note: 'C = concentration, V = volume. Final concentration is between C₁ and C₂.' },
      { name: 'Inequality Flip Rule', formula: 'Multiply/divide by negative → FLIP sign', note: '−2x > 6 → x < −3. Never multiply/divide by variable unless you know its sign!' },
      { name: 'Function Notation', formula: 'f(x) = expression. f(a) = plug in a for x', note: 'f(x+1) ≠ f(x) + 1. f(2x) ≠ 2f(x). Always substitute fully.' },
    ]
  },

  // ─── GEOMETRY ───
  {
    category: 'Geometry',
    formulas: [
      { name: 'Triangle Area', formula: 'A = ½ × base × height', note: 'Height MUST be perpendicular to base. Can use any side as base.' },
      { name: 'Equilateral Triangle Area', formula: 'A = (s²√3) / 4', note: 'All sides equal. Height = s√3/2. All angles = 60°.' },
      { name: 'Pythagorean Theorem', formula: 'a² + b² = c² (c = hypotenuse)', note: 'ONLY for right triangles. c is always the longest side.' },
      { name: 'Pythagorean Triples', formula: '3-4-5   5-12-13   8-15-17   7-24-25', note: 'And all multiples! 6-8-10, 9-12-15, 10-24-26, etc.' },
      { name: '45-45-90 Triangle', formula: 'Sides: s, s, s√2', note: 'Legs equal. Hypotenuse = leg × √2. Half of a square cut diagonally.' },
      { name: '30-60-90 Triangle', formula: 'Sides: s, s√3, 2s', note: 's opposite 30°, s√3 opposite 60°, 2s opposite 90°. Half of equilateral.' },
      { name: 'Triangle Inequality', formula: '|a−b| < third side < a+b', note: 'Sum of any two sides must EXCEED the third. 3+7=10 > 11? No → not a triangle.' },
      { name: 'Exterior Angle', formula: 'Exterior angle = sum of remote interior angles', note: 'Also: exterior angle > either remote interior angle.' },
      { name: 'Similar Triangles', formula: 'Sides proportional, angles equal. Area ratio = (side ratio)²', note: 'If sides are in ratio k, areas are in ratio k², volumes in ratio k³.' },
      { name: 'Circle Area', formula: 'A = πr²', note: 'r = radius = diameter/2. If area = 49π, then r = 7.' },
      { name: 'Circumference', formula: 'C = 2πr = πd', note: 'd = diameter = 2r. If C = 10π, then d = 10, r = 5.' },
      { name: 'Arc Length', formula: 'L = (θ/360) × 2πr', note: 'θ = central angle in degrees. Arc is a fraction of circumference.' },
      { name: 'Sector Area', formula: 'A = (θ/360) × πr²', note: 'Sector is a "pizza slice." Same fraction as arc length.' },
      { name: 'Inscribed Angle', formula: 'Inscribed angle = ½ × central angle', note: 'Angle in semicircle (diameter) = 90°. Inscribed angle = ½ intercepted arc.' },
      { name: 'Rectangle Area & Perimeter', formula: 'A = lw    P = 2(l+w)', note: 'Diagonal = √(l² + w²) by Pythagorean theorem.' },
      { name: 'Parallelogram Area', formula: 'A = base × height', note: 'Height is perpendicular distance, NOT the slant side.' },
      { name: 'Trapezoid Area', formula: 'A = ½ × (b₁ + b₂) × h', note: 'b₁ and b₂ are the parallel sides (bases).' },
      { name: 'Sum of Interior Angles', formula: '(n−2) × 180°', note: 'n = sides. Triangle=180°, Quad=360°, Pentagon=540°, Hexagon=720°.' },
      { name: 'Regular Polygon Interior Angle', formula: 'Each angle = (n−2) × 180° / n', note: 'Regular = all sides and angles equal. Hex: each = 120°.' },
      { name: 'Cylinder Volume', formula: 'V = πr²h    SA = 2πr² + 2πrh', note: 'SA = 2 circles + 1 rectangle wrapped around.' },
      { name: 'Rectangular Solid', formula: 'V = lwh    SA = 2(lw + lh + wh)', note: 'Space diagonal = √(l² + w² + h²).' },
      { name: 'Cube', formula: 'V = s³    SA = 6s²    Diagonal = s√3', note: 'All edges equal. Face diagonal = s√2.' },
    ]
  },

  // ─── DATA ANALYSIS ───
  {
    category: 'Data Analysis',
    formulas: [
      { name: 'Probability', formula: 'P(A) = favorable / total', note: '0 ≤ P ≤ 1. P = 0 means impossible, P = 1 means certain.' },
      { name: 'Complement Rule', formula: 'P(not A) = 1 − P(A)', note: '"At least one" = 1 − P(none). This is the #1 probability trick on GRE.' },
      { name: 'Independent Events', formula: 'P(A and B) = P(A) × P(B)', note: 'Only when events DON\'T affect each other (like coin flips).' },
      { name: 'Dependent Events', formula: 'P(A and B) = P(A) × P(B|A)', note: 'Without replacement: denominator decreases. P(B|A) = P(B given A happened).' },
      { name: 'General Addition Rule', formula: 'P(A or B) = P(A) + P(B) − P(A and B)', note: 'Subtract overlap! If mutually exclusive: P(A and B) = 0.' },
      { name: 'Permutation (Order Matters)', formula: 'nPr = n! / (n−r)!', note: '"Arrange", "order", "rank", "first/second" = permutation.' },
      { name: 'Combination (Order Doesn\'t)', formula: 'nCr = n! / (r!(n−r)!)', note: '"Choose", "select", "committee", "group" = combination.' },
      { name: 'With Repetition', formula: 'nʳ (n choices, r picks)', note: '4-digit PIN from 0-9: 10⁴ = 10,000 possibilities.' },
      { name: 'Fundamental Counting', formula: 'Multiply choices at each step', note: '3 shirts × 4 pants × 2 shoes = 24 outfits.' },
      { name: 'Standard Deviation (SD)', formula: 'Measures spread from the mean', note: 'Adding constant to all values: SD unchanged. Multiplying by k: SD × |k|.' },
      { name: 'Normal Distribution', formula: '68% within 1 SD, 95% within 2 SD, 99.7% within 3 SD', note: 'Mean ± 1σ covers 68%. Mean ± 2σ covers 95%. Symmetric bell curve.' },
      { name: 'Expected Value', formula: 'E = Σ(value × probability)', note: 'Weighted average of all outcomes. Used in decision-making problems.' },
      { name: 'Median', formula: 'Middle value when sorted', note: 'Even count: average of two middle values. Less affected by outliers than mean.' },
      { name: 'Range', formula: 'Range = Maximum − Minimum', note: 'Only uses 2 values. One outlier changes range dramatically.' },
      { name: 'Quartiles & IQR', formula: 'IQR = Q₃ − Q₁', note: 'Q₁ = 25th percentile, Q₃ = 75th. IQR measures middle 50% spread.' },
      { name: 'Sets: Union & Intersection', formula: '|A ∪ B| = |A| + |B| − |A ∩ B|', note: 'Same as probability addition rule. Draw a Venn diagram!' },
    ]
  },
];

// ─── GRE QUANT FORMULA REFERENCE ──────────────────────────────────────────────

export const FORMULAS = [
  // ─── ARITHMETIC ───
  {
    category: 'Arithmetic',
    formulas: [
      { name: 'Percent Change', formula: '((New - Old) / Old) × 100', note: 'Always divide by the ORIGINAL value' },
      { name: 'Percent of a Number', formula: 'Part = (Percent/100) × Whole', note: '"is" = equals, "of" = multiply, "what" = x' },
      { name: 'Profit/Loss', formula: 'Profit% = ((SP - CP) / CP) × 100', note: 'SP = selling price, CP = cost price' },
      { name: 'Simple Interest', formula: 'I = P × r × t', note: 'P=principal, r=rate (decimal), t=time' },
      { name: 'Compound Interest', formula: 'A = P(1 + r/n)^(nt)', note: 'n=times compounded per year' },
      { name: 'Exponent Rules', formula: 'a^m × a^n = a^(m+n), (a^m)^n = a^(mn), a^0 = 1', note: 'a^(-n) = 1/a^n' },
      { name: 'Divisibility by 3', formula: 'Sum of digits divisible by 3', note: 'Same rule for 9: sum of digits ÷ 9' },
      { name: 'Number of Factors', formula: 'N = p1^a × p2^b → (a+1)(b+1) factors', note: 'From prime factorization' },
      { name: 'LCM & GCF', formula: 'LCM × GCF = Product of two numbers', note: 'LCM ≥ max(a,b), GCF ≤ min(a,b)' },
      { name: 'Average', formula: 'Average = Sum / Count', note: 'Sum = Average × Count (use this form!)' },
      { name: 'Weighted Average', formula: '(w1×v1 + w2×v2) / (w1 + w2)', note: 'Closer to the value with more weight' },
    ]
  },

  // ─── ALGEBRA ───
  {
    category: 'Algebra',
    formulas: [
      { name: 'Slope', formula: 'm = (y2 - y1) / (x2 - x1)', note: 'Positive=uphill, Negative=downhill, 0=horizontal' },
      { name: 'Slope-Intercept', formula: 'y = mx + b', note: 'm=slope, b=y-intercept' },
      { name: 'Distance Between Points', formula: 'd = √((x2-x1)² + (y2-y1)²)', note: 'Pythagorean theorem on coordinate plane' },
      { name: 'Midpoint', formula: 'M = ((x1+x2)/2, (y1+y2)/2)', note: 'Average of coordinates' },
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', note: 'For ax² + bx + c = 0' },
      { name: 'Difference of Squares', formula: 'a² - b² = (a+b)(a-b)', note: 'Very common on GRE!' },
      { name: 'Perfect Square', formula: '(a±b)² = a² ± 2ab + b²', note: 'Don\'t forget the middle term' },
      { name: 'Rate × Time = Distance', formula: 'D = R × T', note: 'Also: Work = Rate × Time' },
      { name: 'Combined Work Rate', formula: '1/T = 1/A + 1/B', note: 'A and B are individual times' },
      { name: 'Mixture Problems', formula: 'C1×V1 + C2×V2 = Cf×(V1+V2)', note: 'C=concentration, V=volume' },
    ]
  },

  // ─── GEOMETRY ───
  {
    category: 'Geometry',
    formulas: [
      { name: 'Triangle Area', formula: 'A = ½ × b × h', note: 'h must be perpendicular to base' },
      { name: 'Pythagorean Theorem', formula: 'a² + b² = c²', note: 'Only for RIGHT triangles' },
      { name: 'Special Right Triangles', formula: '45-45-90: s, s, s√2  |  30-60-90: s, s√3, 2s', note: 'Memorize these ratios!' },
      { name: 'Common Pythagorean Triples', formula: '3-4-5, 5-12-13, 8-15-17, 7-24-25', note: 'And their multiples (6-8-10, etc.)' },
      { name: 'Circle Area', formula: 'A = πr²', note: 'r = radius = d/2' },
      { name: 'Circle Circumference', formula: 'C = 2πr = πd', note: 'd = diameter' },
      { name: 'Arc Length', formula: 'L = (θ/360) × 2πr', note: 'θ = central angle in degrees' },
      { name: 'Sector Area', formula: 'A = (θ/360) × πr²', note: 'Fraction of total area' },
      { name: 'Cylinder Volume', formula: 'V = πr²h', note: 'Surface area = 2πr² + 2πrh' },
      { name: 'Rectangular Solid', formula: 'V = l × w × h', note: 'SA = 2(lw + lh + wh)' },
      { name: 'Triangle Inequality', formula: '|a-b| < c < a+b', note: 'Third side must be between sum and difference' },
      { name: 'Sum of Interior Angles', formula: '(n-2) × 180°', note: 'n = number of sides' },
    ]
  },

  // ─── DATA ANALYSIS ───
  {
    category: 'Data Analysis',
    formulas: [
      { name: 'Probability', formula: 'P(A) = favorable outcomes / total outcomes', note: '0 ≤ P ≤ 1' },
      { name: 'Complement', formula: 'P(not A) = 1 - P(A)', note: '"At least one" = 1 - P(none)' },
      { name: 'Independent Events', formula: 'P(A and B) = P(A) × P(B)', note: 'Only when events don\'t affect each other' },
      { name: 'Mutually Exclusive', formula: 'P(A or B) = P(A) + P(B)', note: 'When events can\'t happen together' },
      { name: 'General Or', formula: 'P(A or B) = P(A) + P(B) - P(A and B)', note: 'Subtract overlap' },
      { name: 'Permutation', formula: 'nPr = n! / (n-r)!', note: 'Order MATTERS (arrangements)' },
      { name: 'Combination', formula: 'nCr = n! / (r!(n-r)!)', note: 'Order does NOT matter (selections)' },
      { name: 'Standard Deviation', formula: 'σ = √(Σ(xi - x̄)² / n)', note: 'Measures spread from the mean' },
      { name: 'Normal Distribution', formula: '68-95-99.7 rule', note: '68% within 1σ, 95% within 2σ, 99.7% within 3σ' },
      { name: 'Expected Value', formula: 'E = Σ(value × probability)', note: 'Weighted average of outcomes' },
    ]
  },
];

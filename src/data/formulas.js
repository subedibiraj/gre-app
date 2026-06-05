// ─── GRE QUANT FORMULA REFERENCE (330+ / 170-LEVEL COMPLETE) ──────────────────
// Every formula, edge case, and trap tested at the highest GRE level
// Uses Unicode superscripts/subscripts for clean rendering

export const FORMULAS = [

  // ─── ARITHMETIC ───────────────────────────────────────────────────────────────
  {
    category: 'Arithmetic',
    formulas: [
      {
        name: 'Percent Change',
        formula: '((New − Old) / Old) × 100',
        latex: '\\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100',
        note: 'ALWAYS divide by the ORIGINAL (Old) value — never the new. A 50% increase then 50% decrease ≠ original (net −25%). Watch: "price is 30% more than Y" means X = 1.3Y, so Y = X/1.3, NOT Y = X − 0.3X.',
      },
      {
        name: 'Successive % Changes',
        formula: 'Net multiplier = (1+r₁)(1+r₂)(1+r₃)…',
        note: '+20% then −20%: 1.2 × 0.8 = 0.96 → net −4%. Three changes: multiply all multipliers. To find equivalent single change: subtract 1 from product. Key insight: successive increases always underperform their sum.',
      },
      {
        name: 'Percent Of vs Percent More Than',
        formula: 'Part = (Percent/100) × Whole',
        note: '"A is 120% of B" → A = 1.2B. "A is 20% more than B" → A = 1.2B. Same result, different phrasing. "A is 20% less than B" → A = 0.8B. Trick: x% of y = y% of x (8% of 25 = 25% of 8 = 2).',
      },
      {
        name: 'Profit / Loss %',
        formula: '((Selling Price − Cost Price) / Cost Price) × 100',
        note: 'Denominator is ALWAYS Cost Price. Markup is on cost; discount is on selling price — the GRE exploits this distinction. If profit% = loss%, selling at different prices, net is always a loss.',
      },
      {
        name: 'Simple Interest',
        formula: 'I = P × r × t    A = P(1 + rt)',
        note: 'P = principal, r = annual rate as decimal, t = years. Interest is FLAT each period — does not compound. Used in GRE "loan" and "savings" problems when compound is not stated.',
      },
      {
        name: 'Compound Interest',
        formula: 'A = P(1 + r/n)ⁿᵗ',
        note: 'n = compounding periods per year: annually=1, semi-annually=2, quarterly=4, monthly=12. More frequent compounding → slightly higher return. Effective annual rate = (1+r/n)ⁿ − 1.',
      },
      {
        name: 'Exponent Rules — Complete',
        formula: 'aᵐ·aⁿ=aᵐ⁺ⁿ  aᵐ÷aⁿ=aᵐ⁻ⁿ  (aᵐ)ⁿ=aᵐⁿ  (ab)ⁿ=aⁿbⁿ  a⁰=1  a⁻ⁿ=1/aⁿ',
        note: 'CRITICAL: (a+b)ⁿ ≠ aⁿ+bⁿ (only products distribute). 0⁰ is undefined. (−a)ⁿ: negative if n is odd, positive if n is even. To compare exponents: convert to the same base (4⁶=2¹², 8⁴=2¹² → equal).',
      },
      {
        name: 'Root Rules & Fractional Exponents',
        formula: '√(ab)=√a·√b   √(a/b)=√a/√b   a^(m/n)=(ⁿ√a)ᵐ',
        note: 'For 0<x<1: x² < x < √x (higher powers shrink, roots grow — the reverse of x>1). √x is only real for x≥0. ⁿ√(aᵐ) = a^(m/n). Simplify: √48=4√3. Rationalizing: multiply by conjugate.',
      },
      {
        name: 'Divisibility Rules — All',
        formula: '2:even  3:digit-sum÷3  4:last2÷4  5:ends0,5  6:÷2and÷3  7:no shortcut  8:last3÷8  9:digit-sum÷9  11:alt-digit-diff÷11',
        note: '7: test by trial or prime factorization. 11: alternate sum of digits (e.g. 1001: 1−0+0−1=0 ✓). 12: divisible by 3 AND 4. Divisibility by product only works when factors are COPRIME.',
      },
      {
        name: 'Number of Factors',
        formula: 'N = p₁ᵃ·p₂ᵇ·p₃ᶜ → Factors = (a+1)(b+1)(c+1)',
        note: 'Step 1: prime factorize. Step 2: add 1 to each exponent, multiply. 360 = 2³·3²·5¹ → (4)(3)(2) = 24 factors. Perfect squares have ODD number of factors. A number has exactly 2 factors iff it is prime.',
      },
      {
        name: 'Sum of All Factors',
        formula: 'For N = pᵃqᵇ: Sum = (1+p+p²+…+pᵃ)(1+q+q²+…+qᵇ)',
        note: 'Each bracket is a geometric series. Example: 12 = 2²·3¹. Sum = (1+2+4)(1+3) = 7×4 = 28. Rare on GRE but appears in 168+ difficulty Quant problems.',
      },
      {
        name: 'LCM & GCF',
        formula: 'LCM(a,b) × GCF(a,b) = a × b',
        note: 'GCF: take LOWEST power of SHARED primes. LCM: take HIGHEST power of ALL primes. GCF(48,180)=12, LCM=720, and 48×180=8640=12×720 ✓. LCM ≥ max(a,b). GCF ≤ min(a,b). If GCF=1, numbers are coprime.',
      },
      {
        name: 'Average (Mean)',
        formula: 'Mean = Sum ÷ Count  ↔  Sum = Mean × Count',
        note: 'CONVERT TO SUM immediately. "Average of 5 is 20" → Sum=100. Adding a value equal to the mean leaves mean unchanged. If mean of n items is M, adding new item x: new mean = (nM+x)/(n+1). Average of consecutive integers = middle value.',
      },
      {
        name: 'Weighted Average',
        formula: 'W-Avg = (w₁v₁ + w₂v₂ + …) / (w₁ + w₂ + …)',
        note: 'Result pulls TOWARD the larger weight. Alligation shortcut: if mixing two groups with averages A and B, the ratio of group sizes = |B−Final| : |Final−A|. NEVER simply average percentages or rates from different group sizes.',
      },
      {
        name: 'Consecutive Integer Formulas',
        formula: 'Sum(1 to n) = n(n+1)/2    Sum of evens(2 to n) = n(n+2)/4 × 2    Count of integers from a to b = b−a+1',
        note: 'Average of consecutive integers (arithmetic sequence) = (first + last)/2 = middle term. Sum = count × average. Sum of first n odd integers = n². Sum of first n even integers = n(n+1).',
      },
      {
        name: 'Even/Odd Rules — Complete',
        formula: 'E±E=E  O±O=E  E±O=O  E×any=E  O×O=O  E÷E=E or O or non-integer  O÷O=O or non-integer',
        note: 'Zero is EVEN. Negative numbers follow the same rules. E×E=E, E×O=E, O×O=O. Sum of n consecutive integers: divisible by n if n is odd; not necessarily if n is even. (−1)ⁿ = 1 if n even, −1 if n odd.',
      },
      {
        name: 'Remainders & Modular Arithmetic',
        formula: 'a mod m = remainder when a is divided by m',
        note: 'Find CYCLES for powers: 2¹mod3=2, 2²mod3=1, 2³mod3=2 → cycle length 2. Last digit of xⁿ cycles: 2→(2,4,8,6), 3→(3,9,7,1), 7→(7,9,3,1) all cycle 4. 4,9,6,1,5,0 never change. If a≡r₁ and b≡r₂ (mod m), then a+b≡r₁+r₂ and a×b≡r₁×r₂.',
      },
      {
        name: 'Prime Number Properties',
        formula: '2 is the only even prime. All primes>3 are of form 6k±1.',
        note: 'Primes to memorize: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47. To test primality: check divisibility by primes up to √n only. Product of any two consecutive integers is divisible by 2. Product of any three consecutive integers is divisible by 6.',
      },
      {
        name: 'Absolute Value',
        formula: '|x| = x if x≥0, |x| = −x if x<0',
        note: '|x| = distance from 0 on number line. |x−a| = distance from x to a. |x|<k → −k<x<k. |x|>k → x<−k OR x>k. |a+b| ≤ |a|+|b| (triangle inequality). |ab| = |a||b|. Always check BOTH cases when solving.',
      },
    ],
  },

  // ─── ALGEBRA ──────────────────────────────────────────────────────────────────
  {
    category: 'Algebra',
    formulas: [
      {
        name: 'Slope & Line Forms',
        formula: 'm = (y₂−y₁)/(x₂−x₁)    y=mx+b    y−y₁=m(x−x₁)    ax+by=c',
        note: 'Parallel: same slope. Perpendicular: m₁·m₂=−1. Horizontal line: slope=0, y=k. Vertical line: undefined slope, x=k. Distance from point (x₀,y₀) to line ax+by+c=0 is |ax₀+by₀+c|/√(a²+b²).',
      },
      {
        name: 'Distance & Midpoint',
        formula: 'd = √((x₂−x₁)²+(y₂−y₁)²)    M = ((x₁+x₂)/2, (y₁+y₂)/2)',
        note: 'Midpoint of a segment with endpoints at (x₁,y₁) and (x₂,y₂). To find point that divides segment in ratio m:n, use section formula. Distance is always ≥0. On number line: |b−a|.',
      },
      {
        name: 'Quadratic Formula',
        formula: 'x = (−b ± √(b² − 4ac)) / 2a',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        note: 'Rarely strictly required, but useful as a fallback when factoring fails. The discriminant (b² − 4ac) tells you how many real roots exist (positive = 2, zero = 1, negative = 0).',
      },
      {
        name: 'Vieta\'s Formulas (Sum & Product of Roots)',
        formula: 'For ax²+bx+c=0: Sum of roots = −b/a    Product of roots = c/a',
        note: 'Faster than solving! If asked "what is r+s or r·s?", use these directly. Extension: if roots are r,s then the quadratic is x²−(r+s)x+(r·s)=0. For GRE: if told one root, find the other via sum or product.',
      },
      {
        name: 'Key Factoring Identities',
        formula: 'a²−b²=(a+b)(a−b)    (a±b)²=a²±2ab+b²    a³±b³=(a±b)(a∓ab+b²)',
        note: 'Difference of squares: spot whenever you see two perfect squares subtracted (997×1003 = 1000²−9 = 999,991). Perfect square: NEVER forget the middle term. Sum/diff of cubes: rare but appears at 168+ level.',
      },
      {
        name: 'Difference of Squares',
        formula: 'x² − y² = (x + y)(x − y)',
        latex: 'x^2 - y^2 = (x + y)(x - y)',
        note: 'The most tested algebra formula on the GRE. Look for hidden versions like 9a² − 16b² or x⁴ − y⁴ = (x² + y²)(x + y)(x − y). Can also be used for quick mental math (e.g., 51² − 49² = (100)(2) = 200).',
      },
      {
        name: 'Systems of Equations',
        formula: 'Substitution: solve one, plug into other. Elimination: add/subtract to cancel variable.',
        note: 'For QC/efficiency: if asked for 3x+2y (an expression), try adding/subtracting the equations directly. Two equations → unique solution only if lines not parallel. If the GRE gives you 2 equations and 3 unknowns, check if a combination can be solved without individual values.',
      },
      {
        name: 'Inequality Rules',
        formula: 'Adding/subtracting: direction preserved. Multiplying/dividing by negative: FLIP. Multiplying by variable: DANGEROUS — split into positive and negative cases.',
        note: 'x > 3 AND x < 7 → 3 < x < 7 (intersection). x < 2 OR x > 5 → union. Squaring inequalities: only safe if BOTH sides are known positive. If a>b and c>d: a+c > b+d (add), but a−c vs b−d is unknown.',
      },
      {
        name: 'Rate × Time = Distance / Work',
        formula: 'D=RT   Work=Rate×Time   Combined: 1/T=1/A+1/B',
        note: 'Average speed = TOTAL distance ÷ TOTAL time (never average speeds). Meeting problems: set times equal. Catch-up: distance gap ÷ relative speed. Work: rates add. If A does job in 6hr and B in 4hr: together = 1/6+1/4=5/12 per hr → T = 12/5 = 2.4 hr.',
      },
      {
        name: 'Combined Work — Advanced',
        formula: 'If A,B work together for t hours then A works alone for s hours: t(1/A+1/B) + s/A = 1',
        note: 'Three workers: 1/T = 1/A+1/B+1/C. Pipe filling and draining: draining rates SUBTRACT. Fraction done = rate × time. Fraction remaining = 1 − fraction done. Always check: "together" time must be LESS than fastest worker alone.',
      },
      {
        name: 'Mixture Formula',
        formula: 'C₁V₁ + C₂V₂ = C_f(V₁+V₂)',
        note: 'C = concentration/percentage, V = volume/quantity. Final concentration is BETWEEN C₁ and C₂. Alligation shortcut: amounts are in inverse ratio of distance from target. Adding pure solute: C₂=100%. Adding pure solvent (water): C₂=0%.',
      },
      {
        name: 'Direct & Inverse Proportion',
        formula: 'Direct: y/x = k (y=kx). Inverse: xy = k (y=k/x). Joint: z=kxy.',
        note: 'Direct: doubling x doubles y. Inverse: doubling x halves y. If y∝x² then y/x²=k. Speed and time (fixed distance): inverse proportion. Workers and time (fixed work): inverse proportion.',
      },
      {
        name: 'Function Notation & Composition',
        formula: 'f(a): replace every x with a. (f∘g)(x) = f(g(x)): evaluate g first, then f.',
        note: 'f(x+1) ≠ f(x)+1. f(2x) ≠ 2f(x). Always fully substitute. f(g(x)): inside-out order. f(f(x)) = apply f twice. Domain: values of x that keep the function defined. Range: possible output values.',
      },
      {
        name: 'Absolute Value Equations & Inequalities',
        formula: '|expr|=k → expr=k OR expr=−k (k≥0). |expr|<k → −k<expr<k. |expr|>k → expr>k OR expr<−k.',
        note: '|x−3|=distance from x to 3. Two-case method: always write BOTH cases, then check solutions in original. |x|<k gives a bounded region (AND). |x|>k gives two rays (OR). Absolute value = 0 only when the expression inside = 0.',
      },
      {
        name: 'Sequences: Arithmetic & Geometric',
        formula: 'Arith: aₙ=a₁+(n−1)d   Sₙ=n(a₁+aₙ)/2=n(2a₁+(n−1)d)/2\nGeo: aₙ=a₁·rⁿ⁻¹   Sₙ=a₁(1−rⁿ)/(1−r)',
        note: 'Arithmetic: constant difference d. Sum = count × average = count × (first+last)/2. Geometric: constant ratio r. Infinite geo series (|r|<1): S∞=a₁/(1−r). Count of integers from a to b inclusive = b−a+1.',
      },
    ],
  },

  // ─── GEOMETRY ─────────────────────────────────────────────────────────────────
  {
    category: 'Geometry',
    formulas: [
      {
        name: 'Triangle — Fundamental',
        formula: 'A = ½bh    Angles sum = 180°    Exterior angle = sum of remote interior angles',
        note: 'Height is PERPENDICULAR to base — not the slant side. Any vertex can be used as the apex. Exterior angle > either non-adjacent interior angle. Scalene: all sides different. Isosceles: base angles equal.',
      },
      {
        name: 'Triangle Inequality & Classification',
        formula: '|a−b| < c < a+b  (for any side c)',
        note: 'The two smaller sides must STRICTLY EXCEED the third (not equal). Acute: a²+b²>c². Right: a²+b²=c². Obtuse: a²+b²<c². If 3+7=10, this does NOT satisfy the strict inequality, so no triangle possible.',
      },
      {
        name: 'Pythagorean Theorem',
        formula: 'a² + b² = c²',
        latex: 'a^2 + b^2 = c^2',
        note: 'Only applies to RIGHT triangles. "c" is always the hypotenuse (the longest side opposite the 90° angle). If you only know a and b but don\'t know it\'s a right triangle, you CANNOT find c.',
      },
      {
        name: 'Pythagorean Theorem & Triples',
        formula: 'a²+b²=c²  (c=hypotenuse). Triples: 3-4-5  5-12-13  8-15-17  7-24-25',
        note: 'All multiples work: 6-8-10, 9-12-15, 10-24-26, 15-36-39, 20-48-52. Recognize triples immediately — saves 30 sec per problem. To generate new triples: (m²−n², 2mn, m²+n²) for m>n>0.',
      },
      {
        name: '45-45-90 Triangle',
        formula: 'Legs: s and s. Hypotenuse: s√2.',
        note: 'Half of a square cut on the diagonal. If hypotenuse given: leg = hyp/√2 = hyp·√2/2. Key: diagonal of square with side s = s√2. Ratio is always 1:1:√2.',
      },
      {
        name: '30-60-90 Triangle',
        formula: 'Short leg (30°): s. Long leg (60°): s√3. Hypotenuse (90°): 2s.',
        note: 'Half of an equilateral triangle. Long leg = short leg × √3. Hypotenuse = 2 × short leg. If long leg given = x, short leg = x/√3 = x√3/3. In any equilateral triangle with side a, the height = a√3/2.',
      },
      {
        name: 'Equilateral Triangle',
        formula: 'Area = (s²√3)/4    Height = (s√3)/2    All angles = 60°',
        note: 'All sides equal. Area formula derived from two 30-60-90 triangles. If area is given as k√3, then s²=4k. Equilateral triangle inscribed in circle: R=s/√3. GRE uses this shape frequently in multi-shape problems.',
      },
      {
        name: 'Similar Triangles',
        formula: 'If ratio of corresponding sides = k, then area ratio = k², volume ratio = k³.',
        note: 'AA similarity: two matching angles → similar. SAS: two sides in proportion with included angle. SSS: all three sides in proportion. A line parallel to one side creates similar triangles — set up proportions. Shadow/height problems always use similar triangles.',
      },
      {
        name: 'Area of a Circle',
        formula: 'A = πr²',
        latex: 'A = \\pi r^2',
        note: 'Area scales with the SQUARE of the radius. If radius doubles, area quadruples. Don\'t confuse this with circumference.',
      },
      {
        name: 'Circle — Core',
        formula: 'A=πr²    C=2πr=πd    r=d/2',
        note: 'If A=49π → r=7. If C=14π → r=7. Area is proportional to r² (double radius → 4× area). Circumference is proportional to r (double radius → double circumference). Never confuse r and d — the most common circle error.',
      },
      {
        name: 'Circle — Arcs, Sectors, Angles',
        formula: 'Arc length = (θ/360)×2πr    Sector area = (θ/360)×πr²    Central angle = intercepted arc',
        note: 'Inscribed angle = ½ × intercepted arc. Inscribed angle in semicircle (on diameter) = 90°. Two inscribed angles intercepting the same arc are equal. Tangent to circle is perpendicular to radius at the point of tangency.',
      },
      {
        name: 'Circle — Chord, Tangent, Secant',
        formula: 'Tangent-radius: angle = 90°. Chord-chord: if two chords intersect inside circle at P: PA·PB = PC·PD.',
        note: 'Two tangent segments from external point to circle are equal in length. Power of a point: for external point P with secant through A,B: PA·PB = PC·PD (for another secant through C,D). Perpendicular from center to chord bisects the chord.',
      },
      {
        name: 'Quadrilaterals',
        formula: 'Rectangle: A=lw, P=2(l+w), diag=√(l²+w²)\nParallelogram: A=bh (h⊥b)\nTrapezoid: A=½(b₁+b₂)h\nRhombus: A=½d₁d₂',
        note: 'Square is special rectangle (and rhombus). In a parallelogram, diagonals bisect each other. In a rhombus, diagonals bisect each other at right angles. In a rectangle, diagonals are equal. All these relationships are tested on GRE.',
      },
      {
        name: 'Polygon Angle Formulas',
        formula: 'Sum of interior angles = (n−2)×180°    Each interior angle (regular) = (n−2)×180°/n    Each exterior angle (regular) = 360°/n',
        note: 'Triangle=180°, Quad=360°, Pentagon=540°, Hexagon=720°, Octagon=1080°. Sum of exterior angles of ANY convex polygon = 360°. Regular hexagon with side s: area = (3√3/2)s². Diagonal count = n(n−3)/2.',
      },
      {
        name: 'Coordinate Geometry — Areas',
        formula: 'If triangle vertices are (x₁,y₁),(x₂,y₂),(x₃,y₃): A = ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|',
        note: 'Simpler method: if one side lies on an axis, use that as base and the perpendicular coordinate as height. Shoelace formula for any polygon. For area between two lines: find intersection first, then calculate triangle formed.',
      },
      {
        name: '3D — Prisms & Cylinders',
        formula: 'V = base area × height    Cylinder: V=πr²h, SA=2πr²+2πrh',
        note: 'Cylinder SA: 2 circles + 1 rectangle (the rectangle has width=circumference=2πr). Space diagonal of rectangular box = √(l²+w²+h²). Volume scales as k³ when all dimensions scaled by k. SA scales as k².',
      },
      {
        name: '3D — Cube, Pyramid, Cone, Sphere',
        formula: 'Cube: V=s³, SA=6s², face diag=s√2, space diag=s√3\nPyramid: V=⅓Bh\nCone: V=⅓πr²h, Slant=√(r²+h²)\nSphere: V=⁴⁄₃πr³, SA=4πr²',
        note: 'Pyramid and cone: volume = ⅓ × base area × height (always). Slant height of cone ≠ height. Similar 3D shapes: volume ratio = (linear ratio)³. GRE rarely asks cone/sphere formula from scratch but tests application.',
      },
    ],
  },

  // ─── DATA ANALYSIS ────────────────────────────────────────────────────────────
  {
    category: 'Data Analysis',
    formulas: [
      {
        name: 'Basic Probability',
        formula: 'P(A) = (# favorable outcomes) / (# total equally likely outcomes)',
        note: '0 ≤ P(A) ≤ 1. P=0: impossible. P=1: certain. The sample space must consist of equally likely outcomes. If not equally likely, use P = Σ probabilities of favorable outcomes.',
      },
      {
        name: 'Complement Rule',
        formula: 'P(not A) = 1 − P(A)',
        note: 'THE most powerful probability tool on GRE. "At least one" = 1 − P(none). "At least one head in 5 flips" = 1 − (1/2)⁵ = 31/32. Always use complement when the "direct" counting is complex.',
      },
      {
        name: 'Addition Rule',
        formula: 'P(A∪B) = P(A) + P(B) − P(A∩B)',
        note: 'Mutually exclusive (can\'t both occur): P(A∩B)=0, so P(A∪B) = P(A)+P(B). Mutually exclusive and collectively exhaustive: P(A)+P(B)=1. Subtract the overlap to avoid double-counting.',
      },
      {
        name: 'Multiplication Rule',
        formula: 'Independent: P(A∩B) = P(A)·P(B)\nDependent: P(A∩B) = P(A)·P(B|A)',
        note: 'Without replacement → events are dependent (denominator shrinks by 1). With replacement → independent. Conditional: P(B|A) = P(A∩B)/P(A). "Given that A occurred" → reduce sample space to A only.',
      },
      {
        name: 'Permutations (Order Matters)',
        formula: 'nPr = n! / (n−r)!',
        note: 'Arranged in a LINE: nPr. In a CIRCLE: (n−1)!. With repeated elements: n! / (n₁!·n₂!·…). Keywords: arrange, order, rank, schedule, first/second/third. 5P3 = 5×4×3 = 60.',
      },
      {
        name: 'Combinations (Order Doesn\'t Matter)',
        formula: 'nCr = n! / (r!(n−r)!)    nCr = nC(n−r)',
        note: 'Keywords: choose, select, committee, team, group, subset. nCr = nC(n−r): choosing 3 from 10 = "not choosing 7 from 10". For handshake/games problems: nC2 = n(n−1)/2.',
      },
      {
        name: 'Counting Principle',
        formula: 'Multiply choices at each INDEPENDENT stage',
        note: '3 shirts × 4 pants × 2 shoes = 24 outfits. With repetition allowed: nʳ. Passwords with n character options, length r: nʳ. SUBTRACT invalid cases from total when restrictions apply (complement counting).',
      },
      {
        name: 'Mean, Median, Mode',
        formula: 'Mean = Sum/n ↔ Sum = Mean×n    Median = middle value (sorted)    Mode = most frequent',
        note: 'Mean is pulled toward outliers; median is resistant. Adding value = mean → mean unchanged, count increases. Adding value ≠ mean → mean shifts. Even-count median = average of two middle values. A set can have no mode, one mode, or multiple modes.',
      },
      {
        name: 'Range, Variance, Standard Deviation',
        formula: 'Range = Max − Min    SD = √(variance)    Variance = Σ(xᵢ−μ)²/n',
        note: 'GRE does NOT ask you to compute SD. It tests: (1) adding constant c to all values → mean+c, SD unchanged; (2) multiplying all values by k → mean×k, SD×|k|. More spread out = larger SD. Identical values → SD=0.',
      },
      {
        name: 'Normal Distribution',
        formula: '68% within ±1σ    95% within ±2σ    99.7% within ±3σ',
        note: 'Bell-shaped, symmetric about mean. Above the mean: 50%. Between mean and mean+1σ: 34%. Between mean+1σ and mean+2σ: 13.5%. Below mean−2σ: 2.5%. Use these benchmarks to answer "what % scored above/below X?"',
      },
      {
        name: 'Percentiles & Quartiles',
        formula: 'Q₁=25th percentile   Q₂=Median=50th   Q₃=75th   IQR=Q₃−Q₁',
        note: 'Percentile p: value at or below which p% of data falls. IQR measures spread of middle 50%. Outlier rule: below Q₁−1.5×IQR or above Q₃+1.5×IQR. Boxplot shows Min, Q₁, Median, Q₃, Max.',
      },
      {
        name: 'Expected Value',
        formula: 'E(X) = Σ [xᵢ · P(xᵢ)]',
        note: 'Weighted average of all outcomes by their probabilities. E(gain from game) can be negative → unfavorable game. Used in GRE "fair game" or "expected winnings" questions. Linearity: E(aX+b) = a·E(X)+b.',
      },
      {
        name: 'Sets — Venn Diagrams',
        formula: '|A∪B| = |A|+|B|−|A∩B|\nThree sets: |A∪B∪C| = |A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|',
        note: 'Always add "Neither" if total is given: Total = |A∪B| + Neither. Draw Venn and fill inside-out (start with all three overlap, then two-way, then singles). "Only A" = |A| − |A∩B| − |A∩C| + |A∩B∩C|.',
      },
      {
        name: 'Data Interpretation — Key Rules',
        formula: 'Percent change = (new−old)/old × 100    Pie slice% = (slice degrees/360) × 100',
        note: 'ALWAYS check: axis labels, units, scale (does it start at 0?). "Approximately" = estimate. For stacked bar charts, read individual layers — do not use total height for a single category. Two-axis graphs: be careful which scale applies to which line.',
      },
    ],
  },
];
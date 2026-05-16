// ─── GRE QUANT TOPIC STRUCTURE ────────────────────────────────────────────────

export const QUANT_TOPICS = [
  {
    id: 'arithmetic',
    label: 'Arithmetic',
    icon: '🔢',
    subtopics: [
      'Number Properties & Divisibility',
      'Primes & Factorization',
      'Fractions, Decimals & Percentages',
      'Ratios & Proportions',
      'Exponents & Roots',
      'Absolute Value',
      'Sequences & Series',
    ],
    traps: [
      'Forgetting that 0 is neither positive nor negative',
      'Assuming variables must be positive integers',
      'Confusing percent increase with percent of',
      'Forgetting that |x| = -x when x < 0',
    ],
  },
  {
    id: 'algebra',
    label: 'Algebra',
    icon: '📐',
    subtopics: [
      'Linear Equations & Inequalities',
      'Quadratic Equations',
      'Systems of Equations',
      'Functions & Graphs',
      'Word Problems (Rate, Work, Mixture)',
      'Exponent Rules & Simplification',
      'Absolute Value Equations',
    ],
    traps: [
      'Flipping inequality when multiplying by negative',
      'Forgetting ± when taking square roots',
      'Assuming x² > x (fails for 0 < x < 1)',
      'Not checking if a solution makes the denominator 0',
    ],
  },
  {
    id: 'geometry',
    label: 'Geometry',
    icon: '📏',
    subtopics: [
      'Lines, Angles & Triangles',
      'Circles (area, circumference, arcs, sectors)',
      'Quadrilaterals & Polygons',
      'Coordinate Geometry',
      '3D Shapes (volume, surface area)',
      'Similar & Congruent Figures',
      'Pythagorean Theorem & Special Triangles',
    ],
    traps: [
      'Diagrams are NOT drawn to scale on the GRE',
      'Forgetting the third side rule for triangles',
      'Confusing radius and diameter',
      'Assuming right angles without proof',
    ],
  },
  {
    id: 'data',
    label: 'Data Analysis',
    icon: '📊',
    subtopics: [
      'Mean, Median, Mode & Range',
      'Standard Deviation',
      'Probability (simple, compound, conditional)',
      'Counting (permutations & combinations)',
      'Data Interpretation (tables, bar charts, line graphs)',
      'Normal Distribution',
      'Percentiles & Quartiles',
    ],
    traps: [
      'Confusing "at least one" with "exactly one" in probability',
      'Forgetting that median of even-count set = average of middle two',
      'Confusing permutation (order matters) with combination',
      'Misreading graph scales or units',
    ],
  },
];

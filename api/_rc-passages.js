// ─── GRE READING COMPREHENSION PASSAGES (170-LEVEL) ────────────────────────────

export const RC_PASSAGES = [
  {
    id: 'rc_1',
    title: 'The Paradox of Choice',
    subject: 'Social Science',
    difficulty: 'Medium',
    length: 'Short',
    text: `Recent studies in behavioral economics have challenged the classical assumption that a greater number of choices universally benefits the consumer. While neoclassical models posit that expanding the option set allows individuals to optimize their utility functions more precisely, empirical evidence suggests a threshold effect. When confronted with an overwhelming array of options, consumers frequently experience "choice paralysis," characterized by heightened anxiety, delayed decision-making, and a paradoxical decrease in post-choice satisfaction. This phenomenon is often attributed to the increased cognitive load required to evaluate trade-offs and the heightened anticipation of regret associated with foregone alternatives. Consequently, some retailers have successfully adopted a "curated selection" strategy, intentionally limiting options to maximize conversion rates and customer satisfaction.`,
    questions: [
      {
        id: 'q1',
        type: 'single', // Single answer multiple choice
        question: 'The primary purpose of the passage is to:',
        options: [
          'A) refate a central tenet of behavioral economics.',
          'B) present an alternative to the "curated selection" strategy.',
          'C) explain how cognitive load improves decision-making precision.',
          'D) describe a phenomenon that challenges a traditional economic assumption.',
          'E) argue that consumers generally prefer fewer options across all markets.'
        ],
        answer: 'D',
        explanation: 'The passage describes "choice paralysis," which challenges the classical (traditional) assumption that more choices always benefit the consumer. Choice (D) perfectly captures this.'
      },
      {
        id: 'q2',
        type: 'select-in-passage',
        question: 'Select the sentence that explains the psychological mechanisms driving "choice paralysis."',
        options: [
          'Recent studies in behavioral economics have challenged the classical assumption that a greater number of choices universally benefits the consumer.',
          'While neoclassical models posit that expanding the option set allows individuals to optimize their utility functions more precisely, empirical evidence suggests a threshold effect.',
          'When confronted with an overwhelming array of options, consumers frequently experience "choice paralysis," characterized by heightened anxiety, delayed decision-making, and a paradoxical decrease in post-choice satisfaction.',
          'This phenomenon is often attributed to the increased cognitive load required to evaluate trade-offs and the heightened anticipation of regret associated with foregone alternatives.',
          'Consequently, some retailers have successfully adopted a "curated selection" strategy, intentionally limiting options to maximize conversion rates and customer satisfaction.'
        ],
        answer: 3, // 0-indexed, so 4th sentence
        explanation: 'The fourth sentence explicitly names "increased cognitive load" and "heightened anticipation of regret" as the psychological mechanisms (the "why") behind the phenomenon.'
      },
      {
        id: 'q3',
        type: 'multiple', // Select all that apply
        question: 'Which of the following can be inferred about neoclassical economic models from the passage? Select all that apply.',
        options: [
          'A) They assume consumers are capable of effectively evaluating large option sets.',
          'B) They fail to account for the impact of cognitive load on decision-making.',
          'C) They prioritize retailer conversion rates over consumer satisfaction.'
        ],
        answer: ['A', 'B'],
        explanation: 'A is true because neoclassical models assume expanding options allows precise optimization. B is true because the passage contrasts these models with evidence showing cognitive load causes paralysis. C is false; retailers, not the neoclassical models, prioritize conversion rates.'
      }
    ]
  },
  {
    id: 'rc_2',
    title: 'Origins of the Cambrian Explosion',
    subject: 'Science',
    difficulty: 'Hard',
    length: 'Long',
    text: `The "Cambrian Explosion," a period approximately 541 million years ago characterized by the rapid appearance of most major animal phyla, remains one of the most intensely debated events in evolutionary biology. Traditionally, paleontologists hypothesized that this burst of morphological diversity was triggered by a sudden environmental shift, such as a significant increase in atmospheric oxygen, which permitted the evolution of larger, more metabolically active organisms. However, some contemporary biologists argue that the "explosion" is partly an artifact of the fossil record; according to this view, the genetic and developmental foundations for these diverse body plans evolved gradually during the preceding Ediacaran period, but only became visible in the fossil record when organisms began developing easily fossilized hard parts, like shells and exoskeletons.

Furthermore, the "ecological arms race" hypothesis suggests that the evolution of novel ecological interactions, particularly predation, acted as a primary catalyst for rapid diversification. As the first active predators emerged, prey species were subjected to intense selective pressure to develop defensive adaptations, such as armor, mobility, and burrowing behaviors. This, in turn, drove predators to evolve more sophisticated sensory organs and appendages. This complex web of interacting selective pressures could have generated a positive feedback loop, dramatically accelerating the rate of evolutionary change independently of external environmental triggers.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'The author mentions the "evolution of larger, more metabolically active organisms" primarily to:',
        options: [
          'A) provide evidence against the "ecological arms race" hypothesis.',
          'B) illustrate a consequence of the genetic foundations developed during the Ediacaran period.',
          'C) describe a proposed result of an environmental change believed by some to have triggered the Cambrian Explosion.',
          'D) explain why hard parts like shells and exoskeletons became evolutionarily advantageous.',
          'E) challenge the notion that the Cambrian Explosion was a sudden evolutionary event.'
        ],
        answer: 'C',
        explanation: 'The text states that a "sudden environmental shift, such as a significant increase in atmospheric oxygen... permitted the evolution of larger, more metabolically active organisms." This is presented as a proposed result of the traditional environmental hypothesis.'
      },
      {
        id: 'q2',
        type: 'multiple',
        question: 'Based on the passage, the "artifact of the fossil record" theory and the "ecological arms race" theory differ in that: (Select all that apply)',
        options: [
          'A) The artifact theory attributes the appearance of diversity to the development of hard parts, while the arms race theory attributes it to new ecological interactions.',
          'B) The artifact theory suggests the diversification was actually more gradual than it appears, while the arms race theory provides a mechanism for rapid diversification.',
          'C) The artifact theory relies on environmental triggers, while the arms race theory explicitly rejects them.'
        ],
        answer: ['A', 'B'],
        explanation: 'A is supported because the artifact theory cites "easily fossilized hard parts" and the arms race cites "predation." B is supported because the artifact theory says foundations "evolved gradually," while the arms race generated a "positive feedback loop, dramatically accelerating the rate." C is incorrect because the traditional theory relies on environmental triggers, not the artifact theory.'
      }
    ]
  }
];

// ─── GRE READING COMPREHENSION PASSAGES (170-LEVEL) ────────────────────────────
import { RC_EXPANSION } from '../src/data/rc-expansion';
import { RC_EXPANSION_2 } from '../src/data/rc-expansion2';

const BASE_PASSAGES = [
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
        type: 'single',
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
        answer: 3,
        explanation: 'The fourth sentence explicitly names "increased cognitive load" and "heightened anticipation of regret" as the psychological mechanisms (the "why") behind the phenomenon.'
      },
      {
        id: 'q3',
        type: 'multiple',
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
    text: `The "Cambrian Explosion," a period approximately 541 million years ago characterized by the rapid appearance of most major animal phyla, remains one of the most intensely debated events in evolutionary biology. Traditionally, paleontologists hypothesized that this burst of morphological diversity was triggered by a sudden environmental shift, such as a significant increase in atmospheric oxygen, which permitted the evolution of larger, more metabolically active organisms. However, some contemporary biologists argue that the "explosion" is partly an artifact of the fossil record; according to this view, the genetic and developmental foundations for these diverse body plans evolved gradually during the preceding Ediacaran period, but only became visible in the fossil record when organisms began developing easily fossilized hard parts, like shells and exoskeletons.\n\nFurthermore, the "ecological arms race" hypothesis suggests that the evolution of novel ecological interactions, particularly predation, acted as a primary catalyst for rapid diversification. As the first active predators emerged, prey species were subjected to intense selective pressure to develop defensive adaptations, such as armor, mobility, and burrowing behaviors. This, in turn, drove predators to evolve more sophisticated sensory organs and appendages. This complex web of interacting selective pressures could have generated a positive feedback loop, dramatically accelerating the rate of evolutionary change independently of external environmental triggers.`,
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
  },
  {
    id: 'rc_3',
    title: 'The Enigma of Dark Matter',
    subject: 'Science',
    difficulty: 'Hard',
    length: 'Short',
    text: `Observations of galactic rotation curves in the 1970s revealed a profound anomaly: stars at the peripheries of spiral galaxies orbit at velocities far exceeding what could be accounted for by the gravitational pull of visible matter alone. To explain this discrepancy, astrophysicists postulated the existence of "dark matter," an invisible substance that does not interact with electromagnetic radiation but exerts a significant gravitational influence. While the dark matter hypothesis elegantly resolves the rotation curve anomaly and aligns with cosmological models of structure formation, it remains deeply unsatisfactory to some physicists due to the lack of direct detection. Alternative theories, such as Modified Newtonian Dynamics (MOND), attempt to dispense with dark matter entirely by proposing that the laws of gravity themselves operate differently at extremely low accelerations. However, MOND struggles to explain phenomena such as the Bullet Cluster, where gravitational lensing clearly indicates the presence of mass entirely separated from the visible gas.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'According to the passage, which of the following is true of Modified Newtonian Dynamics (MOND)?',
        options: [
          'A) It provides a more comprehensive explanation of the Bullet Cluster than the dark matter hypothesis does.',
          'B) It relies on the existence of invisible matter that does not emit electromagnetic radiation.',
          'C) It posits a modification to established physical laws to account for galactic rotation curves.',
          'D) It is widely accepted by astrophysicists as a replacement for cosmological models of structure formation.',
          'E) It suggests that the laws of gravity operate differently at extremely high velocities.'
        ],
        answer: 'C',
        explanation: 'The passage states that MOND attempts to dispense with dark matter "by proposing that the laws of gravity themselves operate differently at extremely low accelerations." Therefore, C is correct.'
      },
      {
        id: 'q2',
        type: 'select-in-passage',
        question: 'Select the sentence that identifies an observational phenomenon that alternative theories to dark matter fail to adequately explain.',
        options: [
          'Observations of galactic rotation curves in the 1970s revealed a profound anomaly: stars at the peripheries of spiral galaxies orbit at velocities far exceeding what could be accounted for by the gravitational pull of visible matter alone.',
          'To explain this discrepancy, astrophysicists postulated the existence of "dark matter," an invisible substance that does not interact with electromagnetic radiation but exerts a significant gravitational influence.',
          'While the dark matter hypothesis elegantly resolves the rotation curve anomaly and aligns with cosmological models of structure formation, it remains deeply unsatisfactory to some physicists due to the lack of direct detection.',
          'Alternative theories, such as Modified Newtonian Dynamics (MOND), attempt to dispense with dark matter entirely by proposing that the laws of gravity themselves operate differently at extremely low accelerations.',
          'However, MOND struggles to explain phenomena such as the Bullet Cluster, where gravitational lensing clearly indicates the presence of mass entirely separated from the visible gas.'
        ],
        answer: 4,
        explanation: 'The final sentence explicitly states that MOND (an alternative theory) "struggles to explain phenomena such as the Bullet Cluster," making it the correct choice.'
      }
    ]
  },
  {
    id: 'rc_4',
    title: 'Women in the American Revolution',
    subject: 'History',
    difficulty: 'Medium',
    length: 'Long',
    text: `Historical narratives of the American Revolution have traditionally marginalized the roles of women, relegating them to the periphery as passive observers or devoted wives maintaining the home front. However, recent historiography has emphasized that women were actively engaged in the political and economic upheavals of the era. The concept of "Republican Motherhood," which emerged post-independence, subtly shifted the societal understanding of women's civic duty. While it did not grant women formal political rights such as suffrage, it elevated their domestic roles by asserting that women were responsible for raising virtuous male citizens essential for the survival of the new republic. This ideology, while inherently restrictive by modern standards, paradoxically justified a demand for female education, arguing that mothers required formal schooling to adequately instruct their sons.\n\nMoreover, the economic boycotts that preceded the Revolution relied heavily on female participation. The success of the non-importation movements hinged on women\'s willingness to produce homespun cloth and abstain from purchasing British goods like tea. In this context, domestic consumption became a highly politicized act. By choosing homespun garments over imported silks, women transformed the private sphere of household management into a public arena of political resistance. Thus, while women were formally excluded from legislative assemblies, their economic actions and their prescribed roles as Republican Mothers constituted vital, albeit indirect, modes of political participation.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'The passage suggests that the concept of "Republican Motherhood" was paradoxical because it:',
        options: [
          'A) granted women the right to vote while still confining them to the home.',
          'B) encouraged women to participate in economic boycotts despite their lack of political power.',
          'C) restricted women to domestic roles but used those roles to justify expanding their educational opportunities.',
          'D) was promoted by traditional historians who otherwise ignored women\'s contributions to the Revolution.',
          'E) emphasized the importance of male citizens while ignoring the necessity of female civic engagement.'
        ],
        answer: 'C',
        explanation: 'The passage notes that the ideology of Republican Motherhood was "inherently restrictive... [but] paradoxically justified a demand for female education" because mothers needed schooling to instruct their sons. Choice (C) accurately reflects this paradox.'
      },
      {
        id: 'q2',
        type: 'multiple',
        question: 'According to the passage, the non-importation movements of the American Revolution: (Select all that apply)',
        options: [
          'A) would likely have failed without the active participation of women.',
          'B) resulted in the immediate granting of formal political rights to women.',
          'C) turned everyday household purchasing decisions into political statements.'
        ],
        answer: ['A', 'C'],
        explanation: 'A is supported by the statement that the success of the movements "hinged on women\'s willingness." C is supported by the statement that "domestic consumption became a highly politicized act." B is false; the passage explicitly states women were not granted formal political rights.'
      },
      {
        id: 'q3',
        type: 'select-in-passage',
        question: 'Select the sentence in the second paragraph that most directly explains how women utilized their traditional domestic roles to exert political influence prior to the Revolution.',
        options: [
          'Moreover, the economic boycotts that preceded the Revolution relied heavily on female participation.',
          'The success of the non-importation movements hinged on women\'s willingness to produce homespun cloth and abstain from purchasing British goods like tea.',
          'In this context, domestic consumption became a highly politicized act.',
          'By choosing homespun garments over imported silks, women transformed the private sphere of household management into a public arena of political resistance.',
          'Thus, while women were formally excluded from legislative assemblies, their economic actions and their prescribed roles as Republican Mothers constituted vital, albeit indirect, modes of political participation.'
        ],
        answer: 3,
        explanation: 'The fourth sentence explicitly connects their traditional domestic role ("private sphere of household management") with political influence ("public arena of political resistance") through the mechanism of "choosing homespun garments."'
      }
    ]
  },
  {
    id: 'rc_5',
    title: 'Critique of Modernist Architecture',
    subject: 'Humanities',
    difficulty: 'Medium',
    length: 'Short',
    text: `The architectural movement of high Modernism, championed in the mid-20th century by figures like Le Corbusier and Mies van der Rohe, sought to strip buildings of historical ornamentation, emphasizing functionalism, open floor plans, and the honest expression of industrial materials like steel and plate glass. This aesthetic, encapsulated in the maxim "form follows function," was initially hailed as a utopian break from the oppressive traditions of the past. However, postmodern critics later assailed high Modernism for producing sterile, monolithic structures that alienated inhabitants and ignored the surrounding urban context. According to these critics, the Modernist pursuit of universal, rational design resulted in a "placelessness" that stripped cities of their local character, culminating in housing projects that felt more like clinical filing cabinets for human beings than habitable communities.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'Which of the following would a postmodern critic of high Modernist architecture be most likely to advocate?',
        options: [
          'A) The exclusive use of modern industrial materials such as plate glass and steel.',
          'B) The removal of all historical ornamentation from urban public housing.',
          'C) The design of buildings that reflect and integrate with the specific cultural and historical context of their location.',
          'D) A strict adherence to the principle that a building\'s form should be dictated entirely by its functional purpose.',
          'E) The creation of universal, rational designs that can be replicated efficiently in any city globally.'
        ],
        answer: 'C',
        explanation: 'Postmodern critics assailed Modernism for causing "placelessness" and ignoring "surrounding urban context" and "local character." Therefore, they would most likely advocate for integrating designs with the specific context of their location.'
      },
      {
        id: 'q2',
        type: 'multiple',
        question: 'The passage suggests that the proponents of high Modernism believed their architectural style would: (Select all that apply)',
        options: [
          'A) liberate society from the burdensome architectural conventions of previous eras.',
          'B) foster a sense of "placelessness" by eliminating local architectural variations.',
          'C) visually reflect the true nature of the materials used in construction.'
        ],
        answer: ['A', 'C'],
        explanation: 'A is supported because Modernism was "hailed as a utopian break from the oppressive traditions of the past." C is supported by the mention of the "honest expression of industrial materials." B is incorrect; "placelessness" was a criticism leveled by postmodern critics, not a goal of the Modernist proponents.'
      }
    ]
  },
  {
    id: 'rc_6',
    title: 'Mycorrhizal Networks in Forests',
    subject: 'Science',
    difficulty: 'Medium',
    length: 'Short',
    text: `For decades, forest ecology was dominated by the paradigm of intense competition, viewing trees primarily as solitary individuals battling for sunlight, water, and soil nutrients. This perspective has been radically revised with the discovery of mycorrhizal networks—vast, subterranean webs of fungal mycelia that connect the root systems of most plants in a forest ecosystem. Far from merely competing, trees utilize these fungal networks to facilitate resource sharing. Older, deep-rooted "hub trees" can transfer excess carbon and water through the network to younger saplings growing in shaded areas, significantly increasing the saplings' survival rates. Furthermore, when a tree is attacked by pathogens or insects, it can transmit chemical warning signals through the fungal network, prompting neighboring trees to upregulate their own defensive enzymes before the threat reaches them.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'The passage characterizes the traditional view of forest ecology as one that:',
        options: [
          'A) recognized the existence of subterranean fungal webs but underestimated their complexity.',
          'B) focused exclusively on the defensive mechanisms trees employ against pathogens.',
          'C) incorrectly assumed that younger saplings rely entirely on older trees for survival.',
          'D) overemphasized the role of conflict and resource scarcity in plant interactions.',
          'E) anticipated the discovery of chemical warning signals between plants.'
        ],
        answer: 'D',
        explanation: 'The passage states that the traditional view was a "paradigm of intense competition, viewing trees primarily as solitary individuals battling for sunlight, water, and soil nutrients." This aligns with overemphasizing conflict (competition) and resource scarcity.'
      },
      {
        id: 'q2',
        type: 'select-in-passage',
        question: 'Select the sentence that provides evidence of cooperative behavior regarding the allocation of resources within a forest ecosystem.',
        options: [
          'For decades, forest ecology was dominated by the paradigm of intense competition, viewing trees primarily as solitary individuals battling for sunlight, water, and soil nutrients.',
          'This perspective has been radically revised with the discovery of mycorrhizal networks—vast, subterranean webs of fungal mycelia that connect the root systems of most plants in a forest ecosystem.',
          'Far from merely competing, trees utilize these fungal networks to facilitate resource sharing.',
          'Older, deep-rooted "hub trees" can transfer excess carbon and water through the network to younger saplings growing in shaded areas, significantly increasing the saplings\' survival rates.',
          'Furthermore, when a tree is attacked by pathogens or insects, it can transmit chemical warning signals through the fungal network, prompting neighboring trees to upregulate their own defensive enzymes before the threat reaches them.'
        ],
        answer: 3,
        explanation: 'The fourth sentence gives the specific evidence of resource allocation: "Older, deep-rooted \'hub trees\' can transfer excess carbon and water..."'
      }
    ]
  }
];

export const RC_PASSAGES = [...BASE_PASSAGES, ...RC_EXPANSION, ...RC_EXPANSION_2];

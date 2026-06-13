export const RC_EXPANSION_2 = [
  {
    id: 'rc_11',
    title: 'The Hawthorne Effect',
    subject: 'Social Science',
    difficulty: 'Medium',
    length: 'Short',
    text: `During the late 1920s, a series of productivity experiments were conducted at the Hawthorne Works near Chicago. Researchers sought to determine if altering physical working conditions, such as lighting levels, would impact worker efficiency. Curiously, productivity improved when lighting was increased, but it also improved when lighting was decreased. The researchers eventually concluded that the workers were not responding to the physical changes in their environment, but rather to the psychological stimulus of being observed. This phenomenon, later termed the "Hawthorne effect," profoundly impacted industrial psychology, illustrating that human subjects in an experiment may modify their behavior simply because they are aware they are being studied, thereby introducing a significant confounding variable into observational research.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'The passage implies that the initial design of the Hawthorne Works experiments:',
        options: [
          'A) failed to account for the psychological impact of observation on the subjects.',
          'B) intentionally deceived the workers regarding the purpose of the lighting changes.',
          'C) proved that physical environment is irrelevant to worker productivity.',
          'D) was conducted to support a pre-existing theory of industrial psychology.',
          'E) sought to demonstrate that decreased lighting improves concentration.'
        ],
        answer: 'A',
        explanation: 'APPROACH: Consider what the researchers initially sought to find versus what they actually found.\nSOLUTION: They initially sought to determine if "altering physical working conditions" impacted efficiency. They only "eventually concluded" that observation was the real cause.\nWHY CORRECT: (A) captures the fact that their initial design missed this psychological variable, which turned out to be the "confounding variable."'
      },
      {
        id: 'q2',
        type: 'vocabulary_in_context',
        question: 'As used in the passage, the phrase "confounding variable" refers to a factor that:',
        options: [
          'A) clarifies the relationship between cause and effect.',
          'B) introduces unintended error by influencing the outcome of an experiment.',
          'C) deliberately obscures the results of a study to protect subjects.',
          'D) causes psychological distress among experimental subjects.',
          'E) validates the original hypothesis of the researchers.'
        ],
        answer: 'B',
        explanation: 'APPROACH: Look at the context of "confounding variable."\nSOLUTION: The subjects modified their behavior because they knew they were being studied, meaning the researchers weren\'t actually measuring the effect of the lighting. This introduces an error into the observation.\nWHY CORRECT: (B) accurately describes a variable that interferes with the intended measurement of an experiment.'
      }
    ]
  },
  {
    id: 'rc_12',
    title: 'Neutrino Oscillation',
    subject: 'Science',
    difficulty: 'Hard',
    length: 'Short',
    text: `For much of the 20th century, the Standard Model of particle physics posited that neutrinos—subatomic particles with no electrical charge—were entirely massless. This assumption was challenged by the "solar neutrino problem," wherein detectors on Earth consistently observed only about one-third of the electron neutrinos predicted to be produced by nuclear fusion in the Sun. The discrepancy was ultimately resolved by the discovery of neutrino oscillation. Physicists demonstrated that as neutrinos travel through space, they periodically transition among three distinct "flavors": electron, muon, and tau. Because early detectors were only sensitive to the electron flavor, they missed the neutrinos that had oscillated into the other two forms during their transit. Crucially, quantum mechanics dictates that for a particle to oscillate between states, it must possess mass, forcing a significant revision of the Standard Model.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'Which of the following best describes the "solar neutrino problem"?',
        options: [
          'A) Detectors observed more neutrinos than solar models predicted.',
          'B) Neutrinos were found to possess mass, contradicting the Standard Model.',
          'C) Detectors failed to capture a significant portion of the electron neutrinos expected to arrive from the Sun.',
          'D) Neutrinos oscillated into forms that possessed electrical charge.',
          'E) Nuclear fusion in the Sun was found to produce muon and tau neutrinos instead of electron neutrinos.'
        ],
        answer: 'C',
        explanation: 'APPROACH: Locate the definition of the "solar neutrino problem" in the text.\nSOLUTION: The text states: "...detectors on Earth consistently observed only about one-third of the electron neutrinos predicted..."\nWHY CORRECT: (C) is a perfect paraphrase of this observation.'
      },
      {
        id: 'q2',
        type: 'multiple',
        question: 'It can be inferred from the passage that the discovery of neutrino oscillation:',
        options: [
          'A) demonstrated that neutrinos possess an electrical charge.',
          'B) required physicists to amend the Standard Model of particle physics.',
          'C) proved that early neutrino detectors were improperly calibrated.'
        ],
        answer: ['B'],
        explanation: 'APPROACH: Evaluate each option against the text.\nSOLUTION: The text states oscillation dictates the particle "must possess mass, forcing a significant revision of the Standard Model" (B is true). The text explicitly says neutrinos have "no electrical charge" (A is false). The early detectors weren\'t improperly calibrated; they were simply "only sensitive to the electron flavor" (C is false).'
      }
    ]
  },
  {
    id: 'rc_13',
    title: 'The Rosetta Stone and Decipherment',
    subject: 'History',
    difficulty: 'Medium',
    length: 'Short',
    text: `The discovery of the Rosetta Stone in 1799 provided the critical key for deciphering Egyptian hieroglyphics, a script that had remained unreadable for over a millennium. The stele featured a single decree inscribed in three distinct scripts: Ancient Egyptian hieroglyphics, Demotic script, and Ancient Greek. Because scholars could read Ancient Greek, they were able to use it as a translational pivot. Thomas Young made the initial breakthrough by identifying that the cartouches—oval enclosures within the hieroglyphic text—contained the phonetic spellings of royal names, specifically that of Ptolemy. Building on Young\'s phonetic insight, Jean-François Champollion systematically mapped the relationship between the hieroglyphic symbols and the Coptic language, definitively proving that hieroglyphics were not purely ideographic, as previously believed, but contained a complex mix of phonetic and symbolic elements.`,
    questions: [
      {
        id: 'q1',
        type: 'select-in-passage',
        question: 'Select the sentence that identifies a widespread misconception about Egyptian hieroglyphics that Champollion ultimately disproved.',
        options: [
          'The discovery of the Rosetta Stone in 1799 provided the critical key for deciphering Egyptian hieroglyphics, a script that had remained unreadable for over a millennium.',
          'The stele featured a single decree inscribed in three distinct scripts: Ancient Egyptian hieroglyphics, Demotic script, and Ancient Greek.',
          'Because scholars could read Ancient Greek, they were able to use it as a translational pivot.',
          'Thomas Young made the initial breakthrough by identifying that the cartouches—oval enclosures within the hieroglyphic text—contained the phonetic spellings of royal names, specifically that of Ptolemy.',
          'Building on Young\'s phonetic insight, Jean-François Champollion systematically mapped the relationship between the hieroglyphic symbols and the Coptic language, definitively proving that hieroglyphics were not purely ideographic, as previously believed, but contained a complex mix of phonetic and symbolic elements.'
        ],
        answer: 4,
        explanation: 'APPROACH: Look for a misconception that was disproved.\nSOLUTION: The final sentence states Champollion definitively proved that hieroglyphics "were not purely ideographic, as previously believed." This explicitly identifies the prior misconception.'
      },
      {
        id: 'q2',
        type: 'multiple',
        question: 'According to the passage, Thomas Young\'s contribution to the decipherment involved: (Select all that apply)',
        options: [
          'A) translating the Demotic script into Ancient Greek.',
          'B) recognizing that certain enclosed symbols represented the sounds of a specific ruler\'s name.',
          'C) mapping the entire hieroglyphic alphabet to the Coptic language.'
        ],
        answer: ['B'],
        explanation: 'APPROACH: Re-read the specific sentence about Thomas Young.\nSOLUTION: "Young made the initial breakthrough by identifying that the cartouches... contained the phonetic spellings of royal names, specifically that of Ptolemy."\nWHY CORRECT: (B) paraphrases this perfectly ("enclosed symbols" = cartouches, "sounds" = phonetic spellings, "ruler\'s name" = Ptolemy). A is not mentioned. C was done by Champollion, not Young.'
      }
    ]
  },
  {
    id: 'rc_14',
    title: 'Symbiosis in Coral Reefs',
    subject: 'Science',
    difficulty: 'Medium',
    length: 'Short',
    text: `Coral reefs are highly productive ecosystems despite often existing in nutrient-poor marine environments. This paradox is resolved by the obligate mutualistic relationship between the coral polyps (animals) and zooxanthellae, microscopic photosynthetic algae that reside within the polyps\' tissues. The coral provides the algae with a protected environment and compounds necessary for photosynthesis, such as carbon dioxide and metabolic waste. In return, the zooxanthellae supply the coral with up to 90% of its energy requirements through the products of photosynthesis, including glucose and amino acids. However, this delicate symbiosis is highly sensitive to thermal stress. When water temperatures rise even slightly above the seasonal maximum, the coral expels the algae—a phenomenon known as "coral bleaching"—which, if prolonged, invariably leads to the starvation and death of the coral host.`,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'The passage describes the relationship between coral polyps and zooxanthellae as "obligate" primarily to emphasize that:',
        options: [
          'A) the algae are required to perform photosynthesis for the coral.',
          'B) neither organism can survive long-term without the other in this environment.',
          'C) the coral forces the algae to reside within its tissues.',
          'D) the algae dictate the location where the coral reef develops.',
          'E) thermal stress inevitably breaks the biological bond between the two organisms.'
        ],
        answer: 'B',
        explanation: 'APPROACH: Determine the meaning of "obligate mutualistic relationship" in context.\nSOLUTION: "Obligate" means necessary or compulsory. The text states that if the algae is expelled, it "invariably leads to the starvation and death of the coral host." Thus, they need each other to survive.\nWHY CORRECT: (B) accurately reflects this biological dependency.'
      },
      {
        id: 'q2',
        type: 'multiple',
        question: 'Based on the passage, during a prolonged period of coral bleaching, a coral polyp will: (Select all that apply)',
        options: [
          'A) experience a severe deficit in its energy supply.',
          'B) increase its intake of nutrients directly from the surrounding water.',
          'C) eventually die due to lack of sustenance.'
        ],
        answer: ['A', 'C'],
        explanation: 'APPROACH: Analyze the consequences of coral bleaching according to the text.\nSOLUTION: The text says bleaching is when the coral "expels the algae" and that it "invariably leads to the starvation and death of the coral host." Because the algae provided 90% of its energy, losing it causes an energy deficit (A) and eventual death (C). The text never mentions the coral increasing nutrient intake from water (B).'
      }
    ]
  }
];

export const DAYS = [
  {
    day: 1, theme: "Ways of Speaking", date: "Apr 29, 2026",
    patterns: [
      "Pivot words signal CONTRAST: despite / although / yet / while / surprisingly",
      "Multi-blank TC: find evidence for each blank independently — don't bleed between blanks",
      "SE RULE: exactly 2 answers always — 1 correct word = 0 points on the real GRE",
    ],
    words: [
      { w: "TACITURN", pos: "adj", cluster: "Quiet", def: "Habitually silent; not fond of talking — a personality trait", ex: "The professor was so taciturn that students answered in single syllables.", tip: "Taciturn = permanent personality. Reticent = guarded about a specific topic." },
      { w: "RETICENT", pos: "adj", cluster: "Quiet", def: "Reluctant to speak, especially about personal feelings or opinions", ex: "She was reticent about her past, deflecting personal questions with ease.", tip: "Reticent = guarded about a specific topic — not a general personality trait." },
      { w: "LACONIC", pos: "adj", cluster: "Quiet", def: "Using very few words; brief to the point of seeming rude", ex: "His laconic reply — 'No.' — ended the debate immediately.", tip: "Laconic = style of speaking, not a personality trait like taciturn." },
      { w: "LOQUACIOUS", pos: "adj", cluster: "Loud", def: "Very talkative; loves to chat. Neutral connotation.", ex: "The loquacious tour guide narrated every building, every alley.", tip: "Loquacious = just very talkative (neutral). Garrulous = talkative AND annoying." },
      { w: "GARRULOUS", pos: "adj", cluster: "Loud", def: "Annoyingly talkative; rambling and hard to stop. Negative.", ex: "The garrulous neighbor cornered her for an hour about tomato plants.", tip: "Garrulous implies the listener is suffering. Loquacious is neutral." },
      { w: "VOLUBLE", pos: "adj", cluster: "Loud", def: "Talking fluently and at length; often impressive or captivating.", ex: "A voluble speaker, she could hold a room's attention for hours.", tip: "Voluble = talkative AND fluent AND impressive. Positive or neutral." },
      { w: "VERBOSE", pos: "adj", cluster: "Wordy", def: "Using more words than needed in speech or writing.", ex: "His verbose reports buried the key finding under three pages of preamble.", tip: "Verbose = more words than needed. Prolix = so wordy it's tedious (stronger)." },
      { w: "PROLIX", pos: "adj", cluster: "Wordy", def: "Tediously long and wordy; stronger and more negative than verbose.", ex: "The prolix legal document ran 200 pages for what could be said in 10.", tip: "Prolix implies the reader is exhausted. Use for extreme wordiness." },
      { w: "TERSE", pos: "adj", cluster: "Sharp", def: "Brief, almost brusque; fewer words than expected.", ex: "Her terse email — 'Done. Move on.' — left the team uneasy.", tip: "Terse = brief but can feel rude. Pithy = brief AND meaningful (positive)." },
      { w: "PITHY", pos: "adj", cluster: "Sharp", def: "Brief and full of meaning; concise and forcefully expressive — the ideal.", ex: "Her pithy remarks cut to the heart of every issue without wasting a word.", tip: "Pithy is always positive. 'A pithy summary' = high praise on the GRE." },
    ],
  },
  {
    day: 2, theme: "Ways of Criticizing", date: "May 3, 2026",
    patterns: [
      "Public/institutional = censure · lambaste · condemn · excoriate",
      "Personal/private = berate · upbraid · rebuke · reproach · admonish",
      "Excoriate = savage, prolonged, public/written — not a private conversation",
      "Berate = personal, angry, SUSTAINED — duration is always the tell",
    ],
    words: [
      { w: "REPROACH", pos: "v/n", cluster: "Gentle", def: "Disappointment-based criticism; backward-looking, often from someone who cares", ex: "His mother's quiet reproach stung more than any punishment.", tip: "Reproach = 'you disappointed me' (backward). Admonish = 'don't do this again' (forward)." },
      { w: "ADMONISH", pos: "v", cluster: "Gentle", def: "To gently warn or advise against something; corrective but not angry.", ex: "The judge admonished the defendant to stay out of trouble.", tip: "Admonish = caring forward-looking guidance. The admonisher wants improvement." },
      { w: "REBUKE", pos: "v/n", cluster: "Sharp", def: "A sharp, direct expression of disapproval — often public but personal.", ex: "The senator received a formal rebuke from the ethics committee.", tip: "Rebuke = sharp words from a person. Censure = formal institutional vote/action." },
      { w: "CENSURE", pos: "v/n", cluster: "Sharp", def: "Official, formal condemnation by a body or institution.", ex: "The UN voted to censure the nation for its human rights violations.", tip: "KEY: censure requires an institution. One person criticizing = rebuke, not censure." },
      { w: "UPBRAID", pos: "v", cluster: "Sharp", def: "To find fault with and scold; sharp but relatively brief.", ex: "She upbraided her assistant for the third time that week.", tip: "Upbraid is personal and sharp — but shorter than berate." },
      { w: "BERATE", pos: "v", cluster: "Harsh", def: "To scold angrily and at length; aggressive and sustained.", ex: "The chef berated the line cook loudly in front of the entire kitchen.", tip: "Berate = LONG + ANGRY + PERSONAL. Duration is the tell." },
      { w: "CASTIGATE", pos: "v", cluster: "Harsh", def: "To reprimand severely; implies the person deserved harsh punishment.", ex: "The editorial castigated the mayor for ignoring crumbling infrastructure.", tip: "Castigate implies the target earned the criticism. Often in editorials/written form." },
      { w: "LAMBASTE", pos: "v", cluster: "Harsh", def: "To attack or criticize with great energy; forceful and public.", ex: "Critics lambasted the film, calling it the worst release of the decade.", tip: "Lambaste = energetic public attack. Subject is a work, policy, or public action." },
      { w: "EXCORIATE", pos: "v", cluster: "Savage", def: "To criticize with extreme harshness; to flay verbally. Long, savage, often written.", ex: "The review excoriated the novel so brutally the author took a five-year break.", tip: "Excoriate literally = strip skin off. The manner is brutal. Usually written/public." },
      { w: "CONDEMN", pos: "v", cluster: "Savage", def: "To express complete moral disapproval; carries a sense of final verdict.", ex: "World leaders condemned the attack as a violation of international law.", tip: "Condemn = moral weight and finality. Less about manner, more about total verdict." },
    ],
  },
  {
    day: 3, theme: "Ways of Deceiving", date: "May 5, 2026",
    patterns: [
      "Fabricate (act of creating the false thing) vs Spurious (the quality of being fake)",
      "Sophistry (speech/reasoning) · Chicanery (scheme/plan) · Subterfuge (escape trick)",
      "Ingenious (clever) vs Ingenuous (naive) — one letter, constant GRE trap",
      "People-only words: mendacious · disingenuous · perfidious (never describe objects)",
    ],
    words: [
      { w: "MENDACIOUS", pos: "adj", cluster: "Liar", def: "Habitually lying; untruthful as a character trait", ex: "The mendacious politician fabricated so many stories his allies stopped believing him.", tip: "Mendacious = the person IS a liar by nature. People only — never describe objects." },
      { w: "FABRICATE", pos: "v", cluster: "Liar", def: "To invent a false story or piece of evidence", ex: "She fabricated an alibi so elaborate it took investigators weeks to unravel.", tip: "Fabricate on GRE = to falsely construct — not to make something physical." },
      { w: "SPURIOUS", pos: "adj", cluster: "Liar", def: "Not genuine; false, despite appearing legitimate", ex: "The researcher dismissed the study's spurious data.", tip: "Spurious = fake masquerading as real. For data, documents, claims — NOT for arguments." },
      { w: "PREVARICATE", pos: "v", cluster: "Evader", def: "To speak evasively; to avoid the truth without technically lying", ex: "When asked about the funds, the treasurer began to prevaricate.", tip: "Prevaricate ≠ lie. The person dances around the truth. Evades." },
      { w: "EQUIVOCATE", pos: "v", cluster: "Evader", def: "To use ambiguous language deliberately to avoid commitment", ex: "The candidate equivocated so both sides heard what they wanted.", tip: "Equivocate = deliberately vague. Prevaricate = evasive. Both avoid truth." },
      { w: "DISSEMBLE", pos: "v", cluster: "Evader", def: "To conceal true feelings, motives, or intentions behind a false appearance", ex: "She dissembled perfectly, smiling warmly while calculating her rival's downfall.", tip: "Dissemble = hide what's real inside. Outside doesn't match inside." },
      { w: "DUPLICITOUS", pos: "adj", cluster: "Manipulator", def: "Double-dealing; saying one thing while meaning or doing another", ex: "The duplicitous negotiator agreed to terms while quietly sabotaging the deal.", tip: "Duplicitous = two-faced. The 'dupli' root = double." },
      { w: "DISINGENUOUS", pos: "adj", cluster: "Manipulator", def: "Pretending to be naive or ignorant while actually knowing better", ex: "Her disingenuous claim of surprise fooled no one.", tip: "Disingenuous = pretends not to know what they know. People only." },
      { w: "GUILE", pos: "n", cluster: "Manipulator", def: "Sly, cunning intelligence used for deception; craftiness", ex: "The spy navigated the interrogation with remarkable guile.", tip: "Guile is a noun. Guileless = lacking guile = naive, innocent (also tested!)." },
      { w: "SUBTERFUGE", pos: "n", cluster: "Manipulator", def: "A trick or deception used to achieve a goal; a ruse used to escape", ex: "The company used legal subterfuge to avoid disclosing financial losses.", tip: "Subterfuge = the scheme or trick itself. Used to ESCAPE or AVOID a situation." },
      { w: "SPECIOUS", pos: "adj", cluster: "Logic", def: "Appears correct or logical on the surface but is actually flawed or false", ex: "His specious argument convinced the jury until an expert exposed the error.", tip: "Specious vs Spurious: Specious = sounds convincing (arguments). Spurious = fake/not genuine (data, docs)." },
      { w: "SOPHISTRY", pos: "n", cluster: "Logic", def: "Clever but deceptive reasoning; arguments that sound good but are logically flawed", ex: "The lawyer's closing statement was pure sophistry — persuasive but hollow.", tip: "Sophistry = mouth (deceptive reasoning). Chicanery = plan (scheme). Subterfuge = escape." },
      { w: "CHICANERY", pos: "n", cluster: "Logic", def: "Deception through trickery, manipulation, or dishonest means", ex: "The election was marred by chicanery — ballot stuffing, intimidation, fraud.", tip: "Chicanery = the whole scheme of tricks. Often for legal or political deception." },
      { w: "PERFIDIOUS", pos: "adj", cluster: "Betrayer", def: "Guilty of treachery or betrayal; deceitful in a way that violates trust", ex: "His perfidious betrayal — selling secrets to a rival — cost the company everything.", tip: "Perfidious = deception through BETRAYAL. There was trust, then it was violated." },
      { w: "INGENUOUS", pos: "adj", cluster: "Bonus", def: "Innocent, naive, candid, lacking guile — the opposite of disingenuous", ex: "Her ingenuous expression of surprise seemed genuine — she truly hadn't known.", tip: "INGENUOUS = naive/innocent. INGENIOUS = brilliantly clever. One letter. Constant GRE trap." },
    ],
  },
  {
    day: 4, theme: "Ways of Praising", date: "May 6, 2026",
    patterns: [
      "Sycophant (noun: the person) vs Obsequious (adjective: the quality) vs Fawn (verb: the act)",
      "Panegyric (grand but honest) vs Hagiography (grand AND blind/uncritical)",
      "Apotheosis = divine elevation OR the ultimate perfect example (both tested)",
      "Adulatory = adjective only — adulatory tone/coverage/reviews",
    ],
    words: [
      { w: "LAUD", pos: "v", cluster: "Genuine", def: "To praise highly; to commend. Sincere, formal praise.", ex: "The committee lauded the researcher's decade of work with its highest honor.", tip: "Laud = sincere, formal praise. Laudable = deserving praise. Both GRE tested." },
      { w: "EXTOL", pos: "v", cluster: "Genuine", def: "To praise enthusiastically and at length; stronger than laud.", ex: "She extolled the virtues of the new policy in every speech.", tip: "Extol = you actively and energetically champion something. More vigorous than laud." },
      { w: "ACCLAIM", pos: "v/n", cluster: "Genuine", def: "Enthusiastic public approval and praise.", ex: "The novel received widespread acclaim for its unflinching portrayal of grief.", tip: "Acclaim is often a noun. 'Critical acclaim' appears constantly in GRE RC passages." },
      { w: "VENERATE", pos: "v", cluster: "Genuine", def: "To regard with deep respect and reverence; almost sacred admiration.", ex: "The community venerated the elder statesman, treating his words as near gospel.", tip: "Venerate = quasi-religious weight. Revere = deep but earthly." },
      { w: "REVERE", pos: "v", cluster: "Genuine", def: "To feel deep respect and admiration for; slightly less than venerate.", ex: "Students revered the professor for his genuine curiosity.", tip: "Revere is deep but earthly. Venerate carries quasi-religious, near-untouchable weight." },
      { w: "ENCOMIUM", pos: "n", cluster: "Formal", def: "A formal speech or writing that praises someone highly; a tribute.", ex: "The retiring dean received a glowing encomium from each of her former students.", tip: "Encomium = the document or speech itself. Noun only. Spelling: EN-CO-MIUM." },
      { w: "PANEGYRIC", pos: "n", cluster: "Formal", def: "An elaborate, formal public praise — grander than encomium.", ex: "The senator's panegyric for the war hero lasted forty minutes.", tip: "Panegyric = grander and more public than encomium. Think state funeral speeches." },
      { w: "EULOGIZE", pos: "v", cluster: "Formal", def: "To praise highly in speech or writing; not exclusively at funerals.", ex: "The biographer eulogized the architect's career without acknowledging controversies.", tip: "GRE uses eulogize outside funeral contexts — watch for it in RC about biographies." },
      { w: "HAGIOGRAPHY", pos: "n", cluster: "Formal", def: "A biography that idealizes its subject; uncritical, worshipful writing.", ex: "The authorized biography read more like hagiography than honest history.", tip: "Hagiography = writing about saints. Any excessively worshipful account." },
      { w: "APOTHEOSIS", pos: "n", cluster: "Formal", def: "Elevation to divine status; OR the ultimate perfect example of something.", ex: "The film's final scene represented the apotheosis of the director's career.", tip: "Two GRE uses: (1) glorification to god-like status, (2) the ultimate perfect example." },
      { w: "LIONIZE", pos: "v", cluster: "Excessive", def: "To treat someone as a celebrity or hero, often excessively.", ex: "The media lionized the young athlete before he had won a single major title.", tip: "Lionize = the public or press elevating someone beyond what they've earned." },
      { w: "ADULATORY", pos: "adj", cluster: "Excessive", def: "Excessively praising; fawning. Modifies nouns.", ex: "The adulatory press coverage embarrassed even the candidate herself.", tip: "Adulatory modifies nouns — adulatory reviews, adulatory coverage, adulatory tone." },
      { w: "FAWN", pos: "v", cluster: "Excessive", def: "To seek favor through excessive flattery; to be servile.", ex: "The new associate fawned over the senior partner so obviously colleagues cringed.", tip: "Fawn = active behavior — you're doing something sycophantic. Watch for it as a verb." },
      { w: "SYCOPHANT", pos: "n", cluster: "Excessive", def: "A person who flatters powerful people to gain favor; a yes-man.", ex: "The board was surrounded by sycophants who approved every decision.", tip: "Sycophant = noun for the person. Sycophantic = adjective. Both GRE tested." },
      { w: "OBSEQUIOUS", pos: "adj", cluster: "Excessive", def: "Excessively eager to please or obey; fawning to a servile degree.", ex: "His obsequious manner — always agreeing, always complimenting — made him impossible to trust.", tip: "Obsequious is stronger and more negative than sycophantic. Most extreme." },
    ],
  },
  {
    day: 5, theme: "Negative Personality Traits", date: "May 7, 2026",
    patterns: [
      "On a whim / impulsive / without warning in the clue = CAPRICIOUS or MERCURIAL",
      "Truculent/bellicose/pugnacious = people only, never policies or decisions",
      "Querulous = habitual complaining only — not defiance, not independence",
      "Intransigent = formal negotiation context · Obdurate = moral hardness",
    ],
    words: [
      { w: "OBSTINATE", pos: "adj", cluster: "Stubborn", def: "Stubbornly refusing to change opinion or behavior; pig-headed.", ex: "His obstinate refusal to see a doctor cost him months of treatable pain.", tip: "Obstinate = plain stubborn, no extra connotation. The most neutral of the cluster." },
      { w: "OBDURATE", pos: "adj", cluster: "Stubborn", def: "Stubbornly refusing to change despite pressure; morally hardened.", ex: "The obdurate negotiator refused every compromise even as the deal collapsed.", tip: "OBDURate = OBSTacle that is DURable. Morally hardened. Emotional appeals bounce off." },
      { w: "INTRANSIGENT", pos: "adj", cluster: "Stubborn", def: "Unwilling to compromise on any point; completely inflexible.", ex: "The union's intransigent position made any settlement impossible.", tip: "Intransigent = political/formal stubbornness. Used in negotiation contexts." },
      { w: "RECALCITRANT", pos: "adj", cluster: "Stubborn", def: "Stubbornly resistant to authority or discipline; defiant.", ex: "The recalcitrant student refused every attempt at mentorship.", tip: "Recalcitrant = stubbornness specifically against authority." },
      { w: "TRUCULENT", pos: "adj", cluster: "Aggressive", def: "Eager or quick to argue or fight; aggressively defiant.", ex: "The truculent witness argued with every question the attorney posed.", tip: "Truculent = spoiling for a fight. About people — never policies or decisions." },
      { w: "BELLICOSE", pos: "adj", cluster: "Aggressive", def: "Demonstrating aggression and willingness to fight; war-like.", ex: "The general's bellicose rhetoric alarmed diplomats hoping for peace.", tip: "Bellicose = military-flavored aggression. 'Belli' root = war (bellum in Latin)." },
      { w: "PUGNACIOUS", pos: "adj", cluster: "Aggressive", def: "Eager to argue, quarrel, or fight; combative — loves the fight itself.", ex: "The pugnacious critic picked fights with every author he reviewed.", tip: "'Pugn' root = fist. Think pugilist (boxer). Loves the fight itself." },
      { w: "FRACTIOUS", pos: "adj", cluster: "Aggressive", def: "Irritable and quarrelsome; hard to control in a group setting.", ex: "The fractious committee couldn't agree on a single agenda item.", tip: "Fractious = quarrelsome in a group. Often describes committees, crowds, factions." },
      { w: "IRASCIBLE", pos: "adj", cluster: "Aggressive", def: "Having a hot temper; easily provoked to anger.", ex: "The irascible editor snapped at staff for the smallest errors.", tip: "Irascible = the hair trigger. Anger comes fast and easily." },
      { w: "PETULANT", pos: "adj", cluster: "Moody", def: "Childishly sulky or bad-tempered when things don't go their way.", ex: "The petulant executive stormed out when his proposal was questioned.", tip: "PETULANT = Pouting. Childish immature tantrum. P = Petulant = childish." },
      { w: "QUERULOUS", pos: "adj", cluster: "Moody", def: "Complaining in a whining way; habitually finding fault.", ex: "The querulous patient complained about everything from the food to the lighting.", tip: "QUERULOUS = QUERy everything = habitual complaining. Low-level constant dissatisfaction." },
      { w: "CAPRICIOUS", pos: "adj", cluster: "Moody", def: "Given to sudden unpredictable changes of mood or behavior; whimsical.", ex: "The capricious director changed the script so often actors gave up memorizing.", tip: "'On a whim' or 'impulsive' in the clue = CAPRICIOUS. Random impulsive changes." },
      { w: "MERCURIAL", pos: "adj", cluster: "Moody", def: "Subject to sudden unpredictable mood changes; volatile but often brilliant.", ex: "Her mercurial temperament made her both thrilling and exhausting to work with.", tip: "Mercurial = brilliant alongside instability. Capricious = random changes (no brilliance implied)." },
      { w: "VOLATILE", pos: "adj", cluster: "Moody", def: "Liable to change rapidly and unpredictably, especially for the worse; explosive.", ex: "The volatile political climate made long-term planning nearly impossible.", tip: "Volatile = most extreme instability. Can describe people, situations, or markets." },
      { w: "WAYWARD", pos: "adj", cluster: "Lone", def: "Difficult to control; following one's own path against expectation.", ex: "The wayward student ignored every guideline and somehow produced brilliant work.", tip: "Wayward = going own direction. Less negative than others — sometimes used fondly." },
    ],
  },
  {
    day: 6, theme: "Positive Personality Traits", date: "May 8, 2026",
    patterns: [
      "Astute = street smart, reads situations · Perspicacious = analytical perception · Sagacious = elder wisdom",
      "Affable = actively draws people in · Genial = cheerful host warmth · Gregarious = loves groups",
      "Magnanimous = noble spirit (shares glory) · Altruistic = selfless (zero gain) · Philanthropic = organized giving",
      "Munificent = extreme financial liberality — always about money or material gifts",
    ],
    words: [
      { w: "MAGNANIMOUS", pos: "adj", cluster: "Generous", def: "Generous and forgiving, especially toward a rival; noble-spirited.", ex: "The magnanimous victor offered his defeated opponent a handshake and a seat at the table.", tip: "Magnanimous = nobility of spirit from a position of power. Magna root = great." },
      { w: "MUNIFICENT", pos: "adj", cluster: "Generous", def: "Larger than expected in generosity; extremely liberal in giving.", ex: "The munificent donor funded the entire hospital wing without being asked.", tip: "Munificent = financial generosity specifically. The munus root = gift." },
      { w: "BENEVOLENT", pos: "adj", cluster: "Generous", def: "Well-meaning and kindly; desiring good for others.", ex: "The benevolent administrator quietly waived fees for students who couldn't afford them.", tip: "Benevolent = good intentions + kind actions. The bene root = good." },
      { w: "ALTRUISTIC", pos: "adj", cluster: "Generous", def: "Selflessly concerned with the wellbeing of others; zero personal gain.", ex: "Her altruistic decision to donate her salary surprised everyone.", tip: "Altruistic = selflessness is the defining feature. No personal gain whatsoever." },
      { w: "PHILANTHROPIC", pos: "adj", cluster: "Generous", def: "Promoting welfare of others through organized, large-scale giving.", ex: "The philanthropic foundation funded schools across three continents.", tip: "Philanthropic = organized, large-scale benevolence. More institutional than altruistic." },
      { w: "INTREPID", pos: "adj", cluster: "Brave/Wise", def: "Fearless and adventurous; actively moving toward danger.", ex: "The intrepid journalist filed reports from the front line without flinching.", tip: "Root: in (not) + trepidus (alarmed) = not alarmed. Active fearlessness." },
      { w: "SAGACIOUS", pos: "adj", cluster: "Brave/Wise", def: "Having keen mental discernment and good judgment; wise through experience.", ex: "The sagacious investor saw the market crash coming two years early.", tip: "Sagacious = wise judgment (elder wisdom). Perspicacious = sharp perception (analytical)." },
      { w: "PERSPICACIOUS", pos: "adj", cluster: "Brave/Wise", def: "Having ready insight; seeing what others consistently miss.", ex: "The perspicacious editor spotted the flaw that three reviewers had missed.", tip: "Perspicacious SEES · Sagacious DECIDES. Root: perspicere = to see through." },
      { w: "INGENIOUS", pos: "adj", cluster: "Brave/Wise", def: "Clever, original, and inventive; finding elegant solutions to hard problems.", ex: "The ingenious engineer solved a decade-old problem with a simple design.", tip: "INGENIOUS = brilliantly clever. INGENUOUS = innocent/naive. One letter. Both GRE tested." },
      { w: "ASTUTE", pos: "adj", cluster: "Brave/Wise", def: "Accurately assessing situations; practically shrewd in the real world.", ex: "Her astute reading of the political climate helped her avoid every pitfall.", tip: "Astute = street smart, reads situations. Perspicacious = analytically sharp." },
      { w: "AFFABLE", pos: "adj", cluster: "Sociable", def: "Friendly and easy to talk to; actively welcoming to others.", ex: "The affable professor remembered every student's name and always had time for questions.", tip: "Root: affari = easy to speak to. Affable people actively draw others in." },
      { w: "AMIABLE", pos: "adj", cluster: "Sociable", def: "Generally pleasant and likeable; easy to get along with.", ex: "Her amiable disposition made her the natural choice to lead negotiations.", tip: "Affable = actively draws people in · Amiable = generally pleasant to be around." },
      { w: "GENIAL", pos: "adj", cluster: "Sociable", def: "Friendly, cheerful, and warmly cordial — especially in social/hosting settings.", ex: "The genial host made every guest feel like the most important person in the room.", tip: "Root: genialis = festive, joyful. Genial = cheerful host energy." },
      { w: "GREGARIOUS", pos: "adj", cluster: "Sociable", def: "Fond of company; thriving in and energized by groups.", ex: "The gregarious salesman was energized by crowds while his partner dreaded them.", tip: "Root: grex = flock. Gregarious people need their flock. Opposite of taciturn." },
      { w: "CONVIVIAL", pos: "adj", cluster: "Sociable", def: "Fond of feasting, celebration, and good company; festive and lively.", ex: "The convivial atmosphere at the reunion made even shy attendees open up.", tip: "Root: con + vivere = living together joyfully. Sociable specifically in celebratory settings." },
    ],
  },
  {
    day: 7, theme: "Arrogance & Boldness", date: "May 10, 2026",
    patterns: [
      "Hubris = dangerous pride that leads to downfall — always preceded by a fall in GRE",
      "Pompous (self-important manner) vs Bombastic (inflated language specifically)",
      "Audacious (bold + admirable) vs Brazen (bold + shameless/shocking)",
      "Grandiose (extravagant scale) vs Ostentatious (deliberate display to impress)",
    ],
    words: [
      { w: "HUBRIS", pos: "n", cluster: "Arrogant", def: "Excessive pride leading to downfall; arrogance that invites punishment.", ex: "The CEO's hubris — convinced no competitor could touch him — blinded him to collapse.", tip: "In Greek tragedy hubris ALWAYS precedes the fall. GRE uses it this way." },
      { w: "IMPERIOUS", pos: "adj", cluster: "Arrogant", def: "Assuming power without justification; domineering and arrogant.", ex: "Her imperious manner — issuing commands rather than requests — alienated every colleague.", tip: "Acts like an emperor when they have NO right to command." },
      { w: "HAUGHTY", pos: "adj", cluster: "Arrogant", def: "Blatantly and disdainfully proud; looking down on others with contempt.", ex: "The haughty aristocrat barely acknowledged the staff who served him.", tip: "The nose is literally in the air. Visible contempt for those below." },
      { w: "SUPERCILIOUS", pos: "adj", cluster: "Arrogant", def: "Behaving as if superior to others; coolly contemptuous.", ex: "His supercilious smirk whenever someone disagreed made meetings unbearable.", tip: "Root: supercilium = eyebrow. The raised eyebrow of contempt." },
      { w: "INSOLENT", pos: "adj", cluster: "Arrogant", def: "Showing rude and arrogant lack of respect toward superiors.", ex: "The insolent intern dismissed his manager's feedback with a wave of his hand.", tip: "Always directed UPWARD — toward someone with authority over you." },
      { w: "VAINGLORIOUS", pos: "adj", cluster: "Arrogant", def: "Excessively proud; boastful with no real substance behind the glory.", ex: "The vainglorious general claimed sole credit for a victory won by thousands.", tip: "The glory is EMPTY. Vain = empty. All boast, no substance." },
      { w: "POMPOUS", pos: "adj", cluster: "Arrogant", def: "Affectedly grand and self-important; inflated sense of dignity.", ex: "His pompous speech — full of grand pronouncements — bored the audience to tears.", tip: "Self-important to the point of being ridiculous. Often describes manner or speech." },
      { w: "BOMBASTIC", pos: "adj", cluster: "Arrogant", def: "High-sounding language with little meaning; inflated and pretentious speech.", ex: "The politician's bombastic rhetoric impressed no one who examined the substance.", tip: "About LANGUAGE specifically — hot air dressed up as important words." },
      { w: "PRETENTIOUS", pos: "adj", cluster: "Arrogant", def: "Claiming greater importance or merit than actually possessed.", ex: "The pretentious filmmaker insisted his action movie was high art.", tip: "The GAP between what you claim and what you've earned." },
      { w: "OSTENTATIOUS", pos: "adj", cluster: "Arrogant", def: "Characterized by excessive display designed to impress others.", ex: "The ostentatious mansion — gold fixtures, a moat, a helipad — struck visitors as insecure.", tip: "Deliberately showing off wealth or knowledge. DISPLAY is the key word." },
      { w: "AUDACIOUS", pos: "adj", cluster: "Bold", def: "Showing willingness to take bold risks; daringly original.", ex: "The audacious startup challenged three industry giants simultaneously — and won.", tip: "Boldness that earns ADMIRATION. Usually positive or neutral." },
      { w: "BRAZEN", pos: "adj", cluster: "Bold", def: "Bold in a shocking or shameless way; without moral restraint.", ex: "The brazen thief stole the painting in broad daylight while security watched.", tip: "Audacious but SHAMELESS. The boldness shocks or offends." },
      { w: "PRESUMPTUOUS", pos: "adj", cluster: "Bold", def: "Failing to observe proper limits; going beyond what is appropriate.", ex: "It was presumptuous of the intern to rewrite the senior partner's brief.", tip: "OVERSTEPPING your position. Assumes permissions you don't have." },
      { w: "GRANDIOSE", pos: "adj", cluster: "Bold", def: "Impressively large or elaborate but often lacking substance; extravagantly ambitious.", ex: "His grandiose plans to revolutionize three industries struck investors as delusional.", tip: "Scale WITHOUT substance. Ambition vastly outstrips reality." },
      { w: "MAGNILOQUENT", pos: "adj", cluster: "Bold", def: "Using high-flown extravagant language; grandly eloquent in a pompous way.", ex: "The magniloquent orator mistook flowery language for genuine insight.", tip: "Two roots: magna (Day 6) + loqui (Day 1). Great speech = hollow speech." },
    ],
  },
  {
    "day": 8,
    "theme": "Caution & Restraint",
    "date": "May 12, 2026",
    "patterns": [
      "Circumspect = surveys all angles (root: look around) · Prudent = practical forward-thinking",
      "Wary (alert to danger) vs Chary (reluctant and sparing) — both cautious, different flavor",
      "Frugal (economical by choice) vs Parsimonious (meanly tight-fisted — negative)",
      "Sober on GRE = serious and realistic — rarely about alcohol"
    ],
    "words": [
      { "w": "CIRCUMSPECT", "pos": "adj", "cluster": "Careful", "def": "Wary and unwilling to take risks; considering all circumstances before acting", "ex": "The circumspect diplomat refused to sign anything without consulting three advisors.", "tip": "Root: circum (around) + specere (to look) = look all around before acting." },
      { "w": "PRUDENT", "pos": "adj", "cluster": "Careful", "def": "Acting with care and thought for the future; sensible and wise in practical matters", "ex": "Her prudent decision to save six months of expenses proved wise when the layoffs came.", "tip": "Prudent = practical forward-thinking caution. Most common GRE word in this cluster." },
      { "w": "JUDICIOUS", "pos": "adj", "cluster": "Careful", "def": "Having or showing sound judgment; sensible and well-considered", "ex": "The judicious use of resources allowed the small team to outperform much larger rivals.", "tip": "Judicious = actively wise judgment in a specific decision. Not just cautious." },
      { "w": "DISCREET", "pos": "adj", "cluster": "Careful", "def": "Careful and circumspect in speech or actions; avoiding embarrassment or harm", "ex": "The discreet assistant never mentioned what she overheard in the boardroom.", "tip": "Discreet = careful about privacy and tact. Often about keeping things confidential." },
      { "w": "GUARDED", "pos": "adj", "cluster": "Careful", "def": "Cautious and having possible reservations; not giving much away", "ex": "His guarded response to the journalist's questions revealed nothing of substance.", "tip": "Guarded = careful about what you reveal. Close to reticent but broader in scope." },
      { "w": "WARY", "pos": "adj", "cluster": "Wary", "def": "Feeling or showing caution about possible dangers; alert and on guard", "ex": "She was wary of signing the contract without legal counsel.", "tip": "Wary = specifically alert to potential danger or deception." },
      { "w": "CHARY", "pos": "adj", "cluster": "Wary", "def": "Cautiously reluctant to do something; sparing in giving", "ex": "The seasoned investor was chary of putting money into unproven ventures.", "tip": "Wary = alert to danger · Chary = reluctant and sparing. More restrained than wary." },
      { "w": "VIGILANT", "pos": "adj", "cluster": "Wary", "def": "Keeping careful watch for possible danger or difficulties; actively watchful", "ex": "The vigilant security team caught the breach before any data was compromised.", "tip": "Vigilant = active ongoing watchfulness. More intense than wary." },
      { "w": "TEMPERATE", "pos": "adj", "cluster": "Restrained", "def": "Showing moderation and self-restraint; not extreme in behavior or expression", "ex": "Her temperate response to the provocation surprised those who expected outrage.", "tip": "Temperate = emotional and behavioral moderation. The opposite of volatile." },
      { "w": "MEASURED", "pos": "adj", "cluster": "Restrained", "def": "Having careful consideration; restrained and deliberate in speech or movement", "ex": "The CEO issued a measured statement acknowledging the problem without inflaming it.", "tip": "Measured = calculated restraint especially in speech. Often signals intelligence." },
      { "w": "SOBER", "pos": "adj", "cluster": "Restrained", "def": "Serious, sensible, and controlled; not exaggerated or extreme", "ex": "The analyst offered a sober assessment that cut through the hype surrounding the stock.", "tip": "Sober on GRE = serious, controlled, realistic — rarely means alcohol-free." },
      { "w": "RESTRAINED", "pos": "adj", "cluster": "Restrained", "def": "Characterized by reserve or moderation; deliberately holding back", "ex": "His restrained eulogy was more moving precisely because it refused easy sentiment.", "tip": "Restrained = deliberately holding back. The deliberateness distinguishes it." },
      { "w": "FRUGAL", "pos": "adj", "cluster": "Frugal", "def": "Sparing or economical with money or resources; not wasteful", "ex": "The frugal billionaire flew coach and bought second-hand clothes.", "tip": "Frugal = economical by choice and habit. Not poverty — a deliberate value." },
      { "w": "ABSTEMIOUS", "pos": "adj", "cluster": "Frugal", "def": "Not self-indulgent, especially with food and drink; restrained in consumption", "ex": "The abstemious monk ate one simple meal a day and drank only water.", "tip": "Abstemious = restraint in consumption specifically. More extreme than frugal." },
      { "w": "PARSIMONIOUS", "pos": "adj", "cluster": "Frugal", "def": "Extremely unwilling to spend money; excessively frugal to the point of meanness", "ex": "The parsimonious landlord refused to replace the broken heating even in winter.", "tip": "Parsimonious = frugal gone too far. Negative — meanness disguised as economy." }
    ]
  },
  {
    "day": 9,
    "theme": "Words About Change",
    "date": "May 13, 2026",
    "patterns": [
      "Transient/Ephemeral/Evanescent/Transitory = all mean short-lived — distinguished by degree and context",
      "Immutable (can never change) vs Steadfast (chooses not to change) — external vs internal",
      "Protean = changes FORM to adapt (positive/neutral) — not the same as being fickle",
      "Vacillate = mentally wavering between choices · Fluctuate = up-and-down movement of things"
    ],
    "words": [
      { "w": "TRANSIENT", "pos": "adj/n", "cluster": "Fleeting", "def": "Lasting only for a short time; passing quickly", "ex": "The transient nature of fame meant yesterday's celebrity was today's forgotten face.", "tip": "Transient = short duration, often implies passing through. Can describe people (transient workers) or states." },
      { "w": "EPHEMERAL", "pos": "adj", "cluster": "Fleeting", "def": "Lasting for a very short time; short-lived", "ex": "The ephemeral beauty of cherry blossoms draws millions precisely because it fades so fast.", "tip": "Ephemeral is the GRE's favorite 'short-lived' word. Root: epi (on) + hemera (day) = lasting only a day." },
      { "w": "EVANESCENT", "pos": "adj", "cluster": "Fleeting", "def": "Soon passing out of sight or memory; quickly fading or disappearing", "ex": "The evanescent mist dissolved within minutes of the sun appearing.", "tip": "Evanescent = fading as you try to grasp it. More poetic than ephemeral. Often used for memories, feelings, light." },
      { "w": "TRANSITORY", "pos": "adj", "cluster": "Fleeting", "def": "Not permanent; lasting only for a short time", "ex": "The CEO warned staff that the upturn in profits was transitory, not structural.", "tip": "Transitory ≈ transient but used more for states and phases. 'Transitory phase' is a common GRE collocation." },
      { "w": "FLEETING", "pos": "adj", "cluster": "Fleeting", "def": "Lasting for a very short time; passing swiftly", "ex": "She caught a fleeting glimpse of the figure before it vanished into the crowd.", "tip": "Fleeting = very brief moment. Less formal than ephemeral but GRE uses it in RC passages." },
      { "w": "IMMUTABLE", "pos": "adj", "cluster": "Stable", "def": "Unchanging over time; unable to be changed", "ex": "The laws of physics are immutable — no amount of wishful thinking alters them.", "tip": "Immutable = CANNOT change. Root: im (not) + mutare (to change). External constraint." },
      { "w": "STEADFAST", "pos": "adj", "cluster": "Stable", "def": "Resolutely firm and unwavering; refusing to change despite pressure", "ex": "Despite intense criticism, she remained steadfast in her conviction that the policy was right.", "tip": "Steadfast = CHOOSES not to change. Internal resolve. Positive connotation — admirable." },
      { "w": "MUTABLE", "pos": "adj", "cluster": "Changing", "def": "Liable to change; able to be altered", "ex": "Human nature, the philosopher argued, was far more mutable than people liked to believe.", "tip": "Mutable = capable of change. Root: mutare (to change). Neutral — just describes capacity for change." },
      { "w": "PROTEAN", "pos": "adj", "cluster": "Changing", "def": "Tending or able to change form to suit different situations; versatile", "ex": "The protean actress moved effortlessly from comedy to tragedy to action.", "tip": "Named after Proteus, Greek sea-god who changed shape at will. Protean = adaptable versatility — positive." },
      { "w": "VICISSITUDE", "pos": "n", "cluster": "Changing", "def": "A change of circumstances or fortune, typically one that is unwelcome", "ex": "After the vicissitudes of a difficult decade, she finally found professional stability.", "tip": "Almost always plural: 'the vicissitudes of life/fate.' Implies difficult unpredictable changes." },
      { "w": "VACILLATE", "pos": "v", "cluster": "Changing", "def": "To waver between different opinions or actions; to be indecisive", "ex": "He vacillated for weeks before finally deciding to resign.", "tip": "Vacillate = mental wavering between CHOICES. Fluctuate = up-and-down movement of quantities." },
      { "w": "FLUCTUATE", "pos": "v", "cluster": "Changing", "def": "To rise and fall irregularly in number or amount; to vary", "ex": "Stock prices fluctuated wildly throughout the day before closing marginally higher.", "tip": "Fluctuate = irregular up-and-down movement. Usually for prices, temperatures, moods, numbers." },
      { "w": "FLUX", "pos": "n", "cluster": "Changing", "def": "The action or state of continuous change; unstable movement", "ex": "With the merger unresolved, the entire company was in a state of flux.", "tip": "'In a state of flux' = GRE's favorite phrase. Flux alone = noun meaning continuous change." },
      { "w": "INCONSTANT", "pos": "adj", "cluster": "Changing", "def": "Frequently changing; not faithful or dependable", "ex": "His inconstant affection — warm one week, distant the next — kept her perpetually unsettled.", "tip": "Inconstant = unreliable because always changing. Implies betrayal of trust. More negative than mutable." },
      { "w": "FITFUL", "pos": "adj", "cluster": "Changing", "def": "Active or occurring spasmodically; not regular or sustained", "ex": "Her fitful attempts at reform produced brief improvements followed by long relapses.", "tip": "Fitful = irregular, starts and stops. 'Fitful sleep' = waking repeatedly. Not continuous." }
    ]
  },
  {
    "day": 10,
    "theme": "Words About Support & Opposition",
    "date": "May 14, 2026",
    "patterns": [
      "SANCTION is a GRE contronym — means BOTH to officially approve AND to penalize. Read context carefully.",
      "Bolster/Buttress = strengthen something already existing · Advocate/Espouse = actively push for something",
      "Impugn (attack credibility) vs Refute (disprove with evidence) vs Gainsay (simply deny or contradict)",
      "Belie = give a false impression of — 'her smile belied her anger' = her smile contradicted/hid her anger"
    ],
    "words": [
      { "w": "ADVOCATE", "pos": "v/n", "cluster": "Support", "def": "To publicly recommend or support a cause; a person who pleads on behalf of another", "ex": "The senator advocated tirelessly for healthcare reform despite fierce opposition from her own party.", "tip": "Advocate as a verb = actively speak for. As a noun = a supporter or lawyer. Both GRE tested." },
      { "w": "ESPOUSE", "pos": "v", "cluster": "Support", "def": "To adopt or support a cause, belief, or way of life; to embrace publicly", "ex": "The philosopher had espoused radical pacifism since his twenties, never wavering even during wartime.", "tip": "Espouse = commit to and publicly identify with. Stronger than merely supporting — you make it your own." },
      { "w": "CHAMPION", "pos": "v/n", "cluster": "Support", "def": "To vigorously support or defend a person or cause; one who fights for a cause", "ex": "She championed the rights of undocumented workers long before it was politically fashionable.", "tip": "Champion as a verb = actively fight for. More vigorous and personal than advocate." },
      { "w": "BOLSTER", "pos": "v", "cluster": "Support", "def": "To support or strengthen something that already exists; to prop up", "ex": "The new data bolstered the argument that the treatment was effective, adding to earlier findings.", "tip": "Bolster = reinforce something already standing. Always strengthening an existing thing." },
      { "w": "BUTTRESS", "pos": "v/n", "cluster": "Support", "def": "To support or reinforce; to prop up an argument or structure", "ex": "The lawyer buttressed her case with three independent expert testimonies.", "tip": "Root: architectural buttress = wall support. Buttressing an argument = adding structural support." },
      { "w": "CORROBORATE", "pos": "v", "cluster": "Validate", "def": "To confirm or support a statement or theory with evidence; to make more certain", "ex": "Three witnesses corroborated the defendant's alibi, making the prosecution's case nearly impossible.", "tip": "Corroborate = confirm with ADDITIONAL evidence. Not just agree — provide new supporting proof." },
      { "w": "SUBSTANTIATE", "pos": "v", "cluster": "Validate", "def": "To provide evidence to prove the truth or existence of something", "ex": "The journalist spent months gathering documents to substantiate the allegations before publishing.", "tip": "Substantiate = make something substantial/real with proof. More formal than corroborate." },
      { "w": "VINDICATE", "pos": "v", "cluster": "Validate", "def": "To clear of blame or suspicion; to show a belief or claim to have been correct", "ex": "The DNA evidence vindicated him completely after twelve years of wrongful imprisonment.", "tip": "Vindicate = two meanings: (1) clear of blame, (2) prove you were right. Both GRE tested." },
      { "w": "RATIFY", "pos": "v", "cluster": "Validate", "def": "To give formal consent to; to make officially valid by signing or voting", "ex": "The Senate ratified the treaty after six months of contentious debate.", "tip": "Ratify = official institutional approval, usually of a treaty, law, or agreement." },
      { "w": "SANCTION", "pos": "v/n", "cluster": "Validate", "def": "To officially approve; OR a penalty imposed on a country or person", "ex": "The committee sanctioned the experiment; separately, economic sanctions were imposed on the regime.", "tip": "CRITICAL GRE TRAP: Sanction means BOTH to approve AND to punish. Read context very carefully." },
      { "w": "IMPUGN", "pos": "v", "cluster": "Oppose", "def": "To dispute the truth, validity, or honesty of; to call into question", "ex": "The defense attorney impugned the witness's credibility by revealing inconsistencies in prior testimony.", "tip": "Impugn = attack the credibility or integrity of something. Does not disprove — just casts doubt." },
      { "w": "GAINSAY", "pos": "v", "cluster": "Oppose", "def": "To deny or contradict; to speak against or oppose", "ex": "No one could gainsay the evidence — it was overwhelming and undisputed.", "tip": "Gainsay = simply deny or contradict. Less strong than refute — gainsay doesn't require proof." },
      { "w": "CONTRAVENE", "pos": "v", "cluster": "Oppose", "def": "To violate or conflict with a law, rule, or treaty", "ex": "The new regulation contravened existing international agreements, triggering immediate diplomatic protest.", "tip": "Contravene = go against a rule or law. More formal than 'violate.' Often in legal/formal contexts." },
      { "w": "REFUTE", "pos": "v", "cluster": "Oppose", "def": "To prove a statement or person to be wrong; to disprove with evidence", "ex": "The scientist refuted the hypothesis with three carefully controlled experiments.", "tip": "Refute = disprove WITH evidence. GRE often misuses it to mean 'deny' — on the GRE, refute = disprove." },
      { "w": "BELIE", "pos": "v", "cluster": "Oppose", "def": "To fail to give a true impression of something; to contradict or show to be false", "ex": "Her composed exterior belied the panic she felt as the deadline approached.", "tip": "Belie = the surface contradicts the reality. 'Her smile belied her fury' = smile hid/contradicted fury." }
    ]
  },
  {
    "day": 11,
    "theme": "Clarity vs Obscurity",
    "date": "May 15, 2026",
    "patterns": [
      "Lucid/Pellucid/Perspicuous = clear in meaning · Limpid = clear like still water (also used for prose)",
      "Esoteric (for a select group only) vs Arcane (ancient and secret) vs Recondite (obscure and unknown)",
      "Abstruse = difficult to understand (the content itself is hard) · Opaque = impenetrable to understanding",
      "Cryptic (coded, using hidden meaning) vs Enigmatic (mysterious, puzzling) vs Nebulous (vaguely unclear)"
    ],
    "words": [
      { "w": "LUCID", "pos": "adj", "cluster": "Clear", "def": "Expressed clearly and easy to understand; also: mentally clear and rational", "ex": "Her lucid explanation of quantum mechanics made the concept accessible even to non-scientists.", "tip": "Lucid = clear in two senses: clear writing AND clear thinking. 'A lucid mind' = sharp, rational." },
      { "w": "PELLUCID", "pos": "adj", "cluster": "Clear", "def": "Translucently clear; easily understood; of the highest clarity", "ex": "The judge praised the brief for its pellucid reasoning, calling it the clearest argument he had seen.", "tip": "Pellucid = even clearer than lucid. Often used for exceptional prose clarity. Root: per (through) + lucid." },
      { "w": "PERSPICUOUS", "pos": "adj", "cluster": "Clear", "def": "Clearly expressed and easily understood; transparent in meaning", "ex": "His perspicuous writing style made complex economic theory accessible to general readers.", "tip": "Perspicuous = clear expression (of writing/speech). Distinct from perspicacious = sharp perception." },
      { "w": "LIMPID", "pos": "adj", "cluster": "Clear", "def": "(of liquid) completely clear; (of writing) crystal clear and easy to understand", "ex": "The biographer's limpid prose made even the most complicated events in the statesman's life feel simple.", "tip": "Limpid = GRE uses this for both clear water AND clear prose. Always positive." },
      { "w": "COHERENT", "pos": "adj", "cluster": "Clear", "def": "Logical and consistent; clearly expressed and easy to follow", "ex": "Despite her exhaustion, she managed a surprisingly coherent account of the events.", "tip": "Coherent = logically holds together. An argument can be clear but incoherent if the logic doesn't connect." },
      { "w": "ABSTRUSE", "pos": "adj", "cluster": "Obscure", "def": "Difficult to understand; obscure in meaning because of complexity", "ex": "The philosopher's abstruse treatise was read only by specialists willing to untangle its dense arguments.", "tip": "Abstruse = the CONTENT is genuinely difficult. Not deliberately hidden — just intellectually demanding." },
      { "w": "RECONDITE", "pos": "adj", "cluster": "Obscure", "def": "Not known by many people; (of a subject) little known; obscure", "ex": "He impressed dinner guests with recondite knowledge of medieval Icelandic farming practices.", "tip": "Recondite = obscure because it's UNKNOWN to most people. Specialized, niche knowledge." },
      { "w": "ARCANE", "pos": "adj", "cluster": "Obscure", "def": "Understood by few; mysterious or secret; requiring special knowledge", "ex": "The contract contained arcane legal clauses that even experienced lawyers struggled to interpret.", "tip": "Arcane = mysterious and secret, often with an ancient or specialized origin. More mystical than recondite." },
      { "w": "ESOTERIC", "pos": "adj", "cluster": "Obscure", "def": "Intended for or likely to be understood by only a small number with specialized knowledge", "ex": "The journal's esoteric articles were written for academic specialists, not general readers.", "tip": "Esoteric = designed for an in-group. The knowledge is deliberately or necessarily limited to a few." },
      { "w": "OPAQUE", "pos": "adj", "cluster": "Obscure", "def": "Not transparent; not clear in meaning; hard to understand or make sense of", "ex": "The politician's opaque answers frustrated journalists who could extract no concrete meaning from them.", "tip": "Opaque = impenetrable to understanding. The opposite of transparent/lucid. Often used for language." },
      { "w": "CRYPTIC", "pos": "adj", "cluster": "Vague", "def": "Having a meaning that is mysterious or obscure; using code or hidden meaning", "ex": "Her cryptic final message — 'Look where you least expect the truth' — baffled investigators for years.", "tip": "Cryptic = deliberately encoded or hidden. There IS a meaning — it's just concealed." },
      { "w": "ENIGMATIC", "pos": "adj", "cluster": "Vague", "def": "Difficult to interpret or understand; mysterious; puzzling", "ex": "The enigmatic smile in the painting has prompted centuries of speculation about the subject's identity.", "tip": "Enigmatic = mysterious by nature — not necessarily hiding something, just hard to read or understand." },
      { "w": "AMBIGUOUS", "pos": "adj", "cluster": "Vague", "def": "Open to more than one interpretation; not having one obvious meaning", "ex": "The treaty's ambiguous language created loopholes that both sides later exploited.", "tip": "Ambiguous = multiple possible meanings. The GRE often pairs this with equivocal (deliberate ambiguity)." },
      { "w": "NEBULOUS", "pos": "adj", "cluster": "Vague", "def": "Not clearly defined or established; vague and ill-formed", "ex": "His business plan was too nebulous to attract investors — all vision, no specifics.", "tip": "Nebulous = vague and cloudy, like a nebula in space. Ideas are there but not clearly formed." },
      { "w": "CONVOLUTED", "pos": "adj", "cluster": "Vague", "def": "Extremely complex and difficult to follow; intricately and unnecessarily complicated", "ex": "The convoluted legal argument spanned forty pages and ultimately convinced no one.", "tip": "Convoluted = complex through excessive twisting and turning. Often implies unnecessarily complicated." }
    ]
  },
  {
    "day": 12,
    "theme": "Excess & Lack",
    "date": "May 17, 2026",
    "patterns": [
      "Profligate (reckless moral AND financial excess) vs Prodigal (recklessly wasteful of money/resources)",
      "Plethora/Surfeit/Glut = too much of something — distinguished by whether it's abstract, concrete, or market-related",
      "Paucity vs Dearth vs Scant: paucity = insufficient quantity · dearth = severe scarcity · scant = barely enough",
      "Superfluous (more than enough, therefore unnecessary) vs Redundant (repetitive and unnecessary)"
    ],
    "words": [
      { "w": "PROFLIGATE", "pos": "adj/n", "cluster": "Excessive", "def": "Recklessly extravagant and wasteful; lacking moral restraint; a person given to dissipation", "ex": "His profligate spending on yachts and private jets left the company technically bankrupt within three years.", "tip": "Profligate = both financial AND moral recklessness. The strongest excess word. Often used for public figures." },
      { "w": "PRODIGAL", "pos": "adj/n", "cluster": "Excessive", "def": "Spending money or resources recklessly; wastefully extravagant", "ex": "The prodigal heir burned through a century of family wealth in less than a decade.", "tip": "Prodigal = reckless financial waste. Root: prodigere (to drive away). The Prodigal Son = classic reference." },
      { "w": "INORDINATE", "pos": "adj", "cluster": "Excessive", "def": "Unusually or disproportionately large; exceeding reasonable limits", "ex": "She devoted an inordinate amount of time to perfecting the opening paragraph of a five-hundred-page novel.", "tip": "Inordinate = disproportionate to what's warranted. 'Inordinate amount of time/money/attention.'" },
      { "w": "EXORBITANT", "pos": "adj", "cluster": "Excessive", "def": "Unreasonably high in price or amount; grossly excessive", "ex": "The legal fees were so exorbitant that winning the case still left the plaintiff financially ruined.", "tip": "Exorbitant = almost always about price or cost. Root: ex (out of) + orbita (orbit) = out of all bounds." },
      { "w": "IMMODERATE", "pos": "adj", "cluster": "Excessive", "def": "Not sensible or restrained; excessive; going beyond what is acceptable", "ex": "His immoderate consumption of rich food and wine had predictable consequences for his health.", "tip": "Immoderate = lacking moderation/restraint. Applies to behavior, habits, emotions. Opposite of temperate." },
      { "w": "PLETHORA", "pos": "n", "cluster": "Abundance", "def": "A large or excessive amount of something; an overabundance", "ex": "The report cited a plethora of studies, but most were small-scale and methodologically weak.", "tip": "Plethora = excessive abundance, often implying more than needed or useful. Always a noun." },
      { "w": "SURFEIT", "pos": "n/v", "cluster": "Abundance", "def": "An excessive amount of something; to cause disgust through overindulgence", "ex": "After a surfeit of holiday celebrations, she welcomed the quiet austerity of January.", "tip": "Surfeit = excess that leads to satiation or disgust. More evocative than plethora — implies negative result." },
      { "w": "GLUT", "pos": "n/v", "cluster": "Abundance", "def": "An excessively large supply; to fill to excess; to supply far beyond demand", "ex": "A glut of cheap imports flooded the market, forcing domestic manufacturers to cut prices or close.", "tip": "Glut = almost always about markets or supply. 'A glut of oil/housing/labor.' Economic context is the tell." },
      { "w": "SUPERFLUOUS", "pos": "adj", "cluster": "Abundance", "def": "Unnecessary, especially through being more than enough; beyond what is needed", "ex": "The editor removed three superfluous chapters, tightening the narrative without losing any substance.", "tip": "Superfluous = extra, beyond what's needed. Root: super (above) + fluere (to flow) = overflowing." },
      { "w": "REDUNDANT", "pos": "adj", "cluster": "Abundance", "def": "No longer needed or useful; repetitive; repeating what has already been said", "ex": "The final paragraph was entirely redundant, repeating points made more effectively in the introduction.", "tip": "Redundant = repetitive AND unnecessary. In British English also means 'laid off from a job.'" },
      { "w": "PAUCITY", "pos": "n", "cluster": "Lacking", "def": "The presence of something only in small or insufficient quantities; scarcity", "ex": "The paucity of reliable evidence made any definitive conclusion impossible.", "tip": "Paucity = insufficient quantity. 'A paucity of evidence/resources/talent.' Always a noun." },
      { "w": "DEARTH", "pos": "n", "cluster": "Lacking", "def": "A scarcity or lack of something; a severe shortage", "ex": "There is a dearth of qualified nurses in rural hospitals — a crisis that has worsened for a decade.", "tip": "Dearth = more severe than paucity. Root: Old English 'dearthe' = famine. Implies genuine crisis-level lack." },
      { "w": "MEAGER", "pos": "adj", "cluster": "Lacking", "def": "Lacking in quantity or quality; deficient; insufficient", "ex": "The survivors subsisted on meager rations — a handful of crackers and shared water — for three days.", "tip": "Meager = both small in amount AND poor in quality. 'Meager wages/rations/returns.'" },
      { "w": "SPARSE", "pos": "adj", "cluster": "Lacking", "def": "Thinly dispersed or scattered; not dense; occurring at wide intervals", "ex": "The sparse audience — barely thirty people in a hall built for five hundred — unnerved the performers.", "tip": "Sparse = spread thinly, not concentrated. Often physical distribution. 'Sparse population/vegetation.'" },
      { "w": "SCANT", "pos": "adj", "cluster": "Lacking", "def": "Barely sufficient or adequate; insufficient; barely reaching", "ex": "The committee paid scant attention to the environmental impact report, approving the project in minutes.", "tip": "Scant = barely enough, almost not enough. 'Scant evidence/regard/attention.' Often implies dismissiveness." }
    ]
  },
  {
    "day": 13,
    "theme": "Intellectual Traits",
    "date": "May 18, 2026",
    "patterns": [
      "Erudite (learned through deep study) vs Sapient (wise through judgment) — knowledge vs wisdom",
      "Pedantic (obsessed with rules/details) vs Didactic (overtly instructive/moralizing) vs Doctrinaire (rigidly applies doctrine)",
      "Dilettante (dabbles superficially) vs Philistine (hostile to culture entirely) — both negative but different failures",
      "Obtuse = slow to understand (intellectual bluntness) · Fatuous = complacently silly and self-satisfied"
    ],
    "words": [
      { "w": "ERUDITE", "pos": "adj", "cluster": "Learned", "def": "Having or showing great knowledge or learning acquired through extensive reading and study", "ex": "The erudite professor could discuss Renaissance art, medieval law, and biochemistry with equal fluency.", "tip": "Erudite = deep, wide learning from study. More about breadth of knowledge than wisdom of judgment." },
      { "w": "SAPIENT", "pos": "adj", "cluster": "Learned", "def": "Having or showing great wisdom and sound judgment; discerning", "ex": "The sapient elder listened carefully to both sides before offering a solution that satisfied everyone.", "tip": "Sapient = wise judgment, not just knowledge. Root: sapere (to taste/know). Homo sapiens = wise human." },
      { "w": "CEREBRAL", "pos": "adj", "cluster": "Learned", "def": "Relating to the intellect rather than emotion; requiring significant thought; intellectual", "ex": "Her cerebral approach to poetry frustrated readers expecting emotional accessibility.", "tip": "Cerebral = head over heart. Intellectual and analytical. Often implies the person is detached or abstract." },
      { "w": "POLYMATH", "pos": "n", "cluster": "Learned", "def": "A person of wide knowledge or learning across many different fields", "ex": "Leonardo da Vinci — painter, engineer, anatomist, musician — remains history's most celebrated polymath.", "tip": "Polymath = expert in MANY fields. Root: poly (many) + manthanein (to learn). Rare and admired." },
      { "w": "DISCERNING", "pos": "adj", "cluster": "Learned", "def": "Having or showing good judgment and understanding; perceptive; able to distinguish quality", "ex": "Even the most discerning critics praised the debut novel's psychological precision and emotional honesty.", "tip": "Discerning = sees quality and distinctions others miss. Often applied to taste, judgment, assessment." },
      { "w": "PEDANTIC", "pos": "adj", "cluster": "Pedantic", "def": "Excessively concerned with minor details or formal rules; narrowly focused on technicalities", "ex": "His pedantic insistence on correcting everyone's grammar made him insufferable at dinner parties.", "tip": "Pedantic = misses the forest for the trees. Knows the rules obsessively but lacks wisdom or perspective." },
      { "w": "DIDACTIC", "pos": "adj", "cluster": "Pedantic", "def": "Intended to teach or moralize; (pejoratively) too obviously instructive or preachy", "ex": "The novel's didactic tone — every scene a lesson, every character a lesson-giver — undermined its artistry.", "tip": "Didactic = teaching-focused. Positive: educational. Negative (GRE common): preachy and heavy-handed." },
      { "w": "DOCTRINAIRE", "pos": "adj", "cluster": "Pedantic", "def": "Seeking to impose a doctrine rigidly, regardless of practical considerations or circumstances", "ex": "The doctrinaire economist applied the same theoretical framework to every country, ignoring local realities.", "tip": "Doctrinaire = rigidly applies a doctrine without flexibility. More ideological than pedantic." },
      { "w": "DOGMATIC", "pos": "adj", "cluster": "Pedantic", "def": "Inclined to lay down principles as incontrovertibly true; asserting opinions as established facts", "ex": "His dogmatic certainty about the diagnosis prevented him from considering alternative explanations.", "tip": "Dogmatic = presents opinions as facts, resistant to challenge. More personal than doctrinaire." },
      { "w": "PUNDIT", "pos": "n", "cluster": "Pedantic", "def": "An expert who offers opinions in public, particularly in media; a critic or commentator", "ex": "The political pundits were unanimously wrong in their election predictions.", "tip": "Pundit = public expert/commentator. Often used with mild irony — pundits can be wrong. From Sanskrit 'pandit.'" },
      { "w": "PHILISTINE", "pos": "n/adj", "cluster": "Ignorant", "def": "A person hostile or indifferent to culture, art, and beauty; one who lacks cultural appreciation", "ex": "The philistine executive dismissed the museum proposal as 'a waste of money that could build two highways.'", "tip": "Philistine = actively disdains culture. Named after biblical Philistines. Strongest anti-culture word." },
      { "w": "DILETTANTE", "pos": "n/adj", "cluster": "Ignorant", "def": "A person who cultivates an area of interest superficially; a dabbler lacking serious commitment", "ex": "The critics dismissed him as a dilettante — a weekend painter who lacked the discipline for serious work.", "tip": "Dilettante = interest without depth or commitment. Different from philistine — the dilettante likes culture, just superficially." },
      { "w": "SOPHOMORIC", "pos": "adj", "cluster": "Ignorant", "def": "Overconfident and superficially knowledgeable; intellectually immature and pretentious", "ex": "The paper's sophomoric analysis impressed no one — it deployed jargon to disguise a lack of real insight.", "tip": "Sophomore = second year student — knows enough to be overconfident but not enough to be right." },
      { "w": "OBTUSE", "pos": "adj", "cluster": "Ignorant", "def": "Annoyingly slow to understand; lacking intellectual acuity; mentally dull", "ex": "His obtuse refusal to grasp the obvious implications frustrated everyone in the meeting.", "tip": "Obtuse = blunt, not sharp (like a blunt angle). GRE uses the figurative sense: slow to understand." },
      { "w": "FATUOUS", "pos": "adj", "cluster": "Ignorant", "def": "Silly and pointless; self-satisfied and vacuously unintelligent", "ex": "His fatuous grin during the serious discussion about redundancies struck employees as deeply offensive.", "tip": "Fatuous = complacently silly. The person is pleased with themselves despite saying nothing of value." }
    ]
  },
  {
    "day": 14,
    "theme": "Emotional States",
    "date": "May 19, 2026",
    "patterns": [
      "Equanimity = mental calmness under pressure · Stoic = endures pain without complaint · Phlegmatic = naturally calm",
      "Trepidation (fearful anticipation of future event) vs Consternation (sudden dismay/anxiety about something now)",
      "Ennui = boredom from lack of purpose/meaning · Languor = pleasant or oppressive physical/mental weariness",
      "Ebullience (enthusiastic high energy) vs Elation (intense happiness from specific cause) vs Euphoria (extreme bliss)"
    ],
    "words": [
      { "w": "EQUANIMITY", "pos": "n", "cluster": "Calm", "def": "Mental calmness and composure, especially in difficult situations; evenness of temper", "ex": "She received the devastating diagnosis with remarkable equanimity, already planning her treatment options.", "tip": "Equanimity = calm under pressure. Root: aequus (equal) + animus (mind) = even-minded. A virtue word." },
      { "w": "SANGUINE", "pos": "adj", "cluster": "Calm", "def": "Optimistic or positive, especially in a difficult situation; cheerfully confident", "ex": "Despite the setbacks, he remained sanguine about the company's prospects, refusing to entertain despair.", "tip": "Sanguine = optimistic. Root: sanguis (blood) — rosy-cheeked with health. GRE high-frequency word." },
      { "w": "PHLEGMATIC", "pos": "adj", "cluster": "Calm", "def": "Having an unemotional and stolidly calm disposition; not easily upset or excited", "ex": "The phlegmatic surgeon showed no visible stress even when the procedure took an unexpected turn.", "tip": "Phlegmatic = naturally calm by temperament. From the 'phlegm' humor — cold and stable. Calm without effort." },
      { "w": "STOIC", "pos": "adj/n", "cluster": "Calm", "def": "Enduring pain, difficulty, or hardship without showing feelings or complaining", "ex": "She was stoic throughout the ordeal — no visible tears, no complaint — which others found both admirable and eerie.", "tip": "Stoic = endures without complaint. The Stoics (Greek philosophers) believed in controlling only what you can control." },
      { "w": "IMPASSIVE", "pos": "adj", "cluster": "Calm", "def": "Not feeling or showing emotion; maintaining an expressionless face; serene under pressure", "ex": "The poker champion's impassive expression revealed nothing — opponents had no way to read her hand.", "tip": "Impassive = no visible emotion. Different from equanimity (inner calm) — impassive is outer expression." },
      { "w": "CONSTERNATION", "pos": "n", "cluster": "Troubled", "def": "A feeling of sudden anxiety or dismay that disrupts composure; great shock and worry", "ex": "The announcement of the merger caused consternation among employees who feared massive redundancies.", "tip": "Consternation = sudden dismay about something HAPPENING NOW. 'To the consternation of' is a GRE phrase." },
      { "w": "TREPIDATION", "pos": "n", "cluster": "Troubled", "def": "A feeling of fear or agitation about something that may happen; anxious uncertainty", "ex": "She approached the negotiation with some trepidation, knowing the other party had a reputation for ruthlessness.", "tip": "Trepidation = fear about a FUTURE event. Distinguished from consternation by its anticipatory quality." },
      { "w": "DISQUIET", "pos": "n/v", "cluster": "Troubled", "def": "A feeling of worry or unease; to make someone feel anxious or unsettled", "ex": "A growing disquiet settled over the group as the hours passed with no word from the missing team.", "tip": "Disquiet = low-level persistent unease. Milder than consternation or trepidation. Often used as a noun." },
      { "w": "ENNUI", "pos": "n", "cluster": "Troubled", "def": "A feeling of listlessness and dissatisfaction arising from lack of occupation or purpose", "ex": "The wealthy heir, having never needed to work, was consumed by ennui — a purposelessness no purchase could cure.", "tip": "Ennui = existential boredom, not just passing tedium. Root: French word for the feeling of meaninglessness." },
      { "w": "LANGUOR", "pos": "n", "cluster": "Troubled", "def": "The state of tiredness or inactivity; a pleasant or oppressive physical and mental weariness", "ex": "The oppressive heat induced a languor that made even the simplest task feel insurmountable.", "tip": "Languor = dreamy weariness. Can be pleasant (post-vacation) or oppressive (illness, heat). GRE uses both." },
      { "w": "DESPONDENT", "pos": "adj", "cluster": "Extremes", "def": "In low spirits from loss of hope or courage; deeply dejected", "ex": "After three rejections in a week, he grew despondent, convinced no publisher would ever take the book.", "tip": "Despondent = hope has been lost. More severe than sad — implies the person sees no path forward." },
      { "w": "DISCONSOLATE", "pos": "adj", "cluster": "Extremes", "def": "Very unhappy and unable to be comforted; without consolation; deeply sorrowful", "ex": "She was disconsolate after the loss, refusing food and company for an entire week.", "tip": "Disconsolate = cannot be comforted. The key feature is that nothing helps. More severe than despondent." },
      { "w": "EUPHORIA", "pos": "n", "cluster": "Extremes", "def": "A feeling or state of intense excitement and happiness; extreme elation", "ex": "The euphoria of winning the championship faded within weeks, replaced by the ordinary pressures of daily life.", "tip": "Euphoria = extreme happiness, often temporary and possibly irrational. Root: eu (good) + phora (bearing)." },
      { "w": "ELATION", "pos": "n", "cluster": "Extremes", "def": "Great happiness and exhilaration, typically from a specific cause or achievement", "ex": "The elation she felt on hearing the results was unlike anything she had experienced in years.", "tip": "Elation = happiness from a specific cause. More grounded than euphoria — earned and specific." },
      { "w": "EBULLIENCE", "pos": "n", "cluster": "Extremes", "def": "The quality of being cheerful and full of energy; irrepressible enthusiasm", "ex": "The new CEO's ebullience was infectious — even cynical veterans found themselves energized by her vision.", "tip": "Ebullience = bubbling enthusiasm and energy. Root: ebullire (to boil over). The energy that overflows." }
    ]
  },
  {
    "day": 15,
    "theme": "Proof & Argument",
    "date": "May 20, 2026",
    "patterns": [
      "Cogent (clear AND convincing) vs Tenable (defensible, can withstand challenge) — both strong but different strengths",
      "Fallacious (contains logical error) vs Tendentious (biased toward a conclusion) vs Untenable (cannot be defended)",
      "Axiom (accepted as true without proof) vs Postulate (assumed for argument) vs Conjecture (educated guess)",
      "Empirical (based on observation/evidence) vs Categorical (absolute, admitting no exceptions or qualification)"
    ],
    "words": [
      { "w": "COGENT", "pos": "adj", "cluster": "Strong", "def": "Clear, logical, and convincing; compelling through sound reasoning and evidence", "ex": "The lawyer's cogent argument dismantled the prosecution's case point by point.", "tip": "Cogent = clear AND convincing. An argument can be clear but not convincing — cogent requires both." },
      { "w": "TENABLE", "pos": "adj", "cluster": "Strong", "def": "Able to be maintained or defended against attack or objection; defensible", "ex": "Given the new evidence, her original hypothesis was no longer tenable and had to be revised.", "tip": "Tenable = can withstand challenge. 'No longer tenable' is a GRE favourite phrase. Opposite: untenable." },
      { "w": "INCONTROVERTIBLE", "pos": "adj", "cluster": "Strong", "def": "Not able to be denied or disputed; indisputable; beyond any reasonable doubt", "ex": "The DNA evidence was incontrovertible — no alternative explanation existed.", "tip": "Incontrovertible = absolutely cannot be argued against. The strongest 'true' word in this cluster." },
      { "w": "IRREFUTABLE", "pos": "adj", "cluster": "Strong", "def": "Impossible to deny or disprove; unable to be refuted", "ex": "The experiment's irrefutable results ended two decades of debate about the compound's effectiveness.", "tip": "Irrefutable = cannot be refuted. Slightly weaker than incontrovertible — irrefutable focuses on proof, incontrovertible on truth." },
      { "w": "CONCLUSIVE", "pos": "adj", "cluster": "Strong", "def": "Decisively settling a question; leaving no room for doubt; providing a definitive answer", "ex": "The test results were conclusive: the bridge could not safely bear the projected load.", "tip": "Conclusive = brings the argument to a close. Root: concludere (to shut up/finish). It ends the debate." },
      { "w": "FALLACIOUS", "pos": "adj", "cluster": "Weak", "def": "Based on a mistaken belief; containing a logical error; deceptively misleading", "ex": "The study's conclusion was fallacious — it confused correlation with causation.", "tip": "Fallacious = contains a logical flaw. Not dishonest — just wrong in its reasoning. Fallacy is the noun." },
      { "w": "TENDENTIOUS", "pos": "adj", "cluster": "Weak", "def": "Promoting a particular cause or point of view; biased; not presenting a balanced view", "ex": "The documentary, while compelling, was tendentious — interviews with critics of the policy were noticeably absent.", "tip": "Tendentious = has an agenda. The argument or account is slanted toward a predetermined conclusion." },
      { "w": "UNTENABLE", "pos": "adj", "cluster": "Weak", "def": "Not able to be maintained or defended against attack; indefensible", "ex": "Under cross-examination, the witness's position became untenable — every new question exposed a new gap.", "tip": "Untenable = cannot be defended. Root: un + tenable. The position collapses under scrutiny." },
      { "w": "DUBIOUS", "pos": "adj", "cluster": "Weak", "def": "Hesitating or doubting; not to be relied upon; questionable in value or quality", "ex": "The investment opportunity sounded lucrative, but several dubious details made the analysts wary.", "tip": "Dubious = two senses: (1) causing doubt, (2) feeling doubtful. Context determines which meaning." },
      { "w": "PLAUSIBLE", "pos": "adj", "cluster": "Weak", "def": "Seeming reasonable or probable; superficially convincing but not necessarily true", "ex": "The alibi was plausible — possible, even probable — but the detective wasn't convinced.", "tip": "Plausible = seems reasonable but may not be true. GRE distinction: plausible ≠ true. It just seems true." },
      { "w": "AXIOM", "pos": "n", "cluster": "Concepts", "def": "A statement regarded as established and accepted as true; a self-evident principle", "ex": "The axiom that markets seek equilibrium was challenged by decades of behavioral economics research.", "tip": "Axiom = accepted without proof. It is the starting point. Axiomatic = obviously true, beyond question." },
      { "w": "CONJECTURE", "pos": "n/v", "cluster": "Concepts", "def": "An opinion or conclusion formed on the basis of incomplete information; an educated guess", "ex": "Without access to the original documents, historians could offer only conjecture about the general's motives.", "tip": "Conjecture = educated guess without full evidence. More formal than 'guess.' Conjectural = based on conjecture." },
      { "w": "POSTULATE", "pos": "n/v", "cluster": "Concepts", "def": "A thing assumed as a basis for reasoning or argument; to suggest or assume as a fact", "ex": "Einstein's postulate that the speed of light is constant transformed our understanding of space and time.", "tip": "Postulate = assumed for the sake of argument, then tested. Between axiom (accepted) and conjecture (guess)." },
      { "w": "EMPIRICAL", "pos": "adj", "cluster": "Concepts", "def": "Based on observation and experience rather than theory or pure logic", "ex": "The empirical evidence — ten years of field data — contradicted what the theoretical model had predicted.", "tip": "Empirical = evidence from the real world. 'Empirical evidence' appears constantly in GRE RC passages." },
      { "w": "CATEGORICAL", "pos": "adj", "cluster": "Concepts", "def": "Unambiguously explicit and direct; admitting of no conditions or exceptions; absolute", "ex": "The minister issued a categorical denial, ruling out any possibility that he had known about the scheme.", "tip": "Categorical = absolute, no exceptions. 'A categorical denial/refusal/statement.' No hedging, no qualifiers." }
    ]
  },
  {
    "day": 16,
    "theme": "Money & Resources",
    "date": "May 21, 2026",
    "patterns": [
      "Penury (state of poverty) vs Indigent (person who is poor) vs Impecunious (having little money, often temporary)",
      "Avarice (intense greed for wealth) vs Rapacious (aggressively seizing wealth) vs Venal (corruptible by money)",
      "Mercenary = motivated purely by money (no loyalty or principle) · Covetous = desiring what belongs to others",
      "Opulent (luxuriously wealthy) vs Solvent (able to pay debts — minimal bar) vs Remunerative (financially rewarding)"
    ],
    "words": [
      { "w": "PENURY", "pos": "n", "cluster": "Poor", "def": "Extreme poverty; the state of having very little money or resources", "ex": "After decades of penury, the artist's work was discovered and she died wealthy — but only just in time.", "tip": "Penury = extreme poverty as a state or condition. 'In penury' or 'lives in penury.' Always a noun." },
      { "w": "INDIGENT", "pos": "adj/n", "cluster": "Poor", "def": "Poor and needy; lacking money; a person who is impoverished and in need", "ex": "The clinic offered free consultations for indigent patients who could not afford standard fees.", "tip": "Indigent = poor enough to need assistance. Often used in legal and medical contexts. 'Indigent defendant.'" },
      { "w": "IMPECUNIOUS", "pos": "adj", "cluster": "Poor", "def": "Having little or no money; chronically short of funds", "ex": "The impecunious graduate relied on freelance editing work to supplement his doctoral stipend.", "tip": "Impecunious = cash-poor, often implying educated or once-comfortable. Root: im (not) + pecunia (money)." },
      { "w": "INSOLVENT", "pos": "adj", "cluster": "Poor", "def": "Unable to pay debts as they fall due; bankrupt; having liabilities exceeding assets", "ex": "After three failed ventures, the company was declared insolvent and its assets liquidated.", "tip": "Insolvent = legal/financial term for unable to pay debts. More technical than merely 'poor.'" },
      { "w": "DESTITUTE", "pos": "adj", "cluster": "Poor", "def": "Without the basic necessities of life; lacking food, shelter, and resources; utterly poor", "ex": "The floods left thousands destitute, with no home, no possessions, and no means to rebuild.", "tip": "Destitute = the most severe poverty word — completely without necessities. Stronger than indigent or penury." },
      { "w": "AVARICE", "pos": "n", "cluster": "Greedy", "def": "Extreme greed for wealth or material gain; an insatiable desire for more", "ex": "His avarice was legendary — he underpaid workers, avoided taxes, and still cried poverty at every opportunity.", "tip": "Avarice = insatiable greed. Root: avere (to crave). Avaricious = the adjective. One of the seven deadly sins." },
      { "w": "RAPACIOUS", "pos": "adj", "cluster": "Greedy", "def": "Aggressively greedy or grasping; pursuing money or possessions with predatory aggression", "ex": "The rapacious hedge fund stripped the company of assets and discarded its workforce.", "tip": "Rapacious = predatory greed. Root: rapere (to seize). Like a raptor — seizes aggressively." },
      { "w": "VENAL", "pos": "adj", "cluster": "Greedy", "def": "Open to bribery; susceptible to corruption; prepared to act dishonestly for money", "ex": "The venal official approved every permit regardless of safety — provided the payment was sufficient.", "tip": "Venal = corruptible by money. Root: venalis (for sale). A venal official has a price." },
      { "w": "MERCENARY", "pos": "adj/n", "cluster": "Greedy", "def": "Primarily concerned with making money at the expense of ethics or loyalty; motivated by money alone", "ex": "His mercenary decision to sell the formula to a rival the day before the IPO shocked even his closest allies.", "tip": "Mercenary = loyalty and principle abandoned for money. As a noun: a soldier for hire. Both GRE tested." },
      { "w": "COVETOUS", "pos": "adj", "cluster": "Greedy", "def": "Having or showing a great desire to possess something belonging to another", "ex": "She cast covetous eyes over her colleague's corner office from her first day at the firm.", "tip": "Covetous = wanting what SOMEONE ELSE has. Root: 'covet' — to desire another's possessions. Biblical origin." },
      { "w": "OPULENT", "pos": "adj", "cluster": "Wealthy", "def": "Ostentatiously rich and luxurious; characterized by extreme wealth and extravagance", "ex": "The opulent ballroom — gold leaf ceilings, marble floors, crystal chandeliers — overwhelmed even jaded guests.", "tip": "Opulent = luxuriously, visibly wealthy. Related to ostentatious (Day 7) — both involve display of wealth." },
      { "w": "LUCRATIVE", "pos": "adj", "cluster": "Wealthy", "def": "Producing a great deal of profit; highly financially rewarding", "ex": "The consulting contract was lucrative but dull — she left it for a poorly-paid job that actually interested her.", "tip": "Lucrative = profitable. Root: lucrum (profit/gain). Always about financial return." },
      { "w": "PECUNIARY", "pos": "adj", "cluster": "Wealthy", "def": "Of, relating to, or consisting of money; financial", "ex": "The divorce settlement addressed not only pecuniary matters but custody, property, and business stakes.", "tip": "Pecuniary = relating to money generally. 'Pecuniary interest/gain/loss.' More formal than 'financial.'" },
      { "w": "REMUNERATIVE", "pos": "adj", "cluster": "Wealthy", "def": "Financially rewarding; paying well; bringing in profit or payment", "ex": "Teaching was rarely remunerative but deeply satisfying — a trade-off she had consciously accepted.", "tip": "Remunerative = pays well. Root: remunerari (to reward). 'A remunerative position' = well-paying job." },
      { "w": "SOLVENT", "pos": "adj", "cluster": "Wealthy", "def": "Having assets in excess of liabilities; able to pay one's debts; financially stable", "ex": "After years of debt, the business finally became solvent — paying its creditors and breaking even.", "tip": "Solvent = simply able to pay debts. The minimum financial health bar. Opposite of insolvent." }
    ]
  },
  {
    "day": 17,
    "theme": "Art & Culture",
    "date": "May 22, 2026",
    "patterns": [
      "Banal/Hackneyed/Trite = all mean stale and overused — hackneyed = worn by overuse · trite = too familiar · banal = utterly commonplace",
      "Prosaic (dull, unimaginative — like prose vs poetry) vs Pedestrian (unimaginatively ordinary — like walking vs flying)",
      "Iconoclast = attacks established beliefs/institutions · Avant-garde = ahead of current style · Seminal = planted seeds for future work",
      "Austere (severely plain, no decoration) vs Ornate (heavily decorated) — these are polar opposites GRE loves to contrast"
    ],
    "words": [
      { "w": "BANAL", "pos": "adj", "cluster": "Stale", "def": "So lacking in originality as to be obvious and boring; unoriginal and predictable", "ex": "The romantic comedy followed such a banal formula that audiences could predict every plot turn within minutes.", "tip": "Banal = utterly commonplace. Root: banal (French) = common, trite. The most dismissive cliché word." },
      { "w": "HACKNEYED", "pos": "adj", "cluster": "Stale", "def": "Made trite and unoriginal through overuse; worn out by repetition", "ex": "The speech was full of hackneyed metaphors — journeys, battles, and dawns — that had lost all power.", "tip": "Hackneyed = worn by excessive use. Root: hackney horse = overworked horse for hire. Meaning has been ridden to death." },
      { "w": "TRITE", "pos": "adj", "cluster": "Stale", "def": "Overused and consequently of little thought or originality; lacking freshness", "ex": "The reviewer dismissed the novel's dialogue as trite, noting that every exchange felt borrowed from other books.", "tip": "Trite = too familiar, worn smooth. Slightly milder than hackneyed — trite is just too familiar, not necessarily overused." },
      { "w": "PROSAIC", "pos": "adj", "cluster": "Stale", "def": "Having the style of prose rather than poetry; unromantic; commonplace and dull", "ex": "His prosaic mind transformed every poetic landscape into a list of GPS coordinates and mileage estimates.", "tip": "Prosaic = plain like prose (vs poetry). Root: prosa (prose). A prosaic description = dull, factual, unimaginative." },
      { "w": "PEDESTRIAN", "pos": "adj", "cluster": "Stale", "def": "Lacking inspiration or excitement; unimaginatively ordinary; dull", "ex": "Despite its impressive budget, the film was pedestrian — technically competent but with nothing memorable.", "tip": "Pedestrian = walking pace when others are flying. Unimaginatively ordinary. Also literally: a person walking." },
      { "w": "ICONOCLAST", "pos": "n", "cluster": "Original", "def": "A person who attacks cherished beliefs or institutions; a rebel against established convention", "ex": "The iconoclast architect refused to use any historical references, declaring tradition an obstacle to truth.", "tip": "Iconoclast = breaks icons (sacred images). Root: eikon (icon) + klaein (to break). Challenges what others revere." },
      { "w": "AVANT-GARDE", "pos": "adj/n", "cluster": "Original", "def": "New and experimental ideas and methods in art; innovative and ahead of current style or thinking", "ex": "Her avant-garde compositions baffled concert audiences but were celebrated by fellow composers as revelatory.", "tip": "Avant-garde = ahead of the guard (French military term). In art: so new that audiences haven't caught up yet." },
      { "w": "SEMINAL", "pos": "adj", "cluster": "Original", "def": "Strongly influencing later developments; original and important; providing a foundation for the future", "ex": "The 1962 paper proved seminal — every major advance in the field over the next thirty years traced back to it.", "tip": "Seminal = planted seeds for future work. Root: semen (seed). 'A seminal work' = foundational and generative." },
      { "w": "ECLECTIC", "pos": "adj", "cluster": "Original", "def": "Deriving ideas, style, or taste from a broad and diverse range of sources; wide-ranging", "ex": "Her eclectic collection mixed African sculpture, Japanese woodblock prints, and French Impressionism.", "tip": "Eclectic = draws from many different sources. Usually positive. Not a mishmash — a thoughtful, wide-ranging selection." },
      { "w": "INNOVATIVE", "pos": "adj", "cluster": "Original", "def": "Featuring new methods, ideas, or products; introducing something genuinely new and creative", "ex": "The innovative approach to vaccine delivery — a skin patch instead of injection — could transform global health.", "tip": "Innovative = creates something genuinely new. Less extreme than avant-garde — innovation still connects to the present." },
      { "w": "AESTHETIC", "pos": "adj/n", "cluster": "Aesthetic", "def": "Concerned with beauty or the appreciation of beauty; relating to art and artistic principles", "ex": "The architect's aesthetic choices — natural light, organic materials, careful proportions — created spaces that felt alive.", "tip": "Aesthetic = relating to beauty and art. As a noun: a particular visual style or set of principles." },
      { "w": "BAROQUE", "pos": "adj", "cluster": "Aesthetic", "def": "Highly ornate and extravagant in style; complex and elaborate to the point of excess", "ex": "The baroque interior — cherubs, gilded cornices, frescoed ceilings — overwhelmed rather than impressed.", "tip": "Baroque = extravagantly complex and ornamental. Historical period (1600s) but GRE uses it to mean any elaborate excess." },
      { "w": "AUSTERE", "pos": "adj", "cluster": "Aesthetic", "def": "Severe or strict in manner; having no ornamentation; deliberately plain and unadorned", "ex": "The monastery's austere design — bare stone walls, no decoration — created an atmosphere of concentrated purpose.", "tip": "Austere = severe simplicity, often deliberately chosen. Opposite of baroque/ornate. Can also mean morally strict." },
      { "w": "ORNATE", "pos": "adj", "cluster": "Aesthetic", "def": "Elaborately adorned and decorated; highly embellished; (of writing) using unusual or flowery words", "ex": "The ornate Victorian prose — dense with subordinate clauses and literary allusions — exhausted modern readers.", "tip": "Ornate = decorated to excess. Used for architecture, writing, and design. Between baroque (excess) and embellished (moderate)." },
      { "w": "WHIMSICAL", "pos": "adj", "cluster": "Aesthetic", "def": "Playfully quaint or fanciful; not serious; acting or done on impulse or whim; charmingly odd", "ex": "The illustrator's whimsical drawings — teacups with legs, clouds that whispered secrets — delighted children and adults alike.", "tip": "Whimsical = charmingly playful and imaginative. Positive. Distinguished from capricious (impulsive, less charming)." }
    ]
  },
  {
    "day": 18,
    "theme": "High-Frequency Sweep",
    "date": "May 23, 2026",
    "patterns": [
      "Ameliorate/Mitigate/Alleviate = all mean to improve or lessen — ameliorate = make better · mitigate = make less severe · alleviate = relieve",
      "Mollify/Placate/Appease/Propitiate = all mean to soothe anger — propitiate is the strongest, implying sacrifice to win back favor",
      "Rescind (cancel an official order) vs Repudiate (publicly reject/disown) vs Abrogate (formally abolish)",
      "Enervate = drain of energy/vitality (often confused with energize — they are OPPOSITES) · Forestall = prevent by acting first"
    ],
    "words": [
      { "w": "AMELIORATE", "pos": "v", "cluster": "Improve", "def": "To make something bad or unsatisfactory better; to improve a situation", "ex": "Several policy changes were introduced to ameliorate the conditions in overcrowded urban shelters.", "tip": "Ameliorate = improve a bad situation. Root: melior (better). Distinguished from 'improve' by implying a bad starting point." },
      { "w": "EXACERBATE", "pos": "v", "cluster": "Improve", "def": "To make a problem, bad situation, or negative feeling worse; to aggravate", "ex": "The drought was exacerbated by government mismanagement of water reserves over the preceding decade.", "tip": "Exacerbate = make worse. Root: acerbus (harsh). GRE's favourite 'worsen' word. Opposite of ameliorate." },
      { "w": "MITIGATE", "pos": "v", "cluster": "Improve", "def": "To make less severe, serious, or painful; to reduce the impact of something harmful", "ex": "Planting trees can help mitigate the effects of urban heat by providing shade and releasing moisture.", "tip": "Mitigate = reduce severity (not eliminate). 'Mitigating circumstances' = factors that lessen blame." },
      { "w": "ALLEVIATE", "pos": "v", "cluster": "Improve", "def": "To make suffering, a problem, or a deficiency less severe; to provide partial relief", "ex": "The medication alleviated the pain enough for her to sleep, though it did not address the underlying cause.", "tip": "Alleviate = relieve but not cure. Root: levis (light) = make lighter. Always implies partial, not complete, relief." },
      { "w": "ASSUAGE", "pos": "v", "cluster": "Improve", "def": "To make an unpleasant feeling less intense; to soothe; to satisfy an appetite or desire", "ex": "His apology did little to assuage her anger — the damage to trust was simply too great.", "tip": "Assuage = soothe feelings or satisfy needs. Can apply to hunger, grief, fear, or anger. More poetic than alleviate." },
      { "w": "MOLLIFY", "pos": "v", "cluster": "Soothe", "def": "To appease the anger or anxiety of someone; to soothe; to make less intense", "ex": "The CEO's public statement failed to mollify shareholders already furious at the quarter's losses.", "tip": "Mollify = reduce someone's anger. Root: mollis (soft) = to soften. Often used for calming angry people or groups." },
      { "w": "PLACATE", "pos": "v", "cluster": "Soothe", "def": "To make someone less angry or hostile; to pacify by conceding something", "ex": "The government offered minor concessions to placate the protesters without addressing their core demands.", "tip": "Placate = calm anger, often with a concession. Placare (Latin) = to appease. Often implies insufficient action." },
      { "w": "CONCILIATE", "pos": "v", "cluster": "Soothe", "def": "To stop someone feeling angry or discontented; to reconcile; to gain goodwill through friendliness", "ex": "The mediator worked to conciliate both parties, finding common ground where each side could feel heard.", "tip": "Conciliate = bring together through goodwill. Root: conciliare (to unite). More mutual than mollify or placate." },
      { "w": "PROPITIATE", "pos": "v", "cluster": "Soothe", "def": "To win or regain the favor of someone through sacrifice, gift, or appeasement", "ex": "Ancient rituals were performed to propitiate the gods before important battles or voyages.", "tip": "Propitiate = the strongest appeasement word — implies offering something significant to regain favor. Often religious context." },
      { "w": "DISABUSE", "pos": "v", "cluster": "Soothe", "def": "To persuade someone that an idea or belief is mistaken; to correct a false impression", "ex": "The professor disabused the class of the widespread misconception that correlation implies causation.", "tip": "Disabuse = correct a false belief. 'Disabuse someone of the notion that...' is a GRE-favourite construction." },
      { "w": "ENERVATE", "pos": "v", "cluster": "Reverse", "def": "To weaken or drain of vitality, energy, or strength; to debilitate", "ex": "The months of chemotherapy had enervated her completely — even a short walk required enormous effort.", "tip": "CRITICAL: Enervate = WEAKEN, not energize. Students constantly confuse these. En-NERVE-ate = drain the nerves." },
      { "w": "EXONERATE", "pos": "v", "cluster": "Reverse", "def": "To officially absolve from blame; to relieve of a duty or responsibility; to clear of accusation", "ex": "New testimony exonerated the convicted man, prompting his immediate release and a formal apology.", "tip": "Exonerate = officially clear of blame. Root: ex (from) + onus (burden) = relieve of burden. Legal contexts." },
      { "w": "RESCIND", "pos": "v", "cluster": "Reverse", "def": "To revoke, cancel, or repeal a law, order, or agreement officially", "ex": "The board rescinded the offer when the background check revealed discrepancies in the candidate's resume.", "tip": "Rescind = cancel an official decision or offer. More formal than cancel. Root: rescindere (to cut off)." },
      { "w": "REPUDIATE", "pos": "v", "cluster": "Reverse", "def": "To refuse to accept or be associated with; to deny the truth of; to reject with disapproval", "ex": "The organization publicly repudiated the extremist views expressed by one of its former members.", "tip": "Repudiate = publicly disown or reject. Stronger and more deliberate than merely disagreeing." },
      { "w": "FORESTALL", "pos": "v", "cluster": "Reverse", "def": "To prevent or obstruct something by taking action in advance; to preempt", "ex": "The board moved quickly to forestall a hostile takeover by acquiring a critical block of its own shares.", "tip": "Forestall = prevent by acting FIRST. Root: forestall (market term: buying goods before they reach market to control price)." }
    ]
  },
  {
    "day": 19,
    "theme": "Vice & Moral Corruption",
    "date": "May 24, 2026",
    "patterns": [
      "Egregious (outstandingly bad in a shocking way) vs Flagrant (openly and obviously wrong) — both glaring but egregious implies scale",
      "Nefarious (criminal/wicked) vs Iniquitous (grossly unjust) vs Heinous (atrociously evil) — increasing moral horror",
      "Wanton = deliberate AND unprovoked — the lack of justification is always the key feature",
      "Turpitude = the abstract noun for moral depravity — 'moral turpitude' is a fixed GRE phrase"
    ],
    "words": [
      { "w": "DISSOLUTE", "pos": "adj", "cluster": "Immoral", "def": "Given to immoral pleasures; completely lacking in moral restraint or discipline", "ex": "The dissolute nobleman squandered his inheritance on gambling and debauchery, dying penniless at forty.", "tip": "Dissolute = morally unraveled. Root: dissolutus (loose, undone) = all restraint has dissolved." },
      { "w": "DEBAUCHED", "pos": "adj", "cluster": "Immoral", "def": "Excessively indulging in sensual pleasures to a degree regarded as moral depravity", "ex": "The debauched court shocked foreign ambassadors who reported its excesses back to disapproving monarchs.", "tip": "Debauched = corrupted through self-indulgence. Implies the person was once better and has since fallen." },
      { "w": "LICENTIOUS", "pos": "adj", "cluster": "Immoral", "def": "Promiscuous and unprincipled in sexual matters; disregarding accepted moral rules", "ex": "The licentious governor's conduct became impossible to ignore when it began affecting governance.", "tip": "Licentious = unlicensed by moral law. Root: licentia (freedom) = freedom taken too far." },
      { "w": "REPROBATE", "pos": "n/adj", "cluster": "Immoral", "def": "An unprincipled person; utterly morally corrupt and unashamed; rejected by God or society", "ex": "The reprobate had been expelled from three institutions before his thirtieth birthday.", "tip": "Reprobate = morally condemned without remorse. As adj: 'a reprobate lifestyle.' Strong and comprehensive moral failure." },
      { "w": "DEPRAVED", "pos": "adj", "cluster": "Immoral", "def": "Morally corrupt; having lost natural good qualities through excessive self-indulgence", "ex": "The depraved conditions in the institution shocked inspectors who had never seen such systematic cruelty.", "tip": "Depraved = morally corrupted and gone far from goodness. Root: depravare (to corrupt). Depravity is the noun." },
      { "w": "INIQUITOUS", "pos": "adj", "cluster": "Wicked", "def": "Grossly unfair and morally wrong; sinful; unjust in a way that causes outrage", "ex": "The iniquitous sentencing policy imprisoned the poor while wealthy defendants walked free on the same charges.", "tip": "Iniquitous = grossly unjust. Root: iniquus (not equal). Iniquity is the noun — 'a den of iniquity.'" },
      { "w": "NEFARIOUS", "pos": "adj", "cluster": "Wicked", "def": "Wicked, criminal, and evil; flagrantly villainous", "ex": "The investigation exposed the nefarious network of bribery that extended to the highest levels of government.", "tip": "Nefarious = actively and flagrantly evil. Root: nefas (crime against divine law). Strong — implies deliberate wrongdoing." },
      { "w": "TURPITUDE", "pos": "n", "cluster": "Wicked", "def": "Wickedness and moral depravity; shamefully wicked behavior", "ex": "The contract contained a morality clause terminating employment upon conviction of moral turpitude.", "tip": "'Moral turpitude' = fixed GRE legal phrase. Turpitude = the abstract noun for depraved conduct. Root: turpis (base/vile)." },
      { "w": "HEINOUS", "pos": "adj", "cluster": "Wicked", "def": "Utterly odious or wicked; shockingly evil; atrocious", "ex": "The heinous nature of the crime — its deliberate cruelty — precluded any possibility of leniency.", "tip": "Heinous = the strongest single-word descriptor of evil acts. Root: haineus (Old French) = hateful. Reserved for truly atrocious acts." },
      { "w": "EGREGIOUS", "pos": "adj", "cluster": "Glaring", "def": "Outstandingly bad; shockingly or flagrantly wrong; conspicuously offensive", "ex": "The professor's egregious misquotation of the primary source undermined the entire paper's credibility.", "tip": "Egregious = stands out from the flock (for the wrong reasons). Root: ex (out) + grex (flock). Originally meant 'remarkably good' — now always negative." },
      { "w": "IGNOMINIOUS", "pos": "adj", "cluster": "Glaring", "def": "Deserving or causing public disgrace or shame; humiliating and shameful", "ex": "The champion's ignominious defeat — losing in the first round — stunned the crowd into silence.", "tip": "Ignominious = publicly shaming. Root: ignominia (disgrace). Ignominy is the noun. Always involves public humiliation." },
      { "w": "SORDID", "pos": "adj", "cluster": "Glaring", "def": "Involving immoral or dishonorable actions or motives; dirty and unpleasant; morally degrading", "ex": "The sordid details of the affair — the deception, the manipulation — made it impossible to sympathize.", "tip": "Sordid = morally dirty. Root: sordidus (dirty). Can describe situations, details, or motives — not people directly." },
      { "w": "WANTON", "pos": "adj", "cluster": "Glaring", "def": "Deliberate and unprovoked; merciless; showing no care for morality or the law", "ex": "The wanton destruction of the medieval library — burning irreplaceable manuscripts — shocked the scholarly world.", "tip": "Wanton = deliberate AND unprovoked — no justification. 'Wanton cruelty/destruction/disregard.' The lack of reason is the defining feature." },
      { "w": "FLAGRANT", "pos": "adj", "cluster": "Glaring", "def": "Conspicuously or obviously offensive; glaring in its wrongness; so bad it cannot be ignored", "ex": "The flagrant breach of protocol — shaking hands before the cameras cut — caused a diplomatic incident.", "tip": "Flagrant = cannot be hidden or ignored. Root: flagrare (to blaze). The wrong is blazing — everyone can see it." },
      { "w": "UNCONSCIONABLE", "pos": "adj", "cluster": "Glaring", "def": "Not right or reasonable; exceeding what is reasonable; without conscience; excessive", "ex": "The unconscionable delay of fourteen years between conviction and exoneration demanded systematic reform.", "tip": "Unconscionable = no conscience could permit this. The strongest 'this is wrong' adjective in legal and moral contexts." }
    ]
  },
  {
    "day": 20,
    "theme": "Virtue & Moral Integrity",
    "date": "May 25, 2026",
    "patterns": [
      "Probity (demonstrated integrity through action) vs Rectitude (moral correctness as a quality) — probity is earned, rectitude is possessed",
      "Unimpeachable/Irreproachable/Impeccable = all mean beyond criticism — unimpeachable = cannot be attacked · impeccable = flawless · irreproachable = no reproach possible",
      "Scrupulous = extremely careful about doing what is RIGHT · Conscientious = extremely careful about doing things WELL — overlap but distinct",
      "Estimable = worthy of great respect (from 'esteem') — do not confuse with 'estimatable' (able to be estimated)"
    ],
    "words": [
      { "w": "RECTITUDE", "pos": "n", "cluster": "Integrity", "def": "Morally correct behavior or thinking; righteousness; moral uprightness", "ex": "His rectitude was never in doubt — he had declined bribes and resisted pressure throughout his career.", "tip": "Rectitude = moral straightness. Root: rectus (straight). 'A person of rectitude' = morally correct by nature." },
      { "w": "PROBITY", "pos": "n", "cluster": "Integrity", "def": "The quality of having strong moral principles; complete honesty and integrity demonstrated through action", "ex": "Her probity was proven not by words but by forty years of service without a single scandal.", "tip": "Probity = integrity that has been demonstrated and tested. Root: probus (good). You earn probity through conduct." },
      { "w": "SCRUPULOUS", "pos": "adj", "cluster": "Integrity", "def": "Diligent, thorough, and careful about acting morally; paying close attention to doing what is right", "ex": "The scrupulous accountant flagged every irregularity, even when doing so was professionally inconvenient.", "tip": "Scrupulous = careful about BOTH correctness and thoroughness. Root: scrupulus (small stone causing discomfort in the shoe) = nagging sense of wrongdoing." },
      { "w": "INCORRUPTIBLE", "pos": "adj", "cluster": "Integrity", "def": "Not susceptible to corruption; maintaining complete moral integrity regardless of temptation", "ex": "The incorruptible judge turned down a six-figure bribe with a single-word written reply: 'No.'", "tip": "Incorruptible = cannot be bought or compromised. The absolute ceiling of moral integrity words." },
      { "w": "MERITORIOUS", "pos": "adj", "cluster": "Praiseworthy", "def": "Deserving reward or praise; commendable; having moral or practical worth", "ex": "Her meritorious service to the community over three decades earned her the city's highest civilian honor.", "tip": "Meritorious = has genuine merit deserving recognition. Root: meritum (earned). Often used in military and civic contexts." },
      { "w": "LAUDABLE", "pos": "adj", "cluster": "Praiseworthy", "def": "Deserving praise and commendation; worthy of recognition", "ex": "Though ultimately unsuccessful, the campaign's laudable intentions earned it goodwill from both sides.", "tip": "Laudable = worthy of being lauded (praised). Connects to laud (Day 4). The effort or intention deserves credit." },
      { "w": "ESTIMABLE", "pos": "adj", "cluster": "Praiseworthy", "def": "Worthy of great respect; deserving high regard; admirable", "ex": "She was an estimable colleague — reliable, generous with her knowledge, and diplomatically honest.", "tip": "Estimable = worthy of esteem/high regard. Do not confuse with 'estimatable.' Root: aestimare (to value)." },
      { "w": "CONSCIENTIOUS", "pos": "adj", "cluster": "Praiseworthy", "def": "Wishing to do what is right; very careful and thorough in discharging one's duties", "ex": "The conscientious researcher double-checked every citation before submission, delaying publication by a month.", "tip": "Conscientious = thorough because you care about doing things RIGHT. Distinguished from merely competent." },
      { "w": "UNIMPEACHABLE", "pos": "adj", "cluster": "Flawless", "def": "Not able to be doubted, questioned, or criticized; beyond reproach; completely reliable", "ex": "Her unimpeachable credentials — three decades of published research without a single retraction — silenced critics.", "tip": "Unimpeachable = cannot be impeached (attacked/questioned). Legal metaphor. The strongest 'beyond criticism' word." },
      { "w": "IMPECCABLE", "pos": "adj", "cluster": "Flawless", "def": "In accordance with the highest standards; flawless; without fault or error", "ex": "His impeccable manners made him the ideal candidate for the diplomatic posting.", "tip": "Impeccable = without a single flaw. Root: impeccabilis (without sin). 'Impeccable taste/record/logic.'" },
      { "w": "IRREPROACHABLE", "pos": "adj", "cluster": "Flawless", "def": "Beyond criticism; faultless in behavior or character; impossible to find fault with", "ex": "Her irreproachable conduct throughout the investigation earned her the committee's unanimous trust.", "tip": "Irreproachable = no reproach (blame) is possible. Compare: unimpeachable (cannot be attacked) vs irreproachable (cannot be blamed)." },
      { "w": "EXEMPLARY", "pos": "adj", "cluster": "Flawless", "def": "Serving as a desirable model; representing the best of its kind; outstanding", "ex": "The exemplary response to the crisis — transparent communication, swift action — became a case study in leadership.", "tip": "Exemplary = serves as an EXAMPLE for others to follow. Also: exemplary punishment = so severe it deters others." },
      { "w": "STERLING", "pos": "adj", "cluster": "Reliable", "def": "Of excellent quality; thoroughly good and reliable; of the highest standard", "ex": "She had a sterling reputation built over twenty years of reliable, excellent work.", "tip": "Sterling = like sterling silver — genuine, of the highest quality. 'Sterling work/reputation/character.'" },
      { "w": "STALWART", "pos": "adj/n", "cluster": "Reliable", "def": "Loyal, reliable, and hardworking; strongly committed to a cause or organization", "ex": "The stalwart volunteer had worked every election for thirty years, never missing a single day.", "tip": "Stalwart = dependably strong and loyal. Root: Old English stælwyrþe (serviceable). Both adjective and noun." },
      { "w": "UPRIGHT", "pos": "adj", "cluster": "Reliable", "def": "Strictly honorable or honest; straightforward and morally correct in conduct", "ex": "The upright magistrate was known for consistency — identical rulings regardless of the defendant's status.", "tip": "Upright = morally vertical, not bent. Simpler than rectitude or probity but equally valued on the GRE." }
    ]
  },
  {
    "day": 21,
    "theme": "Power, Authority & Governance",
    "date": "May 26, 2026",
    "patterns": [
      "Despotic (tyrannical personal rule) vs Autocratic (structure of one-person rule) vs Draconian (harsh laws, not necessarily personal) — distinguish ruler from system from law",
      "Hegemony = leadership/dominance of one over others — not just power, but the acceptance or imposition of cultural/political dominance",
      "Usurp = seize power illegally · Subjugate = bring people under control by force — both involve illegitimate or forceful power",
      "Fiat vs Edict vs Mandate: fiat = authoritative decree by single authority · edict = formal public proclamation · mandate = authority given by voters or institutions"
    ],
    "words": [
      { "w": "SOVEREIGN", "pos": "adj/n", "cluster": "Authority", "def": "Possessing supreme or ultimate power; a monarch or ruler with supreme authority", "ex": "The sovereign power to declare war rested exclusively with the executive branch under the new constitution.", "tip": "Sovereign = supreme, above all else. Root: superanus (Latin via French) = above. Sovereignty = the quality of supreme power." },
      { "w": "AUTOCRATIC", "pos": "adj", "cluster": "Authority", "def": "Relating to rule by a single person with absolute power; taking no account of others' wishes", "ex": "His autocratic management style — issuing directives without consultation — drove away every talented subordinate.", "tip": "Autocratic = the structure, not necessarily evil. Root: auto (self) + kratos (power) = self-ruling. Autocrat is the noun." },
      { "w": "DESPOTIC", "pos": "adj", "cluster": "Authority", "def": "Of or typical of a tyrant; cruel and oppressive in the use of power; tyrannical", "ex": "The despotic ruler eliminated all opposition within a year, consolidating absolute control over every institution.", "tip": "Despotic = tyrant-like. Root: despotēs (master). Always negative — implies cruelty in the exercise of power." },
      { "w": "HEGEMONY", "pos": "n", "cluster": "Authority", "def": "Leadership or dominance, especially of one country or group over others; cultural or political dominance", "ex": "American cultural hegemony — exported through film, music, and technology — reshaped global consumption habits.", "tip": "Hegemony = dominance that others accept or are forced to accept. Root: hēgemonia (leadership). Not just power — cultural influence." },
      { "w": "PREROGATIVE", "pos": "n", "cluster": "Rights", "def": "A right or privilege exclusive to a particular individual or class; a special entitlement", "ex": "Calling a snap election is the Prime Minister's prerogative — no other institution can trigger it.", "tip": "Prerogative = exclusive right. Root: praerogativa (right to vote first). 'It's my prerogative' = my exclusive right to decide." },
      { "w": "USURP", "pos": "v", "cluster": "Rights", "def": "To take a position of power or importance illegally or by force; to supplant wrongfully", "ex": "The general usurped the presidency, dissolving parliament and suspending the constitution within forty-eight hours.", "tip": "Usurp = seize illegitimately. Root: usurpare (to seize for use). Always involves taking what isn't rightfully yours." },
      { "w": "SUBJUGATE", "pos": "v", "cluster": "Rights", "def": "To bring under domination or control, especially by conquest; to make subservient", "ex": "The empire spent two centuries attempting to subjugate tribes that had resisted every previous colonizing power.", "tip": "Subjugate = put under the yoke. Root: sub (under) + jugum (yoke). Complete domination, not mere influence." },
      { "w": "TYRANNICAL", "pos": "adj", "cluster": "Control", "def": "Exercising power in a cruel, oppressive, or arbitrary way; characteristic of a tyrant", "ex": "The tyrannical regime monitored private communications and punished even mild expressions of dissent.", "tip": "Tyrannical = exercises power cruelly and arbitrarily. Distinguished from merely strict or authoritative." },
      { "w": "AUTONOMOUS", "pos": "adj", "cluster": "Control", "def": "Acting independently and having the freedom to do so; self-governing", "ex": "The autonomous region controlled its own tax policy, judiciary, and police force despite nominal central oversight.", "tip": "Autonomous = self-governing. Root: auto (self) + nomos (law) = makes its own laws. Autonomy is the noun." },
      { "w": "MANDATE", "pos": "n/v", "cluster": "Control", "def": "An official order or commission; the authority given to an elected body; to give official authorization", "ex": "The landslide gave the new government a clear mandate to pursue the radical economic reforms it had promised.", "tip": "Mandate = authority to act, usually from voters or an institution. 'Electoral mandate' is a GRE-favourite phrase." },
      { "w": "FIAT", "pos": "n", "cluster": "Decrees", "def": "An authoritative decree or order; a formal authorization from an authority requiring no justification", "ex": "The regulations were implemented by executive fiat, bypassing the normal legislative consultation process.", "tip": "Fiat = 'let it be done' (Latin). Implies unilateral decision. 'Fiat money' = currency by decree, not backed by gold." },
      { "w": "EDICT", "pos": "n", "cluster": "Decrees", "def": "An official order issued by a person in authority; a public proclamation carrying the force of law", "ex": "The king issued an edict forbidding the practice, punishable by exile for any noble who defied it.", "tip": "Edict = formal public proclamation. Root: edicere (to proclaim). Historical contexts (imperial edicts) are common in GRE RC." },
      { "w": "DRACONIAN", "pos": "adj", "cluster": "Decrees", "def": "Excessively harsh, strict, or severe — said of laws, penalties, or measures", "ex": "The draconian sentencing guidelines left judges no discretion — a first offense carried a mandatory ten years.", "tip": "Named after Draco, Athenian lawmaker whose code prescribed death for nearly all crimes. Draconian = laws so harsh they seem punitive rather than just." },
      { "w": "JURISDICTION", "pos": "n", "cluster": "Law", "def": "The official power to make legal decisions; the territory over which such power extends", "ex": "The crime occurred in international waters, creating genuine confusion about which country had jurisdiction.", "tip": "Jurisdiction = legal authority + the territory it covers. Root: jus (law) + dicere (to say). 'Outside my jurisdiction.'" },
      { "w": "OLIGARCHY", "pos": "n", "cluster": "Systems", "def": "A form of government in which power rests with a small group of people; rule by a few", "ex": "Critics argued the democracy had become an oligarchy — real decisions made by a dozen billionaires and their lobbyists.", "tip": "Oligarchy = rule by few. Root: oligos (few) + arkhein (to rule). GRE uses this in RC passages about governance and economics." }
    ]
  },
  {
    "day": 22,
    "theme": "Conformity & Dissent",
    "date": "May 27, 2026",
    "patterns": [
      "Orthodox (conforms to established doctrine) vs Canonical (included in the accepted standard) — orthodox = follows the rules · canonical = recognized as authoritative",
      "Acquiesce (accept reluctantly without protest) vs Capitulate (surrender after resistance) vs Concede (admit a point) — escalating degrees of giving in",
      "Contumacious = stubbornly defying authority · Recusant = refusing to conform to an official requirement — both resist, but recusant has historical religious weight",
      "Maverick = independent but not necessarily oppositional · Subversive = actively works to undermine — independent vs actively undermining"
    ],
    "words": [
      { "w": "ORTHODOX", "pos": "adj", "cluster": "Conform", "def": "Conforming to established doctrine, practice, or rules; traditional and conventional", "ex": "The orthodox approach yielded predictable results — reliable but uninspired — and the committee wanted more.", "tip": "Orthodox = straight teaching. Root: orthos (straight) + doxa (opinion). GRE often contrasts orthodox and heterodox approaches." },
      { "w": "HETERODOX", "pos": "adj", "cluster": "Conform", "def": "Not conforming to established doctrine or accepted standards; unorthodox", "ex": "Her heterodox economic views were dismissed by mainstream economists until the crisis proved her right.", "tip": "Heterodox = other teaching. Root: heteros (other) + doxa (opinion). The exact opposite of orthodox." },
      { "w": "CANONICAL", "pos": "adj", "cluster": "Conform", "def": "Included in the accepted list of works; conforming to established rules; standard and authoritative", "ex": "Shakespeare's canonical plays are studied globally; his apocryphal works remain subjects of scholarly dispute.", "tip": "Canonical = accepted as authoritative. Root: kanon (rule, standard). 'The canonical texts' = the officially accepted set." },
      { "w": "HERETICAL", "pos": "adj", "cluster": "Dissent", "def": "Contrary to accepted or orthodox views; radically unorthodox to the point of being dangerous", "ex": "In 1600, proposing that the Earth orbited the sun was not merely unorthodox — it was heretical and potentially fatal.", "tip": "Heretical = challenges what an authority holds sacred. Root: hairetikos (able to choose) = chooses against the official view." },
      { "w": "MAVERICK", "pos": "n/adj", "cluster": "Dissent", "def": "An independent-minded person who refuses to follow the crowd; unconventional and self-directed", "ex": "The maverick scientist abandoned the consensus theory and — after years of ridicule — was vindicated by new data.", "tip": "Named after Samuel Maverick, a Texas rancher who didn't brand his cattle. Maverick = independent, not necessarily rebellious." },
      { "w": "TRANSGRESS", "pos": "v", "cluster": "Dissent", "def": "To go beyond the limits of what is morally or legally acceptable; to violate a rule or law", "ex": "The artist deliberately transgressed every convention of the form, producing work that outraged and fascinated.", "tip": "Transgress = cross a line that should not be crossed. Root: trans (across) + gradi (to step). Transgression is the noun." },
      { "w": "SUBVERSIVE", "pos": "adj/n", "cluster": "Dissent", "def": "Seeking to undermine the power and authority of an established system or institution", "ex": "The novel was banned for its subversive content — its quiet mockery of every pillar of the official ideology.", "tip": "Subversive = undermines from below. Root: sub (under) + vertere (to turn). Subversive activity = actively working to topple." },
      { "w": "ACQUIESCE", "pos": "v", "cluster": "Submit", "def": "To accept something reluctantly but without protest; to comply passively; to go along with", "ex": "She acquiesced to the board's decision while making clear in writing that she believed it was wrong.", "tip": "Acquiesce = give in without fighting. Root: acquiescere (to rest in). Key: acquiescence is passive — no protest, but no enthusiasm." },
      { "w": "CAPITULATE", "pos": "v", "cluster": "Submit", "def": "To cease to resist; to surrender; to give in after a period of resistance", "ex": "After three months of negotiations, the union finally capitulated — accepting terms it had publicly rejected.", "tip": "Capitulate = surrender after fighting. Root: capitulum (chapter) = agreeing to terms chapter by chapter. Implies prior resistance." },
      { "w": "DEFER", "pos": "v", "cluster": "Submit", "def": "To show respectful submission to another's opinion or decision; to yield out of respect", "ex": "Despite her private doubts, she deferred to the senior partner's judgment on matters of courtroom strategy.", "tip": "Defer = yield out of RESPECT, not defeat. 'Deferred to his expertise.' Distinguished from capitulate (surrender after fight)." },
      { "w": "ASSENT", "pos": "n/v", "cluster": "Submit", "def": "Agreement or approval, especially by those in authority; to express agreement", "ex": "The committee gave its assent to the proposal after surprisingly little debate.", "tip": "Assent = formal agreement. Distinguished from consent (permission) — assent is agreement with a proposal or idea." },
      { "w": "CONCEDE", "pos": "v", "cluster": "Submit", "def": "To admit that something is true after initially denying it; to yield; to give up a point", "ex": "After reviewing the new data, he conceded that his original hypothesis had been incorrect.", "tip": "Concede = admit a specific point. Root: concedere (to yield). 'Concede a point/defeat/an argument.' More limited than capitulate." },
      { "w": "CONTUMACIOUS", "pos": "adj", "cluster": "Resist", "def": "Stubbornly or willfully disobedient to authority; insubordinate; refusing to comply", "ex": "The contumacious defendant interrupted proceedings repeatedly, earning a contempt of court citation.", "tip": "Contumacious = defiant of authority in a way that demands punishment. Root: contumacia (stubbornness). Legal contexts." },
      { "w": "RECUSANT", "pos": "n/adj", "cluster": "Resist", "def": "A person who refuses to submit to an authority or comply with an official requirement", "ex": "The recusant minority refused to take the oath, accepting fines and legal penalties rather than compromise.", "tip": "Recusant = historically: Catholics who refused to attend Anglican services. GRE uses it for any principled non-compliance." },
      { "w": "DEVIANT", "pos": "adj/n", "cluster": "Resist", "def": "Departing from usual or accepted standards; a person whose behavior differs markedly from the norm", "ex": "The deviant methodology — abandoning standard controls — produced results that mainstream journals refused to publish.", "tip": "Deviant = departs from the norm, often implying unacceptability. Root: deviare (to go off the road). Can be neutral or negative." }
    ]
  },
  {
    "day": 23,
    "theme": "Importance & Triviality",
    "date": "May 28, 2026",
    "patterns": [
      "Pivotal (turning point) vs Paramount (supreme importance) vs Cardinal (fundamental/primary) — all mean important but: pivotal = turns things · paramount = highest · cardinal = foundational",
      "Peripheral (on the edge) vs Tangential (barely touching) vs Inconsequential (no result) — three ways of saying 'not central'",
      "Perfunctory = done as a minimal routine without real effort · Desultory = done without plan, jumping between things — both suggest inadequate engagement",
      "Nugatory and Paltry both mean trivially small but: nugatory = futile/of no legal force · paltry = pitifully small in amount"
    ],
    "words": [
      { "w": "PIVOTAL", "pos": "adj", "cluster": "Important", "def": "Of crucial importance in relation to the development or success of something; forming a turning point", "ex": "The 1942 battle proved pivotal — a loss there would have altered the entire trajectory of the war.", "tip": "Pivotal = like a pivot: everything turns on it. Not just important — it's the hinge point. Root: pivot (turning point)." },
      { "w": "MOMENTOUS", "pos": "adj", "cluster": "Important", "def": "Of great importance or significance, especially having a major effect on future events", "ex": "The ruling was momentous — its implications would reshape constitutional law for generations.", "tip": "Momentous = carries great weight (moment). Reserved for historic events. 'A momentous decision/occasion/step.'" },
      { "w": "CONSEQUENTIAL", "pos": "adj", "cluster": "Important", "def": "Resulting in important consequences; significant in its effects; of great importance", "ex": "The consequential reform transformed how millions of workers were classified and compensated.", "tip": "Consequential = produces significant consequences. Also means 'self-important' (pompous) — context determines which meaning." },
      { "w": "PARAMOUNT", "pos": "adj", "cluster": "Important", "def": "More important than anything else; supreme; having the highest rank or authority", "ex": "The safety of the passengers was paramount — every other consideration was secondary.", "tip": "Paramount = above all others. Root: paramunt (Old French) = above on the mountain. 'Of paramount importance' = GRE phrase." },
      { "w": "CARDINAL", "pos": "adj", "cluster": "Important", "def": "Of fundamental importance; foundational; essential; primary", "ex": "The cardinal rule of the profession was simple: never compromise client confidentiality for any reason.", "tip": "Cardinal = foundational, like the cardinal directions (N/S/E/W) that organize all navigation. 'Cardinal sin/rule/principle.'" },
      { "w": "PERIPHERAL", "pos": "adj", "cluster": "Trivial", "def": "Relating to the outer edges; of minor importance; not central to the main issue", "ex": "The question of office furniture was peripheral to the real negotiations about salary and benefits.", "tip": "Peripheral = on the periphery (outer edge). Root: peri (around) + phora (carrying) = carried around the outside." },
      { "w": "TANGENTIAL", "pos": "adj", "cluster": "Trivial", "def": "Diverging from the subject; only superficially relevant; barely related", "ex": "His tangential remarks about ancient Rome were interesting but unhelpful in resolving the budget dispute.", "tip": "Tangential = touches but doesn't engage. Root: tangere (to touch). Like a tangent line — touches the circle at one point then goes off." },
      { "w": "INCONSEQUENTIAL", "pos": "adj", "cluster": "Trivial", "def": "Not important or significant; too small or unimportant to be worth consideration", "ex": "The typographical errors were inconsequential — they affected no meaning and misled no reader.", "tip": "Inconsequential = produces no consequences. The logical opposite of consequential. Often used to dismiss objections." },
      { "w": "NEGLIGIBLE", "pos": "adj", "cluster": "Trivial", "def": "So small or unimportant as to be not worth considering; insignificant", "ex": "The margin of error was negligible — less than 0.01 percent — and did not affect the study's conclusions.", "tip": "Negligible = can be neglected. Root: neglegere (to neglect). Used for quantities, margins, risks that are too small to matter." },
      { "w": "TRIFLING", "pos": "adj", "cluster": "Trivial", "def": "Unimportant and not serious; treating serious matters as if they were trivial", "ex": "He dismissed her objections as trifling — an attitude she found insulting given the genuine stakes.", "tip": "Trifling = trivial. Also means to treat something casually. 'Trifling matters' = unimportant. 'Trifling with someone' = not taking seriously." },
      { "w": "NUGATORY", "pos": "adj", "cluster": "Trivial", "def": "Of no value or importance; futile; having no legal force", "ex": "The amendment, though passed, was nugatory — it conferred rights the courts had already established.", "tip": "Nugatory = futile or legally void. Root: nugari (to trifle). Specific GRE use: a nugatory law = one with no practical effect." },
      { "w": "PALTRY", "pos": "adj", "cluster": "Trivial", "def": "Small or meager; pitifully insufficient; contemptibly small in amount", "ex": "The paltry settlement — five thousand dollars for a career-ending injury — insulted every observer.", "tip": "Paltry = pitifully small. Always implies the smallness is insulting or inadequate. 'A paltry sum/amount/increase.'" },
      { "w": "NOMINAL", "pos": "adj", "cluster": "Trivial", "def": "Existing in name only; trifling in value relative to the actual worth; very small", "ex": "The chairman exercised nominal authority — in practice, decisions flowed from the three largest shareholders.", "tip": "Nominal = name only. Root: nominalis (of a name). 'A nominal fee/role/price' = technically exists but practically insignificant." },
      { "w": "PERFUNCTORY", "pos": "adj", "cluster": "Minimal", "def": "Carried out with minimum effort or care; done as a routine duty without real engagement", "ex": "The safety inspection was perfunctory — a ten-minute walkthrough that missed every significant hazard.", "tip": "Perfunctory = going through the motions. Root: perfunctus (to get through). The act is done but with no real investment." },
      { "w": "DESULTORY", "pos": "adj", "cluster": "Minimal", "def": "Lacking a plan or purpose; going from one thing to another without any fixed direction", "ex": "Their desultory conversation drifted across three continents and four decades without settling anywhere.", "tip": "Desultory = jumping between things without purpose. Root: desultor (circus rider who leaped between horses). No coherent thread." }
    ]
  },
  {
    "day": 24,
    "theme": "Speed, Time & Sequence",
    "date": "May 29, 2026",
    "patterns": [
      "Alacrity = enthusiastic WILLINGNESS to act quickly · Expeditious = actually acting quickly and efficiently — willingness vs execution",
      "Dilatory (deliberately slow to delay) vs Protracted (drawn out over time) vs Interminable (seemingly endless) — increasing frustration",
      "Nascent (just beginning to develop) vs Incipient (in early stages, often of something bad) vs Imminent (about to happen now)",
      "Anachronism = placing something in the wrong time period — always involves a mismatch between a thing and its era"
    ],
    "words": [
      { "w": "EXPEDITIOUS", "pos": "adj", "cluster": "Fast", "def": "Acting or done with speed and efficiency; prompt and effective", "ex": "The expeditious handling of the visa application — approved within 24 hours — reflected the new streamlined process.", "tip": "Expeditious = fast AND efficient. Root: expedire (to free the feet) = removes obstacles to quick movement." },
      { "w": "ALACRITY", "pos": "n", "cluster": "Fast", "def": "Brisk and cheerful readiness; eager willingness and enthusiasm in acting", "ex": "She accepted the overseas assignment with alacrity — this was exactly the challenge she had been seeking.", "tip": "Alacrity = eager willingness to move quickly. Root: alacer (brisk). The enthusiasm is the defining feature, not just the speed." },
      { "w": "PRECIPITATE", "pos": "adj/v", "cluster": "Fast", "def": "Done without enough thought; hasty; OR to cause an event to happen suddenly or prematurely", "ex": "His precipitate resignation — announced without warning — plunged the organization into immediate crisis.", "tip": "Precipitate as adj = rashly hasty. As verb = cause to happen suddenly. Root: praecipitare (to throw headlong). Two GRE uses." },
      { "w": "IMPETUOUS", "pos": "adj", "cluster": "Fast", "def": "Acting or done quickly without thought or care; impulsive; driven by force or passion", "ex": "Her impetuous decision to quit — made in anger and reversed by morning — damaged her professional reputation.", "tip": "Impetuous = moved by force/passion without thinking. Root: impetus (force, attack). Capricious = random · Impetuous = driven by impulse." },
      { "w": "DILATORY", "pos": "adj", "cluster": "Slow", "def": "Slow to act; intended to cause delay; tending to procrastinate or postpone", "ex": "The dilatory tactics of the defense — filing endless motions — stretched what should have been a two-week trial.", "tip": "Dilatory = delays deliberately. Root: dilatus (put off). 'Dilatory tactics' = deliberate procedural delay. Always intentional." },
      { "w": "PROTRACTED", "pos": "adj", "cluster": "Slow", "def": "Lasting for a long time; prolonged; drawn out beyond what is normal or expected", "ex": "After protracted negotiations spanning three years, the parties finally reached a settlement.", "tip": "Protracted = stretched out over time. Root: protractus (drawn forward). 'Protracted conflict/negotiations/illness.'" },
      { "w": "INTERMINABLE", "pos": "adj", "cluster": "Slow", "def": "Endless or seemingly endless; tiresomely long; having or seeming to have no end", "ex": "The interminable committee meetings — three hours each, twice weekly — left everyone too exhausted to implement anything.", "tip": "Interminable = cannot be terminated (ended). Root: in + terminus (end). Implies the listener's suffering at the length." },
      { "w": "ANACHRONISM", "pos": "n", "cluster": "Time", "def": "A thing belonging to a period other than that in which it exists; a misplaced relic of another era", "ex": "The novelist's use of smartphones in a 1920s setting was an anachronism that jolted readers out of the story.", "tip": "Anachronism = wrong time period. Root: ana (against) + chronos (time). Can be accidental (error) or deliberate (commentary)." },
      { "w": "CONTEMPORANEOUS", "pos": "adj", "cluster": "Time", "def": "Existing or occurring at the same time; simultaneous; of the same period", "ex": "The two discoveries — made by scientists on opposite continents — were entirely contemporaneous and unconnected.", "tip": "Contemporaneous = at the same time. Root: con (together) + tempus (time). Distinguish from contemporary (modern/current)." },
      { "w": "ANTECEDENT", "pos": "n/adj", "cluster": "Sequence", "def": "A thing or event that comes before or precedes something; a preceding circumstance or cause", "ex": "Understanding the antecedents of the conflict requires examining three decades of economic and political history.", "tip": "Antecedent = comes before. Root: ante (before) + cedere (to go). In grammar: the noun that a pronoun refers to." },
      { "w": "NASCENT", "pos": "adj", "cluster": "Sequence", "def": "Just coming into existence and beginning to develop; in the earliest stages; emerging", "ex": "The nascent democracy faced immediate challenges — infant institutions, rival factions, and empty coffers.", "tip": "Nascent = being born. Root: nasci (to be born). 'A nascent industry/movement/talent.' Neutral — just newly forming." },
      { "w": "INCIPIENT", "pos": "adj", "cluster": "Sequence", "def": "In an early stage and beginning to happen or develop; initial; often used of something unwelcome", "ex": "The doctor recognized the incipient signs of the disease before the patient felt any symptoms.", "tip": "Incipient = starting to begin. Root: incipere (to begin). Often used for problems or diseases at an early, treatable stage." },
      { "w": "IMMINENT", "pos": "adj", "cluster": "Sequence", "def": "About to happen very soon; impending; close in time and hard to avoid", "ex": "With the storm imminent, evacuations were ordered for all coastal communities below the flood line.", "tip": "Imminent = about to happen NOW. Root: imminere (to overhang). Distinguished from nascent (beginning) and incipient (starting)." },
      { "w": "SPORADIC", "pos": "adj", "cluster": "Pattern", "def": "Occurring at irregular intervals; not frequent or steady; scattered and occasional", "ex": "Reports of sporadic violence continued to emerge from the region, preventing any declaration of stability.", "tip": "Sporadic = irregular, unpredictable intervals. Root: sporas (scattered seed). 'Sporadic fighting/outbreaks/appearances.'" },
      { "w": "INTERMITTENT", "pos": "adj", "cluster": "Pattern", "def": "Occurring at irregular intervals; stopping and starting periodically; not continuous", "ex": "The intermittent power cuts made it impossible to plan around reliable electricity.", "tip": "Intermittent = stops and starts. Root: inter (between) + mittere (to send). Intermittent = gaps between occurrences. Sporadic = random timing." }
    ]
  },
  {
    "day": 25,
    "theme": "Conflict, Peace & Resolution",
    "date": "May 30, 2026",
    "patterns": [
      "Acrimonious (bitter and angry in manner) vs Contentious (likely to cause argument) vs Antagonistic (actively hostile) — manner vs tendency vs stance",
      "Irenic and Pacific both mean peace-promoting — irenic = specifically inclined toward peace · pacific = calm and peaceable",
      "Détente = specifically the easing of tension between NATIONS — not just any resolution",
      "Polemical = of or involving strongly controversial argument — the person argues aggressively for a position"
    ],
    "words": [
      { "w": "CONSENSUS", "pos": "n", "cluster": "Peace", "def": "General agreement; the majority of opinion; collective judgment reached by a group", "ex": "After hours of debate, the committee reached a consensus that satisfied no one completely but everyone sufficiently.", "tip": "Consensus = agreed by all (or most). Root: con (together) + sentire (to feel). Distinguished from mere majority — consensus implies broad agreement." },
      { "w": "CONCORD", "pos": "n", "cluster": "Peace", "def": "Agreement or harmony between people or groups; a state of peace and friendship", "ex": "The treaty established a concord between nations that had been at war for three generations.", "tip": "Concord = harmonious agreement. Root: con (together) + cor (heart) = hearts together. More formal and elevated than 'agreement.'" },
      { "w": "AMICABLE", "pos": "adj", "cluster": "Peace", "def": "Having a spirit of friendliness; done in a friendly way without disagreement", "ex": "Despite the divorce, the two parties reached an amicable settlement that protected their children from conflict.", "tip": "Amicable = friendly in spirit. Root: amicus (friend). 'An amicable settlement/parting/resolution.' Always implies goodwill." },
      { "w": "IRENIC", "pos": "adj", "cluster": "Peace", "def": "Aiming at peace; inclined toward peace and reconciliation; peaceable", "ex": "The irenic tone of his response — conciliatory and measured — defused a situation that could have escalated.", "tip": "Irenic = peace-seeking. Root: eirene (Greek) = peace. The same root as Irene and the Eirene (goddess of peace). Rare but GRE-tested." },
      { "w": "PACIFIC", "pos": "adj", "cluster": "Peace", "def": "Peaceful in character; tending to lessen conflict; calm and tranquil", "ex": "His pacific manner — never raising his voice, always finding common ground — made him an exceptional mediator.", "tip": "Pacific = peaceable. Root: pax (peace) + facere (to make). 'Pacific' the ocean = named for its calm. The adjective means peace-promoting." },
      { "w": "DÉTENTE", "pos": "n", "cluster": "Peace", "def": "The easing of hostility or strained relations between countries; a period of reduced tension", "ex": "The Cold War détente of the 1970s allowed trade and cultural exchange that had been impossible for decades.", "tip": "Détente = specifically geopolitical easing of tension. French word: 'relaxation.' GRE RC passages about international relations use this frequently." },
      { "w": "CONTENTIOUS", "pos": "adj", "cluster": "Conflict", "def": "Causing or likely to cause argument; controversial; prone to disagreement", "ex": "The redistricting proposal was deeply contentious — every map drawn benefited one party at another's expense.", "tip": "Contentious = breeds contention. Root: contendere (to struggle). 'A contentious issue/debate/decision.' The topic itself causes conflict." },
      { "w": "ACRIMONIOUS", "pos": "adj", "cluster": "Conflict", "def": "Angry and bitter, especially in speech or manner; sharp and harsh in feelings expressed", "ex": "The acrimonious divorce trial — marked by personal attacks from both sides — lasted eighteen months.", "tip": "Acrimonious = sharp bitterness in manner. Root: acer (sharp) + monia. 'An acrimonious dispute/parting/exchange.' The bitterness is personal." },
      { "w": "ANTAGONISTIC", "pos": "adj", "cluster": "Conflict", "def": "Showing or feeling active opposition or hostility; contrary and opposing", "ex": "The two departments had grown antagonistic over years of budget competition, undermining every collaborative project.", "tip": "Antagonistic = actively opposing. Root: anti (against) + agonizesthai (to struggle). More active than merely disagreeing." },
      { "w": "INIMICAL", "pos": "adj", "cluster": "Conflict", "def": "Tending to obstruct or harm; hostile; unfavorable to something", "ex": "The harsh growing conditions were inimical to the crops, which withered despite careful tending.", "tip": "Inimical = harmful and hostile. Root: inimicus (enemy). Can describe things (conditions inimical to growth) or people. GRE uses both." },
      { "w": "DISCORD", "pos": "n", "cluster": "Conflict", "def": "Disagreement between people; lack of harmony; strife; a harsh combination of sounds", "ex": "Discord within the coalition — over taxation, immigration, and trade — eventually brought the government down.", "tip": "Discord = dis + cord (heart) = hearts apart. Opposite of concord. Can describe relationships, music, or abstract disagreement." },
      { "w": "DIVISIVE", "pos": "adj", "cluster": "Conflict", "def": "Tending to cause disagreement or hostility between people; creating division", "ex": "Few policies are as divisive as those touching immigration — they fracture coalitions and unite opponents.", "tip": "Divisive = splits groups. Root: dividere (to divide). 'A divisive figure/issue/policy.' The thing itself creates the split." },
      { "w": "POLEMICAL", "pos": "adj", "cluster": "Argument", "def": "Relating to or involving strongly controversial argument; written or spoken in an attacking style", "ex": "The polemical essay — brilliant but one-sided — won converts among sympathizers and alienated everyone else.", "tip": "Polemical = argumentative and combative in defense of a position. Root: polemos (war). A polemic is the noun — a sustained attack on a position." },
      { "w": "DISPUTATIOUS", "pos": "adj", "cluster": "Argument", "def": "Fond of arguing; excessively prone to debate and controversy; quarrelsome about opinions", "ex": "The disputatious philosopher challenged every proposition, including those he privately agreed with.", "tip": "Disputatious = loves to dispute. Root: disputare (to argue). More about habitual argument than about any particular conflict." },
      { "w": "LITIGIOUS", "pos": "adj", "cluster": "Argument", "def": "Excessively inclined to go to law; prone to engaging in lawsuits; quarrelsome in a legal sense", "ex": "The litigious corporation sued competitors, suppliers, former employees, and even its own shareholders.", "tip": "Litigious = quick to sue. Root: litigare (to dispute in court). 'A litigious society/individual.' Always involves legal action or the threat of it." }
    ]
  },
  {
    "day": 26,
    "theme": "Language, Rhetoric & Expression",
    "date": "May 31, 2026",
    "patterns": [
      "Trenchant (vigorous and incisive — cuts through) vs Incisive (intelligently analytical and clear) — both sharp, but trenchant is more forceful and combative",
      "Florid (excessively ornate in writing) vs Eloquent (fluent and persuasive) — florid = too much decoration · eloquent = effective communication",
      "Circumlocution = using many words where fewer would do · Euphemism = replacing a harsh word with a mild one — both avoid directness, for different reasons",
      "Bowdlerize and Expurgate both mean to censor — bowdlerize = remove offensive content · expurgate = remove objectionable passages (more neutral, less ridiculous)"
    ],
    "words": [
      { "w": "ELOQUENT", "pos": "adj", "cluster": "Effective", "def": "Fluent or persuasive in speaking or writing; expressing ideas vividly and movingly", "ex": "Her eloquent closing argument transformed the jury's understanding of the case in under twenty minutes.", "tip": "Eloquent = effective, moving communication. Root: eloqui (to speak out). Not just fancy — genuinely persuasive and clear." },
      { "w": "TRENCHANT", "pos": "adj", "cluster": "Effective", "def": "Vigorous or incisive in expression or style; sharply perceptive and direct", "ex": "His trenchant analysis exposed the flaw in the government's reasoning that weeks of official denial had obscured.", "tip": "Trenchant = cuts through. Root: trencher (cutting tool). 'Trenchant criticism/analysis/wit.' Vigorous and penetrating, not just clear." },
      { "w": "INCISIVE", "pos": "adj", "cluster": "Effective", "def": "Intelligently analytical and clear-thinking; sharp and direct in a way that gets to the point", "ex": "Her incisive questions dismantled the witness's composure within three minutes of cross-examination.", "tip": "Incisive = cuts right in. Root: incidere (to cut into). Distinguished from trenchant: incisive = analytically sharp · trenchant = forcefully combative." },
      { "w": "FELICITOUS", "pos": "adj", "cluster": "Effective", "def": "Well chosen or suited to the circumstances; pleasingly apt and appropriate in expression", "ex": "The speaker's felicitous choice of metaphor — comparing the merger to a marriage — resonated throughout the speech.", "tip": "Felicitous = happily apt. Root: felix (happy). 'A felicitous phrase/metaphor/comparison.' The word fits perfectly, like a key in a lock." },
      { "w": "DECLAIM", "pos": "v", "cluster": "Effective", "def": "To utter words in a rhetorical, loud, or forceful manner; to make a speech with dramatic emphasis", "ex": "The senator declaimed against the proposed cuts, his voice rising as he described their human cost.", "tip": "Declaim = formal rhetorical speaking, often with passion. Root: declamare (to practice speaking). Can imply excessive theatricality." },
      { "w": "FLORID", "pos": "adj", "cluster": "Excessive", "def": "Elaborately or excessively ornate; using too many rhetorical devices; overly flowery in expression", "ex": "The Victorian novelist's florid prose — dense with subordinate clauses and purple adjectives — exhausted modern readers.", "tip": "Florid = flowery to excess. Root: floridus (flowery). Used for prose, speech, architecture. Always implies excess decoration over substance." },
      { "w": "CIRCUMLOCUTION", "pos": "n", "cluster": "Excessive", "def": "The use of many words where fewer would suffice; evasive, indirect, or wordy expression", "ex": "The politician's trademark circumlocution — answering every question with a story about his childhood — infuriated journalists.", "tip": "Circumlocution = talking around the point. Root: circum (around) + loqui (to speak) = talking around. Different from euphemism — circumlocution uses volume, not substitution." },
      { "w": "RHETORICAL", "pos": "adj", "cluster": "Argument", "def": "Relating to the art of effective or persuasive speaking; used for persuasive effect rather than sincere inquiry", "ex": "His rhetorical question — 'Are we really going to let this continue?' — was met with applause, not answers.", "tip": "Rhetorical question = asked for effect, not information. Rhetoric = the art of persuasion. Rhetorical can be neutral (persuasive) or pejorative (empty flourish)." },
      { "w": "DIATRIBE", "pos": "n", "cluster": "Argument", "def": "A forceful and bitter verbal attack against someone or something; a fierce criticism or denunciation", "ex": "What began as a review descended into a diatribe — eight pages of personal attack with little critical substance.", "tip": "Diatribe = sustained bitter verbal assault. Root: diatribein (to wear away). More sustained and bitter than mere criticism." },
      { "w": "PEJORATIVE", "pos": "adj/n", "cluster": "Words", "def": "Expressing contempt or disapproval; a word or phrase that has a negative or degrading connotation", "ex": "'Bureaucrat' began neutrally but acquired pejorative connotations through decades of association with inefficiency.", "tip": "Pejorative = makes something seem worse. Root: pejorare (to make worse). 'Pejorative connotations/term/sense.' The opposite of ameliorative." },
      { "w": "EUPHEMISM", "pos": "n", "cluster": "Words", "def": "A mild or indirect word or expression substituted for one that might seem offensive or blunt", "ex": "'Downsizing' became the corporate euphemism for mass layoffs that no executive wanted to say plainly.", "tip": "Euphemism = make it sound better. Root: eu (good) + pheme (speech) = good-sounding speech. Opposite: dysphemism (making something sound worse deliberately)." },
      { "w": "COLLOQUIAL", "pos": "adj", "cluster": "Words", "def": "Used in ordinary or familiar conversation; informal; characteristic of casual speech", "ex": "The colloquial expression 'break a leg' baffled the visiting diplomat who took it literally.", "tip": "Colloquial = conversational, informal register. Root: colloquium (conversation). 'Colloquial language/expression/usage.' Not slang — informal but standard." },
      { "w": "VERNACULAR", "pos": "n/adj", "cluster": "Words", "def": "The language or dialect spoken by ordinary people; native speech; everyday language", "ex": "The poet wrote in the vernacular rather than Latin, making the work accessible to non-scholars for the first time.", "tip": "Vernacular = the language of the people. Root: vernaculus (native). 'In the vernacular' = in plain everyday speech. GRE RC passages about language history use this." },
      { "w": "EXPURGATE", "pos": "v", "cluster": "Words", "def": "To remove matter considered objectionable or offensive from a text; to censor by deletion", "ex": "The publisher expurgated three chapters before releasing the memoir in markets with stricter censorship laws.", "tip": "Expurgate = remove offensive passages. Root: ex (out) + purgare (to cleanse). More neutral than bowdlerize — expurgation can be appropriate." },
      { "w": "BOWDLERIZE", "pos": "v", "cluster": "Words", "def": "To remove from a text material considered improper or offensive, especially in a prudish or ridiculous way", "ex": "The school edition bowdlerized the play so thoroughly that its tragic force was entirely lost.", "tip": "Named after Thomas Bowdler who published a 'family' Shakespeare removing all 'objectionable' passages. Bowdlerize = always implies excessive, ridiculous sanitizing." }
    ]
  },
  {
    "day": 27,
    "theme": "Appearance, Illusion & Reality",
    "date": "Jun 1, 2026",
    "patterns": [
      "Ostensible (appears to be; professed) vs Putative (generally reputed to be) — ostensible = apparent surface · putative = what people believe/assume",
      "Apocryphal (of doubtful authenticity but widely repeated) vs Spurious (not genuine) — apocryphal = possibly legendary · spurious = definitely false",
      "Verisimilitude = the QUALITY of appearing real — essential in fiction. Does not mean 'true,' only 'seeming true.'",
      "Chimera = an impossible dream or illusion — named after the Greek mythological creature (lion/goat/serpent). Chimerical = wildly unrealistic."
    ],
    "words": [
      { "w": "ILLUSORY", "pos": "adj", "cluster": "False", "def": "Based on illusion; not what it seems to be; deceptive; producing a false impression", "ex": "The sense of progress was illusory — the statistics looked better only because the methodology had been changed.", "tip": "Illusory = creates an illusion. Root: illudere (to mock). The thing seems real but isn't. Distinguished from specious (sounds convincing but is wrong)." },
      { "w": "CHIMERA", "pos": "n", "cluster": "False", "def": "Something hoped for but in fact impossible to achieve; an illusory dream or fantasy", "ex": "Critics called the plan a chimera — promising but built on assumptions that bore no relation to economic reality.", "tip": "Named after the Greek monster (lion's head, goat's body, serpent's tail). A chimera = an impossible combination. Chimerical = wildly unrealistic." },
      { "w": "OSTENSIBLE", "pos": "adj", "cluster": "Surface", "def": "Appearing as such on the surface but not necessarily so in reality; professed; apparent", "ex": "The ostensible purpose of the visit was cultural exchange; its real aim was intelligence gathering.", "tip": "Ostensible = what it claims to be (which may differ from reality). Root: ostendere (to show). 'Ostensibly' is the adverb — very common in GRE RC." },
      { "w": "PUTATIVE", "pos": "adj", "cluster": "Surface", "def": "Generally considered or reputed to be; supposed; assumed to be the case without proof", "ex": "The putative author of the work has never been definitively identified — three scholars have been proposed.", "tip": "Putative = what people think it is. Root: putare (to think). 'The putative cause/author/heir.' Implies reasonable assumption, not established fact." },
      { "w": "ERSATZ", "pos": "adj", "cluster": "Surface", "def": "Made or used as a substitute; not real; an inferior artificial imitation of the original", "ex": "The ersatz coffee — made from chicory during wartime rationing — tasted nothing like the real thing.", "tip": "Ersatz = substitute that doesn't measure up. German word (literally 'replacement'). Always implies inferiority. 'Ersatz democracy/culture/affection.'" },
      { "w": "VERISIMILITUDE", "pos": "n", "cluster": "Seeming", "def": "The appearance of being true or real; plausibility; the quality that makes fiction convincing", "ex": "The historical novel achieved remarkable verisimilitude — readers repeatedly forgot they were reading fiction.", "tip": "Verisimilitude = SEEMS real, not necessarily IS real. Root: verus (true) + similis (like). Essential concept in literary criticism and GRE RC about fiction." },
      { "w": "APOCRYPHAL", "pos": "adj", "cluster": "Seeming", "def": "Of doubtful authenticity, although widely believed or circulated; legendary rather than factual", "ex": "The story of Newton and the apple is probably apocryphal — charming and plausible, but unsupported by contemporary sources.", "tip": "Apocryphal = possibly legendary. Root: apokryptein (to hide away). Apocrypha = hidden/unofficial texts. Apocryphal ≠ false — just unverifiable and possibly invented." },
      { "w": "BONA FIDE", "pos": "adj", "cluster": "Genuine", "def": "Genuine; real; made in good faith without fraud or deception", "ex": "The investigators confirmed it was a bona fide offer — the buyer had the funds and the legal standing to proceed.", "tip": "Bona fide = good faith (Latin). Opposite of fraudulent or spurious. 'A bona fide expert/offer/emergency.' Always signals authenticity." },
      { "w": "FEIGN", "pos": "v", "cluster": "Genuine", "def": "To pretend to be affected by something; to put on a false appearance; to simulate falsely", "ex": "She feigned indifference to the outcome even as her hands shook beneath the conference table.", "tip": "Feign = fake a feeling or condition. Root: fingere (to form/invent). 'Feign surprise/illness/ignorance.' Distinguished from dissemble (hide real feelings)." },
      { "w": "NOTIONAL", "pos": "adj", "cluster": "Theoretical", "def": "Existing as a concept or idea only; theoretical; not corresponding to actual reality", "ex": "The committee's notional budget bore no relationship to the actual costs of implementation.", "tip": "Notional = exists as a notion only. Root: notio (concept). 'A notional sum/value/distinction' = exists on paper but not in practice." },
      { "w": "FAÇADE", "pos": "n", "cluster": "Theoretical", "def": "The face of a building; an outward appearance that conceals the true nature of something", "ex": "The company's charitable giving was a façade — a PR operation designed to distract from its labor practices.", "tip": "Façade = front that hides what's behind. From French for 'face.' GRE uses primarily the figurative sense: a surface concealing reality." },
      { "w": "SPECULATIVE", "pos": "adj", "cluster": "Theoretical", "def": "Based on conjecture rather than established knowledge; involving financial risk; theoretical", "ex": "The historian acknowledged that her account of the king's motives was necessarily speculative, given the sources.", "tip": "Speculative = based on conjecture, not knowledge. Root: speculari (to observe). 'Speculative investment/theory/account.' Distinguished from empirical (based on evidence)." },
      { "w": "HYPOTHETICAL", "pos": "adj", "cluster": "Theoretical", "def": "Of or based on a hypothesis; supposed for the sake of argument; not necessarily real", "ex": "The professor posed a hypothetical scenario to test whether the principle held under extreme conditions.", "tip": "Hypothetical = assumed for argument's sake. Root: hypothesis (Greek) = groundwork. 'A hypothetical situation/example/question.' Always about the theoretical, not the actual." },
      { "w": "PSEUDO", "pos": "adj", "cluster": "Theoretical", "def": "Not genuine; falsely claiming to be something it is not; spurious; sham", "ex": "The pseudo-scientific language in the advertisement — 'clinically proven formulation' — had no backing whatsoever.", "tip": "Pseudo = false prefix. Root: pseudos (Greek) = false. 'Pseudo-intellectual/scientific/democratic.' Always signals that the label is false." },
      { "w": "SUPERFICIAL", "pos": "adj", "cluster": "Surface", "def": "Existing or occurring at the surface; not thorough or deep; concerned only with the obvious", "ex": "The superficial similarities between the two theories concealed profound differences in their underlying assumptions.", "tip": "Superficial = of the surface. Root: superficies (surface). 'Superficial understanding/analysis/similarity.' The depth is lacking." }
    ]
  },
  {
    "day": 28,
    "theme": "Essential GRE Verbs",
    "date": "Jun 2, 2026",
    "patterns": [
      "Obviate (remove the need for) vs Preclude (prevent from happening) — obviate = makes unnecessary · preclude = makes impossible",
      "Engender (give rise to — neutral) vs Foment (stir up — always negative) vs Galvanize (shock into action — positive/neutral)",
      "Conflate = incorrectly treat two distinct things as the same — always implies an error of reasoning",
      "Promulgate = make a law or idea widely known — implies official authority. Disseminate = spread widely — no authority implied"
    ],
    "words": [
      { "w": "CIRCUMVENT", "pos": "v", "cluster": "Avoid", "def": "To find a clever way around an obstacle, rule, or problem; to avoid by ingenuity", "ex": "The company circumvented the import restrictions by reclassifying the components as something else entirely.", "tip": "Circumvent = go around. Root: circum (around) + venire (to come). Implies cleverness, not necessarily wrongdoing — though often used negatively." },
      { "w": "OBVIATE", "pos": "v", "cluster": "Avoid", "def": "To remove a need, difficulty, or problem; to prevent from arising; to make unnecessary", "ex": "The new software obviated the need for manual data entry, eliminating twelve clerical positions.", "tip": "Obviate = remove the NEED for something. Root: obviare (to block the way). 'This obviates the need for...' is a GRE-favourite construction." },
      { "w": "PRECLUDE", "pos": "v", "cluster": "Avoid", "def": "To prevent from happening or arising; to make impossible; to rule out in advance", "ex": "Her earlier statement — made on the record — precluded any denial of her involvement in the decision.", "tip": "Preclude = make impossible before it can happen. Root: prae (before) + claudere (to close). Preclude ≠ prevent — preclude implies the door is shut entirely." },
      { "w": "FORESTALL", "pos": "v", "cluster": "Avoid", "def": "To prevent or obstruct something by taking action in advance; to preempt", "ex": "The bank's preemptive rate cut was designed to forestall the recession before it could take hold.", "tip": "Forestall = prevent by acting FIRST. Historical root: buying goods before they reach market to control price. Now: any preemptive action." },
      { "w": "POSIT", "pos": "v", "cluster": "Argue", "def": "To put forward as a fact or as a basis for argument; to assume as a starting point", "ex": "The economist posited that rational actors always maximize self-interest — a premise her critics found reductive.", "tip": "Posit = propose as a foundational assumption. Root: ponere (to place). More tentative than 'assert' — positing invites examination." },
      { "w": "IMPUTE", "pos": "v", "cluster": "Argue", "def": "To attribute something, especially blame or responsibility, to a cause or person", "ex": "It was unfair to impute malicious intent to a decision that was more likely the result of simple incompetence.", "tip": "Impute = attribute (usually blame). Root: imputare (to charge to an account). 'Impute blame/motive/significance TO someone.' Distinguished from ascribe." },
      { "w": "ASCRIBE", "pos": "v", "cluster": "Argue", "def": "To attribute something to a particular cause, person, or period; to regard as belonging to", "ex": "Historians ascribe the economic boom to three factors that converged fortuitously in the same decade.", "tip": "Ascribe = attribute causally. Root: ad (to) + scribere (to write). 'Ascribe to.' Neutral — no implication of blame. Compare impute (blame)." },
      { "w": "CONFLATE", "pos": "v", "cluster": "Argue", "def": "To combine two or more ideas, concepts, or things into one; to treat as the same when they are distinct", "ex": "The report conflated correlation with causation — a fundamental error that invalidated its main conclusions.", "tip": "Conflate = wrongly treat as identical. Root: conflare (to blow together). ALWAYS implies an error. 'Don't conflate X with Y' = they are genuinely different." },
      { "w": "MISCONSTRUE", "pos": "v", "cluster": "Argue", "def": "To misinterpret; to take the wrong meaning from something; to fail to understand correctly", "ex": "Her silence was misconstrued as agreement when in fact it signaled deep reservations she hadn't yet articulated.", "tip": "Misconstrue = misread or misinterpret. Root: construere (to build). 'Misconstrue the evidence/silence/intent.' Implies the error is in interpretation." },
      { "w": "PROMULGATE", "pos": "v", "cluster": "Spread", "def": "To make a law or decree widely known by official announcement; to promote an idea broadly", "ex": "The regulation was promulgated by the ministry and took effect thirty days after publication in the official gazette.", "tip": "Promulgate = officially declare AND spread widely. Root: promulgare (to make public). Implies official authority. 'Promulgate a law/doctrine/rule.'" },
      { "w": "ENGENDER", "pos": "v", "cluster": "Cause", "def": "To cause or give rise to a feeling, situation, or condition; to produce as a result", "ex": "The new policy engendered resentment among employees who felt their expertise had been ignored in its design.", "tip": "Engender = give birth to (figuratively). Root: generare (to produce). Neutral — can engender positive or negative things. No wrongdoing implied." },
      { "w": "FOMENT", "pos": "v", "cluster": "Cause", "def": "To instigate or stir up undesirable feelings, rebellion, or disorder; to incite", "ex": "Foreign agents were accused of fomenting discontent through targeted social media campaigns.", "tip": "Foment = stir up trouble. Root: fovere (to warm, incubate). ALWAYS negative — you foment unrest, rebellion, discord. Never used for good things." },
      { "w": "GALVANIZE", "pos": "v", "cluster": "Cause", "def": "To shock or excite someone into taking action; to stimulate or energize suddenly", "ex": "The general's speech galvanized the dispirited troops, transforming resignation into determination within minutes.", "tip": "Galvanize = shock into action (like an electric current). Named after Luigi Galvani who discovered electrical stimulation. Usually positive — produces decisive action." },
      { "w": "CURTAIL", "pos": "v", "cluster": "Reduce", "def": "To reduce in extent or quantity; to impose a restriction on; to limit", "ex": "Budget constraints forced the department to curtail its research program, deferring several projects indefinitely.", "tip": "Curtail = cut short. Root: court-tail (to dock a horse's tail). 'Curtail spending/freedoms/activities.' Implies reduction, not elimination." },
      { "w": "ELICIT", "pos": "v", "cluster": "Produce", "def": "To draw out or evoke a response, answer, or reaction from someone; to produce as a response", "ex": "The interviewer's carefully chosen question elicited the admission that all previous denials had been false.", "tip": "Elicit = draw out what's already there. Root: elicere (to draw out by charm). Distinguished from evoke (call up feelings) — elicit = extract specific information or response." }
    ]
  },
  {
    day: 29,
    theme: "Final SE Pair Mastery",
    date: "Jun 1, 2026",
    patterns: [
      "SE rewards semantic twins — not merely 'positive words'",
      "Wrong answers are often same tone but wrong nuance",
      "One precise synonym pair usually unlocks the question",
      "Extreme words rarely pair with moderate contexts"
    ],
    words: [
      {
        w: "LUCID",
        pos: "adj",
        cluster: "Clear",
        def: "Expressed clearly and easy to understand.",
        ex: "The professor gave a lucid explanation of quantum theory.",
        tip: "Lucid = clear expression. Pellucid = even clearer (rarer). Both opposite of opaque/obscure."
      },
      {
        w: "PELLUCID",
        pos: "adj",
        cluster: "Clear",
        def: "Exceptionally clear and transparent.",
        ex: "Her pellucid prose made difficult ideas accessible.",
        tip: "Stronger, rarer version of lucid."
      },
      {
        w: "OBSCURE",
        pos: "adj",
        cluster: "Unclear",
        def: "Difficult to understand or not well known.",
        ex: "The philosopher's obscure language frustrated readers.",
        tip: "Obscure has dual meaning: hard to understand AND little-known. Context determines which."
      },
      {
        w: "ARCANE",
        pos: "adj",
        cluster: "Unclear",
        def: "Known by only a few specialists.",
        ex: "The text explored arcane legal doctrines.",
        tip: "Arcane = secret specialist knowledge. Esoteric = for a select few. Arcane is more mysterious."
      },
      {
        w: "ESOTERIC",
        pos: "adj",
        cluster: "Unclear",
        def: "Intended for or understood by a small group.",
        ex: "The seminar focused on esoteric philosophy.",
        tip: "Esoteric = understood by few (intentionally). Abstruse = hard to understand (unintentionally)."
      },

      {
        w: "PRAGMATIC",
        pos: "adj",
        cluster: "Practical",
        def: "Focused on practical results.",
        ex: "The mayor adopted a pragmatic compromise.",
        tip: "Pragmatic = practical, results-focused. Dogmatic = rigidly ideological. Classic GRE antonym pair."
      },
      {
        w: "UTILITARIAN",
        pos: "adj",
        cluster: "Practical",
        def: "Designed primarily for usefulness rather than beauty.",
        ex: "The building's utilitarian design emphasized efficiency.",
        tip: "Utilitarian = purely functional. Aesthetic = focused on beauty. GRE loves this contrast."
      },
      {
        w: "IDEALISTIC",
        pos: "adj",
        cluster: "Abstract",
        def: "Guided by ideals more than practical concerns.",
        ex: "Her idealistic proposals lacked realistic funding.",
        tip: "Idealistic = noble but impractical. Pragmatic = its antonym. Utopian = extreme idealism."
      },
      {
        w: "VISIONARY",
        pos: "adj",
        cluster: "Abstract",
        def: "Showing imaginative insight about the future.",
        ex: "The visionary entrepreneur anticipated social changes decades early.",
        tip: "Positive future-oriented idealism."
      },
      {
        w: "UTOPIAN",
        pos: "adj",
        cluster: "Abstract",
        def: "Idealistic to an impractical degree.",
        ex: "Critics dismissed the reforms as utopian fantasy.",
        tip: "Utopian = impossibly perfect. Quixotic = similar but implies foolish romantic idealism."
      },

      {
        w: "SPORADIC",
        pos: "adj",
        cluster: "Frequency",
        def: "Occurring irregularly and infrequently.",
        ex: "The region experienced sporadic violence.",
        tip: "Sporadic = random, no pattern. Intermittent = stops and starts (has a rhythm). Key distinction."
      },
      {
        w: "INTERMITTENT",
        pos: "adj",
        cluster: "Frequency",
        def: "Stopping and starting repeatedly.",
        ex: "Intermittent rain delayed the event.",
        tip: "Intermittent = on-off-on pattern. Sporadic = random bursts. Continuous = their shared antonym."
      },
      {
        w: "PERPETUAL",
        pos: "adj",
        cluster: "Frequency",
        def: "Continuing indefinitely.",
        ex: "The city faced perpetual traffic congestion.",
        tip: "Perpetual = never stops (neutral). Incessant = never stops (annoying). Tone is the difference."
      },
      {
        w: "CHRONIC",
        pos: "adj",
        cluster: "Frequency",
        def: "Persisting for a long time or constantly recurring.",
        ex: "The country struggled with chronic instability.",
        tip: "Chronic = long-lasting (negative: chronic pain). Acute = sudden and severe. Medical metaphor."
      },
      {
        w: "UBIQUITOUS",
        pos: "adj",
        cluster: "Frequency",
        def: "Present or found everywhere.",
        ex: "Smartphones have become ubiquitous.",
        tip: "Ubiquitous = everywhere at once. Pervasive = spreading and hard to escape (more negative)."
      }
    ]
  },
  {
    day: 30,
    theme: "Final TC Contrast & Logic Mastery",
    date: "Jun 2, 2026",
    patterns: [
      "Contrast pivots usually reverse logic completely",
      "ETS rewards precision of logical relationship more than difficulty of vocabulary",
      "Moderate claims are statistically more correct than absolute claims",
      "Always identify sentence direction BEFORE evaluating choices"
    ],
    words: [
      {
        w: "ALIENATE",
        pos: "v",
        cluster: "Conflict",
        def: "To cause someone to feel isolated or estranged.",
        ex: "His arrogance alienated longtime supporters.",
        tip: "Alienate = social isolation. Estrange = emotional distance. Alienate is broader."
      },
      {
        w: "ENGENDER",
        pos: "v",
        cluster: "Conflict",
        def: "To produce or generate.",
        ex: "The reforms engendered optimism.",
        tip: "Engender = neutral creation. Foment = stir up TROUBLE specifically. Both = cause."
      },
      {
        w: "FOMENT",
        pos: "v",
        cluster: "Conflict",
        def: "To stir up or incite trouble.",
        ex: "The speech fomented political unrest.",
        tip: "Foment = deliberately incite unrest. Always negative. Galvanize = shock into action (neutral)."
      },
      {
        w: "GALVANIZE",
        pos: "v",
        cluster: "Conflict",
        def: "To shock or excite into action.",
        ex: "The scandal galvanized public opposition.",
        tip: "Galvanize = jolt into action (can be positive). Foment = incite disorder (always negative)."
      },
      {
        w: "PLACATE",
        pos: "v",
        cluster: "Conflict",
        def: "To calm or pacify anger.",
        ex: "Leaders tried to placate protesters with concessions.",
        tip: "Placate = calm anger. Appease = give in to demands. Mollify = soothe feelings. All reduce tension."
      },

      {
        w: "ERODE",
        pos: "v",
        cluster: "Decline",
        def: "To gradually weaken or diminish.",
        ex: "Public trust eroded over time.",
        tip: "Erode = gradual external wearing away. Atrophy = decay from disuse. Both = slow decline."
      },
      {
        w: "DWINDLE",
        pos: "v",
        cluster: "Decline",
        def: "To diminish gradually in size or strength.",
        ex: "Resources dwindled during the crisis.",
        tip: "Dwindle = shrink in quantity/number. Wane = decline in power/intensity. Both gradual."
      },
      {
        w: "ATROPHY",
        pos: "v",
        cluster: "Decline",
        def: "To weaken through lack of use.",
        ex: "Unused skills gradually atrophied.",
        tip: "Atrophy = waste away from DISUSE. Requires neglect. Erode = worn away by external force."
      },
      {
        w: "DETERIORATE",
        pos: "v",
        cluster: "Decline",
        def: "To become progressively worse.",
        ex: "Relations deteriorated rapidly after the dispute.",
        tip: "Deteriorate = get progressively worse (neutral). Degenerate = decline into LOWER moral state."
      },
      {
        w: "DEGENERATE",
        pos: "v",
        cluster: "Decline",
        def: "To decline morally or structurally.",
        ex: "The debate degenerated into insults.",
        tip: "Degenerate implies moral/structural collapse. Deteriorate is more neutral progressive worsening."
      },

      {
        w: "SPURIOUS",
        pos: "adj",
        cluster: "Validity",
        def: "False despite appearing genuine.",
        ex: "Researchers rejected the spurious correlation.",
        tip: "Spurious = fake data/evidence. Specious = flawed argument that SOUNDS convincing. Key distinction!"
      },
      {
        w: "SPECIOUS",
        pos: "adj",
        cluster: "Validity",
        def: "Superficially convincing but actually flawed.",
        ex: "His specious reasoning initially persuaded voters.",
        tip: "Specious = persuasive but wrong (arguments). Spurious = not genuine (data/claims). GRE loves this pair."
      },
      {
        w: "TENDENTIOUS",
        pos: "adj",
        cluster: "Validity",
        def: "Expressing biased or partisan views.",
        ex: "The documentary was criticized as tendentious propaganda.",
        tip: "Tendentious = biased toward a viewpoint. Stronger than partisan — implies deliberate distortion."
      },
      {
        w: "OBJECTIVE",
        pos: "adj",
        cluster: "Validity",
        def: "Uninfluenced by personal feelings or opinions.",
        ex: "The report aimed for objective analysis.",
        tip: "Objective = fact-based, no bias. Disinterested = impartial (NOT uninterested!). GRE trap word."
      },
      {
        w: "PARTISAN",
        pos: "adj/n",
        cluster: "Validity",
        def: "Strongly biased toward one side or cause.",
        ex: "Partisan rhetoric deepened divisions.",
        tip: "Partisan = loyal to one side. Tendentious = biased AND distorting. Partisan is milder."
      },

      {
        w: "SUPERFICIAL",
        pos: "adj",
        cluster: "Depth",
        def: "Concerned only with surface appearance.",
        ex: "The analysis was superficial and incomplete.",
        tip: "Superficial = surface-only. Cursory = quick glance. Perfunctory = going through motions."
      },
      {
        w: "PROFOUND",
        pos: "adj",
        cluster: "Depth",
        def: "Very deep or intellectually significant.",
        ex: "The philosopher offered profound insights into morality.",
        tip: "Profound = deeply meaningful. Superficial = its antonym. GRE TC pairs them as contrast pivots."
      },
      {
        w: "PERFUNCTORY",
        pos: "adj",
        cluster: "Depth",
        def: "Done with minimal effort or enthusiasm.",
        ex: "The committee conducted only a perfunctory investigation.",
        tip: "Perfunctory = done as duty, no care. Cursory = quick. Meticulous = opposite (extreme care)."
      },
      {
        w: "METICULOUS",
        pos: "adj",
        cluster: "Depth",
        def: "Showing extreme attention to detail.",
        ex: "The editor gave the manuscript meticulous review.",
        tip: "Meticulous = obsessive detail. Scrupulous adds moral dimension. Perfunctory = their antonym."
      },
      {
        w: "SCRUPULOUS",
        pos: "adj",
        cluster: "Depth",
        def: "Extremely careful and morally conscientious.",
        ex: "The journalist was scrupulous about verifying facts.",
        tip: "Scrupulous = careful + morally principled. Unscrupulous = no moral limits. Both GRE-tested."
      }
    ]
  }
];

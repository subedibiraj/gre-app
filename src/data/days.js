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
    day: 9,
    theme: "Change, Stability & Time",
    date: "May 13, 2026",

    patterns: [
      "Volatile = unstable and potentially explosive · Mercurial = rapid personality/mood shifts · Capricious = impulsively unpredictable · Fickle = changing loyalties/preferences",

      "Ephemeral / transient / fleeting / evanescent all mean temporary — but with different texture:",
      "Ephemeral = brief existence · Fleeting = quick passing moment · Evanescent = fading away delicately · Transient = temporary state or condition",

      "Static = lacking movement or growth · Immutable = incapable of change · Invariable = reliably constant",

      "Wane = gradual weakening · Atrophy = weakening from disuse · Deteriorate = general worsening · Oscillate = repeated movement between extremes",

      "GRE loves contrasts between dynamic vs static societies, enduring vs ephemeral trends, and volatile vs stable systems."
    ],

    words: [

      // ================= UNSTABLE =================

      {
        w: "VOLATILE",
        pos: "adj",
        cluster: "Unstable",
        def: "Liable to change rapidly and unpredictably, often violently or dangerously.",
        ex: "The volatile political climate made long-term planning nearly impossible.",
        tip: "Most intense instability — explosive, dangerous, unstable energy."
      },

      {
        w: "MERCURIAL",
        pos: "adj",
        cluster: "Unstable",
        def: "Changing suddenly and unpredictably in mood, behavior, or mind.",
        ex: "The mercurial actor could shift from charm to fury within minutes.",
        tip: "Usually describes PEOPLE and temperament. Emotional unpredictability."
      },

      {
        w: "CAPRICIOUS",
        pos: "adj",
        cluster: "Unstable",
        def: "Given to sudden, impulsive, and seemingly unmotivated changes.",
        ex: "The capricious supervisor kept altering deadlines without explanation.",
        tip: "Driven by whim rather than reason. Random unpredictability."
      },

      {
        w: "FICKLE",
        pos: "adj",
        cluster: "Unstable",
        def: "Frequently changing loyalties, affections, or opinions.",
        ex: "Public opinion proved fickle, turning against the candidate within weeks.",
        tip: "Usually about preferences, loyalties, tastes, or allegiances."
      },

      {
        w: "ERRATIC",
        pos: "adj",
        cluster: "Unstable",
        def: "Inconsistent, irregular, and unpredictable in movement or behavior.",
        ex: "Erratic internet access disrupted the research team's work.",
        tip: "Suggests lack of pattern or reliability."
      },

      {
        w: "VACILLATE",
        pos: "v",
        cluster: "Unstable",
        def: "To waver between different opinions, decisions, or actions.",
        ex: "The administration vacillated between aggressive reform and cautious delay.",
        tip: "Indecisive swinging between choices."
      },

      // ================= TEMPORARY =================

      {
        w: "EPHEMERAL",
        pos: "adj",
        cluster: "Temporary",
        def: "Lasting for a very short time.",
        ex: "The startup's success proved ephemeral once competitors entered the market.",
        tip: "One of the highest-frequency GRE words for temporary existence."
      },

      {
        w: "TRANSIENT",
        pos: "adj/n",
        cluster: "Temporary",
        def: "Temporary; passing quickly away rather than enduring.",
        ex: "Economists warned that the apparent recovery might be transient.",
        tip: "Often used for conditions, trends, or populations."
      },

      {
        w: "FLEETING",
        pos: "adj",
        cluster: "Temporary",
        def: "Passing swiftly and lasting only briefly.",
        ex: "She experienced a fleeting sense of triumph before doubt returned.",
        tip: "Often used for emotions, expressions, glimpses, or moments."
      },

      {
        w: "EVANESCENT",
        pos: "adj",
        cluster: "Temporary",
        def: "Quickly fading, vanishing, or dissolving from sight or memory.",
        ex: "The novelist captured the evanescent beauty of childhood memories.",
        tip: "More literary and elegant than ephemeral; emphasizes fading away."
      },

      {
        w: "MOMENTARY",
        pos: "adj",
        cluster: "Temporary",
        def: "Lasting for only a brief moment.",
        ex: "A momentary distraction caused the pilot to miss the signal.",
        tip: "Very short interruption or duration."
      },

      {
        w: "PERPETUAL",
        pos: "adj",
        cluster: "Stable",
        def: "Continuing indefinitely or occurring repeatedly without interruption.",
        ex: "The region seemed trapped in perpetual political conflict.",
        tip: "GRE often uses this for endless cycles or constant states."
      },

      // ================= STABLE =================

      {
        w: "STATIC",
        pos: "adj",
        cluster: "Stable",
        def: "Lacking movement, growth, or meaningful change.",
        ex: "Without innovation, the once dominant industry became static.",
        tip: "GRE often contrasts static systems with dynamic ones."
      },

      {
        w: "IMMUTABLE",
        pos: "adj",
        cluster: "Stable",
        def: "Incapable of change or alteration.",
        ex: "The philosopher regarded mathematical truths as immutable.",
        tip: "Stronger than stable — literally unchangeable."
      },

      {
        w: "INVARIABLE",
        pos: "adj",
        cluster: "Stable",
        def: "Never changing; always consistent or the same.",
        ex: "Her invariable discipline impressed even her harshest critics.",
        tip: "Predictably constant every single time."
      },

      {
        w: "ENDURING",
        pos: "adj",
        cluster: "Stable",
        def: "Continuing over a long period of time; lasting.",
        ex: "The scientist's enduring influence shaped generations of researchers.",
        tip: "Suggests persistence through time."
      },

      {
        w: "CONSTANT",
        pos: "adj",
        cluster: "Stable",
        def: "Occurring continuously or remaining unchanged.",
        ex: "The refugees lived under constant threat of displacement.",
        tip: "Common GRE clue for uninterrupted persistence."
      },

      // ================= DECLINE =================

      {
        w: "WANE",
        pos: "v",
        cluster: "Decline",
        def: "To decrease gradually in strength, intensity, or popularity.",
        ex: "Interest in the once celebrated theory began to wane.",
        tip: "Wax = grow stronger · Wane = grow weaker."
      },

      {
        w: "ATROPHY",
        pos: "v/n",
        cluster: "Decline",
        def: "To weaken or waste away through neglect, disuse, or lack of stimulation.",
        ex: "Without regular debate, the student's analytical abilities atrophied.",
        tip: "Can describe muscles, institutions, skills, or creativity."
      },

      {
        w: "DETERIORATE",
        pos: "v",
        cluster: "Decline",
        def: "To become progressively worse in quality or condition.",
        ex: "Diplomatic relations deteriorated after the failed negotiations.",
        tip: "Broadest word for gradual worsening."
      },

      {
        w: "DECAY",
        pos: "v/n",
        cluster: "Decline",
        def: "To decline into ruin or decomposition over time.",
        ex: "The abandoned district slowly decayed after factories closed.",
        tip: "Suggests physical or moral breakdown over time."
      },

      // ================= MOVEMENT / FLUCTUATION =================

      {
        w: "OSCILLATE",
        pos: "v",
        cluster: "Movement",
        def: "To swing repeatedly between different states, opinions, or positions.",
        ex: "The negotiations oscillated between cautious optimism and hostility.",
        tip: "Back-and-forth fluctuation between extremes."
      },

      {
        w: "FLUCTUATE",
        pos: "v",
        cluster: "Movement",
        def: "To rise and fall irregularly in number, level, or intensity.",
        ex: "Oil prices fluctuated sharply throughout the crisis.",
        tip: "Common for prices, temperatures, moods, or statistics."
      }
    ]
  },
  {
    day: 10,
    theme: "Support, Opposition & Conflict",
    date: "May 13, 2026",

    patterns: [
      "Bolster = strengthen an existing position · Corroborate = support with confirming evidence · Substantiate = establish with proof",

      "Refute = prove false with evidence · Rebut = counter-argue · Gainsay = formally deny or contradict · Impugn = attack motives or integrity",

      "Advocate = publicly support beforehand · Vindicate = later prove correct after criticism or doubt",

      "Alienate = emotionally distance people · Antagonize = actively provoke hostility",

      "GRE passages frequently revolve around intellectual conflict: scholars refute theories, critics impugn motives, evidence corroborates claims, and later discoveries vindicate controversial figures."
    ],

    words: [

      // ================= SUPPORT =================

      {
        w: "ADVOCATE",
        pos: "v/n",
        cluster: "Support",
        def: "To publicly support, recommend, or argue in favor of something.",
        ex: "The economist advocated stricter regulations to prevent future financial crises.",
        tip: "Often appears in RC passages involving reformers, theorists, or activists."
      },

      {
        w: "ENDORSE",
        pos: "v",
        cluster: "Support",
        def: "To publicly approve, support, or recommend.",
        ex: "Several prominent journals endorsed the controversial proposal.",
        tip: "Formal or institutional approval."
      },

      {
        w: "BOLSTER",
        pos: "v",
        cluster: "Support",
        def: "To strengthen, reinforce, or support something already existing.",
        ex: "New archaeological evidence bolstered the historian's interpretation.",
        tip: "Strengthens an existing argument, belief, or structure."
      },

      {
        w: "CORROBORATE",
        pos: "v",
        cluster: "Support",
        def: "To confirm or support a statement, theory, or finding with additional evidence.",
        ex: "Independent studies corroborated the scientist's original findings.",
        tip: "Evidence supporting evidence. Very high-frequency GRE word."
      },

      {
        w: "SUBSTANTIATE",
        pos: "v",
        cluster: "Support",
        def: "To provide sufficient evidence proving something is true or valid.",
        ex: "The researcher struggled to substantiate the sweeping claims in her paper.",
        tip: "More formal and proof-oriented than corroborate."
      },

      {
        w: "BUTTRESS",
        pos: "v",
        cluster: "Support",
        def: "To support, strengthen, or reinforce.",
        ex: "Economic data buttressed the administration's optimistic forecasts.",
        tip: "Elegant GRE synonym for bolster."
      },

      {
        w: "CHAMPION",
        pos: "v/n",
        cluster: "Support",
        def: "To passionately support, defend, or fight for a cause.",
        ex: "The journalist championed greater transparency in government.",
        tip: "Stronger and more passionate than advocate."
      },

      // ================= OPPOSITION =================

      {
        w: "GAINSAY",
        pos: "v",
        cluster: "Opposition",
        def: "To deny, dispute, or contradict.",
        ex: "Few historians could gainsay the importance of the discovery.",
        tip: "Classic formal GRE word for contradiction or denial."
      },

      {
        w: "REFUTE",
        pos: "v",
        cluster: "Opposition",
        def: "To prove a statement, theory, or claim false through evidence or logic.",
        ex: "Subsequent experiments refuted the widely accepted hypothesis.",
        tip: "Requires evidence or reasoning — stronger than merely disagreeing."
      },

      {
        w: "REBUT",
        pos: "v",
        cluster: "Opposition",
        def: "To counter an argument or accusation with contrary reasoning or evidence.",
        ex: "The attorney systematically rebutted each allegation.",
        tip: "Focused on argumentative response rather than definitive proof."
      },

      {
        w: "IMPUGN",
        pos: "v",
        cluster: "Opposition",
        def: "To call into question someone's integrity, motives, or credibility.",
        ex: "Critics impugned the researcher's objectivity after the funding scandal.",
        tip: "Attacks character, honesty, or motives rather than directly disproving facts."
      },

      {
        w: "REPUDIATE",
        pos: "v",
        cluster: "Opposition",
        def: "To reject, renounce, or refuse association with something.",
        ex: "The philosopher later repudiated many of his earlier theories.",
        tip: "Strong public rejection or disavowal."
      },

      {
        w: "DENOUNCE",
        pos: "v",
        cluster: "Opposition",
        def: "To publicly condemn or criticize forcefully.",
        ex: "Activists denounced the policy as ethically indefensible.",
        tip: "Public moral condemnation."
      },

      {
        w: "DETRACT",
        pos: "v",
        cluster: "Opposition",
        def: "To diminish the value, quality, or reputation of something.",
        ex: "Minor methodological flaws detracted from the study's credibility.",
        tip: "Reduces impact or worth rather than directly attacking."
      },

      // ================= RESOLUTION / JUSTIFICATION =================

      {
        w: "VINDICATE",
        pos: "v",
        cluster: "Resolution",
        def: "To prove correct, justified, or innocent after criticism, suspicion, or doubt.",
        ex: "Later discoveries vindicated the once ridiculed scientist.",
        tip: "Time or evidence eventually proves someone right."
      },

      {
        w: "EXONERATE",
        pos: "v",
        cluster: "Resolution",
        def: "To officially clear someone from blame, guilt, or accusation.",
        ex: "DNA evidence exonerated the wrongly convicted prisoner.",
        tip: "Usually legal innocence."
      },

      {
        w: "JUSTIFY",
        pos: "v",
        cluster: "Resolution",
        def: "To show or prove something to be reasonable, right, or warranted.",
        ex: "The dramatic results justified the risky investment.",
        tip: "Explains why an action or belief was acceptable."
      },

      {
        w: "RECONCILE",
        pos: "v",
        cluster: "Resolution",
        def: "To restore harmony between opposing people or ideas; to make compatible.",
        ex: "The theorist attempted to reconcile scientific evidence with religious doctrine.",
        tip: "Can reconcile people, ideas, theories, or contradictions."
      },

      // ================= CONFLICT =================

      {
        w: "ALIENATE",
        pos: "v",
        cluster: "Conflict",
        def: "To cause someone to feel isolated, estranged, or hostile.",
        ex: "The leader's arrogance alienated many former supporters.",
        tip: "Pushes people away emotionally or socially."
      },

      {
        w: "ANTAGONIZE",
        pos: "v",
        cluster: "Conflict",
        def: "To provoke hostility, resentment, or active opposition.",
        ex: "The abrupt reforms antagonized influential political groups.",
        tip: "Creates direct hostility or conflict."
      },

      {
        w: "QUELL",
        pos: "v",
        cluster: "Conflict",
        def: "To suppress, calm, or put an end to disorder or resistance.",
        ex: "The government struggled to quell widespread unrest.",
        tip: "Frequently used for rebellions, fears, protests, or violence."
      },

      {
        w: "MITIGATE",
        pos: "v",
        cluster: "Conflict",
        def: "To make less severe, serious, or painful.",
        ex: "Diplomats sought to mitigate tensions before negotiations collapsed.",
        tip: "Reduces severity without fully eliminating the problem."
      }
    ]
  },
  {
    day: 11,
    theme: "Clarity, Complexity & Knowledge",
    date: "May 14, 2026",
    patterns: [
      "Lucid/pellucid = crystal clear · Abstruse/recondite = difficult to understand",
      "Esoteric = understood by a small specialized group",
      "Pedantic = showing off knowledge in an annoying way",
      "Convoluted prose usually signals obscurity, not intelligence"
    ],
    words: [
      {
        w: "LUCID",
        pos: "adj",
        cluster: "Clear",
        def: "Expressed clearly; easy to understand.",
        ex: "The professor gave a lucid explanation of quantum theory.",
        tip: "One of GRE's favorite positive writing words."
      },
      {
        w: "PELLUCID",
        pos: "adj",
        cluster: "Clear",
        def: "Exceptionally clear in style or meaning.",
        ex: "Her pellucid prose made even difficult philosophy accessible.",
        tip: "Stronger and more elegant than lucid."
      },
      {
        w: "COGENT",
        pos: "adj",
        cluster: "Clear",
        def: "Clear, logical, and convincing.",
        ex: "The lawyer presented a cogent defense.",
        tip: "Not just understandable — persuasive."
      },
      {
        w: "LIMPID",
        pos: "adj",
        cluster: "Clear",
        def: "Completely clear and transparent in style or expression.",
        ex: "The memoir's limpid prose concealed deep emotional complexity.",
        tip: "Elegant literary clarity."
      },

      {
        w: "ABSTRUSE",
        pos: "adj",
        cluster: "Obscure",
        def: "Difficult to understand because highly complex.",
        ex: "The article's abstruse terminology discouraged readers.",
        tip: "Complexity itself causes the difficulty."
      },
      {
        w: "RECONDITE",
        pos: "adj",
        cluster: "Obscure",
        def: "Little known and difficult to understand.",
        ex: "Only specialists appreciated the scholar's recondite arguments.",
        tip: "Rare specialized knowledge."
      },
      {
        w: "ESOTERIC",
        pos: "adj",
        cluster: "Obscure",
        def: "Intended for or understood by only a small specialized group.",
        ex: "The lecture became increasingly esoteric.",
        tip: "Not necessarily hard — just specialized."
      },
      {
        w: "ARCANE",
        pos: "adj",
        cluster: "Obscure",
        def: "Known or understood by very few people.",
        ex: "The tax code's arcane rules confused even accountants.",
        tip: "Secretive or highly specialized knowledge."
      },
      {
        w: "CRYPTIC",
        pos: "adj",
        cluster: "Obscure",
        def: "Mysterious and difficult to interpret.",
        ex: "The critic's cryptic remarks puzzled the audience.",
        tip: "Feels intentionally unclear."
      },

      {
        w: "ERUDITE",
        pos: "adj",
        cluster: "Knowledge",
        def: "Having extensive scholarly knowledge.",
        ex: "The erudite historian quoted texts in six languages.",
        tip: "Deep academic learning."
      },
      {
        w: "PEDANTIC",
        pos: "adj",
        cluster: "Knowledge",
        def: "Overly concerned with displaying minor knowledge or rules.",
        ex: "His pedantic corrections irritated the entire seminar.",
        tip: "Knowledge used obnoxiously."
      },
      {
        w: "DIDACTIC",
        pos: "adj",
        cluster: "Knowledge",
        def: "Intended primarily to teach or instruct.",
        ex: "The novel became so didactic that readers lost interest in the story.",
        tip: "Teaching often at expense of artistry."
      },
      {
        w: "SCHOLARLY",
        pos: "adj",
        cluster: "Knowledge",
        def: "Characteristic of serious academic study.",
        ex: "Her scholarly approach impressed the review committee.",
        tip: "Neutral-positive academic rigor."
      },
      {
        w: "CONVOLUTED",
        pos: "adj",
        cluster: "Complexity",
        def: "Extremely complex and difficult to follow.",
        ex: "The convoluted plot confused even attentive readers.",
        tip: "Twisted complexity."
      }
    ]
  },
  {
    day: 12,
    theme: "Excess, Scarcity & Moderation",
    date: "May 15, 2026",
    patterns: [
      "Profligate = reckless wastefulness · Frugal = careful economy · Parsimonious = stingy unwillingness to spend",
      "Dearth/paucity both mean scarcity — paucity is more formal and abstract",
      "Superfluous = unnecessary excess, not merely abundance",
      "Temperate/moderate clues often oppose extravagant or profligate behavior"
    ],
    words: [
      {
        w: "PROFLIGATE",
        pos: "adj",
        cluster: "Excess",
        def: "Recklessly wasteful or wildly extravagant.",
        ex: "The dictator's profligate spending bankrupted the nation within a decade.",
        tip: "GRE almost always uses it for wasteful spending or moral recklessness."
      },
      {
        w: "EXTRAVAGANT",
        pos: "adj",
        cluster: "Excess",
        def: "Excessively elaborate, expensive, or wasteful.",
        ex: "The startup's extravagant headquarters alarmed investors.",
        tip: "Can describe spending, praise, claims, or design."
      },
      {
        w: "IMMODERATE",
        pos: "adj",
        cluster: "Excess",
        def: "Excessive; lacking reasonable limits or restraint.",
        ex: "His immoderate ambition exhausted even loyal supporters.",
        tip: "Formal GRE word for 'too much.'"
      },
      {
        w: "SUPERFLUOUS",
        pos: "adj",
        cluster: "Excess",
        def: "Unnecessary because more than enough already exists.",
        ex: "Most of the report's charts were superfluous.",
        tip: "Not merely extra — uselessly extra."
      },
      {
        w: "INDISCRIMINATE",
        pos: "adj",
        cluster: "Excess",
        def: "Done without careful judgment or restraint.",
        ex: "Indiscriminate expansion nearly destroyed the company.",
        tip: "Too broad, uncontrolled, careless."
      },

      {
        w: "DEARTH",
        pos: "n",
        cluster: "Scarcity",
        def: "A scarcity or lack of something.",
        ex: "The region suffered a dearth of qualified teachers.",
        tip: "One of ETS's favorite scarcity words."
      },
      {
        w: "PAUCITY",
        pos: "n",
        cluster: "Scarcity",
        def: "The presence of too little of something; scarcity.",
        ex: "A paucity of evidence weakened the prosecution's case.",
        tip: "More abstract and formal than dearth."
      },
      {
        w: "MEAGER",
        pos: "adj",
        cluster: "Scarcity",
        def: "Lacking in quantity or quality; insufficient.",
        ex: "The researchers worked with meager funding for years.",
        tip: "Suggests disappointing insufficiency."
      },
      {
        w: "SPARSE",
        pos: "adj",
        cluster: "Scarcity",
        def: "Thinly distributed or scattered; not dense.",
        ex: "Sparse rainfall devastated crops.",
        tip: "Often physical distribution."
      },
      {
        w: "SCANT",
        pos: "adj",
        cluster: "Scarcity",
        def: "Barely sufficient; minimal.",
        ex: "The biography relied on scant historical records.",
        tip: "Almost not enough."
      },

      {
        w: "FRUGAL",
        pos: "adj",
        cluster: "Moderation",
        def: "Economical and careful in the use of resources.",
        ex: "Her frugal habits allowed her to retire early.",
        tip: "Positive careful spending."
      },
      {
        w: "THRIFTY",
        pos: "adj",
        cluster: "Moderation",
        def: "Using money and resources carefully and efficiently.",
        ex: "The thrifty student repaired old furniture instead of buying new pieces.",
        tip: "Practical economy without negative stinginess."
      },
      {
        w: "PARSIMONIOUS",
        pos: "adj",
        cluster: "Moderation",
        def: "Unwilling to spend money; excessively stingy.",
        ex: "The parsimonious landlord refused even necessary repairs.",
        tip: "Negative unlike frugal."
      },
      {
        w: "PENURIOUS",
        pos: "adj",
        cluster: "Moderation",
        def: "Extremely poor or miserly.",
        ex: "Despite his wealth, the penurious millionaire reused paper towels.",
        tip: "Can mean poor OR absurdly stingy."
      },
      {
        w: "TEMPERATE",
        pos: "adj",
        cluster: "Moderation",
        def: "Moderate and restrained; avoiding excess.",
        ex: "Her temperate response prevented the argument from escalating.",
        tip: "Controlled moderation in emotion or behavior."
      }
    ]
  },
  {
    day: 13,
    theme: "Intellect, Learning & Mental Ability",
    date: "May 16, 2026",
    patterns: [
      "Erudite = deep scholarly learning · Pedantic = annoying display of learning",
      "Perspicacious = insight · Sagacious = wisdom from experience · Astute = practical shrewdness",
      "Ingenious = creatively clever · Ingenuous = naive and innocent",
      "Obtuse = slow to understand, not merely rude"
    ],
    words: [
      {
        w: "ERUDITE",
        pos: "adj",
        cluster: "Learned",
        def: "Having extensive scholarly knowledge.",
        ex: "The erudite professor referenced obscure medieval texts from memory.",
        tip: "High-level academic learning."
      },
      {
        w: "SCHOLARLY",
        pos: "adj",
        cluster: "Learned",
        def: "Characteristic of serious academic study.",
        ex: "The article's scholarly tone appealed to specialists.",
        tip: "Neutral-positive academic rigor."
      },
      {
        w: "PEDANTIC",
        pos: "adj",
        cluster: "Learned",
        def: "Excessively focused on displaying minor knowledge or rules.",
        ex: "His pedantic lectures exhausted students with trivial corrections.",
        tip: "Knowledge used irritatingly."
      },
      {
        w: "DIDACTIC",
        pos: "adj",
        cluster: "Learned",
        def: "Intended primarily to instruct or teach.",
        ex: "The novel became overly didactic and lost emotional depth.",
        tip: "Teaching emphasis over artistry."
      },
      {
        w: "CEREBRAL",
        pos: "adj",
        cluster: "Learned",
        def: "Intellectual rather than emotional.",
        ex: "The film was admired for its cerebral complexity.",
        tip: "Highly intellectual and analytical."
      },

      {
        w: "PERSPICACIOUS",
        pos: "adj",
        cluster: "Insight",
        def: "Quick to perceive hidden truths or relationships.",
        ex: "The perspicacious analyst noticed inconsistencies everyone else ignored.",
        tip: "SEES what others miss."
      },
      {
        w: "SAGACIOUS",
        pos: "adj",
        cluster: "Insight",
        def: "Wise through sound judgment and experience.",
        ex: "The sagacious diplomat avoided a needless conflict.",
        tip: "Wisdom developed over time."
      },
      {
        w: "ASTUTE",
        pos: "adj",
        cluster: "Insight",
        def: "Shrewd and accurate in practical judgment.",
        ex: "Her astute political instincts saved the campaign.",
        tip: "Street-smart intelligence."
      },
      {
        w: "DISCERNING",
        pos: "adj",
        cluster: "Insight",
        def: "Showing refined judgment and perceptiveness.",
        ex: "Discerning readers recognized the satire immediately.",
        tip: "Able to distinguish quality or subtlety."
      },
      {
        w: "ACUMEN",
        pos: "n",
        cluster: "Insight",
        def: "Sharpness and depth of judgment.",
        ex: "His financial acumen impressed investors.",
        tip: "Practical decision-making intelligence."
      },

      {
        w: "INGENIOUS",
        pos: "adj",
        cluster: "Clever",
        def: "Inventive, creative, and resourcefully clever.",
        ex: "The engineer proposed an ingenious solution to the design flaw.",
        tip: "Creative problem-solving."
      },
      {
        w: "ADROIT",
        pos: "adj",
        cluster: "Clever",
        def: "Skillful and clever, especially socially or mentally.",
        ex: "Her adroit handling of the crisis prevented panic.",
        tip: "Smooth skill under pressure."
      },
      {
        w: "SHREWD",
        pos: "adj",
        cluster: "Clever",
        def: "Sharp in practical judgment and worldly matters.",
        ex: "The shrewd negotiator anticipated every objection.",
        tip: "Practical strategic intelligence."
      },
      {
        w: "INGENUOUS",
        pos: "adj",
        cluster: "Naive",
        def: "Innocent, candid, and unsuspecting.",
        ex: "His ingenuous trust made him vulnerable to manipulation.",
        tip: "Opposite of disingenuous."
      },
      {
        w: "OBTUSE",
        pos: "adj",
        cluster: "Naive",
        def: "Slow to understand or insensitive to subtlety.",
        ex: "The critic was too obtuse to recognize the irony.",
        tip: "Mentally dull, not mathematically angled."
      }
    ]
  },
  {
    day: 14,
    theme: "Emotions, Attitudes & Mental States",
    date: "May 17, 2026",
    patterns: [
      "Equanimity = calm balance under pressure — one of the highest-frequency GRE emotional words",
      "Ennui = intellectual boredom and dissatisfaction, not simple tiredness",
      "Consternation = anxious shock and confusion simultaneously",
      "Sanguine = optimistic confidence even during difficulty"
    ],
    words: [
      {
        w: "EQUANIMITY",
        pos: "n",
        cluster: "Calm",
        def: "Mental calmness and composure, especially under stress.",
        ex: "She handled the hostile interview with remarkable equanimity.",
        tip: "One of ETS's absolute favorites."
      },
      {
        w: "COMPOSURE",
        pos: "n",
        cluster: "Calm",
        def: "Calm self-control and steadiness.",
        ex: "The pilot maintained composure during the emergency landing.",
        tip: "External calm under pressure."
      },
      {
        w: "PLACID",
        pos: "adj",
        cluster: "Calm",
        def: "Calm, peaceful, and undisturbed.",
        ex: "His placid demeanor concealed intense ambition.",
        tip: "Surface serenity."
      },
      {
        w: "PHLEGMATIC",
        pos: "adj",
        cluster: "Calm",
        def: "Calm and unemotional even in stressful situations.",
        ex: "The phlegmatic judge remained unmoved by emotional appeals.",
        tip: "Emotionally unreactive."
      },

      {
        w: "SANGUINE",
        pos: "adj",
        cluster: "Positive",
        def: "Optimistic and confident, especially during difficulty.",
        ex: "Despite setbacks, investors remained sanguine about the company's future.",
        tip: "Confident optimism."
      },
      {
        w: "EBULLIENT",
        pos: "adj",
        cluster: "Positive",
        def: "Overflowing with enthusiasm and energy.",
        ex: "Her ebullient personality energized the entire office.",
        tip: "Bubbling excitement."
      },
      {
        w: "JOVIAL",
        pos: "adj",
        cluster: "Positive",
        def: "Cheerful, hearty, and good-humored.",
        ex: "The jovial host kept the guests laughing all evening.",
        tip: "Warm social cheerfulness."
      },
      {
        w: "ELATED",
        pos: "adj",
        cluster: "Positive",
        def: "Extremely happy and excited.",
        ex: "The scientist was elated by the unexpected discovery.",
        tip: "Peak happiness."
      },

      {
        w: "ENNUI",
        pos: "n",
        cluster: "Negative",
        def: "Profound boredom and dissatisfaction from lack of stimulation.",
        ex: "After years of luxury, he succumbed to ennui.",
        tip: "Existential boredom."
      },
      {
        w: "MELANCHOLY",
        pos: "n/adj",
        cluster: "Negative",
        def: "A reflective, lingering sadness.",
        ex: "A melancholy tone pervaded the final chapter.",
        tip: "Quiet sadness, often thoughtful."
      },
      {
        w: "CONSTERNATION",
        pos: "n",
        cluster: "Negative",
        def: "Anxiety mixed with shock and confusion.",
        ex: "The sudden resignation caused consternation among employees.",
        tip: "Alarm + bewilderment together."
      },
      {
        w: "DESPONDENT",
        pos: "adj",
        cluster: "Negative",
        def: "Deeply discouraged and without hope.",
        ex: "After repeated failures, the candidate grew despondent.",
        tip: "Low-energy hopelessness."
      },
      {
        w: "MIFFED",
        pos: "adj",
        cluster: "Negative",
        def: "Slightly offended or annoyed.",
        ex: "She seemed miffed that her contribution went unrecognized.",
        tip: "Minor irritation, often appearing in SE."
      },
      {
        w: "APATHETIC",
        pos: "adj",
        cluster: "Negative",
        def: "Lacking interest, enthusiasm, or concern.",
        ex: "Voters became apathetic after years of corruption scandals.",
        tip: "Emotional indifference."
      }
    ]
  },
  {
    day: 15,
    theme: "Argument, Evidence & Logic",
    date: "May 18, 2026",
    patterns: [
      "Cogent arguments are logical AND persuasive — not merely clear",
      "Specious arguments sound convincing but collapse under scrutiny",
      "Tendentious writing pushes an agenda while pretending neutrality",
      "Irrefutable = impossible to disprove · Fallacious = logically flawed"
    ],
    words: [
      {
        w: "COGENT",
        pos: "adj",
        cluster: "Strong Logic",
        def: "Clear, logical, and convincing.",
        ex: "The attorney delivered a cogent argument supported by extensive evidence.",
        tip: "One of the highest-frequency GRE praise words for arguments."
      },
      {
        w: "COMPELLING",
        pos: "adj",
        cluster: "Strong Logic",
        def: "Powerfully convincing or persuasive.",
        ex: "The documentary offered compelling evidence of corruption.",
        tip: "Strong emotional or logical force."
      },
      {
        w: "PLAUSIBLE",
        pos: "adj",
        cluster: "Strong Logic",
        def: "Seemingly reasonable or probable.",
        ex: "Her explanation sounded plausible at first.",
        tip: "Could be true — not necessarily actually true."
      },
      {
        w: "TENABLE",
        pos: "adj",
        cluster: "Strong Logic",
        def: "Able to be defended logically against criticism.",
        ex: "The theory remained tenable despite recent challenges.",
        tip: "Still defensible under pressure."
      },
      {
        w: "IRREFUTABLE",
        pos: "adj",
        cluster: "Strong Logic",
        def: "Impossible to disprove or deny.",
        ex: "The DNA evidence was irrefutable.",
        tip: "Absolute evidentiary strength."
      },

      {
        w: "SPECIOUS",
        pos: "adj",
        cluster: "Weak Logic",
        def: "Appearing convincing or correct but actually false.",
        ex: "The article relied on specious reasoning and selective statistics.",
        tip: "Surface plausibility hiding deeper flaws."
      },
      {
        w: "FALLACIOUS",
        pos: "adj",
        cluster: "Weak Logic",
        def: "Based on mistaken belief or unsound reasoning.",
        ex: "The economist exposed the fallacious assumptions behind the proposal.",
        tip: "Logically invalid."
      },
      {
        w: "TENDENTIOUS",
        pos: "adj",
        cluster: "Weak Logic",
        def: "Expressing a particular bias or agenda.",
        ex: "The tendentious documentary ignored evidence that complicated its narrative.",
        tip: "Pretends neutrality while pushing a side."
      },
      {
        w: "DUBIOUS",
        pos: "adj",
        cluster: "Weak Logic",
        def: "Questionable or doubtful in credibility.",
        ex: "The witness provided a dubious explanation for the missing funds.",
        tip: "Raises suspicion."
      },
      {
        w: "UNTENABLE",
        pos: "adj",
        cluster: "Weak Logic",
        def: "Impossible to defend logically.",
        ex: "After the new evidence emerged, the position became untenable.",
        tip: "Cannot survive criticism."
      },

      {
        w: "SUBSTANTIATE",
        pos: "v",
        cluster: "Evidence",
        def: "To support with evidence or proof.",
        ex: "Researchers struggled to substantiate the extraordinary claim.",
        tip: "Formal proof through evidence."
      },
      {
        w: "CORROBORATE",
        pos: "v",
        cluster: "Evidence",
        def: "To confirm through additional evidence.",
        ex: "Independent witnesses corroborated the journalist's account.",
        tip: "Evidence strengthening evidence."
      },
      {
        w: "VERIFY",
        pos: "v",
        cluster: "Evidence",
        def: "To confirm the truth or accuracy of something.",
        ex: "The editor verified every quotation before publication.",
        tip: "Fact-checking accuracy."
      },
      {
        w: "DISPUTE",
        pos: "v/n",
        cluster: "Evidence",
        def: "To question the truth or validity of.",
        ex: "Several historians dispute the traditional interpretation.",
        tip: "Formal intellectual disagreement."
      },
      {
        w: "REPUDIATE",
        pos: "v",
        cluster: "Evidence",
        def: "To reject something emphatically as false or unacceptable.",
        ex: "The scientist repudiated the fabricated data immediately.",
        tip: "Strong public rejection."
      }
    ]
  },
  {
    day: 16,
    theme: "Wealth, Poverty & Resource Use",
    date: "May 19, 2026",
    patterns: [
      "Penury = extreme poverty · Frugal = careful economy · Parsimonious = stingy refusal to spend",
      "Munificent generosity is financial and lavish",
      "Austere can describe both strict simplicity and severe conditions",
      "Prodigal = wastefully extravagant, often with money"
    ],
    words: [
      {
        w: "PENURY",
        pos: "n",
        cluster: "Poverty",
        def: "Extreme poverty; severe lack of money.",
        ex: "The writer lived in penury for years before achieving fame.",
        tip: "A favorite ETS poverty word."
      },
      {
        w: "IMPECUNIOUS",
        pos: "adj",
        cluster: "Poverty",
        def: "Having little or no money.",
        ex: "The impecunious student survived on instant noodles and scholarships.",
        tip: "Formal adjective for poor."
      },
      {
        w: "INDIGENT",
        pos: "adj",
        cluster: "Poverty",
        def: "Poor and needy.",
        ex: "The clinic provided free care to indigent patients.",
        tip: "Common in legal/social policy passages."
      },
      {
        w: "DESTITUTE",
        pos: "adj",
        cluster: "Poverty",
        def: "Completely lacking resources or necessities.",
        ex: "After the drought, many families were destitute.",
        tip: "Most extreme poverty."
      },
      {
        w: "STRAITENED",
        pos: "adj",
        cluster: "Poverty",
        def: "Experiencing financial difficulty.",
        ex: "The university faced straitened economic circumstances.",
        tip: "Formal RC-style financial hardship."
      },

      {
        w: "FRUGAL",
        pos: "adj",
        cluster: "Economy",
        def: "Economical and careful in spending.",
        ex: "Her frugal habits allowed her to save aggressively.",
        tip: "Positive carefulness with money."
      },
      {
        w: "THRIFTY",
        pos: "adj",
        cluster: "Economy",
        def: "Careful and efficient in managing resources.",
        ex: "The thrifty chef wasted almost nothing.",
        tip: "Practical efficiency."
      },
      {
        w: "PARSIMONIOUS",
        pos: "adj",
        cluster: "Economy",
        def: "Excessively unwilling to spend money; stingy.",
        ex: "The parsimonious executive denied even modest raises.",
        tip: "Negative unlike frugal."
      },
      {
        w: "AUSTERE",
        pos: "adj",
        cluster: "Economy",
        def: "Severely simple and without luxury.",
        ex: "The monastery maintained an austere lifestyle.",
        tip: "Can describe style, policy, or conditions."
      },
      {
        w: "ABSTEMIOUS",
        pos: "adj",
        cluster: "Economy",
        def: "Marked by restraint and moderation in indulgence.",
        ex: "His abstemious habits contrasted with his colleagues' excesses.",
        tip: "Extreme self-control."
      },

      {
        w: "MUNIFICENT",
        pos: "adj",
        cluster: "Wealth",
        def: "Exceptionally generous in giving.",
        ex: "The munificent donor funded the research institute outright.",
        tip: "Financial generosity specifically."
      },
      {
        w: "PRODIGAL",
        pos: "adj",
        cluster: "Wealth",
        def: "Wastefully extravagant with resources.",
        ex: "The prodigal heir spent millions within months.",
        tip: "Reckless spending."
      },
      {
        w: "LAVISH",
        pos: "adj/v",
        cluster: "Wealth",
        def: "Extremely generous, elaborate, or luxurious.",
        ex: "The studio lavished enormous resources on the film.",
        tip: "Can describe praise, spending, or luxury."
      },
      {
        w: "OPULENT",
        pos: "adj",
        cluster: "Wealth",
        def: "Rich, luxurious, and lavishly expensive.",
        ex: "The palace's opulent interiors stunned visitors.",
        tip: "Visible luxurious wealth."
      },
      {
        w: "LUCRATIVE",
        pos: "adj",
        cluster: "Wealth",
        def: "Producing substantial profit or wealth.",
        ex: "Consulting became an unexpectedly lucrative career path.",
        tip: "Profitable, money-generating."
      }
    ]
  },
  {
    day: 17,
    theme: "Art, Taste & Originality",
    date: "May 20, 2026",
    patterns: [
      "Banal/hackneyed/trite all signal overused ideas — originality is absent",
      "Aesthetic relates to beauty or artistic appreciation",
      "Kitsch = gaudy sentimental bad taste pretending sophistication",
      "Avant-garde works are experimental and innovative"
    ],
    words: [
      {
        w: "AESTHETIC",
        pos: "adj/n",
        cluster: "Art",
        def: "Concerned with beauty or artistic taste.",
        ex: "The architect balanced practicality with aesthetic elegance.",
        tip: "Core GRE art-and-culture word."
      },
      {
        w: "EVOCATIVE",
        pos: "adj",
        cluster: "Art",
        def: "Bringing strong images, memories, or emotions to mind.",
        ex: "The novel's evocative imagery lingered with readers for years.",
        tip: "Art that emotionally summons something."
      },
      {
        w: "LYRICAL",
        pos: "adj",
        cluster: "Art",
        def: "Expressive, poetic, and musical in quality.",
        ex: "Critics praised the film's lyrical cinematography.",
        tip: "Elegant artistic fluidity."
      },
      {
        w: "SUBLIME",
        pos: "adj",
        cluster: "Art",
        def: "Inspiring awe through grandeur or beauty.",
        ex: "The symphony's sublime finale left the audience speechless.",
        tip: "Beauty elevated almost beyond comprehension."
      },
      {
        w: "PROSAIC",
        pos: "adj",
        cluster: "Art",
        def: "Dull, ordinary, or lacking imagination.",
        ex: "The remake replaced the original's magic with prosaic realism.",
        tip: "Opposite of imaginative artistry."
      },

      {
        w: "BANAL",
        pos: "adj",
        cluster: "Unoriginal",
        def: "So unoriginal and overused as to be boring.",
        ex: "The critic dismissed the novel's banal dialogue.",
        tip: "Extremely common GRE criticism word."
      },
      {
        w: "HACKNEYED",
        pos: "adj",
        cluster: "Unoriginal",
        def: "Overused to the point of losing originality.",
        ex: "The speech relied on hackneyed patriotic clichés.",
        tip: "Tired from overuse."
      },
      {
        w: "TRITE",
        pos: "adj",
        cluster: "Unoriginal",
        def: "Lacking freshness or originality because overused.",
        ex: "His motivational slogans sounded trite.",
        tip: "Shorter and more conversational than hackneyed."
      },
      {
        w: "DERIVATIVE",
        pos: "adj",
        cluster: "Unoriginal",
        def: "Imitating another work without originality.",
        ex: "The film felt derivative of earlier science-fiction classics.",
        tip: "Copied inspiration without innovation."
      },
      {
        w: "CLICHED",
        pos: "adj",
        cluster: "Unoriginal",
        def: "Containing overused expressions or ideas.",
        ex: "The romance novel's ending was painfully cliched.",
        tip: "Very common in RC literary criticism."
      },

      {
        w: "AVANT-GARDE",
        pos: "adj",
        cluster: "Innovative",
        def: "Experimental, radical, and ahead of its time.",
        ex: "The avant-garde composer alienated conservative audiences.",
        tip: "Innovation that initially shocks people."
      },
      {
        w: "ICONOCLASTIC",
        pos: "adj",
        cluster: "Innovative",
        def: "Attacking or challenging established traditions or beliefs.",
        ex: "The director's iconoclastic style transformed modern theater.",
        tip: "Breaks conventions deliberately."
      },
      {
        w: "ECLECTIC",
        pos: "adj",
        cluster: "Innovative",
        def: "Drawing ideas or styles from many diverse sources.",
        ex: "Her eclectic musical influences shaped a unique sound.",
        tip: "Mixing many styles together."
      },
      {
        w: "KITSCH",
        pos: "n/adj",
        cluster: "Taste",
        def: "Art or style considered gaudy, sentimental, or in poor taste.",
        ex: "Critics dismissed the decor as pure kitsch.",
        tip: "Fake sophistication and cheap sentimentality."
      },
      {
        w: "ORNATE",
        pos: "adj",
        cluster: "Taste",
        def: "Highly decorated and excessively elaborate.",
        ex: "The ornate writing style distracted from the argument itself.",
        tip: "Can be praise or criticism depending on context."
      }
    ]
  },
  {
    day: 18,
    theme: "RC Abstract Language & Academic Tone",
    date: "May 21, 2026",
    patterns: [
      "Orthodox = conventional accepted view · Heterodox = challenging accepted doctrine",
      "Qualified claims are partially limited — not fully rejected",
      "Ambivalent = mixed feelings · Equivocal = unclear/ambiguous language",
      "Paradigmatic examples REPRESENT an entire model or pattern"
    ],
    words: [
      {
        w: "ORTHODOX",
        pos: "adj",
        cluster: "Academic Positions",
        def: "Conforming to established or traditional beliefs or methods.",
        ex: "The economist challenged the orthodox view of free markets.",
        tip: "Standard accepted position in RC passages."
      },
      {
        w: "HETERODOX",
        pos: "adj",
        cluster: "Academic Positions",
        def: "Departing from accepted or traditional beliefs.",
        ex: "Her heterodox theories initially faced intense criticism.",
        tip: "Counter-mainstream academic thinking."
      },
      {
        w: "CONVENTIONAL",
        pos: "adj",
        cluster: "Academic Positions",
        def: "Based on accepted standards or typical practice.",
        ex: "Conventional interpretations ignored minority perspectives.",
        tip: "Neutral mainstream acceptance."
      },
      {
        w: "ICONOCLASTIC",
        pos: "adj",
        cluster: "Academic Positions",
        def: "Attacking established beliefs, traditions, or institutions.",
        ex: "The scholar's iconoclastic argument transformed the field.",
        tip: "Aggressively anti-tradition."
      },
      {
        w: "REVISIONIST",
        pos: "adj",
        cluster: "Academic Positions",
        def: "Reinterpreting traditional historical or intellectual views.",
        ex: "Revisionist historians challenged earlier assumptions about the war.",
        tip: "Frequently appears in history RC passages."
      },

      {
        w: "PARADIGMATIC",
        pos: "adj",
        cluster: "Abstraction",
        def: "Serving as a typical example or model of something.",
        ex: "The case became paradigmatic of institutional corruption.",
        tip: "Representative example of an entire pattern."
      },
      {
        w: "ANOMALOUS",
        pos: "adj",
        cluster: "Abstraction",
        def: "Deviating from what is normal or expected.",
        ex: "Researchers struggled to explain the anomalous results.",
        tip: "Exception that disrupts the pattern."
      },
      {
        w: "QUALIFIED",
        pos: "adj",
        cluster: "Abstraction",
        def: "Limited, modified, or restrained in extent.",
        ex: "The scientist offered only qualified support for the proposal.",
        tip: "Not absolute approval or rejection."
      },
      {
        w: "NUANCED",
        pos: "adj",
        cluster: "Abstraction",
        def: "Characterized by subtle distinctions and complexity.",
        ex: "The biography offered a nuanced portrait of the leader.",
        tip: "Sophisticated complexity — extremely common in RC."
      },
      {
        w: "EQUIVOCAL",
        pos: "adj",
        cluster: "Abstraction",
        def: "Ambiguous or open to multiple interpretations.",
        ex: "The senator's equivocal statement satisfied no one.",
        tip: "Unclear commitment."
      },

      {
        w: "AMBIVALENT",
        pos: "adj",
        cluster: "Attitude",
        def: "Having mixed or contradictory feelings.",
        ex: "Critics remained ambivalent about the novel's ending.",
        tip: "Simultaneous opposing emotions."
      },
      {
        w: "TENTATIVE",
        pos: "adj",
        cluster: "Attitude",
        def: "Uncertain or not fully developed.",
        ex: "Researchers proposed a tentative explanation for the anomaly.",
        tip: "Careful non-final judgment."
      },
      {
        w: "DOGMATIC",
        pos: "adj",
        cluster: "Attitude",
        def: "Asserting opinions in an arrogantly unquestionable manner.",
        ex: "The philosopher's dogmatic tone alienated readers.",
        tip: "Absolute certainty without openness."
      },
      {
        w: "PRAGMATIC",
        pos: "adj",
        cluster: "Attitude",
        def: "Focused on practical outcomes rather than ideology.",
        ex: "The mayor adopted a pragmatic approach to reform.",
        tip: "Practical realism over theory."
      },
      {
        w: "DISPASSIONATE",
        pos: "adj",
        cluster: "Attitude",
        def: "Free from emotional bias or prejudice.",
        ex: "The report offered a dispassionate assessment of the crisis.",
        tip: "Objective neutrality — positive in RC."
      }
    ]
  },
  {
    day: 19,
    theme: "Scientific, Analytical & Research Language",
    date: "May 22, 2026",
    patterns: [
      "Empirical = based on observation/evidence · Theoretical = based on abstract reasoning",
      "Deterministic systems have predictable causes · Stochastic systems involve randomness",
      "Reductionist explanations simplify complex systems into parts",
      "Inferential reasoning draws conclusions indirectly from evidence"
    ],
    words: [
      {
        w: "EMPIRICAL",
        pos: "adj",
        cluster: "Research",
        def: "Based on observation, experiment, or evidence rather than theory alone.",
        ex: "The hypothesis lacked empirical support.",
        tip: "Data-driven evidence."
      },
      {
        w: "THEORETICAL",
        pos: "adj",
        cluster: "Research",
        def: "Concerned with abstract principles rather than practical application.",
        ex: "Theoretical physics often advances before experimentation catches up.",
        tip: "Conceptual rather than directly observable."
      },
      {
        w: "INFERENTIAL",
        pos: "adj",
        cluster: "Research",
        def: "Based on conclusions drawn from evidence and reasoning.",
        ex: "The argument relied on inferential rather than direct proof.",
        tip: "Indirect reasoning from clues."
      },
      {
        w: "ANALYTICAL",
        pos: "adj",
        cluster: "Research",
        def: "Using logical examination and evaluation of details.",
        ex: "Her analytical approach uncovered inconsistencies in the dataset.",
        tip: "Breaking systems into parts for understanding."
      },
      {
        w: "SYSTEMATIC",
        pos: "adj",
        cluster: "Research",
        def: "Methodical and organized according to a system.",
        ex: "The researchers conducted a systematic review of prior studies.",
        tip: "Structured careful methodology."
      },

      {
        w: "DETERMINISTIC",
        pos: "adj",
        cluster: "Systems",
        def: "Governed by fixed predictable causes.",
        ex: "The theory assumed human behavior was deterministic.",
        tip: "Every outcome caused predictably."
      },
      {
        w: "STOCHASTIC",
        pos: "adj",
        cluster: "Systems",
        def: "Randomly determined or probabilistic.",
        ex: "Weather systems are partly stochastic in nature.",
        tip: "Contains randomness and uncertainty."
      },
      {
        w: "DISCRETE",
        pos: "adj",
        cluster: "Systems",
        def: "Separate and individually distinct.",
        ex: "The study analyzed discrete categories of behavior.",
        tip: "Separate units — not continuous."
      },
      {
        w: "DYNAMIC",
        pos: "adj",
        cluster: "Systems",
        def: "Characterized by constant change or activity.",
        ex: "Language evolves through dynamic cultural processes.",
        tip: "Opposite of static."
      },
      {
        w: "STATIC",
        pos: "adj",
        cluster: "Systems",
        def: "Lacking movement, growth, or development.",
        ex: "The outdated model treated society as static.",
        tip: "No meaningful change."
      },

      {
        w: "REDUCTIONIST",
        pos: "adj",
        cluster: "Analysis",
        def: "Explaining complex phenomena through simpler constituent parts.",
        ex: "Critics argued the theory was overly reductionist.",
        tip: "Oversimplifies complexity into components."
      },
      {
        w: "HOLISTIC",
        pos: "adj",
        cluster: "Analysis",
        def: "Considering systems as integrated wholes rather than isolated parts.",
        ex: "The physician adopted a holistic approach to treatment.",
        tip: "Whole-system thinking."
      },
      {
        w: "SYNTHETIC",
        pos: "adj",
        cluster: "Analysis",
        def: "Combining separate elements into a unified whole.",
        ex: "The essay offered a synthetic overview of competing theories.",
        tip: "Integrates many pieces together."
      },
      {
        w: "DERIVE",
        pos: "v",
        cluster: "Analysis",
        def: "To obtain or develop from a source.",
        ex: "The conclusion was derived from decades of observation.",
        tip: "Drawn from prior evidence."
      },
      {
        w: "POSTULATE",
        pos: "v",
        cluster: "Analysis",
        def: "To suggest or assume as a basis for reasoning.",
        ex: "The philosopher postulated the existence of universal truths.",
        tip: "Propose theoretically without full proof yet."
      }
    ]
  },
  {
    day: 20,
    theme: "Process, Change & Causation Verbs",
    date: "May 23, 2026",
    patterns: [
      "Exacerbate intensifies problems · Mitigate reduces severity",
      "Catalyze/precipitate both trigger events — catalyze often accelerates positive or neutral change",
      "Impede obstructs progress · Facilitate enables progress",
      "Abate means gradual reduction, especially intensity"
    ],
    words: [
      {
        w: "EXACERBATE",
        pos: "v",
        cluster: "Intensify",
        def: "To make a problem or negative situation worse.",
        ex: "The policy exacerbated existing social inequalities.",
        tip: "Almost always worsens something negative."
      },
      {
        w: "AGGRAVATE",
        pos: "v",
        cluster: "Intensify",
        def: "To intensify or worsen.",
        ex: "Poor communication aggravated tensions within the team.",
        tip: "Formal GRE meaning = worsen."
      },
      {
        w: "COMPOUND",
        pos: "v",
        cluster: "Intensify",
        def: "To increase or worsen by adding further difficulty.",
        ex: "Economic decline compounded political instability.",
        tip: "One problem piling onto another."
      },
      {
        w: "AMPLIFY",
        pos: "v",
        cluster: "Intensify",
        def: "To increase strength, intensity, or importance.",
        ex: "Social media amplified public outrage.",
        tip: "Makes something louder/stronger."
      },
      {
        w: "ESCALATE",
        pos: "v",
        cluster: "Intensify",
        def: "To increase rapidly in seriousness or intensity.",
        ex: "The disagreement escalated into open conflict.",
        tip: "Upward progression in intensity."
      },

      {
        w: "MITIGATE",
        pos: "v",
        cluster: "Reduce",
        def: "To make less severe or painful.",
        ex: "New regulations mitigated environmental damage.",
        tip: "Reduce harm, not eliminate it."
      },
      {
        w: "ALLEVIATE",
        pos: "v",
        cluster: "Reduce",
        def: "To relieve or lessen suffering or difficulty.",
        ex: "The aid program alleviated food shortages.",
        tip: "Relief from hardship."
      },
      {
        w: "ABATE",
        pos: "v",
        cluster: "Reduce",
        def: "To decrease gradually in intensity.",
        ex: "The storm finally began to abate.",
        tip: "Natural fading reduction."
      },
      {
        w: "TEMPER",
        pos: "v",
        cluster: "Reduce",
        def: "To moderate or soften.",
        ex: "Experience tempered his youthful idealism.",
        tip: "Controlled moderation."
      },
      {
        w: "CURB",
        pos: "v",
        cluster: "Reduce",
        def: "To restrain or keep under control.",
        ex: "The law aimed to curb corruption.",
        tip: "External restraint."
      },

      {
        w: "CATALYZE",
        pos: "v",
        cluster: "Cause",
        def: "To trigger or accelerate significant change.",
        ex: "The invention catalyzed rapid industrial growth.",
        tip: "Starts or speeds transformation."
      },
      {
        w: "PRECIPITATE",
        pos: "v",
        cluster: "Cause",
        def: "To cause something to happen suddenly.",
        ex: "The scandal precipitated the minister's resignation.",
        tip: "Triggers abrupt consequence."
      },
      {
        w: "ENGENDER",
        pos: "v",
        cluster: "Cause",
        def: "To produce or give rise to.",
        ex: "The policy engendered widespread distrust.",
        tip: "Creates abstract conditions or emotions."
      },
      {
        w: "FOSTER",
        pos: "v",
        cluster: "Cause",
        def: "To encourage or promote development.",
        ex: "The program fostered scientific collaboration.",
        tip: "Positive nurturing growth."
      },
      {
        w: "SPAWN",
        pos: "v",
        cluster: "Cause",
        def: "To generate or produce in large numbers.",
        ex: "The controversy spawned countless conspiracy theories.",
        tip: "Produces many consequences rapidly."
      }
    ]
  },
  {
    day: 21,
    theme: "Tone, Attitude & Authorial Stance",
    date: "May 24, 2026",
    patterns: [
      "Sardonic/caustic = harsh mocking criticism · Wry = subtle dry humor",
      "Deferential = respectful downward posture toward authority",
      "Conciliatory language reduces conflict rather than escalating it",
      "Incredulous = unwilling to believe; skeptical due to surprise"
    ],
    words: [
      {
        w: "SARDONIC",
        pos: "adj",
        cluster: "Critical Tone",
        def: "Mocking, cynical, and scornfully humorous.",
        ex: "The critic's sardonic review delighted readers but devastated the playwright.",
        tip: "Cold intelligent mockery."
      },
      {
        w: "CAUSTIC",
        pos: "adj",
        cluster: "Critical Tone",
        def: "Sharply biting and sarcastic in tone.",
        ex: "Her caustic remarks silenced the entire panel.",
        tip: "Verbally corrosive."
      },
      {
        w: "ACERBIC",
        pos: "adj",
        cluster: "Critical Tone",
        def: "Sharp, bitter, and forthright in speech or writing.",
        ex: "The essay's acerbic tone alienated moderate readers.",
        tip: "Bitter intellectual criticism."
      },
      {
        w: "SCATHING",
        pos: "adj",
        cluster: "Critical Tone",
        def: "Severely harsh and condemning.",
        ex: "The report delivered a scathing indictment of the administration.",
        tip: "Full-force verbal attack."
      },
      {
        w: "WRY",
        pos: "adj",
        cluster: "Critical Tone",
        def: "Dryly humorous in a subtle and often ironic way.",
        ex: "He offered a wry observation about the committee's endless delays.",
        tip: "Quiet intelligent irony."
      },

      {
        w: "DEFERENTIAL",
        pos: "adj",
        cluster: "Respectful Tone",
        def: "Showing respectful submission to another's authority or judgment.",
        ex: "The junior scholars remained deferential during the debate.",
        tip: "Respect directed upward."
      },
      {
        w: "REVERENT",
        pos: "adj",
        cluster: "Respectful Tone",
        def: "Feeling or showing deep respect bordering on awe.",
        ex: "The documentary adopted a reverent tone toward the scientist.",
        tip: "Near-sacred admiration."
      },
      {
        w: "SOLEMN",
        pos: "adj",
        cluster: "Respectful Tone",
        def: "Serious and dignified in manner.",
        ex: "The ceremony proceeded in a solemn atmosphere.",
        tip: "Grave seriousness."
      },
      {
        w: "EARNEST",
        pos: "adj",
        cluster: "Respectful Tone",
        def: "Serious and sincere in intention or effort.",
        ex: "Her earnest appeal persuaded even skeptical listeners.",
        tip: "Genuine sincerity."
      },
      {
        w: "CORDIAL",
        pos: "adj",
        cluster: "Respectful Tone",
        def: "Warm and politely friendly.",
        ex: "Despite political differences, the discussion remained cordial.",
        tip: "Polite surface warmth."
      },

      {
        w: "CONCILIATORY",
        pos: "adj",
        cluster: "Diplomatic Tone",
        def: "Intended to reduce hostility and restore goodwill.",
        ex: "The ambassador adopted a conciliatory tone during negotiations.",
        tip: "Moves toward peace."
      },
      {
        w: "DIPLOMATIC",
        pos: "adj",
        cluster: "Diplomatic Tone",
        def: "Tactful and sensitive in dealing with others.",
        ex: "Her diplomatic response prevented the dispute from escalating.",
        tip: "Strategic tact."
      },
      {
        w: "TACTFUL",
        pos: "adj",
        cluster: "Diplomatic Tone",
        def: "Careful not to offend or upset others.",
        ex: "The editor offered tactful criticism of the manuscript.",
        tip: "Socially careful honesty."
      },
      {
        w: "PLACATORY",
        pos: "adj",
        cluster: "Diplomatic Tone",
        def: "Intended to calm anger or hostility.",
        ex: "He made a placatory gesture to the dissatisfied workers.",
        tip: "Trying to soothe tension."
      },
      {
        w: "AMENABLE",
        pos: "adj",
        cluster: "Diplomatic Tone",
        def: "Open and responsive to suggestion or influence.",
        ex: "The committee proved amenable to compromise.",
        tip: "Willing to cooperate."
      },

      {
        w: "INCREDULOUS",
        pos: "adj",
        cluster: "Skeptical Tone",
        def: "Unwilling or unable to believe something.",
        ex: "The audience reacted with incredulous silence.",
        tip: "Shock + disbelief."
      },
      {
        w: "SKEPTICAL",
        pos: "adj",
        cluster: "Skeptical Tone",
        def: "Doubting accepted claims or conclusions.",
        ex: "Scientists remained skeptical of the dramatic findings.",
        tip: "Demands stronger proof."
      },
      {
        w: "CYNICAL",
        pos: "adj",
        cluster: "Skeptical Tone",
        def: "Distrustful of human sincerity or motives.",
        ex: "His cynical view of politics alienated younger voters.",
        tip: "Assumes bad motives."
      },
      {
        w: "JADED",
        pos: "adj",
        cluster: "Skeptical Tone",
        def: "Worn out or dulled by overexposure.",
        ex: "Years in the industry left the reporter jaded.",
        tip: "Emotional exhaustion from repetition."
      },
      {
        w: "DISDAINFUL",
        pos: "adj",
        cluster: "Skeptical Tone",
        def: "Showing contempt or scorn.",
        ex: "She gave a disdainful glance at the proposal.",
        tip: "Openly looking down on something."
      }
    ]
  },
  {
    day: 22,
    theme: "Difficulty, Effort & Complexity",
    date: "May 25, 2026",
    patterns: [
      "Arduous/onerous/exacting all imply difficulty — but with different focus",
      "Intractable problems resist solution despite effort",
      "Cumbersome/unwieldy = physically or structurally difficult to manage",
      "Laborious stresses sustained effort over time"
    ],
    words: [
      {
        w: "ARDUOUS",
        pos: "adj",
        cluster: "Difficulty",
        def: "Demanding great effort and endurance.",
        ex: "Completing the expedition required an arduous climb through dangerous terrain.",
        tip: "Physical or mental strain over long effort."
      },
      {
        w: "ONEROUS",
        pos: "adj",
        cluster: "Difficulty",
        def: "Oppressively burdensome or difficult to fulfill.",
        ex: "The contract imposed onerous obligations on small businesses.",
        tip: "Feels like a burden."
      },
      {
        w: "EXACTING",
        pos: "adj",
        cluster: "Difficulty",
        def: "Requiring great care, precision, or effort.",
        ex: "Surgery is an exacting profession demanding constant focus.",
        tip: "High standards and precision."
      },
      {
        w: "LABORIOUS",
        pos: "adj",
        cluster: "Difficulty",
        def: "Requiring considerable time and effort.",
        ex: "The archaeologists undertook the laborious process of cataloging artifacts.",
        tip: "Slow sustained work."
      },
      {
        w: "GRUELING",
        pos: "adj",
        cluster: "Difficulty",
        def: "Extremely tiring and demanding.",
        ex: "The grueling schedule exhausted even experienced athletes.",
        tip: "Physically punishing."
      },

      {
        w: "INTRACTABLE",
        pos: "adj",
        cluster: "Complexity",
        def: "Difficult or impossible to control or solve.",
        ex: "The region faced intractable political divisions.",
        tip: "Resists all attempts at solution."
      },
      {
        w: "INSOLUBLE",
        pos: "adj",
        cluster: "Complexity",
        def: "Impossible to solve or explain.",
        ex: "The paradox appeared insoluble.",
        tip: "No solution exists."
      },
      {
        w: "KNOTTY",
        pos: "adj",
        cluster: "Complexity",
        def: "Complicated and difficult to resolve.",
        ex: "The philosopher tackled a knotty ethical dilemma.",
        tip: "Tangled conceptual difficulty."
      },
      {
        w: "ABSTRUSE",
        pos: "adj",
        cluster: "Complexity",
        def: "Difficult to understand because highly complex or obscure.",
        ex: "The article's abstruse language frustrated general readers.",
        tip: "Dense intellectual complexity."
      },
      {
        w: "RECONDITE",
        pos: "adj",
        cluster: "Complexity",
        def: "Little known and difficult to comprehend.",
        ex: "The lecture explored recondite aspects of medieval philosophy.",
        tip: "Obscure scholarly difficulty."
      },

      {
        w: "CUMBERSOME",
        pos: "adj",
        cluster: "Management",
        def: "Large, complicated, or inefficiently difficult to handle.",
        ex: "The cumbersome bureaucracy slowed every decision.",
        tip: "Bulky inefficiency."
      },
      {
        w: "UNWIELDY",
        pos: "adj",
        cluster: "Management",
        def: "Difficult to move, manage, or control because of size or complexity.",
        ex: "The unwieldy coalition collapsed under internal disagreement.",
        tip: "Hard to control effectively."
      },
      {
        w: "BYZANTINE",
        pos: "adj",
        cluster: "Management",
        def: "Excessively complicated and intricate.",
        ex: "The corporation's Byzantine regulations confused employees.",
        tip: "Maze-like complexity."
      },
      {
        w: "CONVOLUTED",
        pos: "adj",
        cluster: "Management",
        def: "Extremely complex and difficult to follow.",
        ex: "The argument became so convoluted that listeners lost track entirely.",
        tip: "Twisted complexity."
      },
      {
        w: "TEDIOUS",
        pos: "adj",
        cluster: "Management",
        def: "Too long, slow, or repetitive; boring through monotony.",
        ex: "The tedious review process lasted months.",
        tip: "Mental exhaustion through repetition."
      }
    ]
  },
  {
    day: 23,
    theme: "Power, Control & Social Dynamics",
    date: "May 26, 2026",
    patterns: [
      "Authoritarian = demands obedience · Totalitarian = total societal control",
      "Hegemonic power dominates indirectly through influence",
      "Coercive systems rely on force or pressure",
      "Autonomous entities operate independently from outside control"
    ],
    words: [
      {
        w: "AUTHORITARIAN",
        pos: "adj",
        cluster: "Power",
        def: "Favoring strict obedience to authority with limited personal freedom.",
        ex: "The authoritarian regime suppressed dissent aggressively.",
        tip: "Centralized controlling authority."
      },
      {
        w: "TOTALITARIAN",
        pos: "adj",
        cluster: "Power",
        def: "Exercising complete control over all aspects of public and private life.",
        ex: "The novel depicts a chilling totalitarian society.",
        tip: "Most extreme form of political control."
      },
      {
        w: "HEGEMONIC",
        pos: "adj",
        cluster: "Power",
        def: "Dominating others through political, cultural, or economic influence.",
        ex: "The empire maintained hegemonic influence across the region.",
        tip: "Indirect dominance."
      },
      {
        w: "AUTOCRATIC",
        pos: "adj",
        cluster: "Power",
        def: "Ruling with absolute unchecked authority.",
        ex: "The autocratic ruler tolerated no criticism.",
        tip: "Single-person centralized power."
      },
      {
        w: "DESPOTIC",
        pos: "adj",
        cluster: "Power",
        def: "Tyrannical and oppressive in the exercise of power.",
        ex: "Citizens rebelled against the despotic government.",
        tip: "Cruel abusive rule."
      },

      {
        w: "COERCIVE",
        pos: "adj",
        cluster: "Control",
        def: "Using force, threats, or pressure to compel behavior.",
        ex: "The policy relied on coercive enforcement measures.",
        tip: "Compliance through pressure."
      },
      {
        w: "PUNITIVE",
        pos: "adj",
        cluster: "Control",
        def: "Inflicting punishment or intended as punishment.",
        ex: "Critics condemned the punitive tax structure.",
        tip: "Punishment-focused."
      },
      {
        w: "REPRESSIVE",
        pos: "adj",
        cluster: "Control",
        def: "Actively subduing freedom or expression.",
        ex: "The repressive laws silenced political opposition.",
        tip: "Suppresses dissent."
      },
      {
        w: "ARBITRARY",
        pos: "adj",
        cluster: "Control",
        def: "Based on random choice rather than reason or fairness.",
        ex: "Workers protested arbitrary disciplinary actions.",
        tip: "Unpredictable unfair authority."
      },
      {
        w: "UNILATERAL",
        pos: "adj",
        cluster: "Control",
        def: "Performed independently without consultation or agreement.",
        ex: "The country announced unilateral sanctions.",
        tip: "One-sided action."
      },

      {
        w: "AUTONOMOUS",
        pos: "adj",
        cluster: "Independence",
        def: "Independent and self-governing.",
        ex: "The institution remained financially autonomous.",
        tip: "Operates independently."
      },
      {
        w: "SOVEREIGN",
        pos: "adj",
        cluster: "Independence",
        def: "Possessing supreme independent authority.",
        ex: "Each nation remained sovereign under the treaty.",
        tip: "Ultimate political independence."
      },
      {
        w: "SUBSERVIENT",
        pos: "adj",
        cluster: "Independence",
        def: "Excessively obedient or dependent on another.",
        ex: "The committee became subservient to corporate interests.",
        tip: "Lacks independence."
      },
      {
        w: "DOCILE",
        pos: "adj",
        cluster: "Independence",
        def: "Easily controlled or taught.",
        ex: "The ruler preferred docile advisors who never challenged him.",
        tip: "Passive obedience."
      },
      {
        w: "MALLEABLE",
        pos: "adj",
        cluster: "Independence",
        def: "Easily influenced or shaped.",
        ex: "Young voters proved politically malleable.",
        tip: "Can be molded by influence."
      }
    ]
  },
  {
    day: 24,
    theme: "Mixed ETS Trap Set I",
    date: "May 27, 2026",
    patterns: [
      "ETS loves near-synonym traps where one word differs subtly in intent or tone",
      "Disinterested = unbiased · Uninterested = bored",
      "Practical = sensible in reality · Practicable = capable of being done",
      "Historic = historically important · Historical = merely related to history"
    ],
    words: [
      {
        w: "DISINTERESTED",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Impartial and free from personal bias or self-interest.",
        ex: "The mediator remained disinterested throughout negotiations.",
        tip: "DISinterested ≠ bored. Means unbiased."
      },
      {
        w: "UNINTERESTED",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Not interested; indifferent or bored.",
        ex: "Students seemed uninterested in the lengthy lecture.",
        tip: "Means lacking curiosity or engagement."
      },
      {
        w: "PRACTICAL",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Useful or sensible in real-world situations.",
        ex: "Her practical approach resolved the dispute quickly.",
        tip: "Grounded in realistic usefulness."
      },
      {
        w: "PRACTICABLE",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Capable of being carried out or accomplished.",
        ex: "The proposal sounded ambitious but not practicable.",
        tip: "Possible to implement."
      },
      {
        w: "HISTORIC",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Important or influential in history.",
        ex: "The treaty marked a historic diplomatic breakthrough.",
        tip: "Historically significant."
      },
      {
        w: "HISTORICAL",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Related to history or past events.",
        ex: "The book offered historical analysis of the empire.",
        tip: "Anything connected to history generally."
      },
      {
        w: "IMPLY",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To suggest indirectly without stating explicitly.",
        ex: "The editorial implied corruption without naming officials.",
        tip: "Speaker/writer implies."
      },
      {
        w: "INFER",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To conclude from evidence or implication.",
        ex: "Readers inferred the author's skepticism from her tone.",
        tip: "Listener/reader infers."
      },
      {
        w: "CONTINUAL",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Repeated frequently with interruptions.",
        ex: "Continual delays frustrated commuters.",
        tip: "Starts and stops repeatedly."
      },
      {
        w: "CONTINUOUS",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Uninterrupted and ongoing.",
        ex: "The machine operated in continuous motion.",
        tip: "No interruption whatsoever."
      },
      {
        w: "CREDULOUS",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Too willing to believe things easily.",
        ex: "Credulous investors fell for the obvious scam.",
        tip: "Gullible person."
      },
      {
        w: "CREDIBLE",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Believable or worthy of trust.",
        ex: "The witness provided a credible explanation.",
        tip: "Believable claim/person."
      },
      {
        w: "EMINENT",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Highly respected or distinguished.",
        ex: "The eminent scholar transformed the discipline.",
        tip: "Famous and respected."
      },
      {
        w: "IMMINENT",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "About to happen very soon.",
        ex: "Officials warned of imminent flooding.",
        tip: "Impending arrival."
      },
      {
        w: "ILLICIT",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Illegal or forbidden.",
        ex: "Authorities uncovered an illicit trade network.",
        tip: "Against law or rules."
      },
      {
        w: "ELICIT",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To draw out or evoke a response.",
        ex: "The prosecutor elicited a confession.",
        tip: "Extract information/reaction."
      }
    ]
  },
  {
    day: 25,
    theme: "Mixed ETS Trap Set II",
    date: "May 28, 2026",
    patterns: [
      "Economic = related to economy · Economical = efficient and inexpensive",
      "Dispassionate = objective neutrality · Apathetic = lack of caring",
      "Mitigate reduces severity · Mollify calms emotions",
      "Qualify can LIMIT a claim rather than merely describe credentials"
    ],
    words: [
      {
        w: "ECONOMIC",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Relating to economics, finance, or the economy.",
        ex: "The country faced severe economic instability.",
        tip: "About the economy itself."
      },
      {
        w: "ECONOMICAL",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Efficient and avoiding waste.",
        ex: "Hybrid vehicles are more economical to operate.",
        tip: "Cost-efficient and frugal."
      },
      {
        w: "DISPASSIONATE",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Free from emotional bias; objective.",
        ex: "The article offered a dispassionate analysis of the conflict.",
        tip: "Neutrality, not coldness."
      },
      {
        w: "APATHETIC",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Lacking interest, concern, or emotion.",
        ex: "Voters appeared apathetic during the campaign.",
        tip: "Doesn't care at all."
      },
      {
        w: "MITIGATE",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To lessen severity or harm.",
        ex: "The reforms mitigated economic inequality.",
        tip: "Reduce damage."
      },
      {
        w: "MOLLIFY",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To calm or soothe anger or anxiety.",
        ex: "Officials attempted to mollify angry residents.",
        tip: "Calms emotions specifically."
      },
      {
        w: "EQUIVOCAL",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Ambiguous or unclear in meaning.",
        ex: "Her equivocal answer frustrated reporters.",
        tip: "Unclear statement."
      },
      {
        w: "EQUIVOCATE",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To deliberately use ambiguous language.",
        ex: "The candidate equivocated during the debate.",
        tip: "Action of being vague."
      },
      {
        w: "QUALIFY",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To limit, modify, or soften a statement.",
        ex: "The researcher qualified her conclusion with several caveats.",
        tip: "GRE often uses this meaning — LIMIT, not credentials."
      },
      {
        w: "QUIBBLE",
        pos: "v",
        cluster: "Trap Pairs",
        def: "To argue over trivial details.",
        ex: "Reviewers quibbled about minor methodological flaws.",
        tip: "Petty nitpicking."
      },
      {
        w: "TORTUOUS",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Twisting, winding, or excessively complicated.",
        ex: "The tortuous explanation confused everyone.",
        tip: "Complex winding path/logic."
      },
      {
        w: "TORTUROUS",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Involving intense pain or suffering.",
        ex: "The prisoners endured torturous conditions.",
        tip: "Related to torture/pain."
      },
      {
        w: "LUXURIANT",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Rich, abundant, and lush in growth.",
        ex: "The valley was covered in luxuriant vegetation.",
        tip: "Abundant flourishing growth."
      },
      {
        w: "LUXURIOUS",
        pos: "adj",
        cluster: "Trap Pairs",
        def: "Extremely comfortable and expensive.",
        ex: "They stayed in a luxurious resort.",
        tip: "Associated with wealth and comfort."
      },
      {
        w: "COMPLEMENT",
        pos: "v/n",
        cluster: "Trap Pairs",
        def: "Something that completes or enhances another thing.",
        ex: "The wine complemented the meal perfectly.",
        tip: "COMplete = complement."
      },
      {
        w: "COMPLIMENT",
        pos: "v/n",
        cluster: "Trap Pairs",
        def: "An expression of praise or admiration.",
        ex: "She complimented the author on his clarity.",
        tip: "Say nice things."
      }
    ]
  },
  {
    day: 26,
    theme: "Final High-Frequency Sweep I",
    date: "May 29, 2026",
    patterns: [
      "These are among the most recurring GRE RC/TC/SE words across ETS material",
      "Tenuous arguments are weakly supported",
      "Tacit/implicit ideas are unstated but understood",
      "Bolster strengthens · Undermine weakens"
    ],
    words: [
      {
        w: "TENUOUS",
        pos: "adj",
        cluster: "Argument",
        def: "Weak, thin, or lacking solid support.",
        ex: "The theory rested on tenuous assumptions.",
        tip: "Fragile logical support."
      },
      {
        w: "COGENT",
        pos: "adj",
        cluster: "Argument",
        def: "Clear, logical, and convincing.",
        ex: "She presented a cogent argument against the proposal.",
        tip: "Strong persuasive logic."
      },
      {
        w: "PLAUSIBLE",
        pos: "adj",
        cluster: "Argument",
        def: "Seemingly reasonable or believable.",
        ex: "The scientist proposed a plausible explanation.",
        tip: "Seems believable, not necessarily true."
      },
      {
        w: "DUBIOUS",
        pos: "adj",
        cluster: "Argument",
        def: "Questionable or doubtful.",
        ex: "Critics expressed doubts about the study's dubious claims.",
        tip: "Weak credibility."
      },
      {
        w: "CREDIBLE",
        pos: "adj",
        cluster: "Argument",
        def: "Believable and trustworthy.",
        ex: "The witness gave a credible account.",
        tip: "Opposite of dubious."
      },

      {
        w: "BOLSTER",
        pos: "v",
        cluster: "Support",
        def: "To strengthen or support.",
        ex: "New evidence bolstered the hypothesis.",
        tip: "Strengthens arguments constantly in RC."
      },
      {
        w: "CORROBORATE",
        pos: "v",
        cluster: "Support",
        def: "To confirm or support with evidence.",
        ex: "The documents corroborated her testimony.",
        tip: "Independent evidence confirms."
      },
      {
        w: "SUBSTANTIATE",
        pos: "v",
        cluster: "Support",
        def: "To provide proof or support for.",
        ex: "Researchers struggled to substantiate the claim.",
        tip: "Supply evidence."
      },
      {
        w: "BUTTRESS",
        pos: "v",
        cluster: "Support",
        def: "To reinforce or strengthen.",
        ex: "Historical data buttressed the argument.",
        tip: "Formal RC synonym for bolster."
      },
      {
        w: "VALIDATE",
        pos: "v",
        cluster: "Support",
        def: "To confirm legitimacy or accuracy.",
        ex: "Subsequent studies validated the findings.",
        tip: "Official confirmation."
      },

      {
        w: "UNDERMINE",
        pos: "v",
        cluster: "Opposition",
        def: "To weaken gradually or secretly.",
        ex: "The scandal undermined public trust.",
        tip: "Weakens support from below."
      },
      {
        w: "IMPUGN",
        pos: "v",
        cluster: "Opposition",
        def: "To challenge as false or questionable.",
        ex: "Opponents impugned the author's credibility.",
        tip: "Attack validity or integrity."
      },
      {
        w: "REFUTE",
        pos: "v",
        cluster: "Opposition",
        def: "To prove false through evidence or argument.",
        ex: "The data refuted the earlier hypothesis.",
        tip: "Full logical defeat."
      },
      {
        w: "REBUT",
        pos: "v",
        cluster: "Opposition",
        def: "To counter an argument with contrary evidence.",
        ex: "The attorney rebutted every accusation.",
        tip: "Responds directly against claims."
      },
      {
        w: "DISPUTE",
        pos: "v",
        cluster: "Opposition",
        def: "To question or argue against.",
        ex: "Several scholars disputed the conclusion.",
        tip: "General disagreement/challenge."
      },

      {
        w: "TACIT",
        pos: "adj",
        cluster: "Implicitness",
        def: "Understood without being directly stated.",
        ex: "The agreement had tacit approval from both parties.",
        tip: "Silently understood."
      },
      {
        w: "IMPLICIT",
        pos: "adj",
        cluster: "Implicitness",
        def: "Suggested though not directly expressed.",
        ex: "The criticism remained implicit throughout the essay.",
        tip: "Indirectly communicated."
      },
      {
        w: "EXPLICIT",
        pos: "adj",
        cluster: "Implicitness",
        def: "Clearly and directly stated.",
        ex: "The contract contained explicit instructions.",
        tip: "Directly expressed."
      },
      {
        w: "AMBIGUOUS",
        pos: "adj",
        cluster: "Implicitness",
        def: "Open to more than one interpretation.",
        ex: "The poem's ending remained ambiguous.",
        tip: "Unclear multiple meanings."
      },
      {
        w: "UNEQUIVOCAL",
        pos: "adj",
        cluster: "Implicitness",
        def: "Leaving no doubt; completely clear.",
        ex: "The evidence offered unequivocal proof.",
        tip: "Absolute clarity."
      }
    ]
  },
  {
    day: 27,
    theme: "Final High-Frequency Sweep II",
    date: "May 30, 2026",
    patterns: [
      "Derivative work lacks originality · Innovative work creates something genuinely new",
      "Ephemeral = short-lived · Enduring = lasting over time",
      "Anomalies disrupt patterns; paradigms define them",
      "GRE loves moderation words over absolute words"
    ],
    words: [
      {
        w: "DERIVATIVE",
        pos: "adj",
        cluster: "Originality",
        def: "Imitating another work and lacking originality.",
        ex: "Critics dismissed the sequel as derivative and uninspired.",
        tip: "Copied without innovation."
      },
      {
        w: "INNOVATIVE",
        pos: "adj",
        cluster: "Originality",
        def: "Introducing new methods or ideas.",
        ex: "The architect became famous for innovative urban designs.",
        tip: "Creates genuine novelty."
      },
      {
        w: "CONVENTIONAL",
        pos: "adj",
        cluster: "Originality",
        def: "Following established standards or traditions.",
        ex: "The novel used a conventional narrative structure.",
        tip: "Mainstream accepted form."
      },
      {
        w: "RADICAL",
        pos: "adj",
        cluster: "Originality",
        def: "Departing dramatically from traditional ideas or methods.",
        ex: "The scientist proposed a radical reinterpretation of the data.",
        tip: "Fundamental departure from norm."
      },
      {
        w: "ICONOCLASTIC",
        pos: "adj",
        cluster: "Originality",
        def: "Attacking or rejecting traditional beliefs and conventions.",
        ex: "The director's iconoclastic films divided critics.",
        tip: "Aggressively anti-tradition."
      },

      {
        w: "EPHEMERAL",
        pos: "adj",
        cluster: "Time",
        def: "Lasting for a very short time.",
        ex: "Internet fame can be surprisingly ephemeral.",
        tip: "Temporary and fleeting."
      },
      {
        w: "TRANSIENT",
        pos: "adj",
        cluster: "Time",
        def: "Temporary and impermanent.",
        ex: "The economic recovery proved transient.",
        tip: "Passes quickly."
      },
      {
        w: "ENDURING",
        pos: "adj",
        cluster: "Time",
        def: "Lasting over a long period of time.",
        ex: "The novel retains enduring popularity.",
        tip: "Long-lasting significance."
      },
      {
        w: "PERENNIAL",
        pos: "adj",
        cluster: "Time",
        def: "Continuing repeatedly through time; persistent.",
        ex: "Income inequality remains a perennial political issue.",
        tip: "Recurring again and again."
      },
      {
        w: "EVANESCENT",
        pos: "adj",
        cluster: "Time",
        def: "Quickly fading or vanishing.",
        ex: "The painting captured the evanescent colors of sunset.",
        tip: "Beautiful brief disappearance."
      },

      {
        w: "ANOMALY",
        pos: "n",
        cluster: "Patterns",
        def: "Something that deviates from what is expected.",
        ex: "Researchers initially dismissed the result as an anomaly.",
        tip: "Exception to established pattern."
      },
      {
        w: "PARADIGM",
        pos: "n",
        cluster: "Patterns",
        def: "A typical model, framework, or pattern.",
        ex: "The discovery shifted the dominant scientific paradigm.",
        tip: "Foundational model of thinking."
      },
      {
        w: "PRECEDENT",
        pos: "n",
        cluster: "Patterns",
        def: "An earlier example used as a guide for later decisions.",
        ex: "The ruling established an important legal precedent.",
        tip: "Past example shaping future actions."
      },
      {
        w: "PROTOTYPE",
        pos: "n",
        cluster: "Patterns",
        def: "An original model on which later versions are based.",
        ex: "Engineers tested the prototype before mass production.",
        tip: "First model/template."
      },
      {
        w: "ARCHETYPE",
        pos: "n",
        cluster: "Patterns",
        def: "The ideal or original example of a type.",
        ex: "The hero became the archetype for later characters.",
        tip: "Ultimate representative model."
      },

      {
        w: "MODERATE",
        pos: "adj/v",
        cluster: "Balance",
        def: "Avoiding extremes; reasonably limited or balanced.",
        ex: "The report adopted a moderate position on reform.",
        tip: "GRE often rewards balanced positions."
      },
      {
        w: "EXTREME",
        pos: "adj",
        cluster: "Balance",
        def: "Far beyond normal limits or moderation.",
        ex: "Extreme rhetoric alienated undecided voters.",
        tip: "GRE often punishes absolutes."
      },
      {
        w: "QUALIFIED",
        pos: "adj",
        cluster: "Balance",
        def: "Limited or moderated in extent.",
        ex: "The scholar expressed qualified agreement with the theory.",
        tip: "Partially limited support."
      },
      {
        w: "MEASURED",
        pos: "adj",
        cluster: "Balance",
        def: "Careful, restrained, and balanced.",
        ex: "Her measured criticism carried more authority than outrage.",
        tip: "Controlled moderation."
      },
      {
        w: "TEMPERATE",
        pos: "adj",
        cluster: "Balance",
        def: "Showing moderation and self-restraint.",
        ex: "The debate remained surprisingly temperate.",
        tip: "Moderate emotional control."
      }
    ]
  },
  {
    day: 28,
    theme: "RC Ultra-High Frequency Abstract Verbs",
    date: "May 31, 2026",
    patterns: [
      "ETS RC passages rely heavily on abstract process verbs",
      "Construe = interpret · Postulate = propose theoretically",
      "Disseminate spreads ideas widely",
      "Reconciling positions means resolving apparent contradiction"
    ],
    words: [
      {
        w: "CONSTRUE",
        pos: "v",
        cluster: "Interpretation",
        def: "To interpret or understand in a particular way.",
        ex: "Critics construed the statement as an attack on academic freedom.",
        tip: "Interpretive reading."
      },
      {
        w: "POSTULATE",
        pos: "v",
        cluster: "Interpretation",
        def: "To propose or assume as a basis for reasoning.",
        ex: "The theory postulates a hidden economic mechanism.",
        tip: "Theoretical assumption."
      },
      {
        w: "EXTRAPOLATE",
        pos: "v",
        cluster: "Interpretation",
        def: "To infer unknown information from known evidence.",
        ex: "Researchers extrapolated future trends from current data.",
        tip: "Project outward from evidence."
      },
      {
        w: "INFER",
        pos: "v",
        cluster: "Interpretation",
        def: "To draw conclusions from evidence.",
        ex: "Readers inferred skepticism from the author's tone.",
        tip: "Conclude indirectly."
      },
      {
        w: "DEDUCE",
        pos: "v",
        cluster: "Interpretation",
        def: "To reach a conclusion through logical reasoning.",
        ex: "Scientists deduced the compound's structure.",
        tip: "Logical step-by-step conclusion."
      },

      {
        w: "DISSEMINATE",
        pos: "v",
        cluster: "Transmission",
        def: "To spread widely.",
        ex: "The internet disseminated information rapidly.",
        tip: "Spread ideas/information."
      },
      {
        w: "PROPAGATE",
        pos: "v",
        cluster: "Transmission",
        def: "To spread or promote widely.",
        ex: "The regime propagated nationalist ideology.",
        tip: "Often ideological spread."
      },
      {
        w: "DIFFUSE",
        pos: "v",
        cluster: "Transmission",
        def: "To spread throughout a wide area.",
        ex: "New technologies diffused gradually across society.",
        tip: "Gradual spreading outward."
      },
      {
        w: "INSTILL",
        pos: "v",
        cluster: "Transmission",
        def: "To gradually establish an idea or feeling.",
        ex: "Teachers instilled intellectual curiosity in students.",
        tip: "Plant ideas slowly."
      },
      {
        w: "IMBUE",
        pos: "v",
        cluster: "Transmission",
        def: "To fill thoroughly with a quality or feeling.",
        ex: "The speech was imbued with optimism.",
        tip: "Deeply saturated with quality."
      },

      {
        w: "RECONCILE",
        pos: "v",
        cluster: "Resolution",
        def: "To resolve inconsistency between ideas or positions.",
        ex: "Scholars struggled to reconcile the conflicting accounts.",
        tip: "Make contradictions fit together."
      },
      {
        w: "SYNTHESIZE",
        pos: "v",
        cluster: "Resolution",
        def: "To combine separate elements into a coherent whole.",
        ex: "The author synthesized decades of research.",
        tip: "Integrate many parts."
      },
      {
        w: "INTEGRATE",
        pos: "v",
        cluster: "Resolution",
        def: "To combine into a unified system.",
        ex: "The reform integrated local and national policies.",
        tip: "Bring together cohesively."
      },
      {
        w: "MEDIATE",
        pos: "v",
        cluster: "Resolution",
        def: "To intervene to reconcile opposing sides.",
        ex: "Diplomats mediated the territorial dispute.",
        tip: "Neutral conflict resolution."
      },
      {
        w: "ARBITRATE",
        pos: "v",
        cluster: "Resolution",
        def: "To settle disputes through authoritative judgment.",
        ex: "An international panel arbitrated the disagreement.",
        tip: "Formal outside resolution."
      },

      {
        w: "SUPPLANT",
        pos: "v",
        cluster: "Replacement",
        def: "To replace or take the place of.",
        ex: "Digital photography supplanted film.",
        tip: "Old system displaced."
      },
      {
        w: "DISPLACE",
        pos: "v",
        cluster: "Replacement",
        def: "To force out or take the position of.",
        ex: "Automation displaced many factory workers.",
        tip: "Push out from position."
      },
      {
        w: "SUBSUME",
        pos: "v",
        cluster: "Replacement",
        def: "To include within a larger category or system.",
        ex: "The theory subsumed several earlier explanations.",
        tip: "Absorb into larger framework."
      },
      {
        w: "ECLIPSE",
        pos: "v",
        cluster: "Replacement",
        def: "To surpass or overshadow.",
        ex: "Her later work eclipsed her early novels.",
        tip: "Outshine completely."
      },
      {
        w: "SUPERSEDE",
        pos: "v",
        cluster: "Replacement",
        def: "To replace something outdated or inferior.",
        ex: "The new regulations superseded earlier laws.",
        tip: "Official replacement."
      }
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
        tip: "Classic SE clarity word."
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
        tip: "Can mean unknown OR unclear."
      },
      {
        w: "ARCANE",
        pos: "adj",
        cluster: "Unclear",
        def: "Known by only a few specialists.",
        ex: "The text explored arcane legal doctrines.",
        tip: "Specialized obscurity."
      },
      {
        w: "ESOTERIC",
        pos: "adj",
        cluster: "Unclear",
        def: "Intended for or understood by a small group.",
        ex: "The seminar focused on esoteric philosophy.",
        tip: "Elite insider knowledge."
      },

      {
        w: "PRAGMATIC",
        pos: "adj",
        cluster: "Practical",
        def: "Focused on practical results.",
        ex: "The mayor adopted a pragmatic compromise.",
        tip: "Results over ideology."
      },
      {
        w: "UTILITARIAN",
        pos: "adj",
        cluster: "Practical",
        def: "Designed primarily for usefulness rather than beauty.",
        ex: "The building's utilitarian design emphasized efficiency.",
        tip: "Pure functionality."
      },
      {
        w: "IDEALISTIC",
        pos: "adj",
        cluster: "Abstract",
        def: "Guided by ideals more than practical concerns.",
        ex: "Her idealistic proposals lacked realistic funding.",
        tip: "Vision over practicality."
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
        tip: "Impossible perfection."
      },

      {
        w: "SPORADIC",
        pos: "adj",
        cluster: "Frequency",
        def: "Occurring irregularly and infrequently.",
        ex: "The region experienced sporadic violence.",
        tip: "Random occasional appearance."
      },
      {
        w: "INTERMITTENT",
        pos: "adj",
        cluster: "Frequency",
        def: "Stopping and starting repeatedly.",
        ex: "Intermittent rain delayed the event.",
        tip: "Repeated interruptions."
      },
      {
        w: "PERPETUAL",
        pos: "adj",
        cluster: "Frequency",
        def: "Continuing indefinitely.",
        ex: "The city faced perpetual traffic congestion.",
        tip: "Never-ending continuation."
      },
      {
        w: "CHRONIC",
        pos: "adj",
        cluster: "Frequency",
        def: "Persisting for a long time or constantly recurring.",
        ex: "The country struggled with chronic instability.",
        tip: "Long-term recurring problem."
      },
      {
        w: "UBIQUITOUS",
        pos: "adj",
        cluster: "Frequency",
        def: "Present or found everywhere.",
        ex: "Smartphones have become ubiquitous.",
        tip: "Everywhere simultaneously."
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
        tip: "Pushes others away socially."
      },
      {
        w: "ENGENDER",
        pos: "v",
        cluster: "Conflict",
        def: "To produce or generate.",
        ex: "The reforms engendered optimism.",
        tip: "Creates abstract emotions/states."
      },
      {
        w: "FOMENT",
        pos: "v",
        cluster: "Conflict",
        def: "To stir up or incite trouble.",
        ex: "The speech fomented political unrest.",
        tip: "Actively provokes instability."
      },
      {
        w: "GALVANIZE",
        pos: "v",
        cluster: "Conflict",
        def: "To shock or excite into action.",
        ex: "The scandal galvanized public opposition.",
        tip: "Sudden activation into movement."
      },
      {
        w: "PLACATE",
        pos: "v",
        cluster: "Conflict",
        def: "To calm or pacify anger.",
        ex: "Leaders tried to placate protesters with concessions.",
        tip: "Reduce hostility."
      },

      {
        w: "ERODE",
        pos: "v",
        cluster: "Decline",
        def: "To gradually weaken or diminish.",
        ex: "Public trust eroded over time.",
        tip: "Slow weakening process."
      },
      {
        w: "DWINDLE",
        pos: "v",
        cluster: "Decline",
        def: "To diminish gradually in size or strength.",
        ex: "Resources dwindled during the crisis.",
        tip: "Shrink steadily."
      },
      {
        w: "ATROPHY",
        pos: "v",
        cluster: "Decline",
        def: "To weaken through lack of use.",
        ex: "Unused skills gradually atrophied.",
        tip: "Decay from neglect."
      },
      {
        w: "DETERIORATE",
        pos: "v",
        cluster: "Decline",
        def: "To become progressively worse.",
        ex: "Relations deteriorated rapidly after the dispute.",
        tip: "General worsening."
      },
      {
        w: "DEGENERATE",
        pos: "v",
        cluster: "Decline",
        def: "To decline morally or structurally.",
        ex: "The debate degenerated into insults.",
        tip: "Collapse into lower form."
      },

      {
        w: "SPURIOUS",
        pos: "adj",
        cluster: "Validity",
        def: "False despite appearing genuine.",
        ex: "Researchers rejected the spurious correlation.",
        tip: "Fake masquerading as real."
      },
      {
        w: "SPECIOUS",
        pos: "adj",
        cluster: "Validity",
        def: "Superficially convincing but actually flawed.",
        ex: "His specious reasoning initially persuaded voters.",
        tip: "Argument sounds right but isn't."
      },
      {
        w: "TENDENTIOUS",
        pos: "adj",
        cluster: "Validity",
        def: "Expressing biased or partisan views.",
        ex: "The documentary was criticized as tendentious propaganda.",
        tip: "Pushes ideological agenda."
      },
      {
        w: "OBJECTIVE",
        pos: "adj",
        cluster: "Validity",
        def: "Uninfluenced by personal feelings or opinions.",
        ex: "The report aimed for objective analysis.",
        tip: "Neutral evidence-based judgment."
      },
      {
        w: "PARTISAN",
        pos: "adj/n",
        cluster: "Validity",
        def: "Strongly biased toward one side or cause.",
        ex: "Partisan rhetoric deepened divisions.",
        tip: "Politically or ideologically biased."
      },

      {
        w: "SUPERFICIAL",
        pos: "adj",
        cluster: "Depth",
        def: "Concerned only with surface appearance.",
        ex: "The analysis was superficial and incomplete.",
        tip: "Lacks depth."
      },
      {
        w: "PROFOUND",
        pos: "adj",
        cluster: "Depth",
        def: "Very deep or intellectually significant.",
        ex: "The philosopher offered profound insights into morality.",
        tip: "Deep intellectual/emotional weight."
      },
      {
        w: "PERFUNCTORY",
        pos: "adj",
        cluster: "Depth",
        def: "Done with minimal effort or enthusiasm.",
        ex: "The committee conducted only a perfunctory investigation.",
        tip: "Mechanical low-effort action."
      },
      {
        w: "METICULOUS",
        pos: "adj",
        cluster: "Depth",
        def: "Showing extreme attention to detail.",
        ex: "The editor gave the manuscript meticulous review.",
        tip: "Careful precision."
      },
      {
        w: "SCRUPULOUS",
        pos: "adj",
        cluster: "Depth",
        def: "Extremely careful and morally conscientious.",
        ex: "The journalist was scrupulous about verifying facts.",
        tip: "Careful + ethical integrity."
      }
    ]
  }
];

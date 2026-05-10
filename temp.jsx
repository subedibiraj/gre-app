import { useState, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg:'#07090F', surface:'#0C1220', card:'#111928', cardHi:'#16233A',
  border:'#1C2E4A', borderHi:'#2A4470',
  gold:'#C8A535', goldBr:'#E4C060', goldDim:'#5A480F',
  text:'#DDD8C8', textMid:'#7A8CA0', textDim:'#3A4E68',
  green:'#24976A', greenBg:'#061510', greenBr:'#2EBB80',
  red:'#B53028', redBg:'#1C0808', blue:'#2B6FBF',
};

// ─── ALL 7 DAYS DATA ──────────────────────────────────────────────────────────
const DAYS = [
  {
    day:1, theme:"Ways of Speaking", date:"Apr 29, 2026",
    patterns:[
      "Pivot words signal CONTRAST: despite / although / yet / while / surprisingly",
      "Multi-blank TC: find evidence for each blank independently — don't bleed between blanks",
      "SE RULE: exactly 2 answers always — 1 correct word = 0 points on the real GRE",
    ],
    words:[
      {w:"TACITURN",    pos:"adj", cluster:"Quiet",  def:"Habitually silent; not fond of talking — a personality trait",          ex:"The professor was so taciturn that students answered in single syllables.",      tip:"Taciturn = permanent personality. Reticent = guarded about a specific topic."},
      {w:"RETICENT",    pos:"adj", cluster:"Quiet",  def:"Reluctant to speak, especially about personal feelings or opinions",    ex:"She was reticent about her past, deflecting personal questions with ease.",       tip:"Reticent = guarded about a specific topic — not a general personality trait."},
      {w:"LACONIC",     pos:"adj", cluster:"Quiet",  def:"Using very few words; brief to the point of seeming rude",              ex:"His laconic reply — 'No.' — ended the debate immediately.",                     tip:"Laconic = style of speaking, not a personality trait like taciturn."},
      {w:"LOQUACIOUS",  pos:"adj", cluster:"Loud",   def:"Very talkative; loves to chat. Neutral connotation.",                   ex:"The loquacious tour guide narrated every building, every alley.",               tip:"Loquacious = just very talkative (neutral). Garrulous = talkative AND annoying."},
      {w:"GARRULOUS",   pos:"adj", cluster:"Loud",   def:"Annoyingly talkative; rambling and hard to stop. Negative.",            ex:"The garrulous neighbor cornered her for an hour about tomato plants.",           tip:"Garrulous implies the listener is suffering. Loquacious is neutral."},
      {w:"VOLUBLE",     pos:"adj", cluster:"Loud",   def:"Talking fluently and at length; often impressive or captivating.",      ex:"A voluble speaker, she could hold a room's attention for hours.",               tip:"Voluble = talkative AND fluent AND impressive. Positive or neutral."},
      {w:"VERBOSE",     pos:"adj", cluster:"Wordy",  def:"Using more words than needed in speech or writing.",                    ex:"His verbose reports buried the key finding under three pages of preamble.",     tip:"Verbose = more words than needed. Prolix = so wordy it's tedious (stronger)."},
      {w:"PROLIX",      pos:"adj", cluster:"Wordy",  def:"Tediously long and wordy; stronger and more negative than verbose.",    ex:"The prolix legal document ran 200 pages for what could be said in 10.",        tip:"Prolix implies the reader is exhausted. Use for extreme wordiness."},
      {w:"TERSE",       pos:"adj", cluster:"Sharp",  def:"Brief, almost brusque; fewer words than expected.",                     ex:"Her terse email — 'Done. Move on.' — left the team uneasy.",                   tip:"Terse = brief but can feel rude. Pithy = brief AND meaningful (positive)."},
      {w:"PITHY",       pos:"adj", cluster:"Sharp",  def:"Brief and full of meaning; concise and forcefully expressive — the ideal.",ex:"Her pithy remarks cut to the heart of every issue without wasting a word.",  tip:"Pithy is always positive. 'A pithy summary' = high praise on the GRE."},
    ],
  },
  {
    day:2, theme:"Ways of Criticizing", date:"May 3, 2026",
    patterns:[
      "Public/institutional = censure · lambaste · condemn · excoriate",
      "Personal/private = berate · upbraid · rebuke · reproach · admonish",
      "Excoriate = savage, prolonged, public/written — not a private conversation",
      "Berate = personal, angry, SUSTAINED — duration is always the tell",
    ],
    words:[
      {w:"REPROACH",   pos:"v/n", cluster:"Gentle", def:"Disappointment-based criticism; backward-looking, often from someone who cares",    ex:"His mother's quiet reproach stung more than any punishment.",              tip:"Reproach = 'you disappointed me' (backward). Admonish = 'don't do this again' (forward)."},
      {w:"ADMONISH",   pos:"v",   cluster:"Gentle", def:"To gently warn or advise against something; corrective but not angry.",              ex:"The judge admonished the defendant to stay out of trouble.",               tip:"Admonish = caring forward-looking guidance. The admonisher wants improvement."},
      {w:"REBUKE",     pos:"v/n", cluster:"Sharp",  def:"A sharp, direct expression of disapproval — often public but personal.",             ex:"The senator received a formal rebuke from the ethics committee.",          tip:"Rebuke = sharp words from a person. Censure = formal institutional vote/action."},
      {w:"CENSURE",    pos:"v/n", cluster:"Sharp",  def:"Official, formal condemnation by a body or institution.",                            ex:"The UN voted to censure the nation for its human rights violations.",       tip:"KEY: censure requires an institution. One person criticizing = rebuke, not censure."},
      {w:"UPBRAID",    pos:"v",   cluster:"Sharp",  def:"To find fault with and scold; sharp but relatively brief.",                          ex:"She upbraided her assistant for the third time that week.",                 tip:"Upbraid is personal and sharp — but shorter than berate."},
      {w:"BERATE",     pos:"v",   cluster:"Harsh",  def:"To scold angrily and at length; aggressive and sustained.",                          ex:"The chef berated the line cook loudly in front of the entire kitchen.",    tip:"Berate = LONG + ANGRY + PERSONAL. Duration is the tell."},
      {w:"CASTIGATE",  pos:"v",   cluster:"Harsh",  def:"To reprimand severely; implies the person deserved harsh punishment.",               ex:"The editorial castigated the mayor for ignoring crumbling infrastructure.", tip:"Castigate implies the target earned the criticism. Often in editorials/written form."},
      {w:"LAMBASTE",   pos:"v",   cluster:"Harsh",  def:"To attack or criticize with great energy; forceful and public.",                     ex:"Critics lambasted the film, calling it the worst release of the decade.",  tip:"Lambaste = energetic public attack. Subject is a work, policy, or public action."},
      {w:"EXCORIATE",  pos:"v",   cluster:"Savage", def:"To criticize with extreme harshness; to flay verbally. Long, savage, often written.", ex:"The review excoriated the novel so brutally the author took a five-year break.", tip:"Excoriate literally = strip skin off. The manner is brutal. Usually written/public."},
      {w:"CONDEMN",    pos:"v",   cluster:"Savage", def:"To express complete moral disapproval; carries a sense of final verdict.",            ex:"World leaders condemned the attack as a violation of international law.",  tip:"Condemn = moral weight and finality. Less about manner, more about total verdict."},
    ],
  },
  {
    day:3, theme:"Ways of Deceiving", date:"May 5, 2026",
    patterns:[
      "Fabricate (act of creating the false thing) vs Spurious (the quality of being fake)",
      "Sophistry (speech/reasoning) · Chicanery (scheme/plan) · Subterfuge (escape trick)",
      "Ingenious (clever) vs Ingenuous (naive) — one letter, constant GRE trap",
      "People-only words: mendacious · disingenuous · perfidious (never describe objects)",
    ],
    words:[
      {w:"MENDACIOUS",    pos:"adj", cluster:"Liar",       def:"Habitually lying; untruthful as a character trait",                          ex:"The mendacious politician fabricated so many stories his allies stopped believing him.",tip:"Mendacious = the person IS a liar by nature. People only — never describe objects."},
      {w:"FABRICATE",     pos:"v",   cluster:"Liar",       def:"To invent a false story or piece of evidence",                              ex:"She fabricated an alibi so elaborate it took investigators weeks to unravel.", tip:"Fabricate on GRE = to falsely construct — not to make something physical."},
      {w:"SPURIOUS",      pos:"adj", cluster:"Liar",       def:"Not genuine; false, despite appearing legitimate",                          ex:"The researcher dismissed the study's spurious data.",                         tip:"Spurious = fake masquerading as real. For data, documents, claims — NOT for arguments."},
      {w:"PREVARICATE",   pos:"v",   cluster:"Evader",     def:"To speak evasively; to avoid the truth without technically lying",          ex:"When asked about the funds, the treasurer began to prevaricate.",             tip:"Prevaricate ≠ lie. The person dances around the truth. Evades."},
      {w:"EQUIVOCATE",    pos:"v",   cluster:"Evader",     def:"To use ambiguous language deliberately to avoid commitment",                ex:"The candidate equivocated so both sides heard what they wanted.",              tip:"Equivocate = deliberately vague. Prevaricate = evasive. Both avoid truth."},
      {w:"DISSEMBLE",     pos:"v",   cluster:"Evader",     def:"To conceal true feelings, motives, or intentions behind a false appearance", ex:"She dissembled perfectly, smiling warmly while calculating her rival's downfall.",tip:"Dissemble = hide what's real inside. Outside doesn't match inside."},
      {w:"DUPLICITOUS",   pos:"adj", cluster:"Manipulator",def:"Double-dealing; saying one thing while meaning or doing another",           ex:"The duplicitous negotiator agreed to terms while quietly sabotaging the deal.",  tip:"Duplicitous = two-faced. The 'dupli' root = double."},
      {w:"DISINGENUOUS",  pos:"adj", cluster:"Manipulator",def:"Pretending to be naive or ignorant while actually knowing better",          ex:"Her disingenuous claim of surprise fooled no one.",                            tip:"Disingenuous = pretends not to know what they know. People only."},
      {w:"GUILE",         pos:"n",   cluster:"Manipulator",def:"Sly, cunning intelligence used for deception; craftiness",                  ex:"The spy navigated the interrogation with remarkable guile.",                   tip:"Guile is a noun. Guileless = lacking guile = naive, innocent (also tested!)."},
      {w:"SUBTERFUGE",    pos:"n",   cluster:"Manipulator",def:"A trick or deception used to achieve a goal; a ruse used to escape",       ex:"The company used legal subterfuge to avoid disclosing financial losses.",       tip:"Subterfuge = the scheme or trick itself. Used to ESCAPE or AVOID a situation."},
      {w:"SPECIOUS",      pos:"adj", cluster:"Logic",      def:"Appears correct or logical on the surface but is actually flawed or false", ex:"His specious argument convinced the jury until an expert exposed the error.",   tip:"Specious vs Spurious: Specious = sounds convincing (arguments). Spurious = fake/not genuine (data, docs)."},
      {w:"SOPHISTRY",     pos:"n",   cluster:"Logic",      def:"Clever but deceptive reasoning; arguments that sound good but are logically flawed", ex:"The lawyer's closing statement was pure sophistry — persuasive but hollow.",tip:"Sophistry = mouth (deceptive reasoning). Chicanery = plan (scheme). Subterfuge = escape."},
      {w:"CHICANERY",     pos:"n",   cluster:"Logic",      def:"Deception through trickery, manipulation, or dishonest means",             ex:"The election was marred by chicanery — ballot stuffing, intimidation, fraud.",  tip:"Chicanery = the whole scheme of tricks. Often for legal or political deception."},
      {w:"PERFIDIOUS",    pos:"adj", cluster:"Betrayer",   def:"Guilty of treachery or betrayal; deceitful in a way that violates trust",  ex:"His perfidious betrayal — selling secrets to a rival — cost the company everything.",tip:"Perfidious = deception through BETRAYAL. There was trust, then it was violated."},
      {w:"INGENUOUS",     pos:"adj", cluster:"Bonus",      def:"Innocent, naive, candid, lacking guile — the opposite of disingenuous",    ex:"Her ingenuous expression of surprise seemed genuine — she truly hadn't known.", tip:"INGENUOUS = naive/innocent. INGENIOUS = brilliantly clever. One letter. Constant GRE trap."},
    ],
  },
  {
    day:4, theme:"Ways of Praising", date:"May 6, 2026",
    patterns:[
      "Sycophant (noun: the person) vs Obsequious (adjective: the quality) vs Fawn (verb: the act)",
      "Panegyric (grand but honest) vs Hagiography (grand AND blind/uncritical)",
      "Apotheosis = divine elevation OR the ultimate perfect example (both tested)",
      "Adulatory = adjective only — adulatory tone/coverage/reviews",
    ],
    words:[
      {w:"LAUD",         pos:"v",   cluster:"Genuine",   def:"To praise highly; to commend. Sincere, formal praise.",               ex:"The committee lauded the researcher's decade of work with its highest honor.",  tip:"Laud = sincere, formal praise. Laudable = deserving praise. Both GRE tested."},
      {w:"EXTOL",        pos:"v",   cluster:"Genuine",   def:"To praise enthusiastically and at length; stronger than laud.",        ex:"She extolled the virtues of the new policy in every speech.",                  tip:"Extol = you actively and energetically champion something. More vigorous than laud."},
      {w:"ACCLAIM",      pos:"v/n", cluster:"Genuine",   def:"Enthusiastic public approval and praise.",                            ex:"The novel received widespread acclaim for its unflinching portrayal of grief.",  tip:"Acclaim is often a noun. 'Critical acclaim' appears constantly in GRE RC passages."},
      {w:"VENERATE",     pos:"v",   cluster:"Genuine",   def:"To regard with deep respect and reverence; almost sacred admiration.", ex:"The community venerated the elder statesman, treating his words as near gospel.",tip:"Venerate = quasi-religious weight. Revere = deep but earthly."},
      {w:"REVERE",       pos:"v",   cluster:"Genuine",   def:"To feel deep respect and admiration for; slightly less than venerate.", ex:"Students revered the professor for his genuine curiosity.",                     tip:"Revere is deep but earthly. Venerate carries quasi-religious, near-untouchable weight."},
      {w:"ENCOMIUM",     pos:"n",   cluster:"Formal",    def:"A formal speech or writing that praises someone highly; a tribute.",   ex:"The retiring dean received a glowing encomium from each of her former students.",tip:"Encomium = the document or speech itself. Noun only. Spelling: EN-CO-MIUM."},
      {w:"PANEGYRIC",    pos:"n",   cluster:"Formal",    def:"An elaborate, formal public praise — grander than encomium.",          ex:"The senator's panegyric for the war hero lasted forty minutes.",               tip:"Panegyric = grander and more public than encomium. Think state funeral speeches."},
      {w:"EULOGIZE",     pos:"v",   cluster:"Formal",    def:"To praise highly in speech or writing; not exclusively at funerals.",  ex:"The biographer eulogized the architect's career without acknowledging controversies.",tip:"GRE uses eulogize outside funeral contexts — watch for it in RC about biographies."},
      {w:"HAGIOGRAPHY",  pos:"n",   cluster:"Formal",    def:"A biography that idealizes its subject; uncritical, worshipful writing.", ex:"The authorized biography read more like hagiography than honest history.",    tip:"Hagiography = writing about saints. Any excessively worshipful account."},
      {w:"APOTHEOSIS",   pos:"n",   cluster:"Formal",    def:"Elevation to divine status; OR the ultimate perfect example of something.", ex:"The film's final scene represented the apotheosis of the director's career.",tip:"Two GRE uses: (1) glorification to god-like status, (2) the ultimate perfect example."},
      {w:"LIONIZE",      pos:"v",   cluster:"Excessive", def:"To treat someone as a celebrity or hero, often excessively.",          ex:"The media lionized the young athlete before he had won a single major title.",  tip:"Lionize = the public or press elevating someone beyond what they've earned."},
      {w:"ADULATORY",    pos:"adj", cluster:"Excessive", def:"Excessively praising; fawning. Modifies nouns.",                      ex:"The adulatory press coverage embarrassed even the candidate herself.",          tip:"Adulatory modifies nouns — adulatory reviews, adulatory coverage, adulatory tone."},
      {w:"FAWN",         pos:"v",   cluster:"Excessive", def:"To seek favor through excessive flattery; to be servile.",            ex:"The new associate fawned over the senior partner so obviously colleagues cringed.", tip:"Fawn = active behavior — you're doing something sycophantic. Watch for it as a verb."},
      {w:"SYCOPHANT",    pos:"n",   cluster:"Excessive", def:"A person who flatters powerful people to gain favor; a yes-man.",     ex:"The board was surrounded by sycophants who approved every decision.",           tip:"Sycophant = noun for the person. Sycophantic = adjective. Both GRE tested."},
      {w:"OBSEQUIOUS",   pos:"adj", cluster:"Excessive", def:"Excessively eager to please or obey; fawning to a servile degree.",   ex:"His obsequious manner — always agreeing, always complimenting — made him impossible to trust.",tip:"Obsequious is stronger and more negative than sycophantic. Most extreme."},
    ],
  },
  {
    day:5, theme:"Negative Personality Traits", date:"May 7, 2026",
    patterns:[
      "On a whim / impulsive / without warning in the clue = CAPRICIOUS or MERCURIAL",
      "Truculent/bellicose/pugnacious = people only, never policies or decisions",
      "Querulous = habitual complaining only — not defiance, not independence",
      "Intransigent = formal negotiation context · Obdurate = moral hardness",
    ],
    words:[
      {w:"OBSTINATE",    pos:"adj", cluster:"Stubborn",   def:"Stubbornly refusing to change opinion or behavior; pig-headed.",          ex:"His obstinate refusal to see a doctor cost him months of treatable pain.",       tip:"Obstinate = plain stubborn, no extra connotation. The most neutral of the cluster."},
      {w:"OBDURATE",     pos:"adj", cluster:"Stubborn",   def:"Stubbornly refusing to change despite pressure; morally hardened.",        ex:"The obdurate negotiator refused every compromise even as the deal collapsed.",    tip:"OBDURate = OBSTacle that is DURable. Morally hardened. Emotional appeals bounce off."},
      {w:"INTRANSIGENT", pos:"adj", cluster:"Stubborn",   def:"Unwilling to compromise on any point; completely inflexible.",             ex:"The union's intransigent position made any settlement impossible.",              tip:"Intransigent = political/formal stubbornness. Used in negotiation contexts."},
      {w:"RECALCITRANT", pos:"adj", cluster:"Stubborn",   def:"Stubbornly resistant to authority or discipline; defiant.",               ex:"The recalcitrant student refused every attempt at mentorship.",                  tip:"Recalcitrant = stubbornness specifically against authority."},
      {w:"TRUCULENT",    pos:"adj", cluster:"Aggressive", def:"Eager or quick to argue or fight; aggressively defiant.",                  ex:"The truculent witness argued with every question the attorney posed.",           tip:"Truculent = spoiling for a fight. About people — never policies or decisions."},
      {w:"BELLICOSE",    pos:"adj", cluster:"Aggressive", def:"Demonstrating aggression and willingness to fight; war-like.",             ex:"The general's bellicose rhetoric alarmed diplomats hoping for peace.",           tip:"Bellicose = military-flavored aggression. 'Belli' root = war (bellum in Latin)."},
      {w:"PUGNACIOUS",   pos:"adj", cluster:"Aggressive", def:"Eager to argue, quarrel, or fight; combative — loves the fight itself.",   ex:"The pugnacious critic picked fights with every author he reviewed.",            tip:"'Pugn' root = fist. Think pugilist (boxer). Loves the fight itself."},
      {w:"FRACTIOUS",    pos:"adj", cluster:"Aggressive", def:"Irritable and quarrelsome; hard to control in a group setting.",           ex:"The fractious committee couldn't agree on a single agenda item.",              tip:"Fractious = quarrelsome in a group. Often describes committees, crowds, factions."},
      {w:"IRASCIBLE",    pos:"adj", cluster:"Aggressive", def:"Having a hot temper; easily provoked to anger.",                          ex:"The irascible editor snapped at staff for the smallest errors.",                tip:"Irascible = the hair trigger. Anger comes fast and easily."},
      {w:"PETULANT",     pos:"adj", cluster:"Moody",      def:"Childishly sulky or bad-tempered when things don't go their way.",        ex:"The petulant executive stormed out when his proposal was questioned.",          tip:"PETULANT = Pouting. Childish immature tantrum. P = Petulant = childish."},
      {w:"QUERULOUS",    pos:"adj", cluster:"Moody",      def:"Complaining in a whining way; habitually finding fault.",                  ex:"The querulous patient complained about everything from the food to the lighting.",tip:"QUERULOUS = QUERy everything = habitual complaining. Low-level constant dissatisfaction."},
      {w:"CAPRICIOUS",   pos:"adj", cluster:"Moody",      def:"Given to sudden unpredictable changes of mood or behavior; whimsical.",   ex:"The capricious director changed the script so often actors gave up memorizing.",tip:"'On a whim' or 'impulsive' in the clue = CAPRICIOUS. Random impulsive changes."},
      {w:"MERCURIAL",    pos:"adj", cluster:"Moody",      def:"Subject to sudden unpredictable mood changes; volatile but often brilliant.",ex:"Her mercurial temperament made her both thrilling and exhausting to work with.", tip:"Mercurial = brilliant alongside instability. Capricious = random changes (no brilliance implied)."},
      {w:"VOLATILE",     pos:"adj", cluster:"Moody",      def:"Liable to change rapidly and unpredictably, especially for the worse; explosive.", ex:"The volatile political climate made long-term planning nearly impossible.",tip:"Volatile = most extreme instability. Can describe people, situations, or markets."},
      {w:"WAYWARD",      pos:"adj", cluster:"Lone",       def:"Difficult to control; following one's own path against expectation.",      ex:"The wayward student ignored every guideline and somehow produced brilliant work.",tip:"Wayward = going own direction. Less negative than others — sometimes used fondly."},
    ],
  },
  {
    day:6, theme:"Positive Personality Traits", date:"May 8, 2026",
    patterns:[
      "Astute = street smart, reads situations · Perspicacious = analytical perception · Sagacious = elder wisdom",
      "Affable = actively draws people in · Genial = cheerful host warmth · Gregarious = loves groups",
      "Magnanimous = noble spirit (shares glory) · Altruistic = selfless (zero gain) · Philanthropic = organized giving",
      "Munificent = extreme financial liberality — always about money or material gifts",
    ],
    words:[
      {w:"MAGNANIMOUS",  pos:"adj", cluster:"Generous",   def:"Generous and forgiving, especially toward a rival; noble-spirited.",   ex:"The magnanimous victor offered his defeated opponent a handshake and a seat at the table.",tip:"Magnanimous = nobility of spirit from a position of power. Magna root = great."},
      {w:"MUNIFICENT",   pos:"adj", cluster:"Generous",   def:"Larger than expected in generosity; extremely liberal in giving.",     ex:"The munificent donor funded the entire hospital wing without being asked.",       tip:"Munificent = financial generosity specifically. The munus root = gift."},
      {w:"BENEVOLENT",   pos:"adj", cluster:"Generous",   def:"Well-meaning and kindly; desiring good for others.",                  ex:"The benevolent administrator quietly waived fees for students who couldn't afford them.",tip:"Benevolent = good intentions + kind actions. The bene root = good."},
      {w:"ALTRUISTIC",   pos:"adj", cluster:"Generous",   def:"Selflessly concerned with the wellbeing of others; zero personal gain.", ex:"Her altruistic decision to donate her salary surprised everyone.",              tip:"Altruistic = selflessness is the defining feature. No personal gain whatsoever."},
      {w:"PHILANTHROPIC", pos:"adj",cluster:"Generous",   def:"Promoting welfare of others through organized, large-scale giving.",   ex:"The philanthropic foundation funded schools across three continents.",            tip:"Philanthropic = organized, large-scale benevolence. More institutional than altruistic."},
      {w:"INTREPID",     pos:"adj", cluster:"Brave/Wise", def:"Fearless and adventurous; actively moving toward danger.",            ex:"The intrepid journalist filed reports from the front line without flinching.",    tip:"Root: in (not) + trepidus (alarmed) = not alarmed. Active fearlessness."},
      {w:"SAGACIOUS",    pos:"adj", cluster:"Brave/Wise", def:"Having keen mental discernment and good judgment; wise through experience.", ex:"The sagacious investor saw the market crash coming two years early.",         tip:"Sagacious = wise judgment (elder wisdom). Perspicacious = sharp perception (analytical)."},
      {w:"PERSPICACIOUS", pos:"adj",cluster:"Brave/Wise", def:"Having ready insight; seeing what others consistently miss.",         ex:"The perspicacious editor spotted the flaw that three reviewers had missed.",      tip:"Perspicacious SEES · Sagacious DECIDES. Root: perspicere = to see through."},
      {w:"INGENIOUS",    pos:"adj", cluster:"Brave/Wise", def:"Clever, original, and inventive; finding elegant solutions to hard problems.", ex:"The ingenious engineer solved a decade-old problem with a simple design.",  tip:"INGENIOUS = brilliantly clever. INGENUOUS = innocent/naive. One letter. Both GRE tested."},
      {w:"ASTUTE",       pos:"adj", cluster:"Brave/Wise", def:"Accurately assessing situations; practically shrewd in the real world.", ex:"Her astute reading of the political climate helped her avoid every pitfall.",   tip:"Astute = street smart, reads situations. Perspicacious = analytically sharp."},
      {w:"AFFABLE",      pos:"adj", cluster:"Sociable",   def:"Friendly and easy to talk to; actively welcoming to others.",         ex:"The affable professor remembered every student's name and always had time for questions.",tip:"Root: affari = easy to speak to. Affable people actively draw others in."},
      {w:"AMIABLE",      pos:"adj", cluster:"Sociable",   def:"Generally pleasant and likeable; easy to get along with.",            ex:"Her amiable disposition made her the natural choice to lead negotiations.",       tip:"Affable = actively draws people in · Amiable = generally pleasant to be around."},
      {w:"GENIAL",       pos:"adj", cluster:"Sociable",   def:"Friendly, cheerful, and warmly cordial — especially in social/hosting settings.", ex:"The genial host made every guest feel like the most important person in the room.",tip:"Root: genialis = festive, joyful. Genial = cheerful host energy."},
      {w:"GREGARIOUS",   pos:"adj", cluster:"Sociable",   def:"Fond of company; thriving in and energized by groups.",               ex:"The gregarious salesman was energized by crowds while his partner dreaded them.", tip:"Root: grex = flock. Gregarious people need their flock. Opposite of taciturn."},
      {w:"CONVIVIAL",    pos:"adj", cluster:"Sociable",   def:"Fond of feasting, celebration, and good company; festive and lively.", ex:"The convivial atmosphere at the reunion made even shy attendees open up.",       tip:"Root: con + vivere = living together joyfully. Sociable specifically in celebratory settings."},
    ],
  },
  {
    day:7, theme:"Arrogance & Boldness", date:"May 10, 2026",
    patterns:[
      "Hubris = dangerous pride that leads to downfall — always preceded by a fall in GRE",
      "Pompous (self-important manner) vs Bombastic (inflated language specifically)",
      "Audacious (bold + admirable) vs Brazen (bold + shameless/shocking)",
      "Grandiose (extravagant scale) vs Ostentatious (deliberate display to impress)",
    ],
    words:[
      {w:"HUBRIS",       pos:"n",   cluster:"Arrogant", def:"Excessive pride leading to downfall; arrogance that invites punishment.",    ex:"The CEO's hubris — convinced no competitor could touch him — blinded him to collapse.", tip:"In Greek tragedy hubris ALWAYS precedes the fall. GRE uses it this way."},
      {w:"IMPERIOUS",    pos:"adj", cluster:"Arrogant", def:"Assuming power without justification; domineering and arrogant.",            ex:"Her imperious manner — issuing commands rather than requests — alienated every colleague.",tip:"Acts like an emperor when they have NO right to command."},
      {w:"HAUGHTY",      pos:"adj", cluster:"Arrogant", def:"Blatantly and disdainfully proud; looking down on others with contempt.",    ex:"The haughty aristocrat barely acknowledged the staff who served him.",             tip:"The nose is literally in the air. Visible contempt for those below."},
      {w:"SUPERCILIOUS", pos:"adj", cluster:"Arrogant", def:"Behaving as if superior to others; coolly contemptuous.",                   ex:"His supercilious smirk whenever someone disagreed made meetings unbearable.",      tip:"Root: supercilium = eyebrow. The raised eyebrow of contempt."},
      {w:"INSOLENT",     pos:"adj", cluster:"Arrogant", def:"Showing rude and arrogant lack of respect toward superiors.",               ex:"The insolent intern dismissed his manager's feedback with a wave of his hand.",     tip:"Always directed UPWARD — toward someone with authority over you."},
      {w:"VAINGLORIOUS", pos:"adj", cluster:"Arrogant", def:"Excessively proud; boastful with no real substance behind the glory.",      ex:"The vainglorious general claimed sole credit for a victory won by thousands.",      tip:"The glory is EMPTY. Vain = empty. All boast, no substance."},
      {w:"POMPOUS",      pos:"adj", cluster:"Arrogant", def:"Affectedly grand and self-important; inflated sense of dignity.",           ex:"His pompous speech — full of grand pronouncements — bored the audience to tears.",  tip:"Self-important to the point of being ridiculous. Often describes manner or speech."},
      {w:"BOMBASTIC",    pos:"adj", cluster:"Arrogant", def:"High-sounding language with little meaning; inflated and pretentious speech.", ex:"The politician's bombastic rhetoric impressed no one who examined the substance.",tip:"About LANGUAGE specifically — hot air dressed up as important words."},
      {w:"PRETENTIOUS",  pos:"adj", cluster:"Arrogant", def:"Claiming greater importance or merit than actually possessed.",             ex:"The pretentious filmmaker insisted his action movie was high art.",               tip:"The GAP between what you claim and what you've earned."},
      {w:"OSTENTATIOUS", pos:"adj", cluster:"Arrogant", def:"Characterized by excessive display designed to impress others.",            ex:"The ostentatious mansion — gold fixtures, a moat, a helipad — struck visitors as insecure.",tip:"Deliberately showing off wealth or knowledge. DISPLAY is the key word."},
      {w:"AUDACIOUS",    pos:"adj", cluster:"Bold",     def:"Showing willingness to take bold risks; daringly original.",               ex:"The audacious startup challenged three industry giants simultaneously — and won.",   tip:"Boldness that earns ADMIRATION. Usually positive or neutral."},
      {w:"BRAZEN",       pos:"adj", cluster:"Bold",     def:"Bold in a shocking or shameless way; without moral restraint.",            ex:"The brazen thief stole the painting in broad daylight while security watched.",    tip:"Audacious but SHAMELESS. The boldness shocks or offends."},
      {w:"PRESUMPTUOUS", pos:"adj", cluster:"Bold",     def:"Failing to observe proper limits; going beyond what is appropriate.",      ex:"It was presumptuous of the intern to rewrite the senior partner's brief.",         tip:"OVERSTEPPING your position. Assumes permissions you don't have."},
      {w:"GRANDIOSE",    pos:"adj", cluster:"Bold",     def:"Impressively large or elaborate but often lacking substance; extravagantly ambitious.", ex:"His grandiose plans to revolutionize three industries struck investors as delusional.",tip:"Scale WITHOUT substance. Ambition vastly outstrips reality."},
      {w:"MAGNILOQUENT", pos:"adj", cluster:"Bold",     def:"Using high-flown extravagant language; grandly eloquent in a pompous way.", ex:"The magniloquent orator mistook flowery language for genuine insight.",          tip:"Two roots: magna (Day 6) + loqui (Day 1). Great speech = hollow speech."},
    ],
  },
];

// ─── API: GENERATE ADAPTIVE QUESTIONS ─────────────────────────────────────────
async function callAPI(dayNum, weakWords, scores) {
  const allWords = DAYS.slice(0, dayNum).flatMap(d => d.words);
  const currentWords = DAYS[dayNum-1].words;

  const bankLines = allWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');
  const weakNote  = weakWords.length ? `\nPrioritize these words the user struggles with: ${weakWords.slice(0,12).join(', ')}` : '';
  const scoreNote = scores ? `\nUser score context: ${JSON.stringify(scores)}` : '';

  const systemPrompt = `You are an expert GRE Verbal question generator. You create high-quality GRE-style questions.
Return ONLY valid JSON. No markdown, no backticks, no explanation outside the JSON.`;

  const userPrompt = `Generate adaptive GRE Verbal practice questions for Day ${dayNum}.
Current day theme: ${DAYS[dayNum-1].theme}
Current day words (primary focus): ${currentWords.map(w=>w.w).join(', ')}

Full word bank (may also use these for cross-day questions):
${bankLines}
${weakNote}
${scoreNote}

Generate 7 recall drill questions, 3 TC questions, 2 SE questions.

Rules:
- Use ONLY words from the word bank above
- TC questions: use pivot words (despite/although/yet/however) to signal contrast
- TC questions: each blank needs its own independent evidence in the stem
- SE questions: exactly 2 correct answers that produce sentences alike in meaning
- Vary difficulty: mix easy, medium, hard
- Include cross-day questions that combine words from different themes
- Do NOT use the answer word in the stem
- For 1-blank TC: use marker [B1] in stem, 5 options A-E
- For 2-blank TC: use markers [B1] [B2] in stem, 3 options A-C for blank1, D-F for blank2

Return this exact JSON structure:
{
  "drill": [
    {"id": 1, "q": "vivid context clue description", "a": "WORD"}
  ],
  "tc": [
    {
      "id": 1,
      "stem": "The professor was known for being [B1] in public, rarely sharing opinions, yet in private she was surprisingly _______ with close colleagues.",
      "blanks": [
        {
          "label": "Blank 1",
          "answer": "B",
          "opts": [{"l":"A","t":"loquacious"},{"l":"B","t":"reticent"},{"l":"C","t":"garrulous"},{"l":"D","t":"voluble"},{"l":"E","t":"verbose"}]
        }
      ],
      "explain": "RETICENT: The clue 'rarely sharing opinions' points to guarded reticence about a specific topic. Yet signals contrast with the second part."
    }
  ],
  "se": [
    {
      "id": 1,
      "stem": "The politician's speech was criticized for being _______ — three paragraphs of elaborate phrasing that communicated nothing of substance.",
      "answers": ["C","D"],
      "opts": [{"l":"A","t":"laconic"},{"l":"B","t":"pithy"},{"l":"C","t":"verbose"},{"l":"D","t":"prolix"},{"l":"E","t":"terse"},{"l":"F","t":"astute"}],
      "explain": "VERBOSE + PROLIX: Both describe excessive wordiness. 'Three paragraphs communicating nothing' = too many words. Both produce sentences alike in meaning. Laconic/pithy/terse are antonyms."
    }
  ]
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'claude-sonnet-4-20250514',
      max_tokens:1000,
      system: systemPrompt,
      messages:[{role:'user', content: userPrompt}],
    }),
  });

  const data = await res.json();
  const text = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('');
  const clean = text.replace(/```json|```/g,'').trim();
  return JSON.parse(clean);
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const norm = s => s.trim().toUpperCase().replace(/[^A-Z]/g,'');
const chk  = (inp, ans) => norm(inp) === norm(ans);

const clusterColor = cl => {
  const map = {Quiet:C.blue, Loud:'#E4A060', Wordy:'#9B6BDB', Sharp:C.green,
    Gentle:'#4CAF9C', Sharp2:C.gold, Harsh:C.gold, Savage:C.red,
    Liar:C.red, Evader:'#E4A060', Manipulator:'#9B6BDB', Logic:C.blue, Betrayer:C.red, Bonus:C.green,
    Genuine:C.green, Formal:C.blue, Excessive:C.red,
    Stubborn:'#E4A060', Aggressive:C.red, Moody:'#9B6BDB', Lone:C.textMid,
    Generous:C.green, 'Brave/Wise':C.blue, Sociable:'#4CAF9C',
    Arrogant:C.red, Bold:C.gold,
  };
  return map[cl] || C.gold;
};

// ─── STEM RENDERER (handles [B1], [B2], _______ ) ────────────────────────────
function StemRenderer({ stem, blanks, selections, isChecked }) {
  const parts = [];
  let remaining = stem;
  let blankIdx  = 0;

  while (remaining) {
    const b1 = remaining.indexOf('[B1]');
    const b2 = remaining.indexOf('[B2]');
    const us = remaining.search(/_+/);

    const cands = [
      b1>=0 ? {pos:b1, len:4, idx:0} : null,
      b2>=0 ? {pos:b2, len:4, idx:1} : null,
      us>=0 ? {pos:us, len:remaining.match(/_+/)[0].length, idx:blankIdx} : null,
    ].filter(Boolean).sort((a,b)=>a.pos-b.pos);

    if (!cands.length) { parts.push({type:'text', content:remaining}); break; }
    const {pos, len, idx} = cands[0];
    if (pos > 0) parts.push({type:'text', content:remaining.slice(0,pos)});
    parts.push({type:'blank', idx});
    blankIdx = Math.max(blankIdx, idx+1);
    remaining = remaining.slice(pos+len);
  }

  return (
    <p style={{color:C.text, fontSize:15, lineHeight:1.9, marginBottom:16}}>
      {parts.map((p,i) => {
        if (p.type==='text') return <span key={i}>{p.content}</span>;
        const blank   = blanks[p.idx];
        const sel     = selections?.[p.idx];
        const selOpt  = blank?.opts?.find(o=>o.l===sel);
        const correct = isChecked && sel===blank?.answer;
        const wrong   = isChecked && sel && sel!==blank?.answer;
        return (
          <span key={i} style={{
            display:'inline-block',
            background: !isChecked ? C.cardHi : correct ? C.greenBg : wrong ? C.redBg : C.cardHi,
            border:`1px solid ${!isChecked ? C.borderHi : correct ? C.green : wrong ? C.red : C.borderHi}`,
            borderRadius:4, padding:'2px 10px', margin:'0 3px',
            color: correct ? C.greenBr : wrong ? C.red : C.gold,
            fontFamily:'Courier New,monospace', fontWeight:700, fontSize:13,
            transition:'all 0.2s',
          }}>
            {selOpt ? selOpt.t : `_B${p.idx+1}_`}
            {correct && ' ✓'}{wrong && ' ✗'}
          </span>
        );
      })}
    </p>
  );
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
const Tag = ({children, color=C.gold}) => (
  <span style={{fontSize:10, fontWeight:700, letterSpacing:'0.08em', padding:'2px 8px',
    borderRadius:20, background:color+'22', color, border:`1px solid ${color}44`,
    textTransform:'uppercase', whiteSpace:'nowrap'}}>
    {children}
  </span>
);

const Btn = ({children, onClick, variant='primary', disabled, small, style={}}) => {
  const base = {border:'none', cursor:disabled?'not-allowed':'pointer',
    fontFamily:'Georgia,serif', fontWeight:700, letterSpacing:'0.04em',
    borderRadius:6, transition:'all 0.15s',
    padding: small ? '6px 14px' : '10px 22px',
    fontSize: small ? 12 : 13, opacity:disabled?0.4:1, ...style};
  const v = {
    primary:  {background:C.gold,      color:'#07090F'},
    ghost:    {background:'transparent', color:C.textMid, border:`1px solid ${C.border}`},
    danger:   {background:C.red+'22',  color:C.red,    border:`1px solid ${C.red}44`},
    success:  {background:C.green+'22',color:C.greenBr,border:`1px solid ${C.green}44`},
    blue:     {background:C.blue+'22', color:C.blue,   border:`1px solid ${C.blue}44`},
  };
  return <button onClick={disabled?undefined:onClick} style={{...base,...v[variant]}}>{children}</button>;
};

const Card = ({children, style={}}) => (
  <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, ...style}}>
    {children}
  </div>
);

const SecHead = ({label, badge, color=C.gold}) => (
  <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
    <div style={{width:3, height:20, background:color, borderRadius:2}}/>
    <span style={{fontFamily:'Georgia,serif', fontSize:17, fontWeight:700, color:C.text}}>{label}</span>
    {badge && <Tag color={color}>{badge}</Tag>}
  </div>
);

const RInput = ({value, onChange, correct, checked, placeholder}) => (
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||'Your answer...'}
    style={{width:'100%', background: !checked?C.surface:correct?C.greenBg:C.redBg,
      border:`1px solid ${!checked?C.border:correct?C.green:C.red}`,
      borderRadius:6, padding:'8px 12px', color:C.text,
      fontFamily:'Courier New,monospace', fontSize:13, fontWeight:700,
      letterSpacing:'0.1em', outline:'none', textTransform:'uppercase',
      boxSizing:'border-box', transition:'all 0.2s'}}/>
);

// ─── VOCAB VIEW ───────────────────────────────────────────────────────────────
function VocabView({ day, allPrev }) {
  const [expanded, setExpanded]   = useState(null);
  const [showAll, setShowAll]     = useState(false);
  const [clusterFilter, setFilter]= useState('All');

  const displayDay  = DAYS[day-1];
  const prevWords   = DAYS.slice(0, day-1).flatMap(d => d.words);
  const words       = showAll ? [...displayDay.words, ...prevWords] : displayDay.words;
  const clusters    = ['All', ...new Set(words.map(w=>w.cluster))];
  const visible     = clusterFilter==='All' ? words : words.filter(w=>w.cluster===clusterFilter);

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
        <SecHead label={`Day ${day} Vocabulary`} badge={`${displayDay.words.length} words`} color={C.goldBr}/>
        {day > 1 && (
          <Btn small variant={showAll?'blue':'ghost'} onClick={()=>{setShowAll(s=>!s);setFilter('All');}}>
            {showAll ? `Showing all ${words.length} words` : `+ Show all ${words.length} prev days`}
          </Btn>
        )}
      </div>

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:16}}>
        {clusters.map(cl => (
          <button key={cl} onClick={()=>setFilter(cl)} style={{
            padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:700,
            cursor:'pointer', border:'none', transition:'all 0.15s',
            background: clusterFilter===cl ? C.gold : C.surface,
            color: clusterFilter===cl ? '#07090F' : C.textMid,
          }}>{cl}</button>
        ))}
      </div>

      {visible.map(v => {
        const cc = clusterColor(v.cluster);
        const isOpen = expanded===v.w;
        const isToday = displayDay.words.some(w=>w.w===v.w);
        return (
          <div key={v.w} onClick={()=>setExpanded(isOpen?null:v.w)}
            style={{marginBottom:8, cursor:'pointer'}}>
            <Card style={{borderColor:isOpen?cc+'66':C.border,
              background:isOpen?C.cardHi:C.card, transition:'all 0.2s'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:3, height:32, background:cc, borderRadius:2, flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2}}>
                    <span style={{fontFamily:'Courier New,monospace', fontSize:15,
                      fontWeight:700, color:cc, letterSpacing:'0.08em'}}>{v.w}</span>
                    <Tag color={cc}>{v.pos}</Tag>
                    <Tag color={cc}>{v.cluster}</Tag>
                    {!isToday && <Tag color={C.textDim}>Day {DAYS.findIndex(d=>d.words.some(w=>w.w===v.w))+1}</Tag>}
                  </div>
                  {!isOpen && <p style={{color:C.textMid, fontSize:12, margin:0, lineHeight:1.5}}>{v.def}</p>}
                </div>
                <span style={{color:C.textDim, fontSize:14, marginLeft:8}}>{isOpen?'▲':'▼'}</span>
              </div>

              {isOpen && (
                <div style={{marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`}}>
                  <p style={{color:C.text, fontSize:14, lineHeight:1.7, marginBottom:10}}>{v.def}</p>
                  <div style={{background:C.surface, borderRadius:6, padding:12, marginBottom:10}}>
                    <p style={{fontSize:10, color:C.textDim, textTransform:'uppercase',
                      letterSpacing:'0.1em', marginBottom:4}}>Example</p>
                    <p style={{color:C.text, fontSize:13, fontStyle:'italic',
                      lineHeight:1.7, margin:0}}>"{v.ex}"</p>
                  </div>
                  <div style={{background:C.goldDim+'33', borderRadius:6, padding:10,
                    borderLeft:`3px solid ${C.gold}`}}>
                    <span style={{fontSize:10, color:C.gold, fontWeight:700}}>★ GRE TIP  </span>
                    <span style={{color:C.goldBr, fontSize:12, lineHeight:1.6}}>{v.tip}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        );
      })}

      <Card style={{marginTop:16, background:C.surface}}>
        <p style={{fontSize:11, color:C.textDim, textTransform:'uppercase',
          letterSpacing:'0.1em', marginBottom:10}}>Key Patterns — Day {day}</p>
        {displayDay.patterns.map((p,i) => (
          <p key={i} style={{color:C.text, fontSize:13, lineHeight:1.6, marginBottom:6}}>
            <span style={{color:C.gold, marginRight:8}}>→</span>{p}
          </p>
        ))}
      </Card>
    </div>
  );
}

// ─── DRILL SECTION ────────────────────────────────────────────────────────────
function DrillSection({ questions, onComplete }) {
  const [vals, setVals]     = useState(questions.map(()=>''));
  const [checked, setChecked] = useState(false);

  const submit = () => {
    const wrong = questions.filter((q,i)=>!chk(vals[i],q.a)).map(q=>q.a);
    setChecked(true);
    const correct = questions.filter((q,i)=>chk(vals[i],q.a)).length;
    onComplete(correct, questions.length, wrong);
  };

  return (
    <div>
      <SecHead label="Recall Drill" badge={`${questions.length} questions · AI generated`} color={C.goldBr}/>
      <p style={{color:C.textMid, fontSize:12, marginBottom:18, lineHeight:1.6}}>
        These questions were generated based on your performance history and weak words.
        Type the word that best matches each description.
      </p>

      {questions.map((q, i) => {
        const correct = chk(vals[i], q.a);
        return (
          <Card key={q.id} style={{marginBottom:10}}>
            <p style={{color:C.textMid, fontSize:11, marginBottom:4}}>Q{i+1} of {questions.length}</p>
            <p style={{color:C.text, fontSize:14, marginBottom:10, lineHeight:1.6}}>{q.q}</p>
            <RInput value={vals[i]} correct={correct} checked={checked}
              onChange={v=>{const n=[...vals];n[i]=v;setVals(n);}}/>
            {checked && (
              <div style={{marginTop:6}}>
                {correct
                  ? <span style={{color:C.greenBr, fontSize:12, fontWeight:700}}>✓ Correct</span>
                  : <span style={{color:C.textMid, fontSize:12}}>
                      ✗ → <strong style={{color:C.goldBr, fontFamily:'Courier New,monospace'}}>{q.a}</strong>
                    </span>
                }
              </div>
            )}
          </Card>
        );
      })}

      {!checked ? (
        <div style={{textAlign:'right', marginTop:12}}>
          <Btn onClick={submit}>Check Answers →</Btn>
        </div>
      ) : (
        <div style={{textAlign:'right', marginTop:12}}>
          <Btn variant="success" onClick={()=>{}}>
            ✓ {questions.filter((q,i)=>chk(vals[i],q.a)).length}/{questions.length} correct — scroll to TC ↓
          </Btn>
        </div>
      )}
    </div>
  );
}

// ─── TC SECTION ───────────────────────────────────────────────────────────────
function TCSection({ questions, onComplete }) {
  const [qIdx, setQIdx]       = useState(0);
  const [selections, setSel]  = useState(questions.map(q=>q.blanks.map(()=>null)));
  const [checked, setChecked] = useState(questions.map(()=>false));
  const [partScores, setPart] = useState(questions.map(()=>0));
  const [done, setDone]       = useState(false);

  const q   = questions[qIdx];
  const sel = selections[qIdx];
  const isChecked = checked[qIdx];

  const select = (bIdx, l) => {
    if (isChecked) return;
    setSel(s=>{const n=s.map(x=>[...x]);n[qIdx][bIdx]=l;return n;});
  };

  const checkQ = () => {
    const score = q.blanks.filter((b,i)=>sel[i]===b.answer).length;
    setChecked(c=>{const n=[...c];n[qIdx]=true;return n;});
    setPart(p=>{const n=[...p];n[qIdx]=score;return n;});

    const newChecked = checked.map((c,i)=>i===qIdx?true:c);
    if (newChecked.every(Boolean)) {
      const total   = questions.reduce((a,q)=>a+q.blanks.length,0);
      const correct = [...partScores.slice(0,qIdx), score, ...partScores.slice(qIdx+1)].reduce((a,b)=>a+b,0);
      setTimeout(()=>{setDone(true); onComplete(correct, total);}, 400);
    }
  };

  const canCheck = sel.every(s=>s!==null);

  return (
    <div>
      <SecHead label="Text Completion" badge={`${questions.length} questions · AI adaptive`} color={C.blue}/>

      <div style={{display:'flex', gap:8, marginBottom:16}}>
        {questions.map((_,i) => (
          <button key={i} onClick={()=>setQIdx(i)} style={{
            width:36, height:36, borderRadius:6, border:'none', cursor:'pointer',
            fontWeight:700, fontSize:13, transition:'all 0.15s',
            background: i===qIdx?C.blue:checked[i]?C.green+'33':C.surface,
            color: i===qIdx?'#fff':checked[i]?C.greenBr:C.textMid,
          }}>Q{i+1}</button>
        ))}
      </div>

      <Card>
        <p style={{fontSize:11, color:C.textDim, textTransform:'uppercase',
          letterSpacing:'0.1em', marginBottom:14}}>
          ◆ Find the pivot word or clue phrase — then pick each option
        </p>

        <StemRenderer stem={q.stem} blanks={q.blanks} selections={sel} isChecked={isChecked}/>

        {q.blanks.map((blank, bIdx) => (
          <div key={bIdx} style={{marginBottom:14}}>
            <p style={{color:C.textMid, fontSize:12, marginBottom:8, fontWeight:700}}>
              {blank.label}
            </p>
            <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
              {blank.opts.map(opt => {
                const isSel   = sel[bIdx]===opt.l;
                const correct = isChecked && opt.l===blank.answer;
                const wrong   = isChecked && isSel && opt.l!==blank.answer;
                return (
                  <button key={opt.l} onClick={()=>select(bIdx, opt.l)} style={{
                    padding:'8px 16px', borderRadius:6,
                    cursor:isChecked?'default':'pointer',
                    border:`1px solid ${correct?C.green:wrong?C.red:isSel?C.gold:C.border}`,
                    background: correct?C.greenBg:wrong?C.redBg:isSel?C.goldDim+'44':C.surface,
                    color: correct?C.greenBr:wrong?C.red:isSel?C.gold:C.textMid,
                    fontWeight:isSel||correct?700:400, fontSize:13,
                    transition:'all 0.15s', fontFamily:'Courier New,monospace',
                  }}>
                    <span style={{color:C.textDim, marginRight:6}}>{opt.l}.</span>
                    {opt.t}{correct?' ✓':wrong?' ✗':''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {isChecked && (
          <div style={{marginTop:14, background:C.surface, borderRadius:8, padding:14,
            borderLeft:`3px solid ${C.blue}`}}>
            <p style={{fontSize:10, color:C.blue, fontWeight:700, marginBottom:8,
              textTransform:'uppercase', letterSpacing:'0.1em'}}>Explanation</p>
            <p style={{color:C.text, fontSize:13, lineHeight:1.8, margin:0}}>{q.explain}</p>
          </div>
        )}

        <div style={{marginTop:14, display:'flex', justifyContent:'flex-end', gap:10}}>
          {!isChecked && (
            <Btn onClick={checkQ} disabled={!canCheck}>
              {canCheck ? 'Check Answer →' : 'Select all blanks first'}
            </Btn>
          )}
          {isChecked && qIdx < questions.length-1 && (
            <Btn variant="ghost" onClick={()=>setQIdx(i=>i+1)}>Next Question →</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── SE SECTION ───────────────────────────────────────────────────────────────
function SESection({ questions, onComplete }) {
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState(questions.map(()=>[]));
  const [checked, setChecked]   = useState(questions.map(()=>false));
  const [done, setDone]         = useState(false);

  const q   = questions[qIdx];
  const sel = selected[qIdx];
  const isChecked = checked[qIdx];

  const toggle = l => {
    if (isChecked) return;
    setSelected(s=>{
      const n=s.map(x=>[...x]);
      n[qIdx]=n[qIdx].includes(l)?n[qIdx].filter(x=>x!==l):n[qIdx].length<2?[...n[qIdx],l]:n[qIdx];
      return n;
    });
  };

  const checkQ = () => {
    const newChecked = checked.map((c,i)=>i===qIdx?true:c);
    setChecked(newChecked);
    if (newChecked.every(Boolean)) {
      const correct = questions.filter((qq,i)=>{
        const s = i===qIdx ? sel : selected[i];
        return qq.answers.every(a=>s.includes(a)) && s.length===2;
      }).length;
      setTimeout(()=>{setDone(true); onComplete(correct, questions.length);}, 400);
    }
  };

  const optState = l => {
    if (!isChecked) return sel.includes(l)?'selected':'idle';
    if (q.answers.includes(l)) return 'correct';
    if (sel.includes(l) && !q.answers.includes(l)) return 'wrong';
    return 'idle';
  };

  const stStyle = st => {
    if (st==='correct') return {border:`1px solid ${C.green}`, background:C.greenBg, color:C.greenBr};
    if (st==='wrong')   return {border:`1px solid ${C.red}`,   background:C.redBg,   color:C.red};
    if (st==='selected')return {border:`1px solid ${C.gold}`,  background:C.goldDim+'44', color:C.gold};
    return {border:`1px solid ${C.border}`, background:C.surface, color:C.textMid};
  };

  return (
    <div>
      <SecHead label="Sentence Equivalence" badge={`${questions.length} questions · AI adaptive`} color={C.gold}/>

      <div style={{background:C.goldDim+'33', border:`1px solid ${C.goldDim}`,
        borderRadius:8, padding:'10px 14px', marginBottom:16}}>
        <span style={{color:C.gold, fontSize:12, fontWeight:700}}>SE RULE  </span>
        <span style={{color:C.goldBr, fontSize:12}}>
          Select EXACTLY 2 answers. Both must fit AND produce sentences alike in meaning.
          1 answer = 0 points on the real GRE.
        </span>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:16}}>
        {questions.map((_,i) => (
          <button key={i} onClick={()=>setQIdx(i)} style={{
            width:36, height:36, borderRadius:6, border:'none', cursor:'pointer',
            fontWeight:700, fontSize:13, transition:'all 0.15s',
            background: i===qIdx?C.gold:checked[i]?C.green+'33':C.surface,
            color: i===qIdx?'#07090F':checked[i]?C.greenBr:C.textMid,
          }}>Q{i+1}</button>
        ))}
      </div>

      <Card>
        <p style={{color:C.text, fontSize:15, lineHeight:1.9, marginBottom:16}}>{q.stem}</p>
        <p style={{color:C.textMid, fontSize:12, marginBottom:12}}>
          Select 2 words · <strong style={{color:sel.length===2?C.gold:C.textDim}}>{sel.length}/2 chosen</strong>
        </p>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16}}>
          {q.opts.map(opt => {
            const st = optState(opt.l);
            return (
              <button key={opt.l} onClick={()=>toggle(opt.l)} style={{
                padding:'10px 14px', borderRadius:6,
                cursor:isChecked?'default':'pointer',
                textAlign:'left', transition:'all 0.15s',
                fontSize:13, fontFamily:'Courier New,monospace',
                fontWeight:st!=='idle'?700:400, ...stStyle(st),
              }}>
                <span style={{color:C.textDim, marginRight:8}}>{opt.l}.</span>
                {opt.t}
                {st==='correct'&&' ✓'}{st==='wrong'&&' ✗'}
              </button>
            );
          })}
        </div>

        {isChecked && (
          <div style={{background:C.surface, borderRadius:8, padding:14,
            borderLeft:`3px solid ${C.gold}`, marginBottom:12}}>
            <p style={{fontSize:10, color:C.gold, fontWeight:700, marginBottom:8,
              textTransform:'uppercase', letterSpacing:'0.1em'}}>Explanation</p>
            <p style={{color:C.text, fontSize:13, lineHeight:1.8, margin:0,
              whiteSpace:'pre-line'}}>{q.explain}</p>
          </div>
        )}

        <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
          {!isChecked && (
            <Btn onClick={checkQ} disabled={sel.length!==2}>
              {sel.length===2?'Check Answers →':`Need ${2-sel.length} more`}
            </Btn>
          )}
          {isChecked && qIdx < questions.length-1 && (
            <Btn variant="ghost" onClick={()=>setQIdx(i=>i+1)}>Next Question →</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── PRACTICE VIEW (orchestrates drill → TC → SE) ────────────────────────────
function PracticeView({ day, weakWords, onWeakUpdate, onScoreUpdate, dayScores }) {
  const [qs, setQs]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [sectionScores, setSectionScores] = useState({drill:null, tc:null, se:null});

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await callAPI(day, weakWords, dayScores);
      setQs(result);
    } catch(e) {
      setError('Failed to generate questions. Check your connection and try again.');
      console.error(e);
    }
    setLoading(false);
  }, [day, weakWords]);

  const handleDrillComplete = (correct, total, wrongWords) => {
    setSectionScores(s=>({...s, drill:correct}));
    onWeakUpdate(wrongWords);
    onScoreUpdate(day, 'drill', correct, total);
  };

  const handleTCComplete = (correct, total) => {
    setSectionScores(s=>({...s, tc:correct}));
    onScoreUpdate(day, 'tc', correct, total);
  };

  const handleSEComplete = (correct, total) => {
    setSectionScores(s=>({...s, se:correct}));
    onScoreUpdate(day, 'se', correct, total);
  };

  if (loading) return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'60px 20px', gap:16}}>
      <div style={{width:40, height:40, border:`3px solid ${C.border}`,
        borderTop:`3px solid ${C.gold}`, borderRadius:'50%',
        animation:'spin 1s linear infinite'}}/>
      <p style={{color:C.textMid, fontSize:14}}>
        Claude is generating adaptive questions for Day {day}...
      </p>
      <p style={{color:C.textDim, fontSize:12}}>
        Analyzing your weak words · Building cross-day questions · Adjusting difficulty
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{padding:24, textAlign:'center'}}>
      <p style={{color:C.red, marginBottom:16}}>{error}</p>
      <Btn onClick={load}>Try Again</Btn>
    </div>
  );

  if (!qs) return (
    <div style={{padding:40, textAlign:'center'}}>
      <p style={{color:C.textMid, fontSize:14, marginBottom:8}}>
        Questions are generated fresh each session by Claude AI,
      </p>
      <p style={{color:C.textMid, fontSize:13, marginBottom:24}}>
        adapted to your weak words and performance history.
      </p>
      {weakWords.length > 0 && (
        <div style={{background:C.redBg, border:`1px solid ${C.red}44`,
          borderRadius:8, padding:'10px 16px', marginBottom:20, display:'inline-block'}}>
          <p style={{color:C.red, fontSize:12, marginBottom:4, fontWeight:700}}>Words being prioritized:</p>
          <p style={{color:C.textMid, fontSize:11, fontFamily:'Courier New,monospace'}}>
            {weakWords.slice(0,10).join(' · ')}
          </p>
        </div>
      )}
      <div>
        <Btn onClick={load}>Generate Today's Questions ⚡</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:16}}>
        <Btn small variant="ghost" onClick={()=>{setQs(null);setSectionScores({drill:null,tc:null,se:null});}}>
          ↺ Regenerate Questions
        </Btn>
      </div>

      {/* Scores summary bar */}
      {(sectionScores.drill!==null||sectionScores.tc!==null||sectionScores.se!==null) && (
        <div style={{display:'flex', gap:10, marginBottom:20}}>
          {sectionScores.drill!==null&&<Tag color={C.goldBr}>Drill: {sectionScores.drill}/{qs.drill.length}</Tag>}
          {sectionScores.tc!==null&&<Tag color={C.blue}>TC: {sectionScores.tc}/{qs.tc.reduce((a,q)=>a+q.blanks.length,0)}</Tag>}
          {sectionScores.se!==null&&<Tag color={C.green}>SE: {sectionScores.se}/{qs.se.length}</Tag>}
        </div>
      )}

      <div style={{marginBottom:32}}>
        <DrillSection questions={qs.drill} onComplete={handleDrillComplete}/>
      </div>
      <div style={{marginBottom:32}}>
        <TCSection questions={qs.tc} onComplete={handleTCComplete}/>
      </div>
      <div style={{marginBottom:32}}>
        <SESection questions={qs.se} onComplete={handleSEComplete}/>
      </div>
    </div>
  );
}

// ─── SCORE OVERVIEW ───────────────────────────────────────────────────────────
function ScoreOverview({ dayScores, weakWords }) {
  const totalWords = DAYS.reduce((a,d)=>a+d.words.length,0);
  const daysCompleted = Object.values(dayScores).filter(d=>Object.keys(d).length>0).length;

  return (
    <div>
      <SecHead label="Progress Overview" color={C.greenBr}/>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24}}>
        {[
          {label:'Words Learned', val:totalWords, color:C.gold},
          {label:'Days Completed', val:`${daysCompleted}/7`, color:C.blue},
          {label:'Words to Drill', val:weakWords.length, color:weakWords.length>0?C.red:C.green},
        ].map(s=>(
          <Card key={s.label} style={{textAlign:'center'}}>
            <p style={{fontFamily:'Georgia,serif', fontSize:32, fontWeight:700,
              color:s.color, margin:0}}>{s.val}</p>
            <p style={{color:C.textMid, fontSize:12, marginTop:4}}>{s.label}</p>
          </Card>
        ))}
      </div>

      <table style={{width:'100%', borderCollapse:'collapse', marginBottom:20}}>
        <thead>
          <tr>{['Day','Theme','Drill','TC','SE'].map(h=>(
            <th key={h} style={{padding:'8px 10px', textAlign:'left', fontSize:10,
              color:C.textDim, fontWeight:700, letterSpacing:'0.1em',
              textTransform:'uppercase', borderBottom:`1px solid ${C.border}`}}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {DAYS.map((d,i)=>{
            const sc = dayScores[d.day]||{};
            const pct = sc.drill!=null ? Math.round(((sc.drill||0)+(sc.tc||0)+(sc.se||0))/
              ((d.words.length>10?7:7)+(d.blanks||6)+(2))*100) : null;
            return (
              <tr key={d.day} style={{background:i%2===0?'transparent':C.surface+'88'}}>
                <td style={{padding:'10px',color:C.gold,fontWeight:700,fontSize:13}}>D{d.day}</td>
                <td style={{padding:'10px',color:C.text,fontSize:12}}>{d.theme}</td>
                <td style={{padding:'10px',fontFamily:'Courier New,monospace',fontSize:12,
                  color:sc.drill!=null?C.greenBr:C.textDim}}>
                  {sc.drill!=null?`${sc.drill}/7`:'—'}
                </td>
                <td style={{padding:'10px',fontFamily:'Courier New,monospace',fontSize:12,
                  color:sc.tc!=null?C.blue:C.textDim}}>
                  {sc.tc!=null?`${sc.tc}`:('—')}
                </td>
                <td style={{padding:'10px',fontFamily:'Courier New,monospace',fontSize:12,
                  color:sc.se!=null?C.gold:C.textDim}}>
                  {sc.se!=null?`${sc.se}/2`:'—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {weakWords.length > 0 && (
        <Card style={{background:C.redBg, borderColor:C.red+'44'}}>
          <p style={{color:C.red, fontSize:12, fontWeight:700, marginBottom:10,
            textTransform:'uppercase', letterSpacing:'0.1em'}}>
            Words to Keep Drilling ({weakWords.length})
          </p>
          <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
            {weakWords.map(w=>(
              <Tag key={w} color={C.red}>{w}</Tag>
            ))}
          </div>
          <p style={{color:C.textDim, fontSize:11, marginTop:10}}>
            These words will be prioritized in your next practice session.
          </p>
        </Card>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GREApp() {
  const [currentDay, setCurrentDay] = useState(7);
  const [tab, setTab]               = useState('vocab');   // 'vocab' | 'practice'
  const [weakWords, setWeakWords]   = useState([]);
  const [dayScores, setDayScores]   = useState({});

  const totalWords = DAYS.slice(0, currentDay).reduce((a,d)=>a+d.words.length, 0);

  const addWeakWords = useCallback((words) => {
    setWeakWords(prev => {
      const combined = [...new Set([...prev, ...words])];
      return combined.slice(0, 20); // cap at 20
    });
  }, []);

  const updateScore = useCallback((day, section, correct, total) => {
    setDayScores(prev => ({
      ...prev,
      [day]: {...(prev[day]||{}), [section]: correct, [`${section}Total`]: total}
    }));
    // If score is perfect, remove word from weak list
    if (section === 'drill' && correct === total) {
      // Don't clear weak words on TC/SE completions
    }
  }, []);

  const day = DAYS[currentDay-1];

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg,
      minHeight:'100vh', color:C.text, display:'flex', flexDirection:'column'}}>

      {/* ── TOP HEADER ── */}
      <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:'12px 20px', display:'flex', alignItems:'center', gap:16,
        position:'sticky', top:0, zIndex:20}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span style={{fontFamily:'Georgia,serif', fontSize:18, fontWeight:700,
              color:C.gold, letterSpacing:'0.03em'}}>GRE Verbal</span>
            <Tag color={C.gold}>Day {currentDay}</Tag>
            <Tag color={C.blue}>{totalWords} words</Tag>
            {weakWords.length>0 && <Tag color={C.red}>{weakWords.length} weak</Tag>}
          </div>
          <p style={{color:C.textMid, fontSize:11, margin:'2px 0 0'}}>
            {day.theme}  ·  {day.date}  ·  Target: 160 floor · 165 stretch
          </p>
        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center'}}>
          <div style={{width:100, height:5, background:C.border, borderRadius:3, overflow:'hidden'}}>
            <div style={{height:'100%', background:C.gold, borderRadius:3,
              width:`${(currentDay/7)*100}%`, transition:'width 0.4s'}}/>
          </div>
          <span style={{color:C.textDim, fontSize:11}}>Day {currentDay}/7</span>
        </div>
      </div>

      <div style={{display:'flex', flex:1, overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
        <div style={{width:190, borderRight:`1px solid ${C.border}`, padding:'16px 10px',
          overflowY:'auto', flexShrink:0, background:C.surface,
          display:'flex', flexDirection:'column', gap:4}}>

          <p style={{fontSize:10, color:C.textDim, textTransform:'uppercase',
            letterSpacing:'0.1em', marginBottom:8, paddingLeft:8}}>Days</p>

          {DAYS.map(d => {
            const sc = dayScores[d.day];
            const hasSc = sc && Object.keys(sc).length > 0;
            const isCurrent = currentDay===d.day;
            return (
              <button key={d.day} onClick={()=>{setCurrentDay(d.day);setTab('vocab');}} style={{
                width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8,
                border:'none', cursor:'pointer', transition:'all 0.15s',
                background: isCurrent?C.gold:'transparent',
                color: isCurrent?'#07090F':hasSc?C.greenBr:C.textMid,
              }}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{fontSize:13, fontWeight:700, width:20}}>
                    {hasSc?'✓':`D${d.day}`}
                  </span>
                  <div>
                    <p style={{fontSize:11, fontWeight:isCurrent?700:400, margin:0}}>{d.theme}</p>
                    <p style={{fontSize:10, margin:0, opacity:0.7}}>{d.words.length} words</p>
                  </div>
                </div>
              </button>
            );
          })}

          <div style={{marginTop:'auto', paddingTop:16}}>
            <button onClick={()=>{setCurrentDay(0);setTab('overview');}}
              style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8,
                border:'none', cursor:'pointer', transition:'all 0.15s',
                background: currentDay===0?C.green+'33':'transparent',
                color: currentDay===0?C.greenBr:C.textMid}}>
              <span style={{fontSize:13}}>📊  Progress</span>
            </button>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{flex:1, overflow:'auto', padding:'24px 28px 100px'}}>
          {currentDay===0 ? (
            <ScoreOverview dayScores={dayScores} weakWords={weakWords}/>
          ) : (
            <>
              {/* Tab nav */}
              <div style={{display:'flex', gap:8, marginBottom:24,
                borderBottom:`1px solid ${C.border}`, paddingBottom:0}}>
                {[{id:'vocab',label:'📖  Vocabulary'},{id:'practice',label:'⚔️  Practice'}].map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{
                    padding:'10px 20px', border:'none', cursor:'pointer',
                    fontFamily:'Georgia,serif', fontWeight:700, fontSize:13,
                    background:'transparent', transition:'all 0.15s',
                    borderBottom: tab===t.id?`2px solid ${C.gold}`:'2px solid transparent',
                    color: tab===t.id?C.gold:C.textMid,
                    marginBottom:-1,
                  }}>{t.label}</button>
                ))}
              </div>

              {tab==='vocab' && (
                <VocabView day={currentDay} allPrev={DAYS.slice(0,currentDay-1)}/>
              )}
              {tab==='practice' && (
                <PracticeView
                  day={currentDay}
                  weakWords={weakWords}
                  onWeakUpdate={addWeakWords}
                  onScoreUpdate={updateScore}
                  dayScores={dayScores[currentDay]}
                  key={currentDay}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
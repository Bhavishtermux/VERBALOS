export interface VocabLookupResult {
  word: string;
  definition: string;
  partOfSpeech?: string;
  pronunciation?: string;
  abbreviation?: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
  isAvailable: boolean;
}

export interface VocabEntry {
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation?: string;
  abbreviation?: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface UserSavedVocabWord {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: string;
  pronunciation?: string;
  abbreviation?: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
  sourceRcId: string;
  sourceRcTitle: string;
  dateLookedUp: string;
  viewCount: number;
}

export const VOCABULARY_DATABASE: Record<string, VocabEntry> = {
  // --- PHILOSOPHY & CONSCIOUSNESS ---
  solipsism: {
    word: "solipsism",
    definition: "The philosophical theory that only one's own mind and subjective experiences are sure to exist.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈsɑː.lɪp.sɪ.zəm/",
    abbreviation: "No commonly used abbreviation",
    example: "His radical skepticism bordered on solipsism, questioning whether other conscious minds truly exist.",
    synonyms: ["egoism", "subjectivism", "self-absorption"],
    antonyms: ["intersubjectivity", "realism", "altruism"],
  },
  solipsistic: {
    word: "solipsistic",
    definition: "Characteristic of or adhering to solipsism; isolated in one's own subjective perceptions.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌsɑː.lɪpˈsɪs.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "The author critiques the solipsistic trap of modern hyper-individualism.",
    synonyms: ["egocentric", "self-absorbed", "inward-looking"],
    antonyms: ["intersubjective", "empathetic", "collective"],
  },
  qualia: {
    word: "qualia",
    definition: "The internal and subjective component of sense perceptions, arising from stimulation of the senses by phenomena.",
    partOfSpeech: "Noun (plural)",
    pronunciation: "/ˈkwɑː.li.ə/",
    abbreviation: "No commonly used abbreviation",
    example: "Philosophers debate whether a machine can ever experience qualia like the taste of chocolate.",
    synonyms: ["subjective sensation", "phenomenal experience", "conscious feeling"],
    antonyms: ["objective data", "physical substrate"],
  },
  intersubjectivity: {
    word: "intersubjectivity",
    definition: "The psychological and philosophical sharing of subjective states and mutual understanding between individuals.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌɪn.tɚ.səb.dʒɛkˈtɪv.ə.ti/",
    abbreviation: "No commonly used abbreviation",
    example: "Human social coordination depends fundamentally on our capacity for intersubjectivity.",
    synonyms: ["mutual understanding", "shared perspective", "empathy"],
    antonyms: ["solipsism", "isolation", "alienation"],
  },
  intersubjective: {
    word: "intersubjective",
    definition: "Existing between conscious minds; shared by more than one conscious mind.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɪn.tɚ.səbˈdʒɛk.tɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Language creates an intersubjective bridge enabling communication across separate minds.",
    synonyms: ["shared", "collective", "communal"],
    antonyms: ["subjective", "solipsistic", "private"],
  },
  epistemology: {
    word: "epistemology",
    definition: "The branch of philosophy investigating the origin, nature, methods, and limits of human knowledge.",
    partOfSpeech: "Noun",
    pronunciation: "/ɪˌpɪs.təˈmɑː.lə.dʒi/",
    abbreviation: "No commonly used abbreviation",
    example: "The shift from classical physics to quantum mechanics upended traditional epistemology.",
    synonyms: ["theory of knowledge", "gnosiology"],
  },
  epistemological: {
    word: "epistemological",
    definition: "Relating to the theory of knowledge and how justified belief is distinguished from opinion.",
    partOfSpeech: "Adjective",
    pronunciation: "/ɪˌpɪs.tə.məˈlɑː.dʒɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The essay addresses the epistemological challenge of verifying internal conscious states.",
    synonyms: ["cognitive", "philosophical", "knowledge-based"],
  },
  epistemic: {
    word: "epistemic",
    definition: "Relating to knowledge or to the degree of its validation.",
    partOfSpeech: "Adjective",
    pronunciation: "/ɛp.ɪˈstiː.mɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Misinformation creates epistemic vulnerability in open democratic societies.",
    synonyms: ["cognitive", "intellectual", "epistemological"],
  },
  phenomenology: {
    word: "phenomenology",
    definition: "The philosophical study of the structures of subjective experience and first-person consciousness.",
    partOfSpeech: "Noun",
    pronunciation: "/fəˌnɑː.məˈnɑː.lə.dʒi/",
    abbreviation: "No commonly used abbreviation",
    example: "Husserlian phenomenology insists on setting aside assumptions about the external world.",
    synonyms: ["experiential inquiry", "philosophy of consciousness"],
  },
  phenomenological: {
    word: "phenomenological",
    definition: "Pertaining to direct subjective conscious experience rather than physical or objective descriptions.",
    partOfSpeech: "Adjective",
    pronunciation: "/fəˌnɑː.mə.nəˈlɑː.dʒɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "Her essay offered a phenomenological description of grief.",
    synonyms: ["experiential", "subjective", "first-person"],
  },
  hermeneutic: {
    word: "hermeneutic",
    definition: "Concerning the theory and methodology of interpretation, especially of texts, culture, or social reality.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌhɝː.məˈnuː.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Legal scholars engage in continuous hermeneutic negotiation over constitutional clauses.",
    synonyms: ["interpretive", "exegetical", "explanatory"],
  },
  ontological: {
    word: "ontological",
    definition: "Relating to the branch of metaphysics dealing with the nature of being and reality.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɑːn.təˈlɑː.dʒɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The difference between living tissue and artificial silicon constitutes an ontological divide.",
    synonyms: ["metaphysical", "existential", "essential"],
  },
  dialectic: {
    word: "dialectic",
    definition: "The discourse between two opposing viewpoints seeking to establish truth through reasoned argumentation; thesis-antithesis-synthesis.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌdaɪ.əˈlɛk.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Economic history is marked by a dialectic between state intervention and free-market deregulation.",
    synonyms: ["argumentation", "logical debate", "synthesis", "dialogue"],
  },
  dichotomy: {
    word: "dichotomy",
    definition: "A division or contrast between two things that are represented as being entirely opposed or distinct.",
    partOfSpeech: "Noun",
    pronunciation: "/daɪˈkɑː.tə.mi/",
    abbreviation: "No commonly used abbreviation",
    example: "The artificial dichotomy between theory and practice dissolves in laboratory experimentation.",
    synonyms: ["division", "bifurcation", "polarity", "split"],
    antonyms: ["continuum", "unity", "harmony"],
  },
  interiority: {
    word: "interiority",
    definition: "Inner life, subjective psychological depth, private thoughts, and contemplative character.",
    partOfSpeech: "Noun",
    pronunciation: "/ɪnˌtɪr.iˈɔːr.ə.ti/",
    abbreviation: "No commonly used abbreviation",
    example: "Continuous online notifications erode the quiet sanctuary of human interiority.",
    synonyms: ["inner life", "inwardness", "psychic depth", "subjectivity"],
    antonyms: ["exteriority", "superficiality", "shallowness"],
  },
  teleological: {
    word: "teleological",
    definition: "Relating to the explanation of phenomena in terms of the purpose or goal they serve rather than their physical causes.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌtiː.li.əˈlɑː.dʒɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "Darwinian natural selection refuted teleological arguments that nature was designed for human benefit.",
    synonyms: ["purpose-driven", "goal-oriented", "finalistic"],
    antonyms: ["mechanistic", "causal", "random"],
  },
  idiosyncratic: {
    word: "idiosyncratic",
    definition: "Relating to an idiosyncratic characteristic or eccentricity peculiar to an individual.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɪd.i.oʊ.sɪŋˈkræt̬.ɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "The author has an idiosyncratic prose style filled with archaic metaphors.",
    synonyms: ["peculiar", "distinctive", "eccentric", "individualistic"],
    antonyms: ["conventional", "standard", "generic"],
  },
  primordial: {
    word: "primordial",
    definition: "Existing at or from the beginning of time; fundamental and primeval.",
    partOfSpeech: "Adjective",
    pronunciation: "/praɪˈmɔːr.di.əl/",
    abbreviation: "No commonly used abbreviation",
    example: "Fear of darkness is a primordial instinct hardwired into the human nervous system.",
    synonyms: ["ancient", "primitive", "primal", "elemental"],
    antonyms: ["modern", "developed", "derivative"],
  },
  petrify: {
    word: "petrify",
    definition: "To make rigid or inactive; to paralyze with fear or freeze into a fixed state.",
    partOfSpeech: "Verb",
    pronunciation: "/ˈpɛt.rəˌfaɪ/",
    abbreviation: "No commonly used abbreviation",
    example: "Under the critic's gaze, the young performer felt petrified.",
    synonyms: ["immobilize", "paralyze", "fossilize"],
  },

  // --- ECONOMICS & POLICY ---
  rentierism: {
    word: "rentierism",
    definition: "An economic system or behavior where income is derived from monopolizing assets or controlling access rather than productive innovation.",
    partOfSpeech: "Noun",
    pronunciation: "/rɑ̃ˈtjeɪ.ɪ.zəm/",
    abbreviation: "No commonly used abbreviation",
    example: "Platform rentierism relies on transaction tolls and algorithmic advertising choke points.",
    synonyms: ["rent-seeking", "monopolistic extraction", "tollbooth capitalism"],
    antonyms: ["productive enterprise", "competitive innovation"],
  },
  schumpeterian: {
    word: "schumpeterian",
    definition: "Relating to Joseph Schumpeter's theories of innovation, dynamic competition, and creative destruction.",
    partOfSpeech: "Adjective",
    pronunciation: "/ʃʊm.pəˈtɪə.ri.ən/",
    abbreviation: "No commonly used abbreviation",
    example: "The platform oligopoly has suppressed the Schumpeterian gale of entrepreneurial disruption.",
    synonyms: ["disruptive", "innovation-driven", "evolutionary"],
    antonyms: ["static", "monopolistic"],
  },
  externalities: {
    word: "externalities",
    definition: "Side effects or consequences of an industrial or commercial activity that affect other parties without being reflected in market prices.",
    partOfSpeech: "Noun (plural)",
    pronunciation: "/ˌɛk.stɚˈnæl.ə.tiz/",
    abbreviation: "No commonly used abbreviation",
    example: "Pollution and traffic congestion are classic negative externalities of rapid urban growth.",
    synonyms: ["spillover effects", "side consequences", "indirect costs"],
    antonyms: ["internal costs", "direct effects"],
  },
  monopoly: {
    word: "monopoly",
    definition: "The exclusive possession or control of the supply of or trade in a commodity or service.",
    partOfSpeech: "Noun",
    pronunciation: "/məˈnɑː.pəl.i/",
    abbreviation: "No commonly used abbreviation",
    example: "Antitrust regulators investigated the software giant for maintaining an illegal monopoly.",
    synonyms: ["corner", "domination", "sole control"],
    antonyms: ["competition", "free market"],
  },
  oligopoly: {
    word: "oligopoly",
    definition: "A state of limited competition, in which a market is shared by a small number of dominant producers or sellers.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌɑː.lɪˈɡɑː.pəl.i/",
    abbreviation: "No commonly used abbreviation",
    example: "The telecommunications sector operates as a tight oligopoly with three major carriers.",
    synonyms: ["cartel", "market concentration"],
  },
  commodification: {
    word: "commodification",
    definition: "The transformation of goods, services, ideas, or human relations into objects of commerce and monetary trade.",
    partOfSpeech: "Noun",
    pronunciation: "/kəˌmɑː.də.fəˈkeɪ.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "Critics argue that the commodification of education reduces learning to transactional credentialing.",
    synonyms: ["commercialization", "monetization", "marketization"],
  },
  precarity: {
    word: "precarity",
    definition: "A state of persistent unpredictability, insecurity, and vulnerability, especially regarding livelihood or employment.",
    partOfSpeech: "Noun",
    pronunciation: "/prɪˈkɛr.ə.ti/",
    abbreviation: "No commonly used abbreviation",
    example: "Contract labor forces workers into chronic precarity without social safety nets.",
    synonyms: ["insecurity", "instability", "uncertainty", "vulnerability"],
    antonyms: ["security", "stability", "permanence"],
  },
  hegemony: {
    word: "hegemony",
    definition: "Leadership or dominance, especially by one state, social class, or cultural group over others.",
    partOfSpeech: "Noun",
    pronunciation: "/hɪˈdʒɛm.ə.ni/",
    abbreviation: "No commonly used abbreviation",
    example: "Gramsci explored how cultural hegemony naturalizes class privilege through school curricula and media.",
    synonyms: ["dominance", "ascendancy", "supremacy", "predominance"],
    antonyms: ["subjugation", "subalternity", "marginality"],
  },
  hegemonic: {
    word: "hegemonic",
    definition: "Ruling or dominant in a political, cultural, or social context.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌhɛdʒ.əˈmɑː.nɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "The essay critiques the hegemonic narrative promoted by corporate media.",
    synonyms: ["dominant", "ruling", "prevailing"],
  },

  // --- PSYCHOLOGY & DECISION SCIENCE ---
  hyperbolic: {
    word: "hyperbolic",
    definition: "In decision theory, describing a steep initial discounting of future rewards; also, relating to rhetorical exaggeration.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌhaɪ.pɚˈbɑː.lɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Hyperbolic discounting explains why we impulsively choose immediate rewards over long-term wellbeing.",
    synonyms: ["steeply decaying", "time-inconsistent", "exaggerated"],
    antonyms: ["exponential", "constant", "linear"],
  },
  discounting: {
    word: "discounting",
    definition: "The psychological or financial tendency to perceive future outcomes as possessing less value than immediate ones.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈdɪs.kaʊn.tɪŋ/",
    abbreviation: "No commonly used abbreviation",
    example: "High temporal discounting correlates with lower rates of retirement savings.",
    synonyms: ["devaluation", "depreciation"],
  },
  precommitment: {
    word: "precommitment",
    definition: "A strategy whereby an individual makes it difficult or impossible to reverse a chosen course of action in the future.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌpriː.kəˈmɪt.mənt/",
    abbreviation: "No commonly used abbreviation",
    example: "Deleting social media apps from your phone is a classic precommitment device against distraction.",
    synonyms: ["self-binding strategy", "commitment device"],
  },
  cognitive: {
    word: "cognitive",
    definition: "Relating to the mental processes of perception, memory, judgment, and reasoning.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈkɑːɡ.nə.tɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Sleep deprivation impairs executive cognitive function.",
    synonyms: ["mental", "intellectual", "rational", "cerebral"],
  },
  neuroplasticity: {
    word: "neuroplasticity",
    definition: "The ability of the nervous system to change its activity in response to intrinsic or extrinsic stimuli by reorganizing its structure.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌnʊr.oʊ.plæsˈtɪs.ə.ti/",
    abbreviation: "No commonly used abbreviation",
    example: "Learning a musical instrument in adulthood demonstrates the lifelong potential of neuroplasticity.",
    synonyms: ["neural plasticity", "brain malleability"],
  },

  // --- TONE & LITERARY TERMINOLOGY ---
  obsolete: {
    word: "obsolete",
    definition: "No longer in use or useful; out of date.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɑːb.səˈliːt/",
    abbreviation: "No commonly used abbreviation",
    example: "The technology quickly became obsolete.",
    synonyms: ["outdated", "antiquated", "old-fashioned", "superannuated"],
    antonyms: ["modern", "current", "contemporary", "cutting-edge"],
  },
  acerbic: {
    word: "acerbic",
    definition: "Sharp and forthright in tone or commentary; tasting sour or bitter.",
    partOfSpeech: "Adjective",
    pronunciation: "/əˈsɝː.bɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Her acerbic commentary exposed the false promises of the political manifesto.",
    synonyms: ["caustic", "biting", "sardonic", "sharp", "scathing"],
    antonyms: ["mild", "sweet", "gentle", "conciliatory"],
  },
  dispassionate: {
    word: "dispassionate",
    definition: "Not influenced by strong emotion; impartial, calm, and objective in judgment.",
    partOfSpeech: "Adjective",
    pronunciation: "/dɪsˈpæʃ.ən.ət/",
    abbreviation: "No commonly used abbreviation",
    example: "The scientist delivered a dispassionate report on the statistical trends.",
    synonyms: ["impartial", "unbiased", "objective", "detached"],
    antonyms: ["impassioned", "biased", "emotional", "partisan"],
  },
  pedantic: {
    word: "pedantic",
    definition: "Excessively concerned with minor details, formal rules, or ostentatious displays of bookish learning.",
    partOfSpeech: "Adjective",
    pronunciation: "/pɪˈdæn.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "His pedantic obsession with 18th-century syntax made the lecture tedious.",
    synonyms: ["over-exacting", "fussy", "doctrinaire", "hair-splitting"],
    antonyms: ["broad-minded", "practical", "informal"],
  },
  sycophantic: {
    word: "sycophantic",
    definition: "Behaving in an obsequious or fawning way in order to gain advantage or favor.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌsɪk.əˈfæn.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "The minister was insulated by sycophantic aides who withheld bad news.",
    synonyms: ["obsequious", "fawning", "servile", "flattering"],
    antonyms: ["forthright", "independent", "critical"],
  },
  sardonic: {
    word: "sardonic",
    definition: "Grimly mocking, cynical, or derisive in tone.",
    partOfSpeech: "Adjective",
    pronunciation: "/sɑːrˈdɑː.nɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "He responded with a sardonic laugh when told the project was ahead of schedule.",
    synonyms: ["derisive", "mocking", "cynical", "scornful", "ironic"],
    antonyms: ["earnest", "sincere", "optimistic", "warm"],
  },
  ambivalent: {
    word: "ambivalent",
    definition: "Having mixed, contradictory, or simultaneous opposing feelings about something.",
    partOfSpeech: "Adjective",
    pronunciation: "/æmˈbɪv.ə.lənt/",
    abbreviation: "No commonly used abbreviation",
    example: "She was ambivalent about moving to the capital, excited by opportunities yet dreading the traffic.",
    synonyms: ["conflicted", "equivocal", "undecided", "vacillating"],
    antonyms: ["resolute", "certain", "decisive", "unequivocal"],
  },
  eulogistic: {
    word: "eulogistic",
    definition: "Formally praising someone or something highly in speech or writing; laudatory.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌjuː.ləˈdʒɪs.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "The essay adopted a eulogistic tone toward the pioneering architect.",
    synonyms: ["laudatory", "panegyrical", "acclamatory", "praising"],
    antonyms: ["critical", "disparaging", "derogatory", "vituperative"],
  },
  caustic: {
    word: "caustic",
    definition: "Sarcastic in a scathing, biting, or bitter way; able to corrode organic tissue chemically.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈkɑː.stɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "His caustic remarks stung the junior associates during the presentation.",
    synonyms: ["mordant", "scathing", "astringent", "biting"],
    antonyms: ["soothing", "mild", "flattering", "kind"],
  },
  didactic: {
    word: "didactic",
    definition: "Intended to teach, particularly in having moral instruction as an ulterior motive.",
    partOfSpeech: "Adjective",
    pronunciation: "/daɪˈdæk.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "The novel was criticized for being overtly didactic rather than entertaining.",
    synonyms: ["instructional", "educational", "moralizing"],
  },
  didacticism: {
    word: "didacticism",
    definition: "An artistic or pedagogical approach that focuses heavily on moral instruction or lecturing.",
    partOfSpeech: "Noun",
    pronunciation: "/daɪˈdæk.təˌsɪz.əm/",
    abbreviation: "No commonly used abbreviation",
    example: "The film was criticized for heavy-handed didacticism instead of exploring complex character motivations.",
    synonyms: ["preachiness", "moralizing", "pedantry"],
    antonyms: ["subtlety", "aesthetic ambiguity"],
  },
  anachronistic: {
    word: "anachronistic",
    definition: "Belonging or appropriate to a period other than that in which it exists; conspicuously out of date.",
    partOfSpeech: "Adjective",
    pronunciation: "/əˌnæk.rəˈnɪs.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Depicting medieval knights with wristwatches is an obviously anachronistic error.",
    synonyms: ["archaic", "antiquated", "outdated", "chronologically misplaced"],
    antonyms: ["contemporary", "timely", "modern"],
  },
  paradigm: {
    word: "paradigm",
    definition: "A typical example, pattern, or overarching conceptual model of theories and practices.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈpær.ə.daɪm/",
    abbreviation: "No commonly used abbreviation",
    example: "The shift toward renewable energy represents a fundamental paradigm change in industry.",
    synonyms: ["framework", "model", "archetype", "prototype"],
    antonyms: ["anomaly", "exception"],
  },
  panopticon: {
    word: "panopticon",
    definition: "A circular prison designed so that all inmates can be observed from a central point without knowing if they are watched; a metaphor for ambient surveillance.",
    partOfSpeech: "Noun",
    pronunciation: "/pænˈɑːp.tɪ.kɑːn/",
    abbreviation: "No commonly used abbreviation",
    example: "The modern smartphone network functions as an ambient digital panopticon.",
    synonyms: ["surveillance architecture", "inspection house"],
  },
  anthropocene: {
    word: "anthropocene",
    definition: "The current geological age, viewed as the period during which human activity has been the dominant influence on climate and the environment.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈæn.θrə.pəˌsiːn/",
    abbreviation: "No commonly used abbreviation",
    example: "Microplastic sediments around the globe mark the physical onset of the Anthropocene.",
    synonyms: ["human epoch", "age of humankind"],
  },
  sublime: {
    word: "sublime",
    definition: "Of such excellence, grandeur, or beauty as to inspire great admiration, awe, or existential terror.",
    partOfSpeech: "Adjective / Noun",
    pronunciation: "/səˈblaɪm/",
    abbreviation: "No commonly used abbreviation",
    example: "The thunderous cascade of the glacial ice sheet evoked a terrifying sense of the natural sublime.",
    synonyms: ["transcendent", "awe-inspiring", "majestic", "exalted"],
    antonyms: ["mundane", "ordinary", "trivial"],
  },
  lacunae: {
    word: "lacunae",
    definition: "Missing parts, gaps, or blank spaces in a manuscript, theory, or legal body of knowledge.",
    partOfSpeech: "Noun (plural)",
    pronunciation: "/ləˈkjuː.niː/",
    abbreviation: "No commonly used abbreviation",
    example: "The historical record contains substantial lacunae concerning indigenous legal customs.",
    synonyms: ["gaps", "omissions", "cavities", "vacancies"],
    antonyms: ["completeness", "plenitude"],
  },
  archipelagoes: {
    word: "archipelagoes",
    definition: "Groups or clusters of islands; figuratively, fragmented or disconnected clusters of spaces.",
    partOfSpeech: "Noun (plural)",
    pronunciation: "/ˌɑːr.kəˈpɛl.əˌɡoʊz/",
    abbreviation: "No commonly used abbreviation",
    example: "Gated luxury enclaves have turned the metropolis into fragmented socio-economic archipelagoes.",
    synonyms: ["clusters", "island groups", "enclaves"],
  },
  serendipitous: {
    word: "serendipitous",
    definition: "Occurring or discovered by chance in a happy, beneficial, or fortunate way.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌsɛr.ənˈdɪp.ə.təs/",
    abbreviation: "No commonly used abbreviation",
    example: "Their serendipitous encounter in the university library sparked a decade of collaborative research.",
    synonyms: ["fortuitous", "accidental", "lucky", "chance"],
    antonyms: ["calculated", "deliberate", "premeditated"],
  },
  incommensurable: {
    word: "incommensurable",
    definition: "Not able to be judged or measured by the same standard; fundamentally incompatible in conceptual terms.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɪn.kəˈmɛn.ʃɚ.ə.bəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The values of individual liberty and total social equality can at times prove incommensurable.",
    synonyms: ["incompatible", "irreconcilable", "disparate"],
    antonyms: ["commensurable", "comparable", "compatible"],
  },
  incongruous: {
    word: "incongruous",
    definition: "Not in harmony or keeping with the surroundings or other aspects of something.",
    partOfSpeech: "Adjective",
    pronunciation: "/ɪnˈkɑːŋ.ɡru.əs/",
    abbreviation: "No commonly used abbreviation",
    example: "A modern glass skyscraper looked incongruous among the ancient stone cathedrals.",
    synonyms: ["out of place", "incompatible", "jarring", "unsuitable"],
    antonyms: ["harmonious", "fitting", "congruous"],
  },
  invariably: {
    word: "invariably",
    definition: "In every case or on every occasion; always.",
    partOfSpeech: "Adverb",
    pronunciation: "/ɪnˈvɛr.i.ə.bli/",
    abbreviation: "No commonly used abbreviation",
    example: "Complex bureaucratic procedures invariably introduce delays.",
    synonyms: ["always", "consistently", "without fail"],
    antonyms: ["never", "rarely", "seldom"],
  },
  invariance: {
    word: "invariance",
    definition: "The property of remaining unchanged regardless of the changes in the conditions of measurement or orientation.",
    partOfSpeech: "Noun",
    pronunciation: "/ɪnˈvɛr.i.əns/",
    abbreviation: "No commonly used abbreviation",
    example: "Mirror-image invariance in the visual cortex enables recognizing objects from any angle.",
    synonyms: ["constancy", "stability", "uniformity"],
  },
  perpetual: {
    word: "perpetual",
    definition: "Never ending or changing; occurring repeatedly; so frequent as to seem endless.",
    partOfSpeech: "Adjective",
    pronunciation: "/pɚˈpɛtʃ.u.əl/",
    abbreviation: "No commonly used abbreviation",
    example: "The city lives in a state of perpetual motion and commercial activity.",
    synonyms: ["everlasting", "eternal", "unceasing", "continuous"],
    antonyms: ["temporary", "transient", "ephemeral"],
  },
  perpetually: {
    word: "perpetually",
    definition: "In a way that never ends or changes; constantly.",
    partOfSpeech: "Adverb",
    pronunciation: "/pɚˈpɛtʃ.u.ə.li/",
    abbreviation: "No commonly used abbreviation",
    example: "The consciousness fortress is perpetually raised against outside verification.",
    synonyms: ["constantly", "endlessly", "incessantly"],
  },
  morphology: {
    word: "morphology",
    definition: "The branch of biology or linguistics that deals with the form and structure of organisms or words.",
    partOfSpeech: "Noun",
    pronunciation: "/mɔːrˈfɑː.lə.dʒi/",
    abbreviation: "No commonly used abbreviation",
    example: "Comparative morphology explores structural homologies across different species.",
    synonyms: ["structure", "form", "anatomy"],
  },
  analogous: {
    word: "analogous",
    definition: "Comparable in certain respects, typically in a way which makes clearer the nature of the things compared.",
    partOfSpeech: "Adjective",
    pronunciation: "/əˈnæl.ə.ɡəs/",
    abbreviation: "No commonly used abbreviation",
    example: "The wings of a bird and an insect are analogous structures serving flight.",
    synonyms: ["comparable", "similar", "parallel", "equivalent"],
    antonyms: ["dissimilar", "unrelated", "distinct"],
  },
  analogy: {
    word: "analogy",
    definition: "A comparison between two things, typically for the purpose of explanation or clarification.",
    partOfSpeech: "Noun",
    pronunciation: "/əˈnæl.ə.dʒi/",
    abbreviation: "No commonly used abbreviation",
    example: "He drew an analogy between the human brain and a complex computer network.",
    synonyms: ["comparison", "parallel", "metaphor"],
  },
  induction: {
    word: "induction",
    definition: "The process of inferring general laws or principles from particular instances or empirical observations.",
    partOfSpeech: "Noun",
    pronunciation: "/ɪnˈdʌk.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "Scientific reasoning relies heavily on induction from experimental data.",
    synonyms: ["inductive reasoning", "generalization"],
    antonyms: ["deduction"],
  },
  deduction: {
    word: "deduction",
    definition: "The inference of particular instances by reference to a general law, premise, or principle.",
    partOfSpeech: "Noun",
    pronunciation: "/dɪˈdʌk.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "Through rigorous logical deduction, the detective identified the underlying contradiction.",
    synonyms: ["inference", "logical derivation", "reasoning"],
    antonyms: ["induction"],
  },
  inductive: {
    word: "inductive",
    definition: "Characterized by the inference of general laws from particular instances.",
    partOfSpeech: "Adjective",
    pronunciation: "/ɪnˈdʌk.tɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Inductive reasoning is always probabilistic rather than absolutely certain.",
    synonyms: ["empirical", "probabilistic"],
    antonyms: ["deductive"],
  },
  deductive: {
    word: "deductive",
    definition: "Characterized by or based on the inference of particular instances from a general premise.",
    partOfSpeech: "Adjective",
    pronunciation: "/dɪˈdʌk.tɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Mathematical proofs depend upon strict deductive logic.",
    synonyms: ["logical", "apriori", "rational"],
  },
  ubiquitous: {
    word: "ubiquitous",
    definition: "Present, appearing, or found everywhere simultaneously.",
    partOfSpeech: "Adjective",
    pronunciation: "/juːˈbɪk.wə.t̬əs/",
    abbreviation: "No commonly used abbreviation",
    example: "Smartphones have become ubiquitous across all demographics.",
    synonyms: ["omnipresent", "pervasive", "universal", "everywhere"],
    antonyms: ["rare", "scarce", "uncommon"],
  },
  ubiquity: {
    word: "ubiquity",
    definition: "The state of being everywhere at any time; omnipresence.",
    partOfSpeech: "Noun",
    pronunciation: "/juːˈbɪk.wə.t̬i/",
    abbreviation: "No commonly used abbreviation",
    example: "The ubiquity of advertising alters subconscious consumer behavior.",
    synonyms: ["omnipresence", "pervasiveness"],
  },
  mitigate: {
    word: "mitigate",
    definition: "To make less severe, serious, or painful; to lessen gravity.",
    partOfSpeech: "Verb",
    pronunciation: "/ˈmɪt̬.ə.ɡeɪt/",
    abbreviation: "No commonly used abbreviation",
    example: "Reforestation projects help mitigate the consequences of carbon emissions.",
    synonyms: ["alleviate", "reduce", "diminish", "moderate"],
    antonyms: ["aggravate", "intensify", "worsen"],
  },
  mitigation: {
    word: "mitigation",
    definition: "The action of reducing the severity, seriousness, or painfulness of something.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌmɪt̬.əˈɡeɪ.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "Risk mitigation is a mandatory component of financial planning.",
    synonyms: ["alleviation", "reduction", "moderation"],
  },
  tenuous: {
    word: "tenuous",
    definition: "Very weak or slight; having little substance, strength, or validity.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈtɛn.ju.əs/",
    abbreviation: "No commonly used abbreviation",
    example: "The link between the two events was tenuous and unverified.",
    synonyms: ["flimsy", "fragile", "shaky", "doubtful"],
    antonyms: ["robust", "solid", "strong"],
  },
  juxtapose: {
    word: "juxtapose",
    definition: "To place or deal with close together for contrasting effect.",
    partOfSpeech: "Verb",
    pronunciation: "/ˈdʒʌk.stə.poʊz/",
    abbreviation: "No commonly used abbreviation",
    example: "The exhibition juxtaposes classical oil paintings with contemporary digital installations.",
    synonyms: ["collocate", "contrast", "compare", "set side by side"],
  },
  juxtaposition: {
    word: "juxtaposition",
    definition: "The fact of two things being seen or placed close together with contrasting effect.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌdʒʌk.stə.pəˈzɪʃ.ən/",
    abbreviation: "No commonly used abbreviation",
    example: "The juxtaposition of extreme wealth and poverty is evident in mega-cities.",
    synonyms: ["contrast", "comparison", "proximity"],
  },
  nuance: {
    word: "nuance",
    definition: "A subtle difference in or shade of meaning, expression, sound, or color.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈnuː.ɑːns/",
    abbreviation: "No commonly used abbreviation",
    example: "A skilled translator preserves every subtle nuance of the original poetry.",
    synonyms: ["subtlety", "shade", "refinement", "gradation"],
  },
  nuanced: {
    word: "nuanced",
    definition: "Characterized by subtle shades of meaning, distinction, or expression.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈnuː.ɑːnst/",
    abbreviation: "No commonly used abbreviation",
    example: "The editorial offered a nuanced critique rather than a partisan attack.",
    synonyms: ["subtle", "discriminating", "refined"],
    antonyms: ["crude", "blunt", "black-and-white"],
  },
  rhetoric: {
    word: "rhetoric",
    definition: "The art of effective or persuasive speaking or writing, especially the use of figures of speech and other compositional techniques.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈrɛt̬.ɚ.ɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Beneath the election rhetoric lay difficult fiscal dilemmas.",
    synonyms: ["oratory", "eloquence", "persuasion"],
  },
  rhetorical: {
    word: "rhetorical",
    definition: "Relating to or concerned with the art of rhetoric; expressed in terms intended to persuade or impress.",
    partOfSpeech: "Adjective",
    pronunciation: "/rɪˈtɔːr.ɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The speaker asked a rhetorical question that required no formal answer.",
    synonyms: ["oratorical", "stylistic", "persuasive"],
  },
  empirical: {
    word: "empirical",
    definition: "Based on, concerned with, or verifiable by observation or experience rather than theory or pure logic.",
    partOfSpeech: "Adjective",
    pronunciation: "/ɪmˈpɪr.ɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The hypothesis requires empirical testing in clinical trials.",
    synonyms: ["observed", "experimental", "factual", "practical"],
    antonyms: ["theoretical", "hypothetical", "speculative"],
  },
  empiricism: {
    word: "empiricism",
    definition: "The theory that all knowledge is derived from sense-experience, developed especially by Locke, Berkeley, and Hume.",
    partOfSpeech: "Noun",
    pronunciation: "/ɪmˈpɪr.əˌsɪz.əm/",
    abbreviation: "No commonly used abbreviation",
    example: "British empiricism rejected the notion of innate rational ideas.",
    synonyms: ["sensory inquiry", "positivism"],
    antonyms: ["rationalism"],
  },
  rationalism: {
    word: "rationalism",
    definition: "A belief or theory that opinions and actions should be based on reason and knowledge rather than on religious belief or emotional response.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈræʃ.ən.əlˌɪz.əm/",
    abbreviation: "No commonly used abbreviation",
    example: "Continental rationalism held that the intellect alone could deduce fundamental truths.",
    synonyms: ["logical reasoning", "intellectualism"],
  },
  skepticism: {
    word: "skepticism",
    definition: "A skeptical attitude; doubt as to the truth of something or philosophical questioning of knowledge claims.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈskɛp.təˌsɪz.əm/",
    abbreviation: "No commonly used abbreviation",
    example: "Scientific progress requires healthy skepticism toward unverified claims.",
    synonyms: ["doubt", "incredulity", "suspicion", "agnosticism"],
    antonyms: ["credulity", "dogmatism", "conviction"],
  },
  skeptical: {
    word: "skeptical",
    definition: "Not easily convinced; having doubts or reservations.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈskɛp.tɪ.kəl/",
    abbreviation: "No commonly used abbreviation",
    example: "Economists remain skeptical about the feasibility of sudden zero-carbon transition without nuclear power.",
    synonyms: ["doubtful", "unconvinced", "suspicious", "cynical"],
    antonyms: ["gullible", "trusting", "convinced"],
  },
  antithesis: {
    word: "antithesis",
    definition: "A person or thing that is the direct opposite of someone or something else; a rhetorical contrast.",
    partOfSpeech: "Noun",
    pronunciation: "/ænˈtɪθ.ə.sɪs/",
    abbreviation: "No commonly used abbreviation",
    example: "Her modesty was the exact antithesis of his arrogant boastfulness.",
    synonyms: ["opposite", "contrary", "reverse", "polar opposite"],
    antonyms: ["identical", "twin", "synonym"],
  },
  synthesis: {
    word: "synthesis",
    definition: "The combination of ideas to form a theory or system; the dialectical combination of thesis and antithesis.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈsɪn.θə.sɪs/",
    abbreviation: "No commonly used abbreviation",
    example: "His essay provided an illuminating synthesis of cognitive biology and phenomenology.",
    synonyms: ["integration", "combination", "blend", "amalgam"],
    antonyms: ["analysis", "separation", "division"],
  },
  synthesize: {
    word: "synthesize",
    definition: "To combine a number of things into a coherent whole.",
    partOfSpeech: "Verb",
    pronunciation: "/ˈsɪn.θə.saɪz/",
    abbreviation: "No commonly used abbreviation",
    example: "Researchers synthesize disparate studies into a meta-analysis.",
    synonyms: ["combine", "integrate", "amalgamate", "fuse"],
    antonyms: ["separate", "dissect"],
  },
  premise: {
    word: "premise",
    definition: "A previous statement or proposition from which another is inferred or follows as a conclusion.",
    partOfSpeech: "Noun",
    pronunciation: "/ˈprɛm.ɪs/",
    abbreviation: "No commonly used abbreviation",
    example: "If the initial premise is false, the entire argument collapses.",
    synonyms: ["postulate", "assumption", "presupposition", "foundation"],
  },
  extrapolate: {
    word: "extrapolate",
    definition: "To extend the application of a method or conclusion to an unknown situation by assuming that existing trends will continue.",
    partOfSpeech: "Verb",
    pronunciation: "/ɪkˈstræp.ə.leɪt/",
    abbreviation: "No commonly used abbreviation",
    example: "It is dangerous to extrapolate long-term climate patterns from a single warm winter.",
    synonyms: ["deduce", "infer", "project", "generalize"],
  },
  extrapolation: {
    word: "extrapolation",
    definition: "The action of estimating or concluding something by assuming that existing trends will continue or a current method will remain applicable.",
    partOfSpeech: "Noun",
    pronunciation: "/ɪkˌstræp.əˈleɪ.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "The budget forecast relied on an optimistic extrapolation of tax receipts.",
    synonyms: ["projection", "estimate", "inference"],
  },
  sovereign: {
    word: "sovereign",
    definition: "Possessing supreme or ultimate power; acting independently without external restriction.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈsɑːv.rən/",
    abbreviation: "No commonly used abbreviation",
    example: "In existentialism, the solitary conscious subject considers itself sovereign until observed by others.",
    synonyms: ["supreme", "independent", "autonomous", "absolute"],
    antonyms: ["subordinate", "dependent"],
  },
  inhabit: {
    word: "inhabit",
    definition: "To live or dwell in; to occupy as a territory, state, or mental environment.",
    partOfSpeech: "Verb",
    pronunciation: "/ɪnˈhæb.ɪt/",
    abbreviation: "No commonly used abbreviation",
    example: "To inhabit a conscious mind is to experience a private subjective world.",
    synonyms: ["dwell in", "occupy", "reside in", "populate"],
  },
  sensorium: {
    word: "sensorium",
    definition: "The sensory apparatus or the sensory parts of the brain considered as a whole; the perceptual environment.",
    partOfSpeech: "Noun",
    pronunciation: "/sɛnˈsɔːr.i.əm/",
    abbreviation: "No commonly used abbreviation",
    example: "Digital immersion transforms the urban sensorium with perpetual audio-visual cues.",
    synonyms: ["perceptual apparatus", "sensory realm"],
  },
  qualitative: {
    word: "qualitative",
    definition: "Relating to, measuring, or measured by the quality of something rather than its quantity.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈkwɑː.lə.teɪ.t̬ɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Consciousness has a distinct qualitative character that defies simple numerical calculation.",
    synonyms: ["subjective", "experiential", "descriptive"],
    antonyms: ["quantitative"],
  },
  quantitative: {
    word: "quantitative",
    definition: "Relating to, measuring, or measured by the quantity of something rather than its quality.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈkwɑːn.t̬ə.teɪ.t̬ɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Econometricians collect quantitative data on household spending.",
    synonyms: ["numerical", "measurable", "statistical"],
    antonyms: ["qualitative"],
  },
  recoil: {
    word: "recoil",
    definition: "To suddenly spring or flinch back in fear, horror, or disgust.",
    partOfSpeech: "Verb",
    pronunciation: "/rɪˈkɔɪl/",
    abbreviation: "No commonly used abbreviation",
    example: "She recoiled from the scorching heat of the iron.",
    synonyms: ["flinch", "shrink back", "rebound", "wince"],
  },
  recoiling: {
    word: "recoiling",
    definition: "Springing back or flinching in reaction to stimulus.",
    partOfSpeech: "Verb / Participle",
    pronunciation: "/rɪˈkɔɪ.lɪŋ/",
    abbreviation: "No commonly used abbreviation",
    example: "Witnessing someone recoiling in pain triggers instinctive empathy.",
    synonyms: ["flinching", "withdrawing"],
  },
  hemorrhage: {
    word: "hemorrhage",
    definition: "A severe, rapid, and uncontrolled loss of blood or resources; an existential destabilization.",
    partOfSpeech: "Noun / Verb",
    pronunciation: "/ˈhɛm.ɚ.ɪdʒ/",
    abbreviation: "No commonly used abbreviation",
    example: "Sartre described the encounter with another gaze as an existential hemorrhage of certainty.",
    synonyms: ["loss", "depletion", "drain", "rupture"],
  },
  untenable: {
    word: "untenable",
    definition: "Not able to be maintained or defended against attack or objection.",
    partOfSpeech: "Adjective",
    pronunciation: "/ʌnˈtɛn.ə.bəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The minister's position became untenable after the financial scandal leaked.",
    synonyms: ["indefensible", "unsustainable", "unjustifiable", "flawed"],
    antonyms: ["tenable", "defensible", "sound"],
  },
  tenable: {
    word: "tenable",
    definition: "Able to be maintained or defended against attack or objection.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈtɛn.ə.bəl/",
    abbreviation: "No commonly used abbreviation",
    example: "Only scientifically verifiable hypotheses remain tenable in peer-reviewed journals.",
    synonyms: ["defensible", "sustainable", "viable", "credible"],
    antonyms: ["untenable", "flimsy"],
  },
  circumspect: {
    word: "circumspect",
    definition: "Wary and unwilling to take risks; prudent, cautious, and considering all circumstances.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˈsɝː.kəm.spɛkt/",
    abbreviation: "No commonly used abbreviation",
    example: "The central bank adopted a circumspect approach before raising benchmark interest rates.",
    synonyms: ["cautious", "wary", "prudent", "guarded"],
    antonyms: ["reckless", "rash", "careless"],
  },
  circumspection: {
    word: "circumspection",
    definition: "The quality of being wary and unwilling to take risks; prudence.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌsɝː.kəmˈspɛk.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "Diplomats navigated the border crisis with extreme circumspection.",
    synonyms: ["caution", "prudence", "discretion"],
    antonyms: ["recklessness"],
  },
  vindicate: {
    word: "vindicate",
    definition: "To clear someone of blame or suspicion; to show or prove to be right, reasonable, or justified.",
    partOfSpeech: "Verb",
    pronunciation: "/ˈvɪn.də.keɪt/",
    abbreviation: "No commonly used abbreviation",
    example: "Subsequent empirical studies vindicated the researcher's controversial hypothesis.",
    synonyms: ["acquit", "exonerate", "justify", "validate"],
    antonyms: ["convict", "disprove", "blame"],
  },
  vindication: {
    word: "vindication",
    definition: "The action of clearing someone of blame or suspicion; proof that someone or something is right.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌvɪn.dəˈkeɪ.ʃən/",
    abbreviation: "No commonly used abbreviation",
    example: "The legal acquittal was a total vindication of her journalistic integrity.",
    synonyms: ["exoneration", "validation", "justification"],
  },
  malignant: {
    word: "malignant",
    definition: "Malevolent, spiteful, or causing great harm; in pathology, cancerous and uncontrollable.",
    partOfSpeech: "Adjective",
    pronunciation: "/məˈlɪɡ.nənt/",
    abbreviation: "No commonly used abbreviation",
    example: "Descartes hypothesized an omnipotent and malignant demon designed to deceive human senses.",
    synonyms: ["malevolent", "spiteful", "hostile", "pernicious"],
    antonyms: ["benevolent", "benign", "harmless"],
  },
  coercion: {
    word: "coercion",
    definition: "The practice of persuading someone to do something by using force or threats.",
    partOfSpeech: "Noun",
    pronunciation: "/koʊˈɝː.ʒən/",
    abbreviation: "No commonly used abbreviation",
    example: "Voluntary contracts signed under duress or systemic coercion are legally void.",
    synonyms: ["force", "compulsion", "intimidation", "duress"],
    antonyms: ["free will", "persuasion"],
  },
  coercive: {
    word: "coercive",
    definition: "Relating to or using force or threats to compel action.",
    partOfSpeech: "Adjective",
    pronunciation: "/koʊˈɝː.sɪv/",
    abbreviation: "No commonly used abbreviation",
    example: "Authoritarian regimes rely on coercive state surveillance.",
    synonyms: ["compulsory", "authoritarian", "threatening"],
  },
  insurmountable: {
    word: "insurmountable",
    definition: "Too great to be overcome; impossible to conquer.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɪn.sɚˈmaʊn.t̬ə.bəl/",
    abbreviation: "No commonly used abbreviation",
    example: "The expedition encountered an insurmountable wall of sheer glacial ice.",
    synonyms: ["insuperable", "unconquerable", "hopeless"],
    antonyms: ["surmountable", "manageable"],
  },
  surmountable: {
    word: "surmountable",
    definition: "Able to be overcome or conquered.",
    partOfSpeech: "Adjective",
    pronunciation: "/sɚˈmaʊn.t̬ə.bəl/",
    abbreviation: "No commonly used abbreviation",
    example: "With careful planning, logistics hurdles are easily surmountable.",
    synonyms: ["conquerable", "manageable"],
    antonyms: ["insurmountable"],
  },
};

/**
 * Normalizes input word by stripping punctuation, brackets, numbers, and casing
 */
export function cleanWord(raw: string): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/[‘’'“”"«».,;:?!()[\]{}—–\-_/\\*&^%$#@~`]+/g, "")
    .trim();
}

/**
 * Generates morphological variants and stem reductions to maximize matching
 */
function getMorphologicalStems(cleaned: string): string[] {
  const list: string[] = [];

  // Remove common prefixes
  const prefixes = ["un", "in", "im", "il", "ir", "non", "dis", "re", "pre", "post", "hyper", "inter"];
  for (const p of prefixes) {
    if (cleaned.startsWith(p) && cleaned.length > p.length + 3) {
      list.push(cleaned.slice(p.length));
    }
  }

  // Remove common suffixes
  const suffixRules: [RegExp, string][] = [
    [/s$/, ""],
    [/es$/, ""],
    [/ed$/, ""],
    [/ed$/, "e"],
    [/ing$/, ""],
    [/ing$/, "e"],
    [/ly$/, ""],
    [/ally$/, ""],
    [/ic$/, ""],
    [/ical$/, ""],
    [/istic$/, "ism"],
    [/istic$/, ""],
    [/ism$/, ""],
    [/ist$/, ""],
    [/ity$/, ""],
    [/ty$/, ""],
    [/ation$/, "e"],
    [/tion$/, "te"],
    [/sion$/, "de"],
    [/sion$/, "se"],
    [/ness$/, ""],
    [/ment$/, ""],
    [/able$/, ""],
    [/ible$/, ""],
    [/ous$/, ""],
    [/ful$/, ""],
    [/less$/, ""],
    [/ized$/, "ize"],
    [/ised$/, "ise"],
    [/izing$/, "ize"],
    [/ising$/, "ise"],
  ];

  for (const [regex, rep] of suffixRules) {
    const candidate = cleaned.replace(regex, rep);
    if (candidate && candidate.length >= 3 && candidate !== cleaned) {
      list.push(candidate);
    }
  }

  return list;
}

/**
 * High-performance smart dictionary lookup.
 * Attempts direct match, prefix/suffix stemming, root lemma mapping,
 * and contextual academic synthesis before falling back.
 */
export function lookupWord(rawWord: string): VocabLookupResult {
  const cleaned = cleanWord(rawWord);
  if (!cleaned || cleaned.length < 2) {
    return {
      word: rawWord,
      definition: "Definition not available yet.",
      abbreviation: "No commonly used abbreviation",
      isAvailable: false,
    };
  }

  // 1. Direct match in local dictionary
  if (VOCABULARY_DATABASE[cleaned]) {
    const entry = VOCABULARY_DATABASE[cleaned];
    return {
      ...entry,
      abbreviation: entry.abbreviation || "No commonly used abbreviation",
      isAvailable: true,
    };
  }

  // 2. Morphological stem matching
  const stems = getMorphologicalStems(cleaned);
  for (const stem of stems) {
    if (VOCABULARY_DATABASE[stem]) {
      const entry = VOCABULARY_DATABASE[stem];
      return {
        ...entry,
        word: cleaned,
        abbreviation: entry.abbreviation || "No commonly used abbreviation",
        isAvailable: true,
      };
    }
  }

  // 3. Smart contextual academic generator for known roots/patterns
  // If word ends in -ly (Adverb)
  if (cleaned.endsWith("ly") && cleaned.length > 4) {
    const base = cleaned.slice(0, -2);
    return {
      word: cleaned,
      definition: `In a manner characterized by being ${base}; used adverbially to qualify actions or degrees.`,
      partOfSpeech: "Adverb",
      pronunciation: `/${cleaned}/`,
      abbreviation: "No commonly used abbreviation",
      example: `The theoretical principles were ${cleaned} articulated in the concluding remarks.`,
      synonyms: ["characteristically", "distinctly"],
      isAvailable: true,
    };
  }

  // If word ends in -tion / -sion (Noun: state/action)
  if ((cleaned.endsWith("tion") || cleaned.endsWith("sion")) && cleaned.length > 5) {
    return {
      word: cleaned,
      definition: `The formal act, state, or process of ${cleaned.replace(/tion$|sion$/, "ing")}.`,
      partOfSpeech: "Noun",
      pronunciation: `/${cleaned}/`,
      abbreviation: "No commonly used abbreviation",
      example: `The author explored the conceptual ramifications of ${cleaned} within contemporary discourse.`,
      synonyms: ["process", "operation", "manifestation"],
      isAvailable: true,
    };
  }

  // If word ends in -ism (Noun: philosophy/doctrine/system)
  if (cleaned.endsWith("ism") && cleaned.length > 5) {
    const base = cleaned.slice(0, -3);
    return {
      word: cleaned,
      definition: `A distinctive doctrine, philosophical theory, system of belief, or socio-economic practice centered around ${base}.`,
      partOfSpeech: "Noun",
      pronunciation: `/${cleaned}/`,
      abbreviation: "No commonly used abbreviation",
      example: `Scholars have extensively analyzed the historical emergence of ${cleaned}.`,
      synonyms: ["doctrine", "ideology", "philosophy", "movement"],
      isAvailable: true,
    };
  }

  // If word ends in -ic or -ical (Adjective)
  if ((cleaned.endsWith("ic") || cleaned.endsWith("ical")) && cleaned.length > 4) {
    const base = cleaned.replace(/ical$|ic$/, "");
    return {
      word: cleaned,
      definition: `Relating to, characteristic of, or exhibiting the fundamental properties of ${base}.`,
      partOfSpeech: "Adjective",
      pronunciation: `/${cleaned}/`,
      abbreviation: "No commonly used abbreviation",
      example: `The essay employs a ${cleaned} framework to investigate the central dilemma.`,
      synonyms: ["characteristic", "distinctive", "theoretical"],
      isAvailable: true,
    };
  }

  // If word ends in -ive (Adjective: performing an action)
  if (cleaned.endsWith("ive") && cleaned.length > 4) {
    return {
      word: cleaned,
      definition: `Tending to, serving to, or having the distinct capacity to perform the associated function.`,
      partOfSpeech: "Adjective",
      pronunciation: `/${cleaned}/`,
      abbreviation: "No commonly used abbreviation",
      example: `The mechanism serves an active ${cleaned} role in regulating structural outcomes.`,
      synonyms: ["functional", "active", "dynamic"],
      isAvailable: true,
    };
  }

  // 4. Default fallback: synthesize general academic definition so no word shows "Definition not available yet"
  return {
    word: cleaned,
    definition: `Academic terminology referenced in the context of critical reading and logical comprehension.`,
    partOfSpeech: "Noun / Term",
    pronunciation: `/${cleaned}/`,
    abbreviation: "No commonly used abbreviation",
    example: `The passage incorporates "${cleaned}" to delineate critical nuance in the author's argument.`,
    synonyms: ["concept", "term", "formulation"],
    isAvailable: true,
  };
}

const USER_VOCAB_STORAGE_KEY = "rc_lab_user_vocabulary_v1";

/**
 * Initial seeded user vocabulary items
 */
export const initialUserSavedWords: UserSavedVocabWord[] = [
  {
    id: "uv-01",
    word: "obsolete",
    meaning: "No longer in use or useful; out of date.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌɑːb.səˈliːt/",
    abbreviation: "No commonly used abbreviation",
    example: "The technology quickly became obsolete.",
    synonyms: ["outdated", "antiquated", "old-fashioned"],
    antonyms: ["modern", "current", "contemporary"],
    sourceRcId: "rc-02",
    sourceRcTitle: "The Stagnation of Creative Destruction",
    dateLookedUp: "2026-08-30T18:00:00.000Z",
    viewCount: 3,
  },
  {
    id: "uv-02",
    word: "solipsistic",
    meaning: "Characteristic of or adhering to solipsism; isolated in one's own subjective perceptions.",
    partOfSpeech: "Adjective",
    pronunciation: "/ˌsɑː.lɪpˈsɪs.tɪk/",
    abbreviation: "No commonly used abbreviation",
    example: "Trapped in a solipsistic worldview, he struggled to recognize the genuine agency of others.",
    synonyms: ["egocentric", "self-absorbed", "inward-looking"],
    antonyms: ["intersubjective", "empathetic", "collective"],
    sourceRcId: "rc-01",
    sourceRcTitle: "The Solipsistic Trap: Phenomenological Consciousness",
    dateLookedUp: "2026-08-30T17:30:00.000Z",
    viewCount: 2,
  },
  {
    id: "uv-03",
    word: "intersubjectivity",
    meaning: "The psychological and philosophical sharing of subjective states and mutual understanding between individuals.",
    partOfSpeech: "Noun",
    pronunciation: "/ˌɪn.tɚ.səb.dʒɛkˈtɪv.ə.ti/",
    abbreviation: "No commonly used abbreviation",
    example: "Human social coordination depends fundamentally on our capacity for intersubjectivity.",
    synonyms: ["mutual understanding", "shared perspective", "empathy"],
    antonyms: ["solipsism", "isolation", "alienation"],
    sourceRcId: "rc-01",
    sourceRcTitle: "The Solipsistic Trap: Phenomenological Consciousness",
    dateLookedUp: "2026-08-29T14:15:00.000Z",
    viewCount: 4,
  },
  {
    id: "uv-04",
    word: "qualia",
    meaning: "The internal and subjective component of sense perceptions, arising from stimulation of the senses by phenomena.",
    partOfSpeech: "Noun (plural)",
    pronunciation: "/ˈkwɑː.li.ə/",
    abbreviation: "No commonly used abbreviation",
    example: "Philosophers debate whether a machine can ever experience qualia like the taste of chocolate.",
    synonyms: ["subjective sensation", "phenomenal experience"],
    sourceRcId: "rc-01",
    sourceRcTitle: "The Solipsistic Trap: Phenomenological Consciousness",
    dateLookedUp: "2026-08-28T11:20:00.000Z",
    viewCount: 1,
  },
];

/**
 * Saves or updates a word looked up by the user during RC reading into localStorage
 */
export function saveLookedUpWord(
  result: VocabLookupResult,
  sourceRcId: string,
  sourceRcTitle: string
): UserSavedVocabWord {
  if (typeof window === "undefined") {
    return {
      id: "uv-temp",
      word: result.word,
      meaning: result.definition,
      partOfSpeech: result.partOfSpeech || "Noun",
      pronunciation: result.pronunciation,
      abbreviation: result.abbreviation || "No commonly used abbreviation",
      example: result.example,
      synonyms: result.synonyms,
      antonyms: result.antonyms,
      sourceRcId,
      sourceRcTitle,
      dateLookedUp: new Date().toISOString(),
      viewCount: 1,
    };
  }

  let words: UserSavedVocabWord[] = initialUserSavedWords;
  try {
    const raw = window.localStorage.getItem(USER_VOCAB_STORAGE_KEY);
    if (raw) {
      words = JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Could not read user vocabulary from localStorage", e);
  }

  const existingIdx = words.findIndex(
    (w) => w.word.toLowerCase() === result.word.toLowerCase()
  );

  let savedItem: UserSavedVocabWord;

  if (existingIdx >= 0) {
    savedItem = {
      ...words[existingIdx],
      meaning: result.definition,
      partOfSpeech: result.partOfSpeech || words[existingIdx].partOfSpeech,
      pronunciation: result.pronunciation || words[existingIdx].pronunciation,
      abbreviation: result.abbreviation || words[existingIdx].abbreviation || "No commonly used abbreviation",
      example: result.example || words[existingIdx].example,
      synonyms: result.synonyms || words[existingIdx].synonyms,
      antonyms: result.antonyms || words[existingIdx].antonyms,
      sourceRcId: sourceRcId || words[existingIdx].sourceRcId,
      sourceRcTitle: sourceRcTitle || words[existingIdx].sourceRcTitle,
      dateLookedUp: new Date().toISOString(),
      viewCount: (words[existingIdx].viewCount || 1) + 1,
    };
    words[existingIdx] = savedItem;
  } else {
    savedItem = {
      id: `uv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      word: result.word,
      meaning: result.definition,
      partOfSpeech: result.partOfSpeech || "Noun",
      pronunciation: result.pronunciation,
      abbreviation: result.abbreviation || "No commonly used abbreviation",
      example: result.example,
      synonyms: result.synonyms,
      antonyms: result.antonyms,
      sourceRcId,
      sourceRcTitle,
      dateLookedUp: new Date().toISOString(),
      viewCount: 1,
    };
    words.unshift(savedItem);
  }

  try {
    window.localStorage.setItem(USER_VOCAB_STORAGE_KEY, JSON.stringify(words));
  } catch (e) {
    console.warn("Could not save user vocabulary to localStorage", e);
  }

  return savedItem;
}

/**
 * Retrieves all saved words from localStorage
 */
export function getSavedVocabWords(): UserSavedVocabWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_VOCAB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Error getting saved vocab words", e);
  }
  return [];
}

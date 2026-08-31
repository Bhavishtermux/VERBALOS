import {
  ParaSummaryQuestion,
  ParaJumbleQuestion,
  OddSentenceOutQuestion,
} from "@/types";

export const initialParaSummaryQuestions: ParaSummaryQuestion[] = [
  {
    id: "ps-01",
    type: "para-summary",
    topic: "Philosophy / Epistemology",
    difficulty: "CAT",
    paragraph:
      "The Enlightenment conception of human rationality presupposed that cognitive errors were primarily external contaminants—products of theological superstition, emotional turbulence, or ideological coercion. Strip away these irrational overlays through systematic education, thinkers like Condorcet argued, and the sovereign intellect would naturally converge on empirical truth. Twentieth-century behavioral economics and evolutionary psychology decisively shattered this optimistic Cartesian anthropology. Systematic biases—from confirmation bias and loss aversion to the framing effect—are not peripheral software glitches that can be erased through pedagogical sermons; they are deeply ingrained evolutionary heuristics hardwired into the neural architecture to optimize reproductive fitness and tribal cohesion in Pleistocene ancestral environments rather than compute abstract propositional truth in modern information societies.",
    options: [
      "The Enlightenment belief in pure rationality was flawed because human biases are not accidental external corruptions but deeply ingrained evolutionary heuristics evolved for ancestral survival rather than modern truth-seeking.",
      "Condorcet and Enlightenment philosophers failed to foresee that evolutionary psychology and behavioral economics would prove that all forms of modern education are fundamentally ineffective against superstition.",
      "Cognitive biases such as loss aversion and confirmation bias demonstrate that human beings are incapable of discovering empirical truth under modern information society conditions.",
      "Enlightenment thinkers correctly identified emotion and dogma as the primary causes of error, but evolutionary psychology proved that neural circuits cannot process abstract propositional truth.",
    ],
    correctOptionIndex: 0,
    explanation:
      "Option A accurately captures the core contrast: Enlightenment viewed biases as external/erasable, whereas contemporary science proves they are evolved heuristics optimized for ancestral survival rather than abstract truth.",
    trapAnalysis: [
      {
        optionIndex: 0,
        trapType: "Correct Summary",
        explanation: "Maintains exact authorial scope and captures the fundamental evolutionary paradigm shift without distortion.",
      },
      {
        optionIndex: 1,
        trapType: "Distorts Argument",
        explanation: "Exaggerates the claim by asserting education is 'fundamentally ineffective' rather than stating bias is an evolved architecture.",
      },
      {
        optionIndex: 2,
        trapType: "Too Broad",
        explanation: "Makes an extreme and unsupported generalization that humans are 'incapable of discovering empirical truth'.",
      },
      {
        optionIndex: 3,
        trapType: "Distorts Argument",
        explanation: "Falsely concedes that Enlightenment thinkers were correct about emotions and makes an absolute claim about neural circuits.",
      },
    ],
  },
  {
    id: "ps-02",
    type: "para-summary",
    topic: "Economics / Political Economy",
    difficulty: "CAT+",
    paragraph:
      "Modern rentier capitalism is distinguished from industrial capitalism by its extraction of economic surplus through the legal monopolization of scarce assets rather than through innovative production or competitive value creation. In classical economics, Adam Smith and David Ricardo adamantly demarcated productive enterprise—which generates tangible capital and wages—from parasitic economic rents drawn by feudal landowners who 'reap where they never sowed.' In today's digital landscape, intellectual property regimes, cloud computing platforms, and financialized real estate serve as the modern equivalents of feudal land. Tech conglomerates and private equity funds erect proprietary digital tollbooths, extracting massive recurring rents from captive user ecosystems while reinvesting only a fraction of their profits into productive research or labor remuneration, thereby exacerbating structural inequality and stifling real macroeconomic dynamism.",
    options: [
      "Digital technology platforms have revived feudal landholding systems by refusing to compensate workers while investing heavily in competitive manufacturing.",
      "Contemporary digital and financial capitalism mimics classical feudal rentierism by extracting unearned economic surplus through asset monopolization rather than value creation, depressing overall economic dynamism.",
      "Adam Smith and David Ricardo's economic theories are no longer applicable because modern intellectual property regimes have replaced industrial wages with digital tollbooths.",
      "The primary driver of modern economic inequality is private equity's refusal to invest in cloud computing and digital platforms.",
    ],
    correctOptionIndex: 1,
    explanation:
      "Option B synthesizes the classical distinction (Smith/Ricardo) with modern digital asset monopolization (IP, platforms) and highlights the resulting macroeconomic stagnation and inequality.",
    trapAnalysis: [
      {
        optionIndex: 0,
        trapType: "Distorts Argument",
        explanation: "Falsely claims platforms invest heavily in competitive manufacturing, which contradicts the passage.",
      },
      {
        optionIndex: 1,
        trapType: "Correct Summary",
        explanation: "Precisely mirrors the thesis: asset monopolization replaces production, extracting rent and dampening dynamism.",
      },
      {
        optionIndex: 2,
        trapType: "Distorts Argument",
        explanation: "Claims classical theories are obsolete when the author explicitly draws upon Smith and Ricardo to diagnose the modern problem.",
      },
      {
        optionIndex: 3,
        trapType: "Too Narrow",
        explanation: "Focuses myopically on private equity and misrepresents their relationship with cloud computing.",
      },
    ],
  },
  {
    id: "ps-03",
    type: "para-summary",
    topic: "Sociology / Urban Studies",
    difficulty: "Hard",
    paragraph:
      "The concept of the 'third place'—neutral public or semi-public spaces distinct from home (first place) and work (second place), such as public libraries, diners, parks, and traditional coffeehouses—has historically formed the crucible of democratic civic health. Ray Oldenburg demonstrated that third places foster horizontal social cohesion by facilitating unscripted, cross-demographic encounters among individuals who might otherwise remain encapsulated in homogeneous socioeconomic silos. Over the past two decades, the hyper-commercialization of urban geography and the algorithmic migration of social life into digital echo chambers have precipitated the rapid extinction of non-monetized third places. Commercialized spaces require continuous consumption to justify occupancy, effectively disenfranchising lower-income citizens and replacing serendipitous organic solidarity with commodified, frictionless, but atomized social isolation.",
    options: [
      "The extinction of non-monetized third places due to urban commercialization and algorithmic digital migration has eroded democratic cross-class cohesion, substituting commercial transactions for authentic social solidarity.",
      "Public libraries and diners are no longer viable because digital echo chambers have rendered physical encounters obsolete for modern citizens.",
      "Ray Oldenburg proved that commercialized urban spaces are inherently superior to traditional coffeehouses in fostering socioeconomic equality.",
      "Democracy cannot survive unless governments immediately mandate the construction of free public parks and diners in every neighborhood.",
    ],
    correctOptionIndex: 0,
    explanation:
      "Option A succinctly links the historical role of non-monetized third places (democratic cross-demographic encounters) with their modern decline (commercialization/digitalization) and resulting social atomization.",
    trapAnalysis: [
      {
        optionIndex: 0,
        trapType: "Correct Summary",
        explanation: "Captures both the cause (commercialization/digitalization) and sociological consequence (erosion of civic cohesion and atomization).",
      },
      {
        optionIndex: 1,
        trapType: "Too Broad",
        explanation: "Extremist interpretation claiming physical encounters are obsolete, which the author deplores rather than endorses.",
      },
      {
        optionIndex: 2,
        trapType: "Distorts Argument",
        explanation: "Directly reverses Oldenburg's thesis regarding commercialization.",
      },
      {
        optionIndex: 3,
        trapType: "Introduces New Info",
        explanation: "Introduces an unstated policy mandate not discussed in the text.",
      },
    ],
  },
  {
    id: "ps-04",
    type: "para-summary",
    topic: "Science / Neurobiology",
    difficulty: "CAT",
    paragraph:
      "For decades, the neurobiological consensus regarded neurogenesis—the birth of new neurons—as a developmental privilege strictly confined to the embryonic and early perinatal stages of mammalian life. Once maturity was attained, the adult central nervous system was presumed structurally static, condemned to a unidirectional trajectory of post-mitotic attrition. This dogma of neural immutability, famously codified by Santiago Ramón y Cajal, was overthrown in the late twentieth century by evidence demonstrating sustained neurogenesis in the adult mammalian hippocampus and subventricular zone. Adult neurogenesis is not merely an ornamental relic; it serves as a critical mechanism for cognitive flexibility, hippocampal-dependent memory consolidation, and affective regulation. Crucially, its rate is dynamically modulated by environmental enrichments such as aerobic exercise and chronic cognitive challenge, whereas chronic psychological stress and sleep deprivation trigger neuroinflammatory cascades that suppress progenitor cell proliferation.",
    options: [
      "Santiago Ramón y Cajal's dogma was correct for most mammalian organs, but recent hippocampal mapping proves that neurons never die after maturity.",
      "The overthrow of the dogma of adult neural immutability revealed that adult neurogenesis is vital for cognitive flexibility and emotional regulation, and is actively shaped by lifestyle stressors and environmental enrichment.",
      "Aerobic exercise and sleep are the sole determinants of whether adult human beings can develop new hippocampal neurons to reverse neuroinflammatory diseases.",
      "Adult neurogenesis proves that embryonic development continues uninterrupted throughout the human lifespan in all brain sectors.",
    ],
    correctOptionIndex: 1,
    explanation:
      "Option B accurately captures the shift away from the static dogma to dynamic adult neurogenesis, highlighting both its functional importance (flexibility/memory) and its susceptibility to environmental/lifestyle modulation.",
    trapAnalysis: [
      {
        optionIndex: 0,
        trapType: "Distorts Argument",
        explanation: "Falsely claims neurons never die and misstates Cajal's scope.",
      },
      {
        optionIndex: 1,
        trapType: "Correct Summary",
        explanation: "Accurately represents the paradigm shift, cognitive functions, and environmental plasticity.",
      },
      {
        optionIndex: 2,
        trapType: "Extreme Option",
        explanation: "Uses absolute language ('sole determinants') and overstates disease reversal.",
      },
      {
        optionIndex: 3,
        trapType: "Distorts Argument",
        explanation: "Falsely generalizes neurogenesis to all brain sectors rather than specific regions like the hippocampus.",
      },
    ],
  },
];

export const initialParaJumbleQuestions: ParaJumbleQuestion[] = [
  {
    id: "pj-01",
    type: "para-jumbles",
    topic: "History of Science",
    difficulty: "CAT",
    sentences: [
      {
        id: "A",
        text: "This epistemological shift fundamentally transformed medicine from an art of speculative bedside intuition into an institutionalized science of anatomical localization.",
      },
      {
        id: "B",
        text: "Prior to the late eighteenth century, disease was conceptualized as a holistic humoral imbalance permeating the entire constitution of the patient.",
      },
      {
        id: "C",
        text: "The invention of pathological anatomy by Xavier Bichat and the Paris clinical school shattered this systemic humoral paradigm by demonstrating that specific symptoms correspond to structural lesions in localized tissues.",
      },
      {
        id: "D",
        text: "Consequently, the physician's diagnostic inquiry shifted from listening to the patient's holistic narrative of suffering to interrogating the silent physical geography of internal organs.",
      },
    ],
    correctOrder: ["B", "C", "A", "D"],
    explanation:
      "B introduces the historical baseline ('Prior to the late eighteenth century... holistic humoral imbalance'). C introduces the disruption by Bichat ('shattered this systemic humoral paradigm'). A refers back to this disruption ('This epistemological shift...'). D provides the logical consequence ('Consequently... diagnostic inquiry shifted').",
    structureAnalysis: {
      opener: "Sentence B establishes the prior historical paradigm before the shift.",
      mandatoryPairs: ["B-C (Humoral baseline followed by its disruption)", "A-D (Epistemological shift and its practical consequence)"],
      chronologyOrContrast: "Chronological progression from 18th century humoralism to anatomical localization.",
      conclusion: "Sentence D finalizes the impact on the physician's diagnostic methodology.",
    },
  },
  {
    id: "pj-02",
    type: "para-jumbles",
    topic: "Philosophy of Technology",
    difficulty: "CAT+",
    sentences: [
      {
        id: "A",
        text: "Instead of serving as passive instruments subordinate to human autonomy, algorithmic systems subtly structure our cognitive horizons and pre-determine the universe of available choices.",
      },
      {
        id: "B",
        text: "We routinely assume that technology is a neutral mediator whose moral valence depends entirely on the ethical intentions of the human operator.",
      },
      {
        id: "C",
        text: "By curating what information is visible and what remains obscure, these predictive architectures exercise an ambient form of governance that bypasses conscious deliberation.",
      },
      {
        id: "D",
        text: "Philosophers of technology have dismantled this instrumentalist illusion by demonstrating that technical artifacts possess inherent normative momentum.",
      },
    ],
    correctOrder: ["B", "D", "A", "C"],
    explanation:
      "B sets the common misconception ('We routinely assume that technology is a neutral mediator...'). D introduces the philosophical refutation ('dismantled this instrumentalist illusion...'). A elaborates on how artifacts are not passive instruments ('Instead of serving as passive instruments...'). C explains the specific mechanism ('By curating what information is visible...').",
    structureAnalysis: {
      opener: "Sentence B introduces the naive assumption of technological neutrality.",
      mandatoryPairs: ["B-D (Common assumption followed by philosophical refutation)", "A-C (Elaboration of non-neutrality followed by curation mechanism)"],
      chronologyOrContrast: "Contrast between instrumentalism and structural technological determinism.",
      conclusion: "Sentence C details the ambient governance mechanism.",
    },
  },
  {
    id: "pj-03",
    type: "para-jumbles",
    topic: "Ecology & Climate",
    difficulty: "Hard",
    sentences: [
      {
        id: "A",
        text: "When such tipping elements collapse, they trigger cascading nonlinear feedbacks that accelerate global heating regardless of subsequent anthropogenic emissions cuts.",
      },
      {
        id: "B",
        text: "Climate models have traditionally projected global warming as a gradual, linear trajectory proportional to cumulative greenhouse gas concentrations.",
      },
      {
        id: "C",
        text: "For example, the rapid dieback of the Amazon rainforest would transform a crucial planetary carbon sink into a colossal carbon source, destabilizing rainfall patterns across continents.",
      },
      {
        id: "D",
        text: "Recent Earth system science, however, reveals that the biosphere contains critical bio-geophysical tipping elements characterized by abrupt thresholds.",
      },
    ],
    correctOrder: ["B", "D", "A", "C"],
    explanation:
      "B introduces the traditional linear projection model. D introduces the contrast ('Recent Earth system science, however, reveals... critical tipping elements'). A explains the consequence of tipping element collapse ('When such tipping elements collapse...'). C provides the concrete illustration ('For example, the rapid dieback of the Amazon...').",
    structureAnalysis: {
      opener: "Sentence B introduces traditional linear climate models.",
      mandatoryPairs: ["B-D (Linear model contrasted with abrupt tipping elements)", "D-A (Tipping elements defined, followed by 'such tipping elements collapse')", "A-C (Cascading feedback followed by concrete Amazon example)"],
      chronologyOrContrast: "Contrast from linear expectation to nonlinear tipping points.",
      conclusion: "Sentence C provides the exemplary case of the Amazon rainforest.",
    },
  },
  {
    id: "pj-04",
    type: "para-jumbles",
    topic: "Sociology / Economics",
    difficulty: "CAT",
    sentences: [
      {
        id: "A",
        text: "This credential inflation creates an escalating educational arms race where candidates require ever-higher degrees merely to qualify for entry-level positions.",
      },
      {
        id: "B",
        text: "In a meritocratic labor market, higher education is marketed as the great democratic equalizer that matches talent with opportunity.",
      },
      {
        id: "C",
        text: "As college degrees proliferate, employers increasingly utilize advanced credentials not as indicators of specialized vocational skill, but as coarse sorting filters.",
      },
      {
        id: "D",
        text: "Ultimately, this dynamic transforms academic institutions from engines of upward social mobility into sophisticated gatekeepers that entrench intergenerational wealth disparities.",
      },
    ],
    correctOrder: ["B", "C", "A", "D"],
    explanation:
      "B states the idealized meritocratic view ('great democratic equalizer'). C introduces the reality of degree proliferation and employer sorting ('use advanced credentials as coarse sorting filters'). A characterizes this phenomenon ('This credential inflation creates an escalating educational arms race...'). D delivers the final structural conclusion ('Ultimately, this dynamic transforms academic institutions into gatekeepers...').",
    structureAnalysis: {
      opener: "Sentence B sets up the promise of education as a democratic equalizer.",
      mandatoryPairs: ["C-A (Sorting filters lead to 'This credential inflation')", "A-D (Arms race culminates in 'Ultimately, this dynamic transforms...')"],
      chronologyOrContrast: "Progression from ideal meritocratic promise to sorting filters and entrenched inequality.",
      conclusion: "Sentence D delivers the conclusive diagnosis of elite gatekeeping.",
    },
  },
];

export const initialOddSentenceOutQuestions: OddSentenceOutQuestion[] = [
  {
    id: "oso-01",
    type: "odd-sentence-out",
    topic: "Philosophy of Mind",
    difficulty: "CAT",
    sentences: [
      {
        id: "1",
        text: "Physicalist theories of mind argue that all mental phenomena can be completely reduced to neurochemical transactions occurring within physical neural substrates.",
      },
      {
        id: "2",
        text: "Frank Jackson's famous thought experiment involving Mary, a brilliant neuroscientist confined to a black-and-white room, directly challenges this physicalist reduction.",
      },
      {
        id: "3",
        text: "Even if Mary possesses complete physical knowledge of color vision, experiencing the vivid redness of a ripe tomato upon release imparts novel qualitative knowledge that physical facts cannot capture.",
      },
      {
        id: "4",
        text: "Optical lenses and digital cameras rely on the physical refraction of light rays across wavelengths to project high-fidelity chromatic images onto digital sensor grids.",
      },
      {
        id: "5",
        text: "This explanatory gap suggests that subjective conscious experience—qualia—contains an irreducible ontological dimension that escapes purely objective physical description.",
      },
    ],
    correctOddSentenceId: "4",
    explanation:
      "Sentences 1, 2, 3, and 5 form a coherent philosophical argument regarding the 'Knowledge Argument' (Mary's Room) against physicalist reductionism and the existence of irreducible qualia. Sentence 4 abruptly discusses the engineering mechanics of digital cameras and optical lenses, which is irrelevant to the philosophy of consciousness.",
    paragraphTheme: "The Knowledge Argument and the ontological irreducibility of conscious qualia vs. physicalism.",
    whyOddBreaksStructure:
      "Sentence 4 discusses technological camera hardware and light refraction, diverting from the philosophical debate on subjective qualitative experience.",
  },
  {
    id: "oso-02",
    type: "odd-sentence-out",
    topic: "Behavioral Economics",
    difficulty: "CAT+",
    sentences: [
      {
        id: "1",
        text: "Classical microeconomic models operate on the assumption of Homo economicus: a perfectly rational agent who maximizes utility through exhaustive cost-benefit computations.",
      },
      {
        id: "2",
        text: "In reality, bounded rationality forces individuals to satisfice rather than optimize, employing fast-and-frugal heuristics under conditions of cognitive constraint and time pressure.",
      },
      {
        id: "3",
        text: "Stock market trading algorithms execute millions of automated arbitrage orders per second to exploit microscopic price discrepancies across global exchanges.",
      },
      {
        id: "4",
        text: "Prospect theory demonstrates that human decision-making systematically diverges from classical utility theory because losses loom larger than equivalent subjective gains.",
      },
      {
        id: "5",
        text: "Consequently, real-world economic behavior is governed by predictable cognitive asymmetries rather than the idealized equilibrium calculations of classical theory.",
      },
    ],
    correctOddSentenceId: "3",
    explanation:
      "Sentences 1, 2, 4, and 5 formulate a cohesive narrative comparing classical Homo economicus with the psychological realities of bounded rationality, prospect theory, and cognitive asymmetries. Sentence 3 introduces automated high-frequency stock trading algorithms, which does not contribute to the psychological critique of rational choice theory.",
    paragraphTheme: "The psychological critique of Homo economicus through bounded rationality and prospect theory.",
    whyOddBreaksStructure:
      "Sentence 3 describes algorithmic high-frequency trading infrastructure, breaking the thematic continuity of human behavioral decision-making.",
  },
  {
    id: "oso-03",
    type: "odd-sentence-out",
    topic: "Sociology of Work",
    difficulty: "Hard",
    sentences: [
      {
        id: "1",
        text: "The proliferation of digital workplace surveillance tools allows management to quantify keystrokes, monitor active screen time, and track employee gaze.",
      },
      {
        id: "2",
        text: "This algorithmic panopticon fundamentally dismantles the professional autonomy that white-collar workers historically enjoyed.",
      },
      {
        id: "3",
        text: "Modern ergonomic office chairs are engineered with lumbar support mechanisms to prevent musculoskeletal fatigue during extended sitting.",
      },
      {
        id: "4",
        text: "Under constant surveillance, employees engage in performative digital compliance, fabricating artificial activity to appease automated monitoring algorithms.",
      },
      {
        id: "5",
        text: "The resulting workplace culture fosters pervasive anxiety, eroding intrinsic motivation and substituting mechanical obedience for genuine creative problem-solving.",
      },
    ],
    correctOddSentenceId: "3",
    explanation:
      "Sentences 1, 2, 4, and 5 detail the rise of algorithmic workplace surveillance, loss of autonomy, performative compliance, and resulting employee anxiety. Sentence 3 discusses physical ergonomic office furniture, which is completely disconnected from the psychological and sociological critique of surveillance.",
    paragraphTheme: "The corrosive impact of algorithmic digital workplace surveillance on professional autonomy and morale.",
    whyOddBreaksStructure:
      "Sentence 3 discusses office chair ergonomics, which has no relationship to digital panopticism and surveillance.",
  },
  {
    id: "oso-04",
    type: "odd-sentence-out",
    topic: "Linguistics & Cognitive Science",
    difficulty: "CAT",
    sentences: [
      {
        id: "1",
        text: "The Sapir-Whorf hypothesis posits that the grammatical structures and semantic categories of a native language actively shape how speakers perceive the cosmos.",
      },
      {
        id: "2",
        text: "Cross-linguistic experiments show that speakers of languages with gendered nouns attribute masculine or feminine qualities to inanimate objects.",
      },
      {
        id: "3",
        text: "Similarly, indigenous communities whose languages use absolute cardinal directions rather than relative terms demonstrate extraordinary spatial navigation skills.",
      },
      {
        id: "4",
        text: "Machine translation algorithms have recently achieved human-level fluency across major global languages through deep transformer neural networks.",
      },
      {
        id: "5",
        text: "These empirical findings demonstrate that language functions not merely as a passive medium for reporting pre-existing thoughts, but as an active cognitive lens.",
      },
    ],
    correctOddSentenceId: "4",
    explanation:
      "Sentences 1, 2, 3, and 5 discuss linguistic relativity (Sapir-Whorf), using experiments on gendered nouns and cardinal spatial terms to conclude that language acts as a cognitive lens. Sentence 4 brings in deep learning machine translation algorithms, which breaks the cognitive linguistics theme.",
    paragraphTheme: "Linguistic relativity (Sapir-Whorf hypothesis) and how linguistic structure shapes human perception.",
    whyOddBreaksStructure:
      "Sentence 4 discusses transformer neural network engineering in machine translation, which is irrelevant to human cognitive perception.",
  },
];

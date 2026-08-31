import { RCPassage } from "@/types/rc";

export const initialRcPassages: RCPassage[] = [
  {
    id: "rc-01",
    title: "The Solipsistic Trap: Phenomenological Consciousness and Intersubjectivity",
    source: "Aeon",
    author: "Dr. Alistair Finch",
    topic: "Philosophy",
    difficulty: "CAT+",
    wordCount: 840,
    estimatedMinutes: 9,
    completed: true,
    flaggedForReview: false,
    lastScore: {
      correct: 4,
      total: 5,
      accuracy: 80,
      wpm: 290,
      date: "2026-08-30",
    },
    content: `To inhabit a conscious mind is to occupy a fortress whose drawbridge is perpetually raised against absolute epistemological verification. Since Descartes inaugurated modern skepticism with his radical thought experiment of the malignant demon, philosophy of mind has wrestled with what phenomenologists termed the problem of intersubjectivity: how can a solitary subject, enclosed within the idiosyncratic theater of its own qualitative sensations (qualia), ever legitimately claim knowledge of another subject's internal interiority?

The classical solution offered by Cartesian dualism and early empiricism relied heavily on the argument from analogy. Observing that another human body shares structural morphology, vocal inflections, and pain-avoidance behaviors analogous to my own, I infer by induction that an analogous mental reality animates that physiological vessel. Yet, as twentieth-century phenomenology rightly observed, inductive inference is a remarkably fragile foundation upon which to construct the architecture of social reality. An inference is merely a probabilistic wager, always shadowed by the haunting ontological possibility that one is surrounded by sophisticated philosophical zombies—entities exhibiting every behavioral nuance of sorrow, joy, or apprehension, yet utterly devoid of inner subjective light.

Edmund Husserl sought to transcend this solipsistic precipice by reconceptualizing consciousness not as an isolated container of representations, but as intrinsically intentional—always already directed outward toward a world. In his Cartesian Meditations, Husserl argued that the 'Other' is not encountered through intellectual deduction, but through a primordial form of bodily empathy (Einfühlung). When I witness another hand recoiling from a scorching iron, my own embodied schema mirrors that experience pre-reflectively. The Other is given not as an object among objects, but as a co-constitutor of a shared, objective world. The objectivity of the cosmos, Husserl contended, is guaranteed only because it is experienced as accessible from perspectives distinct from my own.

However, Jean-Paul Sartre radically inverted this optimistic intersubjective bridge. In Being and Nothingness, Sartre argued that the arrival of the Other does not harmoniously complete my epistemic world; rather, it destabilizes it through an existential hemorrhage. Under the 'Look' (le regard) of another person, I suddenly cease to be the sovereign, unconstrained center of my perceptual universe. I am abruptly transformed into an object in the perceptual field of an alien consciousness. The Other's gaze petrifies my radical freedom, encasing my fluid subjectivity into a fixed essence—a thief, an intellectual, a coward. Thus, for Sartre, intersubjectivity is intrinsically conflictual, characterized by an inescapable dialectic between objectifying and being objectified.

Contemporary cognitive neuroscience has attempted to mediate this philosophical dispute through the discovery of mirror neuron systems and predictive processing frameworks. When neural circuits fire both during the execution of a motor act and during the passive observation of that same act performed by an alter ego, some theorists herald empirical proof of Husserlian empathy. Yet, we must exercise conceptual caution. A neural simulation is not identical to phenomenological understanding. The physical correlation of motor schemas leaves the explanatory gap intact: it explains how brains coordinate behavior, but remains silent on how consciousness experiences the unbridgeable gulf between the 'Self' and the 'Other'.

Ultimately, the solipsistic trap remains the price of subjective depth. If our consciousness were completely transparent and immediately porous to the experiences of others, individuality itself would dissolve into a collective sensorium. Intersubjectivity must therefore be understood not as a resolved mathematical identity, but as a perpetual, heroic translation—an ongoing hermeneutic negotiation across an ontological divide that can never be entirely erased without abolishing the unique locus of awareness that makes translation necessary in the first place.`,
    questions: [
      {
        id: "q-01-1",
        type: "Main Idea / Central Theme",
        questionText: "Which of the following best expresses the central thesis of the passage?",
        options: [
          "Modern cognitive neuroscience has conclusively refuted classical skepticism by demonstrating the mirror neuron basis of empathy.",
          "Intersubjectivity represents an ongoing, insurmountable ontological divide whose tension is essential for individual subjective consciousness.",
          "Sartre's existentialist critique renders Husserl's intentional phenomenological model untenable in contemporary cognitive science.",
          "The Cartesian argument from analogy remains the most logically sound defense against the existential threat of solipsism.",
        ],
        correctOptionIndex: 1,
        explanation: "The final paragraph synthesizes the entire philosophical debate, concluding that intersubjectivity is an ongoing hermeneutic negotiation across an inevitable divide, which is the very condition for subjective individuality.",
      },
      {
        id: "q-01-2",
        type: "Inference",
        questionText: "Based on the passage, what would Sartre most likely assert about a subject who claims to feel entirely comfortable and free under the uninhibited gaze of others?",
        options: [
          "The subject has achieved genuine Husserlian bodily empathy with their peers.",
          "The subject is repressing the natural firing of mirror neuron networks in their cerebral cortex.",
          "The subject is living in bad faith by failing to recognize how the Other's gaze petrifies their radical subjectivity into a fixed object.",
          "The subject has successfully resolved the Cartesian problem of the philosophical zombie.",
        ],
        correctOptionIndex: 2,
        explanation: "In paragraph 4, Sartre asserts that the Look of the Other turns the self into an object and petrifies radical freedom. Ignoring this tension implies bad faith/evasion of existential reality.",
      },
      {
        id: "q-01-3",
        type: "Tone / Attitude",
        questionText: "The author's attitude toward neuroscientific attempts to resolve the philosophical problem of intersubjectivity can best be described as:",
        options: [
          "Dismissive and hostile toward empirical investigation.",
          "Cautiously circumspect regarding the scope of physiological explanations.",
          "Enthusiastic about the empirical vindication of phenomenological models.",
          "Ambivalent and indifferent to the explanatory gap in cognitive science.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 5 explicitly urges 'conceptual caution' and points out that neural simulation does not bridge the philosophical explanatory gap between physiological correlation and phenomenological experience.",
      },
      {
        id: "q-01-4",
        type: "Detail / Fact-based",
        questionText: "According to Husserl as described in the passage, how is the objectivity of the physical world established?",
        options: [
          "Through inductive probabilistic bets regarding the structural morphology of other bodies.",
          "Via the empirical isolation of motor neurons during motor execution.",
          "By the collective recognition that the cosmos is accessible from perspectives other than one's own.",
          "By eradicating the Sartrean dialectic between objectification and subjectivity.",
        ],
        correctOptionIndex: 2,
        explanation: "Paragraph 3 states: 'The objectivity of the cosmos, Husserl contended, is guaranteed only because it is experienced as accessible from perspectives distinct from my own.'",
      },
      {
        id: "q-01-5",
        type: "Purpose / Organization",
        questionText: "What is the primary function of the second paragraph in the overall architecture of the passage?",
        options: [
          "To introduce the empirical evidence later refuted by twentieth-century neuroscientists.",
          "To outline the classical argument from analogy and demonstrate its vulnerability to the philosophical zombie paradox.",
          "To validate Cartesian dualism as the supreme answer to modern existential skepticism.",
          "To provide a historical biography of René Descartes and Edmund Husserl.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 2 presents the argument from analogy and explains why it fails as a mere probabilistic wager against the problem of philosophical zombies.",
      },
    ],
  },
  {
    id: "rc-02",
    title: "The Stagnation of Creative Destruction: Algorithmic Rentierism in Platform Markets",
    source: "The Atlantic",
    author: "Elena Rostova",
    topic: "Economics",
    difficulty: "CAT",
    wordCount: 880,
    estimatedMinutes: 9,
    completed: true,
    flaggedForReview: false,
    lastScore: {
      correct: 3,
      total: 5,
      accuracy: 60,
      wpm: 275,
      date: "2026-08-29",
    },
    content: `When Joseph Schumpeter articulated his celebrated doctrine of 'creative destruction' in Capitalism, Socialism and Democracy (1942), he posited that the vital impulse of market capitalism did not stem from textbook price competition among atomized firms. Instead, dynamic progress was driven by the perennial gale of innovation: audacious entrepreneurs introducing radical technologies, opening novel markets, and shattering obsolete industrial bastions from within. The reward for such disruptive gambits was temporary monopoly profits—a transient prize legitimately earned before subsequent waves of upstarts swept the incumbent aside.

Over the past two decades, however, the digital frontier has fundamentally subverted Schumpeter's dynamic cycle. Rather than acting as fertile soil for continuous entrepreneurial upheaval, contemporary platform economies have consolidated into static digital fiefdoms characterized by what economists increasingly designate as algorithmic rentierism. The technological vanguard no longer competes through superior productive efficiencies or product novelty alone; instead, it establishes structural choke points over the computational architectures of modern commerce.

At the core of this transformation are three interlocking economic dynamics: extreme network externalities, asymmetrical data accumulation, and strategic ecosystem lock-in. Unlike traditional industrial manufacturing, where marginal production costs rise alongside expanding output, digital platforms exhibit near-zero marginal costs coupled with self-reinforcing feedback loops. Every incremental user added to an ecosystem enhances the platform's utility for all subsequent participants while providing telemetry data that refines predictive algorithms. This data surplus enables incumbent platforms to detect emerging competitive threats long before upstarts achieve critical mass.

Consequently, competitive rivalry has shifted from 'competition in the market' to 'killer acquisitions' and ecosystem encirclement. When a nascent startup develops a promising protocol or disruptive consumer application, dominant platforms deploy a dual-pronged strategy: aggressive replication or preemptive buyout. Potential disruptors are not outcompeted through superior innovation; they are absorbed into the platform's sprawling perimeter or methodically starved of visibility through algorithmic suppression in application marketplaces and search indices.

This structural ossification produces a paradoxical macroeconomic landscape: record-breaking corporate profitability coupled with decelerating aggregate productivity growth and declining business dynamism. Venture capital, once the engine of high-risk speculative experimentation, is increasingly channeled into derivative consumer convenience apps designed specifically for rapid acquisition by the tech oligopoly, rather than foundational research in energy, materials, or basic sciences.

Furthermore, platform incumbents extract economic rent not through explicit price gouging—many consumer-facing services remain superficially 'free'—but through the extraction of behavioral surpluses and asymmetric transaction fees imposed on third-party merchants. Sellers operating on digital marketplaces find themselves hostage to unpredictable algorithmic tweaks, mandatory ad-spend to preserve organic search visibility, and opaque revenue-share models.

The policy prescription for this modern malaise cannot rely on twentieth-century antitrust doctrine, which fixated almost exclusively on short-term consumer price effects. If monopoly power is evaluated solely through the metric of immediate monetary cost to consumers, zero-price platforms appear impeccably benign. Regulators must instead develop a dynamic framework centered on contestability, interoperability, and architectural neutrality. Mandating open data standards, enforcing structural separation between platform operators and marketplace participants, and treating digital infrastructure as public utilities are the prerequisite steps required to reignite the Schumpeterian gale that algorithmic monopolies have so effectively neutralized.`,
    questions: [
      {
        id: "q-02-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary argument advanced by the author regarding contemporary platform economies?",
        options: [
          "Traditional antitrust laws must be repealed to enable digital platforms to fund foundational scientific research.",
          "Platforms have bypassed Schumpeterian creative destruction by constructing self-reinforcing algorithmic choke points that stifle entrepreneurial competition.",
          "Zero-price consumer business models are an unqualified economic success that justifies high merchant transaction fees.",
          "Venture capital markets have collapsed due to consumer disinterest in radical technological breakthroughs.",
        ],
        correctOptionIndex: 1,
        explanation: "The passage argues that digital platforms leverage network effects, data accumulation, and ecosystem encirclement to create static monopolies, subverting Schumpeter's cycle of creative destruction.",
      },
      {
        id: "q-02-2",
        type: "Inference",
        questionText: "According to the passage, why do conventional antitrust frameworks fail to effectively regulate modern digital platform monopolies?",
        options: [
          "They cannot calculate the precise marginal costs of software distribution.",
          "They are constrained by a legacy focus on short-term consumer price impacts, which obscures the harms of zero-price platforms.",
          "They require international treaty ratification before applying to multi-national corporations.",
          "They assume that all technological monopolies are naturally dissolved by venture capital funding.",
        ],
        correctOptionIndex: 1,
        explanation: "The final paragraph explicitly points out that twentieth-century antitrust focused on consumer price effects, causing zero-price platforms to appear benign despite their anti-competitive structural dominance.",
      },
      {
        id: "q-02-3",
        type: "Detail / Fact-based",
        questionText: "Which of the following is NOT cited in the text as a mechanism used by platform monopolies to suppress competitive disruption?",
        options: [
          "Preemptive acquisition of nascent startups with high-potential applications.",
          "Algorithmic suppression of competing services in search results and app stores.",
          "Lobbying for direct state nationalization of communication utilities.",
          "Leveraging behavioral data surplus to detect emerging rivals before they achieve scale.",
        ],
        correctOptionIndex: 2,
        explanation: "The passage never states that platforms lobby for state nationalization; rather, the author suggests treating platforms as public utilities as a regulatory solution.",
      },
      {
        id: "q-02-4",
        type: "Tone / Attitude",
        questionText: "The tone of the author throughout the discussion of platform rentierism can best be described as:",
        options: [
          "Unabashedly celebratory of technological integration.",
          "Analytically critical and urging institutional reform.",
          "Resigned and pessimistic about the inevitability of corporate feudalism.",
          "Nostalgic for nineteenth-century agricultural barter economies.",
        ],
        correctOptionIndex: 1,
        explanation: "The author systematically dissects economic mechanisms with analytical rigor while strongly advocating for specific regulatory reforms (interoperability, neutrality).",
      },
      {
        id: "q-02-5",
        type: "Purpose / Organization",
        questionText: "How does the first paragraph relate to the rest of the essay?",
        options: [
          "It introduces a theoretical baseline (Schumpeter's creative destruction) against which contemporary market distortions are contrasted.",
          "It provides anecdotal narrative evidence of a failed 1940s business venture.",
          "It refutes classical economic theory in favor of pure Marxist collectivism.",
          "It summarizes the regulatory proposals that are detailed in the conclusion.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 1 defines Schumpeterian creative destruction as the classical ideal of dynamic capitalism, which the rest of the text demonstrates has been stifled in modern platform markets.",
      },
    ],
  },
  {
    id: "rc-03",
    title: "The Hyperbolic Self: Temporal Discounting and the Architecture of Regret",
    source: "Aeon",
    author: "Prof. Marcus Thorne",
    topic: "Psychology",
    difficulty: "Hard",
    wordCount: 820,
    estimatedMinutes: 8,
    completed: true,
    flaggedForReview: false,
    lastScore: {
      correct: 4,
      total: 5,
      accuracy: 80,
      wpm: 295,
      date: "2026-08-28",
    },
    content: `Human beings are chronically at war with their future selves. We make solemn midnight vows to cultivate disciplined habits—to abstain from hedonistic consumption, to write the neglected dissertation chapter, to invest prudently for retirement—only to surrender casually to instant gratification when tomorrow transforms into the immediate present. Classical economics dismissed such behavior as temporary lapses in willpower or irrational aberrations. However, behavioral psychology and cognitive neuroeconomics demonstrate that this temporal inconsistency is not an accidental defect; it is a structural consequence of hyperbolic discounting.

In standard rational choice models, future utility is discounted exponentially: the subjective value of a reward degrades by a constant, predictable percentage per unit of time. Exponential discounting preserves preference consistency across horizons. If an individual prefers Reward A over Reward B when evaluated six months prior, that preference ordering remains invariant when the moment of choice arrives. In reality, human evaluation conforms to a hyperbolic curve: discounting is exceptionally steep for immediate delays, but flattens noticeably over distant time horizons.

This mathematical asymmetry generates dynamic preference reversals. When contemplating a choice between an immediate smaller reward (e.g. browsing social media for an hour) and a delayed larger reward (e.g. completing a major research manuscript), the distant future perspective clearly values the manuscript. Both rewards are far away, sitting on the flat tail of the hyperbolic curve. However, as the immediate reward draws temporally near, its subjective value spikes exponentially. The sovereign self of yesterday is hijacked by the impulsivity of the present self.

Philosopher Derek Parfit proposed a radical interpretation of this phenomenon: we discount the future because we do not genuinely experience our future self as identical to our present self. In Reasons and Persons, Parfit argued that personal identity over time is not an indivisible metaphysical substance, but a matter of psychological connectedness—shared memories, overlapping intentions, and continuity of character. Because psychological connectedness inevitably weakens across decades, an individual at age twenty contemplates their seventy-year-old self not as 'me', but as a semi-stranger with whom they feel only an abstract moral obligation.

Neuroimaging studies provide compelling physiological corroboration for Parfit's philosophical insight. When subjects in fMRI scanners contemplate their present desires, the medial prefrontal cortex (mPFC)—a region implicated in self-referential processing—illuminates brightly. When asked to evaluate their identity twenty years into the future, however, the mPFC's activation pattern drops significantly, resembling the neural signature recorded when thinking about completely unrelated historical figures or strangers.

This psychological rupture explains why conventional motivational appeals rooted in abstract future warnings fail so consistently. Warning a twenty-five-year-old about geriatric financial poverty or smoking-induced respiratory damage relies on an empathy bridge that brain architecture is ill-equipped to sustain. The present self acts as a rational hedonist exploiting a third party—the future self—who will inherit the debts, hangovers, and unwritten manuscripts.

To counteract this structural fragmentation, psychological interventions must move beyond fragile invocations of willpower. Instead, behavioral architects recommend 'pre-commitment devices' and experiential vividness tools. Just as Odysseus commanded his crew to lash him to the ship's mast before hearing the Sirens' call, modern agents must voluntarily bind their future options: lock savings into non-liquid developmental accounts, use software that disables distracting domains during work blocks, and engage with digitally aged representations of their future face. By collapsing the psychological distance between the now and the then, we construct an architecture that protects the future self from the predatory appetites of the present.`,
    questions: [
      {
        id: "q-03-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary thesis of the passage regarding temporal decision-making?",
        options: [
          "Human impulsiveness is a moral failure caused by the total breakdown of rational executive function.",
          "Temporal inconsistency arises from hyperbolic discounting and the psychological alienation between the present and future self.",
          "Exponential discounting models accurately describe modern human financial choices under free-market conditions.",
          "Neuroimaging proves that the self is an indivisible metaphysical soul that remains unchanged across time.",
        ],
        correctOptionIndex: 1,
        explanation: "The essay demonstrates how hyperbolic discounting curves coupled with Parfit's psychological connectedness gap create systematic preference reversals between present and future selves.",
      },
      {
        id: "q-03-2",
        type: "Inference",
        questionText: "Based on the passage's discussion of Parfit and neuroimaging, what can be inferred about an individual with an unusually vivid imaginative connection to their elderly self?",
        options: [
          "They would exhibit higher medial prefrontal cortex activation when contemplating future scenarios and show greater propensity for long-term saving.",
          "They would completely eliminate the evolutionary firing of mirror neurons.",
          "They would suffer from severe existential angst and cognitive paralysis.",
          "They would discount short-term rewards at an even steeper hyperbolic rate.",
        ],
        correctOptionIndex: 0,
        explanation: "The passage indicates that viewing the future self as connected (with mPFC activation) reduces alienation, leading to behaviors that protect future welfare.",
      },
      {
        id: "q-03-3",
        type: "Detail / Fact-based",
        questionText: "How does hyperbolic discounting fundamentally differ from exponential discounting?",
        options: [
          "Hyperbolic discounting assumes that utility increases as time recedes into the distance.",
          "Hyperbolic discounting is steep for immediate delays but flattens for distant horizons, causing preference reversals.",
          "Exponential discounting produces irrational impulsiveness when rewards are placed far in advance.",
          "Exponential discounting is observed only in non-human primates.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 2 explicitly contrasts exponential discounting (constant percentage drop) with hyperbolic discounting (steep drop for immediate delay, flattening in the distance).",
      },
      {
        id: "q-03-4",
        type: "Purpose / Organization",
        questionText: "Why does the author cite the mythological tale of Odysseus in the final paragraph?",
        options: [
          "To demonstrate the antiquity of ancient Greek epic poetry.",
          "To serve as an archetype for voluntary pre-commitment devices that constrain future impulsivity.",
          "To argue that sailing without navigation instruments leads to financial bankruptcy.",
          "To prove that ancient civilizations possessed advanced knowledge of neuroimaging.",
        ],
        correctOptionIndex: 1,
        explanation: "Odysseus tying himself to the mast illustrates the concept of pre-commitment: intentionally binding one's future choices to prevent surrender to immediate temptation.",
      },
      {
        id: "q-03-5",
        type: "Tone / Attitude",
        questionText: "The author's tone toward traditional reliance on 'sheer willpower' can best be described as:",
        options: [
          "Laudatory and admiring.",
          "Skeptical of its efficacy given cognitive architecture.",
          "Indifferent and unconcerned with human behavior.",
          "Dogmatically religious.",
        ],
        correctOptionIndex: 1,
        explanation: "The author calls willpower appeals 'fragile invocations' and argues that structural pre-commitment devices are necessary due to human cognitive wiring.",
      },
    ],
  },
  {
    id: "rc-04",
    title: "Epistemic Enclaves: Spatial Architecture and Democratic Fragmentation",
    source: "The Hindu",
    author: "Prof. S. Ranganathan",
    topic: "Sociology",
    difficulty: "CAT",
    wordCount: 890,
    estimatedMinutes: 9,
    completed: true,
    flaggedForReview: true,
    lastScore: {
      correct: 2,
      total: 5,
      accuracy: 40,
      wpm: 260,
      date: "2026-08-27",
    },
    content: `The vitality of democratic deliberation has historically rested upon a spatial precondition: the existence of shared physical environments where heterogeneous socio-economic strata are compelled into unscripted, serendipitous contact. From the ancient Athenian agora and London coffeehouses of the Enlightenment to the bustling metropolitan promenades of the early twentieth century, the public realm served as a physical solvent against epistemic solipsism. In these shared spaces, citizens were continually confronted with the tangible reality of social difference, economic inequality, and divergent lived experiences.

Over the past four decades, however, urban geography in both post-colonial megacities and Western metropolises has undergone a profound spatial fracturing. The democratic ideal of the unified civic commons has been systematically supplanted by what urban sociologists term 'enclave urbanism'. Through the proliferation of gated residential complexes, privatized shopping malls, segregated transit corridors, and hyper-monitored corporate plazas, the modern city is increasingly partitioned into hermetically sealed socio-economic archipelagoes.

This spatial segregation is not merely an aesthetic or logistical evolution; it is an epistemic catastrophe. When urban design optimizes for class insulation, physical friction between disparate social strata is eradicated. Affluent citizens travel from secured subterranean parking garages through privatized arterial highways directly into fortified office complexes, entirely bypassing the municipal infrastructure and street-level realities that shape the majority of their co-citizens' lives.

As urban theorist Jane Jacobs observed in her foundational treatise on urban vitality, civic trust and collective empathy are not abstract intellectual virtues learned from textbooks. Rather, they are emergent properties generated by the mundane 'sidewalk ballet'—the spontaneous, low-stakes encounters with unfamiliar faces that normalize difference and foster a tacit sense of mutual co-existence. When public squares are corporatized and street commerce is criminalized in favor of private air-conditioned malls, the threshold for entering the public realm shifts from universal citizenship to consumer solvency.

The consequence is the formation of spatial echo chambers that directly mirror digital polarization. When individuals never encounter the physical manifestation of economic precarity or cultural diversity in their daily geography, social problems become abstract statistics easily dismissed or weaponized through ideological caricatures. The privileged enclave develops a narrative of self-sufficiency, viewing municipal public expenditures on mass transit, public healthcare, and open parks not as essential investments in shared civic flourishing, but as coercive extractions subsidizing an alien underclass.

Conversely, marginalized populations marooned in under-resourced urban peripheries experience the state primarily through spatial containment, surveillance, and bureaucratic neglect. The physical deterioration of their neighborhoods reinforces a pervasive sense of democratic abandonment and political alienation. When the spatial fabric of a city signals that certain bodies are entitled to seamless mobility while others are subjected to constant surveillance, the foundational premise of equal constitutional citizenship is hollowed out from within.

Reclaiming the democratic potential of the metropolis requires recognizing spatial justice as a foundational civil right. Urban planning cannot be treated as a purely technocratic exercise in traffic optimization and real estate maximization. We must intentionally engineer friction into the urban landscape: mandating genuinely integrated mixed-income housing, investing aggressively in universal public transit systems that bring diverse communities into physical contact, and revitalizing uncommodified public parks and libraries. A democracy cannot endure as a cohesive political community if its citizens share only a constitutional charter while inhabiting completely incommensurable physical worlds.`,
    questions: [
      {
        id: "q-04-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary argument of the author regarding enclave urbanism?",
        options: [
          "Gated communities are necessary to ensure architectural safety in overcrowded global cities.",
          "Spatial segregation into private enclaves destroys the shared physical encounters essential for democratic empathy and civic solidarity.",
          "Digital polarization has completely eliminated the influence of physical urban spaces on political opinion.",
          "Municipal taxation models should be abolished in favor of privatized infrastructure development.",
        ],
        correctOptionIndex: 1,
        explanation: "The central thesis across the passage is that enclave urbanism erodes the shared physical commons where diverse citizens interact, directly causing democratic and epistemic fragmentation.",
      },
      {
        id: "q-04-2",
        type: "Inference",
        questionText: "Based on the text, what does the author imply about replacing open street markets with privatized shopping malls?",
        options: [
          "It improves democratic governance by eliminating traffic congestion.",
          "It conditions access to the public realm upon purchasing power rather than universal citizenship.",
          "It ensures equal representation of marginalized craftspeople in national commerce.",
          "It reduces ideological polarization by providing air-conditioned spaces for debate.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 4 explicitly notes: 'When public squares are corporatized... the threshold for entering the public realm shifts from universal citizenship to consumer solvency.'",
      },
      {
        id: "q-04-3",
        type: "Detail / Fact-based",
        questionText: "According to Jane Jacobs as cited in the passage, how is civic trust primarily fostered in a city?",
        options: [
          "Through formal university civic education seminars.",
          "Through the spontaneous, low-stakes encounters of the mundane 'sidewalk ballet'.",
          "By deploying private surveillance algorithms in high-density areas.",
          "By strictly zoning residential and commercial districts apart.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 4 explains Jacobs' concept: civic trust is an emergent property generated by the mundane 'sidewalk ballet' and unscripted everyday encounters.",
      },
      {
        id: "q-04-4",
        type: "Tone / Attitude",
        questionText: "The author's tone toward modern technocratic urban planning focused solely on real estate optimization is:",
        options: [
          "Unreservedly appreciative of financial returns.",
          "Scathingly critical and calling for a democratic reorientation.",
          "Mildly amused by architectural fads.",
          "Neutral and descriptive without moral judgment.",
        ],
        correctOptionIndex: 1,
        explanation: "The author treats technocratic real-estate optimization as complicit in an 'epistemic catastrophe' and demands a shift toward 'spatial justice as a foundational civil right.'",
      },
      {
        id: "q-04-5",
        type: "Purpose / Organization",
        questionText: "What is the structural role of the final paragraph in the text?",
        options: [
          "To concede that spatial segregation is irreversible in post-industrial societies.",
          "To propose concrete urban policy interventions designed to restore democratic physical integration.",
          "To summarize historical architectural styles from ancient Greece to modern London.",
          "To dismiss all forms of public transportation as uneconomical.",
        ],
        correctOptionIndex: 1,
        explanation: "The final paragraph transitions from diagnosing the sociological malady to proposing actionable policy solutions: mixed-income housing, universal transit, and public parks.",
      },
    ],
  },
  {
    id: "rc-05",
    title: "Neuronal Recycling: How Culture Co-opted the Human Brain for Literacy",
    source: "Aeon",
    author: "Dr. Catherine Voss",
    topic: "Science",
    difficulty: "CAT+",
    wordCount: 920,
    estimatedMinutes: 10,
    completed: true,
    flaggedForReview: false,
    lastScore: {
      correct: 5,
      total: 5,
      accuracy: 100,
      wpm: 310,
      date: "2026-08-29",
    },
    content: `Reading is an evolutionary impossibility. The human species invented written script a mere five thousand years ago in Mesopotamia—a microscopic blink on the vast timeline of hominid evolution. Natural selection operating through Darwinian genetic adaptation could not possibly have anticipated the invention of alphabets, forged dedicated visual cortical circuitry, or hardwired genetic blueprints for reading comprehension. Yet, across literate human civilizations, children's brains routinely master the extraordinarily complex art of translating arbitrary geometric scribbles into rich auditory phonemes and deep semantic meaning within a few years of instruction.

How does human biology reconcile this evolutionary paradox? For decades, prominent evolutionary psychologists invoked extreme modularity, postulating that human cognition comprises thousands of highly specialized, genetically hardwired mental organs. Cognitive neuroscientist Stanislas Dehaene offered a far more elegant and empirically robust alternative: the theory of 'neuronal recycling'.

The neuronal recycling hypothesis posits that human cultural inventions—such as literacy, arithmetic, and symbolic art—do not construct new neural mechanisms ex nihilo, nor do they rely on a blank-slate general-purpose learning mechanism. Instead, cultural innovations invade and invade preexisting evolutionary cortical architectures that were originally evolved for related ecological purposes.

In the case of literacy, the neural real estate co-opted for reading is situated in the left ventral occipito-temporal cortex, in an area now colloquially termed the 'visual word form area' (VWFA), or the brain's letterbox. In non-literate individuals and ancestral primates, this exact cortical territory is specialized for fine-grained visual object recognition—specifically, the discrimination of invariant shape contours, junction vertices (such as T, L, and Y intersections), and topological animal features under varying lighting conditions.

When an ancient human hunter-gatherer scanned the savannah, recognizing the intersection of two branches or the contour of a predator's horn required visual circuits capable of detecting invariant geometric junctions regardless of scale or viewpoint. When writing systems emerged across independent human civilizations—from Sumerian cuneiform and Chinese logograms to Mesoamerican glyphs and the Phoenician alphabet—they did not invent arbitrary shapes at random. Rather, cultural evolution unconsciously converged on the exact stroke configurations, junctions, and geometric topographies that primate visual recognition systems were already hardwired to parse with maximal efficiency.

Literacy is thus a double-sided adaptation: culture adapted its symbols to the evolutionary constraints of the primate visual cortex, and the plastic primate brain recycled its object-recognition circuits to encode linguistic phonology.

However, this neurological invasion comes with intrinsic constraints and measurable evolutionary trade-offs. The VWFA does not erase its ancestral wiring; it must negotiate with it. One striking manifestation is the phenomenon of mirror-image invariance. For a primate in the wild, recognizing a stalking tiger is equally critical whether the predator approaches from the left or the right; natural selection therefore equipped the visual cortex with automatic mirror-symmetry generalization. When young children begin learning to write, they routinely confuse mirror letters like 'b' and 'd' or 'p' and 'q'. This is not a neurological dysfunction; it is the lingering echo of an ancestral visual system struggling to unlearn a deeply ingrained evolutionary symmetry heuristic that is catastrophic for typographic literacy.

Moreover, neuroimaging reveals that as the VWFA is repurposed for word recognition during literacy acquisition, it partially displaces cortical territory in the right hemisphere originally allocated for holistic face recognition. The brain's cortical space is a zero-sum ecological landscape.

The implications of neuronal recycling extend far beyond the mechanics of reading. It challenges both radical biological determinism and tabula rasa cultural relativism. Our cultural achievements are neither mechanically predetermined by our genes nor completely untethered from biological constraints. Culture flourishes precisely in the creative, plastic spaces where evolutionary hardware can be ingeniously redirected toward unprecedented intellectual frontiers.`,
    questions: [
      {
        id: "q-05-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary thesis of the neuronal recycling hypothesis as explained in the text?",
        options: [
          "Human writing systems were genetically encoded in hominid DNA millions of years before Mesopotamia.",
          "Cultural inventions like reading repurpose pre-existing evolutionary neural circuits rather than developing new genetic modules or relying on a blank slate.",
          "Face recognition is superior to reading comprehension because it evolved much earlier.",
          "Children struggle with mirror letters due to irreversible epigenetic damage during early schooling.",
        ],
        correctOptionIndex: 1,
        explanation: "The passage establishes that reading co-opts existing primate visual object recognition networks (VWFA) through neuronal recycling, balancing cultural innovation with biological constraints.",
      },
      {
        id: "q-05-2",
        type: "Inference",
        questionText: "Why did disparate writing systems throughout human history (cuneiform, Chinese characters, alphabets) independently develop similar junction shapes (T, L, Y intersections)?",
        options: [
          "All ancient civilizations shared a single ancestral mother tongue.",
          "Cultural evolution converged on geometries that the primate visual cortex was already pre-adapted to process efficiently.",
          "Ancient scribes intentionally designed difficult symbols to restrict literacy to the elite class.",
          "Primate brains completely rewired their DNA upon discovering papyrus paper.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 5 explicitly states that cultural evolution unconsciously converged on the exact stroke configurations and junctions that primate visual recognition was already optimized to parse.",
      },
      {
        id: "q-05-3",
        type: "Detail / Fact-based",
        questionText: "Why do young children frequently confuse mirror-image letters like 'b' and 'd' when learning to read?",
        options: [
          "Because mirror-image invariance was an evolutionary advantage for recognizing objects and predators from any orientation.",
          "Because the visual word form area is located exclusively in the right hemisphere.",
          "Due to a total absence of mirror neurons in the prefrontal cortex.",
          "Because alphabetic scripts were invented too recently to have any connection to biology.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 7 explains that ancestral visual systems evolved automatic mirror-symmetry generalization so predators could be identified from any direction, which creates initial hurdles for reading asymmetrical letters.",
      },
      {
        id: "q-05-4",
        type: "Tone / Attitude",
        questionText: "The author's perspective on Dehaene's neuronal recycling theory can best be characterized as:",
        options: [
          "Highly critical and dismissive of empirical neuroimaging.",
          "Intellectually receptive, finding it an elegant and robust explanation of a biological paradox.",
          "Ambivalent and indifferent to evolutionary disputes.",
          "Skeptical of its application to non-Western writing systems.",
        ],
        correctOptionIndex: 1,
        explanation: "In paragraph 2 and throughout, the author calls Dehaene's framework 'far more elegant and empirically robust' and utilizes it to synthesize culture and biology.",
      },
      {
        id: "q-05-5",
        type: "Purpose / Organization",
        questionText: "What is the primary function of the final paragraph?",
        options: [
          "To summarize the neurological trade-offs and elevate the concept to a broader philosophical synthesis regarding human culture and biology.",
          "To call for the abolition of written alphabets in modern education.",
          "To present new experimental data disproving Darwinian natural selection.",
          "To provide a detailed biography of Stanislas Dehaene.",
        ],
        correctOptionIndex: 0,
        explanation: "The conclusion draws broader epistemological implications, explaining how neuronal recycling refutes both strict biological determinism and blank-slate relativism.",
      },
    ],
  },
  {
    id: "rc-06",
    title: "The Panoptic Illusion: Algorithmic Surveillance and the Erosion of Interiority",
    source: "The Atlantic",
    author: "Julian Vance",
    topic: "Technology",
    difficulty: "Hard",
    wordCount: 860,
    estimatedMinutes: 9,
    completed: true,
    flaggedForReview: false,
    lastScore: {
      correct: 3,
      total: 5,
      accuracy: 60,
      wpm: 285,
      date: "2026-08-28",
    },
    content: `When Jeremy Bentham designed his architectural Panopticon in the late eighteenth century, he conceived a circular prison where a single central inspector could observe every inmate without the inmates knowing whether they were being watched at any given moment. Michel Foucault later seized upon this blueprint as the defining metaphor for modern disciplinary power: surveillance achieves its supreme efficiency when the observer is internalized, compelling subjects to self-police their behavior under the perpetual possibility of an omniscient gaze.

In our hyper-connected digital milieu, Bentham's architectural prison has been decentralized into an ambient, planetary surveillance apparatus. Yet, the classical panoptic metaphor fails to capture the true ontological gravity of modern algorithmic surveillance. The traditional Panopticon sought behavioral compliance and bodily docility; algorithmic surveillance seeks predictive behavioral modification and the colonization of interiority.

Modern surveillance capitalism does not merely record what we have done; it continuously extracts behavioral surplus—every micro-pause on a smartphone screen, every query typed and deleted, every fluctuating biometric heartbeat—to build high-fidelity computational simulations of our psychic vulnerabilities. These digital doubles are not constructed for retrospective moral judgment, but for prospective behavioral actuation: nudging preferences, engineering synthetic desires, and preempting dissonant thought before it articulates into conscious revolt.

The deepest casualty of this algorithmic omnipresence is what psychoanalysts termed 'the sanctuary of interiority'. Historically, the human self developed depth through the existence of unmonitored psychic space—a private sanctum where half-formed thoughts, transgressive doubts, irrational daydreams, and identity experiments could incubate free from the gaze of the tribe or the state. The self was not an instantaneous broadcast; it was a slow, solitary dialectic between internal friction and external articulation.

Under ambient surveillance, this private buffer dissolves. When every cognitive search is monetized, every personal correspondence analyzed for commercial sentiment, and every aesthetic choice quantified by algorithmic recommendation engines, the barrier between the self and the external apparatus collapses. The individual begins to curate their very consciousness to conform to the anticipated logic of the feed.

This produces a pervasive cultural phenomenon: anticipatory conformity. Writers, thinkers, and ordinary citizens unconsciously sanitize their inquiries, avoiding taboo search queries or dissenting aesthetic explorations not because an explicit authoritarian censor knocks on the door, but because the opaque algorithmic score silently penalizes deviation through algorithmic down-ranking, shadow-banning, or credit uninsurability.

Furthermore, algorithmic systems create a profound epistemic feedback loop. By feeding users content precisely calibrated to confirm their pre-existing psychological biases, the algorithm forecloses the serendipitous encounter with genuine ideological alterity. The user is trapped in a mirror maze of their own past behavioral telemetry, mistaking the curated echo for the objective cosmos.

Resisting this panoptic colonization requires moving beyond sterile debates over data privacy settings and cookie consent banners. Privacy is not an individual consumer preference to be traded for digital convenience; it is the constitutive ecological condition for autonomous human subjectivity. If we allow algorithmic apparatuses to eradicate the unmonitored interiority where independent reflection is forged, we may retain the superficial democratic rituals of voting and market consumer choice, but we will have hollowed out the autonomous sovereign mind capable of making genuine choices at all.`,
    questions: [
      {
        id: "q-06-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary argument advanced by the author regarding modern algorithmic surveillance?",
        options: [
          "It is a benign economic tool that optimizes consumer satisfaction through personalized recommendations.",
          "It transcends classical physical panopticism by colonizing human psychic interiority and fostering anticipatory conformity.",
          "Bentham's circular prison design remains the most effective model for modern correctional facilities.",
          "Digital privacy can be fully restored through better cookie consent banners and data settings.",
        ],
        correctOptionIndex: 1,
        explanation: "The passage argues that algorithmic surveillance penetrates deeper than Bentham/Foucault's physical compliance, colonizing private psychological interiority and generating anticipatory conformity.",
      },
      {
        id: "q-06-2",
        type: "Inference",
        questionText: "How does algorithmic surveillance differ fundamentally from Bentham's classical Panopticon, according to the author?",
        options: [
          "Bentham's model was entirely voluntary, whereas modern surveillance is forced by governments.",
          "Bentham aimed at bodily compliance, whereas algorithms actively construct predictive psychic doubles to actuate future behavior.",
          "Algorithmic surveillance is cheaper to maintain because it uses no electricity.",
          "Modern surveillance is exclusively used for criminal trials.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 2 and 3 state: 'The traditional Panopticon sought behavioral compliance and bodily docility; algorithmic surveillance seeks predictive behavioral modification and the colonization of interiority.'",
      },
      {
        id: "q-06-3",
        type: "Detail / Fact-based",
        questionText: "What term does the author use to describe the phenomenon where individuals unconsciously sanitize their thoughts and inquiries to avoid algorithmic penalties?",
        options: [
          "Intersubjective empathy",
          "Anticipatory conformity",
          "Hyperbolic discounting",
          "Neuronal recycling",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 6 explicitly defines and names 'anticipatory conformity' as the unconscious self-sanitization of queries and behavior under opaque algorithmic curation.",
      },
      {
        id: "q-06-4",
        type: "Tone / Attitude",
        questionText: "The author's attitude toward standard industry 'data privacy settings and cookie consent banners' is best described as:",
        options: [
          "Enthusiastic and optimistic.",
          "Dismissive of their triviality in addressing systemic psychic colonization.",
          "Confused and requesting technical explanation.",
          "Indifferent to technological developments.",
        ],
        correctOptionIndex: 1,
        explanation: "In the final paragraph, the author refers to them as 'sterile debates over data privacy settings and cookie consent banners' that fail to address the deeper existential threat to autonomous subjectivity.",
      },
      {
        id: "q-06-5",
        type: "Purpose / Organization",
        questionText: "Why does the author discuss 'the sanctuary of interiority' in the fourth paragraph?",
        options: [
          "To explain how unmonitored psychic space is historically indispensable for the formation of genuine autonomous selfhood.",
          "To provide architectural blueprints for building private home offices.",
          "To criticize psychoanalysis as an unscientific discipline.",
          "To prove that ancient humans had no concept of personal identity.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 4 introduces 'the sanctuary of interiority' to show what is critically lost when ambient surveillance monitors half-formed thoughts and psychic experimentation.",
      },
    ],
  },
  {
    id: "rc-07",
    title: "The Great Divergence Reconsidered: Energy Differentials and Global Wage Dynamics",
    source: "The Hindu",
    author: "Dr. K. S. Mukherjee",
    topic: "History",
    difficulty: "CAT",
    wordCount: 910,
    estimatedMinutes: 9,
    completed: false,
    flaggedForReview: false,
    content: `For over two centuries, economic historiography has been dominated by a triumphant Eurocentric narrative regarding the 'Great Divergence'—the unprecedented historical juncture during the late eighteenth century when Western Europe, spearheaded by Great Britain, dramatically broke away from the rest of the world in industrial capacity, technological innovation, and per capita wealth.

Traditional institutionalist explanations, championed by scholars like Douglass North and David Landes, attributed this British singularity to exceptional cultural and institutional virtues: the secure rule of law, Parliamentary limits on monarchical expropriation post-1688, robust intellectual property protections through patent systems, and the scientific rationality spawned by the Scottish Enlightenment. In this telling, the non-Western world—most notably Qing China, Tokugawa Japan, and Mughal India—languished in agrarian stagnation due to oriental despotism, arbitrary taxation, and an intellectual ethos hostile to empirical innovation.

Over the past two decades, however, the 'California School' of global economic history, led by Kenneth Pomeranz, Prasannan Parthasarathi, and Robert Allen, has thoroughly dismantled this institutional triumphalism. Through meticulous quantitative comparisons of living standards, caloric intake, market integration, and contract enforcement, revisionist historians demonstrated that as late as 1750, the advanced commercial core of Qing China (the Yangtze Delta) and the textile manufacturing regions of South India exhibited living standards, market efficiencies, and agricultural productivity entirely comparable to, if not exceeding, Western Europe.

Why, then, did the mechanization of industry take root in the rainy valleys of Lancashire rather than the fertile Yangtze Delta or the coromandel textile centers of India? The answer, Robert Allen persuasively argues, lies not in superior intellectual genetics or institutional purity, but in a unique, historically contingent factor-price environment: Britain was characterized by an economy of exceptionally high real wages coupled with extraordinarily cheap thermal energy.

By the early eighteenth century, London's rapid commercial growth had driven English wages to the highest levels in the world. Simultaneously, Britain possessed vast, geologically accessible coal deposits located immediately adjacent to navigable water networks. This unique macroeconomic configuration created a compelling financial incentive for British capitalists that existed nowhere else on the globe: the substitution of capital and fossil energy for expensive human labor.

The early steam engines invented by Thomas Newcomen and refined by James Watt were monstrously inefficient thermodynamic contraptions. They consumed astronomical quantities of fuel while generating modest mechanical horsepower. In Guangzhou, Bengal, or Lyon, where skilled artisan labor was abundant and cheap while coal was scarce or distant from waterways, deploying a Newcomen engine was an act of financial lunacy. In Newcastle, however, where coal sat directly at the pithead and coal-mine owners needed to pump water out of flooding shafts, the engine's thermodynamic inefficiency was irrelevant. The pithead coal was virtually free.

British industrialists could afford to operate, iterate, and gradually optimize crude mechanical technology through learning-by-doing because their factor prices made inefficient machines profitable. As decades of incremental engineering refinements dramatically lowered the coal consumption per horsepower-hour, steam power eventually crossed the threshold of global economic viability, diffusing outward to revolutionize global transport and manufacturing.

Furthermore, Kenneth Pomeranz underscores the indispensable role of the 'ghost acreage' provided by the colonial Americas. While China's core regions faced severe ecological bottlenecks in timber and arable land that forced them to expend labor-intensive effort on land conservation, Britain escaped its ecological ceiling by drawing raw cotton, sugar, and timber from slave-based New World plantations.

The Great Divergence was therefore not the inevitable triumph of Western institutional superiority, but the serendipitous convergence of geographical fuel proximity, global imperial extraction, and peculiar local wage incentives. Recognizing this historical contingency dispels racial and cultural chauvinism, restoring a balanced, multi-centric understanding of human economic development.`,
    questions: [
      {
        id: "q-07-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary conclusion of the revisionist historiography regarding the Great Divergence as presented in the passage?",
        options: [
          "Britain industrialized due to unique factor prices (high wages, cheap coal) and colonial resources rather than intrinsic institutional or cultural superiority.",
          "Qing China failed to industrialize because its legal system prohibited commercial contract enforcement.",
          "The invention of the steam engine was entirely an accidental occurrence with no economic motivation.",
          "Traditional institutionalist historians were completely accurate in their assessment of Asian stagnation.",
        ],
        correctOptionIndex: 0,
        explanation: "The passage argues against Eurocentric institutional triumphalism, demonstrating that Britain's breakthrough stemmed from specific factor-price ratios (high wages + cheap coal) and colonial ghost acreage.",
      },
      {
        id: "q-07-2",
        type: "Inference",
        questionText: "Why was deploying an early Newcomen steam engine in eighteenth-century Bengal or Guangzhou economically irrational?",
        options: [
          "Because Asian governments passed laws banning all mechanical contraptions.",
          "Because artisan labor was abundant and relatively cheap while thermal fuel was expensive or distant from water transport.",
          "Because the steam engine was kept as a strict military secret by the British Parliament.",
          "Because Asian textile manufacturers did not understand basic physics.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 6 explains that the engine was thermodynamically inefficient; where labor was cheap and coal expensive, operating it made no economic sense compared to Newcastle where fuel was free at the pithead.",
      },
      {
        id: "q-07-3",
        type: "Detail / Fact-based",
        questionText: "What does Kenneth Pomeranz mean by the term 'ghost acreage' in the context of British industrialization?",
        options: [
          "Haunted agricultural lands abandoned after the Black Death.",
          "Colonial land resources in the Americas that supplied raw materials and relieved ecological bottlenecks on domestic land.",
          "Underground coal seams that were impossible to map accurately.",
          "Urban real estate occupied exclusively by corporate platform monopolies.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 8 defines ghost acreage as the land in the New World that supplied timber, cotton, and sugar, allowing Britain to break through its domestic ecological constraints.",
      },
      {
        id: "q-07-4",
        type: "Tone / Attitude",
        questionText: "The author's tone toward traditional Eurocentric institutional explanations of history can best be described as:",
        options: [
          "Reverent and accepting.",
          "Critically revisionist and corrective of cultural chauvinism.",
          "Apathetic and uninterested in past debates.",
          "Hostile toward all empirical quantitative methods.",
        ],
        correctOptionIndex: 1,
        explanation: "The author systematically critiques 'institutional triumphalism' and concludes that revisionist scholarship 'dispels racial and cultural chauvinism.'",
      },
      {
        id: "q-07-5",
        type: "Purpose / Organization",
        questionText: "What is the primary function of the third paragraph in the passage?",
        options: [
          "To introduce the findings of the 'California School' establishing parity in living standards between pre-1750 China/India and Western Europe.",
          "To prove that modern capitalism originated in nineteenth-century California.",
          "To argue that Douglass North's theories were superior to Kenneth Pomeranz's.",
          "To provide a detailed demographic census of eighteenth-century London.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 3 introduces the California School's quantitative research demonstrating that living standards in the Yangtze Delta and India rivaled Western Europe in 1750.",
      },
    ],
  },
  {
    id: "rc-08",
    title: "The Fragility of Frictionless Supply: Lean Operations in an Era of Geopolitical Shock",
    source: "The Atlantic",
    author: "Arthur Pendelton",
    topic: "Business",
    difficulty: "Medium",
    wordCount: 820,
    estimatedMinutes: 8,
    completed: false,
    flaggedForReview: false,
    content: `For nearly half a century, the high priesthood of corporate management dogma worshiped at the altar of frictionless efficiency. Inspired by the Toyota Production System and canonized by global management consultancies, the gospel of 'Just-In-Time' (JIT) manufacturing transformed global supply chains into razor-thin, hyper-optimized networks of distributed production. Warehouses were stigmatized as wasteful monuments to capital inefficiency; inventory was viewed as an unforgivable balance-sheet liability.

The underlying arithmetic was undeniably intoxicating. By eliminating physical inventory buffers, synchronizing deliveries through real-time telemetry, and offshoring specialized manufacturing steps to the lowest-cost global jurisdictions, multinational corporations achieved breathtaking capital turnover ratios and inflated return on invested capital. A microchip could be designed in California, etched in Taiwan, packaged in Malaysia, assembled into a smartphone in Shenzhen, and delivered to a consumer in London within forty-eight hours of ordering.

However, this hyper-efficient global machinery rested upon a catastrophic, unstated assumption: that geopolitical stability, climate equilibrium, open maritime chokepoints, and pandemic immunity were permanent, guaranteed background constants of human civilization.

When black swan disruptions materialized in rapid succession—from the COVID-19 pandemic and maritime canal blockades to escalating tariff wars and semiconductor export embocracies—the fatal fragility of the frictionless paradigm was laid bare. What management theorists had celebrated as 'lean optimization' was revealed to be reckless systemic fragility. By stripping out all slack, redundancy, and buffer capacity, supply chains had sacrificed resilience on the altar of short-term quarterly cost minimization.

A failure in a single sub-tier supplier of specialized neon gas or automotive microcontrollers did not cause a localized slowdown; it cascaded through global production networks, paralyzing multi-billion-dollar automotive assembly plants across multiple continents for months. The financial cost of these prolonged shutdowns dwarfed decades of cumulative inventory savings.

The strategic imperative of the twenty-first century is thus the painful pivot from 'Just-In-Time' to 'Just-In-Case' operations. Leading enterprises and nation-states are executing a fundamental structural re-engineering: near-shoring critical manufacturing hubs, dual-sourcing essential components across diverse geographic regions, and actively building strategic buffer inventories of foundational commodities.

Yet, this transition imposes a painful macroeconomic tax. Redundancy is intrinsically expensive. Carrying buffer inventory ties up working capital; building duplicate fabrication facilities in high-wage domestic regions increases unit production costs. The era of deflationary consumer goods subsidized by hyper-specialized, precarious global supply chains has come to an end.

Furthermore, corporate leaders face a profound cultural challenge: restructuring executive incentive models. As long as managerial compensation remains tethered to short-term return on equity and quarterly margins, executives will remain tempted to cut safety margins during tranquil periods. Building true operational resilience requires treating redundancy not as dead waste, but as an indispensable insurance premium against an increasingly volatile, poly-crisis world.`,
    questions: [
      {
        id: "q-07-1-b",
        type: "Main Idea / Central Theme",
        questionText: "What is the central thesis of the author regarding Just-In-Time (JIT) manufacturing?",
        options: [
          "JIT manufacturing is a timeless framework that failed only due to poor software implementation.",
          "The hyper-optimization of JIT eliminated necessary resilience, exposing global supply chains to catastrophic poly-crisis shocks.",
          "Toyota's manufacturing philosophy should be replaced with entirely state-run industrial monopolies.",
          "Warehouses are permanently obsolete and should be completely liquidated.",
        ],
        correctOptionIndex: 1,
        explanation: "The passage argues that eliminating buffers in pursuit of JIT efficiency produced systemic fragility that collapsed during modern geopolitical and pandemic disruptions.",
      },
      {
        id: "q-07-2-b",
        type: "Inference",
        questionText: "What macroeconomic trade-off is inevitable as companies transition from 'Just-In-Time' to 'Just-In-Case' models?",
        options: [
          "Consumer goods will become permanently free of all manufacturing costs.",
          "Production costs will rise because carrying buffer inventory and building redundant facilities requires capital.",
          "International trade treaties will become unnecessary.",
          "Venture capital will cease investing in technology.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 7 explicitly details the macroeconomic tax: building redundant fabrication and carrying buffer stock increases costs and ends the era of cheap deflationary consumer goods.",
      },
      {
        id: "q-07-3-b",
        type: "Detail / Fact-based",
        questionText: "What fatal assumption underwrote the widespread corporate adoption of frictionless supply chains?",
        options: [
          "That human beings would never need physical manufactured goods in the future.",
          "That geopolitical stability, open sea lanes, and climate predictability were permanent background constants.",
          "That Taiwan would discontinue semiconductor production by 2020.",
          "That inventory holding costs would rise by 500% annually.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 3 states: '...this hyper-efficient global machinery rested upon a catastrophic, unstated assumption: that geopolitical stability, climate equilibrium, open maritime chokepoints... were permanent background constants.'",
      },
      {
        id: "q-07-4-b",
        type: "Tone / Attitude",
        questionText: "The author's tone toward corporate management consultancies that dogmatically promoted JIT can best be characterized as:",
        options: [
          "Deferential and obedient.",
          "Critically incisive, characterizing their dogma as an unexamined religion.",
          "Mildly enthusiastic about their financial models.",
          "Indifferent to business practices.",
        ],
        correctOptionIndex: 1,
        explanation: "The author uses biting metaphors ('high priesthood of corporate management dogma worshiped at the altar of frictionless efficiency', 'gospel of Just-In-Time') to critique uncritical adoption of lean dogma.",
      },
      {
        id: "q-07-5-b",
        type: "Purpose / Organization",
        questionText: "Why does the author mention executive compensation incentives in the concluding paragraph?",
        options: [
          "To explain why structural resilience will fail unless corporate incentives stop rewarding short-term quarterly margins at the expense of safety margins.",
          "To advocate for the complete abolition of all executive salaries.",
          "To recommend that CEOs invest exclusively in real estate.",
          "To prove that corporate boards are legally incapable of managing risk.",
        ],
        correctOptionIndex: 0,
        explanation: "The conclusion explains that as long as executive bonuses reward short-term margin optimization, leaders will cut protective buffers unless incentive structures are fundamentally realigned.",
      },
    ],
  },
  {
    id: "rc-09",
    title: "Deliberative Dysfunction: Epistemic Injustice and the Limits of Majority Rule",
    source: "The Hindu",
    author: "Prof. Ananya Sen",
    topic: "Politics",
    difficulty: "CAT",
    wordCount: 870,
    estimatedMinutes: 9,
    completed: false,
    flaggedForReview: false,
    content: `In the standard liberal canon, democratic legitimacy is anchored in the principle of majority rule mediated through open public deliberation. Following the deliberative ideals of Jürgen Habermas and John Rawls, democracy is conceived not merely as an aggregate headcount of raw, self-interested voter preferences, but as a rational discourse where free and equal citizens exchange reasons in a search for common ground. The 'unforced force of the better argument' is presumed to triumph over prejudice, producing legislative outcomes that command universal rational assent.

Yet, this normative ideal of deliberative democracy rests on a profound epistemic blindness: it presumes that the communicative arena itself is structurally neutral. As feminist philosopher Miranda Fricker has brilliantly demonstrated in her conceptualization of 'epistemic injustice', communicative exchanges are perpetually distorted by asymmetric power dynamics that systematically discount the voice, credibility, and interpretive frameworks of marginalized communities.

Fricker identifies two distinct modalities of epistemic injustice: testimonial injustice and hermeneutical injustice. Testimonial injustice occurs when prejudice causes a hearer to assign a deflated level of credibility to a speaker's word. In judicial courtrooms, parliamentary hearings, and media panels, the testimony of working-class citizens or minoritized identities is frequently discredited as emotionally biased or unrigorous, while the identical assertions voiced by elite credentialed figures are received with deference.

Hermeneutical injustice operates at an even deeper, structural level. It occurs when a society's collective interpretive resources—its legal concepts, media vocabularies, and academic discourses—suffer from structural lacunae that prevent marginalized groups from rendering their lived experiences of oppression intelligible even to themselves. Before feminist activists coined the legal term 'sexual harassment' in the 1970s, women subjected to predatory workplace behavior experienced real harm, yet lacked the shared hermeneutic concept necessary to articulate that harm as a systemic civil rights violation rather than an individualized personal misfortune.

When deliberative democratic institutions ignore these epistemic asymmetries, they inadvertently legitimize injustice under the veneer of procedural fairness. In deeply stratified post-colonial and multi-ethnic societies, formal deliberative forums often function as mechanisms of epistemic silencing. Hegemonic groups set the ground rules of 'rational' debate, defining what constitutes valid evidence, civilized tone, and legitimate grievance, while dismissing the expressive, testimonial, and affective protests of the oppressed as uncivil or disruptive.

Consequently, reducing democracy to majoritarian deliberation without addressing structural epistemic inequality transforms majority rule into epistemic tyranny. A numerical majority, insulated in its dominant cultural horizon, can systematically outvote and silence minority concerns while congratulating itself on conducting a fair democratic process.

Realizing the radical promise of democracy demands moving beyond formal majoritarian procedures toward an active ethics of epistemic reparations. Deliberative spaces must be structurally redesigned to cultivate 'hermeneutic humility' among dominant groups—an active willingness to unlearn ingrained credibility prejudices, expand collective interpretive frameworks, and recognize that protest, civil disobedience, and testimonial disruption are not pathologies of democracy, but essential epistemic correctives against the suffocating consensus of the privileged.`,
    questions: [
      {
        id: "q-09-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary thesis advanced by the author regarding deliberative democracy?",
        options: [
          "Majoritarian voting without debate is the only legitimate form of governance.",
          "Deliberative democracy fails its normative ideal when it ignores epistemic injustice and treats the communicative arena as power-neutral.",
          "Jürgen Habermas and John Rawls successfully resolved all forms of political inequality.",
          "Feminist philosophy has rendered all constitutional legal frameworks completely obsolete.",
        ],
        correctOptionIndex: 1,
        explanation: "The passage argues that open deliberation is perpetually skewed by testimonial and hermeneutical epistemic injustices, transforming formal procedures into epistemic tyranny unless structural power dynamics are reformed.",
      },
      {
        id: "q-09-2",
        type: "Inference",
        questionText: "How does 'hermeneutical injustice' differ from 'testimonial injustice' as described in the text?",
        options: [
          "Testimonial injustice is economic, whereas hermeneutical injustice is purely biological.",
          "Testimonial injustice involves credibility deflation, whereas hermeneutical injustice stems from structural gaps in collective concepts that render lived harms inarticulable.",
          "Testimonial injustice applies only to courtroom judges, while hermeneutical injustice applies only to universities.",
          "Hermeneutical injustice is completely eliminated once an election is held.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 3 and 4 explicitly distinguish the two: testimonial injustice assigns deflated credibility due to prejudice, while hermeneutical injustice occurs when shared interpretive concepts have structural gaps that obscure systemic harms.",
      },
      {
        id: "q-09-3",
        type: "Detail / Fact-based",
        questionText: "Why does the author cite the historical coining of the term 'sexual harassment' in the 1970s?",
        options: [
          "To provide a concrete historical example of overcoming a hermeneutical lacuna in collective legal understanding.",
          "To demonstrate the failure of the American court system.",
          "To argue that language has no impact on human civil rights.",
          "To criticize the 1970s labor movement.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 4 uses 'sexual harassment' as a prime example of filling a hermeneutical gap, allowing a previously inarticulable harm to be recognized as a systemic violation.",
      },
      {
        id: "q-09-4",
        type: "Tone / Attitude",
        questionText: "The author's attitude toward dominant groups who dismiss passionate minority protests as 'uncivil' can best be described as:",
        options: [
          "Supportive of their demand for orderly decorum.",
          "Sharply critical of their use of civility as a tool of epistemic silencing.",
          "Enthusiastic about their commitment to classical rhetoric.",
          "Ambivalent and neutral toward both sides.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 5 critiques how hegemonic groups set the rules of 'civilized tone' to dismiss minority protests, identifying this as a mechanism of epistemic silencing.",
      },
      {
        id: "q-09-5",
        type: "Purpose / Organization",
        questionText: "What is the primary function of the final paragraph?",
        options: [
          "To argue that democratic elections should be abandoned in favor of an authoritarian aristocracy.",
          "To propose a transition toward 'hermeneutic humility' and epistemic reparations as necessary conditions for true democracy.",
          "To summarize the biographical lives of Jürgen Habermas and Miranda Fricker.",
          "To demand the abolition of all public media panels.",
        ],
        correctOptionIndex: 1,
        explanation: "The final paragraph synthesizes the argument and calls for structural redesign of deliberative spaces and 'hermeneutic humility' to achieve genuine democratic legitimacy.",
      },
    ],
  },
  {
    id: "rc-10",
    title: "Aesthetic Autonomy in the Anthropocene: Art at the Threshold of Ecological Rupture",
    source: "Aeon",
    author: "Claire DeWitt",
    topic: "Environment",
    difficulty: "CAT+",
    wordCount: 930,
    estimatedMinutes: 10,
    completed: false,
    flaggedForReview: false,
    content: `For over two centuries, modern Western aesthetics has pivoted upon the doctrine of aesthetic autonomy—the philosophical proposition, articulated by Immanuel Kant and radicalized by Theodor Adorno, that authentic art occupies a sovereign realm detached from utilitarian function, didactic morality, or direct political instrumentality. In the Kantian schema, the aesthetic experience is defined by 'purposiveness without purpose' (Zweckmäßigkeit ohne Zweck)—a disinterested contemplative space wherein the subject encounters formal beauty or sublime terror insulated from raw appetitive drives.

However, the advent of the Anthropocene—the geological epoch wherein human industrial activity has become the primary planetary force altering the Earth's biophysical systems—inflicts a fatal rupture upon this autonomous aesthetic sphere. When retreating glaciers, acidified oceans, radioactive stratigraphic strata, and mass extinction events collapse the boundary between human culture and geological nature, the contemplative distance requisite for Kantian disinterestedness becomes an unviable luxury, if not a form of moral complicity.

Historically, the natural sublime—the aesthetic terror evoked by tempestuous oceans, precipitous alpine peaks, or boundless volcanic chasms—relied on the spectator's physical safety. As Kant observed in the Critique of Judgment, the sublime elevates the human spirit precisely because the observer, contemplating the overwhelming force of nature from a secure vantage point, realizes the superiority of human rational faculties over brute material chaos.

In the Anthropocene, however, there is no secure vantage point outside the storm. The planetary crisis is not an external spectacle viewed through a museum window; it is an ambient, ubiquitous catastrophe that envelops both observer and observed. When a wildfire incinerates a biome or an atmospheric river drowns a valley, human industrial emissions are inextricably woven into the thermodynamic engine of the catastrophe. The sublime is inverted: nature is no longer an infinite, indifferent titan towering over fragile humanity; it is a damaged, erratic, anthropogenic ghost haunting human civilization.

This ontological shift forces contemporary artists into a profound aesthetic dilemma. How does art represent hyperobjects—phenomena, such as global warming or microplastic accumulation, whose temporal and spatial dimensions radically exceed the capacity of human sensory perception?

Conventional artistic responses routinely fall into two sterile traps: moralizing didacticism and apocalyptic kitsch. Didactic art reduces the creative act to a pedagogical billboard, lecturing the spectator on carbon footprints through simplistic visual infographics that strip art of its ambiguous, dissonant potency. Conversely, apocalyptic kitsch aestheticizes ecological devastation through glossy, high-definition photographs of toxic industrial tailings or barren strip mines, transforming catastrophic violence into consumable, sublime spectacles for wealthy metropolitan gallery-goers.

To escape these impasses, a new ecological avant-garde is pioneering what philosopher Timothy Morton terms 'dark ecology'. Rather than attempting to represent nature as an idealized, pristine Eden separate from human technology, dark ecological art insists on radical entanglement, complicity, and mourning. It incorporates industrial waste, living bacterial cultures, and decaying polymers directly into the artistic medium, forcing the viewer into an uncomfortable visceral encounter with the non-human alterity that sustains and threatens our existence.

Authentic ecological art in the Anthropocene cannot offer easy catharsis or harmonious reconciliation. Its purpose is not to reassure humanity of its moral goodness or aesthetic sophistication, but to shatter the anthropocentric illusion of human mastery, creating a profound, disorienting grief that awakens our ethical responsibility toward the interconnected web of life.`,
    questions: [
      {
        id: "q-10-1",
        type: "Main Idea / Central Theme",
        questionText: "What is the primary argument of the author regarding art and aesthetics in the Anthropocene?",
        options: [
          "Classical Kantian aesthetic autonomy and disinterestedness are rendered unviable by the planetary reality of human-ecological entanglement.",
          "Artists should abandon ecological themes entirely and focus exclusively on geometric abstraction.",
          "High-definition photography of toxic mines is the most effective medium to inspire global environmental treaties.",
          "The Anthropocene has proven that human rational faculties are infinitely superior to natural forces.",
        ],
        correctOptionIndex: 0,
        explanation: "The passage demonstrates that the collapse of nature/culture boundaries in the Anthropocene destroys Kantian detached aesthetic autonomy, demanding an art of entanglement and complicity.",
      },
      {
        id: "q-10-2",
        type: "Inference",
        questionText: "According to the passage, why is Kant's concept of the 'natural sublime' fundamentally incompatible with the ecological reality of the Anthropocene?",
        options: [
          "Because Kant never witnessed a mountain or ocean during his lifetime.",
          "Because the Kantian sublime required a secure external vantage point, whereas Anthropocenic ecological catastrophe envelops the observer as both victim and cause.",
          "Because modern glaciers are expanding at unprecedented historical rates.",
          "Because contemporary gallery-goers refuse to pay entrance fees for sublime art.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 3 and 4 contrast Kant's sublime (which required the spectator to be in safety observing external nature) with the Anthropocene where there is 'no secure vantage point' and human activity is embedded in the storm.",
      },
      {
        id: "q-10-3",
        type: "Detail / Fact-based",
        questionText: "Which two sterile traps does the author identify in conventional artistic responses to the environmental crisis?",
        options: [
          "Baroque excess and classical minimalism.",
          "Moralizing didacticism and apocalyptic kitsch.",
          "Geometric cubism and photographic realism.",
          "Algorithmic surveillance and corporate rentierism.",
        ],
        correctOptionIndex: 1,
        explanation: "Paragraph 6 explicitly names and analyzes the two sterile traps: 'moralizing didacticism' (pedagogical lecturing) and 'apocalyptic kitsch' (aestheticizing toxic devastation).",
      },
      {
        id: "q-10-4",
        type: "Tone / Attitude",
        questionText: "The author's tone toward 'apocalyptic kitsch' in metropolitan galleries can best be described as:",
        options: [
          "Deeply critical of its superficial aestheticization of violence.",
          "Sympathetic to its commercial marketing strategy.",
          "Receptive to its educational impact on urban voters.",
          "Indifferent to art curation practices.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 6 criticizes apocalyptic kitsch for 'transforming catastrophic violence into consumable, sublime spectacles for wealthy metropolitan gallery-goers.'",
      },
      {
        id: "q-10-5",
        type: "Purpose / Organization",
        questionText: "What is the primary function of the penultimate paragraph discussing 'dark ecology'?",
        options: [
          "To provide a positive alternative path for art that embraces entanglement, complicity, and non-human alterity.",
          "To prove that Timothy Morton is superior to Immanuel Kant.",
          "To suggest that all museums should be closed due to bacterial contamination.",
          "To argue that polymers are the only legitimate artistic medium.",
        ],
        correctOptionIndex: 0,
        explanation: "Paragraph 7 introduces Timothy Morton's 'dark ecology' as a viable, authentic artistic pathway beyond the two sterile traps, incorporating entanglement and material complicity.",
      },
    ],
  },
];

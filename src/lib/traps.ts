export type TrapType =
  | "Too Broad"
  | "Too Narrow"
  | "Extreme Language"
  | "Outside Scope"
  | "Partial Truth"
  | "Distortion"
  | "Reversal"
  | "Wrong Referent"
  | "Tone Mismatch"
  | "Correct Fact, Wrong Question"
  | "Valid Elimination / Correct Option";

export interface TrapDefinition {
  type: TrapType;
  title: string;
  shortDescription: string;
  detailedMechanism: string;
  catExample: {
    passageExcerpt: string;
    questionPrompt: string;
    flawedOption: string;
    analysis: string;
  };
  eliminationRule: string;
  whenNotToEliminate: string;
}

export const CAT_TRAP_TAXONOMY: Record<TrapType, TrapDefinition> = {
  "Too Broad": {
    type: "Too Broad",
    title: "The Overgeneralization Trap (Too Broad)",
    shortDescription: "Expands the author's bounded claim into a universal claim across all domains or time periods.",
    detailedMechanism:
      "The test-maker takes a specific argument made about a particular domain (e.g. 'Enlightenment political philosophers in 18th-century Europe') and inflates it to encompass all human beings, all philosophical eras, or entire civilizations.",
    catExample: {
      passageExcerpt:
        "Condorcet and select French philosophes argued that rational pedagogy could eradicate religious dogmatism in post-revolutionary secular schools.",
      questionPrompt: "What is the central premise of the author regarding Enlightenment education?",
      flawedOption: "All human educational systems throughout history were designed to eliminate religious faith.",
      analysis:
        "The passage restricted its scope to Condorcet and French secular schools; the option inflates this to 'all educational systems throughout history'.",
    },
    eliminationRule: "Check the boundary conditions (who, where, when, under what constraints). If the option removes the qualifiers, eliminate it immediately.",
    whenNotToEliminate: "Do not eliminate if the author explicitly makes a philosophical macro-claim that applies universally.",
  },

  "Too Narrow": {
    type: "Too Narrow",
    title: "The Detail Fixation Trap (Too Narrow)",
    shortDescription: "Focuses on a secondary illustrative example or a single paragraph rather than the central thesis.",
    detailedMechanism:
      "Prevalent in Main Idea, Title, and Para-Summary questions. An option accurately states a fact mentioned in paragraph 3, but ignores the overarching argument spanning paragraphs 1, 2, and 4.",
    catExample: {
      passageExcerpt:
        "The decline of coral reefs is driven by rising ocean temperatures, acidification, and agricultural runoff. Specifically in the Great Barrier Reef, agricultural nitrogen caused explosive crown-of-thorns starfish blooms.",
      questionPrompt: "Which of the following best captures the main theme of the passage?",
      flawedOption: "The reproductive cycle of crown-of-thorns starfish in the Great Barrier Reef.",
      analysis:
        "Starfish blooms are merely a localized subordinate example illustrating the broader crisis of global marine degradation.",
    },
    eliminationRule: "For Main Idea/Summary questions, ask: 'Does this summarize the entire passage, or just one paragraph/example?'",
    whenNotToEliminate: "If the question explicitly asks about a specific detail ('According to paragraph 3...'), a narrow option is expected.",
  },

  "Extreme Language": {
    type: "Extreme Language",
    title: "The Absolute Qualifier Trap (Extreme Language)",
    shortDescription: "Injects categorical absolutes ('always', 'never', 'solely', 'impossible') where the author expressed nuance.",
    detailedMechanism:
      "Academic authors in CAT sources (Aeon, The Atlantic, Nature) rarely make unqualified dogmatic claims. Trap options sneak in words like 'invariably', 'wholly', 'indispensable', 'entirely', or 'completely'.",
    catExample: {
      passageExcerpt:
        "Behavioral economics suggests that human decision-making frequently deviates from classical rational-actor models under conditions of cognitive fatigue.",
      questionPrompt: "What can be inferred about human rationality?",
      flawedOption: "Human beings are fundamentally incapable of making rational choices in any economic scenario.",
      analysis:
        "The text said 'frequently deviates under cognitive fatigue'; the option morphed this into an absolute impossibility ('incapable in any scenario').",
    },
    eliminationRule: "Flag words like 'all', 'none', 'every', 'solely', 'only', 'never', 'must', 'impossible'. Match the author's degree of certainty.",
    whenNotToEliminate: "If the author explicitly used extreme language (e.g. 'X is impossible under thermodynamic laws'), then an extreme option is correct.",
  },

  "Outside Scope": {
    type: "Outside Scope",
    title: "The Plausible Extraneous Trap (Outside Scope)",
    shortDescription: "Sounds intellectually sophisticated and factually true in real life, but has zero textual evidence in the passage.",
    detailedMechanism:
      "Exploits external background knowledge. The option states something that is scientifically true or commonly known in current affairs, but the passage never discussed or implied it.",
    catExample: {
      passageExcerpt:
        "Thomas Kuhn argued that scientific paradigms shift not through gradual accretion of facts, but through sudden sociological and epistemological revolutions.",
      questionPrompt: "Which of the following is supported by the author's discussion of scientific progress?",
      flawedOption: "Peer-reviewed scientific journals often reject groundbreaking manuscripts due to editorial conservatism.",
      analysis:
        "While peer review bias is real in academia, Kuhn's passage discussed paradigm shifts, not journal editorial boards.",
    },
    eliminationRule: "Verify passage grounding. Ask: 'Can I point to the specific lines/premises that necessitate this conclusion?' If not, discard.",
    whenNotToEliminate: "In 'Application' questions ('Which analogous scenario matches the author's logic?'), outside examples are tested, but the relational structure must match.",
  },

  "Partial Truth": {
    type: "Partial Truth",
    title: "The Half-Truth / Poisoned Pill Trap",
    shortDescription: "Combines 80% verbatim accuracy with 20% subtle falsehood or unproven extrapolation.",
    detailedMechanism:
      "A student reads the first clause, recognizes text from the passage, feels a wave of relief, and picks it without reading the second half of the sentence where a fatal flaw is concealed.",
    catExample: {
      passageExcerpt:
        "Max Weber characterized modern bureaucracy as an 'iron cage' of rationalization that maximizes mechanical efficiency while eroding individual autonomy.",
      questionPrompt: "According to the passage, Max Weber's view of bureaucracy implies that:",
      flawedOption: "Bureaucracy maximizes administrative efficiency, thereby ensuring long-term democratic freedom.",
      analysis:
        "The first half ('maximizes efficiency') is true, but the second half ('ensuring democratic freedom') directly contradicts Weber's claim that it erodes autonomy.",
    },
    eliminationRule: "Read EVERY word of an option from first letter to last period. One incorrect modifier invalidates the entire option.",
    whenNotToEliminate: "If an option is concise and completely accurate without extra unverified clauses.",
  },

  "Distortion": {
    type: "Distortion",
    title: "The Semantic Twist / Misrepresentation Trap",
    shortDescription: "Alters the subtle causal, logical, or qualitative meaning of the author's statement.",
    detailedMechanism:
      "Uses identical vocabulary from the text but subtly rearranges relationships, transforms correlation into direct causation, or shifts conditional possibilities into certainties.",
    catExample: {
      passageExcerpt:
        "High smartphone penetration among teenagers correlates with an increase in reported feelings of social isolation during late evening hours.",
      questionPrompt: "Which statement can be inferred regarding technology use?",
      flawedOption: "Late-night smartphone use is the primary direct cause of psychological depression in adolescents.",
      analysis:
        "The passage cited a correlation with feelings of social isolation; the option mutated this into 'the primary direct cause of psychological depression'.",
    },
    eliminationRule: "Separate correlation from causation. Re-verify the precise verb used by the author vs the verb in the option.",
    whenNotToEliminate: "If the author established a strong causal link with words like 'engenders', 'precipitates', or 'is caused by'.",
  },

  "Reversal": {
    type: "Reversal",
    title: "The Relational Reversal Trap",
    shortDescription: "Inverts the relationship between subject and object, antecedent and consequence, or cause and effect.",
    detailedMechanism:
      "The passage argues that 'A leads to B under condition C'. The trap option claims that 'B produces A' or 'C prevents A'. Under time pressure, speed-readers miss the directional inversion.",
    catExample: {
      passageExcerpt:
        "The consolidation of institutional power by authoritarian regimes leads to the suppression of investigative journalism.",
      questionPrompt: "What does the passage establish about the media and authoritarian states?",
      flawedOption: "The decline of investigative journalism facilitates the consolidation of authoritarian power.",
      analysis:
        "Reverses the causal sequence. The passage asserts Regime Power -> Media Decline; the option claims Media Decline -> Regime Power.",
    },
    eliminationRule: "Draw a mental arrow: A -> B. Check if the option asserts B -> A.",
    whenNotToEliminate: "If the author explicitly described a feedback loop or reciprocal bidirectional causation.",
  },

  "Wrong Referent": {
    type: "Wrong Referent",
    title: "The Misattributed Subject Trap (Wrong Referent)",
    shortDescription: "Attributes the perspective of a criticized school of thought or third-party critic to the author themselves.",
    detailedMechanism:
      "In multi-perspective passages, the author often cites an opposing view ('Neoclassical economists assert that...') before dismantling it. The trap option takes that cited view and labels it as the author's own position.",
    catExample: {
      passageExcerpt:
        "Technological solutionists believe every social friction can be resolved with code. However, Morozov demonstrates this reflects a profound democratic deficit.",
      questionPrompt: "The author would agree with which of the following?",
      flawedOption: "Every social friction can be resolved with digital algorithmic architecture.",
      analysis:
        "This is the view of the 'technological solutionists' whom the author and Morozov are criticizing, not the author's view.",
    },
    eliminationRule: "Identify voice: Is this the author's thesis, a cited counter-argument, an interlocutor's claim, or historical context?",
    whenNotToEliminate: "When the question specifically asks: 'According to proponents of theory X...'",
  },

  "Tone Mismatch": {
    type: "Tone Mismatch",
    title: "The Rhetorical Register Trap (Tone Mismatch)",
    shortDescription: "Assigns a biased, dogmatic, cynical, or eulogistic tone to a balanced, analytical critique.",
    detailedMechanism:
      "Common in Tone/Attitude questions. Confuses 'skeptical scrutiny' with 'scornful derision', or 'qualified appreciation' with 'uncritical adulation'.",
    catExample: {
      passageExcerpt:
        "While the green transition presents formidable supply-chain bottlenecks, innovative battery chemistries offer promising decarbonization pathways.",
      questionPrompt: "The tone of the passage can best be described as:",
      flawedOption: "Pessimistic and dismissive of technological innovation.",
      analysis:
        "The author acknowledges bottlenecks (pragmatism) while highlighting promising chemistries (optimism); 'dismissive' is a severe tone mismatch.",
    },
    eliminationRule: "Plot tone on a 2-axis grid: Positive vs Negative, and Mild vs Extreme. CAT correct answers are almost always moderately nuanced.",
    whenNotToEliminate: "When an author is genuinely polemical or celebratory (e.g. an impassioned critique of corporate corruption).",
  },

  "Correct Fact, Wrong Question": {
    type: "Correct Fact, Wrong Question",
    title: "The Irrelevant Accuracy Trap (Wrong Question)",
    shortDescription: "A 100% accurate statement from the passage that does NOT answer the specific prompt asked.",
    detailedMechanism:
      "If the question asks: 'WHY did the author mention Walter Benjamin's aura?', a trap option describes 'WHAT the aura is' rather than the rhetorical reason why it was mentioned.",
    catExample: {
      passageExcerpt:
        "Walter Benjamin introduced the concept of the 'aura'—the unique presence of an artwork in space and time—to explain why mass mechanical reproduction fundamentally alters the ritualistic function of art.",
      questionPrompt: "Why does the author refer to Walter Benjamin's concept of the 'aura'?",
      flawedOption: "The aura is the unique presence and historical authenticity embedded in an original artwork.",
      analysis:
        "The option accurately defines the aura (factually true in text), but fails to answer the question 'WHY' it was mentioned (to explain how mechanical reproduction alters art's ritual function).",
    },
    eliminationRule: "Always re-read the interrogative keyword in the question prompt: Why? How? What consequence? What assumption? Ensure the option matches the question type.",
    whenNotToEliminate: "When the question is a direct factual query ('Which of the following is true regarding X?').",
  },

  "Valid Elimination / Correct Option": {
    type: "Valid Elimination / Correct Option",
    title: "The Gold Standard Answer",
    shortDescription: "Maintains scope, matches authorial conviction, answers the exact prompt, and is unassailable under logical scrutiny.",
    detailedMechanism:
      "Accurately captures the primary argument or deductive consequence without distorting qualifiers, exaggerating boundaries, or adding unmentioned claims.",
    catExample: {
      passageExcerpt:
        "Research in neuroplasticity reveals that adult cortical maps can reorganize in response to sustained cognitive training, contrary to early 20th-century dogmas of neural rigidity.",
      questionPrompt: "What is the primary implication of neuroplasticity research?",
      flawedOption: "Adult brains retain structural and functional adaptability rather than remaining unalterably static.",
      analysis: "Directly mirrors the passage's contrast between cortical reorganization and early dogmas of neural rigidity without distortion.",
    },
    eliminationRule: "Keep this as your target benchmark when eliminating flawed distractors.",
    whenNotToEliminate: "Never eliminate!",
  },
};

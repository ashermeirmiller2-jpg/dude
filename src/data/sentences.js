// Talmudic sentences for learning - pulled from Sefaria API
// Each sentence is tagged with words, chunks, difficulty, and discourse function

export const SENTENCES = [
  // Difficulty Tier 1: 2-3 word chunks
  {
    id: "s001",
    aramaic: "אָמַר רַב",
    translation: "Rav said",
    transliteration: "amar rav",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w001", "w002"],
    chunk_ids: ["c001"],
    discourse_function: "statement",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s002",
    aramaic: "מַאי קָאָמַר",
    translation: "What is he saying?",
    transliteration: "mai ka amar",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w004", "w005", "w001"],
    chunk_ids: ["c002"],
    discourse_function: "question",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s003",
    aramaic: "תָּנוּ רַבָּנַן",
    translation: "The Rabbis taught",
    transliteration: "tanu rabbanan",
    sefaria_ref: "Multiple occurrences (introduces Baraita)",
    tractate: "General",
    daf: null,
    word_ids: ["w025", "w026"],
    chunk_ids: ["c003"],
    discourse_function: "statement",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s004",
    aramaic: "מַאי טַעְמָא",
    translation: "What is the reason?",
    transliteration: "mai ta'ama",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w004", "w022"],
    chunk_ids: ["c004"],
    discourse_function: "question",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s005",
    aramaic: "הֵיכִי דָּמֵי",
    translation: "What are the circumstances?",
    transliteration: "heichi damei",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w023", "w024"],
    chunk_ids: ["c005"],
    discourse_function: "question",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s006",
    aramaic: "תָּא שְׁמַע",
    translation: "Come and hear",
    transliteration: "ta shema",
    sefaria_ref: "Multiple occurrences (introduces proof)",
    tractate: "General",
    daf: null,
    word_ids: ["w027", "w028"],
    chunk_ids: ["c006"],
    discourse_function: "proof",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s007",
    aramaic: "קַשְׁיָא",
    translation: "This is a difficulty",
    transliteration: "kashya",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w030"],
    chunk_ids: ["c007"],
    discourse_function: "objection",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s008",
    aramaic: "לָא קַשְׁיָא",
    translation: "It is not a difficulty",
    transliteration: "la kashya",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w011", "w030"],
    chunk_ids: ["c008"],
    discourse_function: "resolution",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s009",
    aramaic: "פָּשִׁיטָא",
    translation: "Obviously",
    transliteration: "peshita",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w032"],
    chunk_ids: ["c009"],
    discourse_function: "answer",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s010",
    aramaic: "אֶלָּא",
    translation: "Rather",
    transliteration: "ella",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w012"],
    chunk_ids: ["c010"],
    discourse_function: "resolution",
    difficulty_tier: 1,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  
  // Difficulty Tier 2: 4-6 word sentences
  {
    id: "s011",
    aramaic: "אָמַר רַב לֵיה",
    translation: "Rav said to him",
    transliteration: "amar rav leih",
    sefaria_ref: "Multiple occurrences",
    tractate: "Berakhot",
    daf: "2a",
    word_ids: ["w001", "w002", "w003"],
    chunk_ids: ["c001"],
    discourse_function: "statement",
    difficulty_tier: 2,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s012",
    aramaic: "מַאי קָאָמַר לֵיה",
    translation: "What is he saying to him?",
    transliteration: "mai ka amar leih",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w004", "w005", "w001", "w003"],
    chunk_ids: ["c002"],
    discourse_function: "question",
    difficulty_tier: 2,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s013",
    aramaic: "אִיכָּא דְּאָמְרִי",
    translation: "There are those who say",
    transliteration: "ikka de'amri",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w036", "w009", "w001"],
    chunk_ids: ["c011"],
    discourse_function: "statement",
    difficulty_tier: 2,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s014",
    aramaic: "בִּשְׁלָמָא הָכִי",
    translation: "Granted, so it is",
    transliteration: "bishlama hachi",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w052", "w021"],
    chunk_ids: ["c012"],
    discourse_function: "concession",
    difficulty_tier: 2,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s015",
    aramaic: "אֶלָּא מַאי אִיכָּא",
    translation: "But what is there?",
    transliteration: "ella mai ikka",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w012", "w004", "w036"],
    chunk_ids: ["c013"],
    discourse_function: "question",
    difficulty_tier: 2,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  
  // Difficulty Tier 3: 7-12 word sentences (two clauses)
  {
    id: "s016",
    aramaic: "אָמַר רַב כָּל הַסּוֹמֵךְ גְּאֻלָּה לִתְפִלָּה",
    translation: "Rav said: Anyone who joins redemption to prayer",
    transliteration: "amar rav kol hasomech geulah litfillah",
    sefaria_ref: "Berakhot 9b",
    tractate: "Berakhot",
    daf: "9b",
    word_ids: ["w001", "w002", "w019"],
    chunk_ids: [],
    discourse_function: "statement",
    difficulty_tier: 3,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  {
    id: "s017",
    aramaic: "מִכְּדֵי אָמַר רַב לֵיה הָכִי נָמֵי",
    translation: "Since Rav said to him so, likewise",
    transliteration: "mikkedei amar rav leih hachi nami",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w060", "w001", "w002", "w003", "w021", "w059"],
    chunk_ids: [],
    discourse_function: "clarification",
    difficulty_tier: 3,
    global_shown_count: 0,
    global_correct_rate: 0
  },
  
  // Predict What's Next examples (partial sentences)
  {
    id: "s018",
    aramaic: "אָמַר רַב ...",
    translation: "Rav said [a ruling]",
    transliteration: "amar rav...",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w001", "w002"],
    chunk_ids: ["c001"],
    discourse_function: "prediction",
    difficulty_tier: 4,
    global_shown_count: 0,
    global_correct_rate: 0,
    is_prediction: true,
    prediction_hint: "A ruling or statement follows"
  },
  {
    id: "s019",
    aramaic: "מַאי טַעְמָא ...",
    translation: "What is the reason [for this law]?",
    transliteration: "mai ta'ama...",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w004", "w022"],
    chunk_ids: ["c004"],
    discourse_function: "prediction",
    difficulty_tier: 4,
    global_shown_count: 0,
    global_correct_rate: 0,
    is_prediction: true,
    prediction_hint: "An explanation follows"
  },
  {
    id: "s020",
    aramaic: "תָּא שְׁמַע ...",
    translation: "Come and hear [a proof from...]",
    transliteration: "ta shema...",
    sefaria_ref: "Multiple occurrences",
    tractate: "General",
    daf: null,
    word_ids: ["w027", "w028"],
    chunk_ids: ["c006"],
    discourse_function: "prediction",
    difficulty_tier: 4,
    global_shown_count: 0,
    global_correct_rate: 0,
    is_prediction: true,
    prediction_hint: "A textual proof follows"
  }
];

// Chunk patterns catalog
export const CHUNKS = [
  {
    id: "c001",
    aramaic: "אָמַר רַב X",
    transliteration: "amar rav X",
    translation: "Rav X said",
    discourse_function: "statement",
    description: "Introduces a teaching from Rav",
    before_typically: "Previous discussion or question",
    after_typically: "A ruling or legal statement",
    difficulty: "beginner",
    examples: [
      "אָמַר רַב יְהוּדָה",
      "אָמַר רַב נַחְמָן",
      "אָמַר רַב שֵׁשֶׁת"
    ]
  },
  {
    id: "c002",
    aramaic: "מַאי קָאָמַר",
    transliteration: "mai ka amar",
    translation: "What is he saying?",
    discourse_function: "question",
    description: "Asks for clarification of a statement",
    before_typically: "A difficult or ambiguous statement",
    after_typically: "An explanation or rephrasing",
    difficulty: "beginner",
    examples: [
      "מַאי קָאָמַר לֵיה",
      "מַאי קָאמְרִינַן"
    ]
  },
  {
    id: "c003",
    aramaic: "תָּנוּ רַבָּנַן",
    transliteration: "tanu rabbanan",
    translation: "The Rabbis taught",
    discourse_function: "statement",
    description: "Introduces a Baraita (external teaching)",
    before_typically: "Discussion of a Mishnah or law",
    after_typically: "A supporting or contrasting teaching",
    difficulty: "beginner",
    examples: [
      "תָּנוּ רַבָּנַן כֵּיצַד",
      "תָּנוּ רַבָּנַן מַעֲשֶׂה"
    ]
  },
  {
    id: "c004",
    aramaic: "מַאי טַעְמָא",
    transliteration: "mai ta'ama",
    translation: "What is the reason?",
    discourse_function: "question",
    description: "Asks for the logical basis of a law",
    before_typically: "A stated law or ruling",
    after_typically: "An explanation or scriptural source",
    difficulty: "beginner",
    examples: [
      "מַאי טַעְמָא דְּרַבִּי",
      "מַאי טַעְמָא הָכִי"
    ]
  },
  {
    id: "c005",
    aramaic: "הֵיכִי דָּמֵי",
    transliteration: "heichi damei",
    translation: "What are the circumstances?",
    discourse_function: "question",
    description: "Asks for the specific case being discussed",
    before_typically: "A general statement or dispute",
    after_typically: "A clarification of the scenario",
    difficulty: "beginner",
    examples: [
      "הֵיכִי דָּמֵי אִילֵימָא",
      "הֵיכִי דָּמֵי בְּשֶׁלֹּא"
    ]
  },
  {
    id: "c006",
    aramaic: "תָּא שְׁמַע",
    transliteration: "ta shema",
    translation: "Come and hear",
    discourse_function: "proof",
    description: "Introduces a proof text",
    before_typically: "A question or uncertainty",
    after_typically: "A verse or teaching that resolves it",
    difficulty: "beginner",
    examples: [
      "תָּא שְׁמַע דִּכְתִיב",
      "תָּא שְׁמַע מִמַּתְנִיתִין"
    ]
  },
  {
    id: "c007",
    aramaic: "קַשְׁיָא",
    transliteration: "kashya",
    translation: "This is a difficulty",
    discourse_function: "objection",
    description: "States that there is a problem with the argument",
    before_typically: "A proposed answer or interpretation",
    after_typically: "A resolution or admission of difficulty",
    difficulty: "beginner",
    examples: [
      "קַשְׁיָא",
      "וְקַשְׁיָא"
    ]
  },
  {
    id: "c008",
    aramaic: "לָא קַשְׁיָא",
    transliteration: "la kashya",
    translation: "It is not a difficulty",
    discourse_function: "resolution",
    description: "Resolves an apparent contradiction",
    before_typically: "A stated difficulty (קַשְׁיָא)",
    after_typically: "An explanation of how both can be true",
    difficulty: "beginner",
    examples: [
      "לָא קַשְׁיָא הָא בְּ",
      "לָא קַשְׁיָא כָּאן בְּ"
    ]
  },
  {
    id: "c009",
    aramaic: "פָּשִׁיטָא",
    transliteration: "peshita",
    translation: "Obviously",
    discourse_function: "answer",
    description: "Indicates something is self-evident",
    before_typically: "A question about an obvious point",
    after_typically: "Sometimes an explanation of why it needed stating",
    difficulty: "beginner",
    examples: [
      "פָּשִׁיטָא",
      "פְּשִׁיטָא לֵיה"
    ]
  },
  {
    id: "c010",
    aramaic: "אֶלָּא",
    transliteration: "ella",
    translation: "Rather",
    discourse_function: "resolution",
    description: "Signals a retraction and restart of reasoning",
    before_typically: "A rejected explanation or approach",
    after_typically: "The correct explanation or approach",
    difficulty: "beginner",
    examples: [
      "אֶלָּא לְעוֹלָם",
      "אֶלָּא הָכִי קָאָמַר"
    ]
  },
  {
    id: "c011",
    aramaic: "אִיכָּא דְּאָמְרִי",
    transliteration: "ikka de'amri",
    translation: "There are those who say",
    discourse_function: "statement",
    description: "Introduces an alternative version of a teaching",
    before_typically: "A stated teaching or ruling",
    after_typically: "A variant formulation",
    difficulty: "intermediate",
    examples: [
      "אִיכָּא דְּאָמְרִי לֵיה",
      "וְאִיכָּא דְּאָמְרִי"
    ]
  },
  {
    id: "c012",
    aramaic: "בִּשְׁלָמָא",
    transliteration: "bishlama",
    translation: "Granted, it is true that",
    discourse_function: "concession",
    description: "Concedes one point before challenging another",
    before_typically: "A comparison or contrast being drawn",
    after_typically: "The conceded point, followed by a challenge",
    difficulty: "intermediate",
    examples: [
      "בִּשְׁלָמָא הָכִי",
      "בִּשְׁלָמָא לְדִבְרֵי"
    ]
  },
  {
    id: "c013",
    aramaic: "אֶלָּא מַאי",
    transliteration: "ella mai",
    translation: "But what?",
    discourse_function: "question",
    description: "Asks for the alternative after rejecting one option",
    before_typically: "A rejected explanation",
    after_typically: "The correct explanation",
    difficulty: "intermediate",
    examples: [
      "אֶלָּא מַאי אִיכָּא",
      "אֶלָּא מַאי הוּא"
    ]
  }
];

export const getSentencesByDifficulty = (tier) => {
  return SENTENCES.filter(s => s.difficulty_tier === tier);
};

export const getSentenceById = (id) => {
  return SENTENCES.find(s => s.id === id);
};

export const getAllSentences = () => {
  return SENTENCES;
};

export const getChunkById = (id) => {
  return CHUNKS.find(c => c.id === id);
};

export const getAllChunks = () => {
  return CHUNKS;
};

// Filter sentences by word coverage (for SRS engine)
export const getSentencesWithKnownWords = (knownWordIds, minCoverage = 0.7) => {
  return SENTENCES.filter(sentence => {
    const totalWords = sentence.word_ids.length;
    if (totalWords === 0) return false;
    
    const knownCount = sentence.word_ids.filter(wordId => 
      knownWordIds.includes(wordId)
    ).length;
    
    return (knownCount / totalWords) >= minCoverage;
  });
};

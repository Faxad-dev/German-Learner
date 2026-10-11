import { Lesson, Stage } from '../types/curriculum';

export const CURRICULUM_STAGES: Stage[] = [
  {
    id: 'stage-0',
    level: 'Pre-A1',
    title: 'Stage 0: Getting Started & Essential Sounds',
    description: 'Master German phonetics, umlauts (ä, ö, ü, ß), survival greetings, and numbers 1–20.',
    badge: 'Phonetic Foundation',
    lessonIds: ['lesson-0-1', 'lesson-0-2']
  },
  {
    id: 'stage-1',
    level: 'A1',
    title: 'Stage 1: Introducing Yourself & Others',
    description: 'Learn to say your name, origin, languages, and ask polite questions with du vs. Sie.',
    badge: 'First Conversation',
    lessonIds: ['lesson-1-1', 'lesson-1-2']
  },
  {
    id: 'stage-2',
    level: 'A1',
    title: 'Stage 2: Building Sentences & Noun Genders',
    description: 'Master German word order (Verb in Position 2), der/die/das, and negation with nicht vs. kein.',
    badge: 'Sentence Mastery',
    lessonIds: ['lesson-2-1', 'lesson-2-2']
  },
  {
    id: 'stage-3',
    level: 'A1',
    title: 'Stage 3: Everyday Situations (Café & Shopping)',
    description: 'Order food and drinks politely, ask for prices in euros, and handle supermarket transactions.',
    badge: 'Practical Missions',
    lessonIds: ['lesson-3-1', 'lesson-3-2']
  },
  {
    id: 'stage-4',
    level: 'A2',
    title: 'Stage 4: Getting Around & Making Appointments',
    description: 'Ask for directions, understand public transit schedules, and schedule appointments politely.',
    badge: 'Independent City Life',
    lessonIds: ['lesson-4-1']
  }
];

export const CURRICULUM_LESSONS: Lesson[] = [
  // LESSON 0.1
  {
    id: 'lesson-0-1',
    stageId: 'stage-0',
    level: 'Pre-A1',
    order: 1,
    title: 'German Sounds, Umlauts & Essential Greetings',
    subtitle: 'Learn how German letters sound and master basic polite greetings.',
    durationMinutes: 10,
    objective: 'By the end of this lesson, you can pronounce German umlauts (ä, ö, ü, ß) and greet people at different times of day.',
    essentialVocabulary: [
      {
        id: 'v-0-1',
        german: 'Guten Morgen',
        english: 'Good morning',
        phonetic: 'goo-ten mor-gen',
        exampleDe: 'Guten Morgen, Frau Müller!',
        exampleEn: 'Good morning, Ms. Müller!',
        notes: 'Used until approx. 11:00 AM'
      },
      {
        id: 'v-0-2',
        german: 'Guten Tag',
        english: 'Good day / Hello',
        phonetic: 'goo-ten tahk',
        exampleDe: 'Guten Tag! Wie geht es Ihnen?',
        exampleEn: 'Good day! How are you? (formal)',
        notes: 'General polite greeting during the day'
      },
      {
        id: 'v-0-3',
        german: 'Guten Abend',
        english: 'Good evening',
        phonetic: 'goo-ten ah-bent',
        exampleDe: 'Guten Abend, Herr Schmidt.',
        exampleEn: 'Good evening, Mr. Schmidt.',
        notes: 'Used after approx. 6:00 PM'
      },
      {
        id: 'v-0-4',
        german: 'Auf Wiedersehen',
        english: 'Goodbye (formal)',
        phonetic: 'owf vee-der-zay-en',
        exampleDe: 'Auf Wiedersehen und schönen Tag noch!',
        exampleEn: 'Goodbye and have a nice day!',
        notes: 'Literally means "until we see each other again"'
      },
      {
        id: 'v-0-5',
        german: 'Tschüss',
        english: 'Bye (informal)',
        phonetic: 'chooss',
        exampleDe: 'Tschüss, bis morgen!',
        exampleEn: 'Bye, see you tomorrow!',
        notes: 'Notice the ü with umlaut'
      },
      {
        id: 'v-0-6',
        german: 'Bitte',
        english: 'Please / You are welcome',
        phonetic: 'bit-teh',
        exampleDe: 'Eine Tasse Kaffee, bitte.',
        exampleEn: 'A cup of coffee, please.',
        notes: 'Has dual meaning: please and you are welcome'
      },
      {
        id: 'v-0-7',
        german: 'Danke schön',
        english: 'Thank you very much',
        phonetic: 'dahn-keh shoen',
        exampleDe: 'Danke schön für die Hilfe!',
        exampleEn: 'Thank you very much for the help!'
      }
    ],
    grammarInContext: {
      title: 'Umlauts (Ä, Ö, Ü) and the Sharp S (ß)',
      explanation: 'German has four special characters that change the sound completely: Ä (like "e" in bed), Ö (round lips like "oo" but say "eh"), Ü (round lips like whistling and say "ee"), and ß (a sharp unvoiced double "s"). All German nouns are strictly capitalized!',
      examples: [
        { de: 'die Äpfel', en: 'the apples', highlight: 'Ä' },
        { de: 'schön', en: 'beautiful / nice', highlight: 'ö' },
        { de: 'die Übung', en: 'the exercise', highlight: 'Ü' },
        { de: 'die Straße', en: 'the street', highlight: 'ß' }
      ],
      commonMistake: {
        wrong: 'die strasse / guten tag',
        right: 'die Straße / Guten Tag',
        reason: 'German nouns and polite greeting titles must always start with a capital letter!'
      }
    },
    dialogue: {
      title: 'Greeting at the Reception',
      context: 'Lukas arrives at a language school in Berlin in the morning.',
      lines: [
        { speaker: 'Empfangsdame', role: 'Receptionist', de: 'Guten Morgen! Herzlich willkommen.', en: 'Good morning! Welcome.' },
        { speaker: 'Lukas', role: 'Learner', de: 'Guten Morgen! Ich bin Lukas.', en: 'Good morning! I am Lukas.' },
        { speaker: 'Empfangsdame', role: 'Receptionist', de: 'Schön, Sie zu sehen. Bitte nehmen Sie Platz.', en: 'Nice to see you. Please take a seat.' },
        { speaker: 'Lukas', role: 'Learner', de: 'Danke schön!', en: 'Thank you very much!' }
      ],
      comprehensionQuestion: {
        question: 'What time of day does this conversation take place?',
        options: ['Late evening', 'Morning', 'Middle of the night', 'Goodbye at afternoon'],
        correctIndex: 1,
        explanation: 'Both speakers greet each other with "Guten Morgen" (Good morning).'
      }
    },
    exercises: [
      {
        id: 'ex-0-1',
        type: 'multiple_choice',
        prompt: 'Which greeting is appropriate when meeting a business partner at 2:00 PM?',
        options: ['Guten Morgen', 'Guten Tag', 'Gute Nacht', 'Tschüss'],
        correctAnswer: 1,
        explanation: '"Guten Tag" is the standard daytime polite greeting.'
      },
      {
        id: 'ex-0-2',
        type: 'listening_choice',
        prompt: 'Listen to the phrase and select the correct translation:',
        audioText: 'Auf Wiedersehen',
        options: ['Good night', 'Goodbye (formal)', 'Good morning', 'Please'],
        correctAnswer: 1,
        explanation: '"Auf Wiedersehen" means formal goodbye.'
      },
      {
        id: 'ex-0-3',
        type: 'word_scramble',
        prompt: 'Rearrange these words to form the polite sentence: "Thank you very much!"',
        options: ['schön', 'Danke'],
        correctAnswer: 'Danke schön',
        acceptableAnswers: ['Danke schön'],
        explanation: 'In German, "Danke" comes first followed by "schön".'
      }
    ],
    realLifeMission: {
      scenario: 'You walk into a bakery in Frankfurt at 9:00 AM.',
      task: 'Greet the baker politely and ask for a bread roll ("ein Brötchen, bitte").',
      modelAnswer: 'Guten Morgen! Ein Brötchen, bitte.',
      hints: ['Use morning greeting', 'Add "bitte" at the end for politeness'],
      keyPhrases: ['Guten Morgen', 'Ein Brötchen, bitte', 'Danke schön']
    },
    summaryTakeaways: [
      'Guten Morgen (morning), Guten Tag (day), Guten Abend (evening), Gute Nacht (bedtime).',
      'All German nouns are capitalized (der Tag, das Brötchen).',
      'Umlauts (ä, ö, ü) change the pronunciation and meaning significantly.'
    ]
  },

  // LESSON 1.1
  {
    id: 'lesson-1-1',
    stageId: 'stage-1',
    level: 'A1.1',
    order: 2,
    title: 'Introducing Yourself (Name, Origin, Residence)',
    subtitle: 'Learn how to state your name, where you come from, and where you live.',
    durationMinutes: 12,
    objective: 'By the end of this lesson, you can introduce yourself with "Ich heiße...", "Ich komme aus...", and "Ich wohne in...".',
    essentialVocabulary: [
      {
        id: 'v-1-1',
        german: 'heißen',
        english: 'to be called / named',
        phonetic: 'hye-ssen',
        exampleDe: 'Ich heiße Sarah.',
        exampleEn: 'My name is Sarah / I am called Sarah.'
      },
      {
        id: 'v-1-2',
        german: 'kommen aus',
        english: 'to come from',
        phonetic: 'kom-men ows',
        exampleDe: 'Ich komme aus Deutschland.',
        exampleEn: 'I come from Germany.'
      },
      {
        id: 'v-1-3',
        german: 'wohnen in',
        english: 'to live / reside in',
        phonetic: 'voh-nen in',
        exampleDe: 'Ich wohne in Berlin.',
        exampleEn: 'I live in Berlin.'
      },
      {
        id: 'v-1-4',
        german: 'Wer bist du?',
        english: 'Who are you? (informal)',
        phonetic: 'vehr bist doo',
        exampleDe: 'Hallo, wer bist du?',
        exampleEn: 'Hello, who are you?'
      },
      {
        id: 'v-1-5',
        german: 'Wie heißen Sie?',
        english: 'What is your name? (formal)',
        phonetic: 'vee hye-ssen zee',
        exampleDe: 'Guten Tag, wie heißen Sie?',
        exampleEn: 'Good day, what is your name?'
      },
      {
        id: 'v-1-6',
        german: 'Freut mich',
        english: 'Pleased to meet you',
        phonetic: 'froyt mish',
        exampleDe: 'Sehr erfreut / Freut mich!',
        exampleEn: 'Pleased to meet you!'
      }
    ],
    grammarInContext: {
      title: 'Verbs in the Present Tense: ich vs. du vs. Sie',
      explanation: 'In German, verbs change their ending depending on who is doing the action. The verb stem takes: -e for ich (I), -st for du (you informal), and -en for Sie (you formal).',
      examples: [
        { de: 'Ich komm-e aus Spanien.', en: 'I come from Spain.', highlight: '-e' },
        { de: 'Woher komm-st du?', en: 'Where do you come from? (informal)', highlight: '-st' },
        { de: 'Woher komm-en Sie?', en: 'Where do you come from? (formal)', highlight: '-en' }
      ],
      commonMistake: {
        wrong: 'Ich kommen aus Berlin.',
        right: 'Ich komme aus Berlin.',
        reason: 'For "ich" (I), regular verbs end in "-e", not "-en"!'
      }
    },
    dialogue: {
      title: 'Meeting a Colleague at Work',
      context: 'Elena meets Mark on his first day at an international office in Munich.',
      lines: [
        { speaker: 'Elena', role: 'Colleague', de: 'Hallo! Ich heiße Elena. Und wie heißt du?', en: 'Hello! My name is Elena. And what is your name?' },
        { speaker: 'Mark', role: 'New colleague', de: 'Hallo Elena, ich bin Mark. Freut mich!', en: 'Hello Elena, I am Mark. Nice to meet you!' },
        { speaker: 'Elena', role: 'Colleague', de: 'Woher kommst du, Mark?', en: 'Where do you come from, Mark?' },
        { speaker: 'Mark', role: 'New colleague', de: 'Ich komme aus Kanada, aber jetzt wohne ich in München.', en: 'I come from Canada, but now I live in Munich.' }
      ],
      comprehensionQuestion: {
        question: 'Where is Mark originally from?',
        options: ['Munich', 'Canada', 'Germany', 'Spain'],
        correctIndex: 1,
        explanation: 'Mark states: "Ich komme aus Kanada" (I come from Canada).'
      }
    },
    exercises: [
      {
        id: 'ex-1-1',
        type: 'multiple_choice',
        prompt: 'Fill in the blank: "Ich _____ aus Italien."',
        options: ['kommst', 'komme', 'kommen', 'kommt'],
        correctAnswer: 1,
        explanation: 'The pronoun "ich" requires the verb ending "-e" (Ich komme).'
      },
      {
        id: 'ex-1-2',
        type: 'word_scramble',
        prompt: 'Put the words in correct German word order: "I live in Berlin."',
        options: ['in', 'Ich', 'Berlin', 'wohne'],
        correctAnswer: 'Ich wohne in Berlin',
        acceptableAnswers: ['Ich wohne in Berlin'],
        explanation: 'In German main statements, the conjugated verb "wohne" must be in Position 2.'
      },
      {
        id: 'ex-1-3',
        type: 'listening_choice',
        prompt: 'Listen and identify the question being asked:',
        audioText: 'Woher kommen Sie?',
        options: ['Where do you live?', 'Where do you come from?', 'What is your name?', 'How are you?'],
        correctAnswer: 1,
        explanation: '"Woher kommen Sie?" asks for origin (Where do you come from?).'
      }
    ],
    realLifeMission: {
      scenario: 'You are introducing yourself at a language meetup in Vienna.',
      task: 'State your name and where you live in two connected German sentences.',
      modelAnswer: 'Hallo, ich heiße David. Ich wohne in Wien.',
      hints: ['Start with "Ich heiße..."', 'Follow with "Ich wohne in..."'],
      keyPhrases: ['Ich heiße...', 'Ich wohne in...']
    },
    summaryTakeaways: [
      'Use "Ich heiße [Name]" or "Ich bin [Name]" to introduce yourself.',
      'Use "aus" for country/city of origin (aus Deutschland, aus Pakistan, aus den USA).',
      'Remember verb endings: ich komm-e, du komm-st, Sie komm-en.'
    ]
  },

  // LESSON 2.1
  {
    id: 'lesson-2-1',
    stageId: 'stage-2',
    level: 'A1.1',
    order: 3,
    title: 'Basic Sentence Structure & Verb in Position 2',
    subtitle: 'The golden rule of German grammar: the conjugated verb always sits in second place.',
    durationMinutes: 15,
    objective: 'By the end of this lesson, you will master the "Verb in Position 2" rule and construct statements correctly even when starting with time or place.',
    essentialVocabulary: [
      {
        id: 'v-2-1',
        german: 'heute',
        english: 'today',
        phonetic: 'hoy-teh',
        exampleDe: 'Heute lerne ich Deutsch.',
        exampleEn: 'Today I am learning German.'
      },
      {
        id: 'v-2-2',
        german: 'lernen',
        english: 'to learn / study',
        phonetic: 'lehr-nen',
        exampleDe: 'Wir lernen jeden Tag.',
        exampleEn: 'We learn every day.'
      },
      {
        id: 'v-2-3',
        german: 'sprechen',
        english: 'to speak',
        phonetic: 'shpreh-khen',
        exampleDe: 'Ich spreche ein bisschen Deutsch.',
        exampleEn: 'I speak a little German.'
      },
      {
        id: 'v-2-4',
        german: 'verstehen',
        english: 'to understand',
        phonetic: 'fehr-shtay-en',
        exampleDe: 'Ich verstehe das nicht.',
        exampleEn: 'I do not understand that.'
      },
      {
        id: 'v-2-5',
        german: 'nicht',
        english: 'not (negation for verbs/adjectives)',
        phonetic: 'nisht',
        exampleDe: 'Das ist nicht teuer.',
        exampleEn: 'That is not expensive.'
      },
      {
        id: 'v-2-6',
        german: 'kein / keine',
        english: 'no / not any (negation for nouns)',
        phonetic: 'kyne / kye-neh',
        exampleDe: 'Ich habe kein Auto.',
        exampleEn: 'I have no car / I do not have a car.'
      }
    ],
    grammarInContext: {
      title: 'The Golden German Rule: Verb in Position 2 (V2)',
      explanation: 'In regular German statements, the conjugated verb ALWAYS occupies Position 2. If you start the sentence with time (e.g. "Heute..."), the subject swaps places and goes to Position 3 so that the verb stays in Position 2!',
      examples: [
        { de: 'Ich lerne heute Deutsch.', en: 'I am learning German today. (Subject in Pos 1, Verb in Pos 2)' },
        { de: 'Heute lerne ich Deutsch.', en: 'Today I am learning German. (Time in Pos 1, Verb in Pos 2, Subject in Pos 3!)' }
      ],
      commonMistake: {
        wrong: 'Heute ich lerne Deutsch.',
        right: 'Heute lerne ich Deutsch.',
        reason: 'In English we say "Today I learn", but in German the verb must stay in Position 2!'
      }
    },
    dialogue: {
      title: 'Asking for Clarification in Class',
      context: 'A student does not understand the teacher\'s sentence.',
      lines: [
        { speaker: 'Lehrer', role: 'Teacher', de: 'Verstehen Sie diesen Satz?', en: 'Do you understand this sentence?' },
        { speaker: 'Student', role: 'Learner', de: 'Entschuldigung, ich verstehe das nicht. Sprechen Sie bitte langsamer.', en: 'Excuse me, I do not understand that. Please speak more slowly.' },
        { speaker: 'Lehrer', role: 'Teacher', de: 'Kein Problem! Heute wiederholen wir die Grammatik.', en: 'No problem! Today we repeat the grammar.' },
        { speaker: 'Student', role: 'Learner', de: 'Vielen Dank!', en: 'Thank you very much!' }
      ],
      comprehensionQuestion: {
        question: 'What does the student ask the teacher to do?',
        options: ['Speak louder', 'Speak more slowly', 'Write on the board', 'Cancel the class'],
        correctIndex: 1,
        explanation: 'The student says: "Sprechen Sie bitte langsamer" (Please speak more slowly).'
      }
    },
    exercises: [
      {
        id: 'ex-2-1',
        type: 'multiple_choice',
        prompt: 'Which sentence correctly follows German Position 2 rule?',
        options: [
          'Morgen ich gehe zur Arbeit.',
          'Morgen gehe ich zur Arbeit.',
          'Morgen ich zur Arbeit gehe.',
          'Gehe morgen ich zur Arbeit.'
        ],
        correctAnswer: 1,
        explanation: '"Morgen gehe ich..." has the verb "gehe" in Position 2, followed by the subject "ich".'
      },
      {
        id: 'ex-2-2',
        type: 'multiple_choice',
        prompt: 'Fill in the correct negation: "Ich habe _____ Zeit." (Zeit is a noun: time)',
        options: ['nicht', 'keine', 'kein', 'nichts'],
        correctAnswer: 1,
        explanation: 'Nouns with feminine gender (die Zeit) are negated with "keine".'
      },
      {
        id: 'ex-2-3',
        type: 'word_scramble',
        prompt: 'Construct the sentence: "I do not understand that."',
        options: ['das', 'Ich', 'nicht', 'verstehe'],
        correctAnswer: 'Ich verstehe das nicht',
        acceptableAnswers: ['Ich verstehe das nicht'],
        explanation: '"Ich" (Pos 1), "verstehe" (Pos 2), "das nicht" (object and negation at the end).'
      }
    ],
    realLifeMission: {
      scenario: 'Someone speaks too fast to you on the train.',
      task: 'Say politely that you do not understand and ask them to speak slowly.',
      modelAnswer: 'Entschuldigung, ich verstehe nicht. Bitte sprechen Sie langsam.',
      hints: ['Use "Entschuldigung"', 'Ask with "bitte sprechen Sie langsam"'],
      keyPhrases: ['Entschuldigung', 'Ich verstehe nicht', 'Sprechen Sie bitte langsam']
    },
    summaryTakeaways: [
      'The conjugated verb is ALWAYS in Position 2 in declarative sentences.',
      'Use "nicht" to negate verbs and adjectives ("Ich verstehe nicht").',
      'Use "kein / keine" to negate nouns ("Ich habe keine Zeit").'
    ]
  },

  // LESSON 3.1
  {
    id: 'lesson-3-1',
    stageId: 'stage-3',
    level: 'A1.2',
    order: 4,
    title: 'Im Café (Ordering Food & Drinks Politely)',
    subtitle: 'Order coffee, water, and snacks, ask for prices, and ask for the bill.',
    durationMinutes: 15,
    objective: 'By the end of this lesson, you can order a drink using "Ich möchte...", ask "Was kostet das?", and pay the bill with "Zahlen, bitte".',
    essentialVocabulary: [
      {
        id: 'v-3-1',
        german: 'der Kaffee',
        english: 'coffee',
        gender: 'der',
        phonetic: 'dehr kahf-fay',
        exampleDe: 'Ich möchte einen Kaffee, bitte.',
        exampleEn: 'I would like a coffee, please.'
      },
      {
        id: 'v-3-2',
        german: 'das Wasser',
        english: 'water',
        gender: 'das',
        phonetic: 'dahs vahs-ser',
        exampleDe: 'Ein Glas Wasser, bitte.',
        exampleEn: 'A glass of water, please.'
      },
      {
        id: 'v-3-3',
        german: 'der Tee',
        english: 'tea',
        gender: 'der',
        phonetic: 'dehr tay',
        exampleDe: 'Möchten Sie schwarzen oder grünen Tee?',
        exampleEn: 'Would you like black or green tea?'
      },
      {
        id: 'v-3-4',
        german: 'die Rechnung',
        english: 'bill / check',
        gender: 'die',
        phonetic: 'dee rekh-noong',
        exampleDe: 'Die Rechnung, bitte.',
        exampleEn: 'The check, please.'
      },
      {
        id: 'v-3-5',
        german: 'Ich möchte...',
        english: 'I would like...',
        phonetic: 'ish moesh-teh',
        exampleDe: 'Ich möchte ein Stück Kuchen.',
        exampleEn: 'I would like a piece of cake.'
      },
      {
        id: 'v-3-6',
        german: 'zusammen oder getrennt?',
        english: 'together or separate?',
        phonetic: 'tsoo-zahm-men oh-der geh-trent',
        exampleDe: 'Zahlen Sie zusammen oder getrennt?',
        exampleEn: 'Are you paying together or separately?'
      }
    ],
    grammarInContext: {
      title: 'Accusative Case for Direct Objects (der -> den / einen)',
      explanation: 'When ordering something masculine, the article changes to Akkusativ because it is the object of your sentence! "der Kaffee" becomes "einen Kaffee" or "den Kaffee". Feminine (die / eine) and Neuter (das / ein) remain unchanged.',
      examples: [
        { de: 'Ich möchte einen Kaffee. (der Kaffee -> einen)', en: 'I would like a coffee.', highlight: 'einen' },
        { de: 'Ich möchte ein Wasser. (das Wasser -> ein)', en: 'I would like a water.', highlight: 'ein' },
        { de: 'Ich möchte eine Cola. (die Cola -> eine)', en: 'I would like a cola.', highlight: 'eine' }
      ],
      commonMistake: {
        wrong: 'Ich möchte ein Kaffee.',
        right: 'Ich möchte einen Kaffee.',
        reason: 'Kaffee is masculine (der Kaffee), so in the accusative case it requires "einen"!'
      }
    },
    dialogue: {
      title: 'Ordering at a Café in Vienna',
      context: 'Anna sits down at Café Central to order.',
      lines: [
        { speaker: 'Kellner', role: 'Waiter', de: 'Guten Tag! Was darf es sein?', en: 'Good day! What may I get you?' },
        { speaker: 'Anna', role: 'Guest', de: 'Guten Tag. Ich möchte einen Cappuccino und ein Mineralwasser, bitte.', en: 'Good day. I would like a cappuccino and a sparkling water, please.' },
        { speaker: 'Kellner', role: 'Waiter', de: 'Sehr gerne. Sonst noch etwas?', en: 'With pleasure. Anything else?' },
        { speaker: 'Anna', role: 'Guest', de: 'Nein danke, das ist alles.', en: 'No thank you, that is all.' },
        { speaker: 'Anna', role: 'Guest (later)', de: 'Entschuldigung, wir möchten zahlen, bitte.', en: 'Excuse me, we would like to pay, please.' },
        { speaker: 'Kellner', role: 'Waiter', de: 'Gerne. Zusammen oder getrennt?', en: 'Gladly. Together or separate?' },
        { speaker: 'Anna', role: 'Guest', de: 'Zusammen, bitte. Mit Karte.', en: 'Together, please. By card.' }
      ],
      comprehensionQuestion: {
        question: 'How does Anna wish to pay?',
        options: ['Cash separately', 'Together by card', 'Bank transfer', 'She forgot her wallet'],
        correctIndex: 1,
        explanation: 'Anna answers: "Zusammen, bitte. Mit Karte" (Together, please. By card).'
      }
    },
    exercises: [
      {
        id: 'ex-3-1',
        type: 'multiple_choice',
        prompt: 'You want to order tea (der Tee). What is the grammatically correct German phrase?',
        options: [
          'Ich möchte ein Tee, bitte.',
          'Ich möchte einen Tee, bitte.',
          'Ich möchte eine Tee, bitte.',
          'Ich möchte dem Tee, bitte.'
        ],
        correctAnswer: 1,
        explanation: '"Tee" is masculine, so in accusative direct object position it becomes "einen Tee".'
      },
      {
        id: 'ex-3-2',
        type: 'word_scramble',
        prompt: 'Form the sentence to ask for the bill: "The check, please."',
        options: ['bitte', 'Die', 'Rechnung'],
        correctAnswer: 'Die Rechnung bitte',
        acceptableAnswers: ['Die Rechnung bitte', 'Die Rechnung, bitte'],
        explanation: '"Die Rechnung, bitte" is the standard natural way to ask for the bill.'
      },
      {
        id: 'ex-3-3',
        type: 'listening_choice',
        prompt: 'Listen to the waiter\'s question:',
        audioText: 'Zahlen Sie zusammen oder getrennt?',
        options: [
          'Do you want sugar or milk?',
          'Are you paying together or separately?',
          'Is the coffee hot or cold?',
          'Would you like dessert?'
        ],
        correctAnswer: 1,
        explanation: '"Zusammen oder getrennt" is asked in restaurants across Germany/Austria to know if bills are split.'
      }
    ],
    realLifeMission: {
      scenario: 'You are at a café in Berlin. The waiter comes to your table.',
      task: 'Order one espresso and one mineral water, and say thank you politely.',
      modelAnswer: 'Ich möchte einen Espresso und ein Mineralwasser, bitte. Danke schön!',
      hints: ['Espresso is masculine -> einen Espresso', 'Wasser is neuter -> ein Mineralwasser'],
      keyPhrases: ['Ich möchte einen...', 'und ein Mineralwasser, bitte', 'Danke schön!']
    },
    summaryTakeaways: [
      'Say "Ich möchte [item], bitte" to order politely.',
      'Masculine nouns change to "einen" (einen Kaffee, einen Tee, einen Apfelsaft).',
      'Pay with "Zahlen, bitte" or "Die Rechnung, bitte", and specify "bar" (cash) or "mit Karte" (card).'
    ]
  },

  // LESSON 4.1
  {
    id: 'lesson-4-1',
    stageId: 'stage-4',
    level: 'A2.1',
    order: 5,
    title: 'Nach dem Weg fragen (Directions & Public Transport)',
    subtitle: 'Ask where the train station or pharmacy is, and understand left, right, and straight ahead.',
    durationMinutes: 15,
    objective: 'By the end of this lesson, you can ask "Wo ist...?", understand directions (links, rechts, geradeaus), and buy a transit ticket.',
    essentialVocabulary: [
      {
        id: 'v-4-1',
        german: 'der Bahnhof',
        english: 'train station',
        gender: 'der',
        phonetic: 'dehr bahn-hohf',
        exampleDe: 'Wo ist der Bahnhof?',
        exampleEn: 'Where is the train station?'
      },
      {
        id: 'v-4-2',
        german: 'die Apotheke',
        english: 'pharmacy',
        gender: 'die',
        phonetic: 'dee ah-poh-tay-keh',
        exampleDe: 'Gibt es hier eine Apotheke?',
        exampleEn: 'Is there a pharmacy here?'
      },
      {
        id: 'v-4-3',
        german: 'geradeaus',
        english: 'straight ahead',
        phonetic: 'geh-rah-deh-ows',
        exampleDe: 'Gehen Sie immer geradeaus.',
        exampleEn: 'Go straight ahead.'
      },
      {
        id: 'v-4-4',
        german: 'links / rechts',
        english: 'left / right',
        phonetic: 'links / rekh-ts',
        exampleDe: 'Biegen Sie nach links ab.',
        exampleEn: 'Turn left.'
      },
      {
        id: 'v-4-5',
        german: 'die Fahrkarte',
        english: 'transit ticket',
        gender: 'die',
        phonetic: 'dee fahr-kahr-teh',
        exampleDe: 'Eine Fahrkarte nach Hamburg, bitte.',
        exampleEn: 'A ticket to Hamburg, please.'
      }
    ],
    grammarInContext: {
      title: 'Imperative & Giving Directions (Gehen Sie / Fahren Sie)',
      explanation: 'When giving polite directions to someone you don\'t know, invert the verb and "Sie": "Gehen Sie geradeaus" (Go straight ahead), "Biegen Sie rechts ab" (Turn right).',
      examples: [
        { de: 'Gehen Sie 200 Meter geradeaus.', en: 'Walk 200 meters straight ahead.' },
        { de: 'Nehmen Sie die U-Bahn Linie 2.', en: 'Take the subway line 2.' }
      ],
      commonMistake: {
        wrong: 'Sie gehen nach links abbiegen.',
        right: 'Biegen Sie nach links ab.',
        reason: 'In polite commands, the conjugated verb comes first: "Biegen Sie... ab".'
      }
    },
    dialogue: {
      title: 'Finding the Train Station in Cologne',
      context: 'A tourist lost near the cathedral asks a local for directions to the main station.',
      lines: [
        { speaker: 'Tourist', role: 'Visitor', de: 'Entschuldigung, wo ist der Hauptbahnhof?', en: 'Excuse me, where is the main train station?' },
        { speaker: 'Passant', role: 'Local resident', de: 'Der Hauptbahnhof ist ganz in der Nähe. Gehen Sie hier geradeaus und dann nach rechts.', en: 'The main station is very close. Go straight ahead here and then to the right.' },
        { speaker: 'Tourist', role: 'Visitor', de: 'Ist es weit zu Fuß?', en: 'Is it far on foot?' },
        { speaker: 'Passant', role: 'Local resident', de: 'Nein, nur zwei Minuten. Sie sehen ihn direkt.', en: 'No, only two minutes. You will see it directly.' },
        { speaker: 'Tourist', role: 'Visitor', de: 'Vielen Dank für Ihre Hilfe!', en: 'Thank you very much for your help!' },
        { speaker: 'Passant', role: 'Local resident', de: 'Gern geschehen! Einen schönen Tag noch.', en: 'You are welcome! Have a nice day.' }
      ],
      comprehensionQuestion: {
        question: 'How far is the train station from where the tourist is standing?',
        options: ['15 minutes by bus', 'Only two minutes on foot', 'Across town in another city', 'Far away'],
        correctIndex: 1,
        explanation: 'The local says: "Nur zwei Minuten zu Fuß" (Only two minutes on foot).'
      }
    },
    exercises: [
      {
        id: 'ex-4-1',
        type: 'multiple_choice',
        prompt: 'How do you ask: "Where is the pharmacy?"',
        options: [
          'Wo ist die Apotheke?',
          'Wo wohnt die Apotheke?',
          'Wie heißt die Apotheke?',
          'Wann kommt die Apotheke?'
        ],
        correctAnswer: 0,
        explanation: '"Wo ist die Apotheke?" is the direct, correct question.'
      },
      {
        id: 'ex-4-2',
        type: 'listening_choice',
        prompt: 'Listen to the direction given:',
        audioText: 'Gehen Sie geradeaus und dann nach links.',
        options: [
          'Go straight ahead and then turn right.',
          'Go straight ahead and then turn left.',
          'Turn around and take the bus.',
          'Stop here and wait.'
        ],
        correctAnswer: 1,
        explanation: '"geradeaus" = straight ahead, "nach links" = to the left.'
      }
    ],
    realLifeMission: {
      scenario: 'You are at a ticket counter (Fahrkartenschalter) in Zurich.',
      task: 'Buy one ticket to Berlin and ask what platform (Gleis) the train departs from.',
      modelAnswer: 'Guten Tag, eine Fahrkarte nach Berlin, bitte. Von welchem Gleis fährt der Zug ab?',
      hints: ['Start with "Guten Tag"', 'Request "eine Fahrkarte nach Berlin, bitte"'],
      keyPhrases: ['Guten Tag', 'eine Fahrkarte nach Berlin, bitte', 'Von welchem Gleis?']
    },
    summaryTakeaways: [
      'Ask "Entschuldigung, wo ist [Ort]?" to ask for directions politely.',
      'Key directions: geradeaus (straight), nach links (left), nach rechts (right).',
      'For public transport: die Fahrkarte (ticket), der Bahnhof (station), das Gleis (platform).'
    ]
  }
];

// Spaced Repetition Flashcards populated from the curriculum
export const INITIAL_SRS_FLASHCARDS = CURRICULUM_LESSONS.flatMap(lesson => 
  lesson.essentialVocabulary.map(v => ({
    id: `card-${v.id}`,
    word: v.german,
    article: v.gender,
    plural: v.plural,
    meaning: v.english,
    exampleDe: v.exampleDe,
    exampleEn: v.exampleEn,
    level: lesson.level,
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: Date.now() - 1000 // due immediately for new learners
  }))
);

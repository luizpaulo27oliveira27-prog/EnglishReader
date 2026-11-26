import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Word = {
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
};

type Expression = {
  phrase: string;
  meaning: string;
  pronunciation: string;
  example: string;
};

type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

type Story = {
  id: string;
  title: string;
  level: EnglishLevel;
  words: string[];
  expressions?: string[];
  paragraphs: string[];
};

const levelNames: Record<EnglishLevel, string> = {
  A1: 'Iniciante',
  A2: 'Básico',
  B1: 'Intermediário',
  B2: 'Intermediário superior',
  C1: 'Avançado',
  C2: 'Domínio pleno',
};

const englishLevels: EnglishLevel[] = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
];

const words: Record<string, Word> = {
  walk: {
    word: 'walk',
    meaning: 'caminhar / caminhada',
    pronunciation: 'wók',
    example: 'I take a walk every morning.',
  },
  weather: {
    word: 'weather',
    meaning: 'tempo / clima',
    pronunciation: 'uéder',
    example: 'The weather is beautiful today.',
  },
  beautiful: {
    word: 'beautiful',
    meaning: 'bonito / bonita',
    pronunciation: 'biútiful',
    example: 'The park is beautiful.',
  },
  quiet: {
    word: 'quiet',
    meaning: 'quieto / silencioso',
    pronunciation: 'kuáiət',
    example: 'The streets are quiet.',
  },
  noticed: {
    word: 'noticed',
    meaning: 'notei / percebeu',
    pronunciation: 'nôutist',
    example: 'I noticed a beautiful tree.',
  },
  enjoying: {
    word: 'enjoying',
    meaning: 'aproveitando / desfrutando',
    pronunciation: 'indjói-ing',
    example: 'They are enjoying the afternoon.',
  },
  morning: {
    word: 'morning',
    meaning: 'manhã',
    pronunciation: 'mór-ning',
    example: 'I wake up early every morning.',
  },
  breakfast: {
    word: 'breakfast',
    meaning: 'café da manhã',
    pronunciation: 'brék-fast',
    example: 'I make breakfast every day.',
  },
  coffee: {
    word: 'coffee',
    meaning: 'café (bebida)',
    pronunciation: 'kó-fi',
    example: 'I drink a cup of coffee.',
  },
  quickly: {
    word: 'quickly',
    meaning: 'rapidamente',
    pronunciation: 'kuík-li',
    example: 'I get dressed quickly.',
  },
  ready: {
    word: 'ready',
    meaning: 'pronto / pronta',
    pronunciation: 'ré-di',
    example: 'Everything is ready.',
  },
  supermarket: {
    word: 'supermarket',
    meaning: 'supermercado',
    pronunciation: 'sú-per-már-kit',
    example: 'I go to the supermarket.',
  },
  price: {
    word: 'price',
    meaning: 'preço',
    pronunciation: 'práis',
    example: 'What is the price?',
  },
  cheap: {
    word: 'cheap',
    meaning: 'barato / barata',
    pronunciation: 'tchíp',
    example: 'These apples are cheap.',
  },
  expensive: {
    word: 'expensive',
    meaning: 'caro / cara',
    pronunciation: 'ik-spén-siv',
    example: 'This bag is expensive.',
  },
  buy: {
    word: 'buy',
    meaning: 'comprar',
    pronunciation: 'bái',
    example: 'I want to buy some bread.',
  },
  countryside: {
    word: 'countryside',
    meaning: 'campo / zona rural',
    pronunciation: 'kân-tri-sáid',
    example: 'My grandparents live in the countryside.',
  },
  grandparents: {
    word: 'grandparents',
    meaning: 'avós',
    pronunciation: 'grând-pé-rents',
    example: 'I visited my grandparents last weekend.',
  },
  arrived: {
    word: 'arrived',
    meaning: 'chegou / chegaram',
    pronunciation: 'a-ráivd',
    example: 'We arrived at the farm in the morning.',
  },
  journey: {
    word: 'journey',
    meaning: 'viagem / percurso',
    pronunciation: 'djâr-ni',
    example: 'The journey was long but beautiful.',
  },
  decided: {
    word: 'decided',
    meaning: 'decidiu / decidiram',
    pronunciation: 'di-sái-did',
    example: 'We decided to stay another day.',
  },
  peaceful: {
    word: 'peaceful',
    meaning: 'tranquilo / pacífico',
    pronunciation: 'píss-fol',
    example: 'The countryside is peaceful and quiet.',
  },
  fresh: {
    word: 'fresh',
    meaning: 'fresco / fresca',
    pronunciation: 'frésh',
    example: 'We had fresh fruit for breakfast.',
  },
  collected: {
    word: 'collected',
    meaning: 'recolheu / colheram',
    pronunciation: 'ko-lék-tid',
    example: 'We collected vegetables from the garden.',
  },
  vegetables: {
    word: 'vegetables',
    meaning: 'vegetais / legumes',
    pronunciation: 'védj-ta-bols',
    example: 'Fresh vegetables are good for your health.',
  },
  although: {
    word: 'although',
    meaning: 'embora / apesar de que',
    pronunciation: 'ól-dhôu',
    example: 'Although it was cold, we went outside.',
  },
  spent: {
    word: 'spent',
    meaning: 'passou / passaram (tempo)',
    pronunciation: 'spént',
    example: 'We spent the weekend together.',
  },
  returned: {
    word: 'returned',
    meaning: 'retornou / voltaram',
    pronunciation: 'ri-târnd',
    example: 'We returned home on Sunday.',
  },
  downtown: {
    word: 'downtown',
    meaning: 'centro da cidade',
    pronunciation: 'dáun-táun',
    example: 'We walked around downtown.',
  },
  crowded: {
    word: 'crowded',
    meaning: 'lotado / movimentado',
    pronunciation: 'cráu-did',
    example: 'The streets were crowded.',
  },
  station: {
    word: 'station',
    meaning: 'estação',
    pronunciation: 'stêi-shan',
    example: 'We arrived at the station.',
  },
  subway: {
    word: 'subway',
    meaning: 'metrô',
    pronunciation: 'sâb-uêi',
    example: 'We took the subway downtown.',
  },
  bought: {
    word: 'bought',
    meaning: 'comprou / compraram',
    pronunciation: 'bót',
    example: 'I bought a ticket.',
  },
  ticket: {
    word: 'ticket',
    meaning: 'bilhete / passagem',
    pronunciation: 'tí-ket',
    example: 'I bought a ticket for the museum.',
  },
  entrance: {
    word: 'entrance',
    meaning: 'entrada',
    pronunciation: 'ên-trans',
    example: 'We waited near the entrance.',
  },
  explored: {
    word: 'explored',
    meaning: 'explorou / exploraram',
    pronunciation: 'ik-splórd',
    example: 'We explored the old streets.',
  },
  museum: {
    word: 'museum',
    meaning: 'museu',
    pronunciation: 'miu-zí-am',
    example: 'The museum was very interesting.',
  },
  guide: {
    word: 'guide',
    meaning: 'guia',
    pronunciation: 'gáid',
    example: 'The guide explained the history.',
  },
  instead: {
    word: 'instead',
    meaning: 'em vez disso',
    pronunciation: 'in-stéd',
    example: 'We walked instead of taking a taxi.',
  },
  missed: {
    word: 'missed',
    meaning: 'perdeu / perderam',
    pronunciation: 'mist',
    example: 'We missed the bus.',
  },
  workplace: {
    word: 'workplace',
    meaning: 'local de trabalho / ambiente profissional',
    pronunciation: 'uârk-plêiss',
    example: 'My workplace is near my home.',
  },
  employee: {
    word: 'employee',
    meaning: 'funcionário / empregado',
    pronunciation: 'em-plói-í',
    example: 'She is a new employee.',
  },
  manager: {
    word: 'manager',
    meaning: 'gerente / administrador',
    pronunciation: 'mé-ni-djer',
    example: 'My manager is very friendly.',
  },
  colleague: {
    word: 'colleague',
    meaning: 'colega de trabalho',
    pronunciation: 'kó-líig',
    example: 'I had lunch with my colleague.',
  },
  schedule: {
    word: 'schedule',
    meaning: 'horário / programação',
    pronunciation: 'ské-djul',
    example: 'My schedule is very busy today.',
  },
  meeting: {
    word: 'meeting',
    meaning: 'reunião',
    pronunciation: 'mí-ting',
    example: 'We have a meeting at ten.',
  },
  task: {
    word: 'task',
    meaning: 'tarefa',
    pronunciation: 'tásk',
    example: 'I finished an important task.',
  },
  deadline: {
    word: 'deadline',
    meaning: 'prazo final',
    pronunciation: 'déd-láin',
    example: 'The deadline is Friday.',
  },
  completed: {
    word: 'completed',
    meaning: 'concluiu / concluído',
    pronunciation: 'kam-plí-tid',
    example: 'She completed her work on time.',
  },
  break: {
    word: 'break',
    meaning: 'pausa / intervalo',
    pronunciation: 'brêik',
    example: 'We took a short break.',
  },
  tired: {
    word: 'tired',
    meaning: 'cansado / cansada',
    pronunciation: 'táird',
    example: 'I was tired after work.',
  },
  symptom: {
    word: 'symptom',
    meaning: 'sintoma',
    pronunciation: 'símp-tam',
    example: 'A headache is a common symptom.',
  },
  headache: {
    word: 'headache',
    meaning: 'dor de cabeça',
    pronunciation: 'héd-eik',
    example: 'I have a terrible headache.',
  },
  fever: {
    word: 'fever',
    meaning: 'febre',
    pronunciation: 'fí-ver',
    example: 'She has a high fever.',
  },
  cough: {
    word: 'cough',
    meaning: 'tosse',
    pronunciation: 'kóf',
    example: 'He has a bad cough.',
  },
  appointment: {
    word: 'appointment',
    meaning: 'consulta / compromisso marcado',
    pronunciation: 'a-póint-ment',
    example: "I have a doctor's appointment today.",
  },
  medicine: {
    word: 'medicine',
    meaning: 'remédio / medicamento',
    pronunciation: 'mé-di-sin',
    example: 'The doctor gave me some medicine.',
  },
  prescription: {
    word: 'prescription',
    meaning: 'receita médica',
    pronunciation: 'pri-skríp-shan',
    example: 'I need a prescription for this medicine.',
  },
  pain: {
    word: 'pain',
    meaning: 'dor',
    pronunciation: 'pêin',
    example: 'I feel pain in my back.',
  },
  throat: {
    word: 'throat',
    meaning: 'garganta',
    pronunciation: 'thrôut',
    example: 'My throat hurts when I swallow.',
  },
  invite: {
    word: 'invite',
    meaning: 'convidar',
    pronunciation: 'in-váit',
    example: 'I want to invite my friends to the party.',
  },
  available: {
    word: 'available',
    meaning: 'disponível',
    pronunciation: 'a-vêi-la-bol',
    example: 'Are you available this Saturday?',
  },
  concert: {
    word: 'concert',
    meaning: 'show / concerto',
    pronunciation: 'kón-sert',
    example: 'We are going to a concert tonight.',
  },
  movie: {
    word: 'movie',
    meaning: 'filme',
    pronunciation: 'mú-vi',
    example: 'Would you like to watch a movie?',
  },
  join: {
    word: 'join',
    meaning: 'juntar-se / participar',
    pronunciation: 'dj óin',
    example: 'Would you like to join us?',
  },
  suggest: {
    word: 'suggest',
    meaning: 'sugerir',
    pronunciation: 'sâg-djést',
    example: 'I suggest meeting at seven.',
  },
  prefer: {
    word: 'prefer',
    meaning: 'preferir',
    pronunciation: 'pri-fâr',
    example: 'I prefer going to the cinema.',
  },
  meet: {
    word: 'meet',
    meaning: 'encontrar-se / conhecer',
    pronunciation: 'míit',
    example: "Let's meet at the restaurant.",
  },
  cancel: {
    word: 'cancel',
    meaning: 'cancelar',
    pronunciation: 'kén-sel',
    example: "We don't want to cancel our plans.",
  },
  plan: {
    word: 'plan',
    meaning: 'plano / planejar',
    pronunciation: 'plén',
    example: 'We have a plan for the weekend.',
  },
  rest: {
    word: 'rest',
    meaning: 'descansar / descanso',
    pronunciation: 'rést',
    example: 'You should get some rest.',
  },
  recover: {
    word: 'recover',
    meaning: 'recuperar-se',
    pronunciation: 'ri-kâ-ver',
    example: 'I hope you recover soon.',
  },
};

const expressionDictionary: Record<string, Expression> = {
  "what's up": {
    phrase: "What's up?",
    meaning: 'E aí? / Tudo bem? / O que houve?',
    pronunciation: 'uóts âp',
    example: "Hey, James! What's up?",
  },
  'would you like to': {
    phrase: 'Would you like to...?',
    meaning: 'Você gostaria de...?',
    pronunciation: 'wud iu láik tu',
    example: 'Would you like to go to the cinema?',
  },
  'that sounds great': {
    phrase: 'That sounds great!',
    meaning: 'Isso parece ótimo!',
    pronunciation: 'dhét sáundz grêit',
    example: 'That sounds great! What time?',
  },
  'how about': {
    phrase: 'How about...?',
    meaning: 'Que tal...?',
    pronunciation: 'háu abáut',
    example: 'How about seven o’clock?',
  },
};

const SAVED_WORDS_KEY = '@englishreader_saved_words';
const SAVED_EXPRESSIONS_KEY = '@englishreader_saved_expressions';

const stories: Story[] = [
  {
    id: 'walk-in-the-park',
    title: 'A Walk in the Park',
    level: 'A1',
    words: [
      'walk',
      'weather',
      'beautiful',
      'quiet',
      'noticed',
      'enjoying',
    ],
    paragraphs: [
      'Yesterday, I decided to take a walk through the park.',
      'The weather was beautiful, and the streets were quiet.',
      'I noticed many people enjoying the afternoon.',
      'Some people were reading books, while others were talking with their friends.',
      'I sat under a tree and watched the world around me.',
    ],
  },
  {
    id: 'busy-morning',
    title: 'A Busy Morning',
    level: 'A1',
    words: [
      'morning',
      'breakfast',
      'coffee',
      'quickly',
      'ready',
    ],
    paragraphs: [
      'Every morning, I wake up early.',
      'I make breakfast and drink a cup of coffee.',
      'Then, I get dressed quickly.',
      'I check my bag and make sure everything is ready.',
      'Finally, I leave home and start my day.',
    ],

  },
  {
    id: 'at-the-supermarket',
    title: 'At the Supermarket',
    level: 'A1',
    words: [
      'supermarket',
      'price',
      'cheap',
      'expensive',
      'buy',
    ],
    paragraphs: [
      'Today, I go to the supermarket to buy some food.',
      'I need milk, bread, eggs, and apples.',
      'I check the price of each product.',
      'Some products are cheap, but others are expensive.',
      'I choose what I need and pay at the checkout.',
    ],
  },
  {
    id: 'weekend-in-the-countryside',
    title: 'A Weekend in the Countryside',
    level: 'A2',
    words: [
      'countryside',
      'grandparents',
      'arrived',
      'journey',
      'decided',
      'peaceful',
      'fresh',
      'collected',
      'vegetables',
      'although',
      'spent',
      'returned',
    ],
    paragraphs: [
      'Last Friday, my family and I decided to spend the weekend in the countryside.',
      'We visited my grandparents, who live on a small farm far from the city.',
      'The journey took three hours, but we enjoyed the beautiful views along the way. We arrived just before sunset.',
      'The farm was peaceful, and the air was fresh. On Saturday morning, my grandfather showed us his garden.',
      'We collected vegetables together and prepared a delicious lunch. Although the work was tiring, it was a lot of fun.',
      'In the afternoon, we walked near the river and talked about our childhood memories. We spent the evening with our grandparents.',
      'On Sunday, we had breakfast together and returned home. It was a wonderful weekend, and we promised to visit again soon.',
    ],
  },
  {
    id: 'a-day-in-the-city',
    title: 'A Day in the City',
    level: 'A2',
    words: [
      'downtown',
      'crowded',
      'station',
      'subway',
      'bought',
      'ticket',
      'entrance',
      'explored',
      'museum',
      'guide',
      'instead',
      'missed',
    ],
    paragraphs: [
      'Last Saturday, my sister and I spent the day downtown.',
      'The streets were crowded, so we decided to take the subway instead of a taxi.',
      'We walked to the station and bought a ticket each.',
      'When we arrived at the museum, we waited near the entrance.',
      'A friendly guide welcomed us and showed us the most interesting rooms.',
      'We explored the museum for two hours and learned many things about the city.',
      'After lunch, we wanted to take the bus, but we missed it. Instead, we walked through the city center and enjoyed the afternoon.',
      'It was a busy day, but we had a wonderful time together.',
    ],
  },
  {
    id: 'a-day-at-work',
    title: 'A Day at Work',
    level: 'A2',
    words: [
      'workplace',
      'employee',
      'manager',
      'colleague',
      'arrived',
      'schedule',
      'meeting',
      'task',
      'deadline',
      'completed',
      'break',
      'tired',
    ],
    paragraphs: [
      'Emma is an employee at a small company in the city.',
      'She arrived at her workplace at eight o’clock and checked her schedule for the day.',
      'Her manager asked her to prepare a report before the afternoon meeting.',
      'Emma worked with a colleague to finish an important task.',
      'They had a short break and talked about their plans for the weekend.',
      'After lunch, Emma checked the report and completed it before the deadline.',
      'At the end of the day, she was tired, but she felt happy because she had done a good job.',
    ],
  },
  {
    id: 'a-visit-to-the-doctor',
    title: 'A Visit to the Doctor',
    level: 'A2',
    words: [
      'symptom',
      'headache',
      'fever',
      'cough',
      'appointment',
      'medicine',
      'prescription',
      'pain',
      'throat',
      'rest',
      'recover',
      'break',
      'tired',
    ],
    paragraphs: [
      'Last Monday, Daniel woke up with a terrible headache and a sore throat.',
      'He also had a fever and a bad cough, so he decided to make a doctor’s appointment.',
      'At the clinic, the doctor asked him about his symptoms and where he felt pain.',
      'Daniel explained that his throat hurt and that he had been feeling tired for two days.',
      'The doctor examined him and wrote a prescription for some medicine.',
      'She told him to get plenty of rest and drink enough water.',
      'Daniel followed her advice and stayed home for a few days.',
      'Soon, he began to feel better and hoped to recover completely before the weekend.',
    ],
  },
  {
    id: 'making-plans-with-friends',
    title: 'Making Plans with Friends',
    level: 'A2',
    words: [
      'invite',
      'available',
      'concert',
      'movie',
      'join',
      'suggest',
      'prefer',
      'meet',
      'cancel',
      'plan',
    ],
    expressions: [
      "what's up",
      'would you like to',
      'that sounds great',
      'how about',
    ],
    paragraphs: [
      "Emma sent a message to her friend James on Friday afternoon.",
      "Emma: Hi, James! What's up?",
      "James: Not much! How are you?",
      "Emma: I'm planning to go to the cinema this Saturday. Would you like to join me?",
      "James: That sounds great! I'm available in the evening.",
      "Emma: Perfect! How about seven o'clock?",
      "James: Sounds good! Do you want to watch a comedy movie?",
      "Emma: I'd prefer an action movie, but a comedy is fine too.",
      "James: Great! Let's meet in front of the cinema at half past six.",
      "Emma: Perfect! I'll invite Sarah too. I think she would like to come.",
      "James: Good idea! We have a plan, then.",
      "Emma: See you on Saturday!",
    ],
  },
];


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<Expression | null>(null);
  const [currentStory, setCurrentStory] = useState<Story>(stories[0]);
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>('A1');
  const filteredStories = stories.filter(
    (story) => story.level === selectedLevel
  );
  const selectLevel = (level: EnglishLevel) => {
    setSelectedLevel(level);

    const levelStories = stories.filter(
      (story) => story.level === level
    );

    if (levelStories.length > 0) {
      setCurrentStory(levelStories[0]);
      setSelectedWord(null);
    }

    setReviewActive(false);
    setReviewFinished(false);
  };
  const getLevelStoryCount = (level: EnglishLevel) => {
    return stories.filter((story) => story.level === level).length;
  };
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [savedExpressions, setSavedExpressions] = useState<string[]>([]);
  const [searchSavedWords, setSearchSavedWords] = useState('');
  const [searchSavedExpressions, setSearchSavedExpressions] = useState('');
  const filteredSavedWords = savedWords.filter((word) =>
    word.toLowerCase().includes(searchSavedWords.trim().toLowerCase())
  );
  const filteredSavedExpressions = savedExpressions.filter((expression) =>
    expression.toLowerCase().includes(searchSavedExpressions.trim().toLowerCase())
  );
  const [reviewActive, setReviewActive] = useState(false);
  const [reviewWords, setReviewWords] = useState<string[]>([]);
  const [reviewExpressions, setReviewExpressions] = useState<string[]>([]);
  const [expressionReviewActive, setExpressionReviewActive] = useState(false);
  const [expressionReviewIndex, setExpressionReviewIndex] = useState(0);
  const [expressionReviewScore, setExpressionReviewScore] = useState(0);
  const [expressionReviewAnswer, setExpressionReviewAnswer] = useState<string | null>(null);
  const [expressionReviewOptions, setExpressionReviewOptions] = useState<string[]>([]);
  const [expressionReviewFinished, setExpressionReviewFinished] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswer, setReviewAnswer] = useState<string | null>(null);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewOptions, setReviewOptions] = useState<string[]>([]);
  const [reviewFinished, setReviewFinished] = useState(false);

  useEffect(() => {
    loadSavedWords();
    loadSavedExpressions();
  }, []);

  const loadSavedWords = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_WORDS_KEY);

      if (saved) {
        setSavedWords(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Erro ao carregar palavras:', error);
    }
  };

  const loadSavedExpressions = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_EXPRESSIONS_KEY);

      if (saved) {
        setSavedExpressions(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Erro ao carregar expressões:', error);
    }
  };

  const saveWordsToStorage = async (newSavedWords: string[]) => {
    try {
      await AsyncStorage.setItem(
        SAVED_WORDS_KEY,
        JSON.stringify(newSavedWords)
      );
    } catch (error) {
      console.log('Erro ao salvar palavras:', error);
    }
  };

  const saveExpressionsToStorage = async (newSavedExpressions: string[]) => {
    try {
      await AsyncStorage.setItem(
        SAVED_EXPRESSIONS_KEY,
        JSON.stringify(newSavedExpressions)
      );
    } catch (error) {
      console.log('Erro ao salvar expressões:', error);
    }
  };

  const selectWord = (word: string) => {
    setSelectedWord(words[word]);
    setSelectedExpression(null);
  };

  const selectExpression = (expression: string) => {
    const normalizedExpression = expression
      .toLowerCase()
      .replace(/[?!.\s]+$/g, '');

    const foundExpression = expressionDictionary[normalizedExpression];

    if (!foundExpression) return;

    setSelectedExpression(foundExpression);
    setSelectedWord(null);
  };

  const removeSavedWord = async (word: string) => {
    const newSavedWords = savedWords.filter(
      (savedWord) => savedWord !== word
    );

    setSavedWords(newSavedWords);
    await saveWordsToStorage(newSavedWords);
  };

  const toggleSavedWord = async () => {
    if (!selectedWord) return;

    let newSavedWords: string[];

    if (savedWords.includes(selectedWord.word)) {
      newSavedWords = savedWords.filter(
        (word) => word !== selectedWord.word
      );
    } else {
      newSavedWords = [...savedWords, selectedWord.word];
    }

    setSavedWords(newSavedWords);
    await saveWordsToStorage(newSavedWords);
  };

  const toggleSavedExpression = async () => {
    if (!selectedExpression) return;

    let newSavedExpressions: string[];

    if (savedExpressions.includes(selectedExpression.phrase)) {
      newSavedExpressions = savedExpressions.filter(
        (expression) => expression !== selectedExpression.phrase
      );
    } else {
      newSavedExpressions = [
        ...savedExpressions,
        selectedExpression.phrase,
      ];
    }

    setSavedExpressions(newSavedExpressions);
    await saveExpressionsToStorage(newSavedExpressions);
  };

  const toggleSavedExpressionFromList = async (expression: string) => {
    const newSavedExpressions = savedExpressions.filter(
      (item) => item !== expression
    );

    setSavedExpressions(newSavedExpressions);
    await saveExpressionsToStorage(newSavedExpressions);
  };

  const isSaved = selectedWord
    ? savedWords.includes(selectedWord.word)
    : false;

  const generateReviewOptions = (correctMeaning: string) => {
    const otherMeanings = Object.values(words)
      .map((word) => word.meaning)
      .filter((meaning) => meaning !== correctMeaning);

    const shuffledMeanings = otherMeanings.sort(
      () => Math.random() - 0.5
    );

    const options = [
      correctMeaning,
      ...shuffledMeanings.slice(0, 3),
    ];

    return options.sort(() => Math.random() - 0.5);
  };

  const generateExpressionReviewOptions = (correctMeaning: string) => {
    const otherMeanings = Object.values(expressionDictionary)
      .map((expression) => expression.meaning)
      .filter((meaning) => meaning !== correctMeaning);

    const shuffledMeanings = [...new Set(otherMeanings)]
      .sort(() => Math.random() - 0.5);

    const options = [
      correctMeaning,
      ...shuffledMeanings.slice(0, 3),
    ];

    return options.sort(() => Math.random() - 0.5);
  };

  const startExpressionReview = () => {
    if (savedExpressions.length === 0) {
      alert('Salve algumas expressões antes de começar a revisão!');
      return;
    }

    const firstExpression = Object.values(expressionDictionary).find(
      (item) => item.phrase === savedExpressions[0]
    );

    if (!firstExpression) return;

    setReviewExpressions([...savedExpressions]);
    setExpressionReviewIndex(0);
    setExpressionReviewScore(0);
    setExpressionReviewFinished(false);
    setExpressionReviewAnswer(null);

    setExpressionReviewOptions(
      generateExpressionReviewOptions(firstExpression.meaning)
    );

    setReviewActive(false);
    setExpressionReviewActive(true);
  };

  const answerExpressionReview = (answer: string) => {
    if (expressionReviewAnswer !== null) return;

    const currentExpression = Object.values(expressionDictionary).find(
      (item) => item.phrase === reviewExpressions[expressionReviewIndex]
    );

    if (!currentExpression) return;

    setExpressionReviewAnswer(answer);

    if (answer === currentExpression.meaning) {
      setExpressionReviewScore((previousScore) => previousScore + 1);
    }
  };

  const nextExpressionReview = () => {
    if (expressionReviewAnswer === null) return;

    const nextIndex = expressionReviewIndex + 1;

    if (nextIndex >= reviewExpressions.length) {
      setExpressionReviewFinished(true);
      return;
    }

    const nextExpression = Object.values(expressionDictionary).find(
      (item) => item.phrase === reviewExpressions[nextIndex]
    );

    if (!nextExpression) return;

    setExpressionReviewIndex(nextIndex);
    setExpressionReviewAnswer(null);

    setExpressionReviewOptions(
      generateExpressionReviewOptions(nextExpression.meaning)
    );
  };

  const startReview = () => {
    if (savedWords.length === 0) {
      alert('Salve algumas palavras antes de começar a revisão!');
      return;
    }

    setReviewWords([...savedWords]);
    setReviewIndex(0);
    setReviewScore(0);
    setReviewFinished(false);
    setReviewAnswer(null);

    const firstWord = words[savedWords[0]];
    setReviewOptions(generateReviewOptions(firstWord.meaning));
    setExpressionReviewActive(false);
    setReviewActive(true);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            English Reader
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Read. Learn. Remember.
          </ThemedText>

          <ThemedView
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            {englishLevels.map((level) => {
              const levelColor =
                level === 'A1' || level === 'A2'
                  ? '#279B68'
                  : level === 'B1' || level === 'B2'
                    ? '#3986D7'
                    : '#9A6BD6';

              const isSelected = selectedLevel === level;
              const storyCount = getLevelStoryCount(level);

              return (
                <Pressable
                  key={level}
                  onPress={() => selectLevel(level)}
                  style={{
                    width: '48%',
                    padding: 14,
                    marginBottom: 12,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: levelColor,
                    backgroundColor: isSelected
                      ? levelColor
                      : isDark
                        ? '#202B36'
                        : '#FFFFFF',
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: isSelected
                        ? '#FFFFFF'
                        : levelColor,
                    }}
                  >
                    {level}
                  </ThemedText>

                  <ThemedText
                    style={{
                      fontSize: 13,
                      color: isSelected
                        ? '#FFFFFF'
                        : undefined,
                    }}
                  >
                    {levelNames[level]}
                  </ThemedText>

                  <ThemedText
                    style={{
                      fontSize: 11,
                      marginTop: 6,
                      color: isSelected
                        ? '#FFFFFF'
                        : undefined,
                    }}
                  >
                    {storyCount > 0
                      ? `${storyCount} histórias`
                      : 'Em breve'}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>

          {filteredStories.length > 0 ? (
            <>
              <ThemedView style={styles.levelBox}>
                <ThemedText type="small">
                  {currentStory.level} · {levelNames[currentStory.level]}
                </ThemedText>
              </ThemedView>

              <ThemedText type="title" style={styles.storyTitle}>
                {currentStory.title}
              </ThemedText>

              <ThemedView style={styles.storySelector}>
                {filteredStories.map((story) => (
                  <Pressable
                    key={story.id}
                    onPress={() => {
                      setCurrentStory(story);
                      setSelectedWord(null);
                      setReviewActive(false);
                      setReviewFinished(false);
                    }}
                    style={[
                      styles.storyButton,
                      currentStory.id === story.id && [
                        styles.storyButtonActive,
                        {
                          backgroundColor: isDark ? '#26364A' : '#DCEBFF',
                          borderColor: isDark ? '#668DB8' : '#3973C6',
                        },
                      ],
                    ]}
                  >
                    <ThemedText style={styles.storyButtonText}>
                      {story.title}
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>

              {currentStory.paragraphs.map((paragraph, paragraphIndex) => {
                const expressionKeys = (currentStory.expressions ?? [])
                  .map(expression => expression.toLowerCase().replace(/[’‘]/g, "'"))
                  .filter(expression => expressionDictionary[expression])
                  .sort((a, b) => b.length - a.length);

                const escapeRegex = (value: string) =>
                  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                const expressionPatterns = expressionKeys.map(expression =>
                  expression
                    .split(/\s+/)
                    .map(escapeRegex)
                    .join('\\s+')
                );

                const wordPatterns = currentStory.words.map(escapeRegex);

                const clickablePattern = [
                  ...expressionPatterns,
                  ...wordPatterns,
                ].join('|');

                const parts = paragraph.split(
                  new RegExp(
                    `(\\b(?:${clickablePattern})\\b[.,!?;:]*)`,
                    'gi'
                  )
                );

                return (
                  <ThemedView
                    key={paragraphIndex}
                    style={styles.paragraph}
                  >
                    {parts.map((part, partIndex) => {
                      const partKey = part
                        .toLowerCase()
                        .replace(/[.,!?;:]+$/, '')
                        .replace(/[’‘]/g, "'")
                        .replace(/\s+/g, ' ');

                      const expressionKey = expressionKeys.find(
                        expression => expression === partKey
                      );

                      if (
                        expressionKey &&
                        expressionDictionary[expressionKey]
                      ) {
                        return (
                          <Pressable
                            key={partIndex}
                            onPress={() => selectExpression(expressionKey)}
                            style={[
                              styles.inlineWord,
                              {
                                backgroundColor: isDark ? '#293747' : '#EAF2FF',
                                borderColor: isDark ? '#465A70' : '#C5D9F5',
                              },
                            ]}
                          >
                            <ThemedText style={styles.word}>
                              {part}
                            </ThemedText>
                          </Pressable>
                        );
                      }

                      if (
                        currentStory.words.includes(partKey) &&
                        words[partKey]
                      ) {
                        return (
                          <Pressable
                            key={partIndex}
                            onPress={() => selectWord(partKey)}
                            style={[
                              styles.inlineWord,
                              {
                                backgroundColor: isDark ? '#293747' : '#EAF2FF',
                                borderColor: isDark ? '#465A70' : '#C5D9F5',
                              },
                            ]}
                          >
                            <ThemedText style={styles.word}>
                              {part}
                            </ThemedText>
                          </Pressable>
                        );
                      }

                      return (
                        <ThemedText
                          key={partIndex}
                          style={styles.storyText}
                        >
                          {part}
                        </ThemedText>
                      );
                    })}
                  </ThemedView>
                );
              })}
            </>
          ) : (
            <ThemedView
              style={{
                padding: 24,
                borderRadius: 14,
                alignItems: 'center',
                marginBottom: 24,
                backgroundColor: isDark ? '#202B36' : '#F0F4F8',
              }}
            >
              <ThemedText
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}
              >
                Conteúdo em breve
              </ThemedText>

              <ThemedText style={{ textAlign: 'center' }}>
                Estamos preparando novas histórias para este nível.
              </ThemedText>
            </ThemedView>
          )}

          {selectedWord && (
            <ThemedView style={styles.dictionaryBox}>
              <ThemedText type="subtitle">
                {selectedWord.word}
              </ThemedText>

              <ThemedText style={styles.pronunciation}>
                / {selectedWord.pronunciation} /
              </ThemedText>

              <ThemedText style={styles.meaning}>
                {selectedWord.meaning}
              </ThemedText>

              <ThemedText style={styles.exampleTitle}>
                Example:
              </ThemedText>

              <ThemedText>
                {selectedWord.example}
              </ThemedText>

              <Pressable
                onPress={() => Speech.speak(selectedWord.word, { language: 'en-US' })}
                style={styles.audioButton}
              >
                <ThemedText>
                  🔊 Listen
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={toggleSavedWord}
                style={styles.saveButton}
              >
                <ThemedText>
                  {isSaved
                    ? '⭐ Palavra salva'
                    : '☆ Salvar palavra'}
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}

          {selectedExpression && (
            <ThemedView style={styles.dictionaryBox}>
              <ThemedText type="subtitle">
                {selectedExpression.phrase}
              </ThemedText>

              <ThemedText style={styles.pronunciation}>
                / {selectedExpression.pronunciation} /
              </ThemedText>

              <ThemedText style={styles.meaning}>
                {selectedExpression.meaning}
              </ThemedText>

              <ThemedText style={styles.exampleTitle}>
                Example:
              </ThemedText>

              <ThemedText>
                {selectedExpression.example}
              </ThemedText>

              <Pressable
                onPress={() =>
                  Speech.speak(selectedExpression.phrase, {
                    language: 'en-US',
                  })
                }
                style={styles.audioButton}
              >
                <ThemedText>
                  🔊 Listen
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={toggleSavedExpression}
                style={styles.saveButton}
              >
                <ThemedText>
                  {savedExpressions.includes(selectedExpression.phrase)
                    ? '⭐ Expressão salva'
                    : '☆ Salvar expressão'}
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}

          {reviewActive && reviewWords.length > 0 && (
            <ThemedView style={styles.dictionaryBox}>
              <ThemedText type="subtitle">
                🧠 Revisão de inglês
              </ThemedText>

              <ThemedText>
                Palavra {reviewIndex + 1} de {reviewWords.length}
              </ThemedText>

              <ThemedText type="title">
                What does "{words[reviewWords[reviewIndex]].word}" mean?
              </ThemedText>

              {reviewOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setReviewAnswer(option)}
                  style={styles.saveButton}
                >
                  <ThemedText>
                    {reviewAnswer === option ? '🔘 ' : '⚪ '}
                    {option}
                  </ThemedText>
                </Pressable>
              ))}

              <Pressable
                onPress={() => {
                  if (reviewAnswer === null) {
                    alert('Escolha uma resposta primeiro!');
                    return;
                  }

                  const correctAnswer =
                    words[reviewWords[reviewIndex]].meaning;

                  const isCorrect = reviewAnswer === correctAnswer;

                  if (isCorrect) {
                    setReviewScore((score) => score + 1);
                    alert('Correct! Muito bem! 🎉');
                  } else {
                    alert(`A resposta correta é: ${correctAnswer}`);
                  }

                  if (reviewIndex + 1 < reviewWords.length) {
                    const nextIndex = reviewIndex + 1;

                    setReviewIndex(nextIndex);
                    setReviewAnswer(null);
                    setReviewOptions(
                      generateReviewOptions(
                        words[reviewWords[nextIndex]].meaning
                      )
                    );
                  } else {
                    const finalScore =
                      reviewScore + (isCorrect ? 1 : 0);

                    setReviewActive(false);
                    setReviewAnswer(null);
                    setReviewScore(finalScore);
                    setReviewFinished(true);
                  }
                }}
                style={styles.audioButton}
              >
                <ThemedText>
                  Conferir resposta ➜
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setReviewActive(false);
                  setReviewAnswer(null);
                }}
                style={styles.saveButton}
              >
                <ThemedText>
                  Sair da revisão
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}

          {reviewFinished && reviewWords.length > 0 && (
            <ThemedView style={styles.dictionaryBox}>
              <ThemedText type="subtitle">
                🏆 Revisão concluída!
              </ThemedText>

              <ThemedText type="title">
                {reviewScore} de {reviewWords.length} acertos
              </ThemedText>

              <ThemedText>
                Você acertou{' '}
                {Math.round((reviewScore / reviewWords.length) * 100)}% das perguntas.
              </ThemedText>

              <Pressable
                onPress={startReview}
                style={styles.saveButton}
              >
                <ThemedText>
                  🔄 Tentar novamente
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => setReviewFinished(false)}
                style={styles.saveButton}
              >
                <ThemedText>
                  📚 Voltar às palavras salvas
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}

          {expressionReviewActive &&
            !expressionReviewFinished &&
            reviewExpressions.length > 0 && (
              <ThemedView style={styles.dictionaryBox}>
                <ThemedText type="subtitle">
                  🧠 Revisão de expressões
                </ThemedText>

                <ThemedText>
                  Expressão {expressionReviewIndex + 1} de {reviewExpressions.length}
                </ThemedText>

                <ThemedText type="title">
                  What does "{reviewExpressions[expressionReviewIndex]}" mean?
                </ThemedText>

                {expressionReviewOptions.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => answerExpressionReview(option)}
                    disabled={expressionReviewAnswer !== null}
                    style={styles.saveButton}
                  >
                    <ThemedText>
                      {expressionReviewAnswer === option ? '🔘 ' : '⚪ '}
                      {option}
                    </ThemedText>
                  </Pressable>
                ))}
                {expressionReviewAnswer !== null && (
                  <ThemedView>
                    <ThemedText type="subtitle">
                      {expressionReviewAnswer ===
                        Object.values(expressionDictionary).find(
                          (item) =>
                            item.phrase === reviewExpressions[expressionReviewIndex]
                        )?.meaning
                        ? '✅ Correto! Muito bem!'
                        : '❌ Resposta incorreta'}
                    </ThemedText>

                    <ThemedText>
                      Resposta correta:{' '}
                      {Object.values(expressionDictionary).find(
                        (item) =>
                          item.phrase === reviewExpressions[expressionReviewIndex]
                      )?.meaning}
                    </ThemedText>
                    <Pressable
                      onPress={nextExpressionReview}
                      style={styles.audioButton}
                    >
                      <ThemedText>
                        {expressionReviewIndex + 1 < reviewExpressions.length
                          ? 'Próxima expressão ➜'
                          : 'Ver resultado 🏆'}
                      </ThemedText>
                    </Pressable>
                  </ThemedView>
                )}

                <Pressable
                  onPress={() => {
                    setExpressionReviewActive(false);
                    setExpressionReviewFinished(false);
                    setExpressionReviewAnswer(null);
                  }}
                  style={styles.saveButton}
                >
                  <ThemedText>
                    Sair da revisão
                  </ThemedText>
                </Pressable>

              </ThemedView>
            )}

          {expressionReviewFinished && reviewExpressions.length > 0 && (
            <ThemedView style={styles.dictionaryBox}>
              <ThemedText type="subtitle">
                🏆 Revisão de expressões concluída!
              </ThemedText>

              <ThemedText type="title">
                {expressionReviewScore} de {reviewExpressions.length} acertos
              </ThemedText>

              <ThemedText>
                Você acertou{' '}
                {Math.round(
                  (expressionReviewScore / reviewExpressions.length) * 100
                )}% das perguntas.
              </ThemedText>

              <Pressable
                onPress={startExpressionReview}
                style={styles.saveButton}
              >
                <ThemedText>
                  🔄 Tentar novamente
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setExpressionReviewActive(false);
                  setExpressionReviewFinished(false);
                  setExpressionReviewAnswer(null);
                }}
                style={styles.saveButton}
              >
                <ThemedText>
                  💬 Voltar às expressões salvas
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}

          <ThemedView style={styles.savedBox}>
            <ThemedText type="subtitle">
              📚 Minhas palavras
            </ThemedText>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar palavra salva..."
              value={searchSavedWords}
              onChangeText={setSearchSavedWords}
              autoCapitalize="none"
            />

            <Pressable
              onPress={startReview}
              style={styles.saveButton}
            >
              <ThemedText>
                🧠 Revisar minhas palavras
              </ThemedText>
            </Pressable>

            {savedWords.length === 0 ? (
              <ThemedText>
                Nenhuma palavra salva ainda.
              </ThemedText>
            ) : (
              <>
                <ThemedText>
                  {savedWords.length} palavra(s) salva(s).
                </ThemedText>

                {searchSavedWords.trim() !== '' && filteredSavedWords.length === 0 && (
                  <ThemedText>
                    Nenhuma palavra encontrada.
                  </ThemedText>
                )}

                {filteredSavedWords.map((word) => {
                  const savedWord = words[word];

                  return (
                    <ThemedView
                      key={word}
                      style={styles.savedWordButton}
                    >
                      <Pressable onPress={() => selectWord(word)}>
                        <ThemedText style={styles.savedWord}>
                          ⭐ {savedWord.word}
                        </ThemedText>

                        <ThemedText style={styles.savedWordMeaning}>
                          {savedWord.meaning}
                        </ThemedText>

                        <ThemedText style={styles.savedWordPronunciation}>
                          / {savedWord.pronunciation} /
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          Speech.speak(savedWord.word, { language: 'en-US' })
                        }
                        style={styles.savedWordAudioButton}
                      >
                        <ThemedText>
                          🔊 Ouvir
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() => removeSavedWord(word)}
                        style={styles.savedWordAudioButton}
                      >
                        <ThemedText>
                          🗑️ Remover
                        </ThemedText>
                      </Pressable>
                    </ThemedView>
                  );
                })}
              </>
            )}
          </ThemedView>

          <ThemedView style={styles.savedBox}>
            <ThemedText type="subtitle">
              💬 Minhas expressões
            </ThemedText>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar expressão salva..."
              value={searchSavedExpressions}
              onChangeText={setSearchSavedExpressions}
              autoCapitalize="none"
            />

            <Pressable
              onPress={startExpressionReview}
              style={styles.saveButton}
            >
              <ThemedText>
                🧠 Revisar minhas expressões
              </ThemedText>
            </Pressable>

            <ThemedText>
              {savedExpressions.length} expressão(ões) salva(s).
            </ThemedText>

            {searchSavedExpressions.trim() !== '' &&
              filteredSavedExpressions.length === 0 && (
                <ThemedText>
                  Nenhuma expressão encontrada.
                </ThemedText>
              )}

            {filteredSavedExpressions.map((expression) => {
              const savedExpression = Object.values(expressionDictionary).find(
                (item) =>
                  item.phrase.toLowerCase().replace(/[?!.\s]+$/g, '') ===
                  expression.toLowerCase().replace(/[?!.\s]+$/g, '')
              );

              if (!savedExpression) return null;

              return (
                <ThemedView
                  key={expression}
                  style={styles.savedWordButton}
                >
                  <Pressable onPress={() => selectExpression(expression)}>
                    <ThemedText style={styles.savedWord}>
                      ⭐ {savedExpression.phrase}
                    </ThemedText>

                    <ThemedText style={styles.savedWordMeaning}>
                      {savedExpression.meaning}
                    </ThemedText>

                    <ThemedText style={styles.savedWordPronunciation}>
                      / {savedExpression.pronunciation} /
                    </ThemedText>
                  </Pressable>

                  <ThemedText>
                    Example: {savedExpression.example}
                  </ThemedText>

                  <Pressable
                    onPress={() =>
                      Speech.speak(savedExpression.phrase, {
                        language: 'en-US',
                      })
                    }
                    style={styles.savedWordAudioButton}
                  >
                    <ThemedText>
                      🔊 Ouvir
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={() => toggleSavedExpressionFromList(expression)}
                    style={styles.savedWordAudioButton}
                  >
                    <ThemedText>
                      🗑️ Remover
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              );
            })}
          </ThemedView>

          <ThemedView style={styles.tipBox}>
            <ThemedText type="subtitle">
              💡 Learning tip
            </ThemedText>

            <ThemedText>
              Tap a word you don't know. Soon, you'll be able to
              see its meaning, pronunciation and examples.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#fff',
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 60,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },

  title: {
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },

  levelBox: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 30,
  },

  storyTitle: {
    marginBottom: 24,
  },

  storySelector: {
    gap: 10,
    marginBottom: 24,
  },
  storyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888888',
  },

  storyButtonActive: {
    backgroundColor: '#DCEBFF',
    borderColor: '#3973C6',
  },

  storyButtonText: {
    fontSize: 16,
  },

  paragraph: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 22,
  },

  storyText: {
    fontSize: 20,
    lineHeight: 34,
    marginRight: 5,
  },

  inlineWord: {
    marginHorizontal: 3,
    borderRadius: 5,
    backgroundColor: '#EAF2FF',
    borderWidth: 1,
    borderColor: '#C5D9F5',
    paddingHorizontal: 2,
  },

  word: {
    fontSize: 20,
    lineHeight: 34,
    color: '#2457A7',
  },

  dictionaryBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 10,
  },

  pronunciation: {
    fontSize: 18,
    opacity: 0.8,
  },

  meaning: {
    fontSize: 18,
  },

  exampleTitle: {
    marginTop: 8,
    fontWeight: 'bold',
  },

  audioButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  saveButton: {
    marginTop: 4,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  savedBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 10,
  },

  savedWordButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  savedWordAudioButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  savedWord: {
    fontSize: 18,
    textDecorationLine: 'underline',
  },

  savedWordMeaning: {
    fontSize: 16,
    marginTop: 3,
  },

  savedWordPronunciation: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },

  tipBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
});
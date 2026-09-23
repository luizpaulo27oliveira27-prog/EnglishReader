import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Word = {
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
};

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
};

const SAVED_WORDS_KEY = '@englishreader_saved_words';

export default function HomeScreen() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [savedWords, setSavedWords] = useState<string[]>([]);

  useEffect(() => {
    loadSavedWords();
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

  const selectWord = (word: string) => {
    setSelectedWord(words[word]);
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

  const isSaved = selectedWord
    ? savedWords.includes(selectedWord.word)
    : false;

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

          <ThemedView style={styles.levelBox}>
            <ThemedText type="small">
              LEVEL A1 · BEGINNER
            </ThemedText>
          </ThemedView>

          <ThemedText type="title" style={styles.storyTitle}>
            A Walk in the Park
          </ThemedText>

          <ThemedView style={styles.paragraph}>
            <ThemedText style={styles.storyText}>
              Yesterday, I decided to take a
            </ThemedText>

            <Pressable
              onPress={() => selectWord('walk')}
              style={styles.inlineWord}
            >
              <ThemedText style={styles.word}>
                walk
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.storyText}>
              through the park.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.paragraph}>
            <ThemedText style={styles.storyText}>
              The
            </ThemedText>

            <Pressable
              onPress={() => selectWord('weather')}
              style={styles.inlineWord}
            >
              <ThemedText style={styles.word}>
                weather
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.storyText}>
              was
            </ThemedText>

            <Pressable
              onPress={() => selectWord('beautiful')}
              style={styles.inlineWord}
            >
              <ThemedText style={styles.word}>
                beautiful
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.storyText}>
              , and the streets were
            </ThemedText>

            <Pressable
              onPress={() => selectWord('quiet')}
              style={styles.inlineWord}
            >
              <ThemedText style={styles.word}>
                quiet
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.storyText}>
              .
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.paragraph}>
            <ThemedText style={styles.storyText}>
              I
            </ThemedText>

            <Pressable
              onPress={() => selectWord('noticed')}
              style={styles.inlineWord}
            >
              <ThemedText style={styles.word}>
                noticed
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.storyText}>
              many people
            </ThemedText>

            <Pressable
              onPress={() => selectWord('enjoying')}
              style={styles.inlineWord}
            >
              <ThemedText style={styles.word}>
                enjoying
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.storyText}>
              the afternoon.
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.storyText}>
            Some people were reading books, while others were talking
            with their friends.
          </ThemedText>

          <ThemedText style={styles.storyText}>
            I sat under a tree and watched the world around me.
          </ThemedText>

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
                onPress={() => alert('Pronunciation coming soon!')}
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

         <ThemedView style={styles.savedBox}>
  <ThemedText type="subtitle">
    📚 Minhas palavras
  </ThemedText>

  {savedWords.length === 0 ? (
    <ThemedText>
      Nenhuma palavra salva ainda.
    </ThemedText>
  ) : (
    <>
      <ThemedText>
        {savedWords.length} palavra(s) salva(s).
      </ThemedText>

  {savedWords.map((word) => {
    const savedWord = words[word];

    return (
      <Pressable
        key={word}
        onPress={() => selectWord(word)}
        style={styles.savedWordButton}
      >
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
   );
  })}
    </>
  )}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },

  word: {
    fontSize: 20,
    lineHeight: 34,
    textDecorationLine: 'underline',
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
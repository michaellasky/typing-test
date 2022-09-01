import { Action } from "./actions";
import { incorrectLetterIndices } from "./App";

export type TypingTestStatus = "PRESTART" | "STARTING" | "ACTIVE" | "FINISHED";
export type TypingTestState = {
  currentState: TypingTestStatus;
  startTime: number;
  endTime: number;
  currentWordIdx: number;
  cpm: number;
  wpm: number;
  accuracy: number;
  wordHistory: string[];
  words: string[];
};

export function typingTestReducer(
  state: TypingTestState,
  action: Action
): TypingTestState {
  const { wordHistory, words, currentWordIdx } = state;

  switch (action.type) {
    case "UPDATE_WORD_HISTORY":
      const { index, value } = action.payload;
      wordHistory[index] = value.trim();

      return { ...state, wordHistory };

    case "RECALCULATE_STATS_ACTION":
      const numCharactersTyped = wordHistory
        .slice(0, currentWordIdx)
        .join(" ").length;

      const numErrorsInWordHistory = wordHistory
        .slice(0, currentWordIdx)
        .reduce(
          (numErrors, word, wordIdx) =>
            numErrors + incorrectLetterIndices(word, words[wordIdx]).length,
          0
        );

      const minutesElapsed = (Date.now() - state.startTime) / 1000 / 60;
      const cpm = Math.max(0, Math.round(numCharactersTyped / minutesElapsed));
      const wpm = cpm / 5;
      const accuracy = 1 - (numErrorsInWordHistory / numCharactersTyped || 0);

      return { ...state, cpm, wpm, accuracy };

    case "NEXT_WORD_ACTION":
      return { ...state, currentWordIdx: state.currentWordIdx + 1 };

    case "START_COUNTDOWN":
      return { ...state, currentState: "STARTING" };

    case "BEGIN_TEST":
      return { ...state, currentState: "ACTIVE", startTime: Date.now() };

    case "END_TEST":
      return { ...state, currentState: "FINISHED", endTime: Date.now() };

    case "RESET_STATE_ACTION":
      return action.payload.newState;

    case "UPDATE_WORD_LIST":
      const { newWordList } = action.payload;
      return { ...state, words: newWordList };
  }

  return state;
}

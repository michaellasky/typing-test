import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import shuffle from "lodash/shuffle";
import { WordList } from "./components/WordList";
import { WordInput } from "./components/WordInput";
import { wordPool } from "./wordpool";
import { typingTestReducer, TypingTestState } from "./reducer";
import { Stats } from "./components/Stats";
import {
  BeginTestAction,
  EndTestAction,
  ResetStateAction,
  StartCountdownAction,
  NextWordAction as NextWordAction,
  UpdateWordHistoryAction,
  UpdateWordList,
  RecalculateStatsAction,
} from "./actions";

function App() {
  const initialState: TypingTestState = {
    currentState: "PRESTART",
    startTime: 0,
    endTime: 0,
    currentWordIdx: 0,
    cpm: 0,
    wpm: 0,
    wordHistory: [],
    accuracy: 1.0,
    words: shuffle(wordPool),
  };

  const [typingTestState, dispatch] = useReducer(
    typingTestReducer,
    initialState
  );

  const {
    currentState,
    startTime,
    currentWordIdx,
    cpm,
    wpm,
    accuracy,
    wordHistory,
    words,
  } = typingTestState;

  const [beginButtonText, setBeginButtonText] = useState("Begin Test");

  useEffect(() => {
    if (currentState === "PRESTART") {
      dispatch(UpdateWordList(shuffle(wordPool)));
    }
  }, [currentState, wordPool]);

  if (currentWordIdx === words.length && currentState === "ACTIVE") {
    dispatch(EndTestAction());
  }

  function onValueChange(value: string) {
    const lastKeyStroke = value[value.length - 1];

    if (lastKeyStroke === " ") {
      dispatch(NextWordAction());
    }
    dispatch(UpdateWordHistoryAction(currentWordIdx, value));
  }

  function onClickBeginTest(countDown = 3) {
    dispatch(StartCountdownAction());

    if (countDown > 0) {
      setBeginButtonText(`Test starting in ${countDown}`);
      setTimeout(() => onClickBeginTest(countDown - 1), 1000);
    } else if (countDown === 0) {
      setBeginButtonText(`Begin!`);
      setTimeout(() => onClickBeginTest(countDown - 1), 300);
    } else {
      dispatch(BeginTestAction());
    }
  }

  function onClickTryAgain() {
    dispatch(ResetStateAction(initialState));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mike's Awesome Typing Test</h1>
        <Stats
          cpm={cpm}
          wpm={wpm}
          accuracy={accuracy}
          startTime={startTime}
          currentState={currentState}
          dispatchRecalculateStats={() => dispatch(RecalculateStatsAction())}
        />
        {currentState !== "FINISHED" && (
          <WordList
            words={words}
            wordHistory={wordHistory}
            currentWordIdx={currentWordIdx}
          />
        )}
        {currentState === "FINISHED" && (
          <button onClick={onClickTryAgain}>Try Again</button>
        )}
        {(currentState === "PRESTART" || currentState === "STARTING") && (
          <button
            disabled={currentState === "STARTING"}
            onClick={() => onClickBeginTest(3)}
          >
            {beginButtonText}
          </button>
        )}
        {currentState === "ACTIVE" && (
          <WordInput
            currentValue={wordHistory[currentWordIdx]}
            onChange={onValueChange}
          />
        )}
      </header>
    </div>
  );
}

export function incorrectLetterIndices(
  wordToTest: string = "",
  correctWord: string
): number[] {
  const correctWordLetters = correctWord.split("");
  const wordFromHistoryLetters = wordToTest.split("");

  return correctWordLetters.reduce(
    (incorrectIndices: number[], letter: string, index: number) => {
      if (wordFromHistoryLetters[index] !== letter) {
        return [...incorrectIndices, index];
      }
      return incorrectIndices;
    },
    []
  );
}

export default App;

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
  NextWordAction,
  UpdateWordHistoryAction,
  UpdateWordList,
  RecalculateStatsAction,
} from "./actions";

function App() {
  const initialState: TypingTestState = {
    currentStatus: "PRESTART",
    startTime: 0,
    maxTime: 60,
    elapsedSeconds: 0,
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
    currentStatus,
    startTime,
    maxTime,
    elapsedSeconds,
    currentWordIdx,
    cpm,
    wpm,
    accuracy,
    wordHistory,
    words,
  } = typingTestState;

  const [beginButtonText, setBeginButtonText] = useState("Begin Test");

  if ((currentWordIdx === words.length || elapsedSeconds >= maxTime ) && currentStatus === "ACTIVE") {
    dispatch(EndTestAction());
  }

  // Reshuffle words each game
  useEffect(() => {
    if (currentStatus === "PRESTART") {
      dispatch(UpdateWordList(shuffle(wordPool)));
    }
  }, [currentStatus]);


  // Recalculate time remaining and other stats every second
  useEffect(() => {
    let updateElapsedTimeInterval: any;
    if (currentStatus === "ACTIVE") {
      updateElapsedTimeInterval = setInterval(() => {
        dispatch(RecalculateStatsAction());
      }, 1000);
    } else {
      clearInterval(updateElapsedTimeInterval);
    }
    return () => clearInterval(updateElapsedTimeInterval);
  }, [currentStatus, startTime]);


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
          elapsedSeconds={elapsedSeconds}
          maxTime={maxTime}
        />
        {currentStatus !== "FINISHED" && (
          <WordList
            words={words}
            wordHistory={wordHistory}
            currentWordIdx={currentWordIdx}
          />
        )}
        {currentStatus === "FINISHED" && (
          <button onClick={onClickTryAgain}>Try Again</button>
        )}
        {(currentStatus === "PRESTART" || currentStatus === "STARTING") && (
          <button
            disabled={currentStatus === "STARTING"}
            onClick={() => onClickBeginTest(3)}
          >
            {beginButtonText}
          </button>
        )}
        {currentStatus === "ACTIVE" && (
          <WordInput
            currentValue={wordHistory[currentWordIdx]}
            onChange={onValueChange}
          />
        )}
      </header>
    </div>
  );
}

// Given two strings, returns indices of wordToTest that do not match correctWord
// incorrectLetterIndices("abddd", "abcde") returns [2, 4]
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

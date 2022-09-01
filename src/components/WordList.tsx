import classNames from "classnames";
import { incorrectLetterIndices } from "../App";

export type WordListProps = {
  words: string[];
  wordHistory: string[];
  currentWordIdx: number;
};

export function WordList({
  words,
  wordHistory = [],
  currentWordIdx,
}: WordListProps) {
  return (
    <div className="words">
      {words.map((word, wordIdx) => {
        const wordClassNames = classNames({
          word: true,
          currentWord: currentWordIdx === wordIdx,
        });

        const incorrectIndices = incorrectLetterIndices(
          wordHistory[wordIdx],
          word
        );

        return (
          <div key={word + wordIdx} className={wordClassNames}>
            {word.split("").map((letter, letterIdx) => {
              const isPreviousWord = wordIdx < currentWordIdx;
              const isCurrentWord = wordIdx === currentWordIdx;
              const letterIsIncorrect = incorrectIndices.includes(letterIdx);

              const letterClassName = classNames({
                correct: !letterIsIncorrect,
                incorrect:
                  (isPreviousWord && letterIsIncorrect) ||
                  (isCurrentWord &&
                    letterIsIncorrect &&
                    letterIdx < wordHistory[wordIdx]?.length),
              });

              return <span key={word + letterIdx} className={letterClassName}>{letter}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}

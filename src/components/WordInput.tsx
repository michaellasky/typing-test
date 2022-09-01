import { useEffect, useRef, useState } from "react";
import { TypingTestStatus } from "../reducer";

export type WordInputProps = {
  currentValue: string;
  onChange: (e: any) => void;
  currentTestState: TypingTestStatus;
};

export function WordInput({
  currentValue = "",
  onChange,
  currentTestState,
}: WordInputProps) {
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className="word-input"
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}

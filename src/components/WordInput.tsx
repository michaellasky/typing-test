import { useEffect, useRef, useState } from "react";

export type WordInputProps = {
  currentValue: string;
  onChange: (e: any) => void;
};

export function WordInput({
  currentValue = "",
  onChange,
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

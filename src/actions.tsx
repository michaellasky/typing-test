import { TypingTestState } from "./reducer";

export type Action = {
  type: string;
  payload: any;
};

export function UpdateWordHistoryAction(index: number, value: string): Action {
  return {
    type: "UPDATE_WORD_HISTORY",
    payload: { index, value },
  };
}

export function NextWordAction(): Action {
  return {
    type: "NEXT_WORD_ACTION",
    payload: {},
  };
}

export function BeginTestAction(): Action {
  return {
    type: "BEGIN_TEST",
    payload: {},
  };
}

export function EndTestAction(): Action {
  return {
    type: "END_TEST",
    payload: {},
  };
}

export function StartCountdownAction(): Action {
  return {
    type: "START_COUNTDOWN",
    payload: {},
  };
}

export function ResetStateAction(newState: TypingTestState): Action {
  return {
    type: "RESET_STATE_ACTION",
    payload: { newState },
  };
}

export function UpdateWordList(newWordList: string[]): Action {
  return {
    type: "UPDATE_WORD_LIST",
    payload: { newWordList },
  };
}

export function RecalculateStatsAction() {
  return {
    type: "RECALCULATE_STATS_ACTION",
    payload: {},
  };
}

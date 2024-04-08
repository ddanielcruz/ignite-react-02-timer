import type { Cycle } from './reducer'

export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  COMPLETE_CYCLE = 'COMPLETE_CYCLE',
  INTERRUPT_CYCLE = 'INTERRUPT_CYCLE',
}

export type Actions =
  | { type: ActionTypes.ADD_NEW_CYCLE; payload: { newCycle: Cycle } }
  | { type: ActionTypes.COMPLETE_CYCLE }
  | { type: ActionTypes.INTERRUPT_CYCLE }

export function addNewCycleAction(newCycle: Cycle): Actions {
  return { type: ActionTypes.ADD_NEW_CYCLE, payload: { newCycle } }
}

export function completeCycleAction(): Actions {
  return { type: ActionTypes.COMPLETE_CYCLE }
}

export function interruptCycleAction(): Actions {
  return { type: ActionTypes.INTERRUPT_CYCLE }
}

import { produce } from 'immer'

import { ActionTypes, Actions } from './actions'

export interface Cycle {
  id: number
  task: string
  minutesAmount: number
  interruptedAt?: Date
  completedAt?: Date
}

type CyclesState = {
  cycles: Cycle[]
  activeCycleId: number | null
}

export function cyclesReducer(state: CyclesState, action: Actions) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.activeCycleId = action.payload.newCycle.id
        draft.cycles.push(action.payload.newCycle)
      })
    case ActionTypes.COMPLETE_CYCLE:
      return produce(state, (draft) => {
        const activeCycleIdx = draft.cycles.findIndex(
          (cycle) => cycle.id === draft.activeCycleId,
        )

        if (activeCycleIdx < 0) {
          return draft
        }

        draft.activeCycleId = null
        draft.cycles[activeCycleIdx].completedAt = new Date()
      })
    case ActionTypes.INTERRUPT_CYCLE:
      return produce(state, (draft) => {
        const activeCycleIdx = draft.cycles.findIndex(
          (cycle) => cycle.id === draft.activeCycleId,
        )

        if (activeCycleIdx < 0) {
          return draft
        }

        draft.activeCycleId = null
        draft.cycles[activeCycleIdx].interruptedAt = new Date()
      })
    default:
      return state
  }
}

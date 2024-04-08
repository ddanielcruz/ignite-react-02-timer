import { createContext, useEffect, useReducer, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import { cyclesReducer, Cycle } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  completeCycleAction,
  interruptCycleAction,
} from '../reducers/cycles/actions'

export type CreateCycleData = Pick<Cycle, 'task' | 'minutesAmount'>

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | null
  cycleSecondsPassed: number
  onCreateNewCycle: (data: CreateCycleData) => void
  onCycleInterrupted: () => void
  onCycleCompleted: () => void
  onCycleSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext<CyclesContextType>({
  cycles: [],
  activeCycle: null,
  cycleSecondsPassed: 0,
  onCreateNewCycle: () => {},
  onCycleInterrupted: () => {},
  onCycleCompleted: () => {},
  onCycleSecondsPassed: () => {},
})

export function CyclesContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const stateJSON = localStorage.getItem('@ignite-timer:cycles-state:1.0.0')
      if (!stateJSON) return initialState

      return JSON.parse(stateJSON)
    },
  )

  const { cycles, activeCycleId } = state
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) || null

  const [cycleSecondsPassed, setCycleSecondsPassed] = useState(() => {
    if (activeCycle) {
      const startedAt = new Date(activeCycle.id)
      const diffInSeconds = differenceInSeconds(new Date(), startedAt)

      return Math.max(diffInSeconds, 0)
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(state)
    localStorage.setItem('@ignite-timer:cycles-state:1.0.0', stateJSON)
  }, [state])

  const handleCreateNewCycle = (data: CreateCycleData) => {
    const createdAt = new Date()
    const newCycle: Cycle = { id: createdAt.getTime(), ...data }

    dispatch(addNewCycleAction(newCycle))
    setCycleSecondsPassed(0)
  }

  const handleCycleCompleted = () => {
    if (!activeCycleId) return

    dispatch(completeCycleAction())
    setCycleSecondsPassed(0)
  }

  const handleCycleInterrupted = () => {
    if (!activeCycleId) return

    dispatch(interruptCycleAction())
    setCycleSecondsPassed(0)
  }

  const handleCycleSecondsPassed = (seconds: number) => {
    setCycleSecondsPassed(seconds)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        cycleSecondsPassed,
        onCreateNewCycle: handleCreateNewCycle,
        onCycleCompleted: handleCycleCompleted,
        onCycleInterrupted: handleCycleInterrupted,
        onCycleSecondsPassed: handleCycleSecondsPassed,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

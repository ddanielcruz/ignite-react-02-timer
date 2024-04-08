import { createContext, useState } from 'react'

export interface Cycle {
  id: number
  task: string
  minutesAmount: number
  interruptedAt?: Date
  completedAt?: Date
}

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
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<number | null>(null)
  const [cycleSecondsPassed, setCycleSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) || null

  const handleCycleCompleted = () => {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, completedAt: new Date() }
          : cycle,
      ),
    )
    setActiveCycleId(null)
    setCycleSecondsPassed(0)
  }

  const handleCycleInterrupted = () => {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interruptedAt: new Date() }
          : cycle,
      ),
    )
    setActiveCycleId(null)
    setCycleSecondsPassed(0)
  }

  const handleCycleSecondsPassed = (seconds: number) => {
    setCycleSecondsPassed(seconds)
  }

  const handleCreateNewCycle = (data: CreateCycleData) => {
    const createdAt = new Date()
    const newCycle: Cycle = { id: createdAt.getTime(), ...data }

    setCycles((prevCycles) => [...prevCycles, newCycle])
    setActiveCycleId(newCycle.id)
    setCycleSecondsPassed(0)
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

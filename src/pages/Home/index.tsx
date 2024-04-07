import { createContext, useState } from 'react'
import { HandPalm, Play } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Countdown } from './Countdown'
import { NewCycleForm } from './NewCycleForm'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

interface Cycle {
  id: number
  task: string
  minutesAmount: number
  interruptedAt?: Date
  completedAt?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | null
  cycleSecondsPassed: number
  onCycleInterrupted: () => void
  onCycleCompleted: () => void
  onCycleSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext<CyclesContextType>({
  activeCycle: null,
  cycleSecondsPassed: 0,
  onCycleInterrupted: () => {},
  onCycleCompleted: () => {},
  onCycleSecondsPassed: () => {},
})

const newCycleFormValidationSchema = z.object({
  task: z.string().trim().min(1, 'Informe a tarefa'),
  minutesAmount: z
    .number()
    .min(5, 'Mínimo de 5 minutos')
    .max(60, 'Máximo de 60 minutos'),
})

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<number | null>(null)
  const [cycleSecondsPassed, setCycleSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) || null
  const newCycleForm = useForm<NewCycleFormData>({
    disabled: !!activeCycle,
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 25,
    },
  })
  const { handleSubmit, reset } = newCycleForm

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const createdAt = new Date()
    const newCycle: Cycle = { id: createdAt.getTime(), ...data }

    setCycles((prevCycles) => [...prevCycles, newCycle])
    setActiveCycleId(newCycle.id)
    setCycleSecondsPassed(0)
    reset()
  }

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

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        cycleSecondsPassed,
        onCycleCompleted: handleCycleCompleted,
        onCycleInterrupted: handleCycleInterrupted,
        onCycleSecondsPassed: handleCycleSecondsPassed,
      }}
    >
      <HomeContainer>
        <form onSubmit={handleSubmit(handleCreateNewCycle)}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />

          {activeCycle ? (
            <StopCountdownButton type="button" onClick={handleCycleInterrupted}>
              <HandPalm size={24} />
              Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit">
              <Play size={24} />
              Começar
            </StartCountdownButton>
          )}
        </form>
      </HomeContainer>
    </CyclesContext.Provider>
  )
}

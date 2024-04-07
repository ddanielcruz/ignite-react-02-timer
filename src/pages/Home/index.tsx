import { useEffect, useState } from 'react'
import { HandPalm, Play } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = z.object({
  task: z.string().trim().min(1, 'Informe a tarefa'),
  minutesAmount: z
    .number()
    .min(5, 'Mínimo de 5 minutos')
    .max(60, 'Máximo de 60 minutos'),
})

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: number
  task: string
  minutesAmount: number
  interruptedAt?: Date
  completedAt?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<number | null>(null)
  const [cycleSecondsPassed, setCycleSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) || null
  const { register, handleSubmit, reset } = useForm<NewCycleFormData>({
    disabled: !!activeCycle,
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 25,
    },
  })

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const remainingSeconds = Math.max(totalSeconds - cycleSecondsPassed, 0)
  const minutesAmount = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, '0')
  const secondsAmount = (remainingSeconds % 60).toString().padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      const intervalId = setInterval(() => {
        const startedAt = new Date(activeCycle.id)
        const diffInSeconds = differenceInSeconds(new Date(), startedAt)

        if (diffInSeconds >= activeCycle.minutesAmount * 60) {
          setCycles((state) =>
            state.map((cycle) =>
              cycle.id === activeCycle.id
                ? { ...cycle, completedAt: new Date() }
                : cycle,
            ),
          )
          setActiveCycleId(null)
          setCycleSecondsPassed(0)
        } else {
          setCycleSecondsPassed(diffInSeconds)
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [activeCycle])

  useEffect(() => {
    const isCycleRunning = activeCycle && remainingSeconds > 0
    if (!isCycleRunning) {
      document.title = 'Ignite Timer'
    } else {
      document.title = `${minutesAmount}:${secondsAmount} | Ignite Timer`
    }
  }, [activeCycle, remainingSeconds, minutesAmount, secondsAmount])

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const createdAt = new Date()
    const newCycle: Cycle = { id: createdAt.getTime(), ...data }

    setCycles((prevCycles) => [...prevCycles, newCycle])
    setActiveCycleId(newCycle.id)
    setCycleSecondsPassed(0)
    reset()
  }

  const handleInterruptCycle = () => {
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

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutesAmount[0]}</span>
          <span>{minutesAmount[1]}</span>
          <Separator>:</Separator>
          <span>{secondsAmount[0]}</span>
          <span>{secondsAmount[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
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
  )
}

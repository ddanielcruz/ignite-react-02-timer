import { useContext } from 'react'
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
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = z.object({
  task: z.string().trim().min(1, 'Informe a tarefa'),
  minutesAmount: z
    .number()
    .min(5, 'Mínimo de 5 minutos')
    .max(60, 'Máximo de 60 minutos'),
})

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, onCreateNewCycle, onCycleInterrupted } =
    useContext(CyclesContext)
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
    onCreateNewCycle(data)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={onCycleInterrupted}>
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

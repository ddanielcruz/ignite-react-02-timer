import { useContext, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'

import { CountdownContainer, Separator } from './styles'
import { CyclesContext } from '../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    cycleSecondsPassed,
    onCycleCompleted,
    onCycleSecondsPassed,
  } = useContext(CyclesContext)

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
          onCycleCompleted()
          onCycleSecondsPassed(0)
        } else {
          onCycleSecondsPassed(diffInSeconds)
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [activeCycle, onCycleCompleted, onCycleSecondsPassed])

  useEffect(() => {
    const isCycleRunning = activeCycle && remainingSeconds > 0
    if (!isCycleRunning) {
      document.title = 'Ignite Timer'
    } else {
      document.title = `${minutesAmount}:${secondsAmount} | Ignite Timer`
    }
  }, [activeCycle, remainingSeconds, minutesAmount, secondsAmount])

  return (
    <CountdownContainer>
      <span>{minutesAmount[0]}</span>
      <span>{minutesAmount[1]}</span>
      <Separator>:</Separator>
      <span>{secondsAmount[0]}</span>
      <span>{secondsAmount[1]}</span>
    </CountdownContainer>
  )
}

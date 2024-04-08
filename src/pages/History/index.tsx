import { useContext } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

import { CyclesContext } from '../../contexts/CyclesContext'
import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
  const { cycles } = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[...cycles].reverse().map((cycle) => {
              const startedAt = new Date(cycle.id)
              const isFinished = Boolean(cycle.completedAt)
              const isInterrupted = Boolean(cycle.interruptedAt)
              const isRunning = !isFinished && !isInterrupted

              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutos</td>
                  <td>
                    {formatDistanceToNow(startedAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td>
                    {isRunning && (
                      <Status variant="yellow">Em andamento</Status>
                    )}
                    {isFinished && <Status variant="green">Concluído</Status>}
                    {isInterrupted && (
                      <Status variant="red">Interrompido</Status>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import style from './RankingTable.module.scss'

const RankingTable = (): JSX.Element => {
  const [ranking, setRanking] = useState<any[] | null>(null)
  const param = useParams()

  useEffect(() => {
    const rankSse = new EventSource('/api/booths/@rank')
    rankSse.onmessage = ({ data }) => {
      data = JSON.parse(data)
      setRanking(data)
    }
  }, [])

  return (
    <table className={style.ranking}>
      <tbody>
        {ranking?.slice(0, 5).map((rank, i) => (
          <tr key={i}>
            <td>{i + 1}등</td>
            <td>
              <p>{rank.name} 부스</p>
              <p>{rank.point}p</p>
            </td>
          </tr>
        ))}
        <tr>
          {ranking !== null && (
            <td colSpan={2} className={style.mybooth}>
              (현재 {ranking.findIndex((v) => v.id === Number(param.id)) + 1}등)
            </td>
          )}
        </tr>
      </tbody>
    </table>
  )
}

export default RankingTable

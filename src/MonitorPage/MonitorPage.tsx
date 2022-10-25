import style from './MonitorPage.module.scss'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js'
import { useEffect, useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const MonitorPage = (): JSX.Element => {
  const [txTable, setTxTable] = useState<any[]>([])
  const [ranking, setRanking] = useState<any[] | null>(null)
  const [stats, setStats] = useState<any[]>([])

  useEffect(() => {
    const rankSse = new EventSource('/api/booths/@rank')
    rankSse.onmessage = ({ data }) => {
      data = JSON.parse(data)
      setRanking(data)
    }

    const txSse = new EventSource('/api/metrics/@sse')
    txSse.onmessage = ({ data }) => {
      setTxTable([data, ...txTable])
    }

    setInterval(() => {
      void (async () => {
        const statsResult = await fetch('/api/metrics').then(async (res) => await res.json())
        setStats([...stats, {
          date: new Date(),
          ...statsResult,
          pm: statsResult.imports - statsResult.holds - statsResult.exports
        }])
      })()
    }, 30 * 1000)
  }, [])

  return (
    <div className={style.container}>
      <div className={style.title}>
        <h1>SowonPay v1</h1>
        <h2>Monitoring Page</h2>
      </div>

      <div className={style.row}>
        <div>
          <div>
            <p><strong>{stats?.[stats.length - 1]?.holds ?? 'loading...'}</strong>p</p>
            <hr />
            <p>Holds (사용자가 들고 있는 포인트)</p>
          </div>
          <div>
            <p><strong>{stats?.[stats.length - 1]?.imports ?? 'loading...'}</strong>p</p>
            <hr />
            <p>Imports (은행에서 발급한 포인트)</p>
          </div>
          <div>
            <p><strong>{stats?.[stats.length - 1]?.exports ?? 'loading...'}</strong>p</p>
            <hr />
            <p>Exports (부스가 지불받은 포인트)</p>
          </div>
          <div>
            <p><strong>{stats?.[stats.length - 1]?.pm ?? 'loading...'}</strong>p</p>
            <hr />
            <p>오차 (I-H-E)</p>
          </div>
        </div>
        <div className={style.grow}>
          <Line
            height={300}
            options={{ maintainAspectRatio: false }}
            data={{
              labels: stats?.reduce((prev, curr) => [...prev, curr.date], []) ?? [],
              datasets: [
                {
                  label: 'Holds',
                  fill: true,
                  data: stats?.reduce((prev, curr) => [...prev, curr.holds], []) ?? []
                },
                {
                  label: 'Imports',
                  fill: true,
                  data: stats?.reduce((prev, curr) => [...prev, curr.imports], []) ?? []
                },
                {
                  label: 'Exports',
                  fill: true,
                  data: stats?.reduce((prev, curr) => [...prev, curr.exports], []) ?? []
                },
                {
                  label: '오차',
                  data: stats?.reduce((prev, curr) => [...prev, curr.pm], []) ?? []
                }
              ]
            }} />
        </div>
      </div>
      <div className={style.row}>
        <div className={style.grow}>
          {txTable}
          {/* <p>0 {'->'} A : 100p 담당자: ㅇㅇㅇ (00시 00분 00초)</p>
          <p>A {'->'} B : 100p 담당자: ㅇㅇㅇ(00시 00분 00초)</p> */}
        </div>
        <div>
          <p><strong>부스 수익금 순위</strong></p>
          <hr />
          <ol>
            {((ranking?.map((v, key) => (
              <li key={key}>{v.name} : {v.point}v</li>
            ))) != null) || 'Loading...'}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default MonitorPage

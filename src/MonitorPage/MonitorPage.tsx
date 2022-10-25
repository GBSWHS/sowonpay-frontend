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
import { useEffect } from 'react'

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
  useEffect(() => {
    const metric = new EventSource('/api/metrics/@sse')
    metric.onmessage = ({ data }) => {

    }
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
            <p><strong>100p</strong></p>
            <hr />
            <p>Holds (사용자가 들고 있는 포인트)</p>
          </div>
          <div>
            <p><strong>200p</strong></p>
            <hr />
            <p>Imports (은행에서 발급한 포인트)</p>
          </div>
          <div>
            <p><strong>100p</strong></p>
            <hr />
            <p>Exports (부스가 지불받은 포인트)</p>
          </div>
          <div>
            <p><strong>0</strong>p</p>
            <hr />
            <p>오차 (I-H-E)</p>
          </div>
        </div>
        <div className={style.grow}>
          <Line
            height={300}
            options={{ maintainAspectRatio: false }}
            data={{
              labels: ['hi', 'hello'],
              datasets: [
                {
                  label: 'Holds',
                  fill: true,
                  data: [1, 2]
                },
                {
                  label: 'Imports',
                  fill: true,
                  data: [3, 2]
                },
                {
                  label: 'Exports',
                  fill: true,
                  data: [2, 5]
                },
                {
                  label: '오차',
                  data: [0, 2]
                }
              ]
            }} />
        </div>
      </div>
      <div className={style.row}>
        <div className={style.grow}>
          <p>0 {'->'} A : 100p 담당자: ㅇㅇㅇ (00시 00분 00초)</p>
          <p>A {'->'} B : 100p 담당자: ㅇㅇㅇ(00시 00분 00초)</p>
        </div>
        <div>
          <p><strong>부스 수익금 순위</strong></p>
          <hr />
          <p>1. ㅇㅇㅇ : 000p</p>
          <p>2. ㅇㅇㅇ : 000p</p>
          <p>3. ㅇㅇㅇ : 000p</p>
        </div>
      </div>
    </div>
  )
}

export default MonitorPage

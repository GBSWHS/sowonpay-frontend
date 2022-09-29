import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCookie } from 'react-use'
import Container from '../Container/Container'
import AnimatedNumbers from 'react-animated-numbers'

import style from './BoothPage.module.scss'
import RankingTable from '../components/RankingTable/RankingTable'
import { FaAngleLeft } from 'react-icons/fa'

const BoothPage = (): JSX.Element => {
  const [booth, setBooth] = useState<any>(null)
  const [, , removeSession] = useCookie('SESSION_TOKEN')
  const param = useParams()

  useEffect(() => {
    document.title = '소원페이 - 부스 상세'
    const pointSse = new EventSource(`/api/booths/${param.id as string}/@sse-point`)
    pointSse.onmessage = ({ data }) => {
      data = JSON.parse(data)
      setBooth({
        ...booth,
        point: data.point
      })
    }

    void (async () => {
      const data = await fetch('/api/users/@me').then(async (res) => {
        if (res.status !== 200) {
          removeSession()
          window.location.reload()
          return
        }
        return await res.json()
      })
      setBooth(data.booths.find((v: any) => v.id === Number(param.id)))
    })()
  }, [])

  return (
    <Container>
      <Link replace to="/"><button className={style.back}><FaAngleLeft /></button></Link>
      <AnimatePresence>
        {booth !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={style.outer}>
            <div className={style.home}>
              <p><strong>{booth.name}</strong> 부스의 총 수익금은?</p>
              <div className={style.point}>
                <AnimatedNumbers
                  animateToNumber={booth.point}
                  includeComma
                  fontStyle={{ fontSize: 50, fontWeight: 800 }}
                  />
                <p>p</p>
              </div>
              <hr />
              <RankingTable />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default BoothPage

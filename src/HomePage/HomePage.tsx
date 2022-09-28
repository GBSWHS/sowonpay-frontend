import { useEffect, useState } from 'react'
import AnimatedNumbers from 'react-animated-numbers'
import Container from '../Container/Container'
import { useCookie } from 'react-use'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Ripple from 'react-ripples'
import { FaQrcode } from 'react-icons/fa'
import QRCode from 'react-qr-code'

import style from './HomePage.module.scss'

const HomePage = (): JSX.Element => {
  const [point, setPoint] = useState(3242)
  const [user, setUser] = useState<any>({})
  const [, , removeSession] = useCookie('SESSION_TOKEN')

  useEffect(() => {
    document.title = '소원페이 - 내포인트'

    const eventSource = new EventSource('/api/users/@live')
    eventSource.onmessage = ({ data }) => {
      data = JSON.parse(data)
      setPoint(data.point)
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
      setUser(data)
    })()
  }, [])

  return (
    <Container>
      <AnimatePresence>
        {Object.keys(user).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={style.outer}>
            <div className={style.home}>
              <div className={style.qr}>
                <QRCode size={256} value={`https://sowonpay.gbsw.hs.kr/users/${user.id as string}`}/>
                <p>QR을 부스 인원이나 은행에 보여주세요</p>
              </div>
              <p className={style.hello}><strong>{user.name}</strong>님의 소원포인트!</p>
              <div className={style.point}>
                <AnimatedNumbers
                  animateToNumber={point}
                  includeComma
                  fontStyle={{ fontSize: 50, fontWeight: 800 }}
                  configs={[
                    { mass: 1, tension: 130, friction: 40 },
                    { mass: 2, tension: 140, friction: 40 },
                    { mass: 3, tension: 130, friction: 40 }]}
                  />
                <p>p</p>
              </div>
            </div>
            {(user.isAdmin === true || user.booths.length > 0) && (
              <Link to="/qrscan"><Ripple className={style.qrscan}><FaQrcode /><p>QR 인식</p></Ripple></Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default HomePage

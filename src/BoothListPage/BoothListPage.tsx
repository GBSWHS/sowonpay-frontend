import Container from '../Container/Container'
import style from './BoothListPage.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import Ripple from 'react-ripples'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCookie } from 'react-use'
import { FaAngleLeft } from 'react-icons/fa'

const BoothListPage = (): JSX.Element => {
  const [me, setMe] = useState<any>(null)
  const [, , removeSession] = useCookie('SESSION_TOKEN')
  const navigate = useNavigate()

  useEffect(() => {
    document.title = '부스 리스트'

    void (async () => {
      const data = await fetch('/api/users/@me').then(async (res) => {
        if (res.status !== 200) {
          removeSession()
          window.location.reload()
          return
        }
        return await res.json()
      })

      if (data.booths.length === 1) {
        navigate(`/booths/${data.booths[0].id as string}`)
      }

      setMe(data)
    })()
  }, [])

  return (
    <Container>
      <Link replace to="/"><button className={style.back}><FaAngleLeft /></button></Link>
      <AnimatePresence>
        {me !== null && (
          <motion.div
            className={style.context}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <h1>부스를 선택해주세요</h1>
            <div className={style.buttons}>
              {me.booths.map((booth: any, i: number) => (
                <Link key={i} to={`/booths/${booth.id as string}`}>
                  <Ripple key={i} className={style.button}>
                    <button>
                      <p>{booth.name}</p>
                    </button>
                  </Ripple>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default BoothListPage

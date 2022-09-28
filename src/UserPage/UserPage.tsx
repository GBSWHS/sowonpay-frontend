import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCookie } from 'react-use'
import Container from '../Container/Container'
import Ripple from 'react-ripples'
import Button from '../components/Button/Button'
import { FaAngleLeft, FaBackspace, FaCheck, FaMoneyBill, FaStore } from 'react-icons/fa'

import style from './UserPage.module.scss'
import Modal from '../components/Modal/Modal'

const UserPage = (): JSX.Element => {
  const [me, setMe] = useState<any>({})
  const [, , removeSession] = useCookie('SESSION_TOKEN')
  const navigate = useNavigate()
  const [type, setType] = useState<'GENERATE' | 'BOOTH'>('BOOTH')
  const [booth, setBooth] = useState<number>(0)
  const [amount, setAmount] = useState<string>('0')
  const params = useParams()
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(0)

  useEffect(() => {
    document.title = '소원페이 - 포인트 송금/생성'

    void (async () => {
      const data = await fetch('/api/users/@me').then(async (res) => {
        if (res.status !== 200) {
          removeSession()
          window.location.reload()
          return
        }
        return await res.json()
      })
      setMe(data)

      if (data.booths.length < 1 && data.isAdmin !== true) {
        alert('웁스. 권한이 없는거 같아요... 이 기능은 부스 인원이나 은행 직원만 사용할 수 있어요.')
        navigate('/')
        return
      }

      if (data.booths.length < 1 && data.isAdmin === true) {
        setStep(2)
        setType('GENERATE')
        return
      }

      if (data.booths.length > 0 && data.isAdmin !== true) {
        setStep(1)
        setType('BOOTH')
      }
    })()
  }, [])

  const onBank = (): void => {
    setType('GENERATE')
    setStep(2)
  }

  const onBooth = (): void => {
    setType('BOOTH')
    if (me.booths.length === 1) {
      setBooth(me.booths[0].id)
      setStep(2)
    } else setStep(1)
  }

  const onAmount = async (): Promise<void> => {
    setStep(3)
    const data = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receiver: params.id,
        booth: type === 'BOOTH' ? booth : undefined,
        amount: Number(amount)
      })
    }).then(async (res) => await res.json())

    if (data.success !== true) {
      setMessage('이런. 상대방의 잔고가 부족합니다.')
      return
    }

    setMessage('요청이 성공적으로 처리되었습니다.')
  }

  const selectBooth = (id: number) => (): void => {
    setBooth(id)
    setStep(2)
  }

  const appendData = (charactor: string): void => {
    setAmount(amount + charactor)
  }

  const backspaceData = (): void => {
    setAmount(amount.slice(0, -1))
  }

  return (
    <Container>
      <Link replace to="/qrscan"><button className={style.back}><FaAngleLeft /></button></Link>
      <AnimatePresence>
        {message.length > 0 && (
          <Modal onClose={() => navigate('/qrscan', { replace: true })} content={message}/>
        )}
      </AnimatePresence>
      {Object.keys(me).length > 0
        ? (<>
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                className={style.context}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <h1>진행할 작업을 선택해주세요</h1>
                <div className={style.buttons}>
                  <Ripple className={style.button}>
                    <button onClick={onBank}>
                      <FaMoneyBill size={25} />
                      <div>
                        <p>소원 은행</p>
                        <p>사용자에게 포인트를 생성합니다.</p>
                      </div>
                    </button>
                  </Ripple>
                  <Ripple className={style.button}>
                    <button onClick={onBooth}>
                      <FaStore size={25} />
                      <div>
                        <p>부스 운영</p>
                        <p>사용자의 포인트를 차감하고 부스 포인트를 추가합니다.</p>
                      </div>
                    </button>
                  </Ripple>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                className={style.context}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <h1>부스를 선택해주세요</h1>
                <div className={style.buttons}>
                  {me.booths.map((booth: any, i: number) => (
                    <Ripple key={i} className={style.button}>
                      <button onClick={selectBooth(booth.id)}>
                        <p>{booth.name}</p>
                      </button>
                    </Ripple>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={(e) => e.preventDefault()}
                className={style.form}>
                <h1><strong>{type === 'GENERATE' ? '생성할' : '상품의'} 금액</strong>을 입력해주세요</h1>
                <div><input disabled value={Number(amount)} />원</div>
                <div className={style.buttons}>
                  <div>
                    <Button onClick={() => appendData('1')}>1</Button>
                    <Button onClick={() => appendData('2')}>2</Button>
                    <Button onClick={() => appendData('3')}>3</Button>
                  </div>
                  <div>
                    <Button onClick={() => appendData('4')}>4</Button>
                    <Button onClick={() => appendData('5')}>5</Button>
                    <Button onClick={() => appendData('6')}>6</Button>
                  </div>
                  <div>
                    <Button onClick={() => appendData('7')}>7</Button>
                    <Button onClick={() => appendData('8')}>8</Button>
                    <Button onClick={() => appendData('9')}>9</Button>
                  </div>
                  <div>
                    <Button onClick={() => backspaceData()}><FaBackspace /></Button>
                    <Button onClick={() => appendData('0')}>0</Button>
                    <Button accent onClick={() => { void onAmount() }}><FaCheck /></Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 3 && (
              <motion.div
                className={style.loading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                처리중...
              </motion.div>
            )}
          </AnimatePresence>
        </>)
        : <></>}
    </Container>
  )
}

export default UserPage

import { useEffect, useState } from 'react'
import Container from '../Container/Container'
import { FaBackspace, FaCheck } from 'react-icons/fa'
import Button from '../components/Button/Button'
import { AnimatePresence, motion } from 'framer-motion'
import { useCookie } from 'react-use'

import style from './LoginPage.module.scss'
import Modal from '../components/Modal/Modal'

const LoginPage = (): JSX.Element => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(0)
  const [message, setMessage] = useState('')
  const [, setSessionToken] = useCookie('SESSION_TOKEN')

  useEffect(() => {
    document.title = '소원페이 - 로그인'
  }, [])

  const appendData = (charactor: string): void => {
    if (step === 0) setPhone(phone + charactor)
    else setCode(code + charactor)
  }

  const backspaceData = (): void => {
    if (step === 0) setPhone(phone.slice(0, -1))
    else setCode(code.slice(0, -1))
  }

  const onClick = async (): Promise<void> => {
    if (step === 1) return
    setStep(step + 1)

    if (step === 0) {
      const data = await fetch('/api/users/@phone-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone
        })
      }).then(async (res) => await res.json()) as { success: boolean }
      if (!data.success) {
        setStep(0)
        setPhone('')
        setMessage('등록되지 않은 전화번호입니다. 이 서비스는 경북소프트웨어고등학교 학생만 이용할 수 있습니다. (추가요청: 고교전교회장)')
        return
      }

      setStep(2)
      return
    }

    if (step === 2) {
      setStep(1)

      const data = await fetch('/api/users/@phone-verify-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone, code
        })
      }).then(async (res) => await res.json()) as { success: boolean, token: string }
      if (!data.success) {
        setStep(0)
        setCode('')
        setMessage('인증번호가 맞지 않습니다.')
        return
      }

      setSessionToken(data.token)
      window.location.reload()
    }
  }

  return (
    <Container>
      <AnimatePresence>
        {message.length > 0 && (
          <Modal onClose={() => setMessage('')} content={message}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(step === 0 || step === 2) && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => e.preventDefault()}
            className={style.form}>
            <h1><strong>{step === 0 ? '전화번호' : '인증번호'}</strong>를 입력해주세요</h1>
            <input disabled value={step === 0 ? phone : code} />
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
              {step === 2 && <>
                <div>
                  <Button onClick={() => appendData('A')}>A</Button>
                  <Button onClick={() => appendData('B')}>B</Button>
                  <Button onClick={() => appendData('C')}>C</Button>
                </div>
                <div>
                  <Button onClick={() => appendData('D')}>D</Button>
                  <Button onClick={() => appendData('E')}>E</Button>
                  <Button onClick={() => appendData('F')}>F</Button>
                </div>
              </>}
              <div>
                <Button onClick={() => backspaceData()}><FaBackspace /></Button>
                <Button onClick={() => appendData('0')}>0</Button>
                <Button accent={step === 0 ? phone.length > 10 : code.length > 5} onClick={() => { void onClick() }}><FaCheck /></Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            className={style.loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            Processing...
          </motion.div>
        )}
      </AnimatePresence>
   </Container>
  )
}

export default LoginPage

import { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import QRScannerComponent from 'react-qr-barcode-scanner'
import { useNavigate } from 'react-router-dom'
import Container from '../Container/Container'
import Ripple from 'react-ripples'

import style from './QRScanPage.module.scss'

const QRScanPage = (): JSX.Element => {
  const [text, setText] = useState('')
  const [stopStream, setStopStream] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    document.title = '소원페이 - QR스켄'
  }, [])

  const onStop = (): void => {
    setStopStream(true)
    navigate('/')
  }

  useEffect(() => {
    if (text.startsWith('https://sowonpay.gbsw.hs.kr/users/')) {
      navigate('/users/' + text.split('/')[text.split('/').length - 1])
    }
  }, [text])

  return (
    <Container>
      <div className={style.qr}>
        <QRScannerComponent stopStream={stopStream} width={500} height={500} onUpdate={(_, result) => {
          if (result !== undefined) setText(result.getText())
        }} />
        <Ripple className={style.back}><button onClick={onStop}><FaAngleLeft /><p>뒤로가기</p></button></Ripple>
      </div>
    </Container>
  )
}

export default QRScanPage

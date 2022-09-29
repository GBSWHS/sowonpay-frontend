import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

interface Props {
  id: number
}

const QRMaker = ({ id }: Props): JSX.Element => {
  const [qrkey, setQrkey] = useState<string>('')

  useEffect(() => {
    const qrSse = new EventSource('/api/transactions/@sse-qr')
    qrSse.onmessage = ({ data }) => {
      data = JSON.parse(data)
      setQrkey(data.qrcode)
    }
  }, [])

  return (
    <>
      <QRCode size={256} value={`https://sowonpay.shutupandtakemy.codes/users/${id}?key=${qrkey}`}/>
    </>
  )
}

export default QRMaker

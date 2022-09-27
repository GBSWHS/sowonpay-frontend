import { motion } from 'framer-motion'
import style from './Modal.module.scss'

interface Props {
  onClose: () => any
  content: string
}

const Modal = ({ onClose, content }: Props): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={style.modalbg}>
      <div className={style.modal}>
        <h3>알림</h3>
        <p>{content}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </motion.div>
  )
}

export default Modal

import { ReactNode } from 'react'
import Ripples from 'react-ripples'

import style from './Button.module.scss'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  accent?: boolean
}

const Button = ({ children, onClick, accent = false }: ButtonProps): JSX.Element =>
  <Ripples className={style.button + ' ' + (accent ? style.accent : '')}>
    <button onClick={onClick}>{children}</button>
  </Ripples>

export default Button

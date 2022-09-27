import style from './Container.module.scss'

interface Props {
  children: JSX.Element | JSX.Element[]
}

const Container = ({ children }: Props): JSX.Element => {
  return (
    <div className={style.container}>
      <div className={style.context}>
        {children}
      </div>
    </div>
  )
}

export default Container

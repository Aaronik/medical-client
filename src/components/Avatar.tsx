import React from 'react'
import { TUser } from 'types/User.d'
import strings from './Avatar.strings'
import './Avatar.sass'

type TProps = {
  user: TUser
  className?: string
  onClick?: Function
  size?: number
}

const Avatar: React.FC<TProps> = ({ user, className, onClick, size }) => {
  const initials = user.name.split(' ').map(name => name[0]).join('').toUpperCase()

  const eventlessOnClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick && onClick()
  }

  const style = {
    cursor: onClick ? 'pointer' : 'default',
    width: size ? `${size}px` : undefined,
    height: size ? `${size}px` : undefined,
  }

  let cName = 'user-avatar bg-primary d-flex align-items-center justify-content-center '
  if (className) cName += className

  let src = user.imageUrl ? user.imageUrl : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  if (user.imageUrl)
    return <img alt={strings('userAvatar')} src={src} className={cName} style={style} onMouseDown={eventlessOnClick} />
  else
    return <div className={cName} style={style} onMouseDown={eventlessOnClick}>{initials}</div>
}

export default Avatar

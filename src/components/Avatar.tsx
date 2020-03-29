import React from 'react'
import { TUser } from 'types/User.d'
import strings from './Avatar.strings'

type TProps = {
  user: TUser
  className?: string
  onClick?: Function
  size?: number
}

const Avatar: React.FC<TProps> = ({ user, className, onClick, size = 50 }) => {
  const initials = user.name.split(' ').map(name => name[0]).join('').toUpperCase()

  const eventlessOnClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick && onClick()
  }

  const imageStyle = {
    cursor: onClick ? 'pointer' : 'default',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '100%',
    fontWeight: 'bold',
  } as const

  let cName = 'bg-primary d-flex align-items-center justify-content-center '
  if (className) cName += className

  let src = user.imageUrl ? user.imageUrl : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  if (user.imageUrl)
    return (
      <div>
        <img alt={strings('userAvatar')} src={src} className={cName} style={imageStyle} onMouseDown={eventlessOnClick} />
      </div>
    )
  else
    return (
      <div className={cName} style={imageStyle} onMouseDown={eventlessOnClick}>{initials}</div>
    )
}

export default Avatar

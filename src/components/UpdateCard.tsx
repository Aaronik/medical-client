import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

// This "UpdateCard" is a notification card, small reactangular, with a colorful square
// rising above the middle of it containing an up or down arrow, or a neutral "-" sign.
// It houses notifications like "Average Health Score", "Dysfunctions Identified",
// "Steps Last Week", etc. For an example,
// https://app.zeplin.io/project/5dd5a6d207e6f7bc28a1eb61/screen/5df7fdef5b840c1b0b2829ec

const CHARGE_COLORS = {
  good: 'success',
  bad: 'danger',
  neutral: 'warning'
}

const SYMBOL_ICONS = {
  up: icons.faArrowUp,
  down: icons.faArrowDown,
  neutral: icons.faMinus
}

export type TProps = {
  symbol: 'up' | 'down' | 'neutral'  // Which direction the arrow points (or whether it's -)
  charge: 'good' | 'bad' | 'neutral' // Is this a good or bad change? This determines the color
  body: string                       // Verbal contents of card (ex. 89%)
  footer: string                     // Footer (description of body, ex. Dysfunctions Identified)
  className?: string
}

const UpdateCard: React.FC<TProps> = ({ symbol, charge, body, footer, className }) => {
  const indicatorColor = CHARGE_COLORS[charge]
  const icon           = SYMBOL_ICONS[symbol]

  const cardStyle = {
    width: '250px',
    height: '125px',
    borderRadius: '15px',
  } as const

  const indicatorStyle = {
    marginTop: '-25px', // randomly found to bring it up enough
    borderRadius: '20px',
    width: '60px',
    height: '60px',
  } as const

  return (
    <div style={cardStyle} className={'bg-white d-flex flex-column align-items-center justify-content-around ' + className}>

      <div className={'d-flex align-items-center justify-content-center mx-auto bg-' + indicatorColor} style={indicatorStyle}>
        <FontAwesomeIcon icon={icon} size='lg'/>
      </div>

      <h3>{body}</h3>

      <p className='text-muted'>{footer}</p>
    </div>
  )
}

export default UpdateCard

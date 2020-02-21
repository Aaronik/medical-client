import React from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { TUser } from 'types/User.d'
import PatientPicker from 'components/PatientPicker'
import Fade from 'components/Fade'
import './AppGutterNav.sass'

const Separator: React.FC<{}> = () => (
  <hr className='mt-3 mb-2 mx-auto' style={{ width: '80%' }}/>
)

type SeparatorType = { separator: true }

export type LinkEntryProps = {
  to: string
  text: string
  icon: icons.IconDefinition
  exact?: boolean
  fade?: boolean // If the links are going to be dis/appearing rapidly, setting this to true is easier on the eyes
} | SeparatorType

type LinkEntryPropsWithRouter = LinkEntryProps

const NavEntry: React.FC<LinkEntryPropsWithRouter> = (props) => {
  // have to use props as any trick b/c typescript just cannot discriminate b/t two object types
  // along with a react hook.
  const { to, text, icon, exact, fade, separator } = props as any

  const history = useHistory()
  let match = useRouteMatch(to)

  if (separator) return <Separator/>

  let containerClassName = 'nav-entry'

  // the url is a match, and _if_ dev specified exact, if the match is an exact match
  if (match && (exact ? match.isExact : true)) containerClassName += ' active'

  const entry = (
    <span className={containerClassName} onMouseDown={() => history.push(to)}>
      <FontAwesomeIcon icon={icon} className='icon' size='lg'/>
      <Nav.Link>{text}</Nav.Link>
    </span>
  ) as JSX.Element

  if (fade) return <Fade>{entry}</Fade>
  else      return entry
}

// Column Sizes
// Change these and both the side nav _and_ nav aware container will adjust.
// This is how you change side nav sizing.
const cs = {
  xl: 2,
  lg: 3,
  md: 3,
  sm: 4,
  xs: 6 // note: not an actual bootstrap size in classes
}

type AppGutterNavProps = {
  entries: LinkEntryProps[]
  gutterNavActive: boolean
  patients?: TUser[] // If this is not supplied, we won't show the patient picker at all.
  activePatient?: TUser
}

const TOGGLE_GUTTER_NAV = gql`
  mutation {
    toggleGutterNav @client
  }
`

export const GutterNavToggleButton: React.FC<{ className?: string }> = ({ className }) => {

  const [ toggleGutterNav, { client } ] = useMutation(TOGGLE_GUTTER_NAV)

  const onSandwichClick = async () => {
    await toggleGutterNav()
    client?.reFetchObservableQueries()
  }

  return (
    <div className={className} onClick={onSandwichClick} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon icon={icons.faBars} size='2x' color='black'/>
    </div>
  )
}

const AppGutterNav: React.FC<AppGutterNavProps> = ({ entries, gutterNavActive, patients, activePatient }) => {
  let containerClassName = 'app-gutter-nav flex-column'
  containerClassName += ` col-xl-${cs.xl}`
  containerClassName += ` col-lg-${cs.lg}`
  containerClassName += ` col-md-${cs.md}`
  containerClassName += ` col-sm-${cs.sm}`
  containerClassName += ` col-${cs.xs}`
  containerClassName += gutterNavActive ? ' d-flex' : ' d-none'

  const navEntries = entries.map((e, idx) => <NavEntry key={idx} {...e}/>)

  if (!patients) return <Nav className={containerClassName}>{navEntries}</Nav>

  return (
    <Nav className={containerClassName}>
      <PatientPicker patients={patients} activePatient={activePatient}/>
      <Separator/>
      { navEntries }
    </Nav>
  )
}

export default AppGutterNav

// Use this at the same level as you use the AppGutterNav.
// This provides a container that allows you to place anything in it, while
// respecting the size of the gutter nav.
export const GutterAwareFluidContainer: React.FC<{ gutterNavActive: boolean}> = ({ children, gutterNavActive }) => {
  let className = ''

  if (gutterNavActive) {
    className += ` col-xl-${12 - cs.xl}`
    className += ` col-lg-${12 - cs.lg}`
    className += ` col-md-${12 - cs.md}`
    className += ` col-sm-${12 - cs.sm}`
    className += ` col-${12 - cs.xs}`

    className += ` offset-xl-${cs.xl}`
    className += ` offset-lg-${cs.lg}`
    className += ` offset-md-${cs.md}`
    className += ` offset-sm-${cs.sm}`
    className += ` offset-${cs.xs}`
  }

  return (
    <Container fluid className={className}>
      {children}
    </Container>
  )
}

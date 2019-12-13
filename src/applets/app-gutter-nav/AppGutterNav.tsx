import React from 'react'
import { connect } from 'react-redux'
import { useRouteMatch, RouteComponentProps, withRouter } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { toggleGutterNav } from './AppGutterNav.actions'
import { TStoreState } from 'common/store'
import PatientPicker from 'applets/patient-picker/PatientPicker'
import Fade from 'common/components/Fade'
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

type LinkEntryPropsWithRouter = LinkEntryProps & RouteComponentProps

const _NavEntry: React.FC<LinkEntryPropsWithRouter> = (props) => {
  // have to use props as any trick b/c typescript just cannot discriminate b/t two object types
  // along with a react hook.
  const { to, text, icon, exact, fade, history, separator } = props as any

  let match = useRouteMatch(to)

  if (separator) return <Separator/>

  let containerClassName = 'nav-entry'

  // the url is a match, and _if_ dev specified exact, if the match is an exact match
  if (match && (exact ? match.isExact : true)) containerClassName += ' active'

  const entry = (
    <span className={containerClassName} onClick={() => history.push(to)}>
      <FontAwesomeIcon icon={icon} className='icon' size='lg'/>
      <Nav.Link as={Link} to={to}>{text}</Nav.Link>
    </span>
  ) as JSX.Element

  if (fade) return <Fade>{entry}</Fade>
  else      return entry
}

const NavEntry = withRouter(_NavEntry)

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
}

export const GutterNavToggleButton: React.FC<{ className?: string }> = ({ className }) => {
  const onSandwichClick = () => {
    toggleGutterNav()
  }

  return (
    <div className={className} onClick={onSandwichClick} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon icon={icons.faBars} size='2x' color='black'/>
    </div>
  )
}

const AppGutterNav: React.FC<AppGutterNavProps> = ({ entries, gutterNavActive }) => {
  let containerClassName = 'app-gutter-nav flex-column'
  containerClassName += ` col-xl-${cs.xl}`
  containerClassName += ` col-lg-${cs.lg}`
  containerClassName += ` col-md-${cs.md}`
  containerClassName += ` col-sm-${cs.sm}`
  containerClassName += ` col-${cs.xs}`
  containerClassName += gutterNavActive ? ' d-flex' : ' d-none'

  return (
    <Nav className={containerClassName}>
      <PatientPicker/>
      <Separator/>
      { entries.map((e, idx) => <NavEntry key={idx} {...e}/>) }
    </Nav>
  )
}

export default connect((storeState: TStoreState) => {
  return {
    gutterNavActive: storeState.appGutterNav.gutterNavActive
  }
})(AppGutterNav)

// Use this at the same level as you use the AppGutterNav.
// This provides a container that allows you to place anything in it, while
// respecting the size of the gutter nav.
const GutterAwareFluidContainerSansConnect: React.FC<{ gutterNavActive: boolean}> = ({ children, gutterNavActive }) => {
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

export const GutterAwareFluidContainer = connect((storeState: TStoreState) => {
  return {
    gutterNavActive: storeState.appGutterNav.gutterNavActive
  }
})(GutterAwareFluidContainerSansConnect)

import React from 'react'
import { connect } from 'react-redux'
import { useRouteMatch } from "react-router-dom"
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import 'app-gutter-nav/styles/index.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { toggleGutterNav } from 'app-gutter-nav/actions'
import { TStoreState } from 'store'

export type LinkEntryProps = {
  to: string
  text: string
  icon: icons.IconDefinition
  exact?: boolean
}

const NavEntry: React.FC<LinkEntryProps> = ({ to, text, icon, exact }) => {
  let match = useRouteMatch(to)

  let containerClassName = "nav-entry"

  // the url is a match, and _if_ dev specified exact, if the match is an exact match
  if (match && (exact ? match.isExact : true)) containerClassName += " active"

  return (
    <span className={containerClassName}>
      <FontAwesomeIcon icon={icon} className="icon"/>
      <Nav.Link as={Link} to={to}>{text}</Nav.Link>
    </span>
  )
}

// Column Sizes
// Change these and both the side nav _and_ nav aware container will adjust.
// This is how you change side nav sizing.
const cs = {
  xl: 1,
  lg: 2,
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
    <div className={className} onClick={onSandwichClick}>
      <FontAwesomeIcon icon={icons.faBars} size="2x" color="grey"/>
    </div>
  )
}

const AppGutterNav: React.FC<AppGutterNavProps> = ({ entries, gutterNavActive }) => {
  let containerClassName = "app-gutter-nav flex-column"
  containerClassName += ` col-xl-${cs.xl}`
  containerClassName += ` col-lg-${cs.lg}`
  containerClassName += ` col-md-${cs.md}`
  containerClassName += ` col-sm-${cs.sm}`
  containerClassName += ` col-${cs.xs}`
  containerClassName += gutterNavActive ? ' d-flex' : ' d-none'

  return (
    <Nav className={containerClassName}>
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
  let className = ""
  className += ` col-xl-${12 - cs.xl}`
  className += ` col-lg-${12 - cs.lg}`
  className += ` col-md-${12 - cs.md}`
  className += ` col-sm-${12 - cs.sm}`
  className += ` col-${12 - cs.xs}`

  if (gutterNavActive) {
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

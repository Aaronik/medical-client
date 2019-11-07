import React from 'react'
import { useRouteMatch } from "react-router-dom"
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import 'app-gutter-nav/styles/index.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

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
  xl: 2,
  md: 2,
  sm: 4,
  xs: 12
}

type AppGutterNavProps = {
  entries: LinkEntryProps[]
}

const AppGutterNav: React.FC<AppGutterNavProps> = ({ entries }) => {
  let className = "app-gutter-nav d-flex flex-column"
  className += ` col-xl-${cs.xl}`
  className += ` col-md-${cs.md}`
  className += ` col-sm-${cs.sm}`
  className += ` col-xs-${cs.xs}`

  return (
    <Nav className={className}>
      { entries.map(e => <NavEntry{...e}/>) }
    </Nav>
  )
}

// Use this at the same level as you use the AppGutterNav.
// This provides a container that allows you to place anything in it, while
// respecting the size of the gutter nav.
export const GutterAwareFluidContainer: React.FC = ({ children }) => {
  let className = ""
  className += ` col-xl-${12 - cs.xl}`
  className += ` offset-xl-${cs.xl}`
  className += ` col-md-${12 - cs.md}`
  className += ` offset-md-${cs.md}`
  className += ` col-sm-${12 - cs.sm}`
  className += ` offset-sm-${cs.sm}`
  className += ` col-xs-${12 - cs.xs}`
  className += ` offset-xs-${cs.xs}`

  return (
    <Container fluid className={className}>
      {children}
    </Container>
  )
}

export default AppGutterNav


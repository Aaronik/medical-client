import React from 'react'
import { useRouteMatch } from "react-router-dom"
import Nav from 'react-bootstrap/Nav'
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

type AppGutterNavProps = {
  entries: LinkEntryProps[]
}

const AppGutterNav: React.FC<AppGutterNavProps> = ({ entries }) => {
  const NavEntries = entries.map(entry => (
    <NavEntry {...entry}/>
  ))

  return (
    <Nav className="app-gutter-nav col-xl-1 col-md-2 col-sm-4 col-12 d-flex flex-column">
      { NavEntries }
    </Nav>
  )
}

export default AppGutterNav

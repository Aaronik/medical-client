import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import * as Survey from "survey-react"
import TimelineDemo from './timeline/components/demo'
import './App.scss'

const HomeStubContainer = () => <div>Home</div>
const SurveyStubContainer = () => <div>Survey</div>
const TimelineStubContainer = () => <TimelineDemo/>
const PageNotFound = () => <div>Page Not Found!! :(</div>

class App extends Component {

	render() {
    return (
      <Router>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand><Link to="/">Milli</Link></Navbar.Brand>
          <Nav.Link><Link to="/survey">Survey</Link></Nav.Link>
          <Nav.Link><Link to="/timeline">Timeline</Link></Nav.Link>
        </Navbar>

        <Switch>
          <Route path="/" exact component={HomeStubContainer} />
          <Route path="/survey" component={SurveyStubContainer} />
          <Route path="/timeline" component={TimelineStubContainer} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    )
	}
}

export default App

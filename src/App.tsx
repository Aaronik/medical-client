import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider } from 'react-redux'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import TimelineContainer from './timeline/components/container'
import LoginContainer from './login/components/container'
import Alert from './error/components/Alert'
import store from './store'
import './App.scss'

const HomeStubContainer = () => <div>Home</div>
const SurveyStubContainer = () => <div>Survey</div>
const PageNotFound = () => <div>Page Not Found!! :(</div>

const App = () => {

  return (
    <Provider store={store}>
      <Router>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand><Link to="/">Milli</Link></Navbar.Brand>
          <Nav.Link as={Link} to="/survey">Survey</Nav.Link>
          <Nav.Link as={Link} to="/timeline">Timeline</Nav.Link>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        </Navbar>

        <Alert />

        <Switch>
          <Route path="/" exact component={HomeStubContainer} />
          <Route path="/survey" component={SurveyStubContainer} />
          <Route path="/timeline" component={TimelineContainer} />
          <Route path="/login" component={LoginContainer} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>

    </Provider>
  )
}

export default App

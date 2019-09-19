import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import TimelineContainer from './timeline/components/container'
import LoginContainer from './login/components/container'
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
          <Nav.Link><Link to="/survey">Survey</Link></Nav.Link>
          <Nav.Link><Link to="/timeline">Timeline</Link></Nav.Link>
          <Nav.Link><Link to="/login">Login</Link></Nav.Link>
        </Navbar>

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

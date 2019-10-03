import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider } from 'react-redux'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import TimelineContainer from 'timeline/components/container'
import SurveyContainer from 'survey/components/container'
import AuthDropdown from 'auth/components/dropdown'
import Alert from 'error/components/Alert'
import { loadHostMap } from 'auth/actions'
import store from 'store'
import 'App.scss'

const HomeStubContainer = () => <div>Home</div>
const PageNotFound = () => <div>Page Not Found!! :(</div>

export default class App extends React.Component {
  componentWillMount() {
    loadHostMap()
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Navbar bg="dark" variant="dark" className="justify-content-between">
            <Nav>
              <Navbar.Brand><Link to="/">Milli</Link></Navbar.Brand>
              <Nav.Link as={Link} to="/survey">Survey</Nav.Link>
              <Nav.Link as={Link} to="/timeline">Timeline</Nav.Link>
            </Nav>
            <Nav>
              <AuthDropdown/>
            </Nav>
          </Navbar>

          <Alert />

          <Switch>
            <Route path="/" exact component={HomeStubContainer} />
            <Route path="/survey" component={SurveyContainer} />
            <Route path="/timeline" component={TimelineContainer} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>

      </Provider>
    )
  }
}

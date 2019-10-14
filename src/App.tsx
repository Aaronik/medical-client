import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider } from 'react-redux'
import { StylesManager } from 'survey-react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import DoctorDashboard from 'doctor-dashboard/components'
import PatientContainer from 'doctor-dashboard/components/PatientContainer'
import AuthDropdown from 'auth/components/dropdown'
import SigninContainer from 'signin/components'
import Alert from 'error/components/Alert'
import { loadHostMap } from 'auth/actions'
import store from 'store'
import 'App.scss'

// Things to do once when the page loads
loadHostMap()
document.title = 'Milli Health'
StylesManager.applyTheme('bootstrap')
require('timeline-plus/dist/timeline.css')

const PageNotFound = () => <div>Page Not Found!! :(</div>

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router>
      <Navbar bg="dark" variant="dark" className="justify-content-between">
        <Nav>
          <Navbar.Brand><Link to="/">Milli</Link></Navbar.Brand>
          <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
        </Nav>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </Navbar>

      <Alert />

      <Switch>
        <Route path="/" exact component={DoctorDashboard} />
        <Route path="/patients/:patientId" component={PatientContainer} />
        <Route path="/signin" component={SigninContainer} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>

  </Provider>
)

export default App

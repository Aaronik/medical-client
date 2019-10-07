import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider } from 'react-redux'
import { StylesManager } from 'survey-react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import DoctorDashboard from 'doctor-dashboard/components'
import PatientContainer from 'doctor-dashboard/components/PatientContainer'
import AuthDropdown from 'auth/components/dropdown'
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

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Navbar bg="dark" variant="dark" className="justify-content-between">
            <Nav>
              <Navbar.Brand><Link to="/">Milli</Link></Navbar.Brand>
            </Nav>
            <Nav>
              <AuthDropdown/>
            </Nav>
          </Navbar>

          <Alert />

          <Switch>
            <Route path="/" exact component={DoctorDashboard} />
            <Route path="/patients/:patientId" component={PatientContainer} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>

      </Provider>
    )
  }
}

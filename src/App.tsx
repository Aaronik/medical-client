import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider, connect } from 'react-redux'
import { StylesManager } from 'survey-react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import DoctorDashboard from 'doctor-dashboard/components'
import PatientContainer from 'doctor-dashboard/components/PatientContainer'
import AuthDropdown from 'auth/components/dropdown'
import SigninContainer from 'signin/components'
import DoctorProfileContainer from 'doctor-profile/components'
import Alert from 'error/components/Alert'
import PageNotFound from 'not-found/components'
import NotSignedInContainer from 'common/components/NotSignedIn'
import { loadHostMap } from 'auth/actions'
import store, { isSignedIn } from 'store'
import 'App.scss'

// Things to do once when the page loads
loadHostMap()
StylesManager.applyTheme('bootstrap')
require('timeline-plus/dist/timeline.css')

const AppNavbar: React.FC = ({ children }) => <Navbar bg="dark" variant="dark" className="justify-content-between">{children}</Navbar>
const MilliBrandNav = () => <Nav><Navbar.Brand><Link to="/"><Image width={70} height={25} src="milli-logo.png"/></Link></Navbar.Brand></Nav>

const SignedOutBase: React.FunctionComponent = () => {
  return (
    <div>
      <AppNavbar>
        <MilliBrandNav/>
        <Nav>
          <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
        </Nav>
      </AppNavbar>

      <Alert />

      <Switch>
        <Route path="/" exact component={NotSignedInContainer} />
        <Route path="/signin" component={SigninContainer} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  )
}

const SignedInBase: React.FunctionComponent = () => {
  return (
    <div>
      <AppNavbar>
        <MilliBrandNav/>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </AppNavbar>

      <Alert />

      <Switch>
        <Route path="/" exact component={DoctorDashboard} />
        <Route path="/patients/:patientId" component={PatientContainer} />
        <Route path="/signin" component={SigninContainer} />
        <Route path="/profile" component={DoctorProfileContainer} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  )
}

const Base: React.FunctionComponent<{ isSignedIn: boolean }> = ({ isSignedIn }) => {
  return (
    <Router>
      { isSignedIn ? <SignedInBase/> : <SignedOutBase/> }
    </Router>
  )
}

const ContainerWithProps = connect(() => {
  return { isSignedIn: isSignedIn() }
})(Base)

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <ContainerWithProps/>
  </Provider>
)

export default App

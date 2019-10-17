import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider, connect } from 'react-redux'
import { StylesManager } from 'survey-react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import DoctorDashboard from 'doctor-dashboard/components'
import AdminDashboard from 'admin-dashboard/components'
import PatientContainer from 'doctor-dashboard/components/PatientContainer'
import AuthDropdown from 'auth/components/dropdown'
import SigninContainer from 'signin/components'
import DoctorProfileContainer from 'doctor-profile/components'
import Alert from 'alert/components/Alert'
import PageNotFound from 'not-found/components'
import NotSignedInContainer from 'common/components/NotSignedIn'
import { loadHostMap } from 'auth/actions'
import store, { currentUser } from 'store'
import { TUserType as TStoreUserType } from 'user/types.d'
import 'App.scss'

// Things to do once when the page loads
loadHostMap()
StylesManager.applyTheme('bootstrap')
require('timeline-plus/dist/timeline.css')

const AppNavbar: React.FC = ({ children }) => <Navbar bg="dark" variant="dark" className="justify-content-between">{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to="/"><Image width={70} height={25} src="milli-logo.png"/></Link></Navbar.Brand>

const SignedOutBase: React.FunctionComponent = () => {
  return (
    <div>
      <AppNavbar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
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

const AdminBase: React.FunctionComponent = () => {
  return (
    <div>
      <AppNavbar>
        <Nav>
          <MilliBrandLink/>
          <Nav.Link as={Link} to="/doctors">Doctors</Nav.Link>
        </Nav>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </AppNavbar>

      <Alert />

      <Switch>
        <Route path="/" exact component={AdminDashboard} />
        <Route path="/doctors" component={() => <h1>Admin/Doctors</h1>} />
        <Route path="/profile" component={() => <h1>Admin Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  )
}

const DoctorBase: React.FunctionComponent = () => {
  return (
    <div>
      <AppNavbar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
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

const PatientBase: React.FunctionComponent = () => {
  return (
    <div>
      <AppNavbar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </AppNavbar>

      <Alert />

      <Switch>
        <Route path="/" exact component={() => <h1>Patient</h1>} />
        <Route path="/profile" component={() => <h1>Patient Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  )
}

type TUserType = TStoreUserType | 'SIGNED_OUT'

const Base: React.FunctionComponent<{ userType: TUserType }> = ({ userType }) => {
  let Component = <SignedOutBase />

  switch (userType) {
    case 'ADMIN':
      Component = <AdminBase />
      break
    case 'DOCTOR':
      Component = <DoctorBase />
      break
    case 'PATIENT':
      Component = <PatientBase />
      break
  }

  return (
    <Router>
      { Component }
    </Router>
  )
}

const BaseWithProps = connect(() => {
  const userType: TUserType = currentUser() ? currentUser().type : 'SIGNED_OUT'

  return {
    userType: userType
  }
})(Base)

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <BaseWithProps/>
  </Provider>
)

export default App

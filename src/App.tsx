import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider, connect } from 'react-redux'
import { StylesManager } from 'survey-react'
import * as icons from '@fortawesome/free-solid-svg-icons'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import DoctorDashboard from 'doctor-dashboard/components'
import AdminDashboard from 'admin-dashboard/components'
import PatientContainer from 'doctor-dashboard/components/PatientContainer'
import AuthDropdown from 'auth/components/dropdown'
import SigninContainer from 'signin/components'
import SignupContainer from 'signup/components'
import DoctorProfileContainer from 'doctor-profile/components'
import PatientDashboard from 'patient-dashboard/components'
import PatientIntakeContainer from 'patient-dashboard/components/IntakeContainer'
import Alert from 'alert/components/Alert'
import AppGutterNav, { LinkEntryProps } from 'app-gutter-nav/components'
import PageNotFound from 'not-found/components'
import NotSignedInContainer from 'common/components/NotSignedIn'
import { loadHostMap } from 'auth/actions'
import store, { currentUser } from 'store'
import { TUserType as TStoreUserType } from 'user/types.d'
import 'App.sass'

// Things to do once when the page loads
loadHostMap()
StylesManager.applyTheme('bootstrap')

const AppNavBar: React.FC = ({ children }) => <Navbar className="justify-content-between app-navbar">{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to="/"><Image width={70} height={25} src="milli-logo.png"/></Link></Navbar.Brand>

const SignedOutBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
          <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path="/" exact component={NotSignedInContainer} />
        <Route path="/signin" component={SigninContainer} />
        <Route path="/signup" component={SignupContainer} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

const AdminBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
          <Nav.Link as={Link} to="/doctors">Doctors</Nav.Link>
        </Nav>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path="/" exact component={AdminDashboard} />
        <Route path="/doctors" component={() => <h1>Admin/Doctors</h1>} />
        <Route path="/profile" component={() => <h1>Admin Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

const DoctorBase: React.FunctionComponent = () => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: "/", text: "Dashboard", icon: icons.faSquare, exact: true },
    { to: "/messages", text: "Messages", icon: icons.faCommentDots },
    { to: "/timeline", text: "Health Timeline", icon: icons.faCheckCircle },
    { to: "/schedule", text: "Schedule", icon: icons.faCalendar },
    { to: "/activity", text: "Activity", icon: icons.faClock },
    { to: "/settings", text: "Settings", icon: icons.faCog },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <AppGutterNav entries={gutterRoutes}/>

      <Switch>
        <Route path="/" exact component={DoctorDashboard} />
        <Route path="/patients/:patientId" component={PatientContainer} />
        <Route path="/profile" component={DoctorProfileContainer} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

const PatientBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
          <Nav.Link as={Link} to="/intake">Intake Survey</Nav.Link>
        </Nav>
        <Nav>
          <AuthDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path="/" exact component={PatientDashboard} />
        <Route path="/intake" exact component={PatientIntakeContainer} />
        <Route path="/profile" component={() => <h1>Patient Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
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
    userType: 'DOCTOR' as 'DOCTOR' || userType
  }
})(Base)

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <BaseWithProps/>
  </Provider>
)

export default App

import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { Provider, connect } from 'react-redux'
import { StylesManager } from 'survey-react'
import * as icons from '@fortawesome/free-solid-svg-icons'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import DoctorDashboard from 'pages/doctor-dashboard/DoctorDashboard'
import PatientPage from 'pages/doctor-dashboard/PatientPage'
import AdminDashboard from 'pages/admin-dashboard/AdminDashboard'
import ProfileDropdown from 'applets/profile-dropdown/ProfileDropdown'
import SigninPage from 'pages/signin/SignIn'
import SignupPage from 'pages/signup/SignUp'
import DoctorProfilePage from 'pages/doctor-profile/DoctorProfile'
import SettingsPage from 'pages/doctor-settings/DoctorSettings'
import PatientDashboard from 'pages/patient-dashboard/PatientDashboard'
import PatientIntakePage from 'pages/patient-intake/PatientIntake'
import Alert from 'applets/alert/Alert'
import AppGutterNav, { LinkEntryProps, GutterAwareFluidContainer, GutterNavToggleButton } from 'applets/app-gutter-nav/AppGutterNav'
import PageNotFound from 'pages/not-found/NotFound'
import NotSignedInPage from 'pages/not-signed-in/NotSignedIn'
import { loadHostMap } from 'concerns/auth/Auth.actions'
import store from 'common/store'
import currentUser from 'common/util/currentUser'
import { TUserType as TStoreUserType } from 'concerns/user/User.d'
import strings from './App.strings'
import 'App.sass'

// Things to do once when the page loads
loadHostMap()
StylesManager.applyTheme('bootstrap')

const AppNavBar: React.FC = ({ children }) => <Navbar className="justify-content-between app-navbar">{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to="/"><Image width={70} height={25} src="/milli-logo.png"/></Link></Navbar.Brand>
const NavLink = ({ to, text }: { to: string, text: string }) => <Nav.Link as={Link} to={to}>{text}</Nav.Link>

const SignedOutBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <NavLink to="/signin" text={strings('signIn')} />
          <NavLink to="/signup" text={strings('signUp')} />
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path="/" exact component={NotSignedInPage} />
        <Route path="/signin" component={SigninPage} />
        <Route path="/signup" component={SignupPage} />
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
          <NavLink to="/doctors" text={strings('doctors')} />
        </Nav>
        <Nav>
          <ProfileDropdown/>
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
    { to: "/", text: strings('dashboard'), icon: icons.faSquare, exact: true },
    { to: "/messages", text: strings('messages'), icon: icons.faCommentDots },
    { to: "/timeline", text: strings('healthTimeline'), icon: icons.faCheckCircle },
    { to: "/schedule", text: strings('schedule'), icon: icons.faCalendar },
    { to: "/activity", text: strings('activity'), icon: icons.faClock },
    { to: "/settings", text: strings('settings'), icon: icons.faCog },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <AppGutterNav entries={gutterRoutes}/>

      <GutterAwareFluidContainer>
        <Switch>
          <Route path="/" exact component={DoctorDashboard} />
          <Route path="/patients/:patientId" component={PatientPage} />
          <Route path="/profile" component={DoctorProfilePage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const PatientBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
          <NavLink to="/intake" text={strings('intakeSurvey')} />
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path="/" exact component={PatientDashboard} />
        <Route path="/intake" exact component={PatientIntakePage} />
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
    userType: userType
  }
})(Base)

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <BaseWithProps/>
  </Provider>
)

export default App

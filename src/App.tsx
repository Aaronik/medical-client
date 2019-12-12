import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { StylesManager } from 'survey-react'
import * as icons from '@fortawesome/free-solid-svg-icons'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import PageNotFound from 'pages/not-found/NotFound'
import NotSignedInPage from 'pages/not-signed-in/NotSignedIn'
import DoctorDashboard from 'pages/doctor-dashboard/DoctorDashboard'
import DoctorTimelinePage from 'pages/doctor-timeline/DoctorTimeline'
import AdminDashboard from 'pages/admin-dashboard/AdminDashboard'
import ProfileDropdown from 'applets/profile-dropdown/ProfileDropdown'
import SigninPage from 'pages/signin/SignIn'
import SignupPage from 'pages/signup/SignUp'
import DoctorProfilePage from 'pages/doctor-profile/DoctorProfile'
import DoctorSettingsPage from 'pages/doctor-settings/DoctorSettings'
import PatientDashboard from 'pages/patient-dashboard/PatientDashboard'
import PatientIntakePage from 'pages/patient-intake/PatientIntake'
import DoctorActivityPage from 'pages/doctor-activity/DoctorActivity'
import DoctorMessagesPage from 'pages/doctor-messages/DoctorMessages'
import DoctorSchedulePage from 'pages/doctor-schedule/DoctorSchedule'
import DoctorOverviewPage from 'pages/doctor-overview/DoctorOverview'

import Alert from 'applets/alert/Alert'
import AppGutterNav, { LinkEntryProps, GutterAwareFluidContainer, GutterNavToggleButton } from 'applets/app-gutter-nav/AppGutterNav'
import { loadHostMap } from 'concerns/auth/Auth.actions'
import store, { TStoreState } from 'common/store'
import currentUser from 'common/util/currentUser'
import { TUserType as TStoreUserType } from 'concerns/user/User.d'
import strings from './App.strings'
import 'App.sass'

// Things to do once when the page loads
loadHostMap()
StylesManager.applyTheme('bootstrap')

const AppNavBar: React.FC = ({ children }) => <Navbar sticky='top' className='justify-content-between app-navbar'>{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to='/'><Image width={70} height={25} src='/milli-logo.png'/></Link></Navbar.Brand>
const NavLink = ({ to, text }: { to: string, text: string }) => <Nav.Link as={Link} to={to}>{text}</Nav.Link>

const SignedOutBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <NavLink to='/signin' text={strings('signIn')} />
          <NavLink to='/signup' text={strings('signUp')} />
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path='/' exact component={NotSignedInPage} />
        <Route path='/signin' component={SigninPage} />
        <Route path='/signup' component={SignupPage} />
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
          <NavLink to='/doctors' text={strings('doctors')} />
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path='/' exact component={AdminDashboard} />
        <Route path='/doctors' component={() => <h1>Admin/Doctors</h1>} />
        <Route path='/profile' component={() => <h1>Admin Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

const DoctorWithPatientBase: React.FunctionComponent<{}> = () => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faSquare, exact: true },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
    { separator: true },
    { to: '/overview', text: strings('overview'), icon: icons.faTachometerAlt },
    { to: '/messages', text: strings('messages'), icon: icons.faCommentDots },
    { to: '/timeline', text: strings('healthTimeline'), icon: icons.faCheckCircle },
    { to: '/schedule', text: strings('schedule'), icon: icons.faCalendar },
    { to: '/activity', text: strings('activity'), icon: icons.faClock },
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
          <Route path='/' exact component={DoctorDashboard} />
          <Route path='/settings' component={DoctorSettingsPage} />
          <Route path='/profile' component={DoctorProfilePage} />

          <Route path='/timeline' component={DoctorTimelinePage} />
          <Route path='/activity' component={DoctorActivityPage} />
          <Route path='/messages' component={DoctorMessagesPage} />
          <Route path='/overview' component={DoctorOverviewPage} />
          <Route path='/schedule' component={DoctorSchedulePage} />
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const DoctorNoPatientBase: React.FunctionComponent<{}> = () => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faSquare, exact: true },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
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
          <Route path='/' exact component={DoctorDashboard} />
          <Route path='/settings' component={DoctorSettingsPage} />
          <Route path='/profile' component={DoctorProfilePage} />
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
          <NavLink to='/intake' text={strings('intakeSurvey')} />
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path='/' exact component={PatientDashboard} />
        <Route path='/intake' exact component={PatientIntakePage} />
        <Route path='/profile' component={() => <h1>Patient Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

type TUserType = TStoreUserType | 'SIGNED_OUT'

const Base: React.FunctionComponent<{ userType: TUserType, activePatientId: string | false }> = ({ userType, activePatientId }) => {

  let Component = <SignedOutBase />

  switch (userType) {
    case 'ADMIN':
      Component = <AdminBase />
      break
    case 'DOCTOR':
      Component = !!activePatientId ? <DoctorWithPatientBase /> : <DoctorNoPatientBase />
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

const BaseWithProps = connect((storeState: TStoreState) => {
  const userType: TUserType = currentUser() ? currentUser().type : 'SIGNED_OUT'

  return {
    userType: userType,
    activePatientId: storeState.user.activePatientId
  }
})(Base)

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <BaseWithProps/>
  </Provider>
)

export default App

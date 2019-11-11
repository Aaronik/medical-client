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
import AppGutterNav, { LinkEntryProps, GutterAwareFluidContainer, GutterNavToggleButton } from 'app-gutter-nav/components'
import PageNotFound from 'not-found/components'
import NotSignedInContainer from 'common/components/NotSignedIn'
import { loadHostMap } from 'auth/actions'
import store, { currentUser } from 'store'
import { TUserType as TStoreUserType } from 'user/types.d'
import strings from 'common/strings'
import 'App.sass'

// Things to do once when the page loads
loadHostMap()
StylesManager.applyTheme('bootstrap')

const AppNavBar: React.FC = ({ children }) => <Navbar className="justify-content-between app-navbar">{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to="/"><Image width={70} height={25} src="milli-logo.png"/></Link></Navbar.Brand>
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
          <NavLink to="/doctors" text={strings('doctors')} />
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
          <AuthDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <AppGutterNav entries={gutterRoutes}/>

      <GutterAwareFluidContainer>
        <Switch>
          <Route path="/" exact component={DoctorDashboard} />
          <Route path="/patients/:patientId" component={PatientContainer} />
          <Route path="/profile" component={DoctorProfileContainer} />
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
    userType: userType
  }
})(Base)

const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <BaseWithProps/>
  </Provider>
)

export default App

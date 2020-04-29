import React from 'react'
import { gql } from '@apollo/client'
import { ApolloProvider, useQuery } from '@apollo/client'
import { BrowserRouter as Router, Route as RRRoute, RouteProps, RouteComponentProps, Link, Switch, useHistory } from 'react-router-dom'
import { StylesManager } from 'survey-react'
import * as icons from '@fortawesome/free-solid-svg-icons'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import PageNotFound from 'pages/NotFound'
import NotSignedInPage from 'pages/NotSignedIn'
import DoctorDashboard from 'pages/DoctorDashboard'
import DoctorTimelinePage from 'pages/DoctorTimeline'
import AdminDashboard from 'pages/AdminDashboard'
import EditQuestionnairesPage from 'pages/EditQuestionnaires'
import AdminUsersPage from 'pages/AdminUsers'
import AdminProfile from 'pages/AdminProfile'
import ProfileDropdown from 'components/ProfileDropdown'
import SigninPage from 'pages/SignIn'
import SignupPage from 'pages/SignUp'
import DoctorProfilePage from 'pages/DoctorProfile'
import DoctorSettingsPage from 'pages/DoctorSettings'
import PatientDashboard from 'pages/PatientDashboard'
import PatientIntakePage from 'pages/PatientIntake'
import PatientQuestionnairesPage from 'pages/PatientQuestionnaires'
import PatientProfile from 'pages/PatientProfile'
import DoctorActivityPage from 'pages/DoctorActivity'
import DoctorMessagesPage from 'pages/DoctorMessages'
import DoctorAssignmentsPage from 'pages/DoctorAssignments'
import DoctorOverviewPage from 'pages/DoctorOverview'
import LoadingPage from 'pages/Loading'

import Alert from 'components/Alert'
import Fade from 'components/Fade'
import AppGutterNav, { LinkEntryProps, GutterAwareFluidContainer, GutterNavToggleButton } from 'components/AppGutterNav'
import { TUser } from 'types/User.d'
import { TAlert } from 'types/Alert.d'
import strings from './App.strings'
import gqlClient from 'util/gql-client'
import { ME_QUERY, GET_ALL_QUESTIONNAIRES, GET_QUESTIONNAIRES_I_MADE } from 'util/queries'
import 'App.sass'

// Things to do once when the page loads
StylesManager.applyTheme('bootstrap')

const AppNavBar: React.FC = ({ children }) => <Navbar sticky='top' className='justify-content-between app-navbar'>{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to='/'><Image width={70} height={25} src='/milli-logo.png'/></Link></Navbar.Brand>
const NavLink = ({ to, text }: { to: string, text: string }) => <Nav.Link as={Link} to={to}>{text}</Nav.Link>

// This is so every Route gets a fade in when mounted.
// Signin/out has background, which also fades and is super hard on the eyes.
// So an option is here to not fade.
// Note that if you have to take this option, you can still use <Fade> inside
// the actual component you're working on.
// Also note that this component can take a component= or a children prop as
// what it should render, the same as React Router's <Route/> component.
const Route: React.FC<RouteProps & { noFade?: boolean }> = ({ noFade, children, component, ...props }) => {
  const Component = component as React.ComponentType<RouteProps>

  const FadedComponent = (innerProps: RouteComponentProps) => (
    <Fade><Component {...innerProps}/></Fade>
  )

  switch (true) {
    case !!component && noFade:
      return <RRRoute component={Component} {...props}/>
    case !!component && !noFade:
      return <RRRoute component={FadedComponent} {...props}/>
    case !component && noFade:
      return <RRRoute {...props}>{children}</RRRoute>
    case !component && !noFade:
      return <RRRoute {...props}><Fade>{children}</Fade></RRRoute>
    // default logically will never trigger but is in there to keep TS happy
    default:
      return <RRRoute {...props}><Fade>{children}</Fade></RRRoute>
  }
}

type BaseProps = {
  user: TUser
  gutterNavActive: boolean
  alerts: TAlert[]
}

const SignedOutBase: React.FunctionComponent<{ alerts: TAlert[] }> = ({ alerts }) => {
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

      <Alert alerts={alerts}/>

      <Switch>
        <Route path='/' exact><NotSignedInPage/></Route>
        <Route path='/signin' noFade><SigninPage/></Route>
        <Route path='/signup' noFade><SignupPage/></Route>
        <Route><PageNotFound/></Route>
      </Switch>
    </React.Fragment>
  )
}

const AdminBase: React.FunctionComponent<BaseProps> = ({ user, gutterNavActive, alerts }) => {

  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faBorderAll, exact: true },
    { to: '/users', text: strings('users'), icon: icons.faUsers, exact: true },
    { to: '/questionnaires', text: strings('questionnaires'), icon: icons.faCheckSquare, exact: true },
    { to: '/profile', text: strings('profile'), icon: icons.faUserEdit },
    { to: '/settings', text: strings('settings'), icon: icons.faCog, exact: true },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <ProfileDropdown user={user}/>
        </Nav>
      </AppNavBar>

      <Alert alerts={alerts}/>

      <AppGutterNav role={user.role} entries={gutterRoutes} gutterNavActive={gutterNavActive}/>

      <GutterAwareFluidContainer gutterNavActive={gutterNavActive}>
        <Switch>
          <Route path='/' exact><AdminDashboard doctors={[]} user={user} invitationLoading={false}/></Route>
          <Route path='/users' component={AdminUsersPage} />
          <Route path='/profile'><AdminProfile user={user}/></Route>
          <Route path='/questionnaires'><EditQuestionnairesPage questionnairesQuery={GET_ALL_QUESTIONNAIRES}/></Route>
          <Route path='/settings'><DoctorSettingsPage/></Route>
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const PATIENT_QUERY = gql`
  query {
    updates @client
  }
`

const DoctorWithPatientBase: React.FunctionComponent<BaseProps & { patients: TUser[], patient: TUser}> = ({ user, patients, patient, gutterNavActive, alerts }) => {

  const { data, loading } = useQuery(PATIENT_QUERY)

  if (loading) return <LoadingPage />

  const timeline = data.timeline

  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faBorderAll, exact: true },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
    { to: '/profile', text: strings('profile'), icon: icons.faUserEdit },
    { to: '/questionnaires', text: strings('questionnaires'), icon: icons.faCheckCircle },
    { separator: true },
    { to: '/overview', text: strings('overview'), icon: icons.faTachometerAlt, fade: true },
    { to: '/messages', text: strings('messages'), icon: icons.faCommentDots, fade: true },
    { to: '/timeline', text: strings('healthTimeline'), icon: icons.faCalendar, fade: true },
    { to: '/assignments', text: strings('assignments'), icon: icons.faCheckSquare, fade: true },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <ProfileDropdown user={user}/>
        </Nav>
      </AppNavBar>

      <Alert alerts={alerts}/>

      <AppGutterNav role={user.role} entries={gutterRoutes} patients={patients} activePatient={patient} gutterNavActive={gutterNavActive}/>

      <GutterAwareFluidContainer gutterNavActive={gutterNavActive}>
        <Switch>
          <Route path='/' exact><DoctorDashboard user={user} patients={patients} notifications={[]}/></Route>
          <Route path='/settings'><DoctorSettingsPage/></Route>
          <Route path='/profile' ><DoctorProfilePage user={user}/></Route>
          <Route path='/timeline'>
            <DoctorTimelinePage patient={patient}/>
          </Route>
          <Route path='/activity'><DoctorActivityPage/></Route>
          <Route path='/messages'><DoctorMessagesPage/></Route>
          <Route path='/overview'><DoctorOverviewPage patient={patient} user={user} messages={[]} updates={data.updates}/></Route>
          <Route path='/assignments'><DoctorAssignmentsPage patient={patient}/></Route>
          <Route path='/questionnaires'><EditQuestionnairesPage questionnairesQuery={GET_QUESTIONNAIRES_I_MADE}/></Route>
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const DoctorNoPatientBase: React.FunctionComponent<BaseProps & { patients: TUser[] }> = ({ user, patients, gutterNavActive, alerts }) => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faBorderAll, exact: true },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
    { to: '/profile', text: strings('profile'), icon: icons.faUserEdit },
    { to: '/questionnaires', text: strings('questionnaires'), icon: icons.faCheckCircle },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <ProfileDropdown user={user}/>
        </Nav>
      </AppNavBar>

      <Alert alerts={alerts}/>

      <AppGutterNav role={user.role} entries={gutterRoutes} patients={patients} gutterNavActive={gutterNavActive}/>

      <GutterAwareFluidContainer gutterNavActive={gutterNavActive}>
        <Switch>
          <Route path='/' exact><DoctorDashboard user={user} patients={patients} notifications={[]}/></Route>
          <Route path='/settings'><DoctorSettingsPage/></Route>
          <Route path='/profile'><DoctorProfilePage user={user}/></Route>
          <Route path='/questionnaires'><EditQuestionnairesPage questionnairesQuery={GET_QUESTIONNAIRES_I_MADE}/></Route>
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const PatientBase: React.FunctionComponent<BaseProps> = ({ user, alerts, gutterNavActive }) => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faBorderAll, exact: true },
    { to: '/questionnaires', text: strings('questionnaires'), icon: icons.faCheckSquare },
    { to: '/profile', text: strings('profile'), icon: icons.faUserEdit },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
  ]

  const switchRoutes = (
    <Switch>
      <Route path='/' exact><PatientDashboard/></Route>
      <Route path='/intake'><PatientIntakePage/></Route>
      <Route path='/questionnaires'><PatientQuestionnairesPage/></Route>
      <Route path='/settings'><DoctorSettingsPage/></Route>
      <Route path='/profile'><PatientProfile user={user}/></Route>
      <Route component={PageNotFound} />
    </Switch>
  )

  const history = useHistory()

  // So appending /frame to the end will isolate just the page
  // (originally added so we can drop millimed into an iframe and not
  // have the clutter of the navbars)
  if (history.location.pathname.includes('/frame')) {
    return switchRoutes
  }

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
          <NavLink to='/intake' text={strings('intakeSurvey')} />
        </Nav>
        <Nav>
          <ProfileDropdown user={user}/>
        </Nav>
      </AppNavBar>

      <AppGutterNav role={user.role} entries={gutterRoutes} gutterNavActive={gutterNavActive}/>

      <Alert alerts={alerts}/>

      <GutterAwareFluidContainer gutterNavActive={gutterNavActive}>
        { switchRoutes }
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const LOCAL_FLAGS_QUERY = gql`
  query {
    hasAuthToken @client
    activePatientId @client
    gutterNavActive @client
    alerts @client
  }
`

const Base: React.FunctionComponent = () => {

  const { data, loading } = useQuery(ME_QUERY, {
    onError: (e) => {
      // We're expecting a single 401 and don't want to pollute the logs when it comes in.
      if (e.graphQLErrors.length > 1) console.error(e)
    },
    /* fetchPolicy: 'no-cache', // Using this means selecting MAKE ME A * doesn't work */
    errorPolicy: 'all',
    partialRefetch: true,
    // returnPartialData: true, // can't do this b/c then client.refetchobservablequeries results in loading when local flags are toggled
    /* notifyOnNetworkStatusChange: true */
  })

  const { data: flags } = useQuery(LOCAL_FLAGS_QUERY, { fetchPolicy: 'no-cache' })

  if (loading) return <LoadingPage/>

  const alerts = flags?.alerts || []
  const activePatientId = flags?.activePatientId
  const gutterNavActive = flags?.gutterNavActive
  const me = data?.me
  const patients = me?.patients || []
  const patient = patients.find((p: TUser) => p.id === Number(activePatientId))

  let Component = <SignedOutBase alerts={alerts}/>

  if (!flags?.hasAuthToken) return <Router>{Component}</Router>

  switch (me?.role) {
    case 'ADMIN':
      Component = <AdminBase user={me} gutterNavActive={gutterNavActive} alerts={alerts}/>
      break
    case 'DOCTOR':
      Component = !!patient
        ?  <DoctorWithPatientBase user={me} patients={patients} patient={patient} gutterNavActive={gutterNavActive} alerts={alerts}/>
        : <DoctorNoPatientBase patients={patients} user={me} gutterNavActive={gutterNavActive} alerts={alerts}/>
      break
    case 'PATIENT':
      Component = <PatientBase user={me} gutterNavActive={gutterNavActive} alerts={alerts}/>
      break
  }

  return <Router>{Component}</Router>
}

const App: React.FunctionComponent = () => {
  return (
    <ApolloProvider client={gqlClient}>
      <Base/>
    </ApolloProvider>
  )
}

export default App

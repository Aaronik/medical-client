// This file is to store all strings in the app.
// It represents one step towards i18n.
// Any string you see rendered to the screen should come from in here.

const map = {
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  doctors: 'Doctors',
  message: "Message",
  messages: 'Messages',
  healthTimeline: 'Health Timeline',
  schedule: 'Schedule',
  activity: 'Activity',
  settings: 'Settings',
  dashboard: 'Dashboard',
  intakeSurvey: 'Intake Survey',
  profile: 'Profile',
  update: 'Update',
  close: 'Close',
  save: 'Save',
  about: 'About',
  version: 'Version',

  emailPlaceholder: "name@example.com",
  streetPlaceholder: "1234 Main St",
  apartmentPlaceholder: "Apartment, studio or floor",
  cityPlaceholder: "New City'sbergsville",
  statePlaceholder: "CA",
  zipPlaceholder: "12345",

  searchFilterPlaceholder: "Filter Events",
  groupFilterLabel: "Show",

  fullName: 'Full Name',
  businessUrl: 'Business Url',
  email: 'Email',
  password: 'Password',
  address: 'Address',
  address2: 'Address 2',
  city: 'City',
  state: 'State',
  zip: 'Zip',

  enterEmail: "Enter email",
  createAccount: "Create Account",
  addPatientEvent: 'Add Patient Event',
  eventDesc: 'Event Description',
  formStartDate: '(Start) Date (yyyy-mm-dd)',
  formEndDate: 'End date (yyyy-mm-dd):',

  startDate: 'start/date: ',
  end: 'end: ',

  invitationDefaultMessage: "I'd like to invite you to join Milli!",
  welcomeBack: (name: string) => `Welcome back, ${name}`,
  welcomeBackDoctor: "Welcome back, Doctor.",
  addNewPatient: "Add New Patient",
  yourPatients: "Your Patients:",
  inviteDoc: "Invite A Doctor to Milli:",
  emailAddress: "Email Address",
  sendInvite: "Send the invite!",
  welcomeToMilli: "Welcome to Milli.",
  signInToGetStarted: "Sign in to get started.",
  yourPatient: (name: string) => `Timeline: ${name}`,
  doctorProfile: (name: string) => `Doctor Profile: ${name}`,
  notFound: 'Page not found!',
  patientDashboard: 'Patient Dashboard',
  milliBlurb: "self-teaching personalized medical intelligence platform built from real-time analysis of millions of patient/doctor interactions.",
  patientNotFound: 'Patient Not Found',
}

type TMap = typeof map

const strings = (key: keyof TMap, ...args: any[]): string => {
  if (args.length) return (map[key] as Function).apply(null, args)
  else return map[key] as string
}

export default strings

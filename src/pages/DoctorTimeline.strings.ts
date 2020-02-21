import strings from 'util/strings'

const map = {
  searchFilterPlaceholder: "Filter Events",
  groupFilterLabel: "Show",
  addPatientEvent: 'Add Patient Event',
  updatePatientEvent: 'Update Patient Event',
  eventDesc: 'Event Description',
  formStartDate: '(Start) Date (yyyy-mm-dd)',
  formEndDate: 'End date (yyyy-mm-dd):',
  close: 'Close',
  save: 'Save',
  yourPatient: (name: string) => `${name}`,
  category: 'Category',
}

export default strings(map)

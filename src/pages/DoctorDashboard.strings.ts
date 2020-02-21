import strings from 'util/strings'

const map = {
  welcomeBackDoctor: (name: string, number: number) => `Hi Doctor ${name}! You have ${number} new notifications...`,
  addNewPatient: 'Add New Patient',
  patientList: 'Patient List',
  joined: 'JOINED',
  lastVisit: 'LAST VISIT',
  adherence: 'ADHERENCE',
  na: 'N/A',
  avgHealthScore: 'Average Health Score',
  dystfunctionsIdentified: 'Dysfunctions Identified',
  interventionRecommendations: 'Intervention Recommendations'
}

export default strings(map)

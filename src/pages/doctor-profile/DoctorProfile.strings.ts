import strings from 'common/util/strings'

const map = {
  update: 'Update',
  streetPlaceholder: "1234 Main St",
  apartmentPlaceholder: "Apartment, studio or floor",
  cityPlaceholder: "New City'sbergsville",
  statePlaceholder: "CA",
  zipPlaceholder: "12345",
  doctorProfile: (name: string) => `Doctor Profile: ${name}`,
  fullName: 'Full Name',
  businessUrl: 'Business Url',
  email: 'Email',
  password: 'Password',
  address: 'Address',
  address2: 'Address 2',
  city: 'City',
  state: 'State',
  zip: 'Zip',
}

export default strings(map)

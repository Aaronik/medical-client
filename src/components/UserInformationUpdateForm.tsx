import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import FormInput from 'components/FormInput'

import { TUser } from 'types/User.d'
import strings from './UserInformationUpdateForm.strings'
import { useMutation } from '@apollo/client'
import { UPDATE_ME } from 'util/queries'
import { Spinner } from 'react-bootstrap'
import { faUser, faAt, faImage, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import DatePickerModal from 'components/DatePickerModal'
import onKeyDown from 'util/onKeyDown'

const UserInformationUpdateForm: React.FC<{ user: TUser }> = ({ user }) => {
  const [ name, setName ] = useState(user.name)
  const [ email, setEmail ] = useState(user.email)
  const [ birthday, setBirthday ] = useState(user.birthday ? fromMysqlDateString(user.birthday) : '')
  const [ imageUrl, setImageUrl ] = useState(user.imageUrl || '')

  const [ isBirthdayModalOpen, setIsBirthdayModalOpen ] = useState(false)

  const [ saveUserInfo, { loading, error }] = useMutation(UPDATE_ME, { onError: console.error })

  const onSaveClick = () => {
    saveUserInfo({ variables: { user: {
      name, email, imageUrl,
      birthday: birthday ? toMysqlDateString(birthday) : undefined
    }}})
  }

  const buttonVariant = loading
    ? 'secondary'
    : error
      ? 'danger'
      : 'primary'

  return (
    <Form className="pt-5" onKeyDown={onKeyDown('Enter', onSaveClick)}>
      <Form.Row>
        <FormInput
          label={strings('name')}
          type="text"
          placeholder={strings('fullName')}
          onChange={setName}
          value={name}
          icon={faUser}/>
        <FormInput
          label={strings('email')}
          type="email"
          placeholder={strings('email')}
          onChange={setEmail}
          value={email}
          icon={faAt}/>
      </Form.Row>

      <Form.Row>
        <FormInput
          label={strings('imageUrl')}
          type="text"
          placeholder={strings('imageUrlPlaceholder')}
          onChange={setImageUrl}
          value={imageUrl}
          icon={faImage}/>
      </Form.Row>

      <Form.Row>
        <FormInput
          label={strings('birthday')}
          type="text"
          placeholder={strings('birthdayPlaceholder')}
          onChange={setBirthday}
          value={birthday}
          icon={faCalendarAlt}
          onIconClick={() => setIsBirthdayModalOpen(true)}/>
      </Form.Row>

      <Row>
        <Button variant={buttonVariant} onClick={onSaveClick}>
          { loading ? <Spinner animation='grow'/> : strings('update')}
        </Button>
        <p className='text-danger'>{error?.message}</p>
      </Row>

      <DatePickerModal
        show={isBirthdayModalOpen}
        onClose={() => setIsBirthdayModalOpen(false)}
        onSelect={(birthday: Date) => setBirthday(birthday.toDateString())}
      />
    </Form>
  )
}

export default UserInformationUpdateForm

const fromMysqlDateString = (dateString: string) => (new Date(Number(dateString))).toDateString()
const toMysqlDateString = (dateString: string) => (new Date(dateString).toISOString().slice(0, 19).replace('T', ' '))


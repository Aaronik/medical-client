import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import ErrorPage from 'pages/Error'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Questionnaire from 'components/Questionnaire'
import { GET_QUESTIONNAIRES_I_MADE, GET_PATIENT_QUESTIONNAIRE_RESPONSES } from 'util/queries'
import { TUser } from 'types/User'
import { QuestionnaireAssignment } from 'types/QuestionnaireAssignment'
import { TQuestionnaire } from 'types/Questionnaire'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import withoutPropagation from 'util/withoutPropagation'
import { getQuestionnaireCompletionStatusIcon } from 'util/getQuestionnaireCompletionStatus'

type TProps = {
  patient: TUser
}

const DoctorAssignmentsPage: React.FC<TProps> = ({ patient }) => {

  const { data: assData, loading: assLoading, error: assError }
    = useQuery<{ questionnaireAssignmentsIMade: QuestionnaireAssignment[]}>(QUESTIONNAIRE_ASSIGNMENTS_I_MADE)

  const { data: qiData, loading: qiLoading, error: qiError }
    = useQuery<{ questionnairesIMade: TQuestionnaire[] }>(GET_QUESTIONNAIRES_I_MADE)

  const { data: qpData, loading: qpLoading, error: qpError }
    = useQuery<{ patientQuestionnaireResponses: TQuestionnaire[] }>(GET_PATIENT_QUESTIONNAIRE_RESPONSES, { variables: { patientId: patient.id }})

  const [ assignQuestionnaire, { loading: createAssignmentLoading, error: createError }] = useMutation(CREATE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [
      { query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE },
      { query: GET_PATIENT_QUESTIONNAIRE_RESPONSES, variables: { patientId: patient.id }},
    ]
  })

  const [ updateAssignment, { loading: updateAssignmentLoading, error: updateError }] = useMutation(UPDATE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [
      { query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE },
    ]
  })

  const [ deleteAssignment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [
      { query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE },
      { query: GET_PATIENT_QUESTIONNAIRE_RESPONSES, variables: { patientId: patient.id }},
    ]
  })

  if (assError) return <ErrorPage error={assError}/>
  if (qiError) return <ErrorPage error={qiError}/>
  if (qpError) return <ErrorPage error={qpError}/>
  if (createError) return <ErrorPage error={createError}/>
  if (deleteError) return <ErrorPage error={deleteError}/>
  if (updateError) return <ErrorPage error={updateError}/>

  const assignments = assData?.questionnaireAssignmentsIMade?.filter(a => a.assignee?.id === patient.id) || []
  const questionnairesIMade = qiData?.questionnairesIMade || []
  const questionnaireResponses = qpData?.patientQuestionnaireResponses

  const toggleAssignment = (questionnaire: TQuestionnaire, repeatInterval?: number) => {
    const currentAssignmentId = assignments.find(assignment => assignment.questionnaireId === questionnaire.id)?.id

    if (currentAssignmentId) { // if the questionnaire is already assigned
      deleteAssignment({ variables: { id: currentAssignmentId }})
    } else {
      assignQuestionnaire({ variables: { assignment: {
        questionnaireId: questionnaire.id,
        assigneeId: patient.id,
        repeatInterval
      }}})
    }
  }

  const onRepeatChange = (assignment: QuestionnaireAssignment | undefined, repeatInterval: number) => {
    // We only need to take action here if there's already an assignment and the user is changing the repeatInterval of it.
    // Otherwise, if there's no assignment, the repeatInterval will be saved at the time of assignment creation.
    if (!assignment) return

    const update = {
      id: assignment.id,
      repeatInterval
    }

    updateAssignment({ variables: { assignment: update }})
  }

  const responses = questionnaireResponses?.map(response => {

    const completionIcon = getQuestionnaireCompletionStatusIcon(response)

    return (
      <Row className='d-flex flex-row justify-content-between align-items-center' key={`${response.id}-${response.assignmentInstanceId}`}>
        <Questionnaire
          questionnaire={response}
          isAnswerable={false}
          className='flex-grow-1 mr-4'
        />
        {completionIcon}
      </Row>
    )
  })

  return (
    <Container className='mt-5'>
      <h3 className='mb-4'>
        Questionnaires
        {(assLoading || qiLoading || qpLoading || deleteLoading || createAssignmentLoading || updateAssignmentLoading) && <Spinner animation='grow'/>}
      </h3>

      <div>
        <ListGroup>
          {
            questionnairesIMade.map(questionnaire => {
              const assignment = assignments.find(assignment => assignment.questionnaireId === questionnaire.id)

              return (
                <ChoosableQuestionnairesListGroupItem
                  key={questionnaire.id}
                  questionnaire={questionnaire}
                  assignment={assignment}
                  onClick={toggleAssignment}
                  onRepeatChange={repeatInterval => onRepeatChange(assignment, repeatInterval)}
                />
              )
            })
          }
        </ListGroup>
      </div>

      <h3 className='my-4'>Responses</h3>
      {responses}

    </Container>
  )
}

type ChoosableQuestionnairesListGroupItemProps = {
  questionnaire: TQuestionnaire
  assignment?: QuestionnaireAssignment
  onClick: (questionnaire: TQuestionnaire, repeatInterval?: number) => void
  onRepeatChange: (repeatInterval: number) => void
}

const ChoosableQuestionnairesListGroupItem: React.FC<ChoosableQuestionnairesListGroupItemProps> = ({ questionnaire, assignment, onClick, onRepeatChange }) => {

  const [ repeatInterval, setRepeatInterval ] = useState(assignment?.repeatInterval)

  const repeatDropdownOptions = [
    // There are 1440 minutes in a day. We do a minute as the most granular time to repeat.
    { label: 'Don\'t repeat', value: 0 },
    { label: 'Repeat every day', value: 1 * 1440 },
    { label: 'Repeat every 2 days', value: 2 * 1440 },
    { label: 'Repeat every week', value: 7 * 1440 },
    { label: 'Repeat every 2 weeks', value: 14 * 1440 },
    { label: 'Repeat every month', value: 30 * 1440 },
    { label: 'Repeat every 6 months', value: 6 * 30 * 1440 },
    { label: 'Repeat every year', value: 365 * 1440 },
  ]

  const defaultOption = repeatDropdownOptions.find(op => op.value === assignment?.repeatInterval) || repeatDropdownOptions[0]
  const isAssigned = !!assignment
  const variant = isAssigned ? 'success' : 'secondary'

  const onRepeatIntervalSelectChange = (ri: number) => {
    setRepeatInterval(ri)
    onRepeatChange(ri)
  }

  return (
    <ListGroup.Item key={questionnaire.id} variant={variant} action onClick={() => onClick(questionnaire, repeatInterval)}>
      <Row className='d-flex align-items-center justify-content-between'>
        <span className='' >{questionnaire.title}</span>
        <div className='width-20' onClick={withoutPropagation(() => {})}>
          <Select
            options={repeatDropdownOptions}
            defaultValue={defaultOption}
            onChange={onSelectChange(onRepeatIntervalSelectChange)}
            className='width-100'
          />
        </div>
      </Row>
    </ListGroup.Item>
  )
}

export default DoctorAssignmentsPage

const QUESTIONNAIRE_ASSIGNMENTS_I_MADE = gql`
  query {
    questionnaireAssignmentsIMade {
      id
      repeatInterval
      questionnaireId
      assigneeId
      assignee {
        id
        name
      }
      questionnaire {
        id
        title
      }
    }
  }
`

const CREATE_QUESTIONNAIRE_ASSIGNMENT = gql`
  mutation CreateQuestionnaireAssignment($assignment: QuestionnaireAssignmentInput!) {
    createQuestionnaireAssignment(assignment: $assignment) {
      id
    }
  }
`

const UPDATE_QUESTIONNAIRE_ASSIGNMENT = gql`
  mutation UpdateQuestionnaireAssignment($assignment: QuestionnaireAssignmentUpdateInput!) {
    updateQuestionnaireAssignment(assignment: $assignment) {
      id
    }
  }
`

const DELETE_QUESTIONNAIRE_ASSIGNMENT = gql`
  mutation DeleteQuestionnaireAssignment($id: Int!) {
    deleteQuestionnaireAssignment(id: $id)
  }
`


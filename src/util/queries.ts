import { gql } from '@apollo/client'

export const SIGNIN_MUTATION = gql`
  mutation Authenticate($email:String!, $password:String!) {
    authenticate(email:$email, password:$password)
  }
`

export const SIGNUP_MUTATION = gql`
  mutation SignUp($email:String!, $password:String!, $name:String) {
    createUser(email:$email, password:$password, role:DOCTOR, name:$name) {
      id
    }
  }
`

const COMPLETE_USER_FRAGMENT = gql`
  {
    id
    name
    email
    role
    joinDate
    birthday
    lastVisit
    imageUrl
  }
`

export const ME_QUERY = gql`
  query {
    me {
      id
      name
      email
      role
      joinDate
      birthday
      lastVisit
      imageUrl
      patients ${COMPLETE_USER_FRAGMENT}
      doctors ${COMPLETE_USER_FRAGMENT}
    }
  }
`

export const UPDATE_ME = gql`
  mutation UpdateMe($user: MeInput) {
    updateMe(user: $user) ${COMPLETE_USER_FRAGMENT}
  }
`

export const USERS = gql`
  query {
    users {
      id
      name
      email
      role
      joinDate
      lastVisit
      patients{
        id
        name
      }
      doctors{
        id
        name
      }
    }
  }
`

export const SET_ACTIVE_PATIENT = gql`
  mutation SetActivePatient($id:String){
    setActivePatient(id:$id) @client
  }
`

const CHOICE_QUESTIONS_SUBFRAGMENT = `
  id
  type
  text
  options {
   id
   text
  }
  next {
   includes
   equals
   nextQuestionId
  }
`

const NON_CHOICE_QUESTIONS_SUBFRAGMENT = `
  id
  type
  text
  next {
    includes
    equals
    nextQuestionId
  }
`

const QUESTIONS_FRAGMENT = gql`
  {
    ... on BooleanQuestion {
      boolResp: response
      ${NON_CHOICE_QUESTIONS_SUBFRAGMENT}
    }
    ... on TextQuestion {
      textResp: response
      ${NON_CHOICE_QUESTIONS_SUBFRAGMENT}
    }
    ... on SingleChoiceQuestion {
      singleChoiceResp: response {
        id
        text
      }
      ${CHOICE_QUESTIONS_SUBFRAGMENT}
    }
    ... on MultipleChoiceQuestion {
      multipleChoiceResp: response {
        id
        text
      }
      ${CHOICE_QUESTIONS_SUBFRAGMENT}
    }
  }
`

const QUESTIONNAIRE_FRAGMENT = gql`
  {
    id
    title
    questions ${QUESTIONS_FRAGMENT}
  }
`

export const GET_QUESTIONNAIRE = gql`
  query Questionnaire($id: Int!) {
    questionnaire(id: $id) ${QUESTIONNAIRE_FRAGMENT}
  }
`

export const GET_ALL_QUESTIONNAIRES = gql`
  query {
    allQuestionnaires ${QUESTIONNAIRE_FRAGMENT}
  }
`

export const GET_QUESTIONNAIRES_ASSIGNED_TO_ME = gql`
  query {
    questionnairesAssignedToMe ${QUESTIONNAIRE_FRAGMENT}
  }
`

export const GET_QUESTIONNAIRES_I_MADE = gql`
  query {
    questionnairesIMade ${QUESTIONNAIRE_FRAGMENT}
  }
`

export const CREATE_QUESTIONNAIRE = gql`
  mutation CreateQuestionnaire($title: String, $questions: [QuestionInput]){
    createQuestionnaire(title: $title, questions: $questions) {
      id
      title
      questions ${QUESTIONS_FRAGMENT}
    }
  }
`

export const UPDATE_QUESTIONNAIRE = gql`
  mutation UpdateQuestionnaire($id: Int!, $title: String, $questions: [QuestionInput]){
    updateQuestionnaire(id: $id, title: $title, questions: $questions) {
      id
      title
      questions ${QUESTIONS_FRAGMENT}
    }
  }
`

export const ADD_QUESTIONS = gql`
  mutation AddQuestions($questions: [QuestionInput]) {
    addQuestions(questions: $questions) ${QUESTIONS_FRAGMENT}
  }
`

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($question: QuestionInput!) {
    updateQuestion(question: $question) ${QUESTIONS_FRAGMENT}
  }
`

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: Int!) {
    deleteQuestion(id: $id)
  }
`

export const CREATE_QUESTION_RELATIONS = gql`
  mutation CreateQuestionRelations($relations: [QuestionRelationInput]) {
    createQuestionRelations(relations: $relations)
  }
`

export const SUBMIT_BOOLEAN_RESPONSE = gql`
  mutation SubmitBoolean($questionId: Int!, $value: Boolean!) {
    submitBooleanQuestionResponse(questionId: $questionId, value: $value)
  }
`

export const SUBMIT_TEXT_RESPONSE = gql`
  mutation SubmitText($questionId: Int!, $value: String!) {
    submitTextQuestionResponse(questionId: $questionId, value: $value)
  }
`

export const SUBMIT_CHOICE_RESPONSE = gql`
  mutation SubmitChoice($questionId: Int!, $optionId: Int!) {
    submitChoiceQuestionResponse(questionId: $questionId, optionId: $optionId)
  }
`

export const SUBMIT_CHOICE_RESPONSES = gql`
  mutation SubmitChoice($questionId: Int!, $optionIds: [Int]!) {
    submitChoiceQuestionResponses(questionId: $questionId, optionIds: $optionIds)
  }
`

export const DELETE_QUESTIONNAIRE = gql`
  mutation DeleteQuestionnaire($id: Int!) {
    deleteQuestionnaire(id: $id)
  }
`


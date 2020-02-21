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
      role
    }
  }
`

export const SET_ACTIVE_PATIENT = gql`
  mutation SetActivePatient($id:String){
    setActivePatient(id:$id) @client
  }
`

export const QUESTIONS_FRAGMENT = gql`
  {
    ... on BooleanQuestion {
      id
      type
      text
      boolResp: response
      next {
        includes
        equals
        nextQuestionId
      }
    }
    ... on TextQuestion {
      id
      type
      text
      textResp: response
      next {
        includes
        equals
        nextQuestionId
      }
    }
    ... on SingleChoiceQuestion {
      id
      type
      text
      singleChoiceResp: response
      options {
        value
        text
      }
      next {
        includes
        equals
        nextQuestionId
      }
    }
    ... on MultipleChoiceQuestion {
      id
      type
      text
      multipleChoiceResp: response
      options {
        value
        text
      }
      next {
        includes
        equals
        nextQuestionId
      }
    }
  }
`

export const GET_QUESTIONNAIRE = gql`
  query Questionnaire($id: Int!) {
    questionnaire(id: $id) {
      id
      title
      questions ${QUESTIONS_FRAGMENT}
    }
  }
`

export const GET_ALL_QUESTIONNAIRES = gql`
  query {
    questionnaires {
      id
      title
      questions ${QUESTIONS_FRAGMENT}
    }
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

export const ADD_QUESTIONS = gql`
  mutation AddQuestions($questions: [QuestionInput]) {
    addQuestions(questions: $questions) ${QUESTIONS_FRAGMENT}
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
  mutation SubmitChoice($questionId: Int!, $value: String!) {
    submitChoiceQuestionResponse(questionId: $questionId, value: $value)
  }
`

export const DELETE_QUESTIONNAIRE = gql`
  mutation DeleteQuestionnaire($id: Int!) {
    deleteQuestionnaire(id: $id)
  }
`


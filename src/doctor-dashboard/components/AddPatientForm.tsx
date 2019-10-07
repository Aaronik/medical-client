import React from 'react'
import { Survey } from 'survey-react'
import Container from 'react-bootstrap/Container'

const surveyJson = {
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "multipletext",
     "name": "name",
     "title": "Patient Name",
     "isRequired": true,
     "items": [
      {
       "name": "first",
       "isRequired": true,
       "title": "First"
      },
      {
       "name": "middle",
       "title": "Middle"
      },
      {
       "name": "last",
       "isRequired": true,
       "title": "Last"
      }
     ],
     "colCount": 3
    }
   ]
  }
 ],
 "showQuestionNumbers": "off",
 "questionErrorLocation": "bottom",
 "isSinglePage": true
}

export type TSurveyResult = {
  name: {
    first: string
    middle?: string
    last: string
  }
}

type TProps = {
  onComplete: (surveyJson: TSurveyResult) => void
}

export default class AddPatientForm extends React.Component<TProps, {}> {
  survey = React.createRef<Survey>()

  private onComplete = (resp: { data: TSurveyResult }) => {
    this.props.onComplete(resp.data)
    // TODO do whatever needs to be done here to make the survey
    // come back...
    // https://github.com/surveyjs/survey-library/issues/1855
  }

  render() {

    return (
      <Container>
        <Survey
          ref={this.survey}
          // showCompletedPage={false}
          json={surveyJson}
          onComplete={this.onComplete}
        />
      </Container>
    )
  }
}

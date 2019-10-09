import React from 'react'
import Survey from 'common/components/survey'
import Container from 'react-bootstrap/Container'

const surveyJson = {
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "matrixdynamic",
     "name": "events",
     "title": "Events",
     "description": "What events have happened to you that we can put on the timeline?",
     "isRequired": true,
     "columns": [
      {
       "name": "description",
       "title": "Brief Description",
       "cellType": "text",
       "isRequired": true
      },
      {
       "name": "date",
       "title": "Date (yyyy-mm-dd)",
       "cellType": "text",
       "isRequired": true
      }
     ],
     "choices": [
      1,
      2,
      3,
      4,
      5
     ],
     "cellType": "text",
     "rowCount": 1,
     "addRowText": "Add line item"
    }
   ]
  }
 ],
 "showQuestionNumbers": "off",
 "questionErrorLocation": "bottom",
 "isSinglePage": true
}


export type TSurveyResult = {
  events: { date: string, description: string }[]
}

type TProps = {
  onComplete: (surveyJson: TSurveyResult) => void
}

export default class AddPatientEventForm extends React.Component<TProps, {}> {
  render() {
    return (
      <Container>
        <Survey
          json={surveyJson}
          onComplete={this.props.onComplete}
        />
      </Container>
    )
  }
}

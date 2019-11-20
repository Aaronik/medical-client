import React from 'react'
import Container from 'react-bootstrap/Container'

import Survey from 'common/components/Survey'

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
  render() {

    return (
      <Container>
        <Survey<TSurveyResult>
          json={surveyJson}
          onComplete={this.props.onComplete}
        />
      </Container>
    )
  }
}

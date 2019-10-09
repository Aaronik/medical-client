import React from 'react'
import { Survey as SurveyReact } from 'survey-react'
import Container from 'react-bootstrap/Container'

type TProps<TSurveyResult> = {
  json: Object
  onComplete: (json: TSurveyResult) => void
}

export default class Survey<TSurveyResult> extends React.Component<TProps<TSurveyResult>, {}> {
  private survey = React.createRef<SurveyReact>()

  private onComplete = (resp: { data: TSurveyResult }) => {
    const surveyJson = resp.data

    // Property 'survey' is protected and only accessible
    // within class 'Survey' and its subclasses.
    // However, this is how you access survey, as per
    // https://github.com/surveyjs/survey-library/issues/1855.
    // @ts-ignore
    this.survey.current.survey.clear()
    // @ts-ignore
    this.survey.current.survey.render()

    this.props.onComplete(surveyJson)
  }

  render() {
    return (
      <Container>
        <SurveyReact
          ref={this.survey}
          showCompletedPage={false}
          json={this.props.json}
          onComplete={this.onComplete}
        />
      </Container>
    )
  }
}

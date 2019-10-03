import React from 'react'
import { connect } from 'react-redux'
import { Survey, StylesManager } from 'survey-react'
import Container from 'react-bootstrap/Container'

import { TStoreState } from 'store'
import * as actions from 'survey/actions'
import surveyJson from 'survey/PII/survey-example'
import * as T from 'survey/types.d'

type TProps = {

}

// Note: I struggled to find documentation for the react side of Survey,
// so here's a link to what I did find that helped:
// https://github.com/surveyjs/surveyjs_react_quickstart

// TODO in development, getting some errors from the survey component.
// Consider throwing an error boundary around it.
class SurveyContainer extends React.Component<TProps, {}> {

  componentWillMount() {
    StylesManager.applyTheme('bootstrap')
  }

  private onSurveyComplete = (resp: { data: T.TSurveyResult }) => {
    actions.saveSurvey(resp.data)
  }

  render() {
    return (
      <Container>
        <Survey json={surveyJson} onComplete={this.onSurveyComplete}></Survey>
      </Container>
    )
  }
}


export default connect((storeState: TStoreState): TProps => {
  return {}
})(SurveyContainer)

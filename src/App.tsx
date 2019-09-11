import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import * as Survey from "survey-react"
import './App.scss'

class App extends Component {

	// PsudoCode to get a patient's FullName.
	// Create a Survey
	// Get the SurveyModel
	// Create a page
	// Create a SurveyPatient
	// Add SurveyPatient.getSurveyJSON() results to the page.
	// Add page to SurveyModel
	// ...


	render() {
    return (
      <div className='container'>
        <div className='text-center'>
          <h1>Survey</h1>
          <Button>Test React-Bootstrap Button</Button>
        </div>
      </div>
    )
	}
}

export default App

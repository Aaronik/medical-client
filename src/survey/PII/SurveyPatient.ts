import Patient from "common/Patient"

export interface ISurveyPatient {

}

export default class SurveyPatient extends Patient implements ISurveyPatient{
    constructor() {
        super()
    }

    // Returns the JSON required to create a survey fragment for a Person.
    getSurveyJSON(): string {
        return "somejson"
    }

}

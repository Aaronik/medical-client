import React from 'react'
import Container from 'react-bootstrap/Container'

import Survey from 'common/components/Survey'

const surveyJson = {
  pages: [
    {
      name: 'page1',
      elements: [
        {
          type: 'multipletext',
          name: 'patientName1',
          title: 'Patient Name',
          items: [
            {
              name: 'fName',
              title: 'First'
            },
            {
              name: 'mName',
              title: 'Middle'
            },
            {
              name: 'lName',
              title: 'Last'
            }
          ],
          colCount: 3
        },
        {
          type: 'checkbox',
          name: 'geneticBackground',
          title: 'Genetic Background',
          hasOther: true,
          choices: [
            {
              value: 'european',
              text: 'European'
            },
            {
              value: 'ashkenazi',
              text: 'Ashkenazi'
            },
            {
              value: 'mediterranean',
              text: 'Mediterranean'
            },
            {
              value: 'african',
              text: 'African'
            },
            {
              value: 'aboriginal',
              text: 'Aboriginal'
            },
            {
              value: 'middleEastern',
              text: 'Middle Eastern'
            },
            {
              value: 'asian',
              text: 'Asian'
            },
            {
              value: 'southAsian',
              text: 'South Asian'
            }
          ],
          otherText: 'Other (Please Specify)',
          colCount: 5,
          hasNone: true,
          noneText: 'Prefer not to Disclose'
        },
        {
          type: 'matrixdropdown',
          name: 'kidneyGroup',
          title: 'Kidney Stuff',
          defaultValue: {
            kidneyDisease: {
              mom: false,
              'Column 2': false,
              'Column 3': false
            },
            kidneyFailure: {
              mom: false,
              'Column 2': false,
              'Column 3': false
            }
          },
          columns: [
            {
              name: 'Mom'
            },
            {
              name: 'Dad'
            },
            {
              name: 'Son'
            },
            {
              name: 'Daughter'
            },
            {
              name: 'Brother'
            },
            {
              name: 'Sister'
            },
            {
              name: 'Maternal Grandfather'
            },
            {
              name: 'Maternal GrandMother'
            },
            {
              name: 'Paternal Grandfather'
            },
            {
              name: 'Paternal Grandmother'
            }
          ],
          cellType: 'boolean',
          rows: [
            {
              value: 'kidneyDisease',
              text: 'Kidney Disease'
            },
            {
              value: 'kidneyFailure',
              text: 'Kidney Failure'
            },
            {
              value: 'kidneyStones',
              text: 'Kidney Stones'
            },
            {
              value: 'alzheimers',
              text: 'Alzheimer\'s'
            },
            {
              value: 'attentionDeficit',
              text: 'Attention Deficit'
            }
          ]
        }
      ]
    }
  ]
}

const Intake: React.FunctionComponent = () => {
  return (
    <Container>
      <h1>Intake Form</h1>
      <hr/>
      <Survey json={surveyJson} onComplete={() => alert("Thanks for taking the intake survey!")} />
    </Container>
  )
}

export default Intake

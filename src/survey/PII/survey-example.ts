// To generate this, use the excellent builder:
// https://surveyjs.io/create-survey/

export default {
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
    },
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
     "addRowText": "Add event"
    }
   ]
  }
 ],
 "showQuestionNumbers": "off",
 "questionErrorLocation": "bottom",
 "isSinglePage": true
}

function colorize(opaque, hover, ctx) {
    var v = ctx.parsed;
    var c = v < -50 ? '#D60000' :
        v < 0 ? '#F46300' :
        v < 50 ? '#0358B6' :
        '#44DE28';

    var opacity = hover ? 1 - Math.abs(v / 150) - 0.2 : 1 - Math.abs(v / 150);

    return opaque ? c : Utils.transparentize(c, opacity);
}

function hoverColorize(ctx) {
    return colorize(false, true, ctx);
}




(async function() {


    await chrome.storage.local.get(async function(user) {

        const QueryString = window.location.search;
        const urlParams = new URLSearchParams(QueryString);
        user = user.user || user.response
        let auth = {
            headers: {
                'Authorization': `${user.auth}`,
            }
        }
        let courseInfo = await fetch(`https://hmbhs.schoolloop.com/mapi/progress_report?studentID=${user.students[0].studentID}&periodID=${urlParams.get('id')}`, auth).then((response) => { return response })
        console.log(courseInfo)
        courseInfo = await courseInfo.json()
        courseInfo = courseInfo[0]
        console.log(courseInfo)

        document.getElementById('courseInfo').innerHTML = `
            



        `





        courseInfo.grades.forEach(grade => {
                try {
                    document.getElementById('noItems').remove()
                } catch (e) {
                    console.log('')
                }
                let listItem = document.createElement('li')
                listItem.className = 'list-group-item d-flex justify-content-between align-items-start'
                listItem.innerHTML = `
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">${grade.assignment.categoryName}</div>
                    ${grade.assignment.title}
                    </div>
                    <span class="badge bg-primary rounded-pill">${String(grade.percentScore).split('.')[0]}%</span>`
                document.getElementById('assignmentList').appendChild(listItem)
            })
            /*
         {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-17T10:15:58Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "UGFnZSAxMTUgIzEsICMyIGFuZCAjNQ==",
        "title": "Page 115 #1, #2 and #5",
        "systemID": "1631352625100",
        "maxPoints": "20.0",
        "dueDate": "2021-09-17T00:00:00Z"
      }
    }
            */


    })
})()




/*
{
  "gradebookTitle": "Broadcasting Gradebook",
  "fromExternalGradebook": "false",
  "periodAverage": "null",
  "precision": "0",
  "date": "2021-09-18T16:43:11Z",
  "periodID": "1593846839236",
  "useWeighting": "true",
  "schoolID": "1102238613474",
  "grade": "A+",
  "hasScore": "true",
  "longBeachScaledScore": "5.0",
  "numberOfStudentsInCourse": "0",
  "scoreString": "0.98",
  "markIDString": "current",
  "markName": "Current Grades",
  "score": "0.98",
  "gradebookDate": "2021-08-12T00:00:00Z",
  "useLongBeachScaledScoreSystem": "false",
  "dropped": "false",
  "courseRank": "-1",
  "courseAverage": "-1.0",
  "scoreChange": "-0.020000000000000018",
  "trendScore": "0.98",
  "trendDate": "2021-09-18T16:43:11Z",
  "hideScore": "false",
  "showLetterGradeIfScoreHidden": "false",
  "gradeDefinitions": [
    {
      "keyBase64": "RQ==",
      "key": "E",
      "valueBase64": "RG9lcyBub3QgY291bnQ=",
      "value": "Does not count"
    }
  ],
  "grades": [
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-17T10:15:58Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "UGFnZSAxMTUgIzEsICMyIGFuZCAjNQ==",
        "title": "Page 115 #1, #2 and #5",
        "systemID": "1631352625100",
        "maxPoints": "20.0",
        "dueDate": "2021-09-17T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MTAwLjAw",
      "score": "100.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-17T10:15:58Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "RmlsbSBOZXdzL1Byb2plY3Rz",
        "categoryName": "Film News/Projects",
        "titleBase64": "V2VlayA1IEZpbG0gTmV3cw==",
        "title": "Week 5 Film News",
        "systemID": "1631352513153",
        "maxPoints": "100.0",
        "dueDate": "2021-09-17T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MTAwLjAw",
      "score": "100.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-13T12:48:32Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "RmlsbSBOZXdzL1Byb2plY3Rz",
        "categoryName": "Film News/Projects",
        "titleBase64": "V2VlayA0IEZpbG0gTmV3cw==",
        "title": "Week 4 Film News",
        "systemID": "1631352255371",
        "maxPoints": "100.0",
        "dueDate": "2021-09-10T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-10T09:58:18Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "UGFnZSA3OSAjMSwgIzIgYW5kICMz",
        "title": "Page 79 #1, #2 and #3",
        "systemID": "1630733755548",
        "maxPoints": "20.0",
        "dueDate": "2021-09-10T00:00:00Z"
      }
    },
    {
      "scoreBase64": "OTEuMDA=",
      "score": "91.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "91.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-10T10:48:54Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "VGVzdHMgYW5kIEVzc2F5cw==",
        "categoryName": "Tests and Essays",
        "titleBase64": "VW5pdCAxIFRlc3Q=",
        "title": "Unit 1 Test",
        "systemID": "1630733654126",
        "maxPoints": "100.0",
        "dueDate": "2021-09-10T00:00:00Z"
      }
    },
    {
      "scoreBase64": "NjAuMDA=",
      "score": "60.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-10T09:58:18Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "TG9nL05vdGVz",
        "categoryName": "Log/Notes",
        "titleBase64": "VW5pdCAxIE5vdGVzIERheSAxLTY=",
        "title": "Unit 1 Notes Day 1-6",
        "systemID": "1630733654013",
        "maxPoints": "60.0",
        "dueDate": "2021-09-10T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MTAuMDA=",
      "score": "10.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-08T10:37:10Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "RWxlbWVudHMgb2YgTmV3cyBQcmFjdGljZQ==",
        "title": "Elements of News Practice",
        "systemID": "1630733653002",
        "maxPoints": "10.0",
        "dueDate": "2021-09-08T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-08T10:37:10Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "Um9sZSBvZiBhIEpvdXJuYWxpc3QgREJR",
        "title": "Role of a Journalist DBQ",
        "systemID": "1629527980649",
        "maxPoints": "20.0",
        "dueDate": "2021-09-08T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-03T11:12:03Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "RmFpcm5lc3MgRG9jdHJpbmUgUXVlc3Rpb25z",
        "title": "Fairness Doctrine Questions",
        "systemID": "1629527709358",
        "maxPoints": "20.0",
        "dueDate": "2021-09-03T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MTAwLjAw",
      "score": "100.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-03T11:12:03Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "RmlsbSBOZXdzL1Byb2plY3Rz",
        "categoryName": "Film News/Projects",
        "titleBase64": "V2VlayAzIEZpbG0gTmV3cw==",
        "title": "Week 3 Film News",
        "systemID": "1629527328187",
        "maxPoints": "100.0",
        "dueDate": "2021-09-03T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-01T10:25:54Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "UGFnZSA1MyAjMSBhbmQgIzQ=",
        "title": "Page 53 #1 and #4",
        "systemID": "1629527431737",
        "maxPoints": "20.0",
        "dueDate": "2021-09-01T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-09-01T10:25:54Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "SGF6ZWx3b29kIHdvcmtzaGVldA==",
        "title": "Hazelwood worksheet",
        "systemID": "1629527065434",
        "maxPoints": "20.0",
        "dueDate": "2021-08-30T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-08-27T10:08:43Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "UGFnZSAyMyAjMSAtIGFsc28gZGVmaW5lICdQcm9wYWdhbmRhJyBhbmQgJ0Vhc3QgQ29hc3QgQmlh\ncycg",
        "title": "Page 23 #1 - also define 'Propaganda' and 'East Coast Bias' ",
        "systemID": "1629527062558",
        "maxPoints": "20.0",
        "dueDate": "2021-08-27T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-08-28T15:10:26Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "RmlsbSBOZXdzL1Byb2plY3Rz",
        "categoryName": "Film News/Projects",
        "titleBase64": "TWVkaWEgUG9zdGVy",
        "title": "Media Poster",
        "systemID": "1629526919124",
        "maxPoints": "20.0",
        "dueDate": "2021-08-27T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MTAwLjAw",
      "score": "100.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-08-27T10:09:41Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "RmlsbSBOZXdzL1Byb2plY3Rz",
        "categoryName": "Film News/Projects",
        "titleBase64": "V2VlayAyIEZpbG0gTmV3cw==",
        "title": "Week 2 Film News",
        "systemID": "1629526919058",
        "maxPoints": "100.0",
        "dueDate": "2021-08-27T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MTAwLjAw",
      "score": "100.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-08-20T10:48:12Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "RmlsbSBOZXdzL1Byb2plY3Rz",
        "categoryName": "Film News/Projects",
        "titleBase64": "V2VlayAxIEZpbG0gTmV3cw==",
        "title": "Week 1 Film News",
        "systemID": "1629184134527",
        "maxPoints": "100.0",
        "dueDate": "2021-08-20T00:00:00Z"
      }
    },
    {
      "scoreBase64": "MjAuMDA=",
      "score": "20.00",
      "commentBase64": "",
      "comment": "",
      "excused": "false",
      "percentScore": "100.00%",
      "zero": "false",
      "grade": "-",
      "changedDate": "2021-08-20T10:48:12Z",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "assignment": {
        "categoryNameBase64": "SG9tZXdvcms=",
        "categoryName": "Homework",
        "titleBase64": "TWVkaWEgT3duZXJzaGlwIERCUQ==",
        "title": "Media Ownership DBQ",
        "systemID": "1629184072721",
        "maxPoints": "20.0",
        "dueDate": "2021-08-20T00:00:00Z"
      }
    }
  ],
  "teacher": {
    "schoolID": "717",
    "nameBase64": "T2xzb24sIFBhdA==",
    "name": "Olson, Pat",
    "systemID": "1102472042704"
  },
  "course": {
    "courseCommentBase64": "null",
    "schoolID": "",
    "period": "2",
    "nameBase64": "QnJvYWRjYXN0aW5n",
    "name": "Broadcasting",
    "systemID": "1376458792934"
  },
  "GradingScale": {
    "Cutoffs": [
      {
        "description": "null",
        "Start": "97.0",
        "Name": "A+"
      },
      {
        "description": "null",
        "Start": "93.0",
        "Name": "A"
      },
      {
        "description": "null",
        "Start": "90.0",
        "Name": "A-"
      },
      {
        "description": "null",
        "Start": "87.0",
        "Name": "B+"
      },
      {
        "description": "null",
        "Start": "83.0",
        "Name": "B"
      },
      {
        "description": "null",
        "Start": "80.0",
        "Name": "B-"
      },
      {
        "description": "null",
        "Start": "77.0",
        "Name": "C+"
      },
      {
        "description": "null",
        "Start": "73.0",
        "Name": "C"
      },
      {
        "description": "null",
        "Start": "70.0",
        "Name": "C-"
      },
      {
        "description": "null",
        "Start": "67.0",
        "Name": "D+"
      },
      {
        "description": "null",
        "Start": "63.0",
        "Name": "D"
      },
      {
        "description": "null",
        "Start": "60.0",
        "Name": "D-"
      },
      {
        "description": "null",
        "Start": "0.0",
        "Name": "F"
      }
    ]
  },
  "student": {
    "schoolID": "70532",
    "nameBase64": "SmVmZnMsIFNhbXVlbA==",
    "name": "Jeffs, Samuel",
    "systemID": "1593846838236",
    "permID": "70532"
  },
  "categories": [
    {
      "hasScore": "true",
      "longBeachScaledScore": "5.0",
      "weight": "0.3",
      "score": "1.0",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "name": "Film News/Projects"
    },
    {
      "hasScore": "true",
      "longBeachScaledScore": "5.0",
      "weight": "0.3",
      "score": "1.0",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "name": "Homework"
    },
    {
      "hasScore": "true",
      "longBeachScaledScore": "5.0",
      "weight": "0.2",
      "score": "1.0",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "name": "Log/Notes"
    },
    {
      "hasScore": "true",
      "longBeachScaledScore": "5.0",
      "weight": "0.2",
      "score": "0.91",
      "courseRank": "-1",
      "courseAverage": "-1.0",
      "name": "Tests and Essays"
    }
  ],
  "trendScores": [
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1629442800000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629184296239"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1629702000000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629526790736"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1629788400000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629526929841"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1629874800000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527075416"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630047600000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527269695"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630134000000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527322753"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630306800000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527429018"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630479600000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527710787"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630566000000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527885585"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630652400000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1629527969162"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1630738800000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1630733499679"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631084400000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1630733707290"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631170800000",
      "markIDString": "current",
      "score": "1.0",
      "standardsBased": "false",
      "ID": "1630733832597"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631257200000",
      "markIDString": "current",
      "score": "0.98",
      "standardsBased": "false",
      "ID": "1630733957135"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631430000000",
      "markIDString": "current",
      "score": "0.98",
      "standardsBased": "false",
      "ID": "1631352304314"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631516400000",
      "markIDString": "current",
      "score": "0.98",
      "standardsBased": "false",
      "ID": "1631352333584"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631602800000",
      "markIDString": "current",
      "score": "0.98",
      "standardsBased": "false",
      "ID": "1631352492613"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631862000000",
      "markIDString": "current",
      "score": "0.98",
      "standardsBased": "false",
      "ID": "1631352872426"
    },
    {
      "studentID": "1593846838236",
      "grade": "A+",
      "numberOfZeros": "0",
      "dropped": "false",
      "periodID": "1593846839236",
      "tourseID": "1376458792934",
      "teacherID": "1102472042704",
      "dayID": "1631948400000",
      "markIDString": "current",
      "score": "0.98",
      "standardsBased": "false",
      "ID": "1631942305912"
    }
  ]
}
*/
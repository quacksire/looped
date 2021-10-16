(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    let auth = {
        headers: {
            'Authorization': `${user.auth}`,
        }
    }
    let id = urlParams.get('id')
    if (!localStorage.getItem(`${id}-lastUpdated`) >= Date.now() + 10 * 60 || !localStorage.getItem(`${id}-lastUpdated`)) {
        let courseInfo = await fetch(`https://hmbhs.schoolloop.com/mapi/progress_report?studentID=${user.students[0].studentID}&periodID=${id}`, auth).then((response) => { return response })
        courseInfo = await courseInfo.json()
        courseInfo = courseInfo[0]
        localStorage.setItem(id, JSON.stringify(courseInfo))
            //console.log(courseInfo)
        localStorage.setItem(`${id}-lastUpdated`, new Date().getTime()) //reduce waiting time in same session
    }
    let courseInfo = JSON.parse(localStorage.getItem(id))

    //console.log(courseInfo)

    ////////////////////////////////
    document.getElementById('className').innerHTML = `${courseInfo.course.name}`
    document.getElementById('teacherName').innerHTML = `${courseInfo.teacher.name}`
    console.info(`Loaded ${courseInfo.course.name} page (${id})`)

    try {

        courseInfo.grades.forEach(grade => {
            try {
                document.getElementById('noItems').remove()
            } catch (e) {
                //nada
            }
            //Want to do more here, like a pi chart or something
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

        let data = courseInfo.trendScores

        new slChart({
            canvasId: 'myChart',
            id: user.students[0].studentID,
            period_id: id,
            isLongBeachScaledScore: false,
        })




        feather.replace({ 'aria-hidden': 'true' })









    } catch {
        console.warn(`${courseInfo.course.name} has no grades`)
    }


})()
/*
var yLabel = this.isLongBeachScaledScore ? "Score" : "Percent";
        var config = {
            type: 'line',
            data: {
                labels: dates, // Hours

                datasets: [{
                    label: "Grade Trend",
                    data: percentages,
                    fill: false
                }]
            },

            options: {
                bezierCurve : false,
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            display: true,
                            time: {
                                format: 'MM/DD/YY',
                                displayFormat: 'MM/DD/YY'
                            },
                            ticks: {
                                userCallback: function (dataLabel, index, data) {
                                    return index % (data.length - 1) === 0 ? dataLabel : ''; //only first and last dates
                                }
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                show: true,
                                labelString: yLabel
                            },
                            ticks: {
                                userCallback: function (dataLabel, index, data) {
                                    return parseFloat(dataLabel.toFixed(2));
                                }
                            }
                        }
                    ]
                }
            }
        };
        var myLineChart = new Chart(this.context,config);
    }
    */
/*
ID: "1629184296239"
​​​
dayID: "1629442800000"
​​​
dropped: "false"
​​​
grade: "A+"
​​​
markIDString: "current"
​​​
numberOfZeros: "0"
​​​
periodID: "1593846839236"
​​​
score: "1.0"
​​​
standardsBased: "false"
​​​
studentID: "1593846838236"
​​​
teacherID: "1102472042704"
​​​
tourseID: "1376458792934"
*/
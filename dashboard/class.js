(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    let sl = console
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
        //try {
        //------------------------ Grade List ------------------------//
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
        //console.log("data to process", data);
        //------------------------ Chart ------------------------//
    var percentages = [];
    var dates = [];
    for (var i = 0; i < courseInfo.trendScores.length; i++) {
        percentages.push(parseFloat(courseInfo.trendScores[i].score) * 100);
        dates.push(new Date(parseInt(String(courseInfo.trendScores[i].dayID))).toLocaleDateString())
    }
    //sl.log("percentages", percentages)
    //sl.log("dates", dates)
    //sl.log("paint", percentages, dates)
    var yLabel = "Score";
    var config = {
        type: 'line',
        data: {
            labels: dates, // Hours
            datasets: [{
                label: "Grade Trend",
                data: percentages,
                fill: false,
                borderColor: 'rgba(248, 148, 6, 1)'
            }]
        },
        options: {
            bezierCurve: true,
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        userCallback: function(dataLabel, index, data) {
                            return index % (courseInfo.trendScores.length - 1) === 0 ? dataLabel : ''; //only first and last dates
                        }
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        show: true,
                        labelString: yLabel
                    },
                    ticks: {
                        userCallback: function(dataLabel, index, data) {
                            return parseFloat(dataLabel.toFixed(2));
                        }
                    }
                }]
            }
        }
    };
    console.log = function() {};
    Chart.defaults.responsive = true;
    Chart.defaults.animation = false;
    var myLineChart = new Chart('myChart', config);
    //------------------------ Misc ------------------------//
    feather.replace({ 'aria-hidden': 'true' })
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
        //} catch {
        //    console.warn(`${courseInfo.course.name} has no grades`)
        //}
})()
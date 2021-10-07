(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    let auth = {
        headers: {
            'Authorization': `${user.auth}`,
        }
    }
    console.log(urlParams.get('id'))
    let courseInfo = await fetch(`https://hmbhs.schoolloop.com/mapi/progress_report?studentID=${user.students[0].studentID}&periodID=${urlParams.get('id')}`, auth).then((response) => { return response })
        //console.log(courseInfo)
    courseInfo = await courseInfo.json()
    courseInfo = courseInfo[0]
    console.log(courseInfo)
        ////////////////////////////////
    document.getElementById('className').innerHTML = `${courseInfo.course.name}`
    document.getElementById('teacherName').innerHTML = `${courseInfo.teacher.name}`
    courseInfo.grades.forEach(grade => {
        try {
            document.getElementById('noItems').remove()
        } catch (e) {
            //console.log('')
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
})()
const taskList = document.querySelector('.tasks-list');
const addTaskForm = document.querySelector('.add-task-form');
const nameValue = document.getElementById('name-value');
const descriptionValue = document.getElementById('description-value');
const btnSubmit = document.querySelector('.btn')
let output = '';

const renderTasks = (tasks) =>{
    tasks.forEach(task => {
        output += `
            <div class="card mt-4 col-md-6 bg-light">
                <div class="card-body" data-id=${task._id}>
                    <h5 class="card-title">${task.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${task.date}</h6>
                    <p class="card-text">${task.description}</p>
                    <a href="#" class="card-link" id="edit-task">Edit</a>
                    <a href="#" class="card-link" id="delete-task">Delete</a>
                </div>
            </div>
        `;
    });
    taskList.innerHTML = output;
}

//GET - Read the tasks
fetch('/tasks')
    .then(res => res.json())
    .then(data => renderTasks(data))



taskList.addEventListener('click', (e) => {
    e.preventDefault();
    let editButtonPressed = e.target.id == 'edit-task';
    let delButtonPressed = e.target.id == 'delete-task';
    let id = e.target.parentElement.dataset.id;
    //DELETE - Delete task
    if(delButtonPressed){
        fetch(`/tasks/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => location.reload())
    }

    if(editButtonPressed) {
        const parent = e.target.parentElement;
        let nameContent = parent.querySelector('.card-title').textContent;
        let descriptionContent = parent.querySelector('.card-text').textContent;
        
        nameValue.value = nameContent;
        descriptionValue.value = descriptionContent
    }

    //PATCH - Update task
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault()
        fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                name: nameValue.value,
                description: descriptionValue.value,
            })
        })
        .then(res => res.json())
        .then(() => location.reload())
    })
});

//POST - Create a task
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('/tasks', {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            name: nameValue.value,
            description: descriptionValue.value,
        })
    })
    .then(res => res.json())
    .then(data => {
        //put data into an array as renderTasks takes an array
        const dataArr = [];
        dataArr.push(data);
        renderTasks(dataArr)
    })

    //Rest input fields
    nameValue.value = '';
    descriptionValue.value = '';
})
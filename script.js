const taskContent = document.querySelector("#taskName");
const addTask = document.querySelector("#createTask");
const tasksContainer = document.querySelector("#tasksContainer");

let tasks = [];

function generateId(){ //Generates a new random id between 1 and 9999.
    let newId = 0;

    do{
         newId = Math.floor(Math.random() * (9999 - 1) + 1);
    } while(tasks.some(task => task.id === newId));

    return newId;
}

const colorMap = {
    red: "#e63946",
    green: "#a7c957",
    blue: "#00b4d8",
    white: "#e9ecef"
}

loadTasks();
renderTasks();

addTask.addEventListener("click", () => {
    if(taskContent.value != ""){
        let content = taskContent.value;
        let newTask = {
            id: generateId(),
            content: content,
            color: "white"
        };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTask(newTask);
        taskContent.value = "";
    } else{ alert("Please enter a task")};
});

//Functions to create, delete and render tasks.
function deleteTask(id) { //Deletes a specific task with its id.
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks.splice(taskIndex, 1);

    const taskToDelete = document.querySelector(`[data-id="${id}"]`);
    taskToDelete.remove();

    saveTasks(tasks);
}

function renderTasks() { //Renders all the created tasks when the page is loaded or reloaded
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
        renderTask(task);
    });
}

function renderTask(task){
    const HTML = `
        <div class="task" data-id="${task.id}" style="background-color: ${colorMap[task.color]};" draggable="true">
            <div class="normalTask">
                <div class="taskNameContainer">
                    <i class="fa-solid fa-grip-vertical"></i>
                    <span class="taskName">${task.content}</span>
                </div>

                <div class="taskBtns">
                    <button class="editBtn" data-id="${task.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="deleteBtn" data-id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>

            <div class="editTask">
            <div class="taskNameContainer">
                <i class="fa-solid fa-grip-vertical"></i>
                <input type="text" class="editInput" value="${task.content}">
            </div>
            <div class="taskBtns">
                <button class="colorBtn white" data-color="white" type="button"></button>
                <button class="colorBtn red" data-color="red" type="button"></button>
                <button class="colorBtn green" data-color="green" type="button"></button>
                <button class="colorBtn blue" data-color="blue" type="button"></button>
                <button class="confirmEdit" data-id="${task.id}" type="button"><i class="fa-solid fa-circle-check"></i></button>
            </div>
                </div>
        </div>
    `;

    if (!document.querySelector(`.task[data-id="${task.id}"]`)) {
        tasksContainer.insertAdjacentHTML("beforeend", HTML);
    }

    const taskEl = document.querySelector(`.task[data-id="${task.id}"]`);
    const deleteBtn = taskEl.querySelector(".deleteBtn");
    const editBtn = taskEl.querySelector(".editBtn");
    const confirmEdit = taskEl.querySelector(".confirmEdit");
    const editInput = taskEl.querySelector(".editInput");
    const colorBtns = taskEl.querySelectorAll(".colorBtn");

    colorBtns.forEach(colorBtn => {
        colorBtn.addEventListener("click", (e) =>{
            const selectedColor = e.target.dataset.color;
            task.color = selectedColor;
            saveTasks(tasks);
            taskEl.style.backgroundColor = colorMap[selectedColor];
        });
    });

    deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
    });

    editBtn.addEventListener("click", () => {
        taskEl.querySelector(".normalTask").style.display = "none";
        taskEl.querySelector(".editTask").style.display = "flex";
    });

    confirmEdit.addEventListener("click", () => {
        task.content = editInput.value;
        saveTasks(tasks);
        taskEl.querySelector(".taskName").textContent = task.content;
        taskEl.querySelector(".normalTask").style.display = "flex";
        taskEl.querySelector(".editTask").style.display = "none";
    });
}


//Functions to access localStorage

function saveTasks(tasks){ //Saves the tasks array in the localStorage
    let tasksSaved = JSON.stringify(tasks);
    localStorage.setItem("tasks", tasksSaved);
}

function loadTasks() { //Loads the saved tasks array from localStorage
    const tasksLoaded = JSON.parse(localStorage.getItem("tasks"));
    if (tasksLoaded) {
        tasks = tasksLoaded;
    }
}
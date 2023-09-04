
// Import necessary Firestore functions
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Initialize Firestore database
const db = getFirestore();
const dbRef = collection(db, "tasks");

//Mibile view toggles
const leftCol = document.getElementById("left-col");
const rightCol = document.getElementById("right-col");
const backBtn = document.getElementById("back-btn");

// Back button event listener for mobile view
backBtn.addEventListener("click", e => {
    leftCol.style.display = "block";
    rightCol.style.display = "none";
});

// Toggle left and right views on mobile devices
const toggleLeftAndRightViewsOnMobile = () => {
    if (document.body.clientWidth <= 600) {
        leftCol.style.display = "none";
        rightCol.style.display = "block";

    }

}

// Retrieve tasks data from Firestore
let tasks = [];
const getTasks = async() =>{
    try {
        await onSnapshot(dbRef, docSnap => {
            tasks = [];
            docSnap.forEach( (doc) => { 
                const task = doc.data();
                task.id =doc.id;
                tasks.push(task);
            }) ;
            showTasks(tasks);
        });
    } catch (err) {
        console.log("getTasks =" + err);
    }
}
getTasks();

//Display summary of created tasks on the left column
const tasksList = document.getElementById("tasks-list");
const showTasks = (tasks) => {
    tasksList.innerHTML = "";

    tasks.forEach(task => {
        // Determine the CSS class based on task status
        // let statusClass ="";
        // if (String(task.taskstatus === "Pending")) {
        //     statusClass = "task-pending";
        // } else if (String(task.taskstatus === "In-Progress")) {
        //     statusClass = "task-in-progress";
        // } else if (String(task.taskstatus === "Completed") ){
        //     statusClass = "task-completed";

        // }
        // const taskItem = document.createElement("li");
        // taskItem.classList.add(statusClass);


        // Get the first two letters of the taskname
        const tasknameInitials = task.taskname.substring(0, 2).toUpperCase();

        // Create list item for each task
        const li = `<li class="tasks-list-item" id="${task.id}">
            <div class="media">
                <div class="two-letter">${tasknameInitials}</div>
            </div>
            <div class="content">
                <div class="title">
                    ${task.taskname} 
                </div>
                <div class="subtitle">
                    ${task.assignedto} | ${task.taskstatus}
                </div>
            </div>
            <div class="action">
                <button class="edit-task">Edit</button>
                <button class="delete-task">Delete</button>
            </div>
        </li>`;
        // Add the CSS classs to the li element
        //li.classList.add(statusClass);
        tasksList.innerHTML += li;
    })
}

/// Task list item click event handler
const taskListPressed = (event) =>{
    const id = event.target.closest("li").getAttribute("id");
    if(event.target.className === "edit-task") {
        editButtonPressed(id);
    } else if (event.target.className === "delete-task"){
        deleteButtonPressed(id);
    } else {
        displayTaskOnTaskView(id);
        toggleLeftAndRightViewsOnMobile();
    }
}
tasksList.addEventListener("click", taskListPressed);

//Function to delete a task
const deleteButtonPressed = async (id) =>{
    const isConfirmed =confirm("Are you sure you want to delete this task?");
    if (isConfirmed){
        try {
            const docRef = doc(db, "tasks", id);
            await deleteDoc(docRef);   
             } catch(e){
                 setErrorMessage("server side error", "Unable delete the task");
                 showErrorMessages();
             }
    }
}

//Edit button click event handler
const editButtonPressed = (id) => {
    taskOverlay.style.display = "flex";
    // Retrieve task data for editing
    const task = getTask(id);
    // Update form fields with task data
      taskName.value =task.taskname;
      startDate.value = task.startdate;
      priority.value = task.priority;
      assignedTo.value = task.assignedto;
      taskStatus.value = task.taskstatus;
      email.value = task.email;
      taskOverlay.setAttribute("task-id", task.id);
}  

// Get task by ID
const getTask = (id) => {
    return tasks.find(task => {
        return task.id === id;
    });
}
//Calculate how long the task took from start date to completion time
const taskCompletionDuration = (task) => {
    if (task.taskstatus === "Completed") {
      const startDate = new Date(task.startdate);
      const endDate = new Date();
      const duration = endDate - startDate;
      const days = Math.floor(duration / (1000 * 60 * 60 * 24));
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${days} days ${hours} hours`;
    } else {
      return "Task still in Progress";
    }
  };
  
// Display task details on the right column
const displayTaskOnTaskView =(id) => {
    const task = getTask(id);
const rightColDetail = document.getElementById("right-col-detail");
rightColDetail.innerHTML = `
<div class="label">Task:</div>
<div class="data">${task.taskname} </div>
<div class="label">Assigned To:</div>
<div class="data">${task.assignedto} </div>
<div class="label">Start Date:</div>
<div class="data">${task.startdate} </div>
<div class="label">Status:</div>
<div class="data">${task.taskstatus} </div>
<div class="label">Suppervisor Email:</div>
<div class="data">${task.email} </div>
<div class="label">Task Completion Duration:</div>
<div class="data">${taskCompletionDuration(task)} </div>`;
}
 
// Add button click event handler to show task addition menu
const addBtn = document.querySelector(".add-btn");
const taskOverlay = document.getElementById("task-overlay");
const closeBtn = document.querySelector(".close-btn");

//show task addition menu when add button 
const addBtnPressed = () => {
    taskOverlay.style.display ="flex";
    taskOverlay.removeAttribute("task-id");
    //clear form previous data values
    taskName.value =""
    startDate.value = "";
    priority.value = "";
    assignedTo.value = "";
    taskStatus.value = "Pending";
    email.value = "";
}
addBtn.addEventListener("click", addBtnPressed);

// Close button click event handler for the task overlay
const closeBtnPressed = () => {
    taskOverlay.style.display ="none";
}
closeBtn.addEventListener("click", closeBtnPressed);

// Task overlay click event handler to close when clicking outside the overlay
const taskOverlayPressed = (e) => {

    if(e instanceof Event) {
        if (e.target === e.currentTarget) {
            taskOverlay.style.display = "none";
           }
    } else {
        taskOverlay.style.display = "none";
    }
}
taskOverlay.addEventListener("click", taskOverlayPressed);

//Validation of the inputs
const saveBtn = document.querySelector(".save-btn");
const error = {};
const taskName = document.getElementById("task-name"),
      startDate = document.getElementById("start-date"),
      priority = document.getElementById("priority"),
      assignedTo = document.getElementById("assigned-to"),
      taskStatus = document.getElementById("task-status"),
      email = document.getElementById("email");

      const saveBtnPressed = async () => {
        //console.log(taskName.value);
        validateInputs([
            taskName, startDate, priority, assignedTo, taskStatus, email
        ]);
        validateEmail(email);
        showErrorMessages(error);
    // Save task data if there are no validation errors
        if (Object.keys(error).length === 0) {
            try {
                const taskId = taskOverlay.getAttribute("task-id");
                if (taskId) {
                    // Update existing task
                    const editedTask = getTask(taskId);
                    // Update task properties with input values
                    editedTask.taskname = taskName.value;
                    editedTask.startdate = startDate.value;
                    editedTask.priority = priority.value;
                    editedTask.assignedto = assignedTo.value;
                    editedTask.taskstatus = taskStatus.value;
                    editedTask.email = email.value;
                    await updateTaskInDatabase(taskId, editedTask);
                } else {
                    // Add new task
                    await addDoc(dbRef, {
                        taskname: taskName.value,
                        startdate: startDate.value,
                        priority: priority.value,
                        assignedto: assignedTo.value,
                        taskstatus: taskStatus.value,
                        email: email.value
                    });
                }
                taskOverlayPressed();
            } catch (err) {
                setErrorMessage("server side error", "Unable to add/update the task");
                showErrorMessages();
            }
        }
    }
    saveBtn.addEventListener("click", saveBtnPressed);

    // Function to update an edited task in the database
const updateTaskInDatabase = async (taskId, editedTask) => {
    try {
        const taskDocRef = doc(dbRef, taskId);
        await updateDoc(taskDocRef, editedTask);
    } catch (err) {
        console.log("updateTaskInDatabase error:", err);
        throw err;
    }
};

// Validate input fields and set error messages
const validateInputs = (inputs) => {
    inputs.forEach(input => { 
        if(input.value.trim() === "" ) {
            //error[input.id] = input.id + " is empty";
            setErrorMessage(input, input.id + " is empty");
        }
        else {
            delete error[input.id];
        }
    });
    console.log(error);

}
// Set error message and highlight input field
const setErrorMessage = (input, message) =>{
    if(input.nodeName === "INPUT" || input.nodeName === "SELECT") {
        error[input.id] =message;
        input.style.border = "1px solid red";
    } else {
        error[input] = message;
    }
}

// Validate email input to general lose email format
const validateEmail =(input) => {
    if(input.value.trim() !== "") { 
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(emailRegex.test(input.value.trim())){
        delete error[input.id]
    }
    else {
        //error[input.id] = "invalid " + input.id;
        setErrorMessage(input, input.id + " is  invalid");
    }
}
}
// Display error messages
const showErrorMessages =() =>{
    const errorLabel = document.getElementById("error-label");
    errorLabel.innerHTML = "";
    for (const key in error) {
        const li = document.createElement("li"); 
        li.innerHTML = error[key];
        li.style.color = "red";
        errorLabel.appendChild(li);
    }
}

// Event listener for the filter select element
const filterSelect = document.getElementById("filter-select");
filterSelect.addEventListener("change", () => {
    const selectedStatus = filterSelect.value;

    // Filter tasks based on the selected status
    const filteredTasks = tasks.filter(task => {
        if (selectedStatus === "all") {
            return true; // Show all tasks
        } else {
            return task.taskstatus === selectedStatus;
        }
    });

    // Display the filtered tasks
    showTasks(filteredTasks);
});

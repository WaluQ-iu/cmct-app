

import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
const db = getFirestore();
const dbRef = collection(db, "tasks");

//Mibile view toggles

const leftCol = document.getElementById("left-col");
const rightCol = document.getElementById("right-col");
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", e => {
    leftCol.style.display = "block";
    rightCol.style.display = "none";

});

const toggleLeftAndRightViewsOnMobile = () => {
    if (document.body.clientWidth <= 600) {
        leftCol.style.display = "none";
        rightCol.style.display = "block";

    }

}

//Rretrive the saved data back

let tasks = [];

const getTasks = async() =>{

    try {
        //const docSnap = await getDocs(dbRef);

        await onSnapshot(dbRef, docSnap => {
            tasks = [];
            docSnap.forEach( (doc) => { 
                const task = doc.data();
                task.id =doc.id;
                tasks.push(task);
                //console.log(doc.data().taskname);
                //console.log(doc.id);
    
            }) ;
            //console.log(tasks);
            showTasks(tasks);

        });
 

    } catch (err) {
        console.log("getTasks =" + err);
    }

}

getTasks();

//Display summary of created tasks on the left
const tasksList = document.getElementById("tasks-list");
const showTasks = (tasks) => {
    tasksList.innerHTML = "";

    tasks.forEach(task => {
        // Get the first two letters of the taskname
        const tasknameInitials = task.taskname.substring(0, 2).toUpperCase();

        const li = `<li class="tasks-list-item" id="${task.id}">
            <div class="media">
                <div class="two-letter">${tasknameInitials}</div>
            </div>
            <div class="content">
                <div class="title">
                    ${task.taskname} ${task.assignedto}
                </div>
                <div class="subtitle">
                    ${task.startdate} ${task.taskstatus}
                </div>
            </div>
            <div class="action">
                <button class="edit-task">Edit</button>
                <button class="delete-task">Delete</button>
            </div>
        </li>`;
        tasksList.innerHTML += li;
    })
}



/// View Tasks details on click

const taskListPressed = (event) =>{
    //console.log("Pressed")
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


//Edit the data

const editButtonPressed = (id) => {
    taskOverlay.style.display = "flex";

    const task = getTask(id);
      taskName.value =task.taskname;
      startDate.value = task.startdate;
      priority.value = task.priority;
      assignedTo.value = task.assignedto;
      taskStatus.value = task.taskstatus;
      email.value = task.email;

      taskOverlay.setAttribute("task-id", task.id);
}  


const getTask = (id) => {
    return tasks.find(task => {
        return task.id === id;
    });
}

const displayTaskOnTaskView =(id) => {
    const task = getTask(id);
//console.log(task);
const rightColDetail = document.getElementById("right-col-detail");
rightColDetail.innerHTML = `
<div class="label">Task:</div>
<div class="data">${task.taskname} </div>
<div class="label">Assigned Tt:</div>
<div class="data">${task.assignedto} </div>
<div class="label">Start Date:</div>
<div class="data">${task.startdate} </div>
<div class="label">Status:</div>
<div class="data">${task.taskstatus} </div>
<div class="label">Suppervisor Email:</div>
<div class="data">${task.email} </div>`;

}
 



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
    taskStatus.value = "";
    email.value = "";
}

const closeBtnPressed = () => {
    taskOverlay.style.display ="none";
}

const taskOverlayPressed = (e) => {

    if(e instanceof Event) {
        if (e.target === e.currentTarget) {
            taskOverlay.style.display = "none";
           }
    } else {
        taskOverlay.style.display = "none";
    }

}


addBtn.addEventListener("click", addBtnPressed);
closeBtn.addEventListener("click", closeBtnPressed);
taskOverlay.addEventListener("click", taskOverlayPressed);

//Validation of the inputs
const saveBtn = document.querySelector(".save-btn");
const error = {};

const     taskName = document.getElementById("task-name"),
      startDate = document.getElementById("start-date"),
      priority = document.getElementById("priority"),
      assignedTo = document.getElementById("assigned-to"),
      taskStatus = document.getElementById("task-status"),
      email = document.getElementById("email");

      const saveBtnPressed = async () => {
        console.log(taskName.value);
        validateInputs([
            taskName, startDate, priority, assignedTo, taskStatus, email
        ]);
        validateEmail(email);
        showErrorMessages(error);
    
        if (Object.keys(error).length === 0) {
            try {
                const taskId = taskOverlay.getAttribute("task-id");
    
                if (taskId) {
                    const editedTask = getTask(taskId);
                    editedTask.taskname = taskName.value;
                    editedTask.startdate = startDate.value;
                    editedTask.priority = priority.value;
                    editedTask.assignedto = assignedTo.value;
                    editedTask.taskstatus = taskStatus.value;
                    editedTask.email = email.value;
    
                    // Update the edited task in the database
                    await updateTaskInDatabase(taskId, editedTask);
                } else {
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
                //closeBtnPressed();
            } catch (err) {
                setErrorMessage("server side error", "Unable to add/update your data");
                showErrorMessages();
            }
        }
    };

    // Function to update an edited task in the database
const updateTaskInDatabase = async (taskId, editedTask) => {
    try {
        const taskDocRef = doc(dbRef, taskId);
        await updateDoc(taskDocRef, editedTask);
       // taskOverlayPressed();
    } catch (err) {
        console.log("updateTaskInDatabase error:", err);
        throw err;
    }
};
const validateInputs = (inputs) => {
    inputs.forEach(input => { 
        if(input.value.trim() === "") {
            //error[input.id] = input.id + " is empty";
            setErrorMessage(input, input.id + " is empty");
        }
        else {
            delete error[input.id];
        }
    });
    console.log(error);

}
const setErrorMessage = (input, message) =>{
    if(input.nodeName === "INPUT"){
        error[input.id] =message;
        input.style.border = "1px solid red";
    
    } else {
        error[input] = message;
    }


}
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
saveBtn.addEventListener("click", saveBtnPressed);

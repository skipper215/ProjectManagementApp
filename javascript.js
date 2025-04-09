
const toDoList = JSON.parse(localStorage.getItem("todos")) || [{
    name: "",
    dueDate: ""
}];
let completedToDoList = []; 

window.onload = displayToDos;

function addToDo() {
    const inputElement = document.querySelector(".js-input");
    const inputDateElement = document.querySelector(".js-date")
    toDoList.push({
        name: inputElement.value,
        dueDate: inputDateElement.value
    });
    inputElement.value = ""; //clears search box
    localStorage.setItem("todos", JSON.stringify(toDoList))
    console.log(toDoList);
}

function removeToDo(index) {
    toDoList.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(toDoList)); //set new state of array
    displayToDos(); //re-display
}

function handleKeyDown(event) {
    if(event.key === 'Enter') {
        addToDo();
    }
}

function displayToDos() {
    const todoElement = document.querySelector(".todos")
    todoElement.innerHTML = "";  // clear previous iteration of display
    for (let i=0; i<toDoList.length; i++) {
        const toDoObject = toDoList[i]
        const name = toDoObject.name;
        const date = toDoObject.dueDate;
        todoElement.innerHTML += 
        `<li class='toDoItem'> 
        <input class= 'checkbox-todo' type='checkbox' data-index=${i}>${name} ${date}
        <button onclick="removeToDo(${i})" class='js-remove'>Remove</button> 
        </li>`;
    }
    // check checkboxes
    const checkboxes = document.querySelectorAll(".checkbox-todo");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            console.log("Checkbox state changed!");  // Debugging line
            const index = Number(checkbox.dataset.index);
            const checkedToDo = toDoList[index];
            if (checkbox.checked) {
                completedToDoList.push(checkedToDo);
                removeToDo(index);
            } else {
                //remove it from completedToDoList
                completedToDoList = completedToDoList.filter(item => item !== checkedToDo); //keep all items 'as long as' != toDoObject
                
                console.log("removed: " + completedToDoList);
            }
            displayCompletedToDos();
            
        })
    })



    
}

function displayCompletedToDos() {
    // add completedToDos to html
    const completedToDoElement = document.querySelector(".completedToDoList");
    completedToDoElement.innerHTML =""; //remove previous instance of completedToDoList display
    for (let i=0; i<completedToDoList.length; i++) {
        const name = completedToDoList[i].name;
        console.log(completedToDoList[i]);

        completedToDoElement.innerHTML +=
        `<li class="completedToDoItem">
            ${name}
        </li>
        `
    }
}
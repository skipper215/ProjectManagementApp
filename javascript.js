
const toDoList = JSON.parse(localStorage.getItem("todos")) || [{
    name: "",
    dueDate: ""
}];

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
        <input type='checkbox'>${name} ${date}
        <button onclick="removeToDo(${i})" class='js-remove'>Remove</button> 
        </li>`;
    }
}


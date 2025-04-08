
const toDoList = JSON.parse(localStorage.getItem("todos")) || [];
window.onload = displayToDos;

function addToDo() {
    const inputElement = document.querySelector(".js-input");
    toDoList.push(inputElement.value);
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
        todoElement.innerHTML += 
        `<li class='toDoItem'> 
        <input type='checkbox'>${toDoList[i]}
        <button onclick="removeToDo(${i})" class='js-remove'>Remove</button> 
        </li>`;
    }
}



const toDoList = JSON.parse(localStorage.getItem("todos")) || [{
    name: "",
    dueDate: ""
}];
let completedToDoList = JSON.parse(localStorage.getItem("completedToDoList")) || []; 

window.onload = displayToDos(), displayCompletedToDos();


function addToDo() {
    const inputElement = document.querySelector(".js-input");
    const inputDateElement = document.querySelector(".js-date")
    // Date format to DD-MM-YYYY
    const [year, month, day] = inputDateElement.value.split('-');
    const formatDate = `${day}/${month}/${year}`

    if(inputElement.value && !inputDateElement.value) {
        toDoList.push({
            name: inputElement.value,
            dueDate: ""
        });
    }
    else if(inputElement.value && inputDateElement.value) {
        toDoList.push({
            name: inputElement.value,
            dueDate: formatDate
        });
    }
        
    inputElement.value = ""; //clears search box
    localStorage.setItem("todos", JSON.stringify(toDoList))
    console.log(inputDateElement.value);


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
        <input class= 'checkbox-todo' type='checkbox' data-index=${i} id="toDoLabel${i}"> 
        <label for="toDoLabel${i}" id="label${i}">${name}</label><p class="dueDate">${date}<p>
        <button onclick="removeToDo(${i})" class='removeToDo'>🗑️</button>
        <button onclick="editToDo(${i})" class='editToDo'>Edit</button> 
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
                localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                removeToDo(index);
            } else {
                //remove it from completedToDoList
                completedToDoList = completedToDoList.filter(item => item !== checkedToDo); //keep all items 'as long as' != toDoObject
                localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
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
        const date = completedToDoList[i].dueDate;


        completedToDoElement.innerHTML +=
        `<li class="completedToDoItem">
            ✅ ${name} <p><em>Completed on ${date}</em></p> <button class="removeCompletedToDo" onclick="removeCompletedToDo(${i})">❌</button>
        </li>
        `
    }
}

function removeCompletedToDo(index) {
    //remove from completeToDoList array
    completedToDoList.splice(index, 1);
    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
    displayCompletedToDos();
}

function editToDo(index) {
    const label = document.querySelector(`#label${index}`);
    const currentText = label.textContent.trim(); //preserves current text
    // Replace label content with input + save button
    label.innerHTML = `
      <input type="text" id="editInput${index}" value="${currentText}">
      <button onclick="saveToDo(${index})">Save</button>
    `; //onclick leaves function and disappears input text and button
  }

  function saveToDo(index) {
      const input = document.querySelector(`#editInput${index}`);
      toDoList[index].name = input.value; //edit array with new changes
      displayToDos(); //show updated state
  }
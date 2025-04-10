
const toDoList = JSON.parse(localStorage.getItem("todos")) || [{
    name: "",
    dueDate: ""
}];
let completedToDoList = JSON.parse(localStorage.getItem("completedToDoList")) || []; 
// array required for each sortable category
const category1 = JSON.parse(localStorage.getItem("category1")) || [];
const category2 = JSON.parse(localStorage.getItem("category2")) || [];


window.onload = () => {
    displayToDos(), 
    displayCompletedToDos();
    // localStorage.removeItem("category1");
    // localStorage.removeItem("category2");
    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
    console.log(category1);
    console.log(category2);
    console.log(toDoList);
}

// Functionality sortable toDoItems between categories
function createCategories() {

    Sortable.create(document.querySelector("#category1 .todos"), {
    group: 'todos', // Same group name allows drag-and-drop between categories
    animation: 150,
    fallbackOnBody: true,
    ghostClass: 'dragging',
    onEnd: (evt) => {
        //take out oldIndex element from category1 and insert into category2 array
        console.log(evt.oldIndex + " moved to " + evt.newIndex);
        if (evt.from === evt.to) {
            // If the item is moved within the same category (category1)
            const itemToMove = category1[evt.oldIndex];
            category1.splice(evt.oldIndex, 1);
            category1.splice(evt.newIndex, 0, itemToMove);
            console.log(itemToMove);
            localStorage.setItem("category1", JSON.stringify(category1));
          } else {
            // If the item is moved from category1 to category2
            const itemToMove = category1[evt.oldIndex];
            category1.splice(evt.oldIndex, 1);
            category2.splice(evt.newIndex, 0, itemToMove);
            localStorage.setItem("category1", JSON.stringify(category1));
            localStorage.setItem("category2", JSON.stringify(category2));
          }

        console.log('category1:', localStorage.getItem('category1'));
        console.log('category2:', localStorage.getItem('category2'));
      }
    });

    Sortable.create(document.querySelector("#category2 .todos"), {
    group: 'todos', // Same group name allows drag-and-drop between categories
    animation: 150,
    fallbackOnBody: true,
    ghostClass: 'dragging',
    onEnd: (evt) => {
        console.log(evt.oldIndex + " moved to " + evt.newIndex);
        if (evt.from === evt.to) {
            // If the item is moved within the same category (category2)
            const itemToMove = category2[evt.oldIndex];
            category2.splice(evt.oldIndex, 1);
            category2.splice(evt.newIndex, 0, itemToMove);
            localStorage.setItem("category2", JSON.stringify(category2));
          } else {
            // If the item is moved from category2 to category1
            const itemToMove = category2[evt.oldIndex];
            category2.splice(evt.oldIndex, 1);
            category1.splice(evt.newIndex, 0, itemToMove);
            localStorage.setItem("category1", JSON.stringify(category1));
            localStorage.setItem("category2", JSON.stringify(category2));
          }

        console.log('category1:', localStorage.getItem('category1'));
        console.log('category2:', localStorage.getItem('category2'));
      }
    });
    
}

function addToDo() {
    const inputElement = document.querySelector(".js-input");
    const inputDateElement = document.querySelector(".js-date")
    // Date format to DD-MM-YYYY
    const [year, month, day] = inputDateElement.value.split('-');
    const formatDate = `${day}/${month}/${year}`

    if(inputElement.value && !inputDateElement.value) {
        category1.push({
            name: inputElement.value,
            dueDate: ""
        });
    }
    else if(inputElement.value && inputDateElement.value) {
        category1.push({
            name: inputElement.value,
            dueDate: formatDate
        });
    }
        
    inputElement.value = ""; //clears search box
    localStorage.setItem("todos", JSON.stringify(toDoList))
    console.log(inputDateElement.value);
}

function removeToDo(index, category) {
    if(category === 'category1') {
        category1.splice(index, 1);
    } else { //category 2
        category2.splice(index, 1);
    }
    localStorage.setItem("category1", JSON.stringify(category1));
    localStorage.setItem("category2", JSON.stringify(category2));
    displayToDos(); //re-display
}

function handleKeyDown(event) {
    if(event.key === 'Enter') {
        addToDo();
    }
}

function displayToDos() {
    
    const category1Element = document.querySelector("#category1 .todos");
    category1Element.innerHTML = "";  // clear previous iteration of display
    console.log(category1);
    console.log(category2);
    console.log(toDoList);
    

    for (let i=0; i<category1.length; i++) {
        // Setting up variables 
        const toDoObject = category1[i]
        const name = toDoObject.name;
        const date = toDoObject.dueDate;

        category1Element.innerHTML += 
        `<li class='toDoItem'>
            <div class="left-content">
                <input class= 'checkbox-todo' type='checkbox' data-index=${i} id="toDoLabel${i}"> 
                <label for="toDoLabel${i}" id="label1${i}">${name}</label>
                <p class="dueDate">${date}<p>
            </div>
            <div class="right-content">
                <button onclick="editToDo(${i}, 'category1')" class='editToDo'>Edit</button>
                <button onclick="removeToDo(${i}, 'category1')" class='removeToDo'>🗑️</button> 
            </div>
        </li>`;
    }

    const category2Element = document.querySelector("#category2 .todos");
    category2Element.innerHTML = "";  // clear previous iteration of display
    for (let i=0; i<category2.length; i++) {
        // Setting up variables 
        const toDoObject = category2[i]
        const name = toDoObject.name;
        const date = toDoObject.dueDate;

        category2Element.innerHTML += 
        `<li class='toDoItem'>
            <div class="left-content">
                <input class= 'checkbox-todo' type='checkbox' data-index=${i} id="toDoLabel${i}"> 
                <label for="toDoLabel${i}" id="label2${i}">${name}</label>
                <p class="dueDate">${date}<p>
            </div>
            <div class="right-content">
                <button onclick="editToDo(${i}, 'category2')" class='editToDo'>Edit</button>
                <button onclick="removeToDo(${i}, 'category2')" class='removeToDo'>🗑️</button> 
            </div>
        </li>`;
    }

    



    // check checkboxes
    const checkboxes = document.querySelectorAll(".checkbox-todo");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            //get parent category
            const category = checkbox.closest(".sortable-container");
            const index = Number(checkbox.dataset.index);
            
            if(category.id === 'category1') {
                const checkedToDo = category1[index];
                if (checkbox.checked) {
                    completedToDoList.push(checkedToDo);
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                    removeToDo(index, 'category1');
                } else {
                    //remove it from completedToDoList
                    completedToDoList = completedToDoList.filter(item => item !== checkedToDo); //keep all items 'as long as' != toDoObject
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                }
            } else {
                const checkedToDo = category2[index];
                if (checkbox.checked) {
                    completedToDoList.push(checkedToDo);
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                    removeToDo(index, 'category2');
                } else {
                    //remove it from completedToDoList
                    completedToDoList = completedToDoList.filter(item => item !== checkedToDo); //keep all items 'as long as' != toDoObject
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                }
            }

            displayCompletedToDos();
        })
    })
    createCategories();
}

function displayCompletedToDos() {
    completedToDoList = completedToDoList.filter(item => item && item.name);
    // add completedToDos to html
    const completedToDoElement = document.querySelector(".completedToDoList");
    completedToDoElement.innerHTML =""; //remove previous instance of completedToDoList display
    for (let i=0; i<completedToDoList.length; i++) {
        const name = completedToDoList[i].name;
        const date = completedToDoList[i].dueDate;

        completedToDoElement.innerHTML +=
        `<li class="completedToDoItem">
            ✅ ${name} <button class="removeCompletedToDo" onclick="removeCompletedToDo(${i})">❌</button>
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

function editToDo(index, category) {
    if(category === 'category1') {
        const label = document.querySelector(`#label1${index}`);
        const currentText = label.textContent.trim(); //preserves current text
        // Replace label content with input + save button
        label.innerHTML = `
        <input type="text" id="editInput${index}" value="${currentText}">
        <button onclick="saveToDo(${index}, '${category}')">Save</button>
        `; //onclick leaves function and disappears input text and button
    } else {
        const label = document.querySelector(`#label2${index}`);
        const currentText = label.textContent.trim(); //preserves current text
        // Replace label content with input + save button
        label.innerHTML = `
        <input type="text" id="editInput${index}" value="${currentText}">
        <button onclick="saveToDo(${index}, '${category}')">Save</button>
        `; //onclick leaves function and disappears input text and button
    }

    
}

function saveToDo(index, category) {
    const input = document.querySelector(`#editInput${index}`);
    if (category === 'category1') {
        category1[index].name = input.value; //edit array with new changes
        localStorage.setItem("category1", JSON.stringify(category1));
    } else {
        category2[index].name = input.value; //edit array with new changes
        localStorage.setItem("category2", JSON.stringify(category2));
    }
    displayToDos(); //show updated state
}
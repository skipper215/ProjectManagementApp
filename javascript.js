
const categories = JSON.parse(localStorage.getItem("categories")) || {General:[]};; //an object of object arrays -> "Work": []

let completedToDoList = JSON.parse(localStorage.getItem("completedToDoList")) || []; 

window.onload = () => {
    renderCategories(),
    displayCompletedToDos();
}


function addCategory(categoryName) {
    if(categoryName != categories[categoryName]) { //category does not exist, add
        categories[categoryName] = []; // creates new key:value pair 
        localStorage.setItem("categories", JSON.stringify(categories));
        console.log(categories);
    } else {
        console.log("category exists already!");
    }
    renderCategories();
}

function renderCategories() {
    
    const categoryCtnElem = document.querySelector(".category-container");
    categoryCtnElem.innerHTML = ""; // refresh prev display

    // loop through all categories 
    for (let categoryName in categories) {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("sortable-container");
        categoryElement.id = categoryName;

        const categoryTitle = document.createElement("h2");
        categoryTitle.textContent = categoryName;

        const todoListElement = document.createElement("ul");
        todoListElement.classList.add("todos");

        categoryElement.appendChild(categoryTitle);
        categoryElement.appendChild(todoListElement);

        categoryCtnElem.appendChild(categoryElement);

//        `<li class='toDoItem'>
//             <div class="left-content">
//                 <input class= 'checkbox-todo' type='checkbox' data-index=${i} id="toDoLabel${i}"> 
//                 <label for="toDoLabel${i}" id="label${i}">${name}</label>
//                 <p class="dueDate">${date}<p>


        // Add to-do items for this category
        categories[categoryName].forEach((item, index) => {
            const li = document.createElement("li");
            li.classList.add("toDoItem");
            li.innerHTML += 
            `<div class="left-content">
                <input class= 'checkbox-todo' type='checkbox' data-id="${item.id}" data-category="${categoryName}" ${item.completed ? "checked" : ""}> 
                <label for="toDoLabel${index}" id="label${index}">${item.name}</label>
                <p class="dueDate">${item.dueDate}<p>
            </div>
            <div class="right-content">
                <button class='editToDo'>Edit</button>
                <button onclick="removeToDo('${categoryName}', '${item.id}')" class='removeToDo'>🗑️</button> 
            </div>
            `
            
            li.setAttribute("data-index", index); // Store the index as a data attribute
            todoListElement.appendChild(li);
        });
        console.log(categories);
        localStorage.setItem("categories", JSON.stringify(categories));
        console.log(categories)
        checkboxHandler(categoryName);
    }
    allowSort();
}

function checkboxHandler(category) {
    const checkboxes = document.querySelectorAll(".checkbox-todo");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                // find the toDo by id
                const toDoId = checkbox.dataset.id;
                const category = checkbox.dataset.category;
                const toDo = categories[category].find(t => t.id === toDoId); // find and grab toDo
                toDo.completed = true;
                const checkedToDo = toDo;

                if (checkbox.checked) {
                    completedToDoList.push(checkedToDo);
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                    
                    removeToDo(category, toDoId);
                } else {
                    //remove it from completedToDoList
                    completedToDoList = completedToDoList.filter(item => item !== checkedToDo); //keep all items 'as long as' != toDoObject
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
                }
                displayCompletedToDos();
            })
        })
}

function allowSort() {
    const categoryContainers = document.querySelectorAll(".sortable-container");

    // create sortable object for each category 
    categoryContainers.forEach(container => {
        new Sortable.create(container.querySelector(".todos"), {
            group:"todos",
            animation: 150,
            onEnd: function (event) {
                const fromCategory = event.from.id;
                const toCategory = event.to.parentElement.id;

                // Move the item from one category to another
                if (fromCategory !== toCategory) {
                    //moveItemBetweenCategories(fromCategory, toCategory, event.oldIndex, event.newIndex);
                    console.log("move between category");
                } else { // Move item within a category
                    //moveItemWithinCategory(fromCategory, event.oldInex);
                    console.log("move within category");
                }

                // Save the updated categories to localStorage

            }
        })
    })
}

// add every ToDo to the "General" Category
function addToDo() {
    const inputElement = document.querySelector(".js-input");
    const inputDateElement = document.querySelector(".js-date")
    // Date format to DD-MM-YYYY
    const [year, month, day] = inputDateElement.value.split('-');
    const formatDate = `${day}/${month}/${year}`

    if(inputElement.value && !inputDateElement.value) {
        categories["General"].push({
            id: crypto.randomUUID(),
            name: inputElement.value,
            dueDate: "",
            completed: false
        });
    }
    else if(inputElement.value && inputDateElement.value) {
        categories["General"].push({
            id: crypto.randomUUID(),
            name: inputElement.value,
            dueDate: formatDate,
            completed: false
        });
    }
        
    inputElement.value = ""; //clears search box
    localStorage.setItem("categories", JSON.stringify(categories));

    console.log(inputDateElement.value);
    console.log(inputElement.value);
    console.log(categories);


}

function removeToDo(category, itemId) {
    const targetCategory = categories[category];
    index = targetCategory.findIndex(item => item.id === itemId);
    targetCategory.splice(index, 1);
    localStorage.setItem("categories", JSON.stringify(categories)); //set new state of array
    renderCategories(); //re-display
}

function handleKeyDown(event) {
    if(event.key === 'Enter') {
        addToDo();
    }
}

function handleCategoryKeyDown(event) {
    if(event.key === 'Enter') {
        addCategory(event.target.value);
        event.target.value = "";
    }
}

// function displayToDos() {
//     const todoElement = document.querySelector(".todos")
//     todoElement.innerHTML = "";  // clear previous iteration of display
//     for (let i=0; i<toDoList.length; i++) {
//         const toDoObject = toDoList[i]
//         const name = toDoObject.name;
//         const date = toDoObject.dueDate;
//         todoElement.innerHTML += 
//         `<li class='toDoItem'>
//             <div class="left-content">
//                 <input class= 'checkbox-todo' type='checkbox' data-index=${i} id="toDoLabel${i}"> 
//                 <label for="toDoLabel${i}" id="label${i}">${name}</label>
//                 <p class="dueDate">${date}<p>
//             </div>
//             <div class="right-content">
//                 <button onclick="editToDo(${i})" class='editToDo'>Edit</button>
//                 <button onclick="removeToDo(${i})" class='removeToDo'>🗑️</button> 
//             </div>
//         </li>`;
//     }
//     // check checkboxes
//     const checkboxes = document.querySelectorAll(".checkbox-todo");
//     checkboxes.forEach((checkbox) => {
//         checkbox.addEventListener("change", () => {
//             const index = Number(checkbox.dataset.index);
//             const checkedToDo = toDoList[index];

//             if (checkbox.checked) {
//                 completedToDoList.push(checkedToDo);
//                 localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
//                 removeToDo(index);
//             } else {
//                 //remove it from completedToDoList
//                 completedToDoList = completedToDoList.filter(item => item !== checkedToDo); //keep all items 'as long as' != toDoObject
//                 localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList))
//             }
//             displayCompletedToDos();
//         })
//     })
//     sortingToDo();
// }

function displayCompletedToDos() {
    // add completedToDos to html
    const completedToDoElement = document.querySelector(".completedToDoList");
    completedToDoElement.innerHTML = ""; //remove previous instance of completedToDoList display
    for (let i=0; i<completedToDoList.length; i++) {
        const name = completedToDoList[i].name;

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

// function editToDo(index) {
//     const label = document.querySelector(`#label${index}`);
//     const currentText = label.textContent.trim(); //preserves current text
//     // Replace label content with input + save button
//     label.innerHTML = `
//     <input type="text" id="editInput${index}" value="${currentText}">
//     <button onclick="saveToDo(${index})">Save</button>
//     `; //onclick leaves function and disappears input text and button
// }

// function saveToDo(index) {
//     const input = document.querySelector(`#editInput${index}`);
//     toDoList[index].name = input.value; //edit array with new changes
//     localStorage.setItem("todos", JSON.stringify(toDoList));
//     displayToDos(); //show updated state
// }
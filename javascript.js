
const categories = JSON.parse(localStorage.getItem("categories")) || {General:[]};; //an object of object arrays -> "Work": []

let completedToDoList = JSON.parse(localStorage.getItem("completedToDoList")) || []; 

window.onload = () => {
    renderCategories(),
    displayCompletedToDos();
    // removeAllCategories();
    // removeAllCompletedToDo();
}

// for testing
function removeAllCategories() {
    for(let category in categories) {
        delete categories[category];
    }
    console.log(categories);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
}

function removeAllCompletedToDo() {
    completedToDoList.length = 0;
    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
    renderCategories();
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

function removeCategory(categoryName) {
    for(let category in categories) {
        if(categoryName === 'General') return;
        if(category === categoryName) {
            delete categories[categoryName];
            console.log("New array from deletion:" + categories);
        }
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

        const categoryRemove = document.createElement("div");
        if(categoryName != 'General') {
        categoryRemove.innerHTML += 
        `
        <button class="categoryRemove" onclick="removeCategory('${categoryName}')">Delete Category</button>
        `
        }


        const todoListElement = document.createElement("ul");
        todoListElement.classList.add("todos");

        categoryElement.appendChild(categoryTitle);
        categoryElement.appendChild(todoListElement);
        categoryTitle.appendChild(categoryRemove);
        categoryCtnElem.appendChild(categoryElement);

        // Add to-do items for this category
        categories[categoryName].forEach((item, index) => {
            const li = document.createElement("li");
            li.classList.add("toDoItem");
            li.innerHTML += 
            `<div class="left-content">
                <input class='checkbox-todo' type='checkbox' data-id="${item.id}" data-category="${categoryName}" ${item.completed ? "checked" : ""}> 
                <label class='toDoLabel' for="toDoLabel${item.id}" id="label${item.id}">${item.name}</label>
                <p class="dueDate">${item.dueDate}<p>
            </div>
            <div class="right-content">
                <button onclick="editToDo('${item.id}')" class='editToDo'>Edit</button>
                <button onclick="removeToDo('${categoryName}', '${item.id}')" class='removeToDo'>🗑️</button> 
            </div>
            `
            
            li.setAttribute("data-index", index); // Store the index as a data attribute
            todoListElement.appendChild(li);
        });
        localStorage.setItem("categories", JSON.stringify(categories));
        
    }
    checkboxHandler();
    allowSort();
}

function checkboxHandler() {
    const checkboxes = document.querySelectorAll(".checkbox-todo");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                // find the toDo by id
                const toDoId = checkbox.dataset.id;
                const category = checkbox.dataset.category;

                console.log(completedToDoList);
                const checkedToDo = categories[category].find(t => t.id === toDoId); 
                console.log(checkedToDo);
                checkedToDo.completed = true;

                if (checkbox.checked) { //a bug with checkedToDo object being null
                    removeToDo(category, toDoId);
                    completedToDoList.push(checkedToDo);
                    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
                    localStorage.setItem("categories", JSON.stringify(categories));
                    
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
                const fromCategory = event.from.parentElement.id;
                const toCategory = event.to.parentElement.id;

                // Move the item from one category to another
                if (fromCategory !== toCategory) {
                    console.log(categories);
                    moveItemBetweenCategories(fromCategory, toCategory, event.oldIndex, event.newIndex);
                    console.log("move between category");
                } else { // Move item within a category
                    moveItemWithinCategory(fromCategory, event.oldIndex, event.newIndex);
                    console.log("move within category");
                    console.log(categories);
                }

                // Save the updated categories to localStorage

            }
        })
    })
}

function moveItemBetweenCategories(fromCategory, toCategory, oldIndex, newIndex) {
    fromCategory = categories[fromCategory];
    toCategory = categories[toCategory];
    const movedItem = fromCategory.splice(oldIndex, 1)[0];
    //insert movedItem
    toCategory.splice(newIndex, 0, movedItem);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
}

function moveItemWithinCategory(fromCategory, oldIndex, newIndex) {
    const category = categories[fromCategory]
    const movedItem = category.splice(oldIndex, 1)[0];
    category.splice(newIndex,0,movedItem);
    localStorage.setItem("categories", JSON.stringify(categories));
    console.log(oldIndex + "moved to: " + newIndex)
    renderCategories();
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
        if(completedToDoList[i] === null) {
            completedToDoList.splice(i,1);
        }
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

function editToDo(itemId) {
    const label = document.querySelector(`#label${itemId}`);
    const currentText = label.textContent.trim(); //preserves current text
    // Replace label content with input + save button
    label.innerHTML = `
    <input type="text" id="editInput${itemId}" value="${currentText}">
    <button onclick="saveToDo('${itemId}')">Save</button>`; 
    //onclick leaves function and disappears input text and button
}

function saveToDo(itemId) {
    const input = document.querySelector(`#editInput${itemId}`);
    //find item 
    for(let categoryName in categories) {
        const category = categories[categoryName]; 
        const validItem = category.find(item => item.id === itemId);
        if(validItem) {
            validItem.name = input.value;
            break;
        }
    }
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories(); 
}
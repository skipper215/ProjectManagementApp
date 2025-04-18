
const categories = JSON.parse(localStorage.getItem("categories")) || {General:[]};; //an object of object arrays -> "Work": []

let completedToDoList = JSON.parse(localStorage.getItem("completedToDoList")) || []; 

window.onload = () => {
    renderCategories(),
    displayCompletedToDos();
    renderTitle();
    // removeAllCategories();
    // removeAllCompletedToDo();
}

// Render todays date 
function renderTitle() {
    const now = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Australia/Sydney"
      };
    const formattedDate = now.toLocaleDateString("en-AU", options);
    document.querySelector(".title").innerHTML = `📝Project Scheduler <div class="todays-date">📆 ${formattedDate} </div>` ; 
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

function addCategoryFromInput() { //helper function for adding category using button
    const inputElement = document.querySelector(".js-add-category");
    if(inputElement.value != "") {addCategory(inputElement.value.trim());}
    inputElement.value = ""; //reset input bar
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

function removeCategory(buttonElement,categoryName) {

    for(let category in categories) {
        if(categoryName === 'General') continue;
        if(category === categoryName) {
            confirmRemoveCategory(buttonElement, categoryName);
        }
    }
}

function confirmRemoveCategory(buttonElement,categoryName) {
    const container = buttonElement.parentElement; // the button's respective ".category-remove"
    
    const prevContainerText = container.innerHTML; //save remove button 
    container.innerHTML = "";

    const input = document.createElement("input");
    input.className = "confirm-remove-input";
    input.placeholder = "type: 'remove' to confirm";

    const cancel = document.createElement("button");
    cancel.className = "cancel-remove";
    cancel.textContent = "Cancel";
    cancel.onclick = () => {container.innerHTML = prevContainerText;};

    // Add input and cancel button to container
    container.appendChild(input);
    container.appendChild(cancel);
    input.focus();

    // Handle input
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && input.value.trim() === "remove") {
            delete categories[categoryName];
            renderCategories();
        }
    });
}


function renderCategories() {
    
    const categoryCtnElem = document.querySelector(".category-container");
    categoryCtnElem.innerHTML = ""; // refresh prev display

    // loop through all categories 
    for (let categoryName in categories) {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("sortable-container");
        categoryElement.id = categoryName;
        
        const headingContainer = document.createElement("div");
        headingContainer.classList.add("heading-container");

        const categoryTitle = document.createElement("h2");
        categoryTitle.textContent = categoryName;

        const removeCategory = document.createElement("div");
        removeCategory.classList.add("category-remove");
        
        if(categoryName != 'General') {
        removeCategory.innerHTML += 
        `
        <button class="categoryRemove" onclick="removeCategory(this,'${categoryName}')">Delete Category</button>
        `
        }

        const todoListElement = document.createElement("ul");
        todoListElement.classList.add("todos");

        categoryCtnElem.appendChild(categoryElement);
        
        categoryElement.appendChild(headingContainer);
        categoryElement.appendChild(todoListElement);

        headingContainer.appendChild(categoryTitle);
        headingContainer.appendChild(removeCategory);

        // Add to-do items for this category
        categories[categoryName].forEach((item, index) => {
            const li = document.createElement("li");
            li.classList.add("toDoItem");
            // VISUAL STRUCTURE IN INNERHTML FORM
            // li.innerHTML += 
            //     `<div class="left-content">
            //         <input class='checkbox-todo' type='checkbox' data-id="${item.id}" data-category="${categoryName}" ${item.completed ? "checked" : ""}> 
            //         <label class='toDoLabel' for="toDoLabel${item.id}" id="label${item.id}">${item.name}</label>
            //     </div>
            //     `
            const leftContent = document.createElement("div");
            leftContent.classList.add("left-content");

            const checkbox = document.createElement("input");
            checkbox.classList.add("checkbox-todo");
            checkbox.type = "checkbox";
            checkbox.dataset.id = item.id;
            checkbox.dataset.category = categoryName;
            if (item.completed) checkbox.checked = true;

            const label = document.createElement("label");
            label.classList.add("toDoLabel");
            label.id = `label${item.id}`;
            label.htmlFor = `toDoLabel${item.id}`;
            label.textContent = item.name;

            leftContent.appendChild(checkbox);
            leftContent.appendChild(label);

            // if it has a due date
            if (item.dueDate != "") {
                // refresh new days left 
                item.daysLeft = daysLeft(item.dueDate);  

                const due = document.createElement("p");
                due.classList.add("dueDate");
                due.textContent = `📅${item.dueDate} ⏰${item.daysLeft} days left`;
                leftContent.appendChild(due);

                // different visuals for due dates 
                if(item.daysLeft < 0) {
                    li.classList.add("date-overdue");
                    due.textContent = `📅${item.dueDate} ⏰${item.daysLeft} days OVERDUE`;
                } else if (item.daysLeft > 0 && item.daysLeft < 3) {
                    li.classList.add("date-mid-priority");
                } else if (item.daysLeft === 0) {
                    li.classList.add("date-high-priority");
                    due.textContent = `📅${item.dueDate} ⏰ due TODAY`;
                }

            }
            li.appendChild(leftContent);
        
           // Add Right-Content - Edit and Remove Buttons
            li.innerHTML += 
            `
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
                const checkedToDo = categories[category].find(t => t.id === toDoId); 
                checkedToDo.completed = true;

                if (checkbox.checked) { 
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

function daysLeft(dueDate) {
    const oneDay = 1000 * 60 * 60 * 24; //number of milliseconds
    const today = new Date(); // new date object default set to todays date
    today.setHours(0, 0, 0, 0); // clear time for accuracy
    
    // dueDate is in DD/MM/YYYY format, convert it to YYYY-MM-DD
    const [day, month, year] = dueDate.split('/');
    const due = new Date(`${year}-${month}-${day}`); //date object takes in YYYY-MM-DD

    const diffTime = due - today; // difference in milliseconds
    const diffDays = Math.floor(diffTime / oneDay)

    return diffDays;
}

// adds every ToDo from user-input to the "General" Category
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
            daysLeft: "", 
            completed: false
        });
    }
    else if(inputElement.value && inputDateElement.value) {
        categories["General"].push({
            id: crypto.randomUUID(),
            name: inputElement.value,
            dueDate: formatDate,
            daysLeft: daysLeft(inputDateElement.value), //YYYY/MM/DD
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

function displayCompletedToDos() {
    // add completedToDos to html
    const completedToDoElement = document.querySelector(".completedToDoList");
    completedToDoElement.innerHTML = ""; //remove previous instance of completedToDoList display

    for (let i=0; i<completedToDoList.length; i++) {
        if(completedToDoList[i] === null) {
            completedToDoList.splice(i,1);
        }
        localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
        const name = completedToDoList[i].name;
        const id = completedToDoList[i].id;

        completedToDoElement.innerHTML +=
        `
        <li class="completedToDoItem">
            <div class="completed-left-content">
            <p>✅ ${name} </p>
            </div>
            <div>
                <button class="returnCompletedToDo" onclick="returnCompletedToDo(${i})">🔁</button>
                <button class="removeCompletedToDo" onclick="removeCompletedToDo(${i})">❌</button>
            </div>
        </li>
        `
        if(completedToDoList[i].dueDate != "") {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = String(now.getFullYear());
            const formatDate = `${day}/${month}/${year}`;

            const leftContentElem = document.querySelectorAll(".completed-left-content"); //querySelectorAll returns an nodeList/array of classes. 
            const latestLeftContentElem = leftContentElem[leftContentElem.length - 1]; //get the latest class element (appended to nodeList)

            latestLeftContentElem.innerHTML += `<p>📝 Completed On: ${formatDate}</p>`;
        }
    }
    

}

function returnCompletedToDo(index) {
    // remove from array using index and splice
    // put into categories['General'] 
    const movedItem = completedToDoList.splice(index, 1)[0];
    movedItem.completed = false;
    categories['General'].push(movedItem);
    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
    renderCategories();
    displayCompletedToDos();
}

function removeCompletedToDo(index) {
    //remove from completeToDoList array
    completedToDoList.splice(index, 1);
    localStorage.setItem("completedToDoList", JSON.stringify(completedToDoList));
    displayCompletedToDos();
}

function editToDo(itemId) {
    const label = document.querySelector(`#label${itemId}`);
    
    // Check if it's already in editing mode (if input exists)
    const existingInput = label.querySelector('input');
    if (existingInput) {
        return; // If input already exists, don't do anything
    }

    const currentText = label.textContent.trim(); // Preserve current text
    
    // Create input element and save button dynamically
    const input = document.createElement('input');
    input.type = "text";
    input.id = `editInput${itemId}`;
    input.value = currentText;

    const saveButton = document.createElement('button');
    saveButton.textContent = "Save";
    saveButton.onclick = function () { saveToDo(itemId); }; // Attach event listener
    
    // Replace label content with input + save button
    label.innerHTML = ''; // Clear current label content
    label.appendChild(input);
    label.appendChild(saveButton);

}

function saveToDo(itemId) {
    const input = document.querySelector(`#editInput${itemId}`);
    //find item 
    for(let categoryName in categories) {
        const category = categories[categoryName]; 
        const validItem = category.find(item => item.id === itemId);
        if(validItem) {
            validItem.name = input.value;
            console.log(input.value);
            break;
        }
    }
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories(); 
}
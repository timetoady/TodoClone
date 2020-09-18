//inital data array. DO NOT EDIT OR REMOVE - Use these as the inital app state.
//This is the kind of data you would traditionally get from a data base.
//For now we are just going to mock it.
let initalTodos = [
  { id: 1, todo: "Buy milk.", complete: false, category: "Grocery" },
  { id: 2, todo: "Clean the cat box.", complete: false, category: "House" },
  { id: 3, todo: "Chips and salsa.", complete: false, category: "Grocery" },
  {
    id: 4,
    todo: "Finish Homework for DGM 3760",
    complete: false,
    category: "School",
  },
];

//Remaining things to solve

//Show hide button actually reflecting in DOM
//Dynamically add categories that stay added to drop down box
//Stop error of repeat ads overlapping, either by stopping second add or adding duplicate entry below category

let refreshDOM = () => {
  let oldDiv = document.querySelector("#listContainer");
  oldDiv.remove();
  DOMbuilder();
};

let addObjToLocal = (obj) => {
  localStorage.setItem(obj.id, JSON.stringify(obj));
  //refreshDOM();
};

//Set initial tools to storage
let catReset = document.querySelector("#reset");
catReset.addEventListener("click", () => {
  initalTodos.forEach((obj) => {
    addObjToLocal(obj);
    location.reload()
  });
});

//Functions to get info from storage for display
let getInfoById = (id) => {
  let theItem = JSON.parse(localStorage.getItem(id));
  return theItem;
};

let getAllStorageInfo = () => {
  infoArray = [];
  for (key in localStorage) {
    // console.log(key)
    infoArray.push(getInfoById(key));
  }

  return infoArray;
};

//Functions to remove and update localStorage
let removeInfoById = (id) => {
  localStorage.removeItem(id);
};

//Function to change info requires the ID, the key to be changed, and the value that will be changed
let changeInfoByID = (id, infoKey, value) => {
  let objToChange = getInfoById(id);
  console.log(`changInfoByID is changing the following object`);
  console.log(getInfoById(id));
  for (const aKey in objToChange) {
    console.log(`Key to change is '${infoKey}'`);
    if (infoKey === aKey) {
      console.log(`${infoKey} matches ${aKey}`);
      objToChange[infoKey] = value;
      //console.log(objToChange);
    } else console.log(`${infoKey} does not match ${aKey}`);
  }
  localStorage.setItem(id, JSON.stringify(objToChange));
  console.log(getInfoById(id));
};

//Get info from all needed parts
const showHide = document.querySelector("#showHide");
const addButton = document.querySelector("#addButton");
const newToDo = document.querySelector("#newToDo");
const theOutput = document.querySelector("#output");

//Hide/show listener. Not working yet!
showHide.addEventListener("click", () => {
  alert('Oops, sorry, not working yet. :D')
  console.log("!!!!!!!Show/Hide Clicked!");
  let isStrike = document.querySelectorAll(".striked");
  isStrike.forEach((node) => {
    console.log(node.parentElement.id);
    let elementToHide = document.querySelector(`#${node.parentElement.id}`);
    if (node.classList.contains("striked")) {
      console.log(node);
      console.log(`This node is striked! Hiding parent:`);
      console.log(elementToHide);
      elementToHide.setAttribute("class", "hidden");
      refreshDOM();
    } else {
      elementToHide.setAttribute("class", "shown");
      refreshDOM();
    }
  });
});

let categoryDrop = document.querySelector("#category");

let getCategoryValue = () => {
  categoryDrop.addEventListener("change", () => {
    console.log(categoryDrop.value);
  });
  return categoryDrop.value;
};

newToDo.addEventListener("keyup", (event) =>
  event.keyCode === 13 ? constructObject(newToDo.value) : null
);
addButton.addEventListener("click", () => constructObject(newToDo.value));

console.log(Object.values(localStorage));

let constructObject = (newVal) => {
  console.log(newVal);
  let catVal = getCategoryValue();
  console.log(catVal);
  newTodoObj = {};
  newTodoObj["id"] = Math.floor(Math.random() * 9999) + 4;
  newTodoObj["todo"] = newVal;
  newTodoObj["complete"] = false;
  newTodoObj["category"] = catVal;
  console.log(`Construct object says this is the new todo ${newTodoObj.todo}`);
  if (newVal === "" || newVal === " ") {
    alert("Todo is empty. Please add todo item.");
  } else if (Object.values(localStorage).includes(`'${newVal}'`)) {
    alert("Todo is already on the list.");
  } else {
    addObjToLocal(newTodoObj);
  }
};

// let strikeIt = (boxID) => {}; This will change the class of any with complete category true to strikeout

let filterToDOM = () => {
  allLocal = getAllStorageInfo();
  console.log(allLocal);
  categoryByObj = {};
  noNulls = allLocal.filter((object) => object !== null);
  noNulls.forEach((object) => {
    console.log(object.category);
    catDisplay = object.category;
    todoForList = object.todo;
    isComplete = object.complete;
    todoID = object.id;
    console.log("Checking for duplicate here...");
    if (catDisplay in categoryByObj) {
      categoryByObj[catDisplay]["todo"][todoForList] = {};
      categoryByObj[catDisplay]["todo"][todoForList]["complete"] = isComplete;
      categoryByObj[catDisplay]["todo"][todoForList]["id"] = todoID;
      console.log(categoryByObj);
    } else {
      categoryByObj[catDisplay] = {};
      categoryByObj[catDisplay]["todo"] = {};
      categoryByObj[catDisplay]["todo"][todoForList] = {};
      categoryByObj[catDisplay]["todo"][todoForList]["complete"] = isComplete;
      categoryByObj[catDisplay]["todo"][todoForList]["id"] = todoID;
      //   console.log("It had the category")
    }
  });
  return categoryByObj;
};

filterToDOM();

//A function to get info created by the nested filter above
function getNested(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

//The main function that shows filtered info on the DOM
let DOMbuilder = () => {
  console.log("DOMbuilder start!");
  filteredData = filterToDOM();
  containerExists = document.querySelector("#listContainer");
  if (containerExists === null) {
    containDiv = document.createElement("div");
    containDiv.setAttribute("id", "listContainer");
  } else {
    containerExists.remove();
    console.log("Removed old container");
    containDiv = document.createElement("div");
    containDiv.setAttribute("id", "listContainer");
  }
  theOutput.appendChild(containDiv);
  for (category in filteredData) {
    categoryUL = document.createElement("ul");
    categoryUL.textContent = category;
    containDiv.appendChild(categoryUL);
    containedTodos = getNested(() => filteredData[category]["todo"]);
    for (todo in containedTodos) {
      todoStates = getNested(() => filteredData[category]["todo"][todo]);
      todoDiv = document.createElement("div");
      todoLI = document.createElement("p");
      todoLI.textContent = todo;
      todoDiv.setAttribute("id", `div${todoStates.id}`);
      categoryUL.appendChild(todoDiv);
      let label = document.createElement("label");
      label.textContent = todo;
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${todoStates.id}`;
      label.setAttribute("id", `li${checkbox.id}`);
      categoryUL.setAttribute("id", `ul${checkbox.id}`);
      checkbox.value == `${todoStates.id}`;
      if (todoStates.complete === true) {
        label.setAttribute("class", "striked");
        checkbox.checked = true;
      } else {
        label.setAttribute("class", "nostrike");
        checkbox.checked = false;
      }
      let removeIt = document.createElement("button");
      removeIt.textContent = "✕";
      removeIt.addEventListener("click", () => {
        removeInfoById(checkbox.id);
        refreshDOM();
      });
      todoDiv.appendChild(checkbox);
      todoDiv.appendChild(label);
      todoDiv.appendChild(removeIt);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          console.log(`Checkbox ${checkbox.id} is checked`);
          changeInfoByID(checkbox.id, "complete", true);
          refreshDOM();
        } else if (checkbox.checked === false) {
          console.log(`Checkbox ${checkbox.id} is unchecked`);
          changeInfoByID(checkbox.id, "complete", false);
          refreshDOM();
        }
      });
    }
  }
  console.log("DOMbuilder completed.");
};

DOMbuilder();

//drop down box that sets category from category field and has "Add New" option, which adds a new cat

//Toggle button that switches between hiding and showing

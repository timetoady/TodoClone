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
//Things left: remove category method, new auto todo pop in same category, cleanup  code




let catDiv = document.querySelector("#catDiv")
let catGetter = () => {
  containerExists = document.querySelector("#category");
  if (containerExists === null) {
    categoryDrop = document.createElement("select");
    categoryDrop.setAttribute("id", "category");
    catDiv.appendChild(categoryDrop)
  } else {
    containerExists.remove();
    console.log("Removed old container");
    categoryDrop = document.createElement("select");
    categoryDrop.setAttribute("id", "category");
  }
  local = getAllStorageInfo()
catDiv.appendChild(categoryDrop)
  let categories = local.map(object => object.category)
  let noDuplicates = [...new Set(categories)]
  noDuplicates.forEach(category => {
    let catOption = document.createElement('option')
    catOption.value = category
    catOption.textContent = category
    currentID = Math.floor(Math.random() * 999999) + 4
    catOption.id = `catOpt${currentID}`;
    categoryDrop.appendChild(catOption)
    // let removeIt = document.createElement("button");
    //   removeIt.textContent = "✕";
    //   removeIt.addEventListener("click", () => {
    //     removeInfoById(currentID);
    //     refreshDOM();
    //   });
    //   catDiv.appendChild(removeIt)
       //Function to update categories dynamically
categoryDrop.addEventListener("change", () => {
  if(categoryDrop.value === 'new') {
    newCat = prompt('Add a new category')
    autoConstruct(newCat, '', currentID)
    catGetter();
    refreshDOM()
  };
});
  })
  let newCatAdd = document.createElement('option')
  newCatAdd.setAttribute('id', "newCat")
  newCatAdd.value = "new"
  newCatAdd.textContent = "Add new category..."
  categoryDrop.appendChild(newCatAdd)

 
}
//Remaining things to solve

//Stop error of repeat adds overlapping, either by stopping second add or adding duplicate entry below category
//Load standard data just the first time
//Make categories removable
//Do get cateogry info in popup instead of a prompt
//Optional: fix new item appear so it has the right category, and appears directly below where you are typing

let refreshDOM = () => {
  let oldDiv = document.querySelector("#listContainer");
  oldDiv.remove();
  DOMbuilder();
};

let addObjToLocal = (obj) => {
  localStorage.setItem(obj.id, JSON.stringify(obj));
  //refreshDOM();
};

let main = document.querySelector('main')

main.addEventListener("load", () => {
  if (localStorage.get(1) === null)
  localStorage.clear();
  initalTodos.forEach((obj) => {
    addObjToLocal(obj);
    location.reload();
  }, {once:true})
});

//Set initial tools to storage
let catReset = document.querySelector("#reset");
catReset.addEventListener("click", () => {
  localStorage.clear();
  initalTodos.forEach((obj) => {
    addObjToLocal(obj);
    location.reload();
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
  noNulls = infoArray.filter((object) => object !== null);
  return noNulls;
};

catGetter()

let getIDByTodo = (getTodo) => {
  storageInfo = getAllStorageInfo();
  noNulls = storageInfo.filter((object) => object !== null);
  noNulls.forEach((obj) => {
    if (obj.todo === getTodo) {
      console.log(obj.id);
      return obj.id;
    }
  });
};

let getCatByID = (ID) => {
  storageInfo = getAllStorageInfo();
  noNulls = storageInfo.filter((object) => object !== null);
  noNulls.forEach((obj) => {
    if (obj.id === ID) {
      console.log(obj.category);
      return obj.category;
    }
  });
};

//Function called up to consturct object with category and todo value, giving a random ID
let autoConstruct = (inheretCat, newVal, id = (Math.floor(Math.random() * 999999) + 4)) => {
  console.log(inheretCat);
  newTodoObj = {};
  newTodoObj["id"] = id
  newTodoObj["todo"] = newVal;
  newTodoObj["complete"] = false;
  newTodoObj["category"] = inheretCat;
  addObjToLocal(newTodoObj);
  return newTodoObj.id;
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

//Listener for hide complete
showHide.addEventListener("click", () => {
  if (showHide.value === "hide") {
    showHide.value = "show";
    showHide.textContent = "HIDE COMPLETE";
    refreshDOM()
  } else {
    showHide.value = "hide";
    showHide.textContent = "SHOW ALL";
    refreshDOM()
  }
});



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


let constructObject = (newVal) => {
  console.log(newVal);
  let catVal = getCategoryValue();
  console.log(catVal);
  newTodoObj = {};
  newTodoObj["id"] = Math.floor(Math.random() * 999999) + 4;
  newTodoObj["todo"] = newVal;
  newTodoObj["complete"] = false;
  newTodoObj["category"] = catVal;
  console.log(`Construct object says this is the new todo ${newTodoObj.todo}`);
  // if (newVal === "" || newVal === " ") {
  //   alert("Todo is empty. Please add todo item.");
  // } else {
  addObjToLocal(newTodoObj);
};


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
      console.log(`Here are the todo states`)
      todoDiv = document.createElement("div");
      todoDiv.setAttribute("id", `div${todoStates.id}`);
      categoryUL.appendChild(todoDiv);
      let todoInput = document.createElement("input");
      resizable(todoInput, 10);
      todoInput.value = todo;
      todoInput.placeholder = "List item";
      todoInput.name = todoStates.category
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${todoStates.id}`;
      todoInput.addEventListener("input", () => {
        changeInfoByID(checkbox.id, "todo", todoInput.value);
      });

      //Experimental auto add new entry box
      todoInput.addEventListener("input", () => {
        let newDiv = document.createElement("div");
        let newInput = document.createElement("input");
        let newCheck = document.createElement('input')
        newCheck.type = 'checkbox'
        newCheck.id = Math.floor(Math.random() * 999999) + 4;
        let newX = document.createElement("button");
        newX.textContent = "✕";
        //flabby
        newX.addEventListener("click", () => {
          removeInfoById(newCheck.id);
          refreshDOM();
        });
        newInput.setAttribute("id", `li${newCheck.id}`);
        newInput.setAttribute("class", `nostrike`);
        newInput.addEventListener("blur", () => {
          autoConstruct(todoInput.name, newInput.value);
        });
        categoryUL.appendChild(newDiv);
        newDiv.appendChild(newCheck);
        newDiv.appendChild(newInput);
        newDiv.appendChild(newX);
   
      }, {once:true})


      todoInput.setAttribute("id", `li${checkbox.id}`);
      categoryUL.setAttribute("id", `ul${checkbox.id}`);
      checkbox.value == `${todoStates.id}`;
      //Hides completed items
      if (todoStates.complete === true) {
        todoInput.setAttribute("class", "striked");
        checkbox.checked = true;
        showHide.value === 'hide' ? todoDiv.setAttribute("class", "hidden") : todoDiv.setAttribute("class", "show")
      } else {
        todoInput.setAttribute("class", "nostrike");
        checkbox.checked = false;
      }
      let removeIt = document.createElement("button");
      removeIt.textContent = "✕";
      removeIt.addEventListener("click", () => {
        removeInfoById(checkbox.id);
        refreshDOM();
      });
      todoDiv.appendChild(checkbox);
      todoDiv.appendChild(todoInput);
      todoDiv.appendChild(removeIt);
      //Strikes completed items by checkbox ID
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

function resizable(el, factor) {
  var int = Number(factor) || 7.7;
  function resize() {
    el.style.width = (el.value.length + 1) * int + "px";
  }
  var e = "keyup,keypress,focus,blur,change".split(",");
  for (var i in e) el.addEventListener(e[i], resize, false);
  resize();
}

//drop down box that sets category from category field and has "Add New" option, which adds a new cat

//Toggle button that switches between hiding and showing

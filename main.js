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

//Remaining issues to solve

//Bugs to fix
//Stop error of repeat added todos overlapping, either by stopping second add or adding duplicate entry below category
//View switches from Show all to Hide Complete when Add new is triggered. Must stay instead.

//Features to update
//Get cateogry info in popup instead of a prompt

//Main function that gets categories from localStorage and populates them in DOM with attributes.
let catDiv = document.querySelector("#catDiv");
let catGetter = () => {
  containerExists = document.querySelector("#category");
  if (containerExists === null) {
    categoryDrop = document.createElement("select");
    categoryDrop.setAttribute("id", "category");
    catDiv.appendChild(categoryDrop);
  } else {
    containerExists.remove();
    console.log("Removed old container");
    categoryDrop = document.createElement("select");
    categoryDrop.setAttribute("id", "category");
  }
  local = getAllStorageInfo();
  catDiv.appendChild(categoryDrop);
  let categories = local.map((object) => object.category);
  let noDuplicates = [...new Set(categories)];
  noDuplicates.forEach((category) => {
    let catOption = document.createElement("option");
    catOption.value = category;
    catOption.textContent = category;
    currentID = Math.floor(Math.random() * 999999) + 4;
    catOption.id = `catOpt${currentID}`;
    categoryDrop.appendChild(catOption);
  });
  //Here, after the categoreis populated by the localStorage, automaticaly adds a blank &
  //new category adding option.
  let addBlankCat = document.createElement("option");
  addBlankCat.setAttribute("id", "blankCat");
  addBlankCat.value = "";
  addBlankCat.textContent = "";
  let newCatAdd = document.createElement("option");
  newCatAdd.setAttribute("id", "newCat");
  newCatAdd.value = "new";
  newCatAdd.textContent = "Add new category...";
  categoryDrop.appendChild(addBlankCat);
  categoryDrop.appendChild(newCatAdd);
  categoryDrop.addEventListener("change", () => {
    if (categoryDrop.value === "new") {
      newCat = prompt("Add a new category");
      let newCon = autoConstruct(newCat, "");
      catGetter();
      refreshDOM();
      document.querySelector(`#input${newCon}`).focus();
    }
  });
};

//Small function that refreshes the DOM rendering as needed. Really wish I had a cleaner way.
let refreshDOM = () => {
  let oldDiv = document.querySelector("#listContainer");
  oldDiv.remove();
  DOMbuilder();
};

//Commits recieved object to local storage.
let addObjToLocal = (obj) => {
  //Here need check for duplicates
  //let currStorage = getAllStorageInfo()
  localStorage.setItem(obj.id, JSON.stringify(obj));
};

let main = document.querySelector("main");

main.addEventListener("load", () => {
  if (localStorage.get(1) === null) localStorage.clear();
  initalTodos.forEach(
    (obj) => {
      addObjToLocal(obj);
      location.reload();
    },
    { once: true }
  );
});

//Set initial todos to storage manually
let catReset = document.querySelector("#reset");
catReset.addEventListener("click", () => {
  localStorage.clear();
  resetCats();
});

let resetCats = () => {
  initalTodos.forEach((obj) => {
    addObjToLocal(obj);
    location.reload();
  });
};

const checkStorage = () => {
  storage = getAllStorageInfo();
  storage.length === 0 ? resetCats() : null;
};

//Functions to get info from storage for display
let getInfoById = (id) => {
  let theItem = JSON.parse(localStorage.getItem(id));
  return theItem;
};

//Checks contents of current local storage, putes them in array of objects, filtering out nulls
let getAllStorageInfo = () => {
  infoArray = [];
  for (key in localStorage) {
    // console.log(key)
    infoArray.push(getInfoById(key));
  }
  noNulls = infoArray.filter((object) => object !== null);
  return noNulls;
};
checkStorage();
catGetter();

//Gets the ID of an object in local storage by it's todo value
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

//Gets the category of an object in local storage by it's id
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
//by default unless ID is specified
let autoConstruct = (
  inheretCat,
  newVal,
  id = Math.floor(Math.random() * 999999) + 4
) => {
  console.log(`Category to construct for: ${inheretCat}`);
  newTodoObj = {};
  newTodoObj["id"] = id;
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

//Get info from needed parts by selecting hardcoded parts of DOM
const showHide = document.querySelector("#showHide");
showHide.textContent = "HIDE COMPLETE";
const addButton = document.querySelector("#addButton");
const newToDo = document.querySelector("#newToDo");
const theOutput = document.querySelector("#output");

//Listener for hide complete
showHide.addEventListener("click", () => {
  showStateSet();
});

let getCategoryValue = () => {
  categoryDrop.addEventListener("change", () => {
    console.log(categoryDrop.value);
  });
  return categoryDrop.value;
};

const removeDuplicates = (list) => {
  todoArray = []
  todos = list.forEach(object => {
    console.log(object.todo)
    todoArray.push(object.todo)
  })
   console.log("Here are the todos in array") 
  findDups = todoArray.reduce((acc, currentValue, index, array) => {
    if(array.indexOf(currentValue)!=index && !acc.includes(currentValue)) {
      acc.push(getIDByTodo(currentValue));
    }
    //console.log(acc)
    return acc;
  }, []);
  //fanny
  findDups.forEach(duplicateID =>{
    console.log(duplicateID)
    while (findDups.length > 1) {
      removeInfoById(duplicate)
      findDups.pop()
    }
  })
}



//Primary filter to make localStorage more parsable to put into the DOM. Passes to DOMbuilder.
let filterToDOM = () => {
  removeDuplicates(getAllStorageInfo().filter((object) => object !== null))
  allLocal = getAllStorageInfo();
  noNulls = allLocal.filter((object) => object !== null);
  console.log(allLocal);
  categoryByObj = {};
  
  noNulls.forEach((object) => {
    
    console.log(object.category);
    catDisplay = object.category;
    todoForList = object.todo;
    isComplete = object.complete;
    todoID = object.id;
    if (catDisplay in categoryByObj) {
      categoryByObj[catDisplay]["todo"][todoForList] = {};
      categoryByObj[catDisplay]["todo"][todoForList]["complete"] = isComplete;
      categoryByObj[catDisplay]["todo"][todoForList]["id"] = todoID;
      console.log(categoryByObj);
      containedTodos = getNested(() => noNulls[category]["todo"]);
    } else {
      categoryByObj[catDisplay] = {};
      categoryByObj[catDisplay]["todo"] = {};
      categoryByObj[catDisplay]["todo"][todoForList] = {};
      categoryByObj[catDisplay]["todo"][todoForList]["complete"] = isComplete;
      categoryByObj[catDisplay]["todo"][todoForList]["id"] = todoID;
    }
  });
  return categoryByObj;
};

// filterToDOM();

//A function to get info created by the nested filter above
function getNested(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

const showStateSet = () => {
  if (showHide.value === "hide") {
    showHide.value = "show";
    showHide.textContent = "HIDE COMPLETE";
    refreshDOM();
  } else {
    showHide.value = "hide";
    showHide.textContent = "SHOW ALL";
    refreshDOM();
  }
};

newToDo.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    autoConstruct(getCategoryValue(), newToDo.value);
    showStateSet();
  }
});

addButton.addEventListener("click", () => {
  autoConstruct(getCategoryValue(), newToDo.value);
  showStateSet();
});

//The main function that shows filtered info on the DOM
let DOMbuilder = () => {
  console.log("DOMbuilder start!");

  filteredData = filterToDOM();
  console.log("Heres the filtered data");
  console.log(filteredData);
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
      todoDiv.setAttribute("id", `div${todoStates.id}`);
      categoryUL.appendChild(todoDiv);
      let todoInput = document.createElement("input");
      resizable(todoInput, 10);
      todoInput.value = todo;
      todoInput.placeholder = "List item";
      todoInput.name = todoStates.category;
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${todoStates.id}`;
      todoInput.addEventListener("input", () => {
        changeInfoByID(checkbox.id, "todo", todoInput.value);
      });

      //Experimental auto add new entry box
      // todoInput.addEventListener(
      //   "input",
      //   () => {
      //     let newDiv = document.createElement("div");
      //     let newInput = document.createElement("input");
      //     let newCheck = document.createElement("input");
      //     newCheck.type = "checkbox";
      //     newCheck.id = Math.floor(Math.random() * 999999) + 4;
      //     let newX = document.createElement("button");
      //     newX.textContent = "✕";
      //     //flabby
      //     newX.addEventListener("click", () => {
      //       removeInfoById(newCheck.id);
      //       refreshDOM();
      //     });
      //     newInput.setAttribute("id", newCheck.id);
      //     newInput.setAttribute("class", `nostrike`);
      //     newInput.addEventListener("blur", () => {
      //     autoConstruct("", newInput.value, `input${newCheck.id}`);
      //      });
      //     categoryUL.appendChild(newDiv);
      //     newDiv.appendChild(newCheck);
      //     newDiv.appendChild(newInput);
      //     newDiv.appendChild(newX);
      //   },
      //   { once: true }
      // );

      todoInput.setAttribute("id", `input${checkbox.id}`);
      categoryUL.setAttribute("id", `ul${checkbox.id}`);
      checkbox.value == `${todoStates.id}`;
      //Hides completed items
      if (todoStates.complete === true) {
        todoInput.setAttribute("class", "striked");
        checkbox.checked = true;
        showHide.value === "hide"
          ? todoDiv.setAttribute("class", "hidden")
          : todoDiv.setAttribute("class", "show");
      } else {
        todoInput.setAttribute("class", "nostrike");
        checkbox.checked = false;
      }
      let removeIt = document.createElement("button");
      removeIt.textContent = "✕";
      removeIt.addEventListener("click", () => {
        removeInfoById(checkbox.id);
        refreshDOM();
        catGetter();
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

const toDoInputs = document.querySelector(".inputs");
const alertMassage = document.getElementById("alert-massage");
const tableBody = document.getElementById("table-body");
const DeleteAll = document.getElementById("delete-button");
const editButton = document.getElementById("edit-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (massage, type) => {
  alertMassage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = massage;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMassage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 3000);
};

const setTheTable = (data) => {
  //agar voroodi dasht oon biad age na hamoon todos
  const todoList = data ? data : todos;

  tableBody.innerHTML = "";
  if (!todoList.length) {
    tableBody.innerHTML = "<tr><td colspan='4'>No TASK found!</td></tr>";
    return;
  }
  todoList.forEach((todo) => {
    tableBody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date || "No Date"}</td>
      <td>${todo.completed ? "Completed" : "Pending"}</td>
      <td>
        <button onclick="editHandler('${todo.id}')">Edit</button>
        <button onclick="toggleHandler('${todo.id}')">
        ${todo.completed ? "Undo" : "Do"}
        </button>
        <button onclick="deleteHandler('${todo.id}')">Delete</button>
      </td>
    </tr>
    `;
  });
};

const addHandler = (event) => {
  const task = event.target.parentElement.children[0].value;
  const date = event.target.parentElement.children[1].value;
  const todo = {
    id: generateId(),
    //task: task,
    task, //ba in kar miad motagheyeri ba hamin esm ro be onvan value mizare
    // date: date,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    setTheTable();
    //bara reset kardan input haa
    event.target.parentElement.children[0].value = "";
    event.target.parentElement.children[1].value = "";
    //success massage
    showAlert("Successfully Added", "success");
  } else {
    // warning massage
    showAlert("You should enter the TASK!", "warning");
  }
};

const DeleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    setTheTable();
    showAlert("All Todos cleared successfully!", "success");
  } else showAlert("No Todos to clear!", "warning");
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  setTheTable();
  showAlert("Todo deleted successfully!", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  setTheTable();
  showAlert("Todo status changed successfully!", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  toDoInputs.children[0].value = todo.task;
  toDoInputs.children[1].value = todo.date;
  toDoInputs.children[2].style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const addEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = toDoInputs.children[0].value;
  todo.date = toDoInputs.children[1].value;
  toDoInputs.children[0].value = "";
  toDoInputs.children[1].value = "";
  toDoInputs.children[2].style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  setTheTable();
  showAlert("Todo edited successfully!", "success");
};

const changeClass = (filter) => {
  filterButtons.forEach((button) => {
    button.dataset.filter === filter
      ? button.classList.add("selected")
      : button.classList.remove("selected");
  });
};

const filterHandler = (event) => {
  let filtertodos = null;
  const filter = event.target.dataset.filter;
  changeClass(filter);
  switch (filter) {
    case "pending":
      filtertodos = todos.filter((todo) => todo.completed === false);
      break;

    case "complited":
      filtertodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filtertodos = todos;
      break;
  }
  setTheTable(filtertodos);
};

window.addEventListener("load", () => setTheTable());
toDoInputs.children[2].addEventListener("click", addHandler);
DeleteAll.addEventListener("click", DeleteAllHandler);
editButton.addEventListener("click", addEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});

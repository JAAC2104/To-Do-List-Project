const container = document.querySelector("#tasksContainer");

container.addEventListener("dragstart", e => {
  if (e.target.classList.contains("task")) {
    e.target.classList.add("dragging");
  }
});

container.addEventListener("dragend", e => {
  if (e.target.classList.contains("task")) {
    e.target.classList.remove("dragging");
    updateTaskOrder();
  }
});

container.addEventListener("dragover", e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientY);
  const dragging = document.querySelector(".dragging");
  if (afterElement == null) {
    container.appendChild(dragging);
  } else {
    container.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const taskElements = [...container.querySelectorAll(".task:not(.dragging)")];
  return taskElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - (box.top + box.height / 2);
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateTaskOrder() {
  const newOrder = [...container.querySelectorAll(".task")].map(el => {
    const id = parseInt(el.dataset.id, 10);
    return tasks.find(task => task.id === id);
  });

  tasks = newOrder;
  saveTasks(tasks);
}

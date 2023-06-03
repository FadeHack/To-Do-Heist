const taskContainer = document.getElementById('taskContainer');
const tasksCont = document.getElementById('tasksCont');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminUsernameInput = document.getElementById('adminUsernameInput');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const userLoginForm = document.getElementById('userLoginForm');
const userUsernameInput = document.getElementById('userUsernameInput');
const userPasswordInput = document.getElementById('userPasswordInput');
const newUserUsernameInput = document.getElementById('newUserUsernameInput');
const newUserPasswordInput = document.getElementById('newUserPasswordInput');
const registerButton = document.getElementById('registerButton');
const loginContainer = document.getElementById('loginContainer');


// Get the buttons and divs
const adminButton = document.getElementById('adminButton');
const userButton = document.getElementById('userButton');
const adminDiv = document.querySelector('.adminLog');
const userDiv = document.querySelector('.userLog');
const userLoginButton = document.getElementById('userLoginButton');
const userRegisterButton = document.getElementById('userRegisterButton');
const userLoginF = document.querySelector('.userLogin');
const userRegistration = document.querySelector('.userRes');

// Add event listeners to the buttons
adminButton.addEventListener('click', showAdminDiv);
userButton.addEventListener('click', showUserDiv);
userLoginButton.addEventListener('click', showUserLoginForm);
userRegisterButton.addEventListener('click', showUserRegistration);



const logo = document.getElementById('iconDiv');
logo.addEventListener('click', ()=>{
  window.location.href = '/'; 

});


// Function to show the admin div
function showAdminDiv() {
  adminDiv.style.display = 'flex';
  userDiv.style.display = 'none';
}

// Function to show the user div
function showUserDiv() {
  adminDiv.style.display = 'none';
  userDiv.style.display = 'flex';
}

// Function to show the user login form
function showUserLoginForm() {
  userLoginF.style.display = 'flex';
  userRegistration.style.display = 'none';
}

// Function to show the user registration form
function showUserRegistration() {
  userLoginF.style.display = 'none';
  userRegistration.style.display = 'flex';
}




// Hide the task container initially
taskContainer.style.display = 'none';

// Handle admin login form submission
adminLoginForm.addEventListener('submit', event => {
  event.preventDefault();

  const username = adminUsernameInput.value;
  const password = adminPasswordInput.value;

  const loginData = { username, password };

  // Send login request to the backend
  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Save the token in localStorage for future authenticated requests
        localStorage.setItem('token', data.token);

        // Show the task container and hide the login container
        taskContainer.style.display = 'block';
        loginContainer.style.display = 'none';

        // Fetch tasks for the admin user
        fetchTasks();
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.log(error);
      alert('An error occurred while logging in');
    });
});

// Handle user login form submission
userLoginForm.addEventListener('submit', event => {
  event.preventDefault();

  const username = userUsernameInput.value;
  const password = userPasswordInput.value;

  const loginData = { username, password };

  // Send login request to the backend
  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Save the token in localStorage for future authenticated requests
        localStorage.setItem('token', data.token);

        // Show the task container and hide the login container
        taskContainer.style.display = 'block';
        loginContainer.style.display = 'none';

        // Fetch tasks for the authenticated user
        fetchTasks();
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.log(error);
      alert('An error occurred while logging in');
    });
});

// Handle user registration form submission
registerButton.addEventListener('click', event => {
  event.preventDefault();

  const username = newUserUsernameInput.value;
  const password = newUserPasswordInput.value;
  const role = "user"
  const registerData = { username, password, role };

  // Send registration request to the backend
  fetch('/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registerData)
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      newUserUsernameInput.value = '';
      newUserPasswordInput.value = '';
    })
    .catch(error => {
      console.log(error);
      alert('An error occurred while registering');
    });
});


// Add the event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', logout);

// Logout function
function logout() {
  // Clear the token from localStorage
  localStorage.removeItem('token');

  // Redirect to the login page
  window.location.href = '/';
}



// Fetch tasks for the authenticated user

function fetchTasks() {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  console.log("inside fetch tasks")
  // Send authenticated request to fetch user details
  fetch(`/api/users/details`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(user => {
      user = user.user;
      if (user.role === "admin") {
        // If user is admin, fetch all tasks
        fetchAllTasks(token);
      } else if (user.role === "user") {
        // If user is student, fetch tasks for the specific user
        fetchUserTasks(user.username, token);
      }
    })
    .catch(error => {
      console.log(error);
      alert('An error occurred while fetching user details');
    });
}

// Fetch all tasks
function fetchAllTasks(token) {
  // Send authenticated request to fetch all tasks
  fetch('/api/tasks', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(tasks => {
      console.log(tasks); // Debug statement
      tasks.forEach(task => {
        const taskElement = createTaskElementAdmin(task);
        tasksCont.appendChild(taskElement);
      });
    })
    .catch(error => {
      console.log(error);
      alert('An error occurred while fetching tasks');
    });
}

// Fetch tasks for the specific user
function fetchUserTasks(username, token) {
  console.log("inside fetch user task", username)
  // Send authenticated request to fetch tasks for the user
  fetch(`/api/tasks/user/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(tasks => {
      console.log(tasks); // Debug statement
      tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksCont.appendChild(taskElement);
      });
    })
    .catch(error => {
      console.log(error);
      alert('An error occurred while fetching user tasks');
    });
}



const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const timeInput = document.getElementById('timeInput');


// Handle task form submission
taskForm.addEventListener('submit', event => {
  event.preventDefault();
  
  const title = titleInput.value;
  const description = descriptionInput.value;
  const time = timeInput.value;

  const token = localStorage.getItem('token');

  // Create task data including the username
  const taskData = {
    title,
    description,
    time
  };

  // Create task on the backend
  fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const taskElement = createTaskElement({ _id: data._id, title, description, time });
    tasksCont.appendChild(taskElement);
    titleInput.value = '';
    descriptionInput.value = '';
    timeInput.value = '';
  })
  .catch(error => {
    console.log(error);
  });
});


function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.classList.add('card');
  taskElement.dataset.taskId = task._id;
  
  // Format the time string
  const time = new Date(task.time).toLocaleString();
  
  taskElement.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p>Date/Time: ${time}</p>
    <button onclick="updateTask('${task._id}')">Update</button>
    <button onclick="deleteTask('${task._id}')">Delete</button>
  `;
  return taskElement;
}
function createTaskElementAdmin(task) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.classList.add('card');
  taskElement.dataset.taskId = task._id;
  
  // Format the time string
  const time = new Date(task.time).toLocaleString();
  
  taskElement.innerHTML = `
  <h3>${task.title}</h3>
  <p>${task.description}</p>
  <p>Date/Time: ${time}</p>
  <h4>Username: ${task.username}</h4>
    <button onclick="updateTask('${task._id}')">Update</button>
    <button onclick="deleteTask('${task._id}')">Delete</button>
  `;
  return taskElement;
}


// Delete a task
function deleteTask(id) {
  // Delete task on the backend
  fetch(`/api/tasks/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.remove();
    }
  })
  .catch(error => {
    console.log(error);
  });
}

// Create an edit button for a task
function createEditButton(id) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    updateTask(id);
  });
  return editButton;
}

// Update a task
function updateTask(id) {
  const taskElement = document.querySelector(`[data-task-id="${id}"]`);

  // Check if the task element exists
  if (taskElement) {
    const taskTitle = taskElement.querySelector('h3').textContent;
    const taskDescription = taskElement.querySelector('p').textContent;
    const taskTime = taskElement.querySelector('p:nth-child(3)').textContent.split(': ')[1];

    const updatedTitleInput = document.createElement('input');
    updatedTitleInput.type = 'text';
    updatedTitleInput.value = taskTitle;

    const updatedDescriptionInput = document.createElement('input');
    updatedDescriptionInput.type = 'text';
    updatedDescriptionInput.value = taskDescription;

    const updatedTimeInput = document.createElement('input');
    updatedTimeInput.type = 'datetime-local';
    updatedTimeInput.value = taskTime;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
      const updatedTitle = updatedTitleInput.value;
      const updatedDescription = updatedDescriptionInput.value;
      const updatedTime = updatedTimeInput.value;

      if (updatedTitle && updatedDescription && updatedTime) {
        const updatedTask = {
          title: updatedTitle,
          description: updatedDescription,
          time: updatedTime
        };

        // Update task on the backend
        fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedTask)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);

            // Create a new task element with the updated values
            const newTaskElement = createTaskElement({ _id: id, title: updatedTitle, description: updatedDescription, time: updatedTime });
            tasksCont.replaceChild(newTaskElement, taskElement);
          })
          .catch(error => {
            console.log(error); // Log the error for debugging
          });
      }
    });

    // Replace the task content with input fields
    taskElement.innerHTML = '';
    taskElement.appendChild(updatedTitleInput);
    taskElement.appendChild(updatedDescriptionInput);
    taskElement.appendChild(updatedTimeInput);
    taskElement.appendChild(saveButton);
  } else {
    console.log(`Task element with id "${id}" not found.`);
  }
}

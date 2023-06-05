const userTable = document.querySelector('.usersTable tbody');
const username = document.querySelector('#username');
const roles = document.querySelector('#roles');

fetch('/api/user')
    .then(response => response.json())
    .then(data => {
        username.textContent = data.username;
        roles.textContent = data.roles.map(role => role.roleName).join(' ');
        userTable.innerHTML = `
      <tr>
        <td>${data.id}</td>
        <td>${data.firstName}</td>
        <td>${data.lastName}</td>
        <td>${data.age}</td>
        <td>${data.email}</td>
        <td>${data.username}</td>
        <td>${data.roles.map(role => role.roleName).join(', ')}</td>
      </tr>`;
    })
    .catch(error => console.error(error));

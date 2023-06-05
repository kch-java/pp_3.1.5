const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteModal'))
const editUserModal = new bootstrap.Modal(document.getElementById('editModal'))
const errorUserModal = new bootstrap.Modal(document.getElementById('errorModal'))

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e.target)
        }
    })
}

// _____________________nav_vertical______________________________________________

const username = document.querySelector('#username');
const roles = document.querySelector('#roles0');
const tableBody = document.getElementById('tableBody');

fetch('/api/user')
    .then(response => response.json())
    .then(data => {
        username.textContent = data.username;
        roles.textContent = data.roles.map(role => role.roleName).join(' ');
    })
    .catch(error => console.error(error));

// ______________________Users_table______________________________________________

fetch('/api/users')
    .then(response => response.json())
    .then(data => {
        const fragment = new DocumentFragment();
        data.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.age}</td>
          <td>${user.email}</td>
          <td>${user.username}</td>
          <td>${user.roles.map(role => role.roleName).join(', ')}</td>
          <td><button type="button" class="btn btn-sm btn-primary" id="editUserBtn">Edit</button></td>
          <td><button type="button" class="btn btn-sm btn-danger" id="deleteUserBtn">Delete</button></td>`;
            fragment.appendChild(tr);
        });
        tableBody.appendChild(fragment);
    })
    .catch(error => console.error(error));

// _______________________New_User_______________________________________________

const newUserForm = document.getElementById('newUserForm');
const errorBlock = document.getElementById('errorModalText');

newUserForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = document.getElementById('firstNameN').value;
    const lastName = document.getElementById('lastNameN').value;
    const age = document.getElementById('ageN').value;
    const email = document.getElementById('emailN').value;
    const username = document.getElementById('usernameN').value;
    const password = document.getElementById('passwordN').value;

    let role = document.getElementById('roleN')
    let currentRoles = []
    let currentRolesValue = ''
    for (let i = 0; i < role.options.length; i++) {
        if (role.options[i].selected) {
            currentRoles.push({id: role.options[i].value, name: role.options[i].innerHTML})
            currentRolesValue += role.options[i].innerHTML + ' '
        }
    }

    const user = {
        firstName,
        lastName,
        age,
        email,
        username,
        password,
        roles: currentRoles
    };

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {

            if (response.ok) {
                response.json()
                    .then(data => {
                        const {id, firstName, lastName, age, email, username} = data;
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
        <td>${id}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${age}</td>
        <td>${email}</td>
        <td>${username}</td>
        <td>${currentRolesValue}</td>
        <td>
            <button type="button" class="btn btn-sm btn-primary" id="editUserBtn">Edit</button></td>
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-danger" id="deleteUserBtn">Delete</button>
        </td>`;
                        const tableBody = document.getElementById('tableBody');
                        tableBody.appendChild(newRow);

                        newUserForm.reset();
                        const allUsersTab = document.getElementById('all-users-tab');
                        allUsersTab.click();
                    })
            } else {
                response.json()
                    .then(error => {
                        errorBlock.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
                        errorUserModal.show();

                        const closeBtn = document.querySelector('#errorModal .close');
                        const closeButton = document.querySelector('#errorModal .modal-footer button');
                        closeBtn.addEventListener('click', () => {
                            errorUserModal.hide();
                        });
                        closeButton.addEventListener('click', () => {
                            errorUserModal.hide();
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        })
        .catch(error => console.error(error));
});

// _______________________Edit_User______________________________________________

    const idEdit = document.getElementById('id0')
    const firstNameEdit = document.getElementById('firstName0')
    const lastNameEdit = document.getElementById('lastName0')
    const ageEdit = document.getElementById('age0')
    const emailEdit = document.getElementById('email0')
    const usernameEdit = document.getElementById('username0')
    const passwordEdit = document.getElementById('password0')
    const rolesEdit = document.getElementById('rolesE')

    let rowEdit = null

    on(document, 'click', '#editUserBtn', e => {
        rowEdit = e.parentNode.parentNode

        idEdit.value = rowEdit.children[0].innerHTML
        firstNameEdit.value = rowEdit.children[1].innerHTML
        lastNameEdit.value = rowEdit.children[2].innerHTML
        ageEdit.value = rowEdit.children[3].innerHTML
        emailEdit.value = rowEdit.children[4].innerHTML
        usernameEdit.value = rowEdit.children[5].innerHTML
        passwordEdit.value = ''

        let hasAdminRole = rowEdit.children[6].innerHTML.includes('ADMIN');
        let hasUserRole = rowEdit.children[6].innerHTML.includes('USER');

        let adminOption = '<option value="1" ';
        adminOption += hasAdminRole ? 'selected' : '';
        adminOption += '>ADMIN</option>';

        let userOption = '<option value="2" ';
        userOption += hasUserRole ? 'selected' : '';
        userOption += '>USER</option>';

        rolesEdit.innerHTML = adminOption + userOption;

        editUserModal.show()
    })

document.getElementById('edit_user_form').addEventListener('submit', (e) => {
    e.preventDefault()
    let role = document.getElementById('rolesE')
    let rolesUserEdit = []
    let rolesUserEditValue = ''
    for (let i = 0; i < role.options.length; i++) {
        if (role.options[i].selected) {
            rolesUserEdit.push({id: role.options[i].value, name: role.options[i].innerHTML})
            rolesUserEditValue += role.options[i].innerHTML + ' '
        }
    }
    fetch('/api/users/' + rowEdit.children[0].innerHTML, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idEdit.value,
            firstName: firstNameEdit.value,
            lastName: lastNameEdit.value,
            age: ageEdit.value,
            email: emailEdit.value,
            username: usernameEdit.value,
            password: passwordEdit.value,
            roles: rolesUserEdit
        })
    })
        .then(response => {
            if (response.ok) {
                response.json()
        .catch(error => console.log(error))
    rowEdit.children[0].innerHTML = idEdit.value
    rowEdit.children[1].innerHTML = firstNameEdit.value
    rowEdit.children[2].innerHTML = lastNameEdit.value
    rowEdit.children[3].innerHTML = ageEdit.value
    rowEdit.children[4].innerHTML = emailEdit.value
    rowEdit.children[5].innerHTML = usernameEdit.value
    rowEdit.children[6].innerHTML = rolesUserEditValue
    editUserModal.hide()
            } else {
                response.json()
                    .then(error => {
                        errorBlock.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
                        errorUserModal.show();

                        const closeBtn = document.querySelector('#errorModal .close');
                        const closeButton = document.querySelector('#errorModal .modal-footer button');
                        closeBtn.addEventListener('click', () => {
                            errorUserModal.hide();
                        });
                        closeButton.addEventListener('click', () => {
                            errorUserModal.hide();
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        })
        .catch(error => console.error(error));
});

// ________________________Delete_User____________________________________________

let rowDelete = null
on(document, 'click', '#deleteUserBtn', e => {
    rowDelete = e.parentNode.parentNode
    document.getElementById('id1').value = rowDelete.children[0].innerHTML
    document.getElementById('firstName1').value = rowDelete.children[1].innerHTML
    document.getElementById('lastName1').value = rowDelete.children[2].innerHTML
    document.getElementById('age1').value = rowDelete.children[3].innerHTML
    document.getElementById('email1').value = rowDelete.children[4].innerHTML
    document.getElementById('username1').value = rowDelete.children[5].innerHTML

    let option = ''
    const roles = ['ADMIN', 'USER'];
    roles.forEach(role => {
        if (rowDelete.children[6].innerHTML.includes(role)) {
            option += `<option value="${role}">${role}</option>`;
        }
    })
    document.getElementById('roles1').innerHTML = option

    deleteUserModal.show()
})

document.getElementById('delete_user_form').addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('/api/users/' + rowDelete.children[0].innerHTML, {
        method: 'DELETE'
    }).then(() => {
        deleteUserModal.hide()
        rowDelete.parentNode.removeChild(rowDelete)
    })
})

// ________________________User_Table____________________________________________

const userTable = document.querySelector('.usersTable tbody');
fetch('/api/user')
    .then(response => response.json())
    .then(data => {
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

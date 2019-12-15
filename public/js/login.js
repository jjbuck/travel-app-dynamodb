let signInForm = document.querySelector('.sign-in-form');
let registerForm = document.querySelector('.register-form')

signInForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let email = document.getElementById('sign-in-email').value;
    let password = document.getElementById('sign-in-password').value;
    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then((resp) => {
        if(resp.status === 400) {
            throw new Error();
        }
        return resp.json();
    }).then((data) => {
        window.location.href = data.redirectUrl;
    }).catch(() => alert('Wrong user name or password'))
})

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let email = document.getElementById('register-email').value;
    let password = document.getElementById('register-password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    if(password !== confirmPassword) {
        alert('Passwords are not identical!');
        return;
    }
    fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then((resp) => resp.text()).then((data) => alert(data))
})
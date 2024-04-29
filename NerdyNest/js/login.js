const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signInButton = document.querySelector('.sign-in button');


function redirectToIndex() {
    window.location.href = "./index.html";
}

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");

signInButton.addEventListener('click', function (event) {
        event.preventDefault();
        redirectToIndex();
    });
});
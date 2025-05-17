document.addEventListener('DOMContentLoaded', function () {
    // Handle Password Rules
    const passwordInput = document.getElementById('id_password1');
    const passwordRules = document.getElementById('password-rules');

    if (passwordInput && passwordRules) {
        passwordInput.addEventListener('focus', function () {
            passwordRules.style.display = "block";
        });

        passwordInput.addEventListener('blur', function () {
            passwordRules.style.display = "none";
        });
    }

    // Handle Username Rules
    const usernameInput = document.querySelector('input[name="username"]');
    const usernameRules = document.getElementById('username-rules');

    if (usernameInput && usernameRules) {
        usernameInput.addEventListener('focus', function () {
            usernameRules.style.display = "block";
        });

        usernameInput.addEventListener('blur', function () {
            usernameRules.style.display = "none";
        });
    }
});

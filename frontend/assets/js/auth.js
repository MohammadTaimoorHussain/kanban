const token = localStorage.getItem('auth-token');
if (token) {
    window.location.href = 'kanban.html';
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value,
        password = document.getElementById('password').value,
        btnSubmit = document.getElementById('btn-submit'),
        errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
    btnSubmit.textContent = 'Please wait..'

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });
        const result = await response.json();
        if (response.ok) {
            $.toast({
                text: result.message,
                position: 'top-right',
                allowToastClose : false,
                hideAfter : 1500,
            });
            localStorage.setItem('auth-token', result.token);
            localStorage.setItem('active-user', result.user.email);
            setTimeout(() => window.location.href = 'kanban.html', 2000);
        } else {
            errorMessage.textContent = result.message;
            btnSubmit.textContent = 'Log In';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred, please try again.';
        btnSubmit.textContent = 'Log In';
    }
});
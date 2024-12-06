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
                heading: 'Congratulations!',
                text: result.message,
                icon: 'success',
                loader: true,
                loaderBg: 'green',
                position: 'top-right'
            });
            localStorage.setItem('auth-token', result.token);
            setTimeout(() => window.location.href = 'kanban.html', 2000);
        } else {
            btnSubmit.textContent = 'Log In';
            if (response.status === 500) {
                return $.toast({
                    heading: response.statusText,
                    text: result.error,
                    icon: 'error',
                    loader: true,
                    loaderBg: 'red',
                    position: 'top-right'
                })
            }
            errorMessage.textContent = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        btnSubmit.textContent = 'Log In';
        $.toast({
            heading: 'Something went wrong',
            text: error,
            icon: 'error',
            loader: true,
            loaderBg: 'red',
            position: 'top-right'
        })
    }
});
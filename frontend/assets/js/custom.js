const token = localStorage.getItem('auth-token'),
    user = localStorage.getItem('active-user');
if (!token) {
    window.location.href = 'index.html';
}

document.getElementById('active-user').textContent = user;

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('active-user');
    $.toast({
        text: 'Logged out successfully',
        position: 'top-right',
        allowToastClose: false,
        hideAfter: 1500,
    });
    setTimeout(() => window.location.href = 'index.html', 2000);
});
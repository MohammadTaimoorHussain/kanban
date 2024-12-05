const token = localStorage.getItem('auth-token');
if (!token) {
    window.location.href = 'index.html';
}

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('auth-token');
    $.toast({
        text: 'Logged out successfully',
        position: 'top-right',
        allowToastClose : false,
        hideAfter : 1500,
    });
    setTimeout(() => window.location.href = 'index.html', 2000);
});
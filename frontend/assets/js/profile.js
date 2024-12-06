window.onload = async function () {
    try {
        const response = await fetch(`/auth/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            },
        });
        if (response.status === 401) {
            $.toast({
                text: response.statusText,
                position: 'top-right',
                allowToastClose: false,
                hideAfter: 1500,
            });
            localStorage.removeItem('auth-token');
            return setTimeout(() => window.location.href = 'kanban.html', 2000);
        }

        const {user} = await response.json();
        document.getElementById('active-user').textContent = user.name;
        document.getElementById('active-username').textContent = user.name;
        document.getElementById('active-user-role').textContent = user.role.toUpperCase();
        document.getElementById('active-user-joining-date').textContent = new Date(user.created_at).toLocaleString();
        document.getElementById('active-user-bio').textContent = user.bio;
        document.getElementById('active-user-full-name').textContent = user.name;
        document.getElementById('active-user-email').textContent = user.email;
        document.getElementById('active-user-languages').textContent = 'English, Urdu';
    } catch (error) {
        console.error('Error:', error);
    }
};

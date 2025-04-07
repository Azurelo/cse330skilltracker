const toggle = document.getElementById('toggle-theme');

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('mode', mode);
});

document.addEventListener('DOMContentLoaded', () => {
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

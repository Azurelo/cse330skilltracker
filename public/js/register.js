document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
  
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('✅ Registered!');
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        alert(data.message || '❌ Registration failed');
      }
    } catch (err) {
      console.error('Registration request error:', err);
      alert('An error occurred during registration');
    }
  });
  
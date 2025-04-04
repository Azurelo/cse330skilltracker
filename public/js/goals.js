const token = localStorage.getItem('token');

document.getElementById('goalForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const resources = document.getElementById('resources').value.split(',').map(r => r.trim());

    const res = await fetch('/goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ title, description, resources })
    });

    const data = await res.json();
    if (res.ok) {
        location.reload();
    } else {
        alert(data.message);
    }
});

async function fetchGoals() {
    const res = await fetch('/goals', {
        headers: { 'Authorization': token }
    });

    const goals = await res.json();
    const goalList = document.getElementById('goalList');
    goalList.innerHTML = '';

    goals.forEach(goal => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${goal.title}</strong> - ${goal.description}
            <br>Progress: ${goal.progress}%
            <br>Resources: ${goal.resources.join(', ')}
            <br>
            <button onclick="updateProgress('${goal._id}')">Update Progress</button>
            <button onclick="deleteGoal('${goal._id}')">Delete</button>
        `;
        goalList.appendChild(li);
    });
}

async function updateProgress(id) {
    const newProgress = prompt('Enter new progress (0-100):');
    if (newProgress !== null) {
        await fetch(`/goals/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ progress: parseInt(newProgress) })
        });
        fetchGoals();
    }
}

async function deleteGoal(id) {
    await fetch(`/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
    });
    fetchGoals();
}

fetchGoals();

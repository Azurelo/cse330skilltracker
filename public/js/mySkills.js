// public/js/mySkills.js
const token = localStorage.getItem('token');

async function fetchUserSkills() {
    const res = await fetch('/goals', {
        headers: { 'Authorization': token }
    });
    const skills = await res.json();

    const container = document.getElementById('mySkillsContainer');
    container.innerHTML = '';

    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <img src="${skill.skills[0]?.icon || '#'}" alt="${skill.title}">
            <p>${skill.title}</p>
            <div class="progress"><div class="progress-bar" style="width: ${skill.progress}%;"></div></div>
            <button onclick="updateSkillProgress('${skill._id}')">Update Progress</button>
            <button onclick="deleteSkill('${skill._id}')">Remove Skill</button>
            <div>
                <strong>Resources:</strong>
                <ul>${skill.resources.map(r => `<li>${r} <button onclick="deleteResource('${skill._id}', '${r}')">x</button></li>`).join('')}</ul>
                <input type="text" placeholder="New resource URL" id="res-${skill._id}">
                <button onclick="addResource('${skill._id}')">Add</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function updateSkillProgress(id) {
    const progress = prompt('Enter progress (0-100):');
    if (!progress) return;
    await fetch(`/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ progress: parseInt(progress) })
    });
    fetchUserSkills();
}

async function deleteSkill(id) {
    await fetch(`/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
    });
    fetchUserSkills();
}

async function addResource(goalId) {
    const input = document.getElementById(`res-${goalId}`);
    const url = input.value.trim();
    if (!url) return;

    const res = await fetch('/goals', { headers: { Authorization: token }});
    const goals = await res.json();
    const goal = goals.find(g => g._id === goalId);

    const newResources = [...goal.resources, url];

    await fetch(`/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ resources: newResources })
    });

    fetchUserSkills();
}

async function deleteResource(goalId, url) {
    const res = await fetch('/goals', { headers: { Authorization: token }});
    const goals = await res.json();
    const goal = goals.find(g => g._id === goalId);

    const filtered = goal.resources.filter(r => r !== url);

    await fetch(`/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ resources: filtered })
    });

    fetchUserSkills();
}

fetchUserSkills();

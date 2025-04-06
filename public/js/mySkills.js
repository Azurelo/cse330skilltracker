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
        card.className = 'my-skill-card';

        const icon = skill.skills[0]?.icon || '#';
        const name = skill.title;
        const progress = skill.progress ?? 0;
        const resources = skill.resources ?? [];

        card.innerHTML = `
            <div class="card-left">
                <img src="${icon}" alt="${name}">
            </div>
            <div class="card-right">
                <div class="card-header">
                    <h3>${name}</h3>
                    <span class="progress-label">${progress}%</span>
                </div>
                <input type="range" min="0" max="100" value="${progress}" 
                       onchange="updateSkillProgress('${skill._id}', this.value)">
                <p><strong>Skill Details:</strong> Add a description or auto-generated summary here.</p>
                <p><strong>Resources:</strong></p>
                <ul>
                    ${resources.map(r => `<li>${r} <button class="delResource" onclick="deleteResource('${skill._id}', '${r}')">x</button></li>`).join('')}
                </ul>
                <input type="text" placeholder="New resource URL" id="res-${skill._id}">
                <button onclick="addResource('${skill._id}')">Add Resource</button>
                <button onclick="deleteSkill('${skill._id}')">Remove Skill</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Slider-style update
async function updateSkillProgress(id, progress) {
    await fetch(`/goals/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
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

    const res = await fetch('/goals', { headers: { Authorization: token } });
    const goals = await res.json();
    const goal = goals.find(g => g._id === goalId);

    const newResources = [...goal.resources, url];

    await fetch(`/goals/${goalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ resources: newResources })
    });

    fetchUserSkills();
}

async function deleteResource(goalId, url) {
    const res = await fetch('/goals', { headers: { Authorization: token } });
    const goals = await res.json();
    const goal = goals.find(g => g._id === goalId);

    const filtered = goal.resources.filter(r => r !== url);

    await fetch(`/goals/${goalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ resources: filtered })
    });

    fetchUserSkills();
}

fetchUserSkills();

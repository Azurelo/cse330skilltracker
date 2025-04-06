const token = localStorage.getItem('token');

// Fetch and display skills
async function fetchSkills() {
    const res = await fetch('/skills/api');
    const skills = await res.json();

    const skillList = document.getElementById('skillList');
    skillList.innerHTML = '';

    skills.forEach(skill => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="skills">
            <div class="skill-card">
                <img src="${skill.icon}" alt="${skill.name}" />
                <h3>${skill.name}</h3>
                <p>${skill.category || ''}</p>
                <button onclick="openSkillInfo('${skill._id}')">More Info</button>
                <button onclick="addToGoal('${skill._id}')">Add Skill</button>
            </div>
            </div>
        `;
        skillList.appendChild(li);
    });
}


// Open and close modal
function openSkillModal() {
    document.getElementById('skillModal').style.display = 'block';
}
function closeSkillModal() {
    document.getElementById('skillModal').style.display = 'none';
}

// Add a new skill via modal
async function addSkill(event) {
    event.preventDefault(); // Stop form from reloading the page

    const name = document.getElementById('skillName').value.trim();
    const category = document.getElementById('skillCategory').value.trim();
    const icon = document.getElementById('skillIcon').value.trim();

    if (!name || !icon) {
        alert('Please fill in both name and icon URL!');
        return;
    }

    const res = await fetch('/skills/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ name, category, icon }) // ✅ Include all 3!
    });

    if (res.ok) {
        closeSkillModal();
        fetchSkills(); // Reload skills on page
    } else {
        const data = await res.json();
        alert(data.message || 'Error adding skill');
    }
}


document.getElementById('skillForm').addEventListener('submit', addSkill);

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('skillModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Initial load
fetchSkills();

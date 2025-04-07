if (!window.token) {
  window.token = localStorage.getItem('token');
}
const token = window.token;

// Modal open/close globally available
window.openSkillModal = function () {
  const modal = document.getElementById('skillModal');
  if (modal) modal.style.display = 'block';
};

window.closeSkillModal = function () {
  const modal = document.getElementById('skillModal');
  if (modal) modal.style.display = 'none';
};

// Handle Add Skill form
const skillForm = document.getElementById('skillForm');
if (skillForm) {
  skillForm.addEventListener('submit', async function (event) {
    event.preventDefault();

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
      body: JSON.stringify({ name, category, icon })
    });

    if (res.ok) {
      window.closeSkillModal();
      if (document.getElementById('skillList')) {
        fetchSkills(); // only reload if skill list is present
      }
    } else {
      const data = await res.json();
      alert(data.message || 'Error adding skill');
    }
  });
}

// Fetch skills for skills.html
async function fetchSkills() {
  const skillList = document.getElementById('skillList');
  if (!skillList) return;

  const res = await fetch('/skills/api');
  const skills = await res.json();
  skillList.innerHTML = '';

  skills.forEach(skill => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="skills">
        <div class="skill-card">
          <img src="${skill.icon}" alt="${skill.name}" />
          <h3>${skill.name}</h3>
          <p>${skill.category || ''}</p>
          <button onclick="addToGoal('${skill._id}')">Add Skill</button>
        </div>
      </div>
    `;
    skillList.appendChild(li);
  });
}

// Attach addToGoal globally
window.addToGoal = async function (skillId) {
  const res = await fetch('/goals/add-skill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ skillId })
  });

  const data = await res.json();
  if (res.ok) {
    alert(`Added "${data.title}" to your skills!`);
  } else {
    alert(data.message || 'Error adding skill');
  }
};

// Optional: close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('skillModal');
  if (modal && event.target === modal) {
    modal.style.display = 'none';
  }
};

// Only fetch if list exists
if (document.getElementById('skillList')) {
  fetchSkills();
}

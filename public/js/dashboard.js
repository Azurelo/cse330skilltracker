const toke = window.token; 

// Wire up the modal open button
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('create-skill-btn');

  if (btn) {
    btn.addEventListener('click', () => {
      if (typeof window.openSkillModal === 'function') {
        window.openSkillModal();
      } else {
        console.error('openSkillModal not defined');
      }
    });
  }
});

// Load the user's recent 3 skills
async function loadRecentSkills() {
  try {
    const res = await fetch('/goals', {
      headers: { Authorization: toke }
    });

    const goals = await res.json();
    const recent = goals
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    const container = document.getElementById('recentSkillsContainer');
    container.innerHTML = '';

    recent.forEach(skill => {
      const icon = skill.skills[0]?.icon || '#';
      const name = skill.title;
      const progress = skill.progress ?? 0;

      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <img src="${icon}" alt="${name}" />
        <p>${name}</p>
        <div class="progress">
          <div class="progress-bar" style="width: ${progress}%;"></div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load recent skills:', err);
  }
}
// Fetch and display the user’s name
async function loadUsername() {
  

  try {
    const res = await fetch('/auth/profile', {
      headers: { Authorization: toke }
    });
    const user = await res.json();
    console.log('👤 User profile:', user);
    const welcome = document.querySelector('.welcome p');
    if (user.username && welcome) {
      welcome.textContent = `Welcome back ${user.username}`;
    }
  } catch (err) {
    console.error('Error loading user name:', err);
  }
}
loadRecentSkills();
loadUsername();

document.querySelector('.welcome button').addEventListener('click', async () => {
  try {
    const res = await fetch('/goals', {
      headers: { Authorization: localStorage.getItem('token') }
    });

    const goals = await res.json();

    const recent = goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    const skillName = recent?.skills?.[0]?.name || recent?.title;

    if (skillName) {
      const query = encodeURIComponent(skillName);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    } else {
      alert('No recent skills found to search for.');
    }
  } catch (err) {
    console.error('Failed to fetch recent skill for search:', err);
    alert('Could not resume learning. Try again later.');
  }
});

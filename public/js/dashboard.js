const token = localStorage.getItem('token');

async function loadRecentSkills() {
  try {
    const res = await fetch('/goals', {
      headers: { Authorization: token }
    });

    const goals = await res.json();

    //Sort by time
    const recent = goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);


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

loadRecentSkills();

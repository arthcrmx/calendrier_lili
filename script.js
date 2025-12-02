const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

// DATE CIBLE
const today = new Date();
const TARGET_MONTH = 0; // Janvier
const TARGET_YEAR = 2026;

// NEIGE (Version Desktop : Plus de flocons car écran plus grand)
function initSnow() {
    const container = document.getElementById('snow-container');
    for(let i=0; i<50; i++) { // 50 flocons
        const fl = document.createElement('div');
        fl.className = 'snowflake';
        fl.innerText = '❄';
        fl.style.left = Math.random() * 100 + 'vw';
        fl.style.fontSize = (Math.random() * 15 + 10) + 'px';
        fl.style.animationDuration = (Math.random() * 5 + 5) + 's';
        fl.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(fl);
    }
}

function initCalendar() {
    grid.innerHTML = '';
    calendarData.sort((a,b) => a.day - b.day);

    for(let i=1; i<=30; i++) {
        const data = calendarData.find(d => d.day === i) || { day: i, gameType: 'none', reward: { type: 'text', content: '...' }};
        const el = document.createElement('div');
        el.className = 'day-card';

        // Verrouillage
        const isFuture = (today.getFullYear() < TARGET_YEAR) || 
                         (today.getFullYear() === TARGET_YEAR && today.getMonth() < TARGET_MONTH) ||
                         (today.getFullYear() === TARGET_YEAR && today.getMonth() === TARGET_MONTH && today.getDate() < i);
        
        const isDone = localStorage.getItem('day_'+i) === 'true';

        if(isFuture) {
            el.classList.add('locked');
            el.innerHTML = `<span class="day-num">${i}</span><i data-lucide="lock" class="day-icon"></i>`;
        } else {
            if(isDone) {
                el.classList.add('done');
                el.innerHTML = `<span class="day-num">${i}</span><i data-lucide="check" class="day-icon"></i>`;
                el.onclick = () => openModal(data, true);
            } else {
                el.innerHTML = `<span class="day-num">${i}</span><i data-lucide="gift" class="day-icon"></i>`;
                el.onclick = () => openModal(data, false);
            }
        }
        grid.appendChild(el);
    }
    lucide.createIcons();
}

function openModal(data, isReplay) {
    modal.classList.add('active');
    feedback.innerText = '';
    const interactionArea = document.getElementById('interaction-area');
    interactionArea.innerHTML = '';

    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');

    if(isReplay || data.gameType === 'none') {
        if(!isReplay) markAsDone(data.day);
        showReward(data.reward);
        return;
    }

    // JEUX
    gameSection.classList.remove('hidden');
    rewardSection.classList.add('hidden');
    
    if(data.gameType === 'quiz' || data.gameType === 'code') {
        title.innerText = data.gameType === 'quiz' ? "Question" : "Code Secret";
        desc.innerText = data.question;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'pc-input';
        input.placeholder = 'Réponse...';
        
        // Support touche "Entrée"
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") validate(input.value, data.answer, data);
        });

        const btn = document.createElement('button');
        btn.className = 'pc-btn';
        btn.innerText = 'Valider';
        btn.onclick = () => validate(input.value, data.answer, data);

        interactionArea.appendChild(input);
        interactionArea.appendChild(btn);
        
        setTimeout(() => input.focus(), 100); // Focus auto
    }
}

function validate(val, correct, data) {
    if(val.toLowerCase().trim() === correct.toLowerCase().trim()) {
        markAsDone(data.day);
        showReward(data.reward);
    } else {
        feedback.innerText = "Mauvaise réponse... Essaie encore !";
        // Petit effet de vibration sur l'input (visuel)
        document.querySelector('.pc-input').style.borderColor = '#f87171';
    }
}

function showReward(reward) {
    gameSection.classList.add('hidden');
    rewardSection.classList.remove('hidden');

    const display = document.getElementById('reward-display');
    let html = '';

    if(reward.type === 'text') {
        html = `<p style="font-size:1.2rem; line-height:1.6; margin-top:20px;">${reward.content}</p>`;
    } else if (reward.type === 'image') {
        html = `<img src="${reward.content}" alt="Surprise"><p style="margin-top:10px">${reward.text || ''}</p>`;
    } else if (reward.type === 'video') {
        html = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${reward.content}" frameborder="0" allowfullscreen></iframe></div><p style="margin-top:10px">${reward.text || ''}</p>`;
    }

    display.innerHTML = html;
}

function markAsDone(day) {
    localStorage.setItem('day_'+day, 'true');
    initCalendar();
}

function closeModal() {
    modal.classList.remove('active');
}

// Fermer avec la touche Echap
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape") closeModal();
});

initSnow();
initCalendar();

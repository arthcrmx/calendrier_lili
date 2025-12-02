const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

// --- CONFIGURATION DATE ---
const today = new Date();
const TARGET_MONTH = 0; // 0 = Janvier
const TARGET_YEAR = 2026; 

// --- INIT NEIGE (Optimisé) ---
function initSnow() {
    const container = document.getElementById('snow-container');
    container.innerHTML = '';
    // On se limite à 20 flocons pour garantir la fluidité
    for(let i=0; i<20; i++) { 
        const fl = document.createElement('div');
        fl.className = 'snowflake';
        fl.innerText = '❄';
        fl.style.left = Math.random() * 100 + 'vw';
        fl.style.fontSize = (Math.random() * 10 + 10) + 'px'; // Taille variable
        fl.style.animationDuration = (Math.random() * 5 + 8) + 's'; // Chute lente
        fl.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(fl);
    }
}

// --- INIT CALENDRIER ---
function initCalendar() {
    grid.innerHTML = '';
    calendarData.sort((a,b) => a.day - b.day);

    for(let i=1; i<=30; i++) {
        const data = calendarData.find(d => d.day === i) || { day: i, gameType: 'none', reward: { type: 'text', content: '...' }};
        const el = document.createElement('div');
        el.className = 'day-card';

        // Logique de Verrouillage
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

// --- MODALE & JEUX ---
function openModal(data, isReplay) {
    modal.classList.add('active');
    feedback.innerText = '';
    const interactionArea = document.getElementById('interaction-area');
    interactionArea.innerHTML = '';

    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');

    // Affichage direct si replay ou pas de jeu
    if(isReplay || data.gameType === 'none') {
        if(!isReplay) markAsDone(data.day);
        showReward(data.reward);
        return;
    }

    // Affichage du Jeu
    gameSection.classList.remove('hidden');
    rewardSection.classList.add('hidden');
    
    if(data.gameType === 'quiz' || data.gameType === 'code') {
        title.innerText = data.gameType === 'quiz' ? "Petite Question" : "Code Secret";
        desc.innerText = data.question;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'pc-input';
        input.placeholder = 'Votre réponse...';
        
        // Touche Entrée pour valider
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") validate(input.value, data.answer, data);
        });

        const btn = document.createElement('button');
        btn.className = 'pc-btn';
        btn.innerText = 'Valider';
        btn.onclick = () => validate(input.value, data.answer, data);

        interactionArea.appendChild(input);
        interactionArea.appendChild(btn);
        
        setTimeout(() => input.focus(), 100); 
    }
}

function validate(val, correct, data) {
    if(val.toLowerCase().trim() === correct.toLowerCase().trim()) {
        markAsDone(data.day);
        showReward(data.reward);
    } else {
        feedback.innerText = "Ce n'est pas ça... ❤️";
        const input = document.querySelector('.pc-input');
        if(input) input.style.borderColor = '#f87171';
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
        html = `<img src="${reward.content}" alt="Surprise"><p style="margin-top:15px; opacity:0.8">${reward.text || ''}</p>`;
    } else if (reward.type === 'video') {
        html = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${reward.content}" frameborder="0" allowfullscreen></iframe></div><p style="margin-top:15px; opacity:0.8">${reward.text || ''}</p>`;
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

// Fermeture avec Echap
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape") closeModal();
});

// Lancement
initSnow();
initCalendar();

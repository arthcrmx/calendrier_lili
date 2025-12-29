/* --- VARIABLES GLOBALES --- */
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

const today = new Date();
const TARGET_MONTH = 0; // Janvier (0 = Janvier)
const TARGET_YEAR = 2026;

// Admin state
let currentDayIndex = null;
let currentConfig = {};

/* =========================================
   PARTIE 1 : LOGIQUE PUBLIQUE
   ========================================= */
function initCalendar() {
    grid.innerHTML = '';
    calendarData.sort((a,b) => a.day - b.day);

    for(let i=1; i<=30; i++) {
        const data = calendarData.find(d => d.day === i) || { day: i, gameType: 'none', reward: { type: 'text', content: '...' }};
        const el = document.createElement('div');
        el.className = 'day-card';

        // Calcul de la date
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
                el.onclick = () => openModal(data, true); // true = mode Replay (déjà fait)
            } else {
                el.innerHTML = `<span class="day-num">${i}</span><i data-lucide="gift" class="day-icon"></i>`;
                el.onclick = () => openModal(data, false); // false = Nouveau jeu
            }
        }
        grid.appendChild(el);
    }
    if(window.lucide) lucide.createIcons();
}

function openModal(data, isReplay) {
    modal.classList.add('active');
    feedback.innerText = '';
    document.getElementById('interaction-area').innerHTML = '';

    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');

    // Si c'est un replay OU s'il n'y a pas de jeu ("none"), on montre la récompense direct
    if(isReplay || data.gameType === 'none') {
        if(!isReplay) markAsDone(data.day); // Si c'était "none" et pas encore fait, on valide
        showReward(data.reward);
        return;
    }

    // Sinon, on affiche le jeu
    gameSection.classList.remove('hidden');
    rewardSection.classList.add('hidden');
    
    // Titres du jeu
    if(data.gameType === 'quiz') {
        title.innerText = "Petite Question";
        desc.innerText = data.question;
    } else if(data.gameType === 'code') {
        title.innerText = "Code Secret";
        desc.innerText = data.question || "Quel est le mot de passe ?";
    }

    // Création des champs (Input + Bouton)
    const input = document.createElement('input');
    input.type = 'text'; 
    input.className = 'pc-input'; 
    input.placeholder = 'Ta réponse...';
    
    // Valider avec Entrée
    input.addEventListener("keypress", (e) => { if(e.key==="Enter") validate(input.value, data.answer, data); });
    
    const btn = document.createElement('button');
    btn.className = 'pc-btn'; 
    btn.innerText = 'Valider';
    btn.onclick = () => validate(input.value, data.answer, data);

    const area = document.getElementById('interaction-area');
    area.innerHTML = '';
    area.append(input, btn);
    
    setTimeout(() => input.focus(), 100); 
}

function validate(val, correct, data) {
    // Comparaison souple (minuscule et sans espaces autour)
    if(val.toLowerCase().trim() === correct.toLowerCase().trim()) {
        markAsDone(data.day);
        showReward(data.reward);
    } else {
        feedback.innerText = "Non, ce n'est pas ça... ❤️";
        // Petit effet visuel d'erreur
        const input = document.querySelector('.pc-input');
        if(input) {
            input.style.borderColor = "#ef4444";
            setTimeout(() => input.style.borderColor = "", 500);
        }
    }
}

// Fonction utilitaire pour extraire l'ID Youtube depuis n'importe quel lien
function getYoutubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

function showReward(reward) {
    gameSection.classList.add('hidden');
    rewardSection.classList.remove('hidden');
    const display = document.getElementById('reward-display');
    
    let html = '';
    let subText = reward.text ? `<p style="opacity:0.7; font-size:0.9rem; margin-top:10px;">${reward.text}</p>` : '';

    if(reward.type === 'coupon') {
        html = `
        <div class="coupon-ticket">
            <div class="coupon-title">🎟️ ${reward.content}</div>
            <div class="coupon-sub">${reward.text || ''}</div>
        </div>`;
    } 
    else if (reward.type === 'image') {
        html = `<img src="${reward.content}" style="max-width:100%; border-radius:10px; margin-top:15px; box-shadow:0 5px 15px rgba(0,0,0,0.1)">${subText}`;
    } 
    else if (reward.type === 'video') {
        // Nettoyage automatique du lien Youtube
        const videoID = getYoutubeID(reward.content);
        html = `
        <div style="position:relative; padding-bottom:56.25%; height:0; margin-top:15px; border-radius:10px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1)">
            <iframe src="https://www.youtube.com/embed/${videoID}" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        ${subText}`;
    } 
    else {
        // Cas par défaut (Texte) - CORRIGÉ pour afficher le sous-titre
        html = `
        <p style="font-size:1.3rem; margin-top:20px; font-weight:500; color:#2c3e50;">${reward.content}</p>
        ${subText}
        `;
    }
    
    display.innerHTML = html;
}

function markAsDone(day) { 
    localStorage.setItem('day_'+day, 'true'); 
    initCalendar(); 
}
function closeModal() { modal.classList.remove('active'); }
document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeModal(); });

/* =========================================
   PARTIE 2 : ADMIN (Logique inchangée mais robuste)
   ========================================= */

function toggleAdmin() {
    const adminDiv = document.getElementById('admin-dashboard');
    adminDiv.classList.toggle('hidden');
    if(!adminDiv.classList.contains('hidden')) {
        document.getElementById('admin-login-screen').classList.remove('hidden');
        document.getElementById('admin-workspace').classList.add('hidden');
    }
}

function checkAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if(pass === "amour") {
        document.getElementById('admin-login-screen').classList.add('hidden');
        document.getElementById('admin-workspace').classList.remove('hidden');
        renderAdminGrid();
    } else {
        document.getElementById('login-error').innerText = "Mauvais mot de passe";
    }
}
function handleLogin(e) { if(e.key === "Enter") checkAdmin(); }

function renderAdminGrid() {
    const gridEl = document.getElementById('admin-grid');
    gridEl.innerHTML = '';
    for(let i=1; i<=30; i++) {
        const exists = calendarData.find(d => d.day === i);
        const card = document.createElement('div');
        card.className = `day-mini-card ${exists ? 'configured' : ''}`;
        if(currentDayIndex === i) card.classList.add('selected');
        
        card.onclick = () => loadDayEditor(i);
        card.innerHTML = `<h4>Jour ${i}</h4>`;
        gridEl.appendChild(card);
    }
}

function loadDayEditor(day) {
    currentDayIndex = day;
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('editor-panel').classList.remove('hidden');
    document.getElementById('editor-title').innerText = `Édition du Jour ${day}`;
    
    renderAdminGrid(); // Update selection visual

    const existing = calendarData.find(d => d.day === day);
    currentConfig = existing ? JSON.parse(JSON.stringify(existing)) : { 
        day: day, gameType: 'none', question: '', answer: '',
        reward: { type: 'text', content: '', text: '' }
    };

    document.getElementById('edit-gameType').value = currentConfig.gameType;
    document.getElementById('edit-question').value = currentConfig.question || '';
    document.getElementById('edit-answer').value = currentConfig.answer || '';
    
    document.getElementById('edit-rewardType').value = currentConfig.reward.type;
    document.getElementById('edit-content').value = currentConfig.reward.content || '';
    document.getElementById('edit-subtext').value = currentConfig.reward.text || '';

    updateFormVisibility();
}

function updateFormVisibility() {
    const gameType = document.getElementById('edit-gameType').value;
    const rewardType = document.getElementById('edit-rewardType').value;
    
    const gameInputs = document.getElementById('group-game-inputs');
    if(gameType === 'none') gameInputs.classList.add('hidden');
    else gameInputs.classList.remove('hidden');

    const lblContent = document.getElementById('lbl-content');
    const hlpContent = document.getElementById('hlp-content');
    
    if(rewardType === 'coupon') {
        lblContent.innerText = "Titre du Coupon";
        hlpContent.innerText = "Ex: Bon pour un massage";
    } else if (rewardType === 'image') {
        lblContent.innerText = "Lien de l'image";
        hlpContent.innerText = "https://...";
    } else if (rewardType === 'video') {
        lblContent.innerText = "Lien Youtube ou ID";
        hlpContent.innerText = "Colle le lien complet, ça marchera !";
    } else {
        lblContent.innerText = "Ton Message";
        hlpContent.innerText = "";
    }
}

function saveCurrentDay() {
    currentConfig.gameType = document.getElementById('edit-gameType').value;
    currentConfig.question = document.getElementById('edit-question').value;
    currentConfig.answer = document.getElementById('edit-answer').value;
    
    currentConfig.reward.type = document.getElementById('edit-rewardType').value;
    currentConfig.reward.content = document.getElementById('edit-content').value;
    currentConfig.reward.text = document.getElementById('edit-subtext').value;

    const idx = calendarData.findIndex(d => d.day === currentDayIndex);
    if(idx >= 0) calendarData[idx] = currentConfig;
    else calendarData.push(currentConfig);

    renderAdminGrid();
    initCalendar();
    
    const btn = document.querySelector('.save-day-btn');
    const oldText = btn.innerText;
    btn.innerText = "Sauvegardé !";
    btn.style.background = "#15803d";
    setTimeout(() => { btn.innerText = oldText; btn.style.background = "#22c55e"; }, 1000);
}

function exportData() {
    const fileContent = `/* CONFIG GENEREE */\nconst calendarData = ${JSON.stringify(calendarData, null, 4)};\n\nconst START_MONTH = 0;\nconst START_YEAR = 2026;`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "data.js";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function resetProgress() {
    if(confirm("Attention : Cela va refermer toutes les cases pour toi. Continuer ?")) { 
        localStorage.clear(); 
        location.reload(); 
    }
}

// Start
initCalendar();

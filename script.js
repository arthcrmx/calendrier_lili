/* --- VARIABLES GLOBALES --- */
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

const today = new Date();
const TARGET_MONTH = 0; // Janvier
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
    if(window.lucide) lucide.createIcons();
}

function openModal(data, isReplay) {
    modal.classList.add('active');
    feedback.innerText = '';
    document.getElementById('interaction-area').innerHTML = '';

    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');

    if(isReplay || data.gameType === 'none') {
        if(!isReplay) markAsDone(data.day);
        showReward(data.reward);
        return;
    }

    gameSection.classList.remove('hidden');
    rewardSection.classList.add('hidden');
    
    if(data.gameType === 'quiz' || data.gameType === 'code') {
        title.innerText = data.gameType === 'quiz' ? "Petite Question" : "Code Secret";
        desc.innerText = data.question;

        const input = document.createElement('input');
        input.type = 'text'; input.className = 'pc-input'; input.placeholder = 'Réponse...';
        input.addEventListener("keypress", (e) => { if(e.key==="Enter") validate(input.value, data.answer, data); });
        const btn = document.createElement('button');
        btn.className = 'pc-btn'; btn.innerText = 'Valider';
        btn.onclick = () => validate(input.value, data.answer, data);

        document.getElementById('interaction-area').append(input, btn);
        setTimeout(() => input.focus(), 100); 
    }
}

function validate(val, correct, data) {
    if(val.toLowerCase().trim() === correct.toLowerCase().trim()) {
        markAsDone(data.day);
        showReward(data.reward);
    } else {
        feedback.innerText = "Non, essaie encore ❤️";
    }
}

function showReward(reward) {
    gameSection.classList.add('hidden');
    rewardSection.classList.remove('hidden');
    const display = document.getElementById('reward-display');
    
    let html = '';
    // Coupon Simple comme demandé
    if(reward.type === 'coupon') {
        html = `
        <div class="coupon-ticket">
            <div class="coupon-title">🎟️ ${reward.content}</div>
            <div class="coupon-sub">${reward.text || ''}</div>
        </div>`;
    } else if (reward.type === 'image') {
        html = `<img src="${reward.content}" style="max-width:100%; border-radius:10px; margin-top:15px"><p>${reward.text || ''}</p>`;
    } else if (reward.type === 'video') {
        html = `<div style="position:relative; padding-bottom:56.25%; height:0; margin-top:15px"><iframe src="https://www.youtube.com/embed/${reward.content}" style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:10px" frameborder="0"></iframe></div><p>${reward.text || ''}</p>`;
    } else {
        html = `<p style="font-size:1.2rem; margin-top:20px">${reward.content}</p>`;
    }
    display.innerHTML = html;
}

function markAsDone(day) { localStorage.setItem('day_'+day, 'true'); initCalendar(); }
function closeModal() { modal.classList.remove('active'); }
document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeModal(); });

/* =========================================
   PARTIE 2 : ADMIN (Clean & Dynamic)
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

// 1. AFFICHER LA GRILLE 30 JOURS
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

// 2. CHARGER L'ÉDITEUR
function loadDayEditor(day) {
    currentDayIndex = day;
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('editor-panel').classList.remove('hidden');
    document.getElementById('editor-title').innerText = `Édition du Jour ${day}`;
    
    // Highlight visuel
    renderAdminGrid();

    // Charger les données ou defaut
    const existing = calendarData.find(d => d.day === day);
    currentConfig = existing ? JSON.parse(JSON.stringify(existing)) : { 
        day: day, gameType: 'none', question: '', answer: '',
        reward: { type: 'text', content: '', text: '' }
    };

    // Remplir les champs
    document.getElementById('edit-gameType').value = currentConfig.gameType;
    document.getElementById('edit-question').value = currentConfig.question || '';
    document.getElementById('edit-answer').value = currentConfig.answer || '';
    
    document.getElementById('edit-rewardType').value = currentConfig.reward.type;
    document.getElementById('edit-content').value = currentConfig.reward.content || '';
    document.getElementById('edit-subtext').value = currentConfig.reward.text || '';

    updateFormVisibility();
}

// 3. GESTION DYNAMIQUE (LE FIX QUE TU VOULAIS)
function updateFormVisibility() {
    const gameType = document.getElementById('edit-gameType').value;
    const rewardType = document.getElementById('edit-rewardType').value;
    
    // Jeu
    const gameInputs = document.getElementById('group-game-inputs');
    if(gameType === 'none') gameInputs.classList.add('hidden');
    else gameInputs.classList.remove('hidden');

    // Récompense Labels
    const lblContent = document.getElementById('lbl-content');
    const hlpContent = document.getElementById('hlp-content');
    
    if(rewardType === 'coupon') {
        lblContent.innerText = "Titre du Coupon";
        hlpContent.innerText = "Ex: Bon pour un massage";
    } else if (rewardType === 'image') {
        lblContent.innerText = "Lien de l'image";
        hlpContent.innerText = "https://...";
    } else if (rewardType === 'video') {
        lblContent.innerText = "ID Youtube";
        hlpContent.innerText = "Code à la fin de l'URL";
    } else {
        lblContent.innerText = "Ton Message";
        hlpContent.innerText = "";
    }
}

// 4. SAUVEGARDER
function saveCurrentDay() {
    // Récupérer valeurs
    currentConfig.gameType = document.getElementById('edit-gameType').value;
    currentConfig.question = document.getElementById('edit-question').value;
    currentConfig.answer = document.getElementById('edit-answer').value;
    
    currentConfig.reward.type = document.getElementById('edit-rewardType').value;
    currentConfig.reward.content = document.getElementById('edit-content').value;
    currentConfig.reward.text = document.getElementById('edit-subtext').value;

    // Save in array
    const idx = calendarData.findIndex(d => d.day === currentDayIndex);
    if(idx >= 0) calendarData[idx] = currentConfig;
    else calendarData.push(currentConfig);

    // Feedback
    renderAdminGrid();
    initCalendar(); // Update site derriere
    
    const btn = document.querySelector('.save-day-btn');
    const oldText = btn.innerText;
    btn.innerText = "Sauvegardé !";
    btn.style.background = "#15803d";
    setTimeout(() => { btn.innerText = oldText; btn.style.background = "#22c55e"; }, 1000);
}

// 5. EXPORT
function exportData() {
    const fileContent = `/* CONFIG GENEREE */\nconst calendarData = ${JSON.stringify(calendarData, null, 4)};\n\nconst START_MONTH = 0;\nconst START_YEAR = 2026;`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "data.js";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function resetProgress() {
    if(confirm("Tout effacer ?")) { localStorage.clear(); location.reload(); }
}

// Start
initCalendar();

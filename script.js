/* --- VARIABLES GLOBALES --- */
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

const today = new Date();
const TARGET_MONTH = 0; // Janvier
const TARGET_YEAR = 2026;

// État de l'éditeur
let currentEditDay = 1;
let tempConfig = {}; // Stocke les modifs en cours

/* =========================================
   PARTIE 1 : LOGIQUE PUBLIQUE (CALENDRIER)
   ========================================= */

function initCalendar() {
    grid.innerHTML = '';
    // Trie par jour
    calendarData.sort((a,b) => a.day - b.day);

    for(let i=1; i<=30; i++) {
        // Trouve la config ou met une par défaut
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

    // Si pas de jeu ou replay, on montre direct la récompense
    if(isReplay || data.gameType === 'none') {
        if(!isReplay) markAsDone(data.day);
        showReward(data.reward);
        return;
    }

    // Affiche le jeu
    gameSection.classList.remove('hidden');
    rewardSection.classList.add('hidden');
    
    if(data.gameType === 'quiz' || data.gameType === 'code') {
        title.innerText = data.gameType === 'quiz' ? "Petite Question" : "Code Secret";
        desc.innerText = data.question;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'pc-input';
        input.placeholder = 'Réponse...';
        input.addEventListener("keypress", (e) => { if(e.key==="Enter") validate(input.value, data.answer, data); });

        const btn = document.createElement('button');
        btn.className = 'pc-btn';
        btn.innerText = 'Valider';
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
    if(reward.type === 'coupon') {
        html = `
        <div class="coupon-ticket">
            <div class="coupon-header">BON CADEAU</div>
            <div class="coupon-title">${reward.content}</div>
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

function markAsDone(day) {
    localStorage.setItem('day_'+day, 'true');
    initCalendar();
}
function closeModal() { modal.classList.remove('active'); }
document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeModal(); });


/* =========================================
   PARTIE 2 : LOGIQUE ADMIN (NOUVEL ÉDITEUR)
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
    if(pass === "amour") { // MOT DE PASSE
        document.getElementById('admin-login-screen').classList.add('hidden');
        document.getElementById('admin-workspace').classList.remove('hidden');
        renderAdminGrid();
    } else {
        document.getElementById('login-error').innerText = "Mauvais mot de passe";
    }
}
function handleLogin(e) { if(e.key === "Enter") checkAdmin(); }

// 1. AFFICHER LA GRILLE ADMIN
function renderAdminGrid() {
    const gridEl = document.getElementById('admin-grid');
    gridEl.innerHTML = '';
    
    for(let i=1; i<=30; i++) {
        // Vérifie si configuré
        const exists = calendarData.find(d => d.day === i);
        const card = document.createElement('div');
        card.className = `day-mini-card ${exists ? 'configured' : ''}`;
        card.onclick = () => openEditorForDay(i);
        
        card.innerHTML = `
            <h4>Jour ${i}</h4>
            <div class="day-status">
                <div class="status-dot"></div>
                <span>${exists ? 'Prêt' : 'Vide'}</span>
            </div>
        `;
        gridEl.appendChild(card);
    }
}

// 2. OUVRIR L'ÉDITEUR POUR UN JOUR
function openEditorForDay(day) {
    currentEditDay = day;
    document.getElementById('drawer-title').innerText = `Édition Jour ${day}`;
    
    // Récupérer données ou créer défaut
    const existing = calendarData.find(d => d.day === day);
    tempConfig = existing ? JSON.parse(JSON.stringify(existing)) : { 
        day: day, 
        gameType: 'none', 
        question: '', answer: '',
        reward: { type: 'text', content: '', text: '' }
    };

    // Remplir le formulaire avec les valeurs
    // Jeu
    setGameType(tempConfig.gameType, null); // Visuel update
    document.getElementById('edit-question').value = tempConfig.question || '';
    document.getElementById('edit-answer').value = tempConfig.answer || '';
    
    // Récompense
    setRewardType(tempConfig.reward.type, null);
    document.getElementById('edit-content').value = tempConfig.reward.content || '';
    document.getElementById('edit-subtext').value = tempConfig.reward.text || '';

    // Ouvrir le panneau
    document.getElementById('editor-drawer').classList.add('open');
    
    // Highlight grille
    document.querySelectorAll('.day-mini-card').forEach(c => c.classList.remove('selected'));
    // (Optionnel: ajouter selected class au bon index)
    
    updatePreview();
}

function closeDrawer() {
    document.getElementById('editor-drawer').classList.remove('open');
}

// 3. GESTION DU FORMULAIRE
function setGameType(type, element) {
    tempConfig.gameType = type;
    
    // Update UI Cards
    document.querySelectorAll('#game-selector .type-card').forEach(c => c.classList.remove('selected'));
    if(element) element.classList.add('selected');
    else {
        const target = document.querySelector(`#game-selector .type-card[data-val="${type}"]`);
        if(target) target.classList.add('selected');
    }

    // Montrer/Cacher champs
    const fields = document.getElementById('game-fields');
    if(type === 'none') fields.classList.add('hidden');
    else fields.classList.remove('hidden');
}

function setRewardType(type, element) {
    tempConfig.reward.type = type;
    
    // UI
    document.querySelectorAll('#reward-selector .type-card').forEach(c => c.classList.remove('selected'));
    if(element) element.classList.add('selected');
    else {
        const target = document.querySelector(`#reward-selector .type-card[data-val="${type}"]`);
        if(target) target.classList.add('selected');
    }

    // Labels contextuels
    const lbl = document.getElementById('content-label');
    const helper = document.getElementById('helper-text');
    const preview = document.getElementById('coupon-preview-container');

    preview.classList.add('hidden'); // Reset

    if(type === 'coupon') {
        lbl.innerText = "Titre du Bon";
        helper.innerText = "Ex: Massage, Resto, Ciné...";
        preview.classList.remove('hidden');
    } else if(type === 'image') {
        lbl.innerText = "Lien de l'image";
        helper.innerText = "https://...";
    } else if(type === 'video') {
        lbl.innerText = "ID Youtube";
        helper.innerText = "Ex: dQw4w9WgXcQ (Juste le code à la fin)";
    } else {
        lbl.innerText = "Ton message";
        helper.innerText = "";
    }
}

function updatePreview() {
    const content = document.getElementById('edit-content').value;
    const sub = document.getElementById('edit-subtext').value;
    
    // Update config object temps réel
    tempConfig.reward.content = content;
    tempConfig.reward.text = sub;
    tempConfig.question = document.getElementById('edit-question').value;
    tempConfig.answer = document.getElementById('edit-answer').value;

    // Visual Preview
    document.getElementById('preview-title').innerText = content || "Titre...";
    document.getElementById('preview-sub').innerText = sub || "Détails...";
}

// 4. SAUVEGARDER LE JOUR
function saveCurrentDay() {
    // 1. Trouve l'index si existe
    const index = calendarData.findIndex(d => d.day === currentEditDay);
    
    if(index >= 0) {
        calendarData[index] = JSON.parse(JSON.stringify(tempConfig));
    } else {
        calendarData.push(JSON.parse(JSON.stringify(tempConfig)));
    }
    
    // Feedback visuel
    renderAdminGrid();
    closeDrawer();
    initCalendar(); // Rafraichir le site derrière
    
    // Petit flash vert
    const btn = document.querySelector('.save-btn');
    const originalText = btn.innerText;
    btn.innerText = "Sauvegardé !";
    btn.style.background = "#15803d";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "#22c55e";
    }, 1000);
}

// 5. EXPORT FINAL
function exportData() {
    const fileContent = `/* CONFIGURATION GÉNÉRÉE PAR L'ADMIN */\nconst calendarData = ${JSON.stringify(calendarData, null, 4)};\n\nconst START_MONTH = 0;\nconst START_YEAR = 2026;`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function resetProgress() {
    if(confirm("Effacer toutes les cases ouvertes ?")) {
        localStorage.clear();
        location.reload();
    }
}

// INIT
initCalendar();

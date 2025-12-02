/* --- VARIABLES GLOBALES --- */
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

const today = new Date();
const TARGET_MONTH = 0; // Janvier
const TARGET_YEAR = 2026;

/* --- ADMIN --- */
function openAdmin() {
    document.getElementById('admin-interface').classList.remove('hidden');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-editor').classList.add('hidden');
}

function closeAdmin() {
    document.getElementById('admin-interface').classList.add('hidden');
}

function checkAdmin() {
    const pass = document.getElementById('admin-pass').value;
    // MOT DE PASSE : Change "amour" par ce que tu veux
    if(pass === "amour") {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-editor').classList.remove('hidden');
        loadEditor();
    } else {
        document.getElementById('admin-error').innerText = "Mauvais mot de passe !";
    }
}

/* GÉNÉRATEUR D'ÉDITEUR (La partie magique) */
function loadEditor() {
    const list = document.getElementById('editor-list');
    list.innerHTML = '';

    calendarData.forEach((dayData, index) => {
        const div = document.createElement('div');
        div.className = 'day-editor';
        div.innerHTML = `
            <h3>Jour ${dayData.day}</h3>
            
            <div class="form-group">
                <label>Type de Jeu</label>
                <select onchange="updateRow(${index}, 'gameType', this.value)">
                    <option value="none" ${dayData.gameType === 'none' ? 'selected' : ''}>Aucun (Cadeau direct)</option>
                    <option value="quiz" ${dayData.gameType === 'quiz' ? 'selected' : ''}>Quiz (Question/Réponse)</option>
                    <option value="code" ${dayData.gameType === 'code' ? 'selected' : ''}>Code Secret</option>
                </select>
            </div>

            <div class="form-group">
                <label>Question / Indice</label>
                <input type="text" value="${dayData.question || ''}" onchange="updateRow(${index}, 'question', this.value)" placeholder="La question...">
            </div>
            <div class="form-group">
                <label>Réponse attendue</label>
                <input type="text" value="${dayData.answer || ''}" onchange="updateRow(${index}, 'answer', this.value)" placeholder="La réponse...">
            </div>

            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px 0;">

            <div class="form-group">
                <label>Type de Récompense</label>
                <select onchange="updateRow(${index}, 'rewardType', this.value)">
                    <option value="text" ${dayData.reward.type === 'text' ? 'selected' : ''}>Texte Simple</option>
                    <option value="image" ${dayData.reward.type === 'image' ? 'selected' : ''}>Image (Lien)</option>
                    <option value="video" ${dayData.reward.type === 'video' ? 'selected' : ''}>Vidéo YouTube</option>
                    <option value="coupon" ${dayData.reward.type === 'coupon' ? 'selected' : ''}>🎫 BON POUR (Ticket d'Or)</option>
                </select>
            </div>

            <div class="form-group">
                <label>Contenu (Texte, Lien Image, ID Youtube ou Titre du Bon)</label>
                <input type="text" value="${dayData.reward.content || ''}" onchange="updateRow(${index}, 'rewardContent', this.value)">
            </div>
            
            <div class="form-group">
                <label>Petit message en dessous (optionnel)</label>
                <input type="text" value="${dayData.reward.text || ''}" onchange="updateRow(${index}, 'rewardText', this.value)">
            </div>
        `;
        list.appendChild(div);
    });
}

function updateRow(index, field, value) {
    // Met à jour la variable locale calendarData
    if(field === 'gameType') calendarData[index].gameType = value;
    if(field === 'question') calendarData[index].question = value;
    if(field === 'answer') calendarData[index].answer = value;
    
    // Pour la récompense, c'est un sous-objet
    if(field === 'rewardType') calendarData[index].reward.type = value;
    if(field === 'rewardContent') calendarData[index].reward.content = value;
    if(field === 'rewardText') calendarData[index].reward.text = value;
}

function saveChanges() {
    // Génère le contenu du fichier data.js
    const fileContent = `/* CONFIGURATION GÉNÉRÉE PAR L'ADMIN */\nconst calendarData = ${JSON.stringify(calendarData, null, 4)};\n\nconst START_MONTH = 0;\nconst START_YEAR = 2026;`;
    
    // Crée un fichier téléchargeable
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert("Fichier 'data.js' téléchargé ! \n⚠️ MAINTENANT : Prends ce fichier et remplace l'ancien dans ton dossier ou sur GitHub !");
}

/* --- LOGIQUE CALENDRIER CLASSIQUE --- */

function initSnow() {
    const container = document.getElementById('snow-container');
    if(!container) return;
    container.innerHTML = '';
    for(let i=0; i<20; i++) { 
        const fl = document.createElement('div');
        fl.className = 'snowflake';
        fl.innerText = '❄';
        fl.style.left = Math.random() * 100 + 'vw';
        fl.style.fontSize = (Math.random() * 10 + 10) + 'px';
        fl.style.animationDuration = (Math.random() * 5 + 8) + 's';
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
        input.type = 'text';
        input.className = 'pc-input';
        input.placeholder = 'Votre réponse...';
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") validate(input.value, data.answer, data);
        });

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

    if(reward.type === 'coupon') {
        // AFFICHAGE SPÉCIAL POUR LES BONS
        html = `
        <div class="coupon-ticket">
            <div class="coupon-header">Bon Cadeau</div>
            <div class="coupon-title">${reward.content}</div>
            <div class="coupon-sub">${reward.text || "Valable dès mon retour ❤️"}</div>
        </div>`;
    } 
    else if(reward.type === 'text') {
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

document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeModal(); });

initSnow();
initCalendar();

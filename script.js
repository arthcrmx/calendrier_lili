const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameSection = document.getElementById('game-section');
const rewardSection = document.getElementById('reward-section');
const feedback = document.getElementById('feedback-msg');

const today = new Date();
const TARGET_MONTH = 0; // Janvier
const TARGET_YEAR = 2026;

/* --- FONCTION DE RESET (La nouveauté) --- */
function resetCalendar() {
    if(confirm("Tu es sûr de vouloir TOUT refermer ? Ça effacera ta progression.")) {
        localStorage.clear();
        location.reload();
    }
}

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
    if(pass === "amour") {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-editor').classList.remove('hidden');
        loadEditor();
    } else {
        document.getElementById('admin-error').innerText = "Mauvais mot de passe !";
    }
}

function loadEditor() {
    const list = document.getElementById('editor-list');
    list.innerHTML = '';

    calendarData.forEach((dayData, index) => {
        const div = document.createElement('div');
        div.className = 'day-editor';
        div.innerHTML = `
            <h3>Jour ${dayData.day}</h3>
            <div style="display:flex; gap:10px; margin-bottom:10px">
                <select style="padding:5px" onchange="updateRow(${index}, 'gameType', this.value)">
                    <option value="none" ${dayData.gameType === 'none' ? 'selected' : ''}>Cadeau Direct</option>
                    <option value="quiz" ${dayData.gameType === 'quiz' ? 'selected' : ''}>Quiz</option>
                    <option value="code" ${dayData.gameType === 'code' ? 'selected' : ''}>Code Secret</option>
                </select>
                <input type="text" style="flex:1; padding:5px" value="${dayData.question || ''}" placeholder="Question..." onchange="updateRow(${index}, 'question', this.value)">
                <input type="text" style="flex:1; padding:5px" value="${dayData.answer || ''}" placeholder="Réponse..." onchange="updateRow(${index}, 'answer', this.value)">
            </div>
            <div style="display:flex; gap:10px">
                <select style="padding:5px" onchange="updateRow(${index}, 'rewardType', this.value)">
                    <option value="text" ${dayData.reward.type === 'text' ? 'selected' : ''}>Texte</option>
                    <option value="image" ${dayData.reward.type === 'image' ? 'selected' : ''}>Image</option>
                    <option value="video" ${dayData.reward.type === 'video' ? 'selected' : ''}>Vidéo</option>
                    <option value="coupon" ${dayData.reward.type === 'coupon' ? 'selected' : ''}>BON (Ticket)</option>
                </select>
                <input type="text" style="flex:1; padding:5px" value="${dayData.reward.content || ''}" placeholder="Contenu/Titre..." onchange="updateRow(${index}, 'rewardContent', this.value)">
            </div>
        `;
        list.appendChild(div);
    });
}

function updateRow(index, field, value) {
    if(field === 'gameType') calendarData[index].gameType = value;
    if(field === 'question') calendarData[index].question = value;
    if(field === 'answer') calendarData[index].answer = value;
    if(field === 'rewardType') calendarData[index].reward.type = value;
    if(field === 'rewardContent') calendarData[index].reward.content = value;
}

function saveChanges() {
    const fileContent = `/* CONFIG GENEREE */\nconst calendarData = ${JSON.stringify(calendarData, null, 4)};\n\nconst START_MONTH = 0;\nconst START_YEAR = 2026;`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("Sauvegardé ! Remplace le fichier data.js");
}

/* --- CALENDRIER --- */
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
        title.innerText = data.gameType === 'quiz' ? "Question" : "Code Secret";
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
    
    if(reward.type === 'coupon') {
        display.innerHTML = `
        <div style="background:#fffaf0; border:2px dashed #d4af37; padding:20px; border-radius:10px; margin-top:20px; color:#5a4a42">
            <div style="color:#d4af37; font-weight:bold; letter-spacing:2px; border-bottom:1px dashed #d4af37; display:inline-block; margin-bottom:10px">BON CADEAU</div>
            <div style="font-family:'Playfair Display'; font-size:2rem; margin:10px 0">${reward.content}</div>
            <div style="font-style:italic; color:#c0392b">${reward.text || ''}</div>
        </div>`;
    } else {
        display.innerHTML = `<p style="font-size:1.2rem; margin-top:20px">${reward.content}</p>`;
        if(reward.type === 'image') display.innerHTML = `<img src="${reward.content}" style="max-width:100%; border-radius:10px; margin-top:15px">`;
    }
}

function markAsDone(day) {
    localStorage.setItem('day_'+day, 'true');
    initCalendar();
}

function closeModal() {
    modal.classList.remove('active');
}

document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeModal(); });

// Démarrage sans neige
initCalendar();

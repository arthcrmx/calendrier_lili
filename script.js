const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const gameView = document.getElementById('game-view');
const rewardView = document.getElementById('reward-view');

// Initialisation
const today = new Date();
// Pour tester, décommente la ligne dessous :
// const today = new Date(2026, 0, 15); 

function init() {
    grid.innerHTML = '';
    
    // Génère les 30 cases
    for (let i = 1; i <= 30; i++) {
        const data = calendarData.find(d => d.day === i) || {};
        const el = document.createElement('div');
        el.className = 'day-card';
        
        // Verrouillage temporel
        const isLocked = (today.getMonth() !== START_MONTH || today.getFullYear() !== START_YEAR || today.getDate() < i);
        
        if (isLocked) {
            el.classList.add('locked');
            el.innerHTML = `<span class="day-number">${i}</span><i data-lucide="lock" class="day-icon"></i>`;
            el.onclick = () => alert("Chut... Pas encore ! 🤫");
        } else {
            // Case ouverte ou à ouvrir
            // On vérifie si c'est déjà gagné dans le stockage du navigateur
            const isDone = localStorage.getItem(`day_${i}_done`);
            
            if(isDone) {
                el.classList.add('done');
                el.style.background = "rgba(255, 255, 255, 0.3)";
                el.innerHTML = `<span class="day-number">${i}</span><i data-lucide="check" class="day-icon"></i>`;
                el.onclick = () => showReward(data.reward); // Revoir la récompense
            } else {
                el.innerHTML = `<span class="day-number">${i}</span><i data-lucide="gift" class="day-icon"></i>`;
                el.onclick = () => launchGame(data);
            }
        }
        grid.appendChild(el);
    }
    lucide.createIcons();
}

function launchGame(data) {
    if (!data) return;
    
    // Reset vues
    modal.classList.add('active');
    gameView.classList.remove('hidden');
    rewardView.classList.add('hidden');
    
    const title = document.getElementById('game-title');
    const instruction = document.getElementById('game-instruction');
    const interface = document.getElementById('game-interface');
    const feedback = document.getElementById('feedback-msg');
    
    feedback.innerText = "";
    interface.innerHTML = "";

    // Moteur de Jeu
    if (data.gameType === 'none') {
        // Pas de jeu, on gagne direct
        markAsDone(data.day);
        showReward(data.reward);
        return;
    } 
    
    if (data.gameType === 'quiz' || data.gameType === 'code') {
        title.innerText = data.gameType === 'quiz' ? "Petite Question..." : "Code Secret";
        instruction.innerText = data.question;
        
        const input = document.createElement('input');
        input.type = "text";
        input.placeholder = "Ta réponse...";
        
        const btn = document.createElement('button');
        btn.className = "game-btn";
        btn.innerText = "Valider";
        
        btn.onclick = () => {
            if (input.value.toLowerCase().trim() === data.answer.toLowerCase().trim()) {
                feedback.style.color = "#a8edea";
                feedback.innerText = "Bravo !";
                setTimeout(() => {
                    markAsDone(data.day);
                    showReward(data.reward);
                }, 800);
            } else {
                feedback.style.color = "#ff9a9e";
                feedback.innerText = "Oups... essaie encore ❤️";
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        };
        
        interface.appendChild(input);
        interface.appendChild(btn);
    }
}

function showReward(reward) {
    gameView.classList.add('hidden');
    rewardView.classList.remove('hidden');
    
    const contentDiv = document.getElementById('reward-content');
    let html = "";
    
    if (reward.type === 'text') {
        html = `<p style="font-size:1.2rem; margin-top:20px;">${reward.content}</p>`;
    } else if (reward.type === 'image') {
        html = `<img src="${reward.content}" alt="Surprise"><p>${reward.text || ''}</p>`;
    } else if (reward.type === 'video') {
        html = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin-top:20px;">
                    <iframe src="https://www.youtube.com/embed/${reward.content}" style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:12px;" frameborder="0" allowfullscreen></iframe>
                </div><p>${reward.text || ''}</p>`;
    }
    
    contentDiv.innerHTML = html;
}

function markAsDone(dayId) {
    localStorage.setItem(`day_${dayId}_done`, "true");
    init(); // Rafraichir la grille
}

function closeModal() {
    modal.classList.remove('active');
}

init();

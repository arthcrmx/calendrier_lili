/* CONFIG GENEREE */
const calendarData = [
    {
        "day": 1,
        "gameType": "none",
        "reward": {
            "type": "text",
            "content": "Pour ce premier jour, un petit cadeau pour fêter ce nouvel an.",
            "text": "je reviens dans 5 minutes !"
        },
        "question": "",
        "answer": ""
    },
    {
        "day": 2,
        "gameType": "quiz",
        "question": "Quel est ma couleur préférée ? (je change tout le temps donc bon courage)",
        "answer": "Rose",
        "reward": {
            "type": "coupon",
            "content": "10 minutes de massage !",
            "text": "Pour te déstresser avant ton voyage retour."
        }
    },
    {
        "day": 3,
        "gameType": "code",
        "question": "mon code de téléphone",
        "answer": "050206",
        "reward": {
            "type": "video",
            "content": "https://youtu.be/HVQSbgG69Sc?si=vWDEELTCtUJ-q_W8",
            "text": "lol, il va pas y avoir des trucs gratuits tous les jours heinn"
        }
    },
    {
        "day": 4,
        "gameType": "quiz",
        "question": "Quel est mon jeu vidéo favori ? (nom complet)",
        "answer": "Red Dead Redemption 2",
        "reward": {
            "type": "image",
            "content": "photos/jeu.jpg",
            "text": "On y jouera ensemble un jour !"
        }
    },
    {
        "day": 5,
        "gameType": "none",
        "reward": {
            "type": "coupon",
            "content": "Bon pour 1h30 de jeux/film/vidéo avec ton Tutur !",
            "text": "Pour te récompenser de ton travail pour ce partiel , plus qu'un !! Je t'aime mon coeur"
        },
        "question": "",
        "answer": ""
    },
    {
        "day": 6,
        "gameType": "quiz",
        "question": "Résous cette opération : (15 * 4 - 24) / 3",
        "answer": "12",
        "reward": {
            "type": "text",
            "content": "bravo ! c'est même pas la taille du zizi de ton mec en centimètres, t'as pas honte ?",
            "text": ""
        }
    },
    {
        "day": 7,
        "gameType": "none",
        "reward": {
            "type": "coupon",
            "content": "Bon pour un copain qui sait être présent émotionnellement et qui te parle de ses sentiments.",
            "text": "Bon courage pour ta journée mon coeur"
        },
        "question": "",
        "answer": ""
    },
    {
        "day": 8,
        "gameType": "none",
        "reward": {
            "type": "text",
            "content": "Indice sur la date de mon retour",
            "text": "Le 9ème d'une lignée infinie"
        },
        "question": "",
        "answer": ""
    },
    {
        "day": 9,
        "gameType": "none",
        "reward": {
            "type": "image",
            "content": "photos/20251029_140639.jpg",
            "text": "j'ai pas pu mettre de question parce que tu as déjà ouvert la case donc pour la peine voici ce magnifique cliché de ton merveilleux copain"
        },
        "question": "",
        "answer": ""
    },
    {
        "day": 10,
        "gameType": "code",
        "question": "jour de emma (la mienne) + 2, mois de valérie - mois de JR, année de vic + 14, la réponse devrait te faire penser à quelque chose hihi (écris au format JJMMAA)",
        "answer": "290825",
        "reward": {
            "type": "image",
            "content": "photos/20260109_231607.jpg",
            "text": "Les doudous et moi te souhaitons une journée merveilleuse et rayonnante (comme toi), je t'aimeeee j'ai hate de te revoir !!!!"
        }
    },
    {
        "day": 11,
        "gameType": "quiz",
        "question": "Quel a été ma note finale au bac ?",
        "answer": "14.5",
        "reward": {
            "type": "coupon",
            "content": "Bon pour une lettre sentimentale à devoir écrire instantanément",
            "text": ""
        }
    },
    {
        "day": 12,
        "gameType": "none",
        "reward": {
            "type": "text",
            "content": "Indice sur la date de mon retour n°2",
            "text": "Résous cette intégrale pour obtenir le code : Prout + pipi - caca = ?"
        },
        "question": "",
        "answer": ""
    },
    {
        "day": 13,
        "gameType": "quiz",
        "question": "Quelle est la fille la plus forte du monde ?",
        "answer": "Line",
        "reward": {
            "type": "text",
            "content": "Voici une liste d'adjectifs originaux qui je trouve te correspondent. (Je te laisse le plaisir d'aller chercher leur sens) : Inextinguible, Thaumaturge, Résiliente, Magnanime, Sagace, Réflexive, Coruscante, Souveraine, Insubmersible, Idoine, Paradigmatique, Inaltérable, Onirique, Pétulante, Radieuse, Sempiternelle, Intrépide, Majestueuse, Singulière, Infrangible.",
            "text": ""
        }
    },
    {
        "day": 14,
        "gameType": "code",
        "question": "Logique matricielle : [Ligne 1 : 8, 5, 3] | [Ligne 2 : 9, 2, 7] | [Ligne 3 : 14, 6, X]. Trouve X.",
        "answer": "8",
        "reward": {
            "type": "coupon",
            "content": "Bon pour 1 journée sans téléphone",
            "text": ""
        }
    },
    {
        "day": 16,
        "gameType": "quiz",
        "question": "Le nom de mon 2eme chat",
        "answer": "Ollie",
        "reward": {
            "type": "coupon",
            "content": "Bon pour une session dessin ensemble",
            "text": ""
        }
    },
    {
        "day": 17,
        "gameType": "none",
        "question": "",
        "answer": "",
        "reward": {
            "type": "coupon",
            "content": "Bon pour 2h ou je dois dire oui a tout (dans la limite du raisonnable gros caca",
            "text": "je t'aime mon petit prout sauvage"
        }
    },
    {
        "day": 18,
        "gameType": "quiz",
        "question": "Quel est mon humain préféré dans le monde tout entier",
        "answer": "Lili",
        "reward": {
            "type": "text",
            "content": "J'AI TELLEMENT HATE QU'ON HABITE ENSEMBLE ET DE RENTRER ET TE REVOIR QUE CA PASSE VITE SVPPPPP",
            "text": "tu me manques trop"
        }
    },
    {
        "day": 19,
        "gameType": "none",
        "question": "",
        "answer": "",
        "reward": {
            "type": "text",
            "content": "On s'aimera toujours et pour toute la vie et ca changera jamais",
            "text": "Line Marie Averty Bonnefoy l'amour de ma vie"
        }
    },
    {
        "day": 20,
        "gameType": "none",
        "question": "",
        "answer": "",
        "reward": {
            "type": "coupon",
            "content": "Bon pour une activité de ton choix au moment ou tu le desires !",
            "text": "Ca peut etre de tout type donc choisis bien hihihi"
        }
    }
];

const START_MONTH = 0;
const START_YEAR = 2026;

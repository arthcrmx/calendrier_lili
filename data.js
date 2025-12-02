/* CONFIGURATION DES 30 JOURS 
    Tu peux modifier ce fichier à tout moment sur GitHub, 
    et le site se mettra à jour.
*/

const calendarData = [
    {
        day: 1,
        gameType: "none", // Pas de jeu, ouverture directe
        reward: {
            type: "text",
            content: "Bienvenue mon amour. C'est le début du compte à rebours. Courage, je suis fier de toi."
        }
    },
    {
        day: 2,
        gameType: "quiz",
        question: "Quel est le nom du restaurant de notre premier date ?",
        answer: "Luigi", // La réponse attendue (insensible aux majuscules)
        reward: {
            type: "image",
            content: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
            text: "C'était magique. J'ai hâte d'y retourner avec toi."
        }
    },
    {
        day: 3,
        gameType: "code",
        question: "Quel est le code secret ? (Indice : Le jour de mon retour)",
        answer: "3001", 
        reward: {
            type: "video",
            content: "ID_VIDEO_YOUTUBE", // Mets l'ID youtube ici
            text: "Une petite chanson pour te donner du courage."
        }
    },
    // ... Copie colle les blocs pour faire les 30 jours !
];

// Configuration Date
const START_MONTH = 0; // 0 = Janvier
const START_YEAR = 2026;

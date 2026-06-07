// YouTube URL validation and transcript extraction service

export const isValidYouTubeUrl = (url: string): boolean => {
    const patterns = [
        /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
        /^https?:\/\/youtu\.be\/[\w-]+/,
        /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];

    return patterns.some(pattern => pattern.test(url));
};

export const extractVideoId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

// Mock transcript extraction - will need real API integration
export const getTranscript = async (url: string): Promise<string> => {
    if (!isValidYouTubeUrl(url)) {
        throw new Error('URL YouTube invalide');
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
        throw new Error('Impossible d\'extraire l\'ID de la vidéo');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return mock transcript
    return `
Chers frères et sœurs,

Aujourd'hui, je voudrais partager avec vous une réflexion sur la foi qui transforme nos vies. 
Dans l'Évangile de Jean, chapitre 3, verset 16, nous lisons : "Car Dieu a tant aimé le monde 
qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait 
la vie éternelle."

Cette parole nous révèle l'amour inconditionnel de Dieu pour chacun de nous. Peu importe d'où 
nous venons, peu importe nos erreurs passées, Dieu nous aime et désire nous transformer par sa grâce.

La foi n'est pas simplement une croyance intellectuelle, c'est une relation vivante avec Dieu. 
C'est cette foi qui nous permet de vivre dans l'espérance, même dans les moments difficiles.

Comme le dit l'apôtre Paul dans Romains 8:28 : "Nous savons, du reste, que toutes choses concourent 
au bien de ceux qui aiment Dieu." Cette promesse nous rappelle que Dieu est à l'œuvre dans nos vies, 
même quand nous ne le voyons pas.

Je vous encourage cette semaine à méditer sur ces vérités et à permettre à Dieu de transformer 
votre cœur par sa Parole.

Que Dieu vous bénisse.
  `.trim();
};

// Get video metadata (title, thumbnail, etc.)
export const getVideoMetadata = async (url: string): Promise<{
    title: string;
    thumbnail: string;
    duration: string;
}> => {
    const videoId = extractVideoId(url);

    // Mock metadata
    return {
        title: 'La foi qui transforme - Prédication du dimanche',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '25:30',
    };
};

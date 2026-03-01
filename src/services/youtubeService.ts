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

// Real API integration
export const getTranscript = async (url: string): Promise<string> => {
    if (!isValidYouTubeUrl(url)) {
        throw new Error('URL YouTube invalide');
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
        throw new Error('Impossible d\'extraire l\'ID de la vidéo');
    }

    const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la récupération de la transcription.');
    }

    const data = await response.json();
    return data.transcript;
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

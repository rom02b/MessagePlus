import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=--eJy7SWCu8', { lang: 'fr' });
        console.log('RES:', transcript.slice(0, 2));
    } catch (err) {
        console.error('ERR:', err.message);
    }
}

test();

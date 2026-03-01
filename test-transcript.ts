import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=--eJy7SWCu8');
        console.log(transcript.slice(0, 5));
    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

test();

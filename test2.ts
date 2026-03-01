import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
  try {
    const res = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=--eJy7SWCu8');
    console.log('RES:', res);
  } catch (err) {
    console.error('ERR:', err.message);
  }
}

test();

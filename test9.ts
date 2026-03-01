import { Innertube } from 'youtubei.js';

async function test() {
    try {
        const youtube = await Innertube.create();
        const info = await youtube.getInfo('--eJy7SWCu8');

        const transcriptData = await info.getTranscript();
        if (transcriptData?.transcript?.content?.body?.initial_segments) {
            const texts = transcriptData.transcript.content.body.initial_segments.map(segment => segment.snippet.text).join(' ');
            console.log('Extracted using youtubei.js (len):', texts.length);
            console.log('Preview:', texts.substring(0, 100));
        } else {
            console.log('No transcript segments found');
        }
    } catch (err) {
        console.error('youtubei.js error:', err);
    }
}

test();

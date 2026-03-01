const { YoutubeTranscript } = require('youtube-transcript');
YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=--eJy7SWCu8')
  .then(console.log)
  .catch(console.error);

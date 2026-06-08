import crypto from 'crypto';
const token = 'test';
console.log(crypto.createHash('sha256').update(token).digest('hex'));

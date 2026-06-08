import * as jose from 'jose';
const token = process.argv[2];
const jwks = jose.createRemoteJWKSet(new URL('https://ep-lively-dust-a2fa7zmm.neonauth.eu-central-1.aws.neon.tech/neondb/auth/.well-known/jwks.json'));
jose.jwtVerify(token, jwks).then(res => console.log(res.payload)).catch(err => console.error(err));

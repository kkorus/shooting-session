import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

let playerId: string = process.argv[2];

if (!playerId) {
  console.log('Missing playerId argument, using default from .env:', process.env['PLAYER_ID']);
  playerId = process.env['PLAYER_ID'] as string;
}

const secret = process.env['JWT_SECRET'];
if (!secret) {
  console.log('Missing JWT_SECRET');
  process.exit(1);
}

const token = jwt.sign({ playerId }, secret, { expiresIn: '1d' });

console.log('TOKEN:');
console.log(token);

import '../config/env.config';
import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { SongModel } from '../modules/songs/song.model';
import { UserModel } from '../modules/auth/models/user.model';
import { hashPassword } from '../common/utils/password';
import { logger } from '../common/utils/logger';

const seedSongs = [
  { title: 'Binding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop' },
  { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', genre: 'Pop' },
  { title: 'Believer', artist: 'Imagine Dragons', album: 'Evolve', genre: 'Rock' },
  { title: "Someone You Loved", artist: 'Lewis Capaldi', album: 'Divinely Uninspired', genre: 'Pop' },
  { title: 'Dance Monkey', artist: 'Tones and I', album: 'The Kids Are Coming', genre: 'Pop' },
  { title: 'Havana', artist: 'Camila Cabello', album: 'Camila', genre: 'Pop' },
  { title: 'Sunflower', artist: 'Post Malone', album: "Hollywood's Bleeding", genre: 'Hip Hop' },
  { title: 'Sweater Weather', artist: 'The Neighbourhood', album: 'I Love You.', genre: 'Alternative' },
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock' },
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop' },
  { title: 'Stay', artist: 'The Kid LAROI', album: 'F*CK LOVE', genre: 'Pop' },
  { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop' },
  { title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', genre: 'R&B' },
  { title: 'MONTERO', artist: 'Lil Nas X', album: 'MONTERO', genre: 'Hip Hop' },
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop' },
  { title: 'Industry Baby', artist: 'Lil Nas X', album: 'MONTERO', genre: 'Hip Hop' },
  { title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', genre: 'Pop' },
  { title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop' },
  { title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', genre: 'Alternative' },
  { title: 'Bad Guy', artist: 'Billie Eilish', album: 'WHEN WE ALL FALL ASLEEP', genre: 'Pop' },
];

async function seed(): Promise<void> {
  await connectDatabase();

  logger.info('Seeding database...');

  // Clear existing data
  await Promise.all([SongModel.deleteMany({}), UserModel.deleteMany({})]);

  // Create demo user — password meets enterprise policy (8+ chars, upper, lower, number, special)
  const hashedPassword = await hashPassword('Admin@1234!');
  await UserModel.create({ email: 'admin@musicflow.com', password: hashedPassword });
  logger.info('Demo user created: admin@musicflow.com / Admin@1234!');

  // Seed songs
  await SongModel.insertMany(seedSongs);
  logger.info(`${seedSongs.length} songs seeded`);

  await disconnectDatabase();
  logger.info('Seeding complete!');
}

seed().catch((err) => {
  logger.error('Seeding failed:', err);
  process.exit(1);
});

import 'dotenv/config';
import { initializeDataSource } from '../app/src/data-access-layer';
import { User } from '../app/src/data-access-layer/entities';
import { DataSource } from 'typeorm';

async function main() {
  const url = process.env['DATABASE_URL_LOCALHOST'] as string;
  if (!url) {
    throw new Error('DATABASE_URL_LOCALHOST is not set in the environment variables');
  }

  let dataSource: DataSource | undefined;

  try {
    dataSource = await initializeDataSource(url);
    const userRepository = dataSource.getRepository(User);

    const users: Pick<User, 'id' | 'email'>[] = [
      { id: 'ed3b3b9e-86aa-4c03-b2de-6f97a2daeadb', email: 'player1@shooting-session.com' },
      { id: '92191863-92b4-403f-8985-7286d417354c', email: 'player2@shooting-session.com' },
      { id: '96184033-2699-4431-b1a9-8a231037078b', email: 'player3@shooting-session.com' },
    ];

    await userRepository.save(users);

    console.log('Seeded users successfully:');
    for (const user of users) {
      console.log(`User ${user.id}: ${user.email}`);
    }
    await dataSource.destroy();
    process.exit(0);
  } catch (err) {
    if (dataSource) {
      await dataSource.destroy();
    }

    throw err;
  }
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});

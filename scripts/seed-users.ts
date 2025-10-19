import 'dotenv/config';
import { User } from '../app/src/data-access-layer/entities';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmConfig } from '../app/src/data-access-layer/typeorm.config';

async function main() {
  const url = process.env['DATABASE_URL_LOCALHOST'] as string;
  if (!url) {
    throw new Error('DATABASE_URL_LOCALHOST is not set in the environment variables');
  }

  const config = getTypeOrmConfig(false, url);
  const dataSource = new DataSource(config as DataSourceOptions);

  try {
    await dataSource.initialize();
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
  } catch (err) {
    console.error('Error seeding users:', err);
    throw err;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

main()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((e) => {
    console.error('✗ Script failed');
    process.exit(1);
  });

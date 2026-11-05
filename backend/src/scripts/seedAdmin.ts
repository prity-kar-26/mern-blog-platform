import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ROLES } from '../constants/roles';
import { userRepository } from '../repositories/user.repository';

const run = async () => {
    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    }

    await connectDB();

    if (await userRepository.findByEmail(env.ADMIN_EMAIL.toLowerCase())) {
        logger.info('Admin user already exists, nothing to do');
    } else {
        await userRepository.create({
            name: 'Admin',
            email: env.ADMIN_EMAIL.toLowerCase(),
            password: await bcrypt.hash(env.ADMIN_PASSWORD, env.BCRYPT_ROUNDS),
            role: ROLES.ADMIN,
        });
        logger.info(`Admin user created: ${env.ADMIN_EMAIL}`);
    }

    await disconnectDB();
};

run().catch((err) => {
    logger.error(err);
    process.exit(1);
});
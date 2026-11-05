import type { Role } from '../constants/roles';

declare global {
    namespace Express {
        // Passport types req.user as Express.User, so the JWT user shape is declared here
        interface User {
            id: string;
            role: Role;
        }
    }
}
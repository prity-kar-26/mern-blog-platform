import { IUser, User } from '../models/user.model';

type CreateUserInput = Pick<IUser, 'name' | 'email'> &
    Partial<Pick<IUser, 'password' | 'role' | 'googleId' | 'facebookId'>>;

export const userRepository = {
    findById: (id: string) => User.findById(id),
    findByEmail: (email: string) => User.findOne({ email }),
    findByEmailWithPassword: (email: string) => User.findOne({ email }).select('+password'),
    create: (data: CreateUserInput) => User.create(data),
};
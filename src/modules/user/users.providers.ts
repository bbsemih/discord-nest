import { User } from './user.entity';
import { USER_REPOSITORY } from '../contants';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];

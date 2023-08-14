import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION, AWS } from './constants';
import { databaseConfig } from './database.config';
import { User } from 'src/modules/user/user.entity';
import { Message } from 'src/modules/message/message.entity';
import { Guild } from 'src/modules/guild/guild.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        case AWS:
          config = databaseConfig.aws;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      console.log('bilgi: ', config);
      sequelize.addModels([User, Message, Guild]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

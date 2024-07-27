import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as cls from 'cls-hooked';

import config from '../config/config';

const databaseConfig = config;
const namespace = cls.createNamespace('app-namespace');
Sequelize.useCLS(namespace);

export const databaseProviders = [
  SequelizeModule.forRootAsync({
    useFactory: async () => ({
      ...databaseConfig,
    }),
  }),
];

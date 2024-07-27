import { Module } from '@nestjs/common';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

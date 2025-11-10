import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const dbPortString = process.env.DB_PORT || '5432';
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(dbPortString, 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          autoLoadEntities: true,
          synchronize: true, // Deixar true somente para desenvolvimento, em produção desativar
        };
      },
    }),
    AuthModule,
    UsersModule,
    EnterpriseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

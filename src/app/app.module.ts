import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';
import { UsersEntity } from 'src/users/entity/users.entity';
import { PasswordResetEntity } from 'src/password-reset/entity/password-reset.entity';
import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const dbPortString = process.env.DB_PORT || '5434';
        return {
          type: 'postgres',
          host: 'localhost',
          port: parseInt(dbPortString, 10),
          username: 'admin',
          password: 'admin',
          database: 'breakflow_db',
          autoLoadEntities: true,
          entities: [UsersEntity, PasswordResetEntity, EnterpriseEntity],
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

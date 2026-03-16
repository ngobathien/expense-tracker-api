import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    // env
    ConfigModule.forRoot({ isGlobal: true, load: [] }),

    // kết nối database mongodb
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),

        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => {
            console.log('Kết nối database thành công');
          });

          // log xem MONGODB_URI từ .env
          console.log(configService.get<string>('MONGODB_URI'));
          return connection;
        },
      }),
    }),

    AuthModule,

    UsersModule,

    CategoriesModule,

    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

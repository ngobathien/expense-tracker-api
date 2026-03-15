import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/services/mail.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { Otp, OtpSchema } from './schemas/email-otp.schema';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsersModule,

    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,

      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],

  controllers: [AuthController],
  exports: [JwtModule],
  providers: [AuthService, MailService, GoogleStrategy],
})
export class AuthModule {}

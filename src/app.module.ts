import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { SessionController } from './session/session.controller';



@Module({
  imports: [UserModule],
  controllers: [AppController, UserController, SessionController],
  providers: [AppService, UserService],
})
export class AppModule {}

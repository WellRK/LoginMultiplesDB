import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/env/configuration';
import { ClientModule } from './modules/client/client.module';
import { DatabaseModule } from './modules/_database/database.module';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { EnviromentVariablesEnum } from './modules/shared/enums/enviroment.variables.enum';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration]
    }),

    DatabaseModule,
    ClientModule,


  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule { }

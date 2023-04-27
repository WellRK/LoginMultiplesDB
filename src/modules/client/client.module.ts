import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SendGridModule } from "@ntegral/nestjs-sendgrid";
import { EnviromentVariablesEnum } from "../shared/enums/enviroment.variables.enum";
import { jwtClientFactory } from "../shared/factories/jwt-factory";
import { JwtStrategyClient } from "../shared/strategies/jwt-strategy-client";
import { DatabaseModule } from "../_database/database.module";
import { AuthenticationClientController } from "./controllers/authentication-client.controller";
import { ClientController } from "./controllers/client.controller";
import { TfaController } from "./controllers/tfa.controller";
import { ClientRepository } from "./repositories/client.repository";
import { SendgridRepository } from "./repositories/send-grid.repository";
import { VerificationRepository } from "./repositories/verification.repository";
import { AuthenticationClientService } from "./services/authentication-client.service";
import { ClientService } from "./services/client.service";
import { TFAService } from "./services/tfa.service";
import { VerificationService } from "./services/verification.service";
import { S3Repository } from "../shared/repositories/s3.repository";
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtClientFactory),
    
    SendGridModule.forRootAsync({
      imports: [
        ConfigModule,
      ],
      useFactory: async (
        configService: ConfigService,
      ) => ({
        apiKey: configService.get(EnviromentVariablesEnum.SENDGRID_API_KEY),
      }),
      inject: [
        ConfigService,
      ]
    }),

    DatabaseModule,
  ],
  controllers: [
    AuthenticationClientController,
    ClientController,
    TfaController,
  ],
  providers: [
    JwtStrategyClient,
    ClientService,
    ClientRepository,
    SendgridRepository,
    VerificationRepository,
    AuthenticationClientService,
    VerificationService,
    TFAService,
    S3Repository
  ],
  exports: [
    ClientService,
    ClientRepository,
  ],
})
export class ClientModule { }
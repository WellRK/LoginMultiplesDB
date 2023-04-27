import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { EnviromentVariablesEnum } from "../../shared/enums/enviroment.variables.enum";

export const databaseAsyncConfig: MongooseModuleAsyncOptions =
{
    imports: [
        ConfigModule,
    ],
    useFactory: (
        configService: ConfigService,
    ) => ({
        uri: configService.get(EnviromentVariablesEnum.NOSQL_CONNECTION_STRING),
        useNewUrlParser: true,
    }),
    inject: [
        ConfigService,
    ]
};
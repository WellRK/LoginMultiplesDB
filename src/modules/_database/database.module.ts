import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { databaseAsyncConfig } from "./config/database.config";
import { schemasConfig } from "./config/schemas.config";

@Module({
    imports: [
        MongooseModule.forRootAsync(databaseAsyncConfig),
        MongooseModule.forFeature(schemasConfig),
    ],
    exports: [
        MongooseModule,
    ]
})
export class DatabaseModule { }
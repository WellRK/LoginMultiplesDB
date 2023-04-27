import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { EnviromentVariablesEnum } from './modules/shared/enums/enviroment.variables.enum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ServerExceptionFilter } from './modules/shared/filters/exception.filters';
import * as bodyParser from 'body-parser';

async function bootstrap() {

  const enviroment = process.env.NODE_ENV.toUpperCase();

  const keyFileExists = fs.existsSync('./../secrets/xequemate.api.key.pem');
  const certFileExists = fs.existsSync('./../secrets/xequemate.api.crt.pem');
  const httpsOptions = keyFileExists && certFileExists
    ? {
      key: fs.readFileSync('./../secrets/xequemate.api.key.pem'),
      cert: fs.readFileSync('./../secrets/xequemate.api.crt.pem'),
    }
    : null;

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const configService = app.get(ConfigService);
  const _logger = new Logger('main');

  if (configService.get<boolean>(EnviromentVariablesEnum.ENABLE_CORS)) {
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization'
    };
    app.enableCors(corsOptions);

    _logger.debug('ENABLE CORS *');
  }

  app.useGlobalFilters(new ServerExceptionFilter());
  
  if (configService.get<boolean>(EnviromentVariablesEnum.ENABLE_DOCS)) {

    const swaggerOptions = new DocumentBuilder()
      .setTitle(`Xequemate API | ${enviroment}`)
      .setVersion('0.0.1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('docs', app, document);

    _logger.debug('ENABLE DOCS');
  }

  const port = configService.get(EnviromentVariablesEnum.PORT) || 3000;
  await app.listen(port);
  _logger.log(`${enviroment} | Xequemate API started at port ${port}`);
}
bootstrap();
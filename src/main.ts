import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  const PORT = process.env.PORT;
  console.log(PORT);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('stadium project')
    .setDescription('Mini project for hospital')
    .setVersion('1.0')
    .addTag(
      `
        nodeJS, validation, postgres, JWT, Bot, SMS, Mailer, swagger, sequelizer, nestJS
    
    `,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
start();


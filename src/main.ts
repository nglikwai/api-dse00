import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Session
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.DB_URL || 'mongodb://localhost:27017/dse00',
        touchAfter: 24 * 3600,
      }),
      secret: process.env.SECRET || 'thisshouldbeabettersecret!',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  );

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('DSE00 Forum API')
    .setDescription('Forum API for DSE students - NestJS Edition')
    .setVersion('2.0')
    .addCookieAuth('session')
    .addTag('Health', 'Health check endpoint')
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Posts', 'Forum posts management')
    .addTag('Replies', 'Reply management')
    .addTag('Users', 'User profile and friend management')
    .addTag('Admin', 'Admin operations')
    .addTag('JUPAS & Shrine', 'JUPAS program data and shrine features')
    .addTag('Backup', 'Backup management')
    .addTag('Yylam', 'Yylam records')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   DSE00 Forum API - NestJS Edition                    ║
║                                                        ║
║   Health Check: http://localhost:${port}               ║
║   Swagger API:  http://localhost:${port}/api           ║
║                                                        ║
║   Features:                                            ║
║   ✓ Rate Limiting (1 msg/sec with Redis)              ║
║   ✓ Redis Caching                                      ║
║   ✓ Session-based Auth with Passport                  ║
║   ✓ Content Moderation (IP & Keyword blocking)        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
}
bootstrap();

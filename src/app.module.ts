import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { throttlerConfig } from './config/throttler.config';
import { redisConfig } from './config/redis.config';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { RepliesModule } from './modules/replies/replies.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { AdminModule } from './modules/admin/admin.module';
import { JupasModule } from './modules/jupas/jupas.module';
import { YylamModule } from './modules/yylam/yylam.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB
    MongooseModule.forRoot(process.env.DB_URL || 'mongodb://localhost:27017/dse00'),

    // Rate Limiting
    ThrottlerModule.forRoot(throttlerConfig()),

    // Redis Cache
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ...redisConfig(),
      ttl: 300, // 5 minutes default
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    PostsModule,
    RepliesModule,
    ModerationModule,
    AdminModule,
    JupasModule,
    YylamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

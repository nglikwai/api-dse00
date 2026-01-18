import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig = (): ThrottlerModuleOptions => ({
  throttlers: [
    {
      name: 'general',
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per minute
    },
  ],
});

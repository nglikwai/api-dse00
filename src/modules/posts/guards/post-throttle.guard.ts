import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class PostThrottleGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track by user ID (authenticated) or IP (anonymous)
    const userId = req.user?._id || req.ip;
    return `post-create:${userId}`;
  }
}

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user._id);
  }

  async deserializeUser(
    userId: string,
    done: (err: Error, user: any) => void,
  ): Promise<any> {
    try {
      const user = await this.authService.findById(userId);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}

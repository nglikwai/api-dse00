import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blockuser, BlockuserDocument } from './schemas/blockuser.schema';

@Injectable()
export class ModerationService {
  private readonly BLOCKED_KEYWORDS = ['http', 'king ho'];

  constructor(
    @InjectModel(Blockuser.name)
    private blockuserModel: Model<BlockuserDocument>,
  ) {}

  /**
   * Check if an IP is blocked
   */
  async isIpBlocked(ip: string): Promise<boolean> {
    const blocked = await this.blockuserModel.findOne({ ip });
    return !!blocked;
  }

  /**
   * Check if text contains blocked keywords
   */
  containsBlockedKeyword(text: string): boolean {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return this.BLOCKED_KEYWORDS.some((keyword) => lowerText.includes(keyword));
  }

  /**
   * Validate message content and IP
   * Returns true if valid, false if blocked
   */
  async validateMessage(
    title: string,
    description: string,
    display_name: string,
    ip: string,
    hasBlockedRecordInBrowser: boolean,
  ): Promise<boolean> {
    // Check keywords in title, description, and display_name
    if (
      this.containsBlockedKeyword(title) ||
      this.containsBlockedKeyword(description) ||
      this.containsBlockedKeyword(display_name)
    ) {
      await this.blockUser(title, display_name, ip);
      return false;
    }

    // Check IP blocking
    const isBlocked = await this.isIpBlocked(ip);
    if (isBlocked || hasBlockedRecordInBrowser) {
      if (!isBlocked) {
        await this.blockUser(title, display_name, ip);
      }
      return false;
    }

    return true;
  }

  /**
   * Block a user by IP
   */
  private async blockUser(title: string, display_name: string, ip: string) {
    await this.blockuserModel.create({
      title,
      display_name,
      ip,
    });
  }

  /**
   * Get all blocked users
   */
  async getAllBlockedUsers() {
    return this.blockuserModel.find();
  }
}

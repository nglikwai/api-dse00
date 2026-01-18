import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jupas, JupasDocument } from './schemas/jupas.schema';
import { Shrine, ShrineDocument } from './schemas/shrine.schema';

@Injectable()
export class JupasService {
  constructor(
    @InjectModel(Jupas.name) private jupasModel: Model<JupasDocument>,
    @InjectModel(Shrine.name) private shrineModel: Model<ShrineDocument>,
  ) {}

  // JUPAS methods
  async searchJupas(query: any) {
    const filter: any = {};
    if (query.school) filter.school = query.school;
    if (query.code) filter.code = query.code;
    if (query.year) filter.year = query.year;

    return this.jupasModel.find(filter);
  }

  async getRecentJupas() {
    return this.jupasModel.find().sort({ updatedAt: -1 }).limit(10);
  }

  async createJupas(data: any) {
    const jupas = new this.jupasModel(data);
    return jupas.save();
  }

  async updateJupasVotes(id: string, like: boolean) {
    const jupas = await this.jupasModel.findById(id);
    if (!jupas) throw new Error('JUPAS record not found');

    if (like) {
      jupas.like += 1;
    } else {
      jupas.dislike += 1;
    }

    return jupas.save();
  }

  // Shrine methods
  async getShrines(query: any) {
    const filter: any = {};
    if (query.shrine) filter.shrine = query.shrine;
    if (query.subShrine) filter.subShrine = query.subShrine;

    return this.shrineModel.find(filter);
  }

  async getShrine(id: string) {
    return this.shrineModel.findById(id);
  }

  async createShrine(data: any) {
    if (data.content && data.content.length < 3) {
      throw new Error('Content must be at least 3 characters');
    }

    const shrine = new this.shrineModel(data);
    return shrine.save();
  }

  async donateShrine(id: string) {
    const shrine = await this.shrineModel.findById(id);
    if (!shrine) throw new Error('Shrine not found');

    shrine.donation = 1;
    return shrine.save();
  }
}

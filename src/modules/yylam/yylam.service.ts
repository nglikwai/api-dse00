import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Yylam, YylamDocument } from './schemas/yylam.schema';

@Injectable()
export class YylamService {
  constructor(
    @InjectModel(Yylam.name) private yylamModel: Model<YylamDocument>,
  ) {}

  async findAll() {
    return this.yylamModel.find();
  }

  async create(data: any) {
    const yylam = new this.yylamModel(data);
    return yylam.save();
  }
}

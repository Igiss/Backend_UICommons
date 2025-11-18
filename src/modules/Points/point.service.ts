import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPointsHistory } from './point.schema';

interface TotalPointsResult {
  _id: null;
  total: number;
}

@Injectable()
export class UserPointsService {
  constructor(
    @InjectModel(UserPointsHistory.name)
    private readonly pointsModel: Model<UserPointsHistory>,
  ) {}

  async addPoint(
    userId: string,
    componentId: string,
    action: 'view' | 'favourite' | 'unfavourite',
    points: number,
  ): Promise<UserPointsHistory> {
    return this.pointsModel.create({
      userId,
      componentId,
      action,
      points,
    });
  }

  async getTotalPoints(userId: string): Promise<number> {
    const result = await this.pointsModel.aggregate<TotalPointsResult>([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}

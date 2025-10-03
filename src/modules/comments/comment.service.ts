import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}
  async create(createCommentDto: any): Promise<Comment> {
    const createdComment = new this.commentModel(createCommentDto);
    return createdComment.save();
  }
  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }
  async findOne(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }
  async update(id: string, updateData: Partial<any>): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
  async remove(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }
}

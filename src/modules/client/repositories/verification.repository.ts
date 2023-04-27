import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { ClientInterface } from '../interface/user.interface';
import { VerificationInterface } from '../interface/verification.interface';
import { Verification } from '../schemas/verification.schema';

@Injectable()
export class VerificationRepository extends BaseRepository<VerificationInterface> {
  constructor(
    @InjectModel(Verification.name) //DBConnectionEnum.BACKOFFICE_DB
    private readonly model: Model<VerificationInterface>,
  ) {
    super(model);
  }

//   async getByUser<T>(
//     user: T | ClientInterface,
//   ): Promise<VerificationInterface> {
//     return await this.model.findOne({ user }).populate('user');
//   }

  async incrementAttempt(_id: string, attempt: number) {
    return await this.model.findOneAndUpdate(
      { _id },
      {
        $set: {
          attempt,
        },
      },
    );
  }
}
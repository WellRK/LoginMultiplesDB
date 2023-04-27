import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import NumberUtil from 'src/modules/shared/utils/number.util';
import { BaseRepository } from '../../shared/repositories/base.repository';
import { UserUpdatePasswordRequestDto } from '../dtos/user-update-password-request.dto';
import { ClientStatusEnum } from '../enums/client-status.enum';
import { ClientInterface } from '../interface/user.interface';
import { VerificationInterface } from '../interface/verification.interface';
import { Client } from '../schemas/client.chema';

@Injectable()
export class ClientRepository extends BaseRepository<ClientInterface> {

  //findOneAndUpdate: any getByCnpj;

  constructor(
    @InjectModel(Client.name) private readonly _model: Model<ClientInterface>,
  ) {
    super(_model);
  }

  async getByEmail(email: string): Promise<ClientInterface> {
    return await this._model.findOne({ email });
  }


  async getByEmailWithoutPassword(email: string): Promise<ClientInterface> {
    return await this._model.findOne({ email }).select('-password');
  }

  async getByCnpj(cnpj: string): Promise<ClientInterface> {
    return await this._model.findOne({ $or: [{ cnpj: cnpj }, { cpf: cnpj }] }).select('-password');
  }

  async updatePassword(_id: string, password: string): Promise<ClientInterface> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          password,
        },
      },
    );
  }
  async getByUser<T>(
    user: T | ClientInterface,
  ): Promise<VerificationInterface> {
    return await this._model.findOne({ user }).populate('user');
  }

  async updateStatus(_id: string, status: ClientStatusEnum): Promise<ClientInterface> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          status,
        },
      },
    );
  }


  async listByUserStatus(status: ClientStatusEnum[]) {
    return await this._model//.find().populate('status')
      .find({
        'status': {
          $in: status,
        },
      })
      .populate('status');
  }


  async findAll(): Promise<ClientInterface[]> {
    return this._model.find().exec();
  }

  async deleteUser(_id: string): Promise<ClientInterface> {
    return await this._model.findByIdAndDelete(_id);
  }


  //   async delete(id: string) {
  //     return await this._model.findByIdAndDelete(id);
  // }


}

/* eslint-disable prettier/prettier */
import { Model } from "mongoose";
import { BaseSchema } from "../schemas/base.schema";
import { IBaseRepository } from "./ibase.repository";

export class BaseRepository<T extends BaseSchema> implements IBaseRepository<T> {

    protected _repository: Model<T>;
    private _populateOnFind: string[];

    constructor(
        repository: Model<T>,
        populateOnFind: string[] = []
    ) {
        this._repository = repository;
        this._populateOnFind = populateOnFind;
    }

    async list(): Promise<T[] | null> {
        return this._repository
            .find()
            .populate(this._populateOnFind)
            .exec();
    }

    async getById(_id: string): Promise<T> {
        return await this._repository
            .findById(_id)
            .populate(this._populateOnFind)
            .exec() as T;
    }

    async register(item: any): Promise<T> {
        return await this._repository.create(item);
    }

    async update(_id: string, item: any): Promise<T> {
        return await this._repository.findByIdAndUpdate(_id, item);
    }


    async delete(_id: string) {
        await this._repository.findByIdAndUpdate(_id, {
            $set: {
                deleted: true,
            }
        });
    }
}
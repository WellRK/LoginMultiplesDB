import { BaseRepository } from "../repositories/base.repository";
import { BaseSchema } from "../schemas/base.schema";
import { IBaseService } from "./ibase.service";

export class BaseService<T extends BaseSchema> implements IBaseService<T> {

    constructor(
        protected readonly repository: BaseRepository<T>,
    ) { }

    async list(): Promise<T[]> {
        return this.repository.list();
    }

    async getById(_id: string): Promise<T> {
        return this.repository.getById(_id);
    }

    async register(item: T): Promise<T> {
        return this.repository.register(item);
    }

    async update(_id: string, item: T): Promise<T> {
        return this.repository.update(_id, item);
    }

    async delete(_id: string): Promise<void> {
        this.repository.delete(_id);
    }
}
import { BaseSchema } from "../schemas/base.schema";

export interface IBaseRepository<T extends BaseSchema> {

    list(): Promise<T[]>;

    getById(_id: string): Promise<T>;

    register(item: T): Promise<T>;

    update(_id: string, item: T): Promise<T>;

    delete(_id: string): void;
}

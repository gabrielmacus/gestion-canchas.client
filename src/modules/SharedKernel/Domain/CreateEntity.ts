import { v4 as uuidv4 } from 'uuid';
import type Repository from "./Repository";

export default async function CreateEntity<T>(repository: Repository<T>, entity: Omit<T, 'id'>) {
    const uuid = uuidv4()
    const newEntity = { ...entity, id: uuid } as T
    return await repository.create(newEntity) as T
}
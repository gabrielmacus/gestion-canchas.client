import { CreateEntity } from "../../SharedKernel/Domain/CreateEntity";
import { Cancha } from "../Domain/Cancha";
import { CanchaRepository } from "../Domain/CanchaRepository";

export class CrearCancha {
    constructor(private repository: CanchaRepository) {}

    async execute(cancha: CreateEntity<Cancha>): Promise<Cancha> {
        return await this.repository.create(cancha);
    }
}
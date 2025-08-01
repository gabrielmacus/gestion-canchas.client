import { Cancha } from "../Domain/Cancha";
import { CanchaRepository } from "../Domain/CanchaRepository";

export class EditarCancha {
    constructor(private repository: CanchaRepository) {}

    async execute(id: string, cancha: Partial<Cancha>): Promise<Cancha> {
        return await this.repository.update(id, cancha);
    }
}
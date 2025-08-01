import { ApiRepository } from "../../SharedKernel/Infraestructure/ApiRepository";
import { Cancha } from "../Domain/Cancha";
import { CanchaRepository } from "../Domain/CanchaRepository";

export class CanchaApiRepository extends ApiRepository<Cancha> implements CanchaRepository {
    protected getEndpoint(): string {
        return '/canchas';
    }
}
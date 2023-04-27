import { BaseInterface } from '../../shared/interfaces/base.interface';
import { ClientProfileEnum } from '../enums/client-profile.enum';
import { ClientStatusEnum } from '../enums/client-status.enum';

export interface ClientInterface extends BaseInterface {
  email: string;
  password: string;
  name: string;
  cpf?: string;
  cnpj?: string;
  status: ClientStatusEnum;
  profile: ClientProfileEnum;
  document?: string;
  phone: string;
}

import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";

const DEFAULT_123456_PASSWORD = '$2a$12$yUh714g31SHCPfids75lHOOr9CAsRbjK4z5a2ejv2rJXjMVtC6N3S';

const customers: CustomerType[] = [
  {
    id: '625cc239a814e93465aaa470',
    name: 'Teste usuário 1',
    email: 'teste@gmail.com',
    nickname: 'Teste',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  },
  {
    id: '987cc239a814e93465aaa470',
    name: 'Teste usuário 2',
    email: 'teste2@gmail.com',
    nickname: 'Teste',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  },
  {
    id: '123cc239a814e93465aaa470',
    name: 'Teste usuário 3',
    email: 'teste3@gmail.com',
    nickname: 'Teste',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  },
];

const attendants: AttendantType[] = [
  {
    id: '625cc239a814e93465aaa470',
    name: 'Teste usuário 1',
    email: 'teste@gmail.com',
    cpf: '12345678900',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  },
  {
    id: '987cc239a814e93465aaa470',
    name: 'Teste usuário 2',
    email: 'teste2@gmail.com',
    cpf: '12345678900',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  }
];

const administrators: AdministratorType[] = [
  {
    id: '625cc239a814e93465aaa470',
    name: 'Teste usuário 1',
    email: 'teste@gmail.com',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  },
  {
    id: '987cc239a814e93465aaa470',
    name: 'Teste usuário 2',
    email: 'teste2@gmail.com',
    city: 'Paulínia',
    state: 'SP',
    roleId: '3',
    password: DEFAULT_123456_PASSWORD
  }
];

const mockedUsers = {
  customers,
  attendants,
  administrators,
};

export default mockedUsers;
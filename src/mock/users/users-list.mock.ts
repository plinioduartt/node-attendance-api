import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";

const mockedUsers = {
  customers: [
    {
      id: '625cc239a814e93465aaa470',
      name: 'Teste usuário 1',
      email: 'teste@gmail.com',
      nickname: 'Teste',
      city: 'Paulínia',
      state: 'SP',
      roleId: '3',
      password: '123456'
    },
    {
      id: '987cc239a814e93465aaa470',
      name: 'Teste usuário 2',
      email: 'teste2@gmail.com',
      nickname: 'Teste',
      city: 'Paulínia',
      state: 'SP',
      roleId: '3',
      password: '123456'
    },
    {
      id: '123cc239a814e93465aaa470',
      name: 'Teste usuário 3',
      email: 'teste3@gmail.com',
      nickname: 'Teste',
      city: 'Paulínia',
      state: 'SP',
      roleId: '3',
      password: '123456'
    },
  ] as CustomerType[],
};

export default mockedUsers;
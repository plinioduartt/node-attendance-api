import { jest } from '@jest/globals';
import mockedUsers from './users.list';

const mockedUserRepository = {
  listAll: jest.fn().mockImplementation(() => {
    return mockedUsers;
  }),
  getOneById: jest.fn().mockImplementation((id: any) => {
    return mockedUsers.filter(item => item.id.toString() === id.toString())[0] || null;
  }),
  create: jest.fn().mockImplementation((data: any) => {
    return {
      id: "625cc239a814e93465aaa470",
      name: data.name,
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      city: data.city,
      state: data.state,
    };
  }),
  update: jest.fn().mockImplementation((id, data: any) => {
    return {
      id: id,
      name: data.name,
      email: data.email,
      nickname: data.nickname,
      city: data.city,
      state: data.state,
    };
  }),
  delete: jest.fn().mockImplementation(() => {
    return true;
  })
};

export default mockedUserRepository;

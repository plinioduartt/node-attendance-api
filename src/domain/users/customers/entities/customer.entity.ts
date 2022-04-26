import User, { AbstractUser } from "../../abstract-user";
import IsValidInstanceType from "../../_commons/types/isValidInstance.type";
// import roles from "../../enums/roles.enum";

export type CustomerType = AbstractUser & {
  nickname: string;
  city: string;
  state: string;
}

class Customer extends User {
  public readonly nickname: string;
  public readonly city: string;
  public readonly state: string;

  private constructor({ nickname, city, state, ...args }: CustomerType) {
    super(args);
    this.nickname = nickname;
    this.city = city;
    this.state = state;
  }

  static async create(data: CustomerType): Promise<Customer> {
    return new Customer(data);
  }

  isValidInstance(): IsValidInstanceType {
    const propertyNames = Object.getOwnPropertyNames(this);
    const errors = propertyNames
      .map(property => this[property as keyof Customer] != null ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default Customer;

// (async () => {
//   const password = await Customer.hashPassword('123456');

//   const test = Customer.create({
//     name: 'teste',
//     email: 'teste',
//     nickname: 'teste',
//     city: 'teste',
//     state: 'teste',
//     roleId: roles.CUSTOMER,
//     password
//   });

//   console.log("Roles enum ==> ", roles);
//   console.log("Usuário criado ==> ", test);
//   console.log("Usuário é válido? ==> ", test.isValid());
// })()

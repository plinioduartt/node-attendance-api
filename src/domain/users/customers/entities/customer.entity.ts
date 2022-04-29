import User, { AbstractUser } from "../../abstract-user";
import IsValidInstanceType from "../../_commons/types/isValidInstance.type";
import CustomError from "@/src/http/errors/customError";
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
    const newCustomer = new Customer(data);
    const { isValid, errors } = newCustomer.isValidInstance();

    if (!isValid && errors.length > 0) {
      const ERROR_MSG = errors.join(' ');
      throw new CustomError(400, ERROR_MSG);
    }

    newCustomer._password = await User.hashPassword(data.password);
    return newCustomer;
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
//   const password = "123456";
//   const hashedPassword = await Customer.hashPassword(password);

//   const newCustomer = await Customer.create({
//     name: 'teste',
//     email: 'teste',
//     nickname: 'teste',
//     city: 'teste',
//     state: 'teste',
//     roleId: roles.CUSTOMER,
//     password: hashedPassword
//   });

//   const isValidPassword = await Customer.checkPassword({
//     enteredPassword: password,
//     hashedPassword: newCustomer.password
//   });

//   console.log("isValidPassword ==> ", isValidPassword);
//   console.log("Roles enum ==> ", roles);
//   console.log("Usuário criado ==> ", newCustomer);
//   console.log("Usuário é válido? ==> ", newCustomer.isValidInstance());
// })()

import User, { AbstractUser } from "../../abstract-users/entities/abstract-user";
import IsValidInstanceType from "../../../_commons/types/isValidInstance.type";
import CustomError from "@/src/http/errors/customError";

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
    const newCustomer: Customer = new Customer(data);
    const { isValid, errors }: IsValidInstanceType = newCustomer.isValidInstance();

    if (!isValid && errors.length > 0) {
      const ERROR_MSG = errors.join(' ');
      throw new CustomError(400, ERROR_MSG);
    }

    newCustomer._password = await Customer.hashPassword(data.password);
    return newCustomer;
  }

  static async update(data: CustomerType): Promise<CustomerType> {
    if (!!data.password) {
      data.password = await Customer.hashPassword(data.password);
    }

    return data;
  }

  private isValidInstance(): IsValidInstanceType {
    const propertyNames: string[] = Object.getOwnPropertyNames(this);
    const errors: (string | null)[] = propertyNames
      .map(property => this[property as keyof Customer] != null ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default Customer;

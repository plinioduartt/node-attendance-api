import IsValidInstanceType from "../../_commons/types/isValidInstance.type";
import User, { AbstractUser } from "../../abstract-users/entities/abstract-user";
import CustomError from "@/src/http/errors/customError";

export type AdministratorType = AbstractUser & {
  city: string;
  state: string;
}

class Administrator extends User {
  public readonly city: string;
  public readonly state: string;

  private constructor({ city, state, ...args }: AdministratorType) {
    super(args);
    this.city = city;
    this.state = state;
  }

  static async create(data: AdministratorType): Promise<Administrator> {
    const newAdministrator = new Administrator(data);
    const { isValid, errors } = newAdministrator.isValidInstance();

    if (!isValid && errors.length > 0) {
      const ERROR_MSG = errors.join(' ');
      throw new CustomError(400, ERROR_MSG);
    }

    newAdministrator._password = await Administrator.hashPassword(data.password);
    return newAdministrator;
  }

  static async update(data: AdministratorType): Promise<AdministratorType> {
    if (!!data.password) {
      data.password = await Administrator.hashPassword(data.password);
    }

    // args...

    return data;
  }

  private isValidInstance(): IsValidInstanceType {
    const propertyNames = Object.getOwnPropertyNames(this);
    const errors = propertyNames
      .map(property => this[property as keyof Administrator] != null ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default Administrator;

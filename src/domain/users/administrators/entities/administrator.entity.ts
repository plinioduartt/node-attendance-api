import IsValidInstanceType from "../../_commons/types/isValidInstance.type";
import User, { AbstractUser } from "../../abstract-user";
import CustomError from "@/src/http/errors/customError";
// import roles from "../../enums/roles.enum";

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

    newAdministrator._password = await User.hashPassword(data.password);
    return newAdministrator;
  }

  isValidInstance(): IsValidInstanceType {
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

// (async () => {
//   const password = await Administrator.hashPassword('123456');

//   const test = await Administrator.create({
//     name: 'teste',
//     email: 'teste',
//     city: 'teste',
//     state: 'teste',
//     roleId: roles.ADMINISTRATOR,
//     password,
//   });

//   console.log("Roles enum ==> ", roles);
//   console.log("Usuário criado ==> ", test);
//   console.log("Usuário é válido? ==> ", test.isValid());
// })()

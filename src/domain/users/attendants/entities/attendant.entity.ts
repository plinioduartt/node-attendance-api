import User, { AbstractUser } from "../../abstract-user";
import IsValidInstanceType from "../../_commons/types/isValidInstance.type";
// import roles from "../../enums/roles.enum";

export type AttendantType = AbstractUser & {
  cpf: string;
  city: string;
  state: string;
  rating?: number;
}

class Attendant extends User {
  public readonly cpf: string;
  public readonly city: string;
  public readonly state: string;
  public readonly rating: number;

  private constructor({ cpf, city, state, rating, ...args }: AttendantType) {
    super(args);
    this.cpf = cpf;
    this.city = city;
    this.state = state;

    const DEFAULT_INITIAL_RATING = 10;
    this.rating = DEFAULT_INITIAL_RATING;
  }

  static async create(data: AttendantType): Promise<Attendant> {
    return new Attendant(data);
  }

  isValidInstance(): IsValidInstanceType {
    const propertyNames = Object.getOwnPropertyNames(this);
    const errors = propertyNames
      .map(property => this[property as keyof Attendant] != null ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default Attendant;

// (async () => {
//   const password = await Attendant.hashPassword('123456');

//   const test = await Attendant.create({
//     name: 'teste',
//     email: 'teste',
//     cpf: 'teste',
//     city: 'teste',
//     state: 'teste',
//     roleId: roles.ATTENDANT,
//     password,
//   });

//   console.log("Roles enum ==> ", roles);
//   console.log("Usuário criado ==> ", test);
//   console.log("Usuário é válido? ==> ", test.isValid());
// })()

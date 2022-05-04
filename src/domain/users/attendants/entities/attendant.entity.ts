import CustomError from "@/src/http/errors/customError";
import User, { AbstractUser } from "../../abstract-users/entities/abstract-user";
import IsValidInstanceType from "../../../_commons/types/isValidInstance.type";

export type AttendantType = AbstractUser & {
  cpf: string;
  city: string;
  state: string;
  rating?: number;
  attendancesNumber?: number;
}

class Attendant extends User {
  public readonly cpf: string;
  public readonly city: string;
  public readonly state: string;
  public readonly rating: number;
  public readonly attendancesNumber: number;

  private constructor({ cpf, city, state, rating, ...args }: AttendantType) {
    super(args);
    this.cpf = cpf;
    this.city = city;
    this.state = state;

    const DEFAULT_INITIAL_RATING = 10;
    const DEFAULT_INITIAL_ATTENDANCES_NUMBER = 0;
    this.rating = DEFAULT_INITIAL_RATING;
    this.attendancesNumber = DEFAULT_INITIAL_ATTENDANCES_NUMBER;
  }

  static async create(data: AttendantType): Promise<Attendant> {
    const newAttendant: Attendant = new Attendant(data);
    const { isValid, errors }: IsValidInstanceType = newAttendant.isValidInstance();

    if (!isValid && errors.length > 0) {
      const ERROR_MSG = errors.join(' ');
      throw new CustomError(400, ERROR_MSG);
    }

    newAttendant._password = await Attendant.hashPassword(data.password);
    return newAttendant;
  }

  static async update(data: AttendantType): Promise<AttendantType> {
    if (!!data.password) {
      data.password = await Attendant.hashPassword(data.password);
    }

    // rating...

    return data;
  }

  private isValidInstance(): IsValidInstanceType {
    const propertyNames: string[] = Object.getOwnPropertyNames(this);
    const errors: (string | null)[] = propertyNames
      .map(property => this[property as keyof Attendant] != null ? null : `property ${property} is missing.`)
      .filter(item => !!item);

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default Attendant;
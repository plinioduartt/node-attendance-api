import { SignInResponseType } from "./jwt.service";

export type CredentialsType = {
    email: string;
    password: string;
};

interface IJwtService {
    signIn(credentials: CredentialsType): Promise<SignInResponseType>;
    signOut(): Promise<void>;
}

export default IJwtService;
import { SignInResponseType } from "./auth.service";

export type CredentialsType = {
    email: string;
    password: string;
};

interface IAuthService {
    signIn(credentials: CredentialsType): Promise<SignInResponseType>;
    signOut(): Promise<void>;
}

export default IAuthService;
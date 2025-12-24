import { compare, hash } from 'bcryptjs';

export class User {
    private _password: string;

    constructor(
        private readonly _email: string,
        private readonly _name: string,
        passwordHash?: string,
    ) {
        if (passwordHash) {
            this._password = passwordHash;
        }
    }

    public get email(): string {
        return this._email;
    }

    public get name(): string {
        return this._name;
    }

    public get password(): string {
        return this._password;
    }

    public async setPassword(password: string, salt: number): Promise<void> {
        this._password = await hash(password, salt);
    }

    public comparePassword(password: string): Promise<boolean> {
        return compare(password, this._password);
    }
}

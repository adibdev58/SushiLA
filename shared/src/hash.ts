import * as bycrypt from "bcrypt"
import { CustomError, ErrorStatus } from "@sushila/shared";

export async function hash(password: string) {
    try {
        const saltRounds = 10;
        const salt = await bycrypt.genSalt(saltRounds);
        const hashedPassword = await bycrypt.hash(password,salt);
        return hashedPassword
    } catch (err) {
        throw new CustomError(ErrorStatus.PasswordHashingError, `Something wen't wrong with hashing Password! ${err}`,500);
    }
}
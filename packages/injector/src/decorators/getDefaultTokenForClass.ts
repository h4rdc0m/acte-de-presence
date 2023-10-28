import { Token } from "../Token";


export function getDefaultTokenForClass(clazz: any): Token<any> {
    return new Token(clazz.name);
}

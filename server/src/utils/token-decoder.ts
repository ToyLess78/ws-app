import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
    name?: string;
    picture?: string;
    sub: string;
    email?: string;
}

export class TokenDecoder {
    public static decodeGoogleToken(token: string): DecodedToken {
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            throw new Error("Failed to decode Google token");
        }
    }
}

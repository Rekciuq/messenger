import jwt, { type SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "../../types/jwt";
import { JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../constants/jwt";

function generateJWT(payload: JwtPayload, expiresIn: string): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn
    } as SignOptions);
}

export function generateAccessToken(payload: JwtPayload): string {
    return generateJWT(payload, ACCESS_TOKEN_EXPIRES_IN);
}

export function generateRefreshToken(payload: JwtPayload): string {
    return generateJWT(payload, REFRESH_TOKEN_EXPIRES_IN);
}

export function generateTokenPair(payload: JwtPayload) {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
}


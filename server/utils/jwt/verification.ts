import jwt from "jsonwebtoken";
import type { JwtPayload } from "../../types/jwt";
import { JWT_SECRET } from "../../constants/jwt";

function verifyJWT(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch {
        return null;
    }
}

export function verifyAccessToken(token: string): JwtPayload | null {
    return verifyJWT(token);
}

export function verifyRefreshToken(token: string): JwtPayload | null {
    return verifyJWT(token);
}


import type { H3Event } from "h3";
import type { JwtPayload, TokenPair } from "../../types/jwt";
import { getAccessToken, getRefreshToken } from "./cookies";
import { verifyAccessToken, verifyRefreshToken } from "./verification";
import { generateTokenPair } from "./tokens";

export function getAuthUser(event: H3Event): JwtPayload | null {
    const token = getAccessToken(event);
    if (!token) return null;
    
    return verifyAccessToken(token);
}

export function refreshAccessToken(event: H3Event): TokenPair | null {
    const refreshToken = getRefreshToken(event);
    if (!refreshToken) return null;
    
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return null;
    
    return generateTokenPair({
        userId: payload.userId,
        email: payload.email,
    });
}


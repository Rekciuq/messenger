import { getAccessToken, verifyAccessToken } from "./jwt";
import type { H3Event } from "h3";

export function isAuthenticated(event: H3Event): boolean {
    const token = getAccessToken(event);
    if (!token) return false;
    
    const user = verifyAccessToken(token);
    return user !== null;
}

export const PUBLIC_ROUTES = ['/login', '/signup'];

export function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.includes(path);
}


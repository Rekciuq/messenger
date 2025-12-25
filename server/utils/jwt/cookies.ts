import type { H3Event } from "h3";
import type { TokenPair } from "../../types/jwt";
import {
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE
} from "../../constants/jwt";

function setCookieWithOptions(
    event: H3Event,
    name: string,
    value: string,
    maxAge: number
) {
    setCookie(event, name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
    });
}

export function setAccessTokenCookie(event: H3Event, token: string) {
    setCookieWithOptions(event, ACCESS_TOKEN_COOKIE_NAME, token, ACCESS_TOKEN_MAX_AGE);
}

export function setRefreshTokenCookie(event: H3Event, token: string) {
    setCookieWithOptions(event, REFRESH_TOKEN_COOKIE_NAME, token, REFRESH_TOKEN_MAX_AGE);
}

export function setAuthCookies(event: H3Event, tokens: TokenPair) {
    setAccessTokenCookie(event, tokens.accessToken);
    setRefreshTokenCookie(event, tokens.refreshToken);
}

export function getAccessToken(event: H3Event): string | undefined {
    return getCookie(event, ACCESS_TOKEN_COOKIE_NAME);
}

export function getRefreshToken(event: H3Event): string | undefined {
    return getCookie(event, REFRESH_TOKEN_COOKIE_NAME);
}

export function clearAuthCookies(event: H3Event) {
    deleteCookie(event, ACCESS_TOKEN_COOKIE_NAME, { path: "/" });
    deleteCookie(event, REFRESH_TOKEN_COOKIE_NAME, { path: "/" });
}


import loginSchema from "../../../../app/schemas/auth/login.schema";
import { apiSuccess, apiError } from "../../../utils/response";
import { authService } from "../../../bll/AuthService";
import { ErrorCode } from "../../../../app/constants/error/codes";
import { generateTokenPair, setAuthCookies } from "../../../utils/jwt";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
        setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
        return apiError(ErrorCode.VALIDATION_ERROR, validation.error.errors);
    }
    
    try {
        const user = await authService.signIn({
            email: validation.data.email,
            password: validation.data.password,
        });

        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
        });

        setAuthCookies(event, tokens);

        return apiSuccess({
            id: user.id,
            email: user.email,
            userName: user.userName,
            bio: user.bio,
        }, "Login successful");
    } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setResponseStatus(event, ErrorCode.UNAUTHORIZED);
        return apiError(ErrorCode.UNAUTHORIZED, message);
    }
})
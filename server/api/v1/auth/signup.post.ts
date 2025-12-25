import signupSchema from "../../../../app/schemas/auth/signup.schema";
import { validateMultipart } from "../../../utils/validator";
import { apiSuccess, apiError } from "../../../utils/response";
import { authService } from "../../../bll/AuthService";
import { ErrorCode } from "../../../../app/constants/error/codes";
import { generateTokenPair, setAuthCookies } from "../../../utils/jwt";

export default defineEventHandler(async (event) => {
    const { data: body, error } = await validateMultipart(event, signupSchema);
    
    if (error) {
        setResponseStatus(event, error.code);
        return apiError(error.code, error.details);
    }
    
    try {
        const result = await authService.signUp({
            email: body.email,
            userName: body.userName,
            bio: body.bio,
            password: body.password,
            profilePicture: body.profilePicture
        });

        const tokens = generateTokenPair({
            userId: result.id,
            email: result.email,
        });

        setAuthCookies(event, tokens);

        return apiSuccess({
            id: result.id,
            email: result.email,
            userName: result.userName,
            bio: result.bio,
            profilePicture: result.profilePicture
        }, "User registered successfully");
    } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        console.log(err)
        setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
        return apiError(ErrorCode.VALIDATION_ERROR, message);
    }
});
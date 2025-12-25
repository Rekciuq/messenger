import {z} from "zod"
import stringSchema from "../string.schema"
import { 
    PASSWORDS_DONT_MATCH_MESSAGE,
} from "~/constants/validation/auth/messages"
import fileSchema from "../file.schema"
import textAreaSchema from "../textArea.schema"
import userNameSchema from "../userName.schema"

const signupSchema = z.object({
    email: stringSchema.email(), 
    userName: userNameSchema,
    bio: textAreaSchema,
    password: stringSchema,
    confirmPassword: stringSchema,
    profilePicture: fileSchema
}).refine((data) => data.password === data.confirmPassword, {
    message: PASSWORDS_DONT_MATCH_MESSAGE,
    path: ["confirmPassword"],
})

export default signupSchema


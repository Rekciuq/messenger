import {z} from "zod"
import stringSchema from "../string.schema"


const loginSchema = z.object({email: stringSchema.email(), password: stringSchema})

export default loginSchema
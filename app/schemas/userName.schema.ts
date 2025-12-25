import stringSchema from "./string.schema";
import { USERNAME_NO_SPACES_MESSAGE } from "~/constants/validation/auth/messages";

const userNameSchema = stringSchema.refine(
    (val) => !val.includes(" "),
    {
        message: USERNAME_NO_SPACES_MESSAGE
    }
);

export default userNameSchema;


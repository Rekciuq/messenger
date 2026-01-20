import z from "zod";
import textAreaSchema from "./textArea.schema";
import userNameSchema from "./userName.schema";
import fileSchema from "./file.schema";

const userProfileSchema = z.object({
    newBio: textAreaSchema.optional(),
    newUsername: userNameSchema.optional(),
    newProfilePicture: fileSchema.optional()
}) 

export default userProfileSchema
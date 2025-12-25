import { z } from "zod";
import { MAX_STRING_LENGTH } from "~/constants/validation/common/baseSchemasValues";

const textAreaSchema = z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().trim().max(MAX_STRING_LENGTH).optional()
);

export default textAreaSchema;


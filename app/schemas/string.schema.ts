import {z} from "zod";
import { MAX_STRING_LENGTH, MIN_STRING_LENGTH } from "~/constants/validation/common/baseSchemasValues";

const stringSchema = z.string().min(MIN_STRING_LENGTH).max(MAX_STRING_LENGTH)

export default stringSchema
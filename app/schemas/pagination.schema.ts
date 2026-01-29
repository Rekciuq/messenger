import { z } from "zod";
import stringSchema from "./string.schema";

const paginationSchema = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
  cursor: z.object({ id: stringSchema }).optional(),
});

export default paginationSchema;

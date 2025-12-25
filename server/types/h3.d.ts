import type { JwtPayload } from "./jwt";

declare module "h3" {
    interface H3EventContext {
        user?: JwtPayload;
    }
}

export {};


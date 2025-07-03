import createApp from "@api/lib/create-app";
import configureOpenAPI from "@api/lib/open-api-config";
import { registerRoutes } from "@api/routes";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = registerRoutes(createApp());

configureOpenAPI(app);

export type AppType = typeof app;

// export default {
//   port: env.PORT,
//   fetch: app.fetch
// };

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

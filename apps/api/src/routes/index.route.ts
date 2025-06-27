import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createRouter } from "@api/lib/create-app";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Hono API"),
        "Hono API - Index Endpoint"
      )
    }
  }),
  (c) => {
    return c.json(
      {
        message: "This is Hono API"
      },
      HttpStatusCodes.OK
    );
  }
);

export default router;

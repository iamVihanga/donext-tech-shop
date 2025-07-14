import { createRouter } from "@api/lib/create-app";

import * as handlers from "./product.handlers";
import * as routes from "./product.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.updateStock, handlers.updateStock)
  .openapi(routes.updateVariantStock, handlers.updateVariantStock);

export default router;

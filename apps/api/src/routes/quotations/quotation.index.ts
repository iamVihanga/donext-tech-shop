import { createRouter } from "@api/lib/create-app";

import * as handlers from "./quotation.handlers";
import * as routes from "./quotation.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.updateStatus, handlers.updateStatus)
  .openapi(routes.generatePdf, handlers.generatePdf)
  .openapi(routes.getUserQuotations, handlers.getUserQuotations);

export default router;

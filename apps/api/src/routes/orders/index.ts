import { createRouter } from "@api/lib/create-app";

import * as handlers from "./orders.handlers";
import * as routes from "./orders.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getUserOrders, handlers.getUserOrders)
  .openapi(routes.getOrderById, handlers.getOrderById)
  .openapi(routes.checkout, handlers.checkout)
  .openapi(routes.calculateTotals, handlers.calculateTotals)
  .openapi(routes.updateOrderStatus, handlers.updateOrderStatus)
  .openapi(routes.cancelOrder, handlers.cancelOrder);

export default router;

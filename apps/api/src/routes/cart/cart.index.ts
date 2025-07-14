import { createRouter } from "@api/lib/create-app";

import * as handlers from "./cart.handlers";
import * as routes from "./cart.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getUserCart, handlers.getUserCart)
  .openapi(routes.addCartItem, handlers.addCartItem)
  .openapi(routes.getCartItemById, handlers.getCartItemById)
  .openapi(routes.updateCartItemById, handlers.updateCartItemById)
  .openapi(routes.deleteCartItemById, handlers.deleteCartItemById);

export default router;

import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
import cart from "./cart/cart.index";
import categories from "./categories/categories.index";
import index from "./index.route";
import media from "./media/media.index";
import orders from "./orders";
import products from "./products/product.index";
import tasks from "./tasks/tasks.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/tasks", tasks)
    .route("/categories", categories)
    .route("/products", products)
    .route("/cart", cart)
    .route("/orders", orders)
    .route("/media", media);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;

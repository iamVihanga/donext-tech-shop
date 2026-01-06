import { createRouter } from "@api/lib/create-app";

import * as handlers from "./pc-builder.handlers";
import * as routes from "./pc-builder.routes";

const router = createRouter()
  // PC Build routes
  .openapi(routes.listBuilds, handlers.getPcBuilds)
  .openapi(routes.getBuild, handlers.getPcBuildById)
  .openapi(routes.createBuild, handlers.createPcBuild)
  .openapi(routes.updateBuild, handlers.updatePcBuild)
  .openapi(routes.deleteBuild, handlers.deletePcBuild)
  .openapi(routes.cloneBuild, handlers.clonePcBuild)
  // Compatibility routes
  .openapi(routes.checkCompatibility, handlers.checkCompatibility)
  .openapi(
    routes.getCompatibleComponents,
    handlers.getCompatibleComponentsHandler
  )
  // Component specs routes
  .openapi(routes.listComponents, handlers.getComponentSpecs)
  .openapi(routes.createComponent, handlers.createComponentSpec)
  .openapi(routes.updateComponent, handlers.updateComponentSpec)
  .openapi(routes.deleteComponent, handlers.deleteComponentSpec)
  // Compatibility rules routes
  .openapi(routes.listRules, handlers.getCompatibilityRules)
  .openapi(routes.createRule, handlers.createCompatibilityRule)
  .openapi(routes.updateRule, handlers.updateCompatibilityRule)
  .openapi(routes.deleteRule, handlers.deleteCompatibilityRule);

export default router;

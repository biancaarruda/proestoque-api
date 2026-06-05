import { Router } from "express";

import { CategoriaController } from "../controllers/categoria.controller";

const routes = Router();

const controller = new CategoriaController();

routes.get("/", controller.index);

routes.get("/:id", controller.show);

routes.post("/", controller.create);

export { routes as categoriaRoutes };
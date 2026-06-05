import { Router } from "express";

import { MovimentacaoController } from "../controllers/movimentacao.controller";

const routes = Router();

const controller = new MovimentacaoController();

routes.get("/", controller.index);
routes.post("/", controller.create);

export { routes as movimentacaoRoutes };
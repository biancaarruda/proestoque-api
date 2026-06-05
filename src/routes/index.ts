import { Router } from "express";

import { produtoRoutes } from "./produto.routes";
import { categoriaRoutes } from "./categoria.routes";
import { movimentacaoRoutes } from "./movimentacao.routes";

const routes = Router();

routes.use("/produtos", produtoRoutes);
routes.use("/categorias", categoriaRoutes);

export { routes };
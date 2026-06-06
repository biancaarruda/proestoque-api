import { Router } from "express";

import { produtoRoutes } from "./produto.routes";
import { categoriaRoutes } from "./categoria.routes";
import { movimentacaoRoutes } from "./movimentacao.routes";
import { authRouter } from "./auth.routes";

const routes = Router();

routes.use("/auth", authRouter);

routes.use("/produtos", produtoRoutes);
routes.use("/categorias", categoriaRoutes);

export { routes };
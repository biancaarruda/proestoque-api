import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class MovimentacaoController {
  async create(request: Request, response: Response) {
    const produtoId = String(request.params.id);

    const {
      tipo,
      quantidade,
      observacao,
    } = request.body;

    const produto = await prisma.produto.findUnique({
      where: {
        id: produtoId,
      },
    });

    if (!produto) {
      return response.status(404).json({
        erro: "Produto não encontrado",
      });
    }

    const novaQuantidade =
      tipo === "entrada"
        ? produto.quantidade + quantidade
        : produto.quantidade - quantidade;

    const resultado = await prisma.$transaction(
      async (tx) => {
        const movimentacao =
          await tx.movimentacao.create({
            data: {
              produtoId,
              tipo,
              quantidade,
              observacao,
            },
          });

        await tx.produto.update({
          where: {
            id: produtoId,
          },
          data: {
            quantidade: novaQuantidade,
          },
        });

        return movimentacao;
      }
    );

    return response.status(201).json(resultado);
  }

  async index(request: Request, response: Response) {
    const produtoId = String(request.params.id);

    const movimentacoes =
      await prisma.movimentacao.findMany({
        where: {
          produtoId,
        },
        orderBy: {
          criadoEm: "desc",
        },
      });

    return response.json(movimentacoes);
  }
}
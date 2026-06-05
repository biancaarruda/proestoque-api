import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.categoria.createMany({
    data: [
      { nome: "Bebidas" },
      { nome: "Alimentos" },
      { nome: "Limpeza" },
      { nome: "Eletrônicos" },
      { nome: "Papelaria" },
    ],
  });

  console.log("Categorias criadas");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
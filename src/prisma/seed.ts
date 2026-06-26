import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.categoria.createMany({
    data: [
      { nome: "Bebidas",
        icone: "wine-outline",
        cor: "#2563EB"
       },
      { nome: "Alimentos",
        icone: "utensils-outline",
        cor: "#10B981"
      },
      { nome: "Limpeza",
        icone: "broom-outline",
        cor: "#F59E0B"
      },
      { nome: "Eletrônicos",
        icone: "phone-outline",
        cor: "#8B5CF6"
      },
      { nome: "Papelaria",
        icone: "book-outline",
        cor: "#EF4444"
      },
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
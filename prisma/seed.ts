import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const regalos = [
    { nombre: "Libros", descripcion: "Sensoriales, interactivos, +12 meses", precio: "10-20€" },
    { nombre: "Librería infantil", descripcion: "Estantería pequeña montessori", precio: "20-30€" },
    { nombre: "Sofá plegable infantil", descripcion: "Tumbona", precio: "40-50€" },
    { nombre: "Torre de aprendizaje", descripcion: "Plegable, montessori", precio: "50-70€" },
    { nombre: "Juego de memoria", descripcion: "Tarjetas, cartas, +12 meses, parlantes", precio: "10-20€" },
    { nombre: "Instrumentos musicales", descripcion: "Madera, montessori", precio: "25-35€" },
    { nombre: "Soporte de ducha bebé", descripcion: "De pie, base antideslizante", precio: "30-50€" },
    { nombre: "Soporte para monitor", descripcion: "Flexible, universal", precio: "10-20€" },
    { nombre: "Zapatos o sandalias", descripcion: "Talla 21, respetuosos", precio: "25-50€" },
    { nombre: "Humificador bebé", descripcion: "Mocos y tos", precio: "30-45€" },
    { nombre: "Estantería Kallax", descripcion: "Ikea, blanco, 77x147cm", precio: "59,99€" },
    { nombre: "Almohada bebé", descripcion: "Viscoelástica", precio: "28-39€" },
    { nombre: "Tabla de recompensas", descripcion: "Infantil, imanes", precio: "20-25€" },
    { nombre: "Pizarra magnética", descripcion: "Adhesiva, de pared, infantil", precio: "25-30€" },
    { nombre: "Alfombra habitación", descripcion: "Mediana-grande", precio: "30-50€" },
  ];

  console.log("Empezando a cargar la lista de regalos");

  for (const regalo of regalos) {
    await prisma.regalo.create({ data: regalo });
    console.log(`Añadido: ${regalo.nombre}`);
  }

  console.log("Lista del Babyshower cargada con éxito");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Hubo un error crítico:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
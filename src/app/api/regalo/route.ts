import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    const regalos = await prisma.regalo.findMany({
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(regalos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener regalos" }, { status: 500 });
  }
}
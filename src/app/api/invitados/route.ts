import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    const invitados = await prisma.invitado.findMany({
      select: { regaloId: true }
    });
    return NextResponse.json(invitados);
  } catch (error) {
    console.error("Error obteniendo invitados:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, regaloId } = body;

    // 1. Verificación de seguridad: ¿Sigue libre el regalo?
    const yaElegido = await prisma.invitado.findFirst({
      where: { regaloId: parseInt(regaloId) }
    });

    if (yaElegido) {
      return NextResponse.json(
        { success: false, error: "¡Vaya! Alguien acaba de reservar este regalo hace un momento." },
        { status: 400 }
      );
    }

    // 2. Si está libre, creamos el Invitado y lo vinculamos al Regalo
    await prisma.invitado.create({
      data: {
        nombre: nombre,
        regaloId: parseInt(regaloId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en API invitados:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo procesar la reserva." },
      { status: 500 }
    );
  }
}
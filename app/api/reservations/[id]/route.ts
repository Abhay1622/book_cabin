import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id: reservationId } = await params; 

  if (!reservationId) {
    return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
  }

  try {
    const deletedReservation = await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return NextResponse.json(
      { message: 'Reservation deleted successfully', id: deletedReservation.id },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}
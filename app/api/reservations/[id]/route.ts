import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reservationId } = await params;

  if (!reservationId) {
    return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const cabin = await prisma.cabin.findFirst({
      where: { name: reservation.cabinName }
    });

    const reservationWithCabin = {
      ...reservation,
      cabin: cabin ? {
        id: cabin.id,
        description: cabin.description,
        guests: cabin.guests
      } : null
    };

    return NextResponse.json({ reservation: reservationWithCabin });

  } catch (error: any) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reservationId } = await params;

  if (!reservationId) {
    return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { numberOfGuests, cabinDescription, cabinId } = body;

    // Validate required fields
    if (!numberOfGuests || numberOfGuests < 1) {
      return NextResponse.json({ error: 'Valid number of guests is required' }, { status: 400 });
    }

    // First, get the current reservation to get cabin info
    const currentReservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!currentReservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        numberOfGuests: parseInt(numberOfGuests),
        updatedAt: new Date()
      }
    });

    // If cabin description is provided and cabinId exists, update the cabin
    if (cabinDescription && cabinId) {
      await prisma.cabin.update({
        where: { id: cabinId },
        data: {
          description: cabinDescription,
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      message: 'Reservation updated successfully',
      reservation: updatedReservation
    });

  } catch (error: any) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' }, 
      { status: 500 }
    );
  }
}

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
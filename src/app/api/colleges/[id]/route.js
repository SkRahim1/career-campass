import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

// Helper to verify admin role
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload || payload.role !== 'SUPER_ADMIN') return null;
  return payload;
}

export async function GET(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        streams: true,
        gallery: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Calculate rating details
    const totalReviews = college.reviews.length;
    const averageRating = totalReviews > 0
      ? parseFloat((college.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

    return NextResponse.json({
      college: {
        ...college,
        averageRating,
        totalReviews
      }
    });
  } catch (error) {
    console.error('Fetch college details error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching college details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
    }

    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name, logoUrl, coverImageUrl, description, ownership, category, establishedYear,
      address, nearbyLandmark, googleMapsUrl, phone, email, website, genderType,
      hasHostel, hasTransport, hasLibrary, hasLabs, hasSports, hasPlayground,
      hasWifi, hasSmartClassroom, hasCctv, hasComputerLabs, hasCafeteria,
      streams, gallery
    } = body;

    // Transaction to safely update college, streams and gallery
    const updatedCollege = await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      await tx.college.update({
        where: { id },
        data: {
          name, logoUrl, coverImageUrl, description, ownership, category,
          establishedYear: establishedYear ? parseInt(establishedYear) : null,
          address, nearbyLandmark, googleMapsUrl, phone, email, website,
          genderType: genderType || 'CO_ED',
          hasHostel: hasHostel === true,
          hasTransport: hasTransport === true,
          hasLibrary: hasLibrary === true,
          hasLabs: hasLabs === true,
          hasSports: hasSports === true,
          hasPlayground: hasPlayground === true,
          hasWifi: hasWifi === true,
          hasSmartClassroom: hasSmartClassroom === true,
          hasCctv: hasCctv === true,
          hasComputerLabs: hasComputerLabs === true,
          hasCafeteria: hasCafeteria === true,
        }
      });

      // 2. Delete existing streams and gallery
      await tx.collegeStream.deleteMany({ where: { collegeId: id } });
      await tx.collegeGallery.deleteMany({ where: { collegeId: id } });

      // 3. Re-create streams
      if (streams && streams.length > 0) {
        await tx.collegeStream.createMany({
          data: streams.map(s => ({
            collegeId: id,
            streamName: s.streamName,
            annualFee: parseFloat(s.annualFee),
            minQualification: s.minQualification || '10th Class',
            requiredMarks: s.requiredMarks || 'Pass',
            admissionType: s.admissionType || 'DIRECT',
            reservationInfo: s.reservationInfo || ''
          }))
        });
      }

      // 4. Re-create gallery
      if (gallery && gallery.length > 0) {
        await tx.collegeGallery.createMany({
          data: gallery.map(img => ({
            collegeId: id,
            imageUrl: img.imageUrl
          }))
        });
      }

      return await tx.college.findUnique({
        where: { id },
        include: { streams: true, gallery: true }
      });
    });

    return NextResponse.json({ college: updatedCollege, message: 'College updated successfully' });
  } catch (error) {
    console.error('Update college error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating the college' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
    }

    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await prisma.college.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Delete college error:', error);
    return NextResponse.json(
      { error: 'An error occurred deleting the college' },
      { status: 500 }
    );
  }
}

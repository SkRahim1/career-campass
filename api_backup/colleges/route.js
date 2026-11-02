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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const query = searchParams.get('search') || '';
    const area = searchParams.get('area');
    const ownership = searchParams.get('ownership'); // 'GOVERNMENT', 'PRIVATE', 'AIDED'
    const category = searchParams.get('category'); // 'JUNIOR_COLLEGE', 'POLYTECHNIC', 'ITI', 'DIPLOMA', 'VOCATIONAL'
    const stream = searchParams.get('stream'); // 'MPC', 'BiPC', 'MEC', 'CEC', 'HEC', 'Polytechnic', 'ITI', 'Vocational'
    const feeMin = searchParams.get('feeMin') ? parseFloat(searchParams.get('feeMin')) : null;
    const feeMax = searchParams.get('feeMax') ? parseFloat(searchParams.get('feeMax')) : null;
    const genderType = searchParams.get('genderType'); // 'BOYS', 'GIRLS', 'CO_ED'
    const hostel = searchParams.get('hostel') === 'true';
    const transport = searchParams.get('transport') === 'true';
    const library = searchParams.get('library') === 'true';
    const labs = searchParams.get('labs') === 'true';
    const wifi = searchParams.get('wifi') === 'true';
    const sports = searchParams.get('sports') === 'true';

    // Build where clause
    const where = {};

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { address: { contains: query } },
        { nearbyLandmark: { contains: query } },
      ];
    }

    if (area && area !== 'ALL') {
      where.address = { contains: area };
    }

    if (ownership) {
      where.ownership = ownership;
    }

    if (category) {
      where.category = category;
    }

    if (genderType) {
      where.genderType = genderType;
    }

    // Facilities
    if (hostel) where.hasHostel = true;
    if (transport) where.hasTransport = true;
    if (library) where.hasLibrary = true;
    if (labs) where.hasLabs = true;
    if (wifi) where.hasWifi = true;
    if (sports) where.hasSports = true;

    // Stream and fee filtering
    if (stream || feeMin !== null || feeMax !== null) {
      const streamConditions = {};
      if (stream) {
        streamConditions.streamName = stream;
      }
      if (feeMin !== null || feeMax !== null) {
        streamConditions.annualFee = {};
        if (feeMin !== null) streamConditions.annualFee.gte = feeMin;
        if (feeMax !== null) streamConditions.annualFee.lte = feeMax;
      }
      where.streams = {
        some: streamConditions
      };
    }

    // Fetch colleges
    const colleges = await prisma.college.findMany({
      where,
      include: {
        streams: true,
        gallery: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Format output (calculate average rating)
    const formattedColleges = colleges.map(college => {
      const totalReviews = college.reviews.length;
      const averageRating = totalReviews > 0 
        ? parseFloat((college.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)) 
        : 0;
      return {
        ...college,
        averageRating,
        totalReviews
      };
    });

    return NextResponse.json({ colleges: formattedColleges });
  } catch (error) {
    console.error('Fetch colleges error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching colleges' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
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

    if (!name || !description || !ownership || !category || !address) {
      return NextResponse.json({ error: 'Name, description, ownership, category and address are required' }, { status: 400 });
    }

    const newCollege = await prisma.college.create({
      data: {
        name,
        logoUrl,
        coverImageUrl,
        description,
        ownership,
        category,
        establishedYear: establishedYear ? parseInt(establishedYear) : null,
        address,
        nearbyLandmark,
        googleMapsUrl,
        phone,
        email,
        website,
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
        // Create streams nested
        streams: {
          create: (streams || []).map(s => ({
            streamName: s.streamName,
            annualFee: parseFloat(s.annualFee),
            minQualification: s.minQualification || '10th Class',
            requiredMarks: s.requiredMarks || 'Pass',
            admissionType: s.admissionType || 'DIRECT',
            reservationInfo: s.reservationInfo || ''
          }))
        },
        // Create gallery nested
        gallery: {
          create: (gallery || []).map(img => ({
            imageUrl: img.imageUrl
          }))
        }
      },
      include: {
        streams: true,
        gallery: true
      }
    });

    return NextResponse.json({ college: newCollege, message: 'College created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create college error:', error);
    return NextResponse.json(
      { error: 'An error occurred creating the college' },
      { status: 500 }
    );
  }
}

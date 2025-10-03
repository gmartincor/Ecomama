import { PrismaClient, UserRole, UserStatus, MemberRole, MemberStatus, CommunityStatus, ListingType, ListingStatus, EventType } from '@prisma/client';
import { PasswordService } from '../lib/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await PasswordService.hash('password123');

  console.log('Creating superadmin...');
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@ecomama.com' },
    update: {},
    create: {
      email: 'superadmin@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Platform superadmin with full access to all communities and features.',
          phone: '+34 600 111 111',
          location: 'Madrid, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  console.log('Creating community admins...');
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin1@ecomama.com' },
    update: {},
    create: {
      email: 'admin1@ecomama.com',
      passwordHash: hashedPassword,
      name: 'María García',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Agricultora ecológica con 15 años de experiencia. Fundadora de la comunidad de Valencia.',
          phone: '+34 600 222 222',
          location: 'Valencia, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin2@ecomama.com' },
    update: {},
    create: {
      email: 'admin2@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Juan Martínez',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Coordinador de huertos urbanos y promotor de agricultura sostenible en Barcelona.',
          phone: '+34 600 333 333',
          location: 'Barcelona, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  const admin3 = await prisma.user.upsert({
    where: { email: 'admin3@ecomama.com' },
    update: {},
    create: {
      email: 'admin3@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Carmen López',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Ingeniera agrónoma especializada en permacultura. Líder de la comunidad de Sevilla.',
          phone: '+34 600 444 444',
          location: 'Sevilla, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  console.log('Creating regular users...');
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@ecomama.com' },
    update: {},
    create: {
      email: 'user1@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Pedro Sánchez',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Apasionado por la agricultura ecológica y el consumo responsable.',
          phone: '+34 600 555 555',
          location: 'Valencia, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@ecomama.com' },
    update: {},
    create: {
      email: 'user2@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Laura Fernández',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Chef interesada en productos locales y de temporada.',
          phone: '+34 600 666 666',
          location: 'Barcelona, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: false,
        },
      },
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'user3@ecomama.com' },
    update: {},
    create: {
      email: 'user3@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Antonio Ruiz',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Productor de aceite de oliva ecológico.',
          phone: '+34 600 777 777',
          location: 'Sevilla, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'user4@ecomama.com' },
    update: {},
    create: {
      email: 'user4@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Isabel Torres',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Nutricionista especializada en alimentación orgánica.',
          phone: '+34 600 888 888',
          location: 'Valencia, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: true,
        },
      },
    },
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'user5@ecomama.com' },
    update: {},
    create: {
      email: 'user5@ecomama.com',
      passwordHash: hashedPassword,
      name: 'Miguel Herrera',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          bio: 'Activista medioambiental y promotor del comercio justo.',
          phone: '+34 600 999 999',
          location: 'Barcelona, España',
          isPublic: true,
        },
      },
      settings: {
        create: {
          emailNotifications: false,
        },
      },
    },
  });

  console.log('Creating communities...');
  const community1 = await prisma.community.upsert({
    where: { id: 'community-valencia-1' },
    update: {},
    create: {
      id: 'community-valencia-1',
      name: 'Huertos de Valencia',
      description: 'Comunidad de agricultores y consumidores comprometidos con la agricultura ecológica en la región de Valencia. Cultivamos variedades locales y promovemos el intercambio de conocimientos sobre técnicas sostenibles.',
      latitude: 39.4699,
      longitude: -0.3763,
      address: 'Calle del Huerto, 15',
      city: 'Valencia',
      country: 'España',
      adminId: admin1.id,
      status: CommunityStatus.ACTIVE,
    },
  });

  const community2 = await prisma.community.upsert({
    where: { id: 'community-barcelona-1' },
    update: {},
    create: {
      id: 'community-barcelona-1',
      name: 'Barcelona Sostenible',
      description: 'Red de huertos urbanos y productores locales en Barcelona. Fomentamos la agricultura urbana, los mercados de proximidad y el consumo responsable en la ciudad.',
      latitude: 41.3851,
      longitude: 2.1734,
      address: 'Carrer de la Terra, 23',
      city: 'Barcelona',
      country: 'España',
      adminId: admin2.id,
      status: CommunityStatus.ACTIVE,
    },
  });

  const community3 = await prisma.community.upsert({
    where: { id: 'community-sevilla-1' },
    update: {},
    create: {
      id: 'community-sevilla-1',
      name: 'Sevilla Verde',
      description: 'Comunidad andaluza dedicada a la permacultura y la producción ecológica. Organizamos talleres, ferias agrícolas y conectamos productores con consumidores locales.',
      latitude: 37.3891,
      longitude: -5.9845,
      address: 'Plaza de la Cosecha, 8',
      city: 'Sevilla',
      country: 'España',
      adminId: admin3.id,
      status: CommunityStatus.ACTIVE,
    },
  });

  console.log('Creating memberships...');
  
  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: admin1.id,
        communityId: community1.id,
      }
    },
    update: {},
    create: {
      userId: admin1.id,
      communityId: community1.id,
      role: MemberRole.ADMIN,
      status: MemberStatus.APPROVED,
      requestMessage: 'Soy la fundadora de esta comunidad',
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: admin2.id,
        communityId: community2.id,
      }
    },
    update: {},
    create: {
      userId: admin2.id,
      communityId: community2.id,
      role: MemberRole.ADMIN,
      status: MemberStatus.APPROVED,
      requestMessage: 'Soy el coordinador de esta comunidad',
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: admin3.id,
        communityId: community3.id,
      }
    },
    update: {},
    create: {
      userId: admin3.id,
      communityId: community3.id,
      role: MemberRole.ADMIN,
      status: MemberStatus.APPROVED,
      requestMessage: 'Soy la líder de esta comunidad',
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: user1.id,
        communityId: community1.id,
      }
    },
    update: {},
    create: {
      userId: user1.id,
      communityId: community1.id,
      role: MemberRole.MEMBER,
      status: MemberStatus.APPROVED,
      requestMessage: 'Me gustaría unirme a vuestra comunidad',
      responseMessage: 'Bienvenido a Huertos de Valencia',
      respondedAt: new Date(),
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: user2.id,
        communityId: community2.id,
      }
    },
    update: {},
    create: {
      userId: user2.id,
      communityId: community2.id,
      role: MemberRole.MEMBER,
      status: MemberStatus.APPROVED,
      requestMessage: 'Soy chef y busco productos locales',
      responseMessage: 'Encantados de tenerte en Barcelona Sostenible',
      respondedAt: new Date(),
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: user3.id,
        communityId: community3.id,
      }
    },
    update: {},
    create: {
      userId: user3.id,
      communityId: community3.id,
      role: MemberRole.MEMBER,
      status: MemberStatus.APPROVED,
      requestMessage: 'Productor de aceite de oliva ecológico',
      responseMessage: 'Bienvenido a Sevilla Verde',
      respondedAt: new Date(),
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: user4.id,
        communityId: community1.id,
      }
    },
    update: {},
    create: {
      userId: user4.id,
      communityId: community1.id,
      role: MemberRole.MEMBER,
      status: MemberStatus.APPROVED,
      requestMessage: 'Nutricionista interesada en productos ecológicos',
      responseMessage: 'Bienvenida Isabel',
      respondedAt: new Date(),
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: user5.id,
        communityId: community2.id,
      }
    },
    update: {},
    create: {
      userId: user5.id,
      communityId: community2.id,
      role: MemberRole.MEMBER,
      status: MemberStatus.APPROVED,
      requestMessage: 'Activista medioambiental',
      responseMessage: 'Bienvenido Miguel',
      respondedAt: new Date(),
      joinedAt: new Date(),
    },
  });

  await prisma.communityMember.upsert({
    where: { 
      userId_communityId: {
        userId: user1.id,
        communityId: community2.id,
      }
    },
    update: {},
    create: {
      userId: user1.id,
      communityId: community2.id,
      role: MemberRole.MEMBER,
      status: MemberStatus.PENDING,
      requestMessage: 'También me gustaría unirme a Barcelona Sostenible',
    },
  });

  await prisma.userSettings.update({
    where: { userId: user1.id },
    data: { defaultCommunityId: community1.id },
  });

  await prisma.userSettings.update({
    where: { userId: user2.id },
    data: { defaultCommunityId: community2.id },
  });

  await prisma.userSettings.update({
    where: { userId: user3.id },
    data: { defaultCommunityId: community3.id },
  });

  await prisma.userSettings.update({
    where: { userId: user4.id },
    data: { defaultCommunityId: community1.id },
  });

  await prisma.userSettings.update({
    where: { userId: user5.id },
    data: { defaultCommunityId: community2.id },
  });

  console.log('Creating events...');
  
  await prisma.event.create({
    data: {
      communityId: community1.id,
      authorId: admin1.id,
      type: EventType.ANNOUNCEMENT,
      title: '📢 Nueva normativa de la comunidad',
      description: 'Hemos actualizado las normas de uso de los espacios comunes. Por favor, revisa las nuevas directrices en la sección de documentos. Estas normas entrarán en vigor el próximo mes.',
      isPinned: true,
    },
  });

  await prisma.event.create({
    data: {
      communityId: community1.id,
      authorId: admin1.id,
      type: EventType.EVENT,
      title: '📅 Taller de compostaje',
      description: 'Aprende técnicas de compostaje casero para aprovechar los residuos orgánicos. Traer recipientes y herramientas de jardín. Plazas limitadas.',
      eventDate: new Date('2025-10-15T10:00:00'),
      location: 'Huerto comunitario - Sector A',
      isPinned: false,
    },
  });

  await prisma.event.create({
    data: {
      communityId: community1.id,
      authorId: user1.id,
      type: EventType.NEWS,
      title: '📰 Excelente cosecha de tomates',
      description: 'Este mes hemos tenido una cosecha excepcional de tomates de variedades locales. ¡Gracias a todos por el esfuerzo en el cuidado del huerto!',
      isPinned: false,
    },
  });

  await prisma.event.create({
    data: {
      communityId: community2.id,
      authorId: admin2.id,
      type: EventType.ANNOUNCEMENT,
      title: '📢 Mantenimiento programado',
      description: 'El sistema de riego estará en mantenimiento este fin de semana. Por favor, rieguen manualmente sus parcelas si es necesario.',
      isPinned: true,
    },
  });

  await prisma.event.create({
    data: {
      communityId: community2.id,
      authorId: admin2.id,
      type: EventType.EVENT,
      title: '📅 Mercado de proximidad',
      description: 'Mercado mensual de productos locales. Ven a comprar frutas, verduras, miel y productos artesanales directamente de los productores.',
      eventDate: new Date('2025-10-20T09:00:00'),
      location: 'Plaza principal del mercado',
      isPinned: false,
    },
  });

  await prisma.event.create({
    data: {
      communityId: community3.id,
      authorId: admin3.id,
      type: EventType.EVENT,
      title: '📅 Curso de permacultura',
      description: 'Introducción a los principios de permacultura y diseño de sistemas sostenibles. Incluye certificado de asistencia.',
      eventDate: new Date('2025-10-25T16:00:00'),
      location: 'Centro comunitario',
      isPinned: false,
    },
  });

  console.log('Creating listings...');
  
  await prisma.listing.create({
    data: {
      type: ListingType.OFFER,
      title: '🥬 Lechugas ecológicas variadas',
      description: 'Lechugas frescas de cultivo ecológico: romana, hoja de roble, iceberg. Recién cosechadas. 2€/unidad o 5€ las 3.',
      authorId: user1.id,
      communityId: community1.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.OFFER,
      title: '🍅 Tomates de variedad local',
      description: 'Tomates de huerta de variedades tradicionales valencianas. Perfectos para ensaladas y conservas. 3€/kg.',
      authorId: user1.id,
      communityId: community1.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.DEMAND,
      title: '🥕 Busco zanahorias ecológicas',
      description: 'Necesito zanahorias ecológicas frescas para preparaciones culinarias. Cantidad: 5-10 kg.',
      authorId: user2.id,
      communityId: community2.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.OFFER,
      title: '🫒 Aceite de oliva virgen extra',
      description: 'Aceite de oliva virgen extra de producción propia. Primera presión en frío. Variedad picual. Botellas de 500ml y 1L.',
      authorId: user3.id,
      communityId: community3.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.OFFER,
      title: '🍯 Miel de flores silvestres',
      description: 'Miel artesanal de colmenas propias. Producción limitada de primavera. Tarros de 500g.',
      authorId: user3.id,
      communityId: community3.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.DEMAND,
      title: '🌿 Busco hierbas aromáticas',
      description: 'Busco albahaca, cilantro, perejil y menta frescos para restaurante. Necesito suministro regular.',
      authorId: user2.id,
      communityId: community2.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.OFFER,
      title: '🥒 Pepinos de invernadero',
      description: 'Pepinos cultivados en invernadero ecológico. Disponibles todo el año. 1.5€/kg.',
      authorId: user4.id,
      communityId: community1.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.DEMAND,
      title: '🍋 Necesito limones ecológicos',
      description: 'Busco limones ecológicos sin tratamiento para hacer zumos y conservas. Cantidad: 2-3 kg semanales.',
      authorId: user5.id,
      communityId: community2.id,
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      type: ListingType.OFFER,
      title: '🥔 Patatas de cultivo tradicional',
      description: 'Patatas de variedades tradicionales andaluzas. Perfectas para freír y cocer. Sacos de 5kg y 10kg.',
      authorId: user3.id,
      communityId: community3.id,
      status: ListingStatus.ACTIVE,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- 9 users created (1 superadmin, 3 admins, 5 regular users)');
  console.log('- 3 communities created (Valencia, Barcelona, Sevilla)');
  console.log('- 9 memberships created (6 approved, 1 pending)');
  console.log('- 6 events created (2 pinned announcements, 3 events, 1 news)');
  console.log('- 9 listings created (6 offers, 3 demands)');
  console.log('\n🔑 Login credentials (all users):');
  console.log('Password: password123');
  console.log('\n👥 Test accounts:');
  console.log('- superadmin@ecomama.com (SUPERADMIN)');
  console.log('- admin1@ecomama.com (Valencia admin)');
  console.log('- admin2@ecomama.com (Barcelona admin)');
  console.log('- admin3@ecomama.com (Sevilla admin)');
  console.log('- user1@ecomama.com (Valencia member)');
  console.log('- user2@ecomama.com (Barcelona member)');
  console.log('- user3@ecomama.com (Sevilla member)');
  console.log('- user4@ecomama.com (Valencia member)');
  console.log('- user5@ecomama.com (Barcelona member)');
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

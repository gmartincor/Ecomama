import { PrismaClient, UserRole, UserStatus, ListingType, ListingStatus, EventType } from '@prisma/client';
import { PasswordService } from '../lib/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Global seed starting...');

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
      profile: { create: { bio: 'Platform superadmin', phone: '+34 600 111 111', location: 'Madrid, España' } },
      settings: { create: { emailNotifications: true } },
    },
  });

  console.log('Creating 8 users...');
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'maria@ecomama.com' }, update: {}, create: { email: 'maria@ecomama.com', passwordHash: hashedPassword, name: 'María García', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Agricultora ecológica', phone: '+34 600 222 222', location: 'Valencia, España' } }, settings: { create: { emailNotifications: true } } } }),
    prisma.user.upsert({ where: { email: 'juan@ecomama.com' }, update: {}, create: { email: 'juan@ecomama.com', passwordHash: hashedPassword, name: 'Juan Martínez', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Coordinador de huertos urbanos', phone: '+34 600 333 333', location: 'Barcelona, España' } }, settings: { create: { emailNotifications: true } } } }),
    prisma.user.upsert({ where: { email: 'carmen@ecomama.com' }, update: {}, create: { email: 'carmen@ecomama.com', passwordHash: hashedPassword, name: 'Carmen López', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Ingeniera agrónoma', phone: '+34 600 444 444', location: 'Sevilla, España' } }, settings: { create: { emailNotifications: true } } } }),
    prisma.user.upsert({ where: { email: 'pedro@ecomama.com' }, update: {}, create: { email: 'pedro@ecomama.com', passwordHash: hashedPassword, name: 'Pedro Sánchez', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Apasionado por agricultura ecológica', phone: '+34 600 555 555', location: 'Valencia, España' } }, settings: { create: { emailNotifications: true } } } }),
    prisma.user.upsert({ where: { email: 'laura@ecomama.com' }, update: {}, create: { email: 'laura@ecomama.com', passwordHash: hashedPassword, name: 'Laura Fernández', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Chef de productos locales', phone: '+34 600 666 666', location: 'Barcelona, España' } }, settings: { create: { emailNotifications: false } } } }),
    prisma.user.upsert({ where: { email: 'antonio@ecomama.com' }, update: {}, create: { email: 'antonio@ecomama.com', passwordHash: hashedPassword, name: 'Antonio Ruiz', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Productor de aceite de oliva', phone: '+34 600 777 777', location: 'Sevilla, España' } }, settings: { create: { emailNotifications: true } } } }),
    prisma.user.upsert({ where: { email: 'isabel@ecomama.com' }, update: {}, create: { email: 'isabel@ecomama.com', passwordHash: hashedPassword, name: 'Isabel Torres', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Nutricionista', phone: '+34 600 888 888', location: 'Valencia, España' } }, settings: { create: { emailNotifications: true } } } }),
    prisma.user.upsert({ where: { email: 'miguel@ecomama.com' }, update: {}, create: { email: 'miguel@ecomama.com', passwordHash: hashedPassword, name: 'Miguel Herrera', role: UserRole.USER, status: UserStatus.ACTIVE, profile: { create: { bio: 'Activista medioambiental', phone: '+34 600 999 999', location: 'Barcelona, España' } }, settings: { create: { emailNotifications: false } } } }),
  ]);

  console.log('Creating 6 global events...');
  const events = await Promise.all([
    prisma.event.create({ data: { authorId: superadmin.id, type: EventType.ANNOUNCEMENT, title: '¡Bienvenidos a Ecomama!', description: 'Plataforma global de agricultura sostenible', isPinned: true, latitude: 40.4168, longitude: -3.7038, location: 'Madrid' } }),
    prisma.event.create({ data: { authorId: users[0].id, type: EventType.EVENT, title: 'Taller de compostaje', description: 'Aprende técnicas de compostaje casero', eventDate: new Date('2025-12-15T10:00:00'), location: 'Valencia', latitude: 39.4699, longitude: -0.3763 } }),
    prisma.event.create({ data: { authorId: users[1].id, type: EventType.EVENT, title: 'Mercado de proximidad', description: 'Mercado mensual de productos locales', eventDate: new Date('2025-12-20T09:00:00'), location: 'Barcelona', latitude: 41.3851, longitude: 2.1734 } }),
    prisma.event.create({ data: { authorId: users[2].id, type: EventType.EVENT, title: 'Curso de permacultura', description: 'Introducción a permacultura', eventDate: new Date('2025-12-25T16:00:00'), location: 'Sevilla', latitude: 37.3891, longitude: -5.9845 } }),
    prisma.event.create({ data: { authorId: users[3].id, type: EventType.ANNOUNCEMENT, title: 'Excelente cosecha', description: 'Cosecha excepcional de tomates' } }),
    prisma.event.create({ data: { authorId: superadmin.id, type: EventType.ANNOUNCEMENT, title: 'Nuevas funcionalidades', description: 'Mapa global disponible', isPinned: true } }),
  ]);

  console.log('Creating 10 global listings...');
  await Promise.all([
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🥬 Lechugas ecológicas', description: 'Lechugas frescas variadas', authorId: users[0].id, status: ListingStatus.ACTIVE, latitude: 39.4699, longitude: -0.3763, city: 'Valencia', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🍅 Tomates locales', description: 'Tomates tradicionales', authorId: users[0].id, status: ListingStatus.ACTIVE, latitude: 39.4699, longitude: -0.3763, city: 'Valencia', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.DEMAND, title: '🥕 Busco zanahorias', description: 'Necesito zanahorias ecológicas', authorId: users[4].id, status: ListingStatus.ACTIVE, latitude: 41.3851, longitude: 2.1734, city: 'Barcelona', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🫒 Aceite de oliva', description: 'Aceite virgen extra', authorId: users[5].id, status: ListingStatus.ACTIVE, latitude: 37.3891, longitude: -5.9845, city: 'Sevilla', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🍯 Miel artesanal', description: 'Miel de flores silvestres', authorId: users[5].id, status: ListingStatus.ACTIVE, latitude: 37.3891, longitude: -5.9845, city: 'Sevilla', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.DEMAND, title: '🌿 Busco hierbas', description: 'Hierbas aromáticas frescas', authorId: users[4].id, status: ListingStatus.ACTIVE, latitude: 41.3851, longitude: 2.1734, city: 'Barcelona', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🥒 Pepinos', description: 'Pepinos de invernadero', authorId: users[6].id, status: ListingStatus.ACTIVE, latitude: 39.4699, longitude: -0.3763, city: 'Valencia', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.DEMAND, title: '🍋 Busco limones', description: 'Limones ecológicos', authorId: users[7].id, status: ListingStatus.ACTIVE, latitude: 41.3851, longitude: 2.1734, city: 'Barcelona', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🥔 Patatas tradicionales', description: 'Patatas andaluzas', authorId: users[5].id, status: ListingStatus.ACTIVE, latitude: 37.3891, longitude: -5.9845, city: 'Sevilla', country: 'España' } }),
    prisma.listing.create({ data: { type: ListingType.OFFER, title: '🌽 Maíz dulce', description: 'Maíz de temporada', authorId: users[1].id, status: ListingStatus.ACTIVE, latitude: 41.3851, longitude: 2.1734, city: 'Barcelona', country: 'España' } }),
  ]);

  console.log('Creating event attendees...');
  await Promise.all([
    prisma.eventAttendee.create({ data: { eventId: events[1].id, userId: users[3].id, status: 'REGISTERED' } }),
    prisma.eventAttendee.create({ data: { eventId: events[1].id, userId: users[6].id, status: 'REGISTERED' } }),
    prisma.eventAttendee.create({ data: { eventId: events[2].id, userId: users[4].id, status: 'REGISTERED' } }),
    prisma.eventAttendee.create({ data: { eventId: events[2].id, userId: users[7].id, status: 'REGISTERED' } }),
    prisma.eventAttendee.create({ data: { eventId: events[3].id, userId: users[0].id, status: 'REGISTERED' } }),
  ]);

  console.log('\n✅ Global seed completed!');
  console.log('\n📊 Summary:');
  console.log('- 9 users (1 superadmin, 8 users)');
  console.log('- 6 global events (2 pinned)');
  console.log('- 10 global listings (7 offers, 3 demands)');
  console.log('- 5 event registrations');
  console.log('\n🔑 Password: password123');
  console.log('\n👥 Accounts: superadmin@ecomama.com, maria@ecomama.com, juan@ecomama.com, carmen@ecomama.com, pedro@ecomama.com, laura@ecomama.com, antonio@ecomama.com, isabel@ecomama.com, miguel@ecomama.com');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });

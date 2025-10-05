import { prisma } from '@/lib/prisma/client';
import { registerSchema } from '@/lib/validations/auth';
import { PasswordService } from '@/lib/utils/password';
import { ApiResponse, handleApiError } from '@/lib/utils/api-response';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse.badRequest(validation.error.issues[0].message);
    }

    const { email, password, name } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return ApiResponse.badRequest('El email ya está registrado');
    }

    const passwordHash = await PasswordService.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'USER',
        status: 'ACTIVE',
        profile: {
          create: {
            isPublic: true,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return ApiResponse.created({ message: 'Usuario creado exitosamente', user });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { requireAuth, AuthenticatedSession } from '@/lib/utils/auth-helpers';
import { ApiResponse, handleApiError } from '@/lib/utils/api-response';

type RouteContext = {
  params?: Record<string, any>;
  searchParams?: URLSearchParams;
  session?: AuthenticatedSession;
  body?: any;
};

type RouteHandler<T = any> = (context: RouteContext) => Promise<T>;

type AuthorizationCheck = (context: RouteContext) => Promise<boolean>;

type RouteConfig<T = any> = {
  handler: RouteHandler<T>;
  authRequired?: boolean;
  bodySchema?: ZodSchema;
  authorize?: AuthorizationCheck;
};

export const createRouteHandler = <T = any>(config: RouteConfig<T>) => {
  return async (request: Request, { params }: { params?: Promise<any> } = {}) => {
    try {
      const context: RouteContext = {};

      if (config.authRequired !== false) {
        context.session = await requireAuth();
      }

      if (params) {
        context.params = await params;
      }

      const url = new URL(request.url);
      context.searchParams = url.searchParams;

      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const body = await request.json();
        
        if (config.bodySchema) {
          context.body = config.bodySchema.parse(body);
        } else {
          context.body = body;
        }
      }

      if (config.authorize) {
        const authorized = await config.authorize(context);
        if (!authorized) {
          return ApiResponse.forbidden('No tienes permisos para esta operación');
        }
      }

      const result = await config.handler(context);
      
      return request.method === 'POST'
        ? ApiResponse.created(result)
        : ApiResponse.success(result);
    } catch (error) {
      return handleApiError(error);
    }
  };
};

export const createGetHandler = <T = any>(
  handler: RouteHandler<T>,
  authRequired = true,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, authRequired, authorize });

export const createPostHandler = <T = any>(
  handler: RouteHandler<T>,
  bodySchema?: ZodSchema,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, bodySchema, authorize });

export const createPutHandler = <T = any>(
  handler: RouteHandler<T>,
  bodySchema?: ZodSchema,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, bodySchema, authorize });

export const createDeleteHandler = <T = any>(
  handler: RouteHandler<T>,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, authorize });

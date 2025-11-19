import { ZodSchema } from 'zod';
import { requireAuth, AuthenticatedSession } from '@/lib/utils/auth-helpers';
import { ApiResponse, handleApiError } from '@/lib/utils/api-response';

type RouteContext = {
  params?: Record<string, string | string[] | undefined>;
  searchParams?: URLSearchParams;
  session?: AuthenticatedSession;
  body?: unknown;
};

type RouteHandler<T = unknown> = (context: RouteContext) => Promise<T>;

type AuthorizationCheck = (context: RouteContext) => Promise<boolean>;

type RouteConfig<T = unknown> = {
  handler: RouteHandler<T>;
  authRequired?: boolean;
  bodySchema?: ZodSchema;
  authorize?: AuthorizationCheck;
};

type NextJSRouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

export const createRouteHandler = <T = unknown>(config: RouteConfig<T>) => {
  return async (
    request: Request, 
    nextContext: NextJSRouteContext
  ) => {
    try {
      const routeContext: RouteContext = {};

      if (config.authRequired !== false) {
        routeContext.session = await requireAuth();
      }

      if (nextContext.params) {
        routeContext.params = await nextContext.params;
      }

      const url = new URL(request.url);
      routeContext.searchParams = url.searchParams;

      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const contentType = request.headers.get('content-type');
        const hasBody = contentType?.includes('application/json');
        
        if (hasBody) {
          try {
            const body = await request.json();
            
            if (config.bodySchema) {
              routeContext.body = config.bodySchema.parse(body);
            } else {
              routeContext.body = body;
            }
          } catch {
            routeContext.body = undefined;
          }
        }
      }

      if (config.authorize) {
        const authorized = await config.authorize(routeContext);
        if (!authorized) {
          return ApiResponse.forbidden('No tienes permisos para esta operación');
        }
      }

      const result = await config.handler(routeContext);
      
      return request.method === 'POST'
        ? ApiResponse.created(result)
        : ApiResponse.success(result);
    } catch (error) {
      return handleApiError(error);
    }
  };
};

export const createGetHandler = <T = unknown>(
  handler: RouteHandler<T>,
  authRequired = true,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, authRequired, authorize });

export const createPostHandler = <T = unknown>(
  handler: RouteHandler<T>,
  bodySchema?: ZodSchema,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, bodySchema, authorize });

export const createPutHandler = <T = unknown>(
  handler: RouteHandler<T>,
  bodySchema?: ZodSchema,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, bodySchema, authorize });

export const createDeleteHandler = <T = unknown>(
  handler: RouteHandler<T>,
  authorize?: AuthorizationCheck
) => createRouteHandler({ handler, authorize });

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && !fallback) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback!;
};

const getOptionalEnvVar = (key: string, fallback?: string): string | undefined => {
  return process.env[key] || fallback;
};

export const env = {
  get DATABASE_URL() {
    return getEnvVar('DATABASE_URL');
  },
  
  get AUTH_SECRET() {
    return getOptionalEnvVar('NEXTAUTH_SECRET') || 
           getOptionalEnvVar('AUTH_SECRET') || 
           (this.IS_DEVELOPMENT ? 'dev-secret-key-not-for-production' : '');
  },
  
  get NEXTAUTH_URL() {
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  },
  
  get TRUST_HOST() {
    const authTrustHost = getOptionalEnvVar('AUTH_TRUST_HOST');
    if (authTrustHost) return authTrustHost === 'true';
    return !!process.env.VERCEL;
  },

  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  },

  get IS_PRODUCTION() {
    return this.NODE_ENV === 'production';
  },

  get IS_DEVELOPMENT() {
    return this.NODE_ENV === 'development';
  },
};

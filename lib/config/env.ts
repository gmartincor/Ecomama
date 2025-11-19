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
    // In development, use a default secret for convenience
    if (this.IS_DEVELOPMENT) {
      return getOptionalEnvVar('NEXTAUTH_SECRET') || 
             getOptionalEnvVar('AUTH_SECRET') || 
             'dev-secret-key-not-for-production';
    }
    
    // In production, AUTH_SECRET is REQUIRED
    const secret = getOptionalEnvVar('NEXTAUTH_SECRET') || getOptionalEnvVar('AUTH_SECRET');
    if (!secret) {
      throw new Error(
        'AUTH_SECRET or NEXTAUTH_SECRET is required in production. ' +
        'Generate one with: openssl rand -base64 32'
      );
    }
    return secret;
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

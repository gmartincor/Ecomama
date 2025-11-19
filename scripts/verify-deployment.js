#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Checks that all necessary configurations are in place before deploying to Vercel
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, name) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✓ ${name} exists`, colors.green);
  } else {
    log(`✗ ${name} is missing`, colors.red);
  }
  return exists;
}

function checkEnvVariable(varName, required = true) {
  const value = process.env[varName];
  if (value) {
    log(`✓ ${varName} is set`, colors.green);
    return true;
  } else if (required) {
    log(`✗ ${varName} is not set (required)`, colors.red);
    return false;
  } else {
    log(`⚠ ${varName} is not set (optional)`, colors.yellow);
    return true;
  }
}

function checkPackageJson() {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    );

    log('\nChecking package.json scripts...', colors.blue);
    
    const requiredScripts = ['build', 'start', 'vercel-build'];
    let allScriptsExist = true;

    requiredScripts.forEach((script) => {
      if (packageJson.scripts[script]) {
        log(`✓ Script "${script}" exists`, colors.green);
      } else {
        log(`✗ Script "${script}" is missing`, colors.red);
        allScriptsExist = false;
      }
    });

    return allScriptsExist;
  } catch (error) {
    log(`✗ Error reading package.json: ${error.message}`, colors.red);
    return false;
  }
}

function checkPrismaSchema() {
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    log('\nChecking Prisma schema...', colors.blue);

    if (schema.includes('provider = "postgresql"')) {
      log('✓ Using PostgreSQL provider', colors.green);
      return true;
    } else {
      log('✗ Not using PostgreSQL provider', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Error reading Prisma schema: ${error.message}`, colors.red);
    return false;
  }
}

function main() {
  log('\n=== Ecomama Pre-Deployment Verification ===\n', colors.blue);

  let allChecks = true;

  // Check required files
  log('Checking required files...', colors.blue);
  allChecks = checkFile(path.join(process.cwd(), 'vercel.json'), 'vercel.json') && allChecks;
  allChecks = checkFile(path.join(process.cwd(), 'next.config.ts'), 'next.config.ts') && allChecks;
  allChecks = checkFile(path.join(process.cwd(), 'prisma/schema.prisma'), 'prisma/schema.prisma') && allChecks;
  allChecks = checkFile(path.join(process.cwd(), '.env.example'), '.env.example') && allChecks;

  // Check package.json
  allChecks = checkPackageJson() && allChecks;

  // Check Prisma schema
  allChecks = checkPrismaSchema() && allChecks;

  // Check environment variables (if .env exists)
  if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    log('\n⚠ .env file found - remember to set these variables in Vercel Dashboard:', colors.yellow);
    log('  - DATABASE_URL (auto-configured when you connect Postgres)', colors.reset);
    log('  - AUTH_SECRET (generate with: openssl rand -base64 32)', colors.reset);
    log('  - NEXTAUTH_URL (optional, auto-detected by Vercel)', colors.reset);
  } else {
    log('\n✓ .env file not found (this is OK for deployment)', colors.green);
  }

  // Final summary
  log('\n=== Summary ===\n', colors.blue);
  
  if (allChecks) {
    log('✓ All checks passed! Ready to deploy to Vercel.', colors.green);
    log('\nNext steps:', colors.blue);
    log('1. Push your code to GitHub', colors.reset);
    log('2. Import your repository in Vercel', colors.reset);
    log('3. Add a Postgres database from the Storage tab', colors.reset);
    log('4. Set AUTH_SECRET in Environment Variables', colors.reset);
    log('5. Deploy!', colors.reset);
    process.exit(0);
  } else {
    log('✗ Some checks failed. Please fix the issues above before deploying.', colors.red);
    process.exit(1);
  }
}

main();

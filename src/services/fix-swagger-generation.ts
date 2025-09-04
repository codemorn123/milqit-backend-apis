import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as glob from 'glob';

/**
 * Script to diagnose and fix TSOA Swagger generation issues
 */
function fixSwaggerGeneration() {
  console.log('🔍 Starting TSOA Swagger diagnosis and fix...');
  
  // Check controller files
  checkControllerFiles();
  
  // Force generate separate swagger files
  generateSwaggerFiles();
  
  // Check generated files
  checkGeneratedFiles();
}

/**
 * Check controller files to ensure we have both admin and mobile controllers
 */
function checkControllerFiles() {
  console.log('\n📁 Checking controller files...');
  
  // Search for controller files
  const adminControllers = glob.sync('./src/controllers/admin/**/*.ts');
  const mobileControllers = glob.sync('./src/controllers/mobile/**/*.ts');
  
  console.log(`Found ${adminControllers.length} admin controllers:`);
  adminControllers.forEach(file => console.log(`  - ${file}`));
  
  console.log(`Found ${mobileControllers.length} mobile controllers:`);
  mobileControllers.forEach(file => console.log(`  - ${file}`));
  
  // Create sample controllers if none found
  if (adminControllers.length === 0) {
    console.log('⚠️ No admin controllers found! Creating a sample admin controller...');
    createSampleController('admin');
  }
  
  if (mobileControllers.length === 0) {
    console.log('⚠️ No mobile controllers found! Creating a sample mobile controller...');
    createSampleController('mobile');
  }
}

/**
 * Create a sample controller for testing
 */
function createSampleController(type: 'admin' | 'mobile') {
  const dir = `./src/controllers/${type}`;
  const file = path.join(dir, 'TestController.ts');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create a sample controller
  const content = `
import { Controller, Get, Route, Tags } from 'tsoa';

@Route("test")
@Tags("${type === 'admin' ? 'Admin' : 'Mobile'}")
export class ${type === 'admin' ? 'Admin' : 'Mobile'}TestController extends Controller {
  /**
   * Test endpoint for ${type === 'admin' ? 'Admin' : 'Mobile'} API
   */
  @Get()
  public async getTest(): Promise<{ message: string }> {
    return { message: "${type === 'admin' ? 'Admin' : 'Mobile'} API is working" };
  }
}
`;
  
  fs.writeFileSync(file, content);
  console.log(`✅ Created sample ${type} controller: ${file}`);
}

/**
 * Separate generation of Swagger files for admin and mobile
 */
function generateSwaggerFiles() {
  console.log('\n🔄 Generating separate Swagger files...');
  const buildDir = path.resolve(process.cwd(), 'build');
  
  // Ensure build directory exists
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Generate admin swagger separately
  console.log('\n📝 Generating Admin Swagger...');
  try {
    execSync('npx tsoa spec -c tsoa.admin.json', { stdio: 'inherit' });
    console.log('✅ Admin Swagger generation completed');
  } catch (error) {
    console.error('❌ Error generating admin swagger:', error instanceof Error ? error.message : String(error));
    console.log('Creating minimal admin swagger file...');
    createMinimalSwagger('admin');
  }
  
  // Generate mobile swagger separately
  console.log('\n📝 Generating Mobile Swagger...');
  try {
    execSync('npx tsoa spec -c tsoa.mobile.json', { stdio: 'inherit' });
    console.log('✅ Mobile Swagger generation completed');
  } catch (error) {
    console.error('❌ Error generating mobile swagger:', error instanceof Error ? error.message : String(error));
    console.log('Creating minimal mobile swagger file...');
    createMinimalSwagger('mobile');
  }
  
  // Generate routes files separately
  console.log('\n📝 Generating route files...');
  try {
    execSync('npx tsoa routes -c tsoa.admin.json', { stdio: 'inherit' });
    console.log('✅ Admin routes generation completed');
  } catch (error) {
    console.error('❌ Error generating admin routes:', error instanceof Error ? error.message : String(error));
  }
  
  try {
    execSync('npx tsoa routes -c tsoa.mobile.json', { stdio: 'inherit' });
    console.log('✅ Mobile routes generation completed');
  } catch (error) {
    console.error('❌ Error generating mobile routes:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Create a minimal swagger file if generation fails
 */
function createMinimalSwagger(type: 'admin' | 'mobile') {
  const buildDir = path.resolve(process.cwd(), 'build');
  const filePath = path.join(buildDir, `swagger.${type}.json`);
  
  const minimalSwagger = {
    openapi: "3.0.0",
    info: {
      title: `MilQit ${type === 'admin' ? 'Admin' : 'Mobile'} API`,
      version: "1.0.0",
      description: `API Documentation for ${type === 'admin' ? 'Admin' : 'Mobile'} Interface`
    },
    servers: [
      {
        url: `/v1/${type}`,
        description: `${type === 'admin' ? 'Admin' : 'Mobile'} API Server`
      }
    ],
    paths: {
      [`/test`]: {
        get: {
          operationId: "GetTest",
          tags: [`${type === 'admin' ? 'Admin' : 'Mobile'}`],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {}
    },
    basePath: `/v1/${type}`
  };
  
  fs.writeFileSync(filePath, JSON.stringify(minimalSwagger, null, 2));
  console.log(`✅ Created minimal ${type} swagger file: ${filePath}`);
}

/**
 * Check the generated files
 */
function checkGeneratedFiles() {
  console.log('\n🔍 Checking generated files...');
  const buildDir = path.resolve(process.cwd(), 'build');
  
  const files = fs.readdirSync(buildDir).filter(file => 
    file.endsWith('.json') || file.endsWith('.ts')
  );
  
  console.log(`Found ${files.length} files in build directory:`);
  files.forEach(file => {
    const filePath = path.join(buildDir, file);
    const fileSize = fs.statSync(filePath).size;
    console.log(`  - ${file} (${(fileSize / 1024).toFixed(2)} KB)`);
    
    // If it's a swagger file, check its content
    if (file.endsWith('.json') && file.includes('swagger')) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const paths = content.paths ? Object.keys(content.paths).length : 0;
        console.log(`    • Contains ${paths} path(s)`);
        console.log(`    • Base path: ${content.basePath || 'Not set'}`);
        if (content.servers) {
          console.log(`    • Servers: ${content.servers.map((s: any) => s.url).join(', ')}`);
        }
      } catch (error) {
        console.log(`    • Error reading file content`);
      }
    }
  });
}

// Execute the script
fixSwaggerGeneration();
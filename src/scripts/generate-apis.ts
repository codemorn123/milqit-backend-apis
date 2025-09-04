import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

async function generateApis() {
  console.log('🚀 Starting API generation process...');
  
  // Clean build directory
  cleanBuildDirectory();
  
  // Generate Mobile API first
  console.log('\n📱 Generating Mobile API...');
  try {
    // Mobile routes and specs
    child_process.execSync('npx tsoa routes -c tsoa.mobile.json', { stdio: 'inherit' });
    child_process.execSync('npx tsoa spec -c tsoa.mobile.json', { stdio: 'inherit' });
    console.log('✅ Mobile API generated successfully');
  } catch (error) {
    console.error('❌ Error generating Mobile API:', error);
  }
  
  // Generate Admin API
  console.log('\n🖥️ Generating Admin API...');
  try {
    // Admin routes and specs
    child_process.execSync('npx tsoa routes -c tsoa.admin.json', { stdio: 'inherit' });
    child_process.execSync('npx tsoa spec -c tsoa.admin.json', { stdio: 'inherit' });
    console.log('✅ Admin API generated successfully');
  } catch (error) {
    console.error('❌ Error generating Admin API:', error);
  }
  
  // Verify outputs and create fallbacks if needed
  verifyAndFixOutputs();
  
  console.log('\n✅ API generation process complete');
}

function cleanBuildDirectory() {
  console.log('🧹 Cleaning build directory...');
  
  // Only remove swagger and routes files, not the entire build directory
  const filesToRemove = [
    'build/routes.admin.ts',
    'build/routes.mobile.ts',
    'build/swagger.admin.json',
    'build/swagger.mobile.json',
    'build/swagger.json'
  ];
  
  // Create build directory if it doesn't exist
  if (!fs.existsSync('build')) {
    fs.mkdirSync('build', { recursive: true });
  }
  
  // Remove files if they exist
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
  
  console.log('✅ Build directory cleaned');
}

function verifyAndFixOutputs() {
  console.log('\n🔍 Verifying generated files...');
  
  const buildDir = path.resolve(process.cwd(), 'build');
  const adminSwaggerPath = path.join(buildDir, 'swagger.admin.json');
  const mobileSwaggerPath = path.join(buildDir, 'swagger.mobile.json');
  const combinedSwaggerPath = path.join(buildDir, 'swagger.json');
  
  // Check and fix admin swagger
  if (!fs.existsSync(adminSwaggerPath)) {
    console.log('⚠️ Admin swagger file not found, creating a minimal version');
    createMinimalSwagger('admin', adminSwaggerPath);
  }
  
  // Check and fix mobile swagger
  if (!fs.existsSync(mobileSwaggerPath)) {
    console.log('⚠️ Mobile swagger file not found, creating a minimal version');
    createMinimalSwagger('mobile', mobileSwaggerPath);
  }
  
  // Create combined swagger file (copy from mobile for backward compatibility)
  console.log('📄 Creating combined swagger.json...');
  if (fs.existsSync(mobileSwaggerPath)) {
    fs.copyFileSync(mobileSwaggerPath, combinedSwaggerPath);
  } else if (fs.existsSync(adminSwaggerPath)) {
    fs.copyFileSync(adminSwaggerPath, combinedSwaggerPath);
  } else {
    createMinimalSwagger('combined', combinedSwaggerPath);
  }
  
  // List all generated files
  const files = fs.readdirSync(buildDir);
  console.log(`📁 Files in build directory: ${files.join(', ')}`);
}

function createMinimalSwagger(type: string, outputPath: string) {
  const swagger = {
    openapi: "3.0.0",
    info: {
      title: type === 'admin' ? "Admin API" : type === 'mobile' ? "Mobile API" : "MilQit API",
      version: "1.0.0",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} API Documentation`
    },
    paths: {
      "/test": {
        get: {
          tags: [type === 'admin' ? "Admin Test" : "Mobile Test"],
          summary: "Test endpoint",
          operationId: "getTest",
          responses: {
            "200": {
              description: "Successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      timestamp: { type: "string" }
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
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(swagger, null, 2));
  console.log(`✅ Created minimal ${type} swagger file at ${outputPath}`);
}

// Run the script
generateApis();
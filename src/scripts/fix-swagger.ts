import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

async function generateAndFix() {
  console.log('🔍 TSOA Generator and Fixer');
  
  // Ensure directories exist
  ensureDirectories();
  
  // Create TSOA config files
  createTsoaConfigs();
  
  // Clean build directory
  cleanBuild();
  
  // Try generating each API separately with more verbose output
  try {
    console.log('\n📝 Generating Admin Routes...');
    child_process.execSync('npx tsoa routes -c tsoa.admin.json --verbose', { 
      stdio: 'inherit',
      env: { ...process.env, TS_NODE_PROJECT: 'tsconfig.json' } 
    });
    
    console.log('\n📝 Generating Admin Swagger...');
    child_process.execSync('npx tsoa spec -c tsoa.admin.json --verbose', { 
      stdio: 'inherit',
      env: { ...process.env, TS_NODE_PROJECT: 'tsconfig.json' } 
    });
    
    console.log('\n📝 Generating Mobile Routes...');
    child_process.execSync('npx tsoa routes -c tsoa.mobile.json --verbose', { 
      stdio: 'inherit',
      env: { ...process.env, TS_NODE_PROJECT: 'tsconfig.json' } 
    });
    
    console.log('\n📝 Generating Mobile Swagger...');
    child_process.execSync('npx tsoa spec -c tsoa.mobile.json --verbose', { 
      stdio: 'inherit',
      env: { ...process.env, TS_NODE_PROJECT: 'tsconfig.json' } 
    });
    
    console.log('\n✅ Generation complete!');
  } catch (error) {
    console.error('\n❌ Error during generation:', error);
    console.log('\n🔧 Creating fallback swagger files...');
    createFallbackSwaggerFiles();
  }
  
  // Check results
  checkResults();
}

function ensureDirectories() {
  console.log('\n📁 Ensuring directories exist...');
  
  const dirs = [
    'build',
    'src/controllers/admin',
    'src/controllers/mobile'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function createTsoaConfigs() {
  console.log('\n📄 Creating TSOA config files...');
  
  // Admin config
const adminConfig = {
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/admin/**/*.ts"],
  "spec": {
    "outputDirectory": "build",
    "specVersion": 3,
    "outputFileName": "swagger.admin.json",
    "securityDefinitions": {
      "jwt": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "routes": {
    "routesDir": "build",
    "middleware": "express",
    "authenticationModule": "./src/middleware/auth-helper.ts",
    "routesFileName": "routes.admin.ts"
  }
};
  
// Mobile config
const mobileConfig = {
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/mobile/**/*.ts"],
  "spec": {
    "outputDirectory": "build",
    "specVersion": 3,
    "outputFileName": "swagger.mobile.json",
    "securityDefinitions": {
      "jwt": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "routes": {
    "routesDir": "build",
    "middleware": "express",
    "authenticationModule": "./src/middleware/auth-helper.ts",
    "routesFileName": "routes.mobile.ts"
  }
};
  
  fs.writeFileSync('tsoa.admin.json', JSON.stringify(adminConfig, null, 2));
  fs.writeFileSync('tsoa.mobile.json', JSON.stringify(mobileConfig, null, 2));
}

function cleanBuild() {
  console.log('\n🧹 Cleaning build directory...');
  
  if (fs.existsSync('build')) {
    // Remove only swagger and route files, keep other build artifacts
    const filesToRemove = [
      'build/routes.admin.ts',
      'build/routes.mobile.ts',
      'build/swagger.admin.json',
      'build/swagger.mobile.json',
      'build/swagger.json'
    ];
    
    filesToRemove.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`Removed: ${file}`);
      }
    });
  } else {
    fs.mkdirSync('build');
    console.log('Created build directory');
  }
}

function createFallbackSwaggerFiles() {
  console.log('Creating fallback swagger files...');
  
  // Admin swagger
  const adminSwagger = {
    openapi: "3.0.0",
    info: {
      title: "Admin API",
      description: "MilQit Admin API",
      version: "1.0.0"
    },
    paths: {
      "/test": {
        get: {
          operationId: "GetTest",
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
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
  
  // Mobile swagger
  const mobileSwagger = {
    openapi: "3.0.0",
    info: {
      title: "Mobile API",
      description: "MilQit Mobile API",
      version: "1.0.0"
    },
    paths: {
      "/test": {
        get: {
          operationId: "GetTest",
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
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
  
  fs.writeFileSync('build/swagger.admin.json', JSON.stringify(adminSwagger, null, 2));
  fs.writeFileSync('build/swagger.mobile.json', JSON.stringify(mobileSwagger, null, 2));
  console.log('Fallback swagger files created');
}

function checkResults() {
  console.log('\n🔍 Checking results...');
  
  const buildDir = fs.readdirSync('build');
  console.log(`Files in build directory: ${buildDir.join(', ')}`);
  
  const files = [
    'build/routes.admin.ts',
    'build/routes.mobile.ts',
    'build/swagger.admin.json',
    'build/swagger.mobile.json'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      console.log(`✅ ${file} exists (${stats.size} bytes)`);
      
      if (file.endsWith('.json')) {
        try {
          const content = JSON.parse(fs.readFileSync(file, 'utf8'));
          const pathCount = Object.keys(content.paths || {}).length;
          console.log(`   - Contains ${pathCount} paths`);
        } catch (error) {
          console.error(`   - ❌ Error parsing JSON: ${error}`);
        }
      }
    } else {
      console.error(`❌ ${file} is missing!`);
    }
  });
}

// Run the script
generateAndFix();
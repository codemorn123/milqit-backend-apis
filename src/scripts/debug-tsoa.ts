import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

console.log('🔍 TSOA Debugging Tool');

// Check environment
console.log('\n📊 Environment Information:');
console.log(`Node.js version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);

// Check if tsoa is installed
try {
  const tsoaPackageJson = require('tsoa/package.json');
  console.log(`TSOA version: ${tsoaPackageJson.version}`);
} catch (err) {
  console.error('❌ TSOA not found in node_modules! Please run: npm install tsoa');
  process.exit(1);
}

// Check configuration files
console.log('\n📄 Configuration Files:');
['tsoa.admin.json', 'tsoa.mobile.json'].forEach(configFile => {
  if (fs.existsSync(configFile)) {
    console.log(`✅ ${configFile} exists`);
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    console.log(`   - Output directory: ${config.spec?.outputDirectory}`);
    console.log(`   - Swagger filename: ${config.spec?.outputFileName}`);
    console.log(`   - Routes filename: ${config.routes?.routesFileName}`);
    console.log(`   - Controller globs: ${config.controllerPathGlobs}`);
  } else {
    console.error(`❌ ${configFile} is missing!`);
  }
});

// Check controller directories
console.log('\n📁 Controller Directories:');
['src/controllers/admin', 'src/controllers/mobile'].forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    console.log(`✅ ${dir} exists with ${files.length} files`);
    files.forEach(file => console.log(`   - ${file}`));
  } else {
    console.error(`❌ ${dir} is missing!`);
  }
});

// Generate files directly with verbose output
console.log('\n🛠️ Generating Admin Files:');
try {
  // Ensure the build directory exists
  if (!fs.existsSync('build')) {
    fs.mkdirSync('build', { recursive: true });
  }
  
  // Create minimal swagger files as fallbacks
  const minimalSwagger = {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0"
    },
    paths: {}
  };
  
  // Generate admin files step by step
  console.log('1️⃣ Generating admin routes...');
  child_process.execSync('npx tsoa routes -c tsoa.admin.json', { stdio: 'inherit' });
  
  console.log('2️⃣ Generating admin swagger...');
  child_process.execSync('npx tsoa spec -c tsoa.admin.json', { stdio: 'inherit' });
  
  // Check if swagger file was created, if not create minimal one
  if (!fs.existsSync('build/swagger.admin.json')) {
    console.warn('⚠️ Admin swagger file not created, generating minimal version');
    const adminSwagger = {...minimalSwagger, info: {...minimalSwagger.info, title: "Admin API"}};
    fs.writeFileSync('build/swagger.admin.json', JSON.stringify(adminSwagger, null, 2));
  }
  
  console.log('3️⃣ Generating mobile routes...');
  child_process.execSync('npx tsoa routes -c tsoa.mobile.json', { stdio: 'inherit' });
  
  console.log('4️⃣ Generating mobile swagger...');
  child_process.execSync('npx tsoa spec -c tsoa.mobile.json', { stdio: 'inherit' });
  
  // Check if swagger file was created, if not create minimal one
  if (!fs.existsSync('build/swagger.mobile.json')) {
    console.warn('⚠️ Mobile swagger file not created, generating minimal version');
    const mobileSwagger = {...minimalSwagger, info: {...minimalSwagger.info, title: "Mobile API"}};
    fs.writeFileSync('build/swagger.mobile.json', JSON.stringify(mobileSwagger, null, 2));
  }
  
  console.log('5️⃣ Checking generated files:');
  const buildFiles = fs.readdirSync('build');
  console.log(`Files in build directory: ${buildFiles.join(', ')}`);
  
  if (fs.existsSync('build/swagger.admin.json')) {
    console.log('✅ build/swagger.admin.json exists');
  } else {
    console.error('❌ build/swagger.admin.json is missing!');
  }
  
  if (fs.existsSync('build/swagger.mobile.json')) {
    console.log('✅ build/swagger.mobile.json exists');
  } else {
    console.error('❌ build/swagger.mobile.json is missing!');
  }
  
} catch (error) {
  console.error('❌ Error during generation:', error);
}

console.log('\n✅ Debugging complete!');
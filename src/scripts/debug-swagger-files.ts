import * as fs from 'fs';
import * as path from 'path';

function debugSwaggerFiles() {
  console.log('Debugging Swagger files...');
  
  const buildDir = path.resolve(process.cwd(), 'build');
  const files = fs.readdirSync(buildDir);
  
  console.log(`Files in build directory: ${files.join(', ')}`);
  
  // Check admin swagger
  const adminPath = path.join(buildDir, 'swagger.admin.json');
  if (fs.existsSync(adminPath)) {
    const adminContent = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
    console.log('\nAdmin Swagger:');
    console.log(`- Title: ${adminContent.info?.title || 'Not set'}`);
    console.log(`- Base path: ${adminContent.basePath || 'Not set'}`);
    console.log(`- # of paths: ${Object.keys(adminContent.paths || {}).length}`);
    console.log('- Paths:');
    for (const path of Object.keys(adminContent.paths || {})) {
      console.log(`  * ${path}`);
    }
  } else {
    console.log('\nAdmin Swagger file not found!');
  }
  
  // Check mobile swagger
  const mobilePath = path.join(buildDir, 'swagger.mobile.json');
  if (fs.existsSync(mobilePath)) {
    const mobileContent = JSON.parse(fs.readFileSync(mobilePath, 'utf8'));
    console.log('\nMobile Swagger:');
    console.log(`- Title: ${mobileContent.info?.title || 'Not set'}`);
    console.log(`- Base path: ${mobileContent.basePath || 'Not set'}`);
    console.log(`- # of paths: ${Object.keys(mobileContent.paths || {}).length}`);
    console.log('- Paths:');
    for (const path of Object.keys(mobileContent.paths || {})) {
      console.log(`  * ${path}`);
    }
  } else {
    console.log('\nMobile Swagger file not found!');
  }
}

debugSwaggerFiles();
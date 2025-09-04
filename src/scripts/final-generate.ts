import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

function main() {
  console.log('🚀 Final API Generation Script');
  
  // Step 1: Clean build directory
  console.log('\n🧹 Cleaning build directory...');
  if (fs.existsSync('build')) {
    const files = ['routes.admin.ts', 'routes.mobile.ts', 'swagger.admin.json', 'swagger.mobile.json', 'swagger.json'];
    files.forEach(file => {
      const filePath = path.join('build', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Removed: ${file}`);
      }
    });
  } else {
    fs.mkdirSync('build', { recursive: true });
  }
  
  // Step 2: Generate admin API
  console.log('\n🖥️ Generating Admin API...');
  try {
    execSync('npx tsoa spec-and-routes -c tsoa.admin.json', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log('✅ Admin API generation completed');
  } catch (error) {
    console.error('❌ Admin API generation failed');
    console.error('Error details:', error);
  }
  
  // Step 3: Generate mobile API
  console.log('\n📱 Generating Mobile API...');
  try {
    execSync('npx tsoa spec-and-routes -c tsoa.mobile.json', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log('✅ Mobile API generation completed');
  } catch (error) {
    console.error('❌ Mobile API generation failed');
    console.error('Error details:', error);
  }
  
  // Step 4: Verify generated files
  console.log('\n🔍 Verifying generated files...');
  const expectedFiles = [
    'build/routes.admin.ts',
    'build/routes.mobile.ts', 
    'build/swagger.admin.json',
    'build/swagger.mobile.json'
  ];
  
  expectedFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      console.log(`✅ ${file} (${stats.size} bytes)`);
      
      if (file.endsWith('.json')) {
        try {
          const content = JSON.parse(fs.readFileSync(file, 'utf8'));
          const pathCount = Object.keys(content.paths || {}).length;
          console.log(`   📊 Contains ${pathCount} API paths`);
        } catch (e) {
          console.warn(`   ⚠️ Could not parse JSON in ${file}`);
        }
      }
    } else {
      console.error(`❌ Missing: ${file}`);
    }
  });
  
  // Step 5: Create fallback swagger.json
  console.log('\n📄 Creating fallback swagger.json...');
  const mobileSwagger = 'build/swagger.mobile.json';
  if (fs.existsSync(mobileSwagger)) {
    fs.copyFileSync(mobileSwagger, 'build/swagger.json');
    console.log('✅ Created swagger.json from mobile swagger');
  }
  
  console.log('\n🎉 Generation process completed!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/v1/admin/docs');
  console.log('3. Visit: http://localhost:3000/v1/mobile/docs');
}

main();
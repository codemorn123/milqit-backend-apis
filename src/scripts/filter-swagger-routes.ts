import * as fs from 'fs';
import * as path from 'path';

function filterSwaggerRoutes() {
  console.log('Filtering Swagger routes to separate admin and mobile APIs...');
  
  const buildDir = path.resolve(process.cwd(), 'build');
  const sourceSwaggerPath = path.join(buildDir, 'swagger.json');
  const adminSwaggerPath = path.join(buildDir, 'swagger.admin.json');
  const mobileSwaggerPath = path.join(buildDir, 'swagger.mobile.json');
  
  if (!fs.existsSync(sourceSwaggerPath)) {
    console.error('❌ Source swagger.json does not exist!');
    return;
  }
  
  try {
    // Read the source swagger
    const swagger = JSON.parse(fs.readFileSync(sourceSwaggerPath, 'utf8'));
    
    // Create admin and mobile swagger with filtered paths and components
    const adminSwagger = JSON.parse(JSON.stringify(swagger)); // Deep clone
    const mobileSwagger = JSON.parse(JSON.stringify(swagger)); // Deep clone
    
    // Initialize path containers
    const adminPaths: Record<string, any> = {};
    const mobilePaths: Record<string, any> = {};
    
    // Set proper metadata
    adminSwagger.basePath = '/v1/admin';
    adminSwagger.servers = [{ url: '/v1/admin', description: 'Admin API Server' }];
    adminSwagger.info = adminSwagger.info || {};
    adminSwagger.info.title = 'MilQit Admin API';
    adminSwagger.info.description = 'API Documentation for Admin Interface';
    
    mobileSwagger.basePath = '/v1/mobile';
    mobileSwagger.servers = [{ url: '/v1/mobile', description: 'Mobile API Server' }];
    mobileSwagger.info = mobileSwagger.info || {};
    mobileSwagger.info.title = 'MilQit Mobile API';
    mobileSwagger.info.description = 'API Documentation for Mobile Interface';
    
    // Filter paths based on tags or path content
    if (swagger.paths) {
      console.log('\nAnalyzing API paths...');
      for (const [path, methods] of Object.entries<any>(swagger.paths)) {
        // Check each method (GET, POST, etc.) for tags or other indicators
        let isAdmin = false;
        let isMobile = false;
        let routeType = 'unknown';
        
        for (const [_, methodInfo] of Object.entries<any>(methods)) {
          if (Array.isArray(methodInfo.tags)) {
            // Check tags first (most reliable)
            isAdmin = isAdmin || methodInfo.tags.some((tag: string) => 
              tag.toLowerCase().includes('admin'));
            isMobile = isMobile || methodInfo.tags.some((tag: string) => 
              tag.toLowerCase().includes('mobile'));
          }
          
          // If no tags, check the path itself
          if (!isAdmin && !isMobile) {
            isAdmin = path.toLowerCase().includes('admin');
            isMobile = path.toLowerCase().includes('mobile');
          }
          
          // Check controller name in operationId if available
          if (!isAdmin && !isMobile && methodInfo.operationId) {
            isAdmin = isAdmin || methodInfo.operationId.includes('Admin');
            isMobile = isMobile || methodInfo.operationId.includes('Mobile');
          }
        }
        
        // If still not determined, assign based on path pattern or default to both
        if (!isAdmin && !isMobile) {
          // You might need to customize this logic based on your API structure
          if (path.startsWith('/dashboard') || path.startsWith('/management')) {
            isAdmin = true;
            routeType = 'admin (by path pattern)';
          } else if (path.startsWith('/app') || path.startsWith('/user')) {
            isMobile = true;
            routeType = 'mobile (by path pattern)';
          } else {
            // Default: include in both if can't determine
            isAdmin = true;
            isMobile = true;
            routeType = 'both (default)';
          }
        } else {
          routeType = isAdmin && isMobile ? 'both (by tags)' : 
                     isAdmin ? 'admin (by tags)' : 'mobile (by tags)';
        }
        
        console.log(`Path: ${path} => ${routeType}`);
        
        // Add to the appropriate swagger object
        if (isAdmin) {
          adminPaths[path] = methods;
        }
        
        if (isMobile) {
          mobilePaths[path] = methods;
        }
      }
    }
    
    // Set the filtered paths
    adminSwagger.paths = adminPaths;
    mobileSwagger.paths = mobilePaths;
    
    // Filter schemas/components - more complex, only keep what's needed (optional)
    // This is a basic approach - you may need more sophisticated filtering
    const adminSchemas: Record<string, any> = {};
    const mobileSchemas: Record<string, any> = {};
    
    if (swagger.components && swagger.components.schemas) {
      // This is a simplified approach - for a complete solution, 
      // you'd need to analyze which schemas are referenced in each path
      for (const [schemaName, schema] of Object.entries<any>(swagger.components.schemas)) {
        if (schemaName.includes('Admin')) {
          adminSchemas[schemaName] = schema;
        } else if (schemaName.includes('Mobile')) {
          mobileSchemas[schemaName] = schema;
        } else {
          // If not clearly identified, include in both
          adminSchemas[schemaName] = schema;
          mobileSchemas[schemaName] = schema;
        }
      }
      
      adminSwagger.components.schemas = adminSchemas;
      mobileSwagger.components.schemas = adminSwagger.components.schemas; // Using all schemas is safer
    }
    
    // Write the files
    fs.writeFileSync(adminSwaggerPath, JSON.stringify(adminSwagger, null, 2));
    fs.writeFileSync(mobileSwaggerPath, JSON.stringify(mobileSwagger, null, 2));
    
    console.log(`\n✅ Created filtered swagger files: ${path.basename(adminSwaggerPath)} and ${path.basename(mobileSwaggerPath)}`);
    console.log(`Admin paths: ${Object.keys(adminPaths).length}`);
    console.log(`Mobile paths: ${Object.keys(mobilePaths).length}`);
    
  } catch (error) {
    console.error('❌ Error filtering swagger routes:', 
      error instanceof Error ? error.message : String(error));
  }
}

filterSwaggerRoutes();
export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Milqit E-commerce API",
    version: "1.0.0",
    description: "E-commerce API with admin and mobile interfaces",
    contact: {
      name: "MarotiKathoke",
      email: "maroti@milqit.com"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server"
    },
    {
      url: "https://api-staging.milqit.com",
      description: "Staging server"
    },
    {
      url: "https://api.milqit.com",
      description: "Production server"
    }
  ],
  components: {
    securitySchemes: {
      adminAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Admin JWT token with Bearer prefix"
      },
      userAuth: {
        type: "apiKey", 
        in: "header",
        name: "Authorization",
        description: "User JWT token with Bearer prefix"
      }
    }
  }
};

export const getSwaggerDocument = async (filterType?: 'admin' | 'mobile') => {
  try {
    // Try to import generated swagger first
    const swaggerModule = await import('../../build/swagger.json');
    const generatedDoc = swaggerModule.default || swaggerModule;
    
    // Merge with our config
    const mergedDoc = {
      ...swaggerConfig,
      ...generatedDoc,
      servers: swaggerConfig.servers, // Always use our servers
      info: {
        ...swaggerConfig.info,
        ...generatedDoc.info
      }
    };

    if (filterType) {
      const filteredPaths = Object.keys(mergedDoc.paths || {})
        .filter(path => path.includes(`/${filterType}/`))
        .reduce((obj: any, key) => {
          obj[key] = mergedDoc.paths[key];
          return obj;
        }, {});

      return {
        ...mergedDoc,
        paths: filteredPaths,
        info: {
          ...mergedDoc.info,
          title: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} API - Milqit`
        }
      };
    }

    return mergedDoc;
  } catch (error) {
    console.error('Error loading swagger document:', error);
    // Return base config if import fails
    return {
      ...swaggerConfig,
      paths: {}
    };
  }
};
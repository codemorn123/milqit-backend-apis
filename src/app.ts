import express, {} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { logger } from './config/logger';
import pinoHttp from 'pino-http';
import morgan from 'morgan';
import { RegisterRoutes } from '../build/routes';
import adminProductRoutes from './routes/admin/productRoutes'
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/error';
import path from 'path';
import upload from './utils/upload';
const app = express();

// Set up logging middleware
app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: req => req.url === '/health'
  }
}));

// Security and utility middleware
app.use(helmet({
  // Allow Swagger UI to function properly
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



const stream = {
	write: (message: string) => logger.info(message.trim() + '\n')
};
app.use(morgan('combined', { stream }));

// enable cors
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true
	})
);

// parse cookies
app.use(cookieParser());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));
// app.use(errorHandler);
app.use(errorHandler);
// timezone
// app.use(timezone);
// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0'
  });
});










// Middleware
const createMulterMiddleware = () => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('🔍 Multer Middleware - Request Details:');
    console.log('- URL:', req.url);
    console.log('- Method:', req.method);
    console.log('- Content-Type:', req.get('Content-Type'));
    console.log('- Content-Length:', req.get('Content-Length'));

    // Only apply multer to POST requests on image routes
    if (req.method === 'POST' && req.url.includes('/images')) {
      console.log('📁 Applying multer to image upload request');
      
      // Use multer single file upload
      const multerSingle = upload.single('file');
      
      multerSingle(req, res, (err) => {
        if (err) {
          console.error('❌ Multer error:', err);
          return res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`
          });
        }
        
        console.log('✅ Multer processed successfully');
        console.log('- File:', (req as any).file ? 'Present' : 'Missing');
        console.log('- Body:', req.body);
        
        // Log file details if present
        if ((req as any).file) {
          console.log('📄 File details:', {
            fieldname: (req as any).file.fieldname,
            originalname: (req as any).file.originalname,
            filename: (req as any).file.filename,
            size: (req as any).file.size,
            mimetype: (req as any).file.mimetype
          });
        }
        
        next();
      });
    } else {
      // For non-upload requests, proceed normally
      next();
    }
  };
};

// Apply the multer middleware BEFORE TSOA routes
app.use(createMulterMiddleware());

const v1Router = express.Router();
app.use('/uploads', express.static('uploads'));

// app.use('/v1/admin/categories', adminCategoryRoutes);
app.use('/v1/admin/products', adminProductRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
RegisterRoutes(v1Router);
// app.use('/v1', v1Router); 

app.use('/v1',v1Router,(req, res, next) => {
  if (req.is('multipart/form-data')) {
    console.log('⏭️ Skipping JSON parsing for multipart request');
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});




app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global Error Handler:', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    url: req.url,
    method: req.method,
    contentType: req.get('Content-Type')
  });

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field. Expected field name: "file"'
    });
  }

  const statusCode = error.statusCode || error.status || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error 
    })
  });
});




  const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};
app.use('/docs', swaggerUi.serve, async (_req, res) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json'),swaggerOptions)
  );
});

// Admin Swagger (separate documentation)
app.use('/admin-docs', swaggerUi.serve, async (_req, res) => {
  const swaggerDoc = await import('../build/swagger.json');
  // Filter only admin routes
  const adminSwagger = {
    ...swaggerDoc,
    paths: Object.keys(swaggerDoc.paths)
      .filter(path => path.startsWith('/admin'))
      .reduce((obj, key) => {
        obj[key] = swaggerDoc.paths[key];
        return obj;
      }, {})
  };
  
  return res.send(swaggerUi.generateHTML(adminSwagger));
});

// Mobile Swagger (separate documentation)
app.use('/mobile-docs', swaggerUi.serve, async (_req, res) => {
  const swaggerDoc = await import('../build/swagger.json');
  // Filter only mobile routes
  const mobileSwagger = {
    ...swaggerDoc,
    paths: Object.keys(swaggerDoc.paths)
      .filter(path => path.startsWith('/mobile'))
      .reduce((obj, key) => {
        obj[key] = swaggerDoc.paths[key];
        return obj;
      }, {})
  };
  
  return res.send(swaggerUi.generateHTML(mobileSwagger));
});

export { app };
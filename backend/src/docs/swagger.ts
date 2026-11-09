import path from 'node:path';
import type { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const openapiSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'HelpDesk Lite API',
      version: '0.1.0',
      description: 'API HelpDesk SaaS multi-tenant sederhana (Express 5 + MySQL).',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          required: ['statusCode', 'message'],
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validasi gagal' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'name' },
                  message: { type: 'string', example: 'Too small: expected string to have >=2 characters' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Baca anotasi @openapi dari semua file routes.
  // .ts dipakai saat development (tsx), .js saat produksi (hasil build di dist/).
  apis: [path.join(__dirname, '../modules/**/*.routes.{ts,js}').replace(/\\/g, '/')],
});

export function setupSwagger(app: Express): void {
  app.get('/api/docs.json', (_req, res) => {
    res.json(openapiSpec);
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'HelpDesk Lite API' }));
}

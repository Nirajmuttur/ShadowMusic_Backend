import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.ts'
import playListRoutes from './routes/playListRoutes.ts';
import trackRoutes from './routes/trackRoutes.ts';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(helmet())
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(cookieParser())
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API',
        },
        components: {
            securitySchemes:{
                bearerAuth:{           
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT' 
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
    },
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.ts'], // Assuming your route files are in a 'routes' directory
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', authRoutes)
app.use('/api/sync', playListRoutes)
app.use('/api', trackRoutes)

app.get('/', (req, res) => {
    res.send('Hello World')
})

export default app
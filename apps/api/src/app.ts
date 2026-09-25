import express from 'express';
import { apiRoutes } from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

// Use centralized routes
app.use('/api', apiRoutes);

// Use global error handler
app.use(errorHandler);

export default app;

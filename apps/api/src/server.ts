import app from './app';
import { initKafka } from './services/kafka.service';

const PORT = process.env.API_PORT || 4000;

async function start() {
  try {
    await initKafka();
    app.listen(PORT, () => {
      console.log(`API server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

const startServer = async () => {
  try {
    if (config.mongoUri) {
      await mongoose.connect(config.mongoUri);
      console.log('Mapped DB');
    }
    app.listen(config.port, () => {
      console.log(`Live:${config.port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import searchRoute from './routes/search';
import dismissRoute from './routes/dismiss';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRoute);
app.use('/api/dismiss', dismissRoute);

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: 'Internal Server Error' }); // Respond with a 500 status
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
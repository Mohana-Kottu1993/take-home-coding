import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import movieRouter from './routes/movies.route';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true }));

// API Endpoint to fetch movies by year
app.use("/movies", movieRouter);

app.get('/', (_: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
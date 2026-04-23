import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import 'dotenv/config';

const app = express();
app.use(cors({ 
  origin: 'https://school-timetable-maker.vercel.app', 
  methods: ['GET', 'POST'] }));
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

export default app;
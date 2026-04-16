import express from 'express';
import cors from 'cors';
import routes from './routes';
import 'dotenv/config';

const app = express();
app.use(cors({ origin: process.env.URL, methods: ['GET', 'POST'] }));
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

export default app;
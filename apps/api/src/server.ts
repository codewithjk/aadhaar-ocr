import express from 'express';
import cors from 'cors';
import visionRoutes from './routes/ocrRoute';
import config from './config/config';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/vision', visionRoutes);

const PORT = config.port|| 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${config.port}`);
});


// note: ts-node-dev (see dev script in package.json) automatically restart the server on changes, compaile + runs typescript in-memory.
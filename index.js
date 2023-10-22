import './connection.js'
import express from 'express';
import cors from 'cors';

import { post } from './controller.js';


const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/", post);

app.listen(8080, () => {
  console.log('Server is running on port http://localhost:8080');
})
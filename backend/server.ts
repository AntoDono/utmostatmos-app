import express from 'express';
import 'dotenv/config'
import { authRoutes } from './routes/auth.ts';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
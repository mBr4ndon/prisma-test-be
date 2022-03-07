import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// create app
const app = express();
// init prisma client
const prisma = new PrismaClient();
// middlewares
app.use(express.json());

app.post('/posts', async (request: Request, response: Response) => {
    const { title, description } = request.body;

    const result = await prisma.posts.create({
        data: {
            title,
            description
        }
    });

    return response.status(201).json(result);
});

app.get('/posts', async (request: Request, response: Response) => {
    const posts = await prisma.posts.findMany();

    return response.json(posts);
});

app.listen(3333, () => console.log('Server is running on port 3333...'));
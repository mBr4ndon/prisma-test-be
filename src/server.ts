import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// create app
const app = express();
// init prisma client
const prisma = new PrismaClient();
// middlewares
app.use(express.json());
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: '*'
    }
});

io.on("connection", socket => console.log(`User connected on socket ${socket.id}`));

app.post('/posts', async (request: Request, response: Response) => {
    const { title, description } = request.body;

    const result = await prisma.posts.create({
        data: {
            title,
            description
        }
    });

    io.emit("new_post", result);

    return response.status(201).json(result);
});

app.get('/posts', async (request: Request, response: Response) => {
    const posts = await prisma.posts.findMany();

    return response.json(posts);
});

serverHttp.listen(3333, () => console.log('Server is running on port 3333...'));
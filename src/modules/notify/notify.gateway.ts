import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

function generateRandomNumberEverySecond() {
  let randomNumber = 0;

  setInterval(() => {
    randomNumber = Math.floor(Math.random() * 100);
    console.log(`Số ngẫu nhiên: ${randomNumber}`);
  }, 1000);

  return () => randomNumber;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotifyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');

      socket.on('login', (userId: string) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined room ${userId}`);
      });
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.startRandomNumberGeneration();
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    this.server.emit('res', data);
    return data;
  }

  private startRandomNumberGeneration() {
    setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 1000000);
      this.server.to('room1').emit('randomNumber', randomNumber);
    }, 500);
  }
}

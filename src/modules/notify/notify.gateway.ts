import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
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

  @SubscribeMessage('join-room')
  joinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
    console.log(`client ${client.id} joined!`);
  }

  @SubscribeMessage('send-message')
  sendMessage(
    @MessageBody() payload: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(payload.roomId).emit('receive-message', {
      clientId: client.id,
      message: payload.message,
    });
  }
}

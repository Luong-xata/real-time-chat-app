import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  joinRoom(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.roomId);
    client.emit('message', `You joined room: ${payload.roomId}`);
  }

  @SubscribeMessage('send-message')
  sendMessage(
    @MessageBody()
    payload: { roomId: string; message: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(payload.roomId).emit('receive-message', {
      clientId: client.id,
      userName: payload.userName,
      message: payload.message,
    });
  }
}

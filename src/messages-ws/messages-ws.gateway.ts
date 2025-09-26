import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { MessageDto } from './dtos/message.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    console.log({ token });

    this.messagesWsService.registerConnected(client);
    // console.log(this.messagesWsService.getNumClientConnecteds());
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getIdsClientConnecteds(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.deleteClient(client.id);
    // console.log(this.messagesWsService.getNumClientConnecteds());
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getIdsClientConnecteds(),
    );
  }

  @SubscribeMessage('message-form-client')
  onMessageFromClient(client: Socket, payload: MessageDto) {
    // Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message',
    // });

    // Emitir a todos menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message,
    // });

    // Emitir a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message,
    });
  }
}

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
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization as string;
    let payload: JwtPayload;
    // console.log({ token });
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload });

    // this.messagesWsService.registerClient(client, payload.id);
    // console.log(this.messagesWsService.getNumClientConnecteds());
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getIdsClientConnecteds(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
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
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message,
    });
  }
}

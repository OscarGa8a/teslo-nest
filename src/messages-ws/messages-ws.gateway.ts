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

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
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
    console.log({ clientId: client.id, message: payload });
    client.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message',
    });
    // this.wss.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message,
    // });
  }
}

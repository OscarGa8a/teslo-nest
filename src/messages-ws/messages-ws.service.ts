import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: Socket;
}

@Injectable()
export class MessagesWsService {
  // @WebSocketServer() wss: Server;

  private connectedClients = {};

  registerConnected(client: Socket) {
    this.connectedClients[client.id] = client;
    // this.emitClientsUpdated();
  }

  deleteClient(clientId: string) {
    delete this.connectedClients[clientId];
    // this.emitClientsUpdated();
  }

  getNumClientConnecteds(): number {
    return Object.keys(this.connectedClients).length;
  }

  // private emitClientsUpdated() {
  //   this.wss.emit('clients-updated', this.getIdsClientConnecteds());
  // }

  getIdsClientConnecteds(): string[] {
    return Object.keys(this.connectedClients);
  }
}

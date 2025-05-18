import "@testing-library/jest-dom";

class BroadcastChannelMock {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  messages: any[] = [];

  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any) {
    this.messages.push(message);
    if (typeof this.onmessage === "function") {
      this.onmessage({ data: message } as MessageEvent);
    }
  }

  close() {}
}

(global as any).BroadcastChannel = BroadcastChannelMock;

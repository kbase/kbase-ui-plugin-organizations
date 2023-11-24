import { v4 as uuidv4 } from "uuid";

interface ListenerParams {
  name: string;
  onSuccess: (payload: Payload) => void;
  onError: (error: Error) => void;
}

class Listener {
  name: string;
  onSuccess: (payload: Payload) => void;
  onError: (error: Error) => void;

  constructor({ name, onSuccess, onError }: ListenerParams) {
    this.name = name;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }
}

type Payload = any;

interface WaitingListenerParams extends ListenerParams {
  timeout?: number;
}

class WaitingListener extends Listener {
  started: Date;
  timeout: number;

  constructor(params: WaitingListenerParams) {
    super(params);
    this.started = new Date();
    this.timeout = params.timeout || 5000;
  }
}

interface Envelope {
  channelId: string;
  id: string;
}

class Message {
  name: string;
  payload: any;
  id: string;
  created: Date;
  channelId: string;
  envelope: Envelope | null;

  constructor({
    name,
    payload,
    channelId,
  }: {
    name: string;
    payload: any;
    channelId: any;
  }) {
    this.name = name;
    this.payload = payload;
    this.id = uuidv4();
    this.created = new Date();
    this.channelId = channelId;
    this.envelope = null;
  }

  getMessage() {
    return {
      envelope: {
        id: this.id,
        created: this.created,
        channelId: this.channelId,
      },
      name: this.name,
      payload: this.payload,
    };
  }
}

interface Handler {
  started: Date;
  handler: (response: any) => any;
}

interface ChannelParams {
  window?: Window;
  host?: string;
  channelId?: string;
}

export class Channel {
  window: Window;
  host: string;
  id: string;
  awaitingResponse: Map<string, Handler>;
  waitingListeners: Map<string, Array<Listener>>;
  listeners: Map<string, Array<Listener>>;
  lastId: number;
  sentCount: number;
  receivedCount: number;
  unwelcomeReceivedCount: number;
  unwelcomeReceivedCountThreshhold: number;
  unwelcomeReceiptWarning: boolean;
  unwelcomeReceiptWarningCount: number;
  currentListener: ((message: MessageEvent) => void) | null;

  constructor(params: ChannelParams) {
    // The given window upon which we will listen for messages.
    this.window = params.window || window;

    // The host for the window; required for postmessage
    if (this.window.document === null) {
      throw new Error("No document");
    }
    if (this.window.document.location === null) {
      throw new Error("No location");
    }
    this.host = params.host || this.window.document.location.origin;

    // The channel id. Used to filter all messages received to
    // this channel.
    this.id = params.channelId || uuidv4();

    this.awaitingResponse = new Map<string, Handler>();
    this.waitingListeners = new Map<string, Array<Listener>>();
    this.listeners = new Map<string, Array<Listener>>();

    this.lastId = 0;
    this.sentCount = 0;
    this.receivedCount = 0;

    this.unwelcomeReceivedCount = 0;
    this.unwelcomeReceivedCountThreshhold = 100;
    this.unwelcomeReceiptWarning = true;
    this.unwelcomeReceiptWarningCount = 0;
    this.currentListener = null;
  }

  genId() {
    this.lastId += 1;
    return "msg_" + String(this.lastId);
  }

  receiveMessage(messageEvent: MessageEvent) {
    const message = messageEvent.data as Message;
    if (!message) {
      this.unwelcomeReceivedCount++;
      if (this.unwelcomeReceiptWarning) {
        console.warn("TS No message data; message ignored", messageEvent);
      }
      return;
    }
    if (!message.envelope) {
      this.unwelcomeReceivedCount++;
      if (this.unwelcomeReceiptWarning) {
        console.warn(
          "No message envelope, not from KBase; message ignored",
          messageEvent
        );
      }
      return;
    }
    if (!(message.envelope.channelId === this.id)) {
      this.unwelcomeReceivedCount++;
      if (this.unwelcomeReceiptWarning) {
        console.warn(
          "Message envelope does not match this channel's id",
          message.envelope,
          message.envelope.channelId,
          this.id
        );
      }
      return;
    }
    if (
      this.unwelcomeReceiptWarningCount > this.unwelcomeReceivedCountThreshhold
    ) {
      this.unwelcomeReceiptWarning = false;
      console.warn(
        "Unwelcome message warning disabled after " +
          this.unwelcomeReceiptWarningCount +
          " instances."
      );
    }

    // A message sent as a request will have registered a response handler
    // in the awaitingResponse hash, using a generated id as the key.
    // TODO: to to rethink using the message id here. Perhaps somehting like a
    // chain of ids, the root of which is the origination id, which is the one
    // known here when it it is sent; the message "id" should be assigned whenver
    // a message is sent, but a response  message would include the original
    // message in the "chain"...

    // We can also have awaiting responses without an originating request.
    // These are useful for, e.g., a promise which awaits a message to be sent
    // within some window...
    if (message.envelope.id && this.awaitingResponse.has(message.envelope.id)) {
      try {
        const response = this.awaitingResponse.get(message.envelope.id);
        this.awaitingResponse.delete(message.envelope.id);
        if (response) {
          response.handler(message.payload);
        }
      } catch (ex: any) {
        console.error("Error handling response for message ", message, ex);
      }
    }

    // and also awaiting by message name. Like a listener, but they are only used
    // once.

    if (this.waitingListeners.has(message.name)) {
      const awaiting = this.waitingListeners.get(message.name)!;
      this.waitingListeners.delete(message.name);
      awaiting.forEach((listener) => {
        try {
          listener.onSuccess(message.payload);
        } catch (ex: any) {
          console.error("Error handling listener for message", message, ex);
          if (listener.onError) {
            listener.onError(ex);
          }
        }
      });
    }
    // Otherwise, permanently registered handlers are found in the listeners for the
    // message name.
    if (this.listeners.has(message.name)) {
      this.listeners.get(message.name)!.forEach((listener) => {
        if (!listener.onSuccess) {
          console.warn("no handler for listener!", listener);
        }
        try {
          listener.onSuccess(message.payload);
        } catch (ex: any) {
          console.error("Error handling listener for message", message, ex);
          if (listener.onError) {
            listener.onError(ex);
          }
        }
      });
    }
  }

  listen(listener: Listener) {
    if (!this.listeners.has(listener.name)) {
      this.listeners.set(listener.name, []);
    }
    this.listeners.get(listener.name)!.push(listener);
  }

  on(
    messageId: string,
    success: (payload: any) => any,
    error: (error: Error) => void
  ) {
    this.listen(
      new Listener({
        name: messageId,
        onSuccess: success,
        onError: error,
      })
    );
  }

  sendMessage(message: Message) {
    this.window.postMessage(message.getMessage(), this.host);
  }

  send(name: string, payload: Payload) {
    const message = new Message({ name, payload, channelId: this.id });
    this.sendMessage(message);
  }

  sendRequest(message: Message, handler: (response: any) => any) {
    this.awaitingResponse.set("message.id", {
      started: new Date(),
      handler: handler,
    });

    this.sendMessage(message);
  }

  request(name: string, payload: Payload) {
    return new Promise((resolve, reject) => {
      try {
        this.sendRequest(
          new Message({ name, payload, channelId: this.id }),
          (response: any) => {
            resolve(response);
          }
        );
      } catch (ex: any) {
        reject(ex);
      }
    });
  }

  startMonitor() {
    window.setTimeout(() => {
      const now = new Date().getTime();

      // first take care of listeners awaiting a message.
      for (const [id, listeners] of this.waitingListeners.entries()) {
        const newListeners = listeners.filter((listener) => {
          if (listener instanceof WaitingListener) {
            const elapsed = now - listener.started.getTime();
            if (elapsed > listener.timeout) {
              try {
                if (listener.onError) {
                  listener.onError(new Error("timout after " + elapsed));
                }
              } catch (ex: any) {
                console.error("Error calling error handler", id, ex);
              }
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
        if (newListeners.length === 0) {
          this.waitingListeners.delete(id);
        }
      }

      if (this.waitingListeners.size > 0) {
        this.startMonitor();
      }
    }, 100);
  }

  listenOnce(listener: WaitingListener) {
    if (!this.waitingListeners.has(listener.name)) {
      this.waitingListeners.set(listener.name, []);
    }
    this.waitingListeners.get(listener.name)!.push(listener);
    if (listener.timeout) {
      this.startMonitor();
    }
  }

  once(
    name: string,
    success: (payload: Payload) => void,
    error: (error: Error) => void
  ) {
    this.listenOnce(
      new WaitingListener({
        name: name,
        onSuccess: success,
        onError: error,
      })
    );
  }

  when(name: string, timeout: number) {
    return new Promise((resolve, reject) => {
      return this.listenOnce(
        new WaitingListener({
          name: name,
          timeout: timeout,
          onSuccess: (payload) => {
            resolve(payload);
          },
          onError: (error) => {
            reject(error);
          },
        })
      );
    });
  }

  stats() {
    return {
      sent: this.sentCount,
      received: this.receivedCount,
    };
  }

  attach(window: Window) {
    this.window = window;
  }

  start() {
    this.currentListener = (message: MessageEvent) => {
      this.receiveMessage(message);
    };
    this.window.addEventListener("message", this.currentListener, false);
  }

  stop() {
    if (this.currentListener) {
      this.window.removeEventListener("message", this.currentListener, false);
    }
  }
}

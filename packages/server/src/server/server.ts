class BunServer implements RequestMethod {
    // Singleton Bun server
    private static _instance: BunServer;

    constructor() {
        if (BunServer._instance) {
            return BunServer._instance;
        }

        BunServer._instance = this;
    }

    static get instance() {
        return this._instance ?? (BunServer._instance = new BunServer());
    }

    private readonly requestMap: Map<string, Handler> = new Map<string, Handler>();
}
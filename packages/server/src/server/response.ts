export class AcpResponse {
    private response: Response = new Response;
    private options: ResponseInit = {};

    constructor() {
        this.options.headers = new Headers();
    }

    /**
     * Sets the status code for the response.
     * @param code The status code to set.
     * @returns The AcpResponse object.
     */
    status(code: number): AcpResponse {
        this.options.status = code;
        return this;
    }

    /**
     * Sets the status code for the response.
     * @param code The status code to set.
     * @returns The AcpResponse object.
     */
    option(option: ResponseInit): AcpResponse {
        this.options = { ...this.options, ...option };
        return this;
    }

    /**
     * Sets the status text of the AcpResponse.
     * @param text - The status text to set.
     * @returns The modified AcpResponse object.
     */
    statusText(text: string): AcpResponse {
        this.options.statusText = text;
        return this;
    }

    /**
     * Sets the response body as JSON.
     * @param body - The JSON data to be sent in the response.
     * @returns void
     */
    json(body: any): void {
        this.response = Response.json(body, this.options);
    }


    /**
     * Sends the specified body as the response.
     * 
     * @param body - The body of the response.
     */
    send(body?: BodyInit): void {
        this.response = new Response(body, this.options);
    }

    /**
     * Sets a header key-value pair in the response.
     * @param key - The header key.
     * @param value - The header value.
     * @returns The AcpResponse object.
     * @throws Error if the key or value is not defined.
     */
    setHeader(key: string, value: string): AcpResponse {
        if (!key || !value) {
            throw new Error("Header key or value is not defined");
        }

        (this.options.headers as Headers).set(key, value);
        return this;
    }

    /**
     * Returns the headers of the server response.
     * 
     * @returns {Headers} The headers of the server response.
     */
    getHeaders(): Headers {
        return this.options.headers as Headers;
    }

    /**
     * Sets the headers for the response.
     * 
     * @param headers - The headers to be set for the response.
     * @returns The AcpResponse instance.
     */
    headers(headers: HeadersInit): AcpResponse {
        this.options.headers = new Headers(headers);
        return this;
    }

    /**
     * Retrieves the response object.
     * 
     * @returns The response object.
     */
    getResponse(): Response {
        return this.response;
    }

    /**
     * Checks if the response is ready.
     * @returns {boolean} True if the response is ready, false otherwise.
     */
    isReady(): boolean {
        return !!this.response;
    }
}

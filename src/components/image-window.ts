import { ImageMagick, MagickFormat } from "@imagemagick/magick-wasm";
import { html, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Window } from "./base/window";

@customElement("image-window")
class ImageWindow extends Window {
    @property({ type: Object }) file: File = null as unknown as File;
    @state() objectUrl: string | null = null;
    @state() width = 0;
    @state() height = 0;
    @state() context: MouseEvent | null = null;

    connectedCallback() {
        super.connectedCallback();

        if (this.file) {
            this.loadImage(this.file);
            this.title = this.file.name;
        }
    }

    disconnectedCallback(): void {
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    }

    updated(changedProperties: PropertyValues) {
        if (changedProperties.has("file") && this.file) {
            if (this.objectUrl) {
                URL.revokeObjectURL(this.objectUrl);
            }

            this.objectUrl = URL.createObjectURL(this.file);
            this.title = this.file.name;
        }
    }

    private async loadImage(file: File) {
        const url = URL.createObjectURL(file);
        try {
            const { width, height } = await this.getScaledImageSize(file);
            this.objectUrl = url;
            this.width = width;
            this.height = height;
        } catch (err) {
            console.error("Failed to load image:", err);
            URL.revokeObjectURL(url);
        }
    }

    private getScaledImageSize(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const screenArea = window.innerWidth * window.innerHeight * 0.25;
                const targetHeight = Math.sqrt(screenArea / aspectRatio);
                const targetWidth = targetHeight * aspectRatio;

                URL.revokeObjectURL(url);
                resolve({
                    width: Math.round(targetWidth),
                    height: Math.round(targetHeight),
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Could not load image"));
            };

            img.src = url;
        });
    }

    async convert(format: MagickFormat, type: string) {
        ImageMagick.read(new Uint8Array(await this.file.arrayBuffer()), (image) => {
            image.write(format, (outputBytes) => {
                this.file = new File(
                    [new Uint8Array(outputBytes)],
                    this.file.name.replace(/\.\w+$/, `.${type.split("/")[1]}`),
                    {
                        type,
                    }
                );
            });
        });
    }

    download() {
        const anchor = document.createElement("a");
        anchor.href = this.objectUrl ?? "";
        anchor.download = this.file.name;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    innerRender() {
        this.sizeX = this.width;
        this.sizeY = this.height;

        return html`
            <img
                src="${this.objectUrl ?? ""}"
                style="max-width: 100%; height: auto;"
                @contextmenu=${(e: MouseEvent) => {
                    e.preventDefault();
                    this.context = e;
                }}
            />

            ${this.context
                ? html`<context-menu
                      .event=${this.context}
                      @destroy=${() => {
                          this.context = null;
                      }}
                      .body=${html`
                          <button
                              >Do something</button
                          >
                      `}
                  ></context-menu>`
                : null}

            ${this.context
                ? html`<context-menu
                      .event=${this.context}
                      @destroy=${() => {
                          this.context = null;
                      }}
                      .body=${html`
                          <button
                              @click=${() => {
                                  this.convert(MagickFormat.Png, "image/png");
                              }}
                              >Convert to PNG</button
                          >
                          <button
                              @click=${() => {
                                  this.convert(MagickFormat.WebP, "image/webp");
                              }}
                              >Convert to WEBP</button
                          >
                          <button
                              @click=${() => {
                                  this.convert(MagickFormat.Jpeg, "image/jpeg");
                              }}
                              >Convert to JPEG</button
                          >

                          <button
                              style="margin-top: 16px;"
                              @click=${() => {
                                  this.download();
                              }}
                              >Download</button
                          >
                      `}
                  ></context-menu>`
                : null}
        `;
    }
}

import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class Window extends LitElement {
    static styles = css`
        div.window {
            color: #fff;
            background-color: #2b2b2b;
            display: flex;
            flex-direction: column;
            position: absolute;
            border-radius: 4px;
            overflow: hidden;
            z-index: 2;

            div.head {
                padding: 4px;
                cursor: move;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                button {
                    cursor: pointer;
                    width: 12px;
                    height: 12px;
                    margin: 0 3px 0 0;
                    padding: 0;
                    background-color: #f00;
                    border: none;
                    border-radius: 99999px;
                }
            }
        }

        * {
            user-select: none;
        }
    `;

    @property({ type: Number }) sizeX = 0;
    @property({ type: Number }) sizeY = 0;

    @property({ type: Number }) posX = 0;
    @property({ type: Number }) posY = 0;

    @property({ type: String }) title = "";

    dragOffsetX = 0;
    dragOffsetY = 0;
    @property({ type: Boolean }) isDragging = false;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("mousemove", this.onDrag.bind(this));
        window.addEventListener("mouseup", this.endDrag.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("mousemove", this.onDrag.bind(this));
        window.removeEventListener("mouseup", this.endDrag.bind(this));
    }

    startDrag(e: MouseEvent) {
        this.isDragging = true;
        this.dragOffsetX = e.clientX - this.posX;
        this.dragOffsetY = e.clientY - this.posY;
    }

    onDrag(e: MouseEvent) {
        if (!this.isDragging) return;
        this.posX = e.clientX - this.dragOffsetX;
        this.posY = e.clientY - this.dragOffsetY;
    }

    endDrag() {
        this.isDragging = false;
    }

    innerRender() {}

    destroy() {
        const event = new Event("destroy");
        this.dispatchEvent(event);
    }

    render() {
        const inner = this.innerRender();

        return html`
            <div
                class="window"
                style="height: ${this.sizeY}px; width: ${this.sizeX}px; left: ${this.posX}px; top: ${this.posY}px"
            >
                <div class="head" @mousedown=${this.startDrag}>
                    ${this.title}
                    <button @click="${this.destroy}"></button>
                </div>
                <div class="body">${inner}</div>
            </div>
        `;
    }
}

import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("drag-controller")
class DragController extends LitElement {
    @property({ type: Boolean }) isDragging = false;

    static styles = css`
        div {
            width: 100vw;
            height: 100vh;
            background-color: #e629ff;
            transition: opacity 0.3s;
            z-index: -1;
        }
    `;

    @state() context: MouseEvent | null = null;

    @property({ attribute: false })
    getWindowId = () => {
        return 0;
    };

    dragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragging = true;
    }

    drop(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;

        const file = event.dataTransfer?.files?.[0];

        if (!file) {
            return;
        }

        if (file.type.startsWith("image/")) {
            const e = new CustomEvent("createWindow", {
                detail: {
                    type: "image",
                    file: file,
                    posY: event.clientY,
                    posX: event.clientX,
                },
            });
            this.dispatchEvent(e);
        }
    }

    render() {
        const stopDrag = (event: DragEvent) => {
            event.preventDefault();
            this.isDragging = false;
        };

        return html`
            <div
                style="opacity: ${this.isDragging ? 0.05 : 0}"
                @dragover="${this.dragOver}"
                @dragleave="${stopDrag}"
                @dragend="${stopDrag}"
                @drop="${this.drop}"
                @contextmenu="${(e: MouseEvent) => {
                    e.preventDefault();
                    this.context = e;
                }}"
            ></div>
        `;
    }
}

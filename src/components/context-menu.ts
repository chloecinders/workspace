import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("context-menu")
class ContextMenu extends LitElement {
    @property({ type: Object })
    event: MouseEvent | null = null;
    @property({ type: Object })
    body = html``;

    connectedCallback(): void {
        super.connectedCallback();

        window.addEventListener("click", (e) => {
            const el = document.querySelector("#context-menu");
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const clickX = e.clientX;
            const clickY = e.clientY;

            const inBounds = clickX >= rect.left && clickX <= rect.right && clickY >= rect.top && clickY <= rect.bottom;

            if (!inBounds) {
                const e = new Event("destroy");
                this.dispatchEvent(e);
            }
        });
    }

    render() {
        return html`<lit-portal
            containerClass="contextmenu-container"
            to="body"
            .body=${html`
                <div
                    id="context-menu"
                    class="context-menu"
                    style="top: ${this.event?.clientY}px; left: ${this.event?.clientX}px"
                >
                    ${this.body}
                </div>
            `}
        ></lit-portal>`;
    }
}

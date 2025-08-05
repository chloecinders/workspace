import defaultBackground from "@assets/defaultBackground.png";
import { StateController } from "@lit-app/state";
import settingsStore from "@stores/SettingsStore";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

let currentWindowId = 0;

@customElement("app-root")
class AppRoot extends LitElement {
    static styles = css`
        div {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }
    `;

    state = new StateController(this, settingsStore);

    @property({ type: Object }) windows: Record<number, TemplateResult> = {};

    windowCreate(event: CustomEvent) {
        currentWindowId += 1;
        const thisWindowsId = currentWindowId;

        const element: TemplateResult =
            {
                image: html`<image-window
                    .file="${event.detail.file}"
                    posX="${event.detail.posX}"
                    posY="${event.detail.posY}"
                    @destroy=${() => {
                        delete this.windows[thisWindowsId];
                        this.requestUpdate();
                    }}
                ></image-window>`,
            }[event.detail.type as string] ?? html`<div>unknown</div>`;
        this.windows[thisWindowsId] = element;
        this.requestUpdate();
    }

    render() {
        let background = settingsStore.background;

        if (background === "default") {
            background = defaultBackground;
        }

        return html`<div style="background: url(${background})">
            ${Object.values(this.windows)}
            <drag-controller @createWindow="${this.windowCreate}"></drag-controller>
        </div>`;
    }
}

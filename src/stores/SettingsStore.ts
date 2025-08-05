import { property, State } from "@lit-app/state";

class SettingsStore extends State {
    @property({ value: "default" }) background: string;

    constructor() {
        super();

        this.background = "default";
    }
}

const settingsStore = new SettingsStore();
export default settingsStore;

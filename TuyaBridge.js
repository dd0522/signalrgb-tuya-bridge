export function Name() { return "Tuya Bridge"; }
export function Version() { return "1.0.0"; }
export function Type() { return "network"; }
export function Publisher() { return "custom"; }
export function Size() { return [1, 1]; }
export function DefaultPosition() { return [0, 70]; }
export function DefaultScale() { return 1.0; }
export function ControllableParameters() {
    return [
        {"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
        {"property":"forcedColor", "group":"lighting", "label":"Forced Color", "type":"color", "default":"#FF0000"}
    ];
}

let lastR = -1, lastG = -1, lastB = -1;
let requestInFlight = false;
let lastSendTime = 0;
const SEND_INTERVAL = 50;

export function Initialize() {
    device.setName("Tuya RGB Strip");
    device.setSize([1, 1]);
    device.setControllableLeds(["LED 1"], [[0, 0]]);
}

export function Render() {
    let r, g, b;

    if (LightingMode === "Forced") {
        const col = hexToRgb(forcedColor);
        r = col.r; g = col.g; b = col.b;
    } else {
        const col = device.color(0, 0);
        if (!col) return;
        r = Math.round(col[0]); g = Math.round(col[1]); b = Math.round(col[2]);
    }

    if (r === lastR && g === lastG && b === lastB) return;
    if (requestInFlight) return;

    const now = Date.now();
    if (now - lastSendTime < SEND_INTERVAL) return;

    lastR = r; lastG = g; lastB = b;
    lastSendTime = now;
    requestInFlight = true;

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `http://localhost:5000/color?r=${r}&g=${g}&b=${b}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) requestInFlight = false;
        };
        xhr.send();
    } catch(e) {
        requestInFlight = false;
        device.log("Request error: " + e.message);
    }
}

export function Shutdown() {}
export function Validate() { return true; }

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}

class TuyaBridgeController {
    constructor() {
        this.id = "tuya-bridge-001";
        this.name = "Tuya RGB Strip";
        this.ip = "127.0.0.1";
        this.model = "TuyaBridge";
        this.initialized = false;
    }

    update() {
        if (!this.initialized) {
            this.initialized = true;
            service.updateController(this);
            service.announceController(this);
            service.log("Tuya Bridge: controller announced!");
        }
    }
}

export function DiscoveryService() {
    this.controller = null;

    this.Initialize = function() {
        service.log("Tuya Bridge: DiscoveryService init");
        this.controller = new TuyaBridgeController();
        service.addController(this.controller);
    }

    this.Update = function() {
        if (this.controller && !this.controller.initialized) {
            this.controller.update();
        }
    }

    this.Discovered = function() {}
}

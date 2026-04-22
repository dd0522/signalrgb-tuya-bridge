export function Name() { return "Tuya Bridge"; }
export function Version() { return "1.0.0"; }
export function Type() { return "network"; }
export function Publisher() { return "custom"; }
export function Size() { return [1, 1]; }
export function DefaultPosition() { return [0, 70]; }
export function DefaultScale() { return 1.0; }
export function ControllableParameters() {
    return [
        {"property":"lightingMode", "group":"settings", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
        {"property":"forcedColor", "group":"settings", "label":"Forced Color", "type":"color", "default":"#FF0000"}
    ];
}

const LED_COUNT = 1;
let lastR = -1, lastG = -1, lastB = -1;

export function Initialize() {
    service.log("Tuya Bridge: Initialize called");
    device.setName("Tuya RGB Strip");
    device.setSize([LED_COUNT, 1]);

    let ledNames = [];
    let ledPositions = [];
    for (let i = 0; i < LED_COUNT; i++) {
        ledNames.push(`Led ${i + 1}`);
        ledPositions.push([i, 0]);
    }
    device.setControllableLeds(ledNames, ledPositions);
    service.log("Tuya Bridge: device setup complete");
}

export function Render() {
    let r, g, b;

    if (lightingMode === "Forced") {
        const color = hexToRgb(forcedColor);
        r = color.r; g = color.g; b = color.b;
    } else {
        const color = device.color(0, 0);
        if (!color) return;
        r = Math.round(color.r);
        g = Math.round(color.g);
        b = Math.round(color.b);
    }

    if (r === lastR && g === lastG && b === lastB) return;
    lastR = r; lastG = g; lastB = b;

    fetch(`http://localhost:5000/color?r=${r}&g=${g}&b=${b}`).catch(() => {});
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

export function DiscoveryService() {
    this.Initialize = function() {
        service.log("Tuya Bridge: DiscoveryService Initialize");
        try {
            const controller = {
                id: "tuya-bridge-001",
                name: "Tuya RGB Strip",
                enabled: true
            };
            service.addController(controller);
            service.announceController(controller);
            service.log("Tuya Bridge: controller announced");
        } catch(ex) {
            service.log("Tuya Bridge error: " + ex.message);
        }
    }

    this.Update = function() {}
    this.Discovered = function() {}
}

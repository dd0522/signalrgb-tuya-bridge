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

let lastR = -1, lastG = -1, lastB = -1;

export function Initialize() {}

export function Render() {
    let color;
    if (lightingMode === "Forced") {
        color = hexToRgb(forcedColor);
    } else {
        color = service.getLedColor(0, 0);
    }

    if (!color) return;

    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);

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
        try {
            service.log("Tuya Bridge: Announcing device...");
            service.announceController({
                id: "tuya-bridge-001",
                name: "Tuya RGB Strip"
            });
        } catch(ex) {
            service.log("Tuya Bridge error: " + ex.message);
        }
    }

    this.Update = function() {}
    this.Discovered = function() {}
}

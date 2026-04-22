export function Publisher() {
    return {
        Name: "Tuya RGB Bridge",
        Description: "Controls Tuya WiFi LED strip via local Python bridge",
        Author: "custom",
        Version: "1.0",
        Date: "2025",
        Type: "external",
        subdeviceType: "ledstrip"
    };
}

let lastR = -1, lastG = -1, lastB = -1;

export function Initialize() {
    service.setProperty("bridgeStatus", "Running");
    service.addDevice("TuyaStrip", "Tuya RGB Strip", "ledstrip", 1);
}

export function Render() {
    const color = service.lighting.getDeviceLed("TuyaStrip", 0);
    if (!color) return;

    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);

    if (r === lastR && g === lastG && b === lastB) return;
    lastR = r; lastG = g; lastB = b;

    fetch(`http://localhost:5000/color?r=${r}&g=${g}&b=${b}`)
        .catch(() => service.setProperty("bridgeStatus", "Bridge not reachable"));
}

export function Shutdown() {}
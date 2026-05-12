// 1. THE SENSOR MASTER LIST
const sensorLibrary = [
    // --- ENVIRONMENTAL SENSORS ---
    { name: "DHT11", cat: "Env", pins: "VCC: 3.3V | GND: GND | DATA: D4", img: "https://placehold.co/600x400?text=DHT11+Pinout+VCC+GND+DATA" },
    { name: "DHT22", cat: "Env", pins: "VCC: 3.3V | GND: GND | DATA: D2", img: "https://placehold.co/600x400?text=DHT22+High+Precision+Pinout" },
    { name: "BMP180", cat: "Env", pins: "VCC: 3.3V | GND: GND | SCL: SCL | SDA: SDA", img: "https://placehold.co/600x400?text=BMP180+I2C+Wiring" },
    { name: "MQ-135", cat: "Gas", pins: "VCC: 5V | GND: GND | AO: A0", img: "https://placehold.co/600x400?text=MQ135+Air+Quality+Wiring" },
    { name: "Rain Sensor", cat: "Env", pins: "VCC: 5V | GND: GND | DO: D5", img: "https://placehold.co/600x400?text=Rain+Sensor+Wiring" },

    // --- MOTION & DISTANCE ---
    { name: "HC-SR04", cat: "Dist", pins: "VCC: 5V | Trig: D5 | Echo: D18 | GND: GND", img: "https://placehold.co/600x400?text=Ultrasonic+HC-SR04+Diagram" },
    { name: "PIR Sensor", cat: "Motion", pins: "VCC: 5V | OUT: D12 | GND: GND", img: "https://placehold.co/600x400?text=PIR+Motion+Sensor+Pins" },
    { name: "MPU6050", cat: "Gyro", pins: "VCC: 3.3V | GND: GND | SCL: SCL | SDA: SDA", img: "https://placehold.co/600x400?text=MPU6050+6-Axis+Wiring" },
    { name: "RCWL-0516", cat: "Radar", pins: "VIN: 5V | OUT: D14 | GND: GND", img: "https://placehold.co/600x400?text=Radar+Sensor+Pinout" },

    // --- BIOMETRIC & INPUT ---
    { name: "Pulse Sensor", cat: "Bio", pins: "VCC: 3.3V | GND: GND | Signal: A0", img: "https://placehold.co/600x400?text=Heart+Rate+Sensor+Wiring" },
    { name: "Keypad 4x4", cat: "Input", pins: "8 Pins: Connect to D2-D9", img: "https://placehold.co/600x400?text=4x4+Matrix+Keypad+Pins" },
    { name: "Joystick", cat: "Input", pins: "VCC: 5V | GND: GND | VRx: A0 | VRy: A1 | SW: D7", img: "https://placehold.co/600x400?text=Joystick+Module+Wiring" },

    // --- SMART HOME & IR ---
    { name: "Relay Module", cat: "Power", pins: "VCC: 5V | GND: GND | IN: D13", img: "https://placehold.co/600x400?text=Relay+Module+AC+Control" },
    { name: "IR Receiver", cat: "Remote", pins: "VCC: 3.3V | GND: GND | OUT: D15", img: "https://placehold.co/600x400?text=IR+Receiver+TSOP+Pins" },
    { name: "LDR Light", cat: "Light", pins: "VCC: 5V | GND: Resistor | AO: A0", img: "https://placehold.co/600x400?text=LDR+Photoresistor+Circuit" }
];

// 2. CORE LOGIC
let port;
let reader;

document.addEventListener('DOMContentLoaded', () => {
    renderSensors();
});

function renderSensors() {
    const grid = document.getElementById('sensorGrid');
    grid.innerHTML = sensorLibrary.map((s, i) => `
        <div class="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
            <span class="text-[10px] bg-cyan-900 text-cyan-300 px-2 py-1 rounded-full font-bold uppercase">${s.cat}</span>
            <h3 class="text-xl font-bold mt-2">${s.name}</h3>
            <p class="text-gray-400 text-xs mt-1 font-mono">${s.pins}</p>
            <div class="flex gap-2 mt-4">
                <button onclick="viewWiring(${i})" class="flex-1 bg-slate-700 text-xs py-2 rounded-lg hover:bg-slate-600">Wiring</button>
                <button class="flex-1 bg-cyan-600 text-xs py-2 rounded-lg hover:bg-cyan-500 font-bold">Monitor</button>
            </div>
        </div>
    `).join('');
}

// 3. WIRING MODAL LOGIC
function viewWiring(index) {
    const s = sensorLibrary[index];
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/90 flex items-center justify-center p-5 z-50";
    modal.id = "modal";
    modal.innerHTML = `
        <div class="bg-slate-900 border border-cyan-500 p-8 rounded-3xl max-w-2xl w-full">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-cyan-400">${s.name} Wiring Guide</h2>
                <button onclick="document.getElementById('modal').remove()" class="text-3xl">&times;</button>
            </div>
            <img src="${s.img}" class="w-full rounded-xl border border-slate-700 mb-6">
            <div class="bg-slate-800 p-4 rounded-xl">
                <p class="text-cyan-300 font-bold">Standard Connection:</p>
                <p class="text-white font-mono text-sm mt-2">${s.pins}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 4. CONNECTION LOGIC (Web Serial)
async function connect() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        document.getElementById('status').innerText = "ONLINE";
        readData();
    } catch (e) { console.log("Connection Canceled"); }
}

async function readData() {
    while (port.readable) {
        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            console.log("Raw Data:", value);
        }
    }
}

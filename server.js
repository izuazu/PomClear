const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const { Server } = require("socket.io");
const admin = require("firebase-admin");

// Konfigurasi Express dan Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware untuk akses folder public
app.use(express.static("public"));

// Middleware untuk mengurai body permintaan JSON
app.use(express.json());

// Konfigurasi MQTT
const mqttBroker = "wss://b79aaca9c1654817a1685510da7a83e8.s1.eu.hivemq.cloud:8884/mqtt";
const mqttClient = mqtt.connect(mqttBroker, {
    username: "Fauzi",
    password: "Azz.,123",
    protocol: "wss",
    rejectUnauthorized: false,
});

// MQTT: Berlangganan ke topik sensor dan kontrol
const topics = [
    "iot/ph",
    "iot/turbidity",
    "iot/tds",
    "iot/light1",
    "iot/light2",
    "iot/light3",
    "iot/light4",
    "iot/control",
    "iot/reset",
];

mqttClient.on("connect", () => {
    console.log("Connected to MQTT Broker");
    mqttClient.subscribe(topics, (err) => {
        if (!err) {
            console.log(`Subscribed to topics: ${topics.join(", ")}`);
        } else {
            console.error(`Subscription error: ${err.message}`);
        }
    });
});

// MQTT: Proses pesan dari broker
mqttClient.on("message", (topic, message) => {
    console.log(`Message received from ${topic}: ${message.toString()}`);
    io.emit("mqttMessage", { topic, message: message.toString() });

    // Logika tambahan untuk topik kontrol (Start/Stop)
    if (topic === "iot/control") {
        if (message.toString() === "1") {
            console.log("System started");
        } else if (message.toString() === "0") {
            console.log("System stopped");
        }
    }
});

// Socket.IO: Proses komunikasi dengan frontend
io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("publish", (data) => {
        const { topic, message } = data;
        mqttClient.publish(topic, message);
        console.log(`Published to ${topic}: ${message}`);
    });
});

// Firebase Admin SDK initialization
try {
    const serviceAccount = require("./serviceAccountKey.json"); // Pastikan path ini benar!
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://pomclear-default-rtdb.asia-southeast1.firebasedatabase.app" // Ganti dengan URL database kamu
    });

    const db = admin.database(); // Get a reference to the database
    console.log("Firebase Admin SDK initialized successfully.");

    // Endpoint untuk menyimpan data ke Firebase Realtime Database
    app.post('/save-data', (req, res) => {
        const data = req.body;  // Data dari client
        console.log('Data received from client:', data);

        // Validasi data (contoh sederhana)
        if (!data || typeof data !== 'object' || !data.time || !data.turbidity || !data.ph || !data.tds || !data.degradation) {
            console.error("Invalid data format received from client.");
            return res.status(400).send("Invalid data format. Please check your request.");
        }

        // Referensi ke lokasi di database tempat kamu ingin menyimpan data
        const ref = db.ref("sensorData"); // Kamu bisa mengganti "sensorData" dengan path lain

        // Generate a unique key untuk setiap data entry
        const newDataRef = ref.push();

        // Simpan data ke Firebase
        newDataRef.set(data, (error) => {
            if (error) {
                console.error('Error saving data to Firebase:', error);
                return res.status(500).send('Error saving data');
            } else {
                console.log('Data saved to Firebase');
                return res.status(200).send('Data saved successfully');
            }
        });
    });
} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    // Penting: Jangan teruskan server jika Firebase tidak dapat diinisialisasi
    process.exit(1); // Keluar dari proses dengan kode kesalahan
}

// Jalankan server
const PORT = 8884;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
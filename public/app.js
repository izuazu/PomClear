const socket = io();

// Menangani pengiriman pesan dari form
document.getElementById('publish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const topic = document.getElementById('topic').value;
    const message = document.getElementById('message').value;
    
    // Mengirim data ke server untuk dipublikasikan ke broker MQTT
    socket.emit('publish', { topic, message });

    // Reset form
    document.getElementById('publish-form').reset();
});

// Menangani pesan yang diterima dari server melalui Socket.IO
socket.on('mqttMessage', (data) => {
    const { topic, message } = data;
    const messageElement = document.createElement('li');
    messageElement.textContent = `Topik: ${topic} | Pesan: ${message}`;
    document.getElementById('messages').appendChild(messageElement);
});

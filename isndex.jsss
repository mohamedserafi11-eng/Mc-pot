const http = require('http');
const https = require('https');

// --- إعدادات الروابط ---
const REPLIT_URL = 'https://92bcca91-f646-4c5a-bda4-697efec0528f-00-37sx7lj7q2b5l.kirk.replit.dev/__mockup'; // استبدل هذا برابط بوت ريبلت الخاص بك
const PORT = process.env.PORT || 3000;

// 1. خادم HTTP لاستقبال طلبات UptimeRobot
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Monitor is Active and Running!');
}).listen(PORT, () => {
    console.log(`✅ Monitor server is live on port ${PORT}`);
});

// 2. دالة إرسال الطلبات لـ Replit (كل دقيقتين)
setInterval(() => {
    https.get(REPLIT_URL, (res) => {
        console.log(`📡 [${new Date().toLocaleTimeString()}] Ping sent to Replit - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`❌ [${new Date().toLocaleTimeString()}] Replit is down: ${err.message}`);
    });
}, 30000); // 120000 مللي ثانية = دقيقتان

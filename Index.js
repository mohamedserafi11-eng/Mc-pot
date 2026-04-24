const mineflayer = require('mineflayer');
const http = require('http');
const PORT = process.env.PORT || 3000;

// إنشاء خادم HTTP خاص بـ Render لمنع الدخول في وضع السكون
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});

server.listen(PORT, () => {
    console.log(`✅ خادم الإبقاء على الحياة يعمل على المنفذ ${PORT}`);
});

const botOptions = {
    host: 'MMCPvp07.aternos.me',
    port: 25565,
    username: 'StayAlive' + Math.floor(Math.random() * 1000),
    version: '1.21.9'
};

function createBot() {
    console.log('🔄 جاري محاولة الاتصال بالسيرفر...');
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('✅ تم دخول البوت بنجاح!');
        const interval = setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 20000);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ انفصل البوت. السبب: ${reason}. جاري إعادة الاتصال بعد 15 ثانية...`);
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => {
        console.log(`❌ خطأ في الاتصال: ${err.message}`);
        if (err.code === 'ECONNUSED') {
            console.log('⚠️ السيرفر لا يستجيب. سيتم إعادة المحاولة خلال 30 ثانية...');
            setTimeout(createBot, 30000);
        }
    });
}

// بدء البوت
createBot();

const mineflayer = require('mineflayer');
const http = require('http');
const { HttpProxyAgent } = require('http-proxy-agent');

// --- بيانات ويبشار (تأكد منها 100%) ---
const proxyConfig = {
    ip: '31.59.20.176', 
    port: '80', 
    user: 'sthyyrsa', 
    pass: 'tlant3mv3gpb'
};

const proxyUrl = `http://${proxyConfig.user}:${proxyConfig.pass}@${proxyConfig.ip}:${proxyConfig.port}`;
const agent = new HttpProxyAgent(proxyUrl);

// خادم الريندر
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => res.end('Bot Status: Online')).listen(PORT);

function createBot() {
    console.log(`🚀 محاولة دخول نهائية عبر: ${proxyConfig.ip}`);
    
    const bot = mineflayer.createBot({
        host: 'MMCPvp07.aternos.me',
        port: 25565,
        username: 'User' + Math.floor(Math.random() * 5000),
        version: "1.20.1",
        auth: 'offline',
        agent: agent,
        // --- إعدادات إضافية لتجاوز الحماية ---
        fakeHost: 'MMCPvp07.aternos.me', // إجبار الهوست الوهمي
        hideErrors: false,
        connectTimeout: 90000, // زيادة وقت الانتظار لـ 90 ثانية
        checkTimeoutInterval: 90000
    });

    bot.on('spawn', () => {
        console.log('✅✅✅ مبروك! البوت دخل السيرفر الآن');
    });

    bot.on('error', (err) => {
        console.log(`❌ خطأ: ${err.message}`);
    });

    bot.on('kicked', (reason) => {
        console.log(`🚫 تم طرد البوت: ${reason}`);
    });

    bot.on('end', () => {
        console.log('⚠️ فصل الاتصال.. سأحاول مرة أخرى بعد 20 ثانية');
        setTimeout(createBot, 20000);
    });
}

createBot();

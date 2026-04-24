const mineflayer = require('mineflayer');
const http = require('http');
const { HttpProxyAgent } = require('http-proxy-agent'); // تغيير المكتبة هنا

// --- بيانات ويبشار الخاصة بك ---
const proxyConfig = {
    ip: '31.59.20.176', 
    port: '80', // بورت HTTP المعتاد في ويبشار هو 80 أو 3128
    user: 'sthyyrsa', 
    pass: 'tlant3mv3gpb'
};

// إنشاء الوكيل بنوع HTTP
const proxyUrl = `http://${proxyConfig.user}:${proxyConfig.pass}@${proxyConfig.ip}:${proxyConfig.port}`;
const agent = new HttpProxyAgent(proxyUrl);

// خادم الريندر
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => res.end('OK')).listen(PORT);

function createBot() {
    console.log(`🌐 محاولة الاتصال عبر HTTP Proxy: ${proxyConfig.ip}`);
    
    const bot = mineflayer.createBot({
        host: 'MMCPvp07.aternos.me',
        port: 25565,
        username: 'FixBot_' + Math.floor(Math.random() * 100),
        version: "1.20.1",
        auth: 'offline',
        agent: agent, // الوكيل الجديد
        connectTimeout: 60000
    });

    bot.on('spawn', () => {
        console.log('✅ أخيرًا! تم دخول البوت بنجاح');
    });

    bot.on('error', (err) => {
        console.log(`❌ تفاصيل الخطأ: ${err.message}`);
    });

    bot.on('end', () => {
        setTimeout(createBot, 15000);
    });
}

createBot();

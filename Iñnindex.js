const mineflayer = require('mineflayer');
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');

// ==========================================
// 1. إعدادات البروكسي (تأكد من صحتها)
// ==========================================
const PROXY_HOST = '186.215.87.194'; // الأي بي الخاص بك
const PROXY_PORT = '5507';           // البورت الخاص بك

const proxyUrl = `socks5://${PROXY_HOST}:${PROXY_PORT}`;
const agent = new SocksProxyAgent(proxyUrl);

// ==========================================
// 2. خادم الويب لإبقاء Render مستيقظاً
// ==========================================
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Status: Online and Active');
}).listen(PORT, () => {
    console.log(`✅ خادم المنبه يعمل على منفذ: ${PORT}`);
});

// ==========================================
// 3. إعدادات البوت والدخول
// ==========================================
function createBot() {
    const randomName = 'ProBot_' + Math.floor(Math.random() * 9999);
    
    const botOptions = {
        host: 'MMCPvp07.aternos.me',
        port: 25565,
        username: randomName,
        version: "1.20.1",
        auth: 'offline',
        agent: agent, // استخدام البروكسي لكسر حظر ريندر
        hideErrors: false,
        keepAlive: true,
        checkTimeoutInterval: 60000
    };

    console.log(`📡 جاري محاولة الدخول عبر البروكسي: ${PROXY_HOST}...`);
    const bot = mineflayer.createBot(botOptions);

    // عند الدخول بنجاح
    bot.on('spawn', () => {
        console.log(`✅ [${new Date().toLocaleTimeString()}] تم دخول البوت باسم: ${bot.username}`);
        
        // منع الطرد بسبب الخمول (Anti-AFK)
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                // نظرة عشوائية بسيطة
                const yaw = Math.random() * Math.PI * 2;
                bot.look(yaw, 0, false);
            }
        }, 30000); // كل 30 ثانية
    });

    // معالجة الأخطاء
    bot.on('error', (err) => {
        console.log(`❌ خطأ في البوت: ${err.message}`);
        if (err.message.includes('ECONNREFUSED')) {
            console.log('⚠️ البروكسي قد يكون توقف عن العمل، حاول استبداله.');
        }
    });

    // عند الانفصال
    bot.on('end', () => {
        console.log('⚠️ تم قطع الاتصال بالسيرفر. محاولة العودة بعد 15 ثانية...');
        setTimeout(createBot, 15000);
    });
}

// تشغيل العملية
createBot();

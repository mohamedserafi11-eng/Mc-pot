const mineflayer = require('mineflayer');
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent'); // استدعاء مكتبة البروكسي

// ========== إعدادات البروكسي (يجب تعبئتها) ==========
// يمكنك الحصول على بروكسي مجاني أو مدفوع (SOCKS5)
const proxyOptions = {
    host: '216.26.235.113',
    port: 3129,
    username: '17sbjm71pl5d', 
    password: 'k4l94jb8b15do0s'
};

// إنشاء الوكيل (Agent)
const proxyUrl = `socks5://${proxyOptions.host}:${proxyOptions.port}`;
const agent = new SocksProxyAgent(proxyUrl);

// ========== خادم HTTP لـ Render (Keep-Alive) ==========
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('OK')).listen(PORT, () => {
    console.log(`✅ Keep-alive server on port ${PORT}`);
});

const randomName = 'Guest' + Math.floor(Math.random() * 10000);

const botOptions = {
    host: 'MMCPvp07.aternos.me',
    port: 25565,
    username: randomName,
    version: "1.20.1", // يُفضل تحديد النسخة بدقة عند استخدام البروكسي
    auth: 'offline',
    agent: agent,      // <<< هذا هو السطر الأهم: ربط البوت بالبروكسي
    fakeHost: 'MMCPvp07.aternos.me',
    hideErrors: false,
    keepAlive: true,
    family: 4          // إجبار الاتصال عبر IPv4
};

// ... (بقية كود الحركات العشوائية وإعادة الاتصال كما هي في كودك السابق) ...

function createBot() {
    console.log(`🌐 محاولة الاتصال عبر البروكسي: ${proxyOptions.host}`);
    console.log(`🔄 محاولة الدخول باسم ${botOptions.username} ...`);
    
    const bot = mineflayer.createBot(botOptions);

    // مستمع الأخطاء (مهم جداً لمعرفة لو كان البروكسي لا يعمل)
    bot.on('error', (err) => {
        console.log(`❌ خطأ: ${err.message}`);
        if (err.message.includes('proxy')) {
            console.log('⚠️ مشكلة في البروكسي نفسه (قد يكون متوقفاً)');
        }
    });

    bot.on('spawn', () => {
        console.log('✅ تم دخول البوت بنجاح عبر البروكسي!');
    });

    // ... (بقية الـ Event Listeners) ...
    return bot;
}

createBot();

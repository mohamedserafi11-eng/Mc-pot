const mineflayer = require('mineflayer');
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');

// ==========================================
// 1. بيانات بروكسي Webshare (قم بتعبئتها من حسابك)
// ==========================================
const proxyOptions = {
    host: '31.59.20.176', // غالباً يكون هذا هو الهوست في ويبشار
    port: 6754,             // تأكد من البورت من لوحة تحكم ويبشار (عادة 80 أو 1080)
    username: 'sthyyrsa', // اليوزر نيم الخاص بك
    password: 'tlant3mv3gpb'  // الباسورد الخاص بك
};

// إنشاء الرابط بالصيغة الصحيحة لويبشار (SOCKS5)
const proxyUrl = `socks5://${proxyOptions.username}:${proxyOptions.password}@${proxyOptions.host}:${proxyOptions.port}`;
const agent = new SocksProxyAgent(proxyUrl);

// ==========================================
// 2. خادم الويب لإبقاء Render مستيقظاً (Keep-Alive)
// ==========================================
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Status: Online and Authenticated via Webshare');
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
        agent: agent, // الربط بالبروكسي المدفوع
        connectTimeout: 60000,
        hideErrors: false,
        keepAlive: true
    };

    console.log(`🌐 محاولة الاتصال عبر Webshare Proxy: ${proxyOptions.host}`);
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log(`✅ [${new Date().toLocaleTimeString()}] تم الدخول بنجاح عبر Webshare!`);
        
        // حركة Anti-AFK
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 30000);
    });

    bot.on('error', (err) => {
        console.log(`❌ خطأ: ${err.message}`);
        if (err.message.includes('auth')) {
            console.log('⚠️ خطأ في اليوزر نيم أو الباسورد الخاص بالبروكسي!');
        }
    });

    bot.on('end', () => {
        console.log('⚠️ تم قطع الاتصال. إعادة المحاولة بعد 15 ثانية...');
        setTimeout(createBot, 15000);
    });
}

createBot();

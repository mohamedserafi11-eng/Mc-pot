const mineflayer = require('mineflayer');
const http = require('http');

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('OK')).listen(PORT, () => {
    console.log(`✅ خادم الإبقاء على الحياة يعمل على المنفذ ${PORT}`);
});

const botOptions = {
    host: 'MMCPvp07.aternos.me',
    port: 25565,                // غيّر إلى المنفذ الصحيح من لوحة Aternos
    username: 'Bot' + Math.floor(Math.random() * 10000),
    version: false              // يكتشف الإصدار تلقائياً
};

function createBot() {
    console.log('🔄 جاري محاولة الاتصال بالسيرفر...');
    const bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('✅ تم تسجيل الدخول إلى السيرفر (الحدث login)');
    });

    bot.on('spawn', () => {
        console.log('✅ تم دخول البوت بنجاح إلى العالم!');
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 20000);
    });

    bot.on('error', (err) => {
        console.log('❌ خطأ في الاتصال (error event):', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.log('   السيرفر لا يستجيب - تحقق من أنه شغّال والمنفذ صحيح');
        }
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ انفصل البوت. السبب: ${reason || 'غير معروف'}`);
        setTimeout(createBot, 15000);
    });

    bot.on('kicked', (reason) => {
        console.log(`🚫 تم طرد البوت من السيرفر: ${reason}`);
        setTimeout(createBot, 30000);
    });
}

createBot();

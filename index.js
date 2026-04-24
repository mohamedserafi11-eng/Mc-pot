const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'MMCPvp07.aternos.me',
        port: 25565,
        username: 'Pro_Player' + Math.floor(Math.random() * 100),
        version: "1.20.1",
        auth: 'offline',
        // زيادة وقت الانتظار لمنع الـ ECONNRESET
        connectTimeout: 30000 
    });

    // لا تطبع النجاح إلا هنا!
    bot.once('spawn', () => {
        console.log('✅ [تأكيد] البوت الآن داخل السيرفر ومستقر.');
        
        // حركة بسيطة لمنع الطرد بسبب الخمول
        setInterval(() => {
            if (bot.entity) bot.setControlState('jump', true);
            setTimeout(() => { if (bot.entity) bot.setControlState('jump', false); }, 500);
        }, 60000); 
    });

    bot.on('error', (err) => {
        console.log(`❌ فشل الاتصال: ${err.code}`);
    });

    bot.on('end', () => {
        console.log('⚠️ تم فصل البوت. سأنتظر 5 دقائق قبل المحاولة لضمان عدم الحظر...');
        // أهم سطر: تأخير إعادة المحاولة لمدة 5 دقائق
        setTimeout(createBot, 30000); 
    });
}

createBot();

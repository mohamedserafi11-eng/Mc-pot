const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'MMCPvp07.aternos.me',
        port: 25565,
        username: 'Pro_AFK_' + Math.floor(Math.random() * 1000),
        version: "1.20.1",
        auth: 'offline'
    });

    bot.on('spawn', () => console.log('✅ البوت داخل السيرفر الآن!'));
    bot.on('end', () => setTimeout(createBot, 30000));
    bot.on('error', (err) => console.log('❌ خطأ:', err));
}

createBot();

const mineflayer = require('mineflayer');
const http = require('http');

// --- بداية كود الـ Keep-Alive ---
http.createServer((req, res) => {
  res.write("Bot is Live!"); // هذه الرسالة التي يراها UptimeRobot
  res.end();
}).listen(8080, () => {
  console.log('🚀 Keep-Alive Server is running on port 8080');
});
// --- نهاية كود الـ Keep-Alive ---

// إعدادات الاتصال بالسيرفر
const botOptions = {
  host: 'MMCPvp07.aternos.me', 
  port: 25565,
  username: 'StayAlive',
  version: '1.21.9' 
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('✅ تم دخول البوت بنجاح!');
    // حركة بسيطة لمنع الطرد بسبب الخمول (Anti-AFK)
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 20000); 
  });

  // إعادة الاتصال التلقائي في حال الفصل
  bot.on('end', () => {
    console.log('⚠️ انفصل البوت، جاري إعادة الاتصال بعد 15 ثانية...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('❌ خطأ في الاتصال:', err.message);
    if (err.code === 'ECONNREFUSED') {
       setTimeout(createBot, 30000);
    }
  });
}

// تشغيل البوت لأول مرة
createBot();

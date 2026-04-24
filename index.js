const mineflayer = require('mineflayer');
const http = require('http');

// ========== خادم HTTP لـ Render (Keep-Alive) ==========
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('OK')).listen(PORT, () => {
    console.log(`✅ Keep-alive server on port ${PORT}`);
});

// ========== تكوين البوت بشكل يقلل من احتمالية الحظر ==========
// اسم عشوائي في كل مرة (تجنب الاسم الثابت)
const randomName = 'Guest' + Math.floor(Math.random() * 10000);
// قائمة بأسماء حقيقية (اختياري) يمكن التبديل بينها
// const names = ['Steve', 'Alex', 'Hero', 'Player']; 
// const username = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random(1000));

const botOptions = {
    host: 'MMCPvp07.aternos.me',   // استخدم الاسم الصحيح
    port: 25565,                   // تأكد من المنفذ الصحيح
    username: randomName,
    version: false,                // يكتشف الإصدار تلقائياً (لا تحدده)
    auth: 'offline',               // ضروري لأغلب سيرفرات Aternos
    fakeHost: 'MMCPvp07.aternos.me', // تمويه كمحاولة لتجاوز حظر النطاق
    hideErrors: false,             // لا تخفي الأخطاء لمراقبتها
    keepAlive: true,               // حافظ على الاتصال
    checkTimeoutInterval: 0,       // لا تتحقق من انقطاع خارجي
    viewDistance: 'normal',        // لا تقلل كثيراً، قد يكون مريباً
    chatLengthLimit: 256,
    // إعدادات إضافية لتقليل الشبه الآلي:
    skipValidation: true,          // يتجاهل التحقق من العلامات (بعض السيرفرات)
    logErrors: true                // سجل الأخطاء للمساعدة في التشخيص
};

// ========== دوال مساعدة: تأخير عشوائي (بشري) ==========
const randomDelay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// ========== حركات عشوائية غير متكررة (تجنب الأنماط المعروفة) ==========
let activityInterval = null;
let currentAction = null;

function startRandomActivity(bot) {
    if (activityInterval) clearInterval(activityInterval);
    
    // فترات عشوائية بين الحركات (10 إلى 30 ثانية) أكثر طبيعية
    activityInterval = setInterval(async () => {
        if (!bot || !bot.entity) return;
        
        // قائمة حركات عشوائية مع احتمالات مختلفة
        const actions = [
            () => { // انظر في اتجاه عشوائي
                const yaw = Math.random() * Math.PI * 2;
                bot.look(yaw, 0);
                console.log('👀 نظر حوله');
            },
            () => { // قفزة قصيرة
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 300);
                console.log('🦘 قفز قفزة');
            },
            () => { // تقدم للخلف ثم للأمام (محاكاة التردد)
                bot.setControlState('back', true);
                setTimeout(() => bot.setControlState('back', false), 400);
                setTimeout(() => {
                    if (bot.entity) {
                        bot.setControlState('forward', true);
                        setTimeout(() => bot.setControlState('forward', false), 400);
                    }
                }, 500);
                console.log('🚶 تحرك متردداً');
            },
            () => { // اضغط زر السير بجانب
                // لو كان هناك كتلة قريبة، يتفاعل معها (محاكاة لاعب)
                const block = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                if (block && block.name.includes('grass')) {
                    bot.creative.stopFlying(); // مجرد مثال
                }
                console.log('👆 تفاعل بسيط');
            }
        ];
        
        // اختيار عشوائي لمنع النمط المتوقع
        const actionIndex = Math.floor(Math.random() * actions.length);
        const action = actions[actionIndex];
        if (action) action();
        
        // الانتظار قبل الحركة التالية
        await randomDelay(10000, 30000);
        
    }, 15000); // الفاصل الزمني المتوسط 15 ثانية
}

// ========== إنشاء البوت مع إعادة اتصال ذكية ==========
let reconnectAttempts = 0;
const maxReconnectDelay = 60000; // أقصى تأخير 60 ثانية

function createBot() {
    console.log(`🔄 محاولة الدخول باسم ${botOptions.username} ...`);
    const bot = mineflayer.createBot(botOptions);
    
    // عند الدخول بنجاح إلى العالم
    bot.on('spawn', () => {
        console.log('✅ تم دخول البوت إلى العالم!');
        reconnectAttempts = 0; // إعادة تعيين محاولات إعادة الاتصال
        startRandomActivity(bot);
        
        // إرسال رسالة ترحيب عشوائية (أحياناً) لتقليد اللاعبين الحقيقيين
        const shouldGreet = Math.random() < 0.3; // 30% مرة
        if (shouldGreet) {
            setTimeout(() => {
                const greetings = ['Hello', 'Hi', 'Hey', ':)'];
                const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
                bot.chat(randomGreet);
                console.log(`💬 قال: ${randomGreet}`);
            }, randomDelay(2000, 8000));
        }
    });
    
    // مراقبة رسائل الخادم التي قد تشير إلى حظر وشيك
    bot.on('chat', (username, message) => {
        if (message.toLowerCase().includes('bot') || message.toLowerCase().includes('antibot')) {
            console.log(`⚠️ كلمة مشبوهة من ${username}: ${message}`);
            // يمكن تنفيذ ردود عشوائية غير فجة
            if (Math.random() < 0.2) {
                bot.chat("I'm not a bot lol");
            }
        }
    });
    
    // معالجة الأخطاء لتشخيص سبب عدم الدخول
    bot.on('error', (err) => {
        console.log(`❌ خطأ: ${err.message}`);
        if (err.message.includes('Invalid version')) {
            console.log('   الإصدار الذي حددته غير صحيح. قم بتعيين version: false');
        } else if (err.message.includes('ECONNREFUSED')) {
            console.log('   السيرفر لا يستجيب - المنفذ أو العنوان خاطئ أو السيرفر متوقف');
        } else if (err.message.includes('Invalid username')) {
            console.log('   اسم المستخدم غير صالح - قد يكون ممنوعاً أو محجوزاً');
        }
    });
    
    // عند القطع (end) أو الطرد
    bot.on('end', (reason) => {
        console.log(`⚠️ انفصل البوت: ${reason || 'سبب غير معروف'}`);
        scheduleReconnect();
    });
    
    bot.on('kicked', (reason) => {
        console.log(`🚫 طرد البوت من السيرفر: ${reason}`);
        // إذا كان الطرد بسبب "bot" أو "cheating"، نزيد التأخير
        if (reason && (reason.toLowerCase().includes('bot') || reason.toLowerCase().includes('automatic'))) {
            console.log('   تم التعرف عليه كبوت، زيادة تأخير إعادة المحاولة.');
            reconnectAttempts += 3; // لزيادة التأخير بشكل أسرع
        }
        scheduleReconnect();
    });
    
    return bot;
}

// إعادة اتصال بتأخير متزايد (backoff)
function scheduleReconnect() {
    const delay = Math.min(5000 * Math.pow(1.5, reconnectAttempts), maxReconnectDelay);
    reconnectAttempts++;
    console.log(`🕒 إعادة الاتصال بعد ${Math.round(delay / 1000)} ثانية... (محاولة رقم ${reconnectAttempts})`);
    setTimeout(() => {
        createBot();
    }, delay);
}

// ========== تشغيل البوت لأول مرة ==========
createBot();

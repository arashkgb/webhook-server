const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = process.env.PORT || 3000;

// تنظیم توکن تلگرام و ID چت
const token = '8057158773:AAFoeW0737zvIoqn5eJHZpv_71o83I4bsFE';
const chatId = '85416603';
const bot = new TelegramBot(token, { polling: false });

// برای دریافت درخواست‌های JSON
app.use(express.json());

// لیست جفت ارزهای مطرح
const pairs = [
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD",
  "NZDUSD", "USDCHF", "EURJPY", "GBPJPY", "EURGBP"
];

// روت برای دریافت وب‌هوک
app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('Received webhook:', data);

  // پردازش داده‌ها
  const { ticker, timeframe, signal, message } = data;
  if (pairs.includes(ticker) && timeframe === "15m") {
    const alertMessage = `${ticker} [${timeframe}]: ${signal} - ${message}`;
    console.log(alertMessage);

    // ارسال به تلگرام
    bot.sendMessage(chatId, alertMessage)
      .then(() => console.log('Message sent to Telegram'))
      .catch(err => console.error('Telegram error:', err));
  }

  // پاسخ به TradingView
  res.status(200).send('Webhook received');
});

// راه‌اندازی سرور
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
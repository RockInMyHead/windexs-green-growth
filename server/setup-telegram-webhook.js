#!/usr/bin/env node

/**
 * Скрипт для настройки Telegram Webhook
 * Запустите этот скрипт один раз для настройки webhook
 */

require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8420396906:AAFBiilQjJ1Cwyo0VOsjSSVa9WJpjMBNTdM';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://wizary.windexs.ru/api/telegram/webhook';

async function setupWebhook() {
  try {
    console.log('🔧 Настройка Telegram Webhook...');
    console.log(`📱 Bot Token: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
    console.log(`🌐 Webhook URL: ${WEBHOOK_URL}\n`);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: WEBHOOK_URL
      })
    });

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook успешно настроен!');
      console.log(`📋 Описание: ${data.description || 'N/A'}`);
      
      // Проверяем информацию о webhook
      const infoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
      const infoData = await infoResponse.json();
      
      if (infoData.ok) {
        console.log('\n📊 Информация о webhook:');
        console.log(`   URL: ${infoData.result.url}`);
        console.log(`   Ожидает обновлений: ${infoData.result.pending_update_count || 0}`);
        console.log(`   Последняя ошибка: ${infoData.result.last_error_message || 'Нет ошибок'}`);
      }
    } else {
      console.error('❌ Ошибка настройки webhook:', data.description);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

setupWebhook();

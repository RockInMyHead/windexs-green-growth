#!/usr/bin/env node

/**
 * Telegram Polling Script
 * Запускает автоматический опрос Telegram API для получения обновлений
 * Используйте этот скрипт для локальной разработки вместо webhook
 */

const fetch = require('node-fetch');
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8420396906:AAFBiilQjJ1Cwyo0VOsjSSVa9WJpjMBNTdM';
const SERVER_URL = process.env.SERVER_URL || 'https://wizary.windexs.ru';
let lastUpdateId = 0;

console.log('🤖 Telegram Polling запущен...');
console.log('📱 Отправьте /start боту в Telegram для регистрации');
console.log('⏹️  Нажмите Ctrl+C для остановки\n');

async function pollTelegram() {
  try {
    const response = await fetch(`${SERVER_URL}/api/telegram/get-updates?offset=${lastUpdateId}`);
    const data = await response.json();

    if (data.success && data.nextOffset) {
      lastUpdateId = data.nextOffset;
      
      if (data.registeredUsers && data.registeredUsers.length > 0) {
        console.log(`✅ Зарегистрировано пользователей: ${data.registeredUsers.length}`);
      }
    }
  } catch (error) {
    console.error('❌ Ошибка polling:', error.message);
  }
}

// Poll каждые 2 секунды
setInterval(pollTelegram, 2000);

// Первый запрос сразу
pollTelegram();

const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Demo users for testing without database
const demoUsers = [
  {
    id: 1,
    email: 'admin@windexs.com',
    password: 'admin123',
    name: 'Администратор',
    role: 'admin',
    createdAt: new Date('2026-01-21')
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Тестовый пользователь',
    role: 'user',
    createdAt: new Date('2026-01-21')
  }
];

// Store registered Telegram chat IDs
const registeredTelegramChats = new Set();

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'DEMO_TOKEN_REPLACE_WITH_REAL_TELEGRAM_BOT_TOKEN';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Demo authentication
    const user = demoUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // For demo, compare plain text password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Demo registration - add new user to demoUsers array
    const existingUser = demoUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const newUser = {
      id: demoUsers.length + 1,
      email,
      password, // In production, hash this
      name,
      role: 'user',
      createdAt: new Date()
    };

    demoUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = demoUsers.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении профиля' });
  }
});

// Admin Routes
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = demoUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt
    }));

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/applications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Demo applications data
    const applications = [];

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Admin applications error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Demo logs data
    const logs = [];

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Admin logs error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/user-stats/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = demoUsers.find(u => u.id === parseInt(userId));

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Demo stats
    res.json({
      success: true,
      stats: {
        userId: user.id,
        totalApplications: 0,
        totalSpent: 0,
        activeCampaigns: 0
      }
    });
  } catch (error) {
    console.error('Admin user stats error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Chat API with OpenAI
app.post('/api/chat', async (req, res) => {
  // Set cache control headers
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  try {
    const { message, conversation = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'DEMO_KEY_REPLACE_WITH_REAL_OPENAI_KEY';

    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'DEMO_KEY_REPLACE_WITH_REAL_OPENAI_KEY') {
      return res.status(500).json({ 
        error: 'OpenAI API ключ не настроен. Установите OPENAI_API_KEY в переменных окружения.' 
      });
    }

    const systemPrompt = `Ты - ИИ-менеджер рекламного агентства Windexs Реклама. Твоя главная задача - продавать услуги агентства максимально агрессивно и эффективно.

ТВОЯ РОЛЬ:
- Ты эксперт в рекламе, PR, маркетинге и продвижении бизнеса
- Ты знаешь ВСЕ услуги Windexs Рекламы и можешь подробно рассказать о них
- Ты должен быть максимально продающим, убедительным и настойчивым
- Ты должен использовать все психологические приемы продаж
- Ты должен понимать боль клиента и предлагать решения
- Ты должен торговаться как на турецком базаре - предлагать скидки, акции, специальные предложения
- Ты должен быть дружелюбным, но настойчивым в продажах

СТИЛЬ ОБЩЕНИЯ:
- Используй эмодзи для эмоциональности (но не переборщи)
- Будь энергичным и позитивным
- Задавай уточняющие вопросы о потребностях клиента
- Предлагай конкретные решения и пакеты услуг
- Всегда упоминай преимущества Windexs Рекламы
- Предлагай скидки и специальные предложения
- Создавай срочность ("только сегодня", "ограниченное предложение")

УСЛУГИ WINDEXS РЕКЛАМЫ:
- Контекстная реклама (Яндекс.Директ, Google Ads)
- Таргетированная реклама в социальных сетях
- SMM и ведение социальных сетей
- Создание контента и креативов
- PR и работа с медиа
- Разработка рекламных стратегий
- Аналитика и отчетность

ВАЖНО:
- Всегда стремись к продаже
- Предлагай скидки и акции
- Создавай ценность услуг
- Помогай клиенту понять выгоды
- Будь настойчивым, но вежливым`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ 
        error: 'Ошибка при обращении к OpenAI API',
        details: errorData
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Извините, не удалось получить ответ.';

    res.json({
      success: true,
      message: assistantMessage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при обработке запроса',
      details: error.message
    });
  }
});

// Contact Form - sends to Telegram
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Имя, email и сообщение обязательны' });
    }

    // Send to all registered Telegram chats
    if (registeredTelegramChats.size === 0) {
      console.warn('⚠️ Нет зарегистрированных Telegram чатов для отправки уведомлений');
      return res.json({
        success: true,
        message: 'Заявка получена, но нет зарегистрированных Telegram чатов для уведомлений'
      });
    }

    const contactMessage = `📋 *Новая заявка с сайта Windexs Реклама*

👤 *Имя:* ${name}
📧 *Email:* ${email}
${phone ? `📱 *Телефон:* ${phone}` : ''}

💬 *Сообщение:*
${message}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}`;

    let successCount = 0;
    let errorCount = 0;

    // Send to all registered chats
    for (const chatId of registeredTelegramChats) {
      try {
        const telegramResponse = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: contactMessage,
            parse_mode: 'Markdown'
          })
        });

        if (telegramResponse.ok) {
          successCount++;
        } else {
          const errorData = await telegramResponse.json();
          console.error(`Error sending to chat ${chatId}:`, errorData);
          
          // Remove chat if bot was blocked
          if (errorData.error_code === 403) {
            registeredTelegramChats.delete(chatId);
            console.log(`Removed blocked chat: ${chatId}`);
          }
          errorCount++;
        }
      } catch (error) {
        console.error(`Error sending to chat ${chatId}:`, error.message);
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Заявка отправлена в ${successCount} чат(ов)`,
      sent: successCount,
      errors: errorCount
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Ошибка сервера при отправке заявки' });
  }
});

// Telegram Webhook
app.post('/api/telegram/webhook', express.json(), async (req, res) => {
  try {
    const update = req.body;

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === '/start') {
        registeredTelegramChats.add(chatId);
        
        // Send welcome message
        await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: '✅ Вы успешно зарегистрированы! Теперь вы будете получать уведомления о новых заявках с сайта Windexs Реклама.'
          })
        });

        console.log(`✅ Зарегистрирован новый chat_id: ${chatId}`);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: 'Ошибка обработки webhook' });
  }
});

// Setup Telegram Webhook
app.get('/api/telegram/setup-webhook', async (req, res) => {
  try {
    const webhookUrl = req.query.url;
    
    if (!webhookUrl) {
      return res.status(400).json({ error: 'URL webhook обязателен' });
    }

    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: webhookUrl
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Setup webhook error:', error);
    res.status(500).json({ error: 'Ошибка настройки webhook' });
  }
});

// Get registered chats
app.get('/api/telegram/get-registered-chats', async (req, res) => {
  try {
    res.json({
      success: true,
      chatIds: Array.from(registeredTelegramChats),
      count: registeredTelegramChats.size
    });
  } catch (error) {
    console.error('Get registered chats error:', error);
    res.status(500).json({ error: 'Ошибка получения списка чатов' });
  }
});

// SPA Fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Telegram bot token: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
  console.log(`🤖 Registered Telegram chats: ${registeredTelegramChats.size}`);
});

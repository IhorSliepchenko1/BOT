import { Telegraf } from "telegraf";
import dotenv from "dotenv";

// Загрузка переменных окружения из .env файла
dotenv.config();

// Создаем экземпляр бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// Команды бота
const commands = [
  { command: "/start", description: "Начать работу с ботом" },
  { command: "/help", description: "Получить список команд" },
  { command: "/sum", description: "Вычислить сумму двух чисел" },
];

// Функция для создания инлайн-клавиатуры с кнопками
const createCommandsKeyboard = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        commands.map((cmd) => ({
          text: cmd.command,
          callback_data: cmd.command,
        })),
      ],
    },
  };
};

// Обработка команды /start
bot.start((ctx) => {
  ctx.reply("Привет! Я ваш новый бот.", createCommandsKeyboard());
});

// Обработка команды /help
bot.help((ctx) => {
  ctx.reply(
    "Я могу посчитать для вас что-то. Напишите задачу в формате 2+2",
    createCommandsKeyboard()
  );
});

// Обработка нажатий на инлайн-кнопки
bot.action(
  commands.map((cmd) => cmd.command),
  (ctx) => {
    const command = ctx.match[0];
    const commandInfo = commands.find((cmd) => cmd.command === command);
    if (commandInfo) {
      ctx.answerCbQuery(
        `Команда ${commandInfo.command}: ${commandInfo.description}`
      );
    }
  }
);

// Обработка арифметических выражений
bot.on("text", (ctx) => {
  const text = ctx.message.text;
  const parts = text.split("+");
  if (parts.length === 2) {
    const num1 = parseFloat(parts[0].trim());
    const num2 = parseFloat(parts[1].trim());

    if (!isNaN(num1) && !isNaN(num2)) {
      const sum = num1 + num2;
      ctx.reply(`Сумма: ${num1} + ${num2} = ${sum}`);
    } else {
      ctx.reply(
        'Ошибка: Пожалуйста, введите корректное выражение в формате "число1 + число2"'
      );
    }
  } else {
    ctx.reply(
      'Ошибка: Пожалуйста, введите выражение в формате "число1 + число2"'
    );
  }
});

// Запуск бота
bot
  .launch()
  .then(() => {
    console.log("Бот запущен");
  })
  .catch((err) => {
    console.error("Ошибка при запуске бота:", err);
  });

// Обработка остановки бота
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

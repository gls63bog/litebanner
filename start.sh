#!/bin/bash

# Скрипт для запуска бота в фоновом режиме

echo "Запуск LiteBanner бота в фоновом режиме..."

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "Ошибка: файл .env не найден!"
    echo "Создайте файл .env на основе .env.example"
    exit 1
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей..."
    npm install
fi

# Запускаем бота в фоновом режиме
nohup npm start > bot.log 2>&1 &

# Получаем PID процесса
PID=$!
echo "Бот запущен с PID: $PID"
echo $PID > bot.pid

echo "Логи сохраняются в bot.log"
echo "Для остановки бота используйте: kill $PID"
echo "Или запустите: ./stop.sh"
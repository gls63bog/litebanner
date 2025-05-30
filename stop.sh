#!/bin/bash

# Скрипт для остановки бота

if [ -f bot.pid ]; then
    PID=$(cat bot.pid)
    echo "Остановка бота с PID: $PID"
    kill $PID
    rm bot.pid
    echo "Бот остановлен"
else
    echo "Файл bot.pid не найден. Бот не запущен или запущен не через start.sh"
fi
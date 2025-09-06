#!/bin/bash

# Быстрый деплой изменений на GitHub

echo "🚀 Быстрый деплой FlatcherSite"
echo "================================"
echo ""

# Проверяем статус
echo "📊 Статус Git:"
git status --short
echo ""

# Проверяем, есть ли изменения
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Нет изменений для отправки"
    echo "Все файлы уже синхронизированы с GitHub"
    exit 0
fi

echo "📝 Обнаружены изменения. Добавляю в Git..."
git add .

echo "💬 Введите сообщение коммита:"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "💾 Создаю коммит: $commit_message"
git commit -m "$commit_message"

echo "📤 Отправляю изменения на GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Изменения успешно отправлены!"
    echo ""
    echo "🌐 Репозиторий: https://github.com/EBROPA/FlatcherSite"
    echo "📅 Коммит: $commit_message"
else
    echo "❌ Ошибка при отправке изменений"
    exit 1
fi

echo ""
echo "�� Деплой завершен!"

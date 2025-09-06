#!/bin/bash

# Скрипт для настройки GitHub репозитория для FlatcherSite

echo "🚀 Настройка GitHub репозитория для FlatcherSite"
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь, что вы находитесь в корневой папке проекта."
    exit 1
fi

# Проверяем статус Git
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Git репозиторий не инициализирован."
    exit 1
fi

echo "✅ Git репозиторий найден"
echo ""

# Показываем текущий статус
echo "📊 Текущий статус Git:"
git status --short
echo ""

# Показываем последние коммиты
echo "📝 Последние коммиты:"
git log --oneline -5
echo ""

echo "🔗 Для создания репозитория на GitHub:"
echo "1. Перейдите на https://github.com/new"
echo "2. Введите имя репозитория: FlatcherSite"
echo "3. Выберите 'Public' или 'Private'"
echo "4. НЕ ставьте галочки на 'Add a README file', 'Add .gitignore', 'Choose a license'"
echo "5. Нажмите 'Create repository'"
echo ""
echo "После создания репозитория выполните следующие команды:"
echo ""
echo "git remote add origin https://github.com/YOUR_USERNAME/FlatcherSite.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

# Проверяем, есть ли уже удаленный репозиторий
if git remote -v | grep -q origin; then
    echo "✅ Удаленный репозиторий уже настроен:"
    git remote -v
    echo ""
    echo "Для отправки изменений выполните:"
    echo "git push origin main"
else
    echo "❌ Удаленный репозиторий не настроен."
    echo "Следуйте инструкциям выше для настройки."
fi

echo ""
echo "📋 Полезные команды Git:"
echo "git status                    - проверить статус"
echo "git add .                     - добавить все изменения"
echo "git commit -m 'сообщение'     - создать коммит"
echo "git push origin main          - отправить изменения на GitHub"
echo "git pull origin main          - получить изменения с GitHub"
echo "git log --oneline             - посмотреть историю коммитов"
echo "git branch                    - посмотреть ветки"
echo "git checkout -b feature-name  - создать новую ветку"
echo ""

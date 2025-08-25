#!/bin/bash

# Полная настройка проекта FlatcherSite

echo "🚀 Полная настройка FlatcherSite"
echo "=================================="
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь, что вы находитесь в корневой папке проекта."
    exit 1
fi

echo "✅ Проект найден"
echo ""

# Показываем статус Git
echo "📊 Статус Git:"
git status --short
echo ""

# Показываем последние коммиты
echo "📝 Последние коммиты:"
git log --oneline -5
echo ""

# Показываем теги
echo "🏷️  Версии:"
git tag
echo ""

# Показываем удаленный репозиторий
echo "🔗 Удаленный репозиторий:"
git remote -v
echo ""

# Проверяем SSH ключ
echo "🔑 SSH ключ для GitHub:"
if [ -f ~/.ssh/github_flatcher.pub ]; then
    echo "✅ SSH ключ найден:"
    cat ~/.ssh/github_flatcher.pub
    echo ""
    echo "📋 Скопируйте этот ключ и добавьте его в GitHub:"
    echo "https://github.com/settings/keys"
    echo ""
else
    echo "❌ SSH ключ не найден"
fi

echo "📋 Инструкции по настройке:"
echo "1. Добавьте SSH ключ в GitHub (см. выше)"
echo "2. Или создайте Personal Access Token:"
echo "   https://github.com/settings/tokens"
echo ""
echo "3. После настройки аутентификации выполните:"
echo "   git push -u origin main"
echo "   git push origin v1.0.0"
echo ""

# Проверяем, есть ли несохраненные изменения
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Обнаружены несохраненные изменения!"
    echo "Хотите добавить и закоммитить их? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Добавляю изменения..."
        git add .
        echo "Введите сообщение коммита:"
        read -r commit_message
        git commit -m "$commit_message"
        echo "✅ Изменения закоммичены"
    fi
fi

echo ""
echo "🎯 Следующие шаги:"
echo "1. Настройте аутентификацию GitHub (см. GITHUB_SETUP.md)"
echo "2. Отправьте код: git push -u origin main"
echo "3. Отправьте теги: git push origin v1.0.0"
echo "4. Настройте GitHub Pages (опционально)"
echo ""
echo "📚 Документация:"
echo "- README.md - подробная документация"
echo "- GIT_WORKFLOW.md - инструкции по Git"
echo "- QUICK_START.md - быстрый старт"
echo "- GITHUB_SETUP.md - настройка GitHub"
echo ""
echo "🔧 Полезные скрипты:"
echo "- ./setup-github.sh - проверка настроек"
echo "- ./deploy-to-github.sh - быстрый деплой"
echo "- ./complete-setup.sh - эта инструкция"
echo ""
echo "🌐 Ссылки:"
echo "- GitHub репозиторий: https://github.com/EBROPA/FlatcherSite"
echo "- Локальный сайт: http://localhost:5173"
echo ""
echo "🎉 Настройка завершена! Удачи в разработке!"

#!/bin/bash

# Скрипт для деплоя FlatcherSite на GitHub

echo "🚀 Деплой FlatcherSite на GitHub"
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
echo "📊 Текущий статус:"
git status --short
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
    else
        echo "❌ Отмена. Сохраните изменения вручную."
        exit 1
    fi
fi

# Проверяем, настроен ли удаленный репозиторий
if ! git remote -v | grep -q origin; then
    echo "❌ Удаленный репозиторий не настроен."
    echo ""
    echo "🔗 Для настройки GitHub репозитория:"
    echo "1. Перейдите на https://github.com/new"
    echo "2. Создайте репозиторий 'FlatcherSite'"
    echo "3. Выполните команды:"
    echo ""
    echo "git remote add origin https://github.com/YOUR_USERNAME/FlatcherSite.git"
    echo "git push -u origin main"
    echo ""
    exit 1
fi

echo "✅ Удаленный репозиторий настроен:"
git remote -v
echo ""

# Отправляем изменения
echo "📤 Отправка изменений на GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Изменения успешно отправлены!"
else
    echo "❌ Ошибка при отправке изменений."
    exit 1
fi

# Отправляем теги
echo "🏷️  Отправка тегов..."
git push origin --tags

if [ $? -eq 0 ]; then
    echo "✅ Теги успешно отправлены!"
else
    echo "❌ Ошибка при отправке тегов."
fi

echo ""
echo "🎉 Деплой завершен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Перейдите на GitHub и проверьте репозиторий"
echo "2. Создайте релиз на основе тега v1.0.0"
echo "3. Настройте GitHub Pages для демонстрации сайта"
echo ""
echo "🔗 Полезные ссылки:"
echo "- GitHub репозиторий: $(git remote get-url origin)"
echo "- GitHub Pages: https://YOUR_USERNAME.github.io/FlatcherSite/"
echo ""

# 🚀 Быстрый старт FlatcherSite

## Настройка GitHub (один раз)

1. **Создайте репозиторий на GitHub:**
   - Перейдите на https://github.com/new
   - Имя: `FlatcherSite`
   - Выберите Public/Private
   - НЕ ставьте галочки на README, .gitignore, license

2. **Подключите к удаленному репозиторию:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/FlatcherSite.git
   git push -u origin main
   git push origin v1.0.0
   ```

## Ежедневная работа

### Утром (перед работой)
```bash
git pull origin main
npm run dev
```

### В течение дня
```bash
# Регулярно сохраняйте изменения
git add .
git commit -m "описание изменений"
```

### Вечером (после работы)
```bash
git push origin main
```

## Полезные скрипты

```bash
# Настройка GitHub (первый раз)
./setup-github.sh

# Быстрый деплой на GitHub
./deploy-to-github.sh
```

## Основные команды

```bash
# Разработка
npm run dev          # Запуск dev-сервера
npm run build        # Сборка для продакшена

# Git
git status           # Статус изменений
git add .            # Добавить все изменения
git commit -m "msg"  # Создать коммит
git push origin main # Отправить на GitHub
git pull origin main # Получить с GitHub

# Версии
git tag -a v1.1.0 -m "Версия 1.1.0"  # Создать новую версию
git push origin v1.1.0               # Отправить версию
```

## Структура проекта

```
FlatcherSite/
├── assets/          # Изображения и SVG
├── src/
│   ├── components/  # React компоненты
│   ├── pages/       # Страницы сайта
│   └── ...
├── README.md        # Подробная документация
├── GIT_WORKFLOW.md  # Инструкции по Git
└── setup-github.sh  # Скрипт настройки GitHub
```

## Ссылки

- **Сайт:** http://localhost:5173 (в разработке)
- **GitHub:** https://github.com/YOUR_USERNAME/FlatcherSite
- **Документация:** README.md
- **Git инструкции:** GIT_WORKFLOW.md

---

**💡 Совет:** Используйте `./deploy-to-github.sh` для быстрого сохранения изменений на GitHub!

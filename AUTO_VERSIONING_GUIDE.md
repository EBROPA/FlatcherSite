# 🤖 Автоматическое создание версий FlatcherSite

## 🎯 Обзор

Система автоматического создания версий позволяет:
- ✅ Создавать версии на GitHub каждый час
- ✅ Автоматически делать бэкапы
- ✅ Легко откатываться к любой версии
- ✅ Отслеживать все изменения в логах

## 🚀 Быстрый старт

### 1. Настройка автоматизации

```bash
# Настроить автоматическое создание версий
./setup-auto-versioning.sh
```

Это создаст:
- Cron-задачу для запуска каждый час
- Скрипты управления
- Систему логирования

### 2. Проверка статуса

```bash
# Просмотреть все доступные версии
./rollback-manager.sh list

# Проверить статус автоматизации
./view-auto-logs.sh
```

## 📋 Доступные команды

### 🔄 Управление версиями

```bash
# Показать все версии
./version-manager.sh list

# Переключиться на версию
./version-manager.sh switch v1.1.1

# Создать новую версию
./version-manager.sh create v1.2.0
```

### 🤖 Автоматическое создание

```bash
# Запустить создание версии вручную
./run-auto-versioning.sh

# Остановить автоматизацию
./stop-auto-versioning.sh

# Просмотреть логи
./view-auto-logs.sh
```

### 🔄 Откаты

```bash
# Показать версии для отката
./rollback-manager.sh list

# Откатиться к версии
./rollback-manager.sh rollback v1.1.0

# Предварительный просмотр
./rollback-manager.sh preview v1.1.0

# Восстановить из бэкапа
./rollback-manager.sh restore v1.1.1
```

## ⏰ Расписание автоматизации

### Cron-задача
- **Частота**: Каждый час в 0 минут
- **Команда**: `0 * * * * cd /path/to/project && ./auto-versioning.sh`
- **Логи**: `cron-auto-versioning.log`

### Условия создания версии
1. ✅ Есть новые изменения в репозитории
2. ✅ Успешное подключение к GitHub
3. ✅ Достаточно места для бэкапа

## 📁 Структура файлов

```
FlatcherSite/
├── auto-versioning.sh           # Основной скрипт автоматизации
├── setup-auto-versioning.sh     # Настройка автоматизации
├── run-auto-versioning.sh       # Ручной запуск
├── stop-auto-versioning.sh      # Остановка автоматизации
├── view-auto-logs.sh            # Просмотр логов
├── rollback-manager.sh          # Управление откатами
├── auto-backups/                # Автоматические бэкапы
├── auto-versioning.log          # Основной лог
└── cron-auto-versioning.log     # Cron лог
```

## 🏷️ Типы версий

### Стабильные версии
- **Формат**: `v1.1.1`
- **Создание**: Вручную через `./version-manager.sh create`
- **Назначение**: Релизы для продакшена

### Автоматические версии
- **Формат**: `auto-v1.1.1-20250825_1659`
- **Создание**: Автоматически каждый час
- **Назначение**: Точки восстановления

### Бэкапы
- **Формат**: `v1.1.1_20250825_165529.tar.gz`
- **Создание**: При каждом создании версии
- **Назначение**: Локальные копии для восстановления

## 🔄 Процесс автоматического создания

### 1. Проверка изменений
```bash
git fetch origin
git rev-parse HEAD != git rev-parse origin/main
```

### 2. Создание версии
```bash
git checkout main
git pull origin main
git tag auto-v1.1.1-$(date +%Y%m%d_%H%M)
git push origin auto-v1.1.1-$(date +%Y%m%d_%H%M)
```

### 3. Создание бэкапа
```bash
git archive --format=tar --prefix="version/" tag | gzip > backup.tar.gz
```

### 4. Очистка старых бэкапов
```bash
# Оставляем только последние 24 бэкапа
ls -t auto-backups/auto-v*.tar.gz | tail -n +25 | xargs -r rm
```

## 🔄 Процесс отката

### 1. Предварительный просмотр
```bash
./rollback-manager.sh preview v1.1.0
```

### 2. Создание бэкапа текущего состояния
```bash
tar -czf rollback-backup-$(date +%Y%m%d_%H%M%S).tar.gz .
```

### 3. Откат к версии
```bash
git checkout v1.1.0
git checkout -b rollback-to-v1.1.0
```

### 4. Обновление package.json
```bash
sed -i '' 's/"version": ".*"/"version": "1.1.0"/' package.json
git add package.json
git commit -m "Rollback to version v1.1.0"
```

## 📊 Мониторинг

### Логи автоматизации
```bash
# Просмотр основного лога
tail -f auto-versioning.log

# Просмотр cron лога
tail -f cron-auto-versioning.log

# Просмотр всех логов
./view-auto-logs.sh
```

### Статистика версий
```bash
# Количество версий
git tag -l | wc -l

# Последние 10 версий
git tag -l | tail -10

# Автоматические версии за сегодня
git tag -l | grep "auto-v.*$(date +%Y%m%d)" | wc -l
```

## 🚨 Устранение проблем

### Проблема: Cron не работает
```bash
# Проверить cron-задачи
crontab -l

# Проверить логи cron
tail -f /var/log/cron

# Перезапустить cron
sudo service cron restart
```

### Проблема: Нет доступа к GitHub
```bash
# Проверить SSH ключи
ssh -T git@github.com

# Проверить токен доступа
gh auth status
```

### Проблема: Недостаточно места
```bash
# Очистить старые бэкапы
find auto-backups/ -name "*.tar.gz" -mtime +7 -delete

# Проверить свободное место
df -h
```

### Проблема: Конфликт версий
```bash
# Удалить конфликтующий тег
git tag -d auto-v1.1.1-20250825_1659
git push origin --delete auto-v1.1.1-20250825_1659

# Создать новую версию
./run-auto-versioning.sh
```

## 🔧 Настройка

### Изменение частоты
```bash
# Редактировать cron-задачу
crontab -e

# Примеры расписания:
# Каждые 30 минут: */30 * * * *
# Каждые 2 часа: 0 */2 * * *
# Только в рабочее время: 0 9-18 * * 1-5
```

### Изменение количества бэкапов
```bash
# Редактировать auto-versioning.sh
# Найти строку: tail -n +25
# Изменить на нужное количество
```

### Настройка уведомлений
```bash
# Добавить в auto-versioning.sh
# Отправка email или push-уведомления
```

## 📞 Поддержка

### Полезные команды
```bash
# Полный статус системы
./version-manager.sh status
./rollback-manager.sh status
./view-auto-logs.sh

# Проверка здоровья
git status
git log --oneline -5
df -h
```

### Контакты
- Документация: `VERSION_MANAGEMENT.md`
- Логи: `auto-versioning.log`
- Cron логи: `cron-auto-versioning.log`

## 🎉 Результат

С автоматической системой версионирования вы получаете:

✅ **Автоматические бэкапы каждый час**
✅ **Легкий откат к любой версии**
✅ **Полная история изменений**
✅ **Безопасность данных**
✅ **Простота управления**

Теперь ваш проект защищен от потери данных и всегда можно вернуться к рабочей версии! 🚀

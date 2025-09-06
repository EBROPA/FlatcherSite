#!/bin/bash

# Скрипт настройки автоматического создания версий
# Устанавливает cron-задачу для запуска каждый час

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTO_SCRIPT="$SCRIPT_DIR/auto-versioning.sh"
CRON_LOG="$SCRIPT_DIR/cron-auto-versioning.log"

echo "🔧 Настройка автоматического создания версий"
echo "=============================================="

# Проверяем, что скрипт существует
if [ ! -f "$AUTO_SCRIPT" ]; then
    echo "❌ Ошибка: Скрипт $AUTO_SCRIPT не найден"
    exit 1
fi

# Делаем скрипт исполняемым
chmod +x "$AUTO_SCRIPT"

echo "✅ Скрипт сделан исполняемым"

# Создаем cron-задачу
echo "📅 Создаем cron-задачу для запуска каждый час..."

# Удаляем существующую cron-задачу если есть
(crontab -l 2>/dev/null | grep -v "auto-versioning.sh") | crontab -

# Добавляем новую cron-задачу (каждый час в 0 минут)
(crontab -l 2>/dev/null; echo "0 * * * * cd $SCRIPT_DIR && $AUTO_SCRIPT >> $CRON_LOG 2>&1") | crontab -

echo "✅ Cron-задача создана: запуск каждый час в 0 минут"

# Создаем скрипт для ручного запуска
cat > "$SCRIPT_DIR/run-auto-versioning.sh" << 'EOF'
#!/bin/bash

# Скрипт для ручного запуска автоматического создания версий

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTO_SCRIPT="$SCRIPT_DIR/auto-versioning.sh"

echo "🚀 Ручной запуск автоматического создания версий"
echo "================================================"

if [ -f "$AUTO_SCRIPT" ]; then
    cd "$SCRIPT_DIR"
    "$AUTO_SCRIPT"
else
    echo "❌ Ошибка: Скрипт $AUTO_SCRIPT не найден"
    exit 1
fi
EOF

chmod +x "$SCRIPT_DIR/run-auto-versioning.sh"

echo "✅ Скрипт ручного запуска создан: run-auto-versioning.sh"

# Создаем скрипт для остановки автоматизации
cat > "$SCRIPT_DIR/stop-auto-versioning.sh" << 'EOF'
#!/bin/bash

# Скрипт для остановки автоматического создания версий

echo "🛑 Остановка автоматического создания версий"
echo "============================================"

# Удаляем cron-задачу
(crontab -l 2>/dev/null | grep -v "auto-versioning.sh") | crontab -

echo "✅ Cron-задача удалена"
echo "ℹ️  Автоматическое создание версий остановлено"
EOF

chmod +x "$SCRIPT_DIR/stop-auto-versioning.sh"

echo "✅ Скрипт остановки создан: stop-auto-versioning.sh"

# Создаем скрипт для просмотра логов
cat > "$SCRIPT_DIR/view-auto-logs.sh" << 'EOF'
#!/bin/bash

# Скрипт для просмотра логов автоматического создания версий

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/auto-versioning.log"
CRON_LOG="$SCRIPT_DIR/cron-auto-versioning.log"

echo "📋 Логи автоматического создания версий"
echo "======================================="

if [ -f "$LOG_FILE" ]; then
    echo "📄 Основной лог ($LOG_FILE):"
    echo "----------------------------------------"
    tail -20 "$LOG_FILE"
    echo ""
else
    echo "ℹ️  Основной лог не найден"
fi

if [ -f "$CRON_LOG" ]; then
    echo "📄 Cron лог ($CRON_LOG):"
    echo "----------------------------------------"
    tail -20 "$CRON_LOG"
else
    echo "ℹ️  Cron лог не найден"
fi
EOF

chmod +x "$SCRIPT_DIR/view-auto-logs.sh"

echo "✅ Скрипт просмотра логов создан: view-auto-logs.sh"

# Показываем текущие cron-задачи
echo ""
echo "📋 Текущие cron-задачи:"
crontab -l | grep auto-versioning || echo "ℹ️  Cron-задачи не найдены"

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📝 Доступные команды:"
echo "  ./run-auto-versioning.sh    - Запустить создание версии вручную"
echo "  ./stop-auto-versioning.sh   - Остановить автоматизацию"
echo "  ./view-auto-logs.sh         - Просмотреть логи"
echo "  crontab -l                  - Просмотреть cron-задачи"
echo ""
echo "⏰ Автоматическое создание версий будет запускаться каждый час"
echo "📁 Логи сохраняются в:"
echo "   - $LOG_FILE (основной лог)"
echo "   - $CRON_LOG (cron лог)"

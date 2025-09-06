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

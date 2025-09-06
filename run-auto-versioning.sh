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

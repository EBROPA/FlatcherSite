#!/bin/bash

# Скрипт для управления откатами к предыдущим версиям
# Позволяет легко откатиться к любой версии на GitHub

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/rollback.log"

# Функция логирования
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a $LOG_FILE
}

# Функция показа справки
show_help() {
    echo "🔄 Менеджер откатов FlatcherSite"
    echo ""
    echo "Использование: ./rollback-manager.sh [команда] [версия]"
    echo ""
    echo "Команды:"
    echo "  list                    - Показать все доступные версии для отката"
    echo "  rollback [версия]       - Откатиться к указанной версии"
    echo "  preview [версия]        - Предварительный просмотр версии"
    echo "  restore [версия]        - Восстановить версию из бэкапа"
    echo "  status                  - Показать текущий статус"
    echo "  help                    - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  ./rollback-manager.sh list"
    echo "  ./rollback-manager.sh rollback v1.1.0"
    echo "  ./rollback-manager.sh preview auto-v1.1.1-20241201_143022"
    echo "  ./rollback-manager.sh restore v1.1.1"
}

# Функция получения списка версий
list_versions() {
    echo "📋 Доступные версии для отката:"
    echo ""
    
    # Получаем все теги с GitHub
    echo "🏷️  Стабильные версии (теги):"
    git fetch --tags
    git tag -l | sort -V | while read tag; do
        local commit_date=$(git log -1 --format="%cd" --date=short $tag)
        echo "  - $tag (создан: $commit_date)"
    done
    
    echo ""
    echo "🔄 Автоматические версии:"
    git tag -l | grep "auto-v" | sort -V | tail -10 | while read tag; do
        local commit_date=$(git log -1 --format="%cd" --date=short $tag)
        echo "  - $tag (создан: $commit_date)"
    done
    
    echo ""
    echo "💾 Локальные бэкапы:"
    if [ -d "./version-backups" ]; then
        ls -1 ./version-backups/*.tar.gz 2>/dev/null | head -5 | while read backup; do
            local filename=$(basename "$backup")
            local size=$(du -h "$backup" | cut -f1)
            echo "  - $filename ($size)"
        done
    else
        echo "  ℹ️  Папка бэкапов не найдена"
    fi
    
    echo ""
    echo "📍 Текущая версия: $(git describe --tags --always)"
}

# Функция отката к версии
rollback_to_version() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo "❌ Ошибка: Укажите версию для отката"
        echo "Пример: ./rollback-manager.sh rollback v1.1.0"
        exit 1
    fi
    
    log_message "🔄 Начинаем откат к версии: $version"
    
    # Проверяем, существует ли тег
    if ! git tag -l | grep -q "^$version$"; then
        echo "❌ Ошибка: Тег $version не найден"
        echo "Доступные теги:"
        git tag -l
        exit 1
    fi
    
    # Создаем бэкап текущего состояния
    local current_backup="rollback-backup-$(date +%Y%m%d_%H%M%S).tar.gz"
    log_message "💾 Создаем бэкап текущего состояния: $current_backup"
    tar -czf "$current_backup" --exclude='.git' --exclude='node_modules' .
    
    # Создаем ветку для отката
    local rollback_branch="rollback-to-$version"
    log_message "🌿 Создаем ветку для отката: $rollback_branch"
    
    # Переключаемся на тег и создаем ветку
    git checkout $version
    git checkout -b $rollback_branch
    
    # Обновляем package.json
    local version_number=${version#v}
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$version_number\"/" package.json
    
    # Коммитим изменения
    git add package.json
    git commit -m "Rollback to version $version"
    
    log_message "✅ Откат к версии $version завершен"
    echo ""
    echo "🎉 Откат успешно выполнен!"
    echo "📍 Текущая ветка: $rollback_branch"
    echo "🏷️  Версия: $version"
    echo "💾 Бэкап сохранен: $current_backup"
    echo ""
    echo "📝 Следующие шаги:"
    echo "  1. Проверьте работоспособность: npm run dev"
    echo "  2. Если все в порядке, отправьте ветку: git push origin $rollback_branch"
    echo "  3. Создайте Pull Request для слияния с main"
}

# Функция предварительного просмотра версии
preview_version() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo "❌ Ошибка: Укажите версию для просмотра"
        echo "Пример: ./rollback-manager.sh preview v1.1.0"
        exit 1
    fi
    
    log_message "👀 Предварительный просмотр версии: $version"
    
    # Проверяем, существует ли тег
    if ! git tag -l | grep -q "^$version$"; then
        echo "❌ Ошибка: Тег $version не найден"
        exit 1
    fi
    
    echo "📋 Информация о версии $version:"
    echo "----------------------------------------"
    
    # Показываем информацию о коммите
    echo "📝 Коммит:"
    git show --oneline -s $version
    
    echo ""
    echo "📅 Дата создания:"
    git log -1 --format="%cd" --date=long $version
    
    echo ""
    echo "📄 Изменения в этой версии:"
    git show --stat $version
    
    echo ""
    echo "🔍 Содержимое package.json:"
    git show $version:package.json | grep '"version"'
    
    echo ""
    echo "📁 Основные файлы:"
    git show --name-only $version | head -10
}

# Функция восстановления из бэкапа
restore_from_backup() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo "❌ Ошибка: Укажите версию для восстановления"
        echo "Пример: ./rollback-manager.sh restore v1.1.1"
        exit 1
    fi
    
    log_message "💾 Восстановление версии из бэкапа: $version"
    
    # Ищем бэкап
    local backup_file=""
    if [ -d "./version-backups" ]; then
        backup_file=$(find ./version-backups -name "*${version}*.tar.gz" | head -1)
    fi
    
    if [ -z "$backup_file" ]; then
        echo "❌ Ошибка: Бэкап для версии $version не найден"
        echo "Доступные бэкапы:"
        ls -1 ./version-backups/*.tar.gz 2>/dev/null || echo "  Бэкапы не найдены"
        exit 1
    fi
    
    echo "📦 Найден бэкап: $backup_file"
    
    # Создаем бэкап текущего состояния
    local current_backup="restore-backup-$(date +%Y%m%d_%H%M%S).tar.gz"
    log_message "💾 Создаем бэкап текущего состояния: $current_backup"
    tar -czf "$current_backup" --exclude='.git' --exclude='node_modules' .
    
    # Создаем временную папку для восстановления
    local temp_dir="./temp-restore-$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$temp_dir"
    
    # Распаковываем бэкап
    log_message "📦 Распаковываем бэкап..."
    tar -xzf "$backup_file" -C "$temp_dir"
    
    # Копируем файлы (исключая .git и node_modules)
    log_message "📋 Копируем файлы..."
    rsync -av --exclude='.git' --exclude='node_modules' --exclude='temp-restore-*' "$temp_dir/" ./
    
    # Очищаем временную папку
    rm -rf "$temp_dir"
    
    log_message "✅ Восстановление завершено"
    echo ""
    echo "🎉 Восстановление успешно выполнено!"
    echo "📦 Источник: $backup_file"
    echo "💾 Бэкап текущего состояния: $current_backup"
    echo ""
    echo "📝 Следующие шаги:"
    echo "  1. Проверьте работоспособность: npm run dev"
    echo "  2. Зафиксируйте изменения: git add . && git commit -m 'Restore from backup'"
}

# Функция показа статуса
show_status() {
    echo "📊 Статус откатов:"
    echo ""
    echo "📍 Текущая ветка: $(git branch --show-current)"
    echo "🏷️  Текущий тег: $(git describe --tags --always)"
    echo "📦 Версия в package.json: $(grep '"version"' package.json | cut -d'"' -f4)"
    echo ""
    echo "📋 Последние операции отката:"
    if [ -f "$LOG_FILE" ]; then
        tail -10 "$LOG_FILE"
    else
        echo "  ℹ️  Лог откатов пуст"
    fi
}

# Основная логика
case "$1" in
    "list")
        list_versions
        ;;
    "rollback")
        rollback_to_version "$2"
        ;;
    "preview")
        preview_version "$2"
        ;;
    "restore")
        restore_from_backup "$2"
        ;;
    "status")
        show_status
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo "❌ Неизвестная команда: $1"
        echo "Используйте './rollback-manager.sh help' для справки"
        exit 1
        ;;
esac

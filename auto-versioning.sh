#!/bin/bash

# Скрипт автоматического создания версий на GitHub
# Запускается каждый час через cron

# Конфигурация
PROJECT_NAME="FlatcherSite"
GITHUB_REPO="your-username/FlatcherSite"  # Замените на ваш репозиторий
BACKUP_DIR="./auto-backups"
LOG_FILE="./auto-versioning.log"

# Создаем папки если их нет
mkdir -p $BACKUP_DIR

# Функция логирования
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a $LOG_FILE
}

# Функция проверки изменений
check_for_changes() {
    log_message "🔍 Проверяем изменения в репозитории..."
    
    # Получаем последние изменения с удаленного репозитория
    git fetch origin
    
    # Проверяем, есть ли новые коммиты
    local local_commit=$(git rev-parse HEAD)
    local remote_commit=$(git rev-parse origin/main)
    
    if [ "$local_commit" != "$remote_commit" ]; then
        log_message "✅ Обнаружены новые изменения"
        return 0
    else
        log_message "ℹ️  Изменений не обнаружено"
        return 1
    fi
}

# Функция создания автоматической версии
create_auto_version() {
    local timestamp=$(date '+%Y%m%d_%H%M')
    local auto_version="auto-v1.1.1-$timestamp"
    
    log_message "🏷️  Создаем автоматическую версию: $auto_version"
    
    # Переключаемся на основную ветку
    git checkout main
    
    # Получаем последние изменения
    git pull origin main
    
    # Создаем тег
    git tag $auto_version
    
    # Отправляем тег на GitHub
    git push origin $auto_version
    
    log_message "✅ Автоматическая версия $auto_version создана и отправлена на GitHub"
    
    # Создаем бэкап этой версии
    create_auto_backup $auto_version
    
    return $auto_version
}

# Функция создания автоматического бэкапа
create_auto_backup() {
    local version=$1
    local timestamp=$(date '+%Y%m%d_%H%M')
    
    log_message "💾 Создаем автоматический бэкап версии $version"
    
    # Создаем архив версии
    git archive --format=tar --prefix="$version/" $version | \
    gzip > "$BACKUP_DIR/${version}_${timestamp}.tar.gz"
    
    log_message "✅ Бэкап создан: ${version}_${timestamp}.tar.gz"
}

# Функция очистки старых бэкапов (оставляем только последние 24)
cleanup_old_backups() {
    log_message "🧹 Очищаем старые автоматические бэкапы..."
    
    # Удаляем старые файлы, оставляя только последние 24
    ls -t $BACKUP_DIR/auto-v*.tar.gz 2>/dev/null | tail -n +25 | xargs -r rm
    
    log_message "✅ Очистка завершена"
}

# Функция создания релизной версии
create_release_version() {
    local current_version=$(grep '"version"' package.json | cut -d'"' -f4)
    local new_version="v$current_version"
    
    log_message "🚀 Создаем релизную версию: $new_version"
    
    # Создаем тег
    git tag $new_version
    
    # Отправляем тег на GitHub
    git push origin $new_version
    
    log_message "✅ Релизная версия $new_version создана"
    
    # Обновляем версию в package.json для следующего релиза
    update_package_version
}

# Функция обновления версии в package.json
update_package_version() {
    local current_version=$(grep '"version"' package.json | cut -d'"' -f4)
    local major=$(echo $current_version | cut -d'.' -f1)
    local minor=$(echo $current_version | cut -d'.' -f2)
    local patch=$(echo $current_version | cut -d'.' -f3)
    
    # Увеличиваем patch версию
    local new_patch=$((patch + 1))
    local new_version="$major.$minor.$new_patch"
    
    # Обновляем package.json
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json
    
    # Коммитим изменения
    git add package.json
    git commit -m "Auto-increment version to $new_version"
    git push origin main
    
    log_message "📝 Версия в package.json обновлена до $new_version"
}

# Функция создания GitHub Release
create_github_release() {
    local version=$1
    local release_notes="## Автоматический релиз $version\n\n- Создан автоматически\n- Время создания: $(date)\n- Коммит: $(git rev-parse --short HEAD)"
    
    log_message "📦 Создаем GitHub Release для версии $version"
    
    # Используем GitHub CLI для создания релиза
    if command -v gh &> /dev/null; then
        gh release create $version --title "Release $version" --notes "$release_notes"
        log_message "✅ GitHub Release создан"
    else
        log_message "⚠️  GitHub CLI не установлен, релиз не создан"
    fi
}

# Основная функция
main() {
    log_message "🚀 Запуск автоматического создания версий"
    
    # Проверяем, что мы в git репозитории
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_message "❌ Ошибка: Не находимся в git репозитории"
        exit 1
    fi
    
    # Проверяем изменения
    if check_for_changes; then
        # Создаем автоматическую версию
        auto_version=$(create_auto_version)
        
        # Создаем GitHub Release
        create_github_release $auto_version
        
        # Очищаем старые бэкапы
        cleanup_old_backups
        
        log_message "🎉 Автоматическое создание версии завершено успешно"
    else
        log_message "ℹ️  Изменений нет, версия не создается"
    fi
    
    log_message "✅ Скрипт завершен"
}

# Запуск основной функции
main "$@"

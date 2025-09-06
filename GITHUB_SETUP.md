# 🔐 Настройка аутентификации GitHub

## Вариант 1: SSH ключ (рекомендуется)

### 1. SSH ключ уже создан
SSH ключ для проекта FlatcherSite уже создан:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIId3SwCzmgP/K/d3XMZs+n5Y5o5nU+ejmJSVwcVleiXA seretyy029@gmail.com
```

### 2. Добавьте ключ в GitHub
1. Перейдите на https://github.com/settings/keys
2. Нажмите "New SSH key"
3. Заполните форму:
   - **Title:** `FlatcherSite MacBook`
   - **Key type:** `Authentication Key`
   - **Key:** Вставьте ключ выше
4. Нажмите "Add SSH key"

### 3. Переключитесь на SSH
```bash
git remote set-url origin git@github.com:EBROPA/FlatcherSite.git
```

### 4. Проверьте подключение
```bash
ssh -T git@github.com
```

## Вариант 2: Personal Access Token

### 1. Создайте токен
1. Перейдите на https://github.com/settings/tokens
2. Нажмите "Generate new token (classic)"
3. Заполните форму:
   - **Note:** `FlatcherSite Token`
   - **Expiration:** `90 days` (или другой срок)
   - **Scopes:** выберите `repo` (полный доступ к репозиториям)
4. Нажмите "Generate token"
5. **Скопируйте токен** (он показывается только один раз!)

### 2. Используйте токен
При push/pull используйте токен как пароль:
```bash
git push -u origin main
# Username: EBROPA
# Password: [вставьте ваш токен]
```

## Проверка настройки

После настройки выполните:
```bash
# Проверить удаленный репозиторий
git remote -v

# Отправить код на GitHub
git push -u origin main

# Отправить теги
git push origin v1.0.0
```

## Полезные команды

```bash
# Переключиться на SSH
git remote set-url origin git@github.com:EBROPA/FlatcherSite.git

# Переключиться на HTTPS
git remote set-url origin https://github.com/EBROPA/FlatcherSite.git

# Проверить подключение SSH
ssh -T git@github.com

# Показать SSH ключи
ls -la ~/.ssh/
cat ~/.ssh/github_flatcher.pub
```

## После успешной настройки

1. **Отправьте код:**
   ```bash
   git push -u origin main
   git push origin v1.0.0
   ```

2. **Проверьте репозиторий:**
   - Перейдите на https://github.com/EBROPA/FlatcherSite
   - Убедитесь, что все файлы загружены

3. **Настройте GitHub Pages (опционально):**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)
   - Нажмите Save

---

**💡 Совет:** Рекомендуется использовать SSH ключи для большей безопасности и удобства.

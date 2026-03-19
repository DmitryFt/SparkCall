# 📱 Тестовое задание для React Native разработчика

---

## 📂 Структура проекта

```bash
src
├── app/                # Инициализация              
│
├── navigation/         # Навигация (стек, табы и др.)
│
├── screens/            # UI-экраны
│   ├── auth/          
│   ├── join/          
│   └── call/
│
├── services/           # сервисы (API, бизнес-логика, хуки)
│   ├── auth/           # методы для работы с логикой авторизации
│   └── other/          # методы других модулей
│
├── stores/             # in-memory и persist хранение данных (MMKV, expo-secure-storage)  
│   ├── auth/           # хранение данных модуля авторизация
│   └── other/          # данные других модулей
│
└── shared/             # Общие модули
    ├── api-client.ts   	# axios api клиент
    ├── api-provider.tsx	# Провайдер API
	├── utils/              # Утилиты
	├── hooks/              # Хуки
    ├── config/theme/       # Токены цветов и стилей
	├── config/unistyles/   # Инициализация react-native-unistyles
    └── ui/             	# UI-компоненты
        ├── atoms/      		# Базовые элементы
        ├── molecules/  		# Составные компоненты
        └── organisms/  		# Крупные блоки (пока пусто)
```

---

# ⚙️ Запуск проекта

#### Установка зависимостей
```bash
yarn install
```

#### Сборка `android` проекта
```bash
yarn android:interactive    # интерактивный режим сборки (с возможностью выбора варианта сборки и устройства)
yarn android:debug          # сборка debug варианта
yarn android:release        # сборка release варианта
```

#### Сборка `ios` проекта
```bash
yarn ios:interactive        # интерактивный режим сборки (с возможностью выбора варианта сборки и устройства)
yarn ios:debug              # сборка debug варианта
yarn ios:release            # сборка release варианта

yarn ios:pod-install        # обновление pods для ios
```

#### Запуск dev-сервера
```bash
yarn packager:start
yarn packager:start-fresh   # с очисткой кеша Metro & Watchman
```

---

# ⚙️ Качество кода & тесты
```bash
yarn lint:eslint           # lint проверка кода
yarn lint:eslint:fix       # автоисправление lint-ошибок
yarn lint:types            # проверка TypeScript-типов
yarn format                # автоформатирование Prettier
yarn format:check          # проверка форматирования без изменений
yarn test                  # запуск unit-тестов
yarn test:ci               # тесты + coverage для CI
```

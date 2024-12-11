# Multitool-Extension
Multitool Extension for VS code

### Описание функциональности
1. **Анализ ошибок в рабочем пространстве**:
   - Считывает диагностические данные об ошибках в открытых файлах.
   - Отображает количество ошибок через веб-интерфейс (Webview).

2. **Эмоциональная индикация проблем**:
   - Использует эмодзи для представления эмоционального состояния в зависимости от количества ошибок.

3. **Музыкальная поддержка**:
   - Воспроизводит звуки для мотивации в зависимости от количества проблем.
   - Добавлена кнопка для остановки музыки.

4. **Встроенный таймер**:
   - Реализован Pomodoro-таймер для управления временем работы.

5. **Поиск информации**:
   - Встроены команды для поиска выделенного текста в Google и на cppreference.com.

### Структура плагина
- **`package.json`**:
  - Описывает команды плагина, точки активации и зависимости.
- **Код плагина (`src/extension.ts`)**:
  - Основная логика работы: регистрация команд, взаимодействие с Webview и API VS Code.
- **Модуль воспроизведения звуков**:
  - Используется библиотека `play-sound` для воспроизведения аудио.
- **Webview-интерфейсы**:
  - HTML и JavaScript для отображения таймера и статуса ошибок.

### Описание функций

#### `countErrors()`
Подсчитывает количество ошибок в текущем рабочем пространстве:
- Использует диагностику файлов.
- Возвращает общее количество ошибок.

Пример кода:
```typescript
function countErrors(): number {
    const diagnostics = vscode.languages.getDiagnostics();
    let errorCount = 0;

    diagnostics.forEach(([uri, diags]) => {
        errorCount += diags.filter(diag => diag.severity === vscode.DiagnosticSeverity.Error).length;
    });

    return errorCount;
}
```

#### `playAgain(song: string)`
Воспроизводит указанную аудиодорожку:
- Прерывает воспроизведение других треков.
- Использует библиотеку `play-sound`.

Пример кода:
```typescript
function playAgain(song: string) {
    stopAllSounds();

    playlist[song] = player.play(paths[song], (err: any) => {
        if (err) {
            console.log(`Could not play sound: ${err}`);
        } else {
            console.log(`Playing sound: ${paths[song]}`);
        }
    });
}
```

#### `stopAllSounds(song: string = "undefined")`
Останавливает воспроизведение всех треков, кроме указанного (если передан):
- Удаляет ссылки на объекты аудиодорожек.

Пример кода:
```typescript
function stopAllSounds(song: string = "undefined") {
    for (const name of Object.keys(playlist)) {
        if (song === name) {
            continue;
        }
        const audio = playlist[name];
        if (audio) {
            audio.kill();
        }
        playlist[name] = null;
    }
}
```

#### `keepPlayingOrStartPlaying(song: string)`
Запускает воспроизведение указанного трека, если он не воспроизводится:
- Останавливает другие треки перед началом.

Пример кода:
```typescript
function keepPlayingOrStartPlaying(song: string) {
    const audio = playlist[song];
    stopAllSounds(song);
    if (!audio) {
        playlist[song] = player.play(paths[song], (err: any) => {
            if (err) {
                console.log(`Could not play sound: ${err}`);
            }
        });
    }
}
```

#### `emoji(countProblems: number): string`
Возвращает эмодзи, соответствующий количеству проблем:
- Воспроизводит музыкальный трек в зависимости от количества ошибок.
- Поддерживает различные градации состояния.

Пример кода:
```typescript
function emoji(countProblems: number): string {
    if (countProblems === 52) {
        keepPlayingOrStartPlaying("52");
        return "52";
    }
    stopSound("52");

    if (countProblems >= 7) {
        keepPlayingOrStartPlaying("Oguzok");
        return "💀";
    }
    stopSound("Oguzok");

    if (countProblems <= 0) {
        return "😊";
    }
    // Other emoji logic...
}
```

#### `startTimer(updateWebview: () => void)`
Запускает таймер:
- Уменьшает значение таймера каждую секунду.
- Включает музыкальный трек после окончания времени.

Пример кода:
```typescript
function startTimer(updateWebview: () => void) {
    if (isRunning) return;
    isRunning = true;

    timerInterval = setInterval(() => {
        currentTimer--;
        if (currentTimer < 0) {
            currentTimer = 5 * 60;
            playAgain("ComeAsYouAre");
            updateWebview();
            return;
        }
        updateWebview();
    }, 1000);
}
```



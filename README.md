
# Multitool Extension.

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


### Основные функции
#### Подсчет ошибок
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







## Release Notes

### 1.0.0

Realize Extension

---


**Enjoy!**

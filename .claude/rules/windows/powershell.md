---
paths:
  - "**/*.ps1"
---

# PowerShell

Как устроены настройка OBS и обновлятор - `docs/internals/installer.md` и `docs/internals/updater.md`, читаем перед правкой этих частей.

- **Одна функция - один файл** `Глагол-Существительное.ps1` (одобренные глаголы PowerShell), переменные - camelCase. Правка текста (`Add-BridgeScript`, `Add-BrowserDock`, `Set-IniValue`, `Enable-WebSocketServer`) - чистые функции «текст на входе - текст на выходе», файлы читает и пишет только `Get-ObsChanges` и `Save-ObsChanges`.
- **Файлы OBS не переписываем целиком.** PowerShell 5.1 при `ConvertFrom-Json`/`ConvertTo-Json` меняет числа, экранирование и вложенность. `Read-JsonValue` разбирает JSON с позициями, и правка вставляет или заменяет только нужный кусок (элемент `scripts-tool`, значение `server_enabled`); ini - только одна строка. Остальной файл остаётся байт в байт прежним, BOM и переводы строк сохраняются.
- **`PSModulePath` сбрасываем в начале точек входа** (`configure-obs.ps1`, `installer/tests/run-tests.ps1`) на пути Windows PowerShell: если `powershell.exe` запущен из PowerShell 7 (терминал, шаг GitHub Actions по умолчанию), он наследует модули седьмой версии и теряет команды вроде `Get-FileHash`.
- **Константы - в `consts.ps1` своей программы**: `installer/ConfigureObs/consts.ps1` и `installer/updater/UpdateWidget/consts.ps1` (`$script:Имя = ...`). Оба лежат рядом с функциями и подключаются тем же `Get-ChildItem *.ps1`, установщик копирует их вместе с функциями. В файлах функций `$script:`-констант нет; переменная состояния (`$script:ConfigureLogPath`) - не константа и остаётся у своей функции.
- **`$PSScriptRoot` не используем в значениях параметров по умолчанию**: при запуске через `-File` PowerShell 5.1 там его не заполняет. Папку скрипта берём в теле: `Split-Path -Parent $MyInvocation.MyCommand.Path`.
- **Внешние программы при `$ErrorActionPreference = 'Stop'`** не перенаправляем через `2>&1`: в PowerShell 5.1 их вывод в поток ошибок тогда становится исключением. Внутри функции, которая вызывает программу, ставим `$ErrorActionPreference = 'Continue'`, поток ошибок отбрасываем (`2>$null`), решение принимаем по `$LASTEXITCODE`.
- **Файлы `.ps1` - только ASCII**: PowerShell 5.1 читает файл без BOM в кодировке ANSI, и кириллица в нём ломается. Тексты для пользователя показывает установщик, а не скрипт.

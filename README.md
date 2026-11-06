# clawd-buddy

Пиксельный жук Клауд живёт над полем ввода в приложении Claude: гуляет по ночной сцене и реагирует на то, что делает Claude.

A pixel Clawd that lives above the prompt box in the Claude desktop app. It wanders around a night scene and reacts to what Claude is doing.

## Что он делает

- **Без дела:** гуляет, оглядывается, прыгает, машет, танцует и спит.
- **Claude думает:** ходит туда-сюда с точками над головой.
- **Claude работает:** рядом появляются терминал, лист с кодом, лупа, глобус или маленький помощник, в зависимости от инструмента.
- **Claude ждёт ответа:** машет, над головой знак вопроса.
- **Ход закончен:** прыгает с сердечком и танцует. Если ход прервали, грустит, если случилась ошибка, трясётся.

Полоску можно свернуть кнопкой `[-]` рядом с ней.

## Установка

В приложении Claude: нажми + рядом с полем ввода, затем Plugins, Add marketplace с `RovelLabs/clawd-buddy`, затем Add plugin.

В терминальной сессии Claude Code:

```
/plugin install clawd-buddy --marketplace RovelLabs/clawd-buddy
```

Из командной строки:

```
claude plugin install clawd-buddy --marketplace RovelLabs/clawd-buddy
```

## Требования

Жук рисуется только в десктопном приложении Claude, в других интерфейсах мод ничего не показывает. Мод использует раннюю версию API плагинов, поэтому обновление приложения может сдвинуть сцену.

## Что мод трогает

Мод только рисует полоску и смотрит на названия инструментов, чтобы выбрать анимацию. Он никуда ничего не отправляет, не читает файлы и не меняет работу инструментов.

## Лицензия

MIT. Это неофициальный фанатский мод, он не связан с Anthropic. Claude и Clawd принадлежат Anthropic.

This is an unofficial fan mod, not affiliated with Anthropic. Claude and Clawd belong to Anthropic.

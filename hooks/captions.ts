import type { MoodKind } from '../types'

type Lines = Record<Exclude<MoodKind, 'idle'>, string>

const EN: Lines = {
  think: 'thinking…',
  bash: 'running commands',
  write: 'writing code',
  read: 'reading files',
  web: 'browsing the web',
  agent: 'calling for backup',
  ask: 'waiting for you',
  done: 'all done!',
  sad: 'oh well…',
  oops: 'oops, something broke',
}

const LINES: Record<string, Lines> = {
  en: EN,
  ru: {
    think: 'думаю…',
    bash: 'гоняю команды',
    write: 'пишу код',
    read: 'читаю файлы',
    web: 'лезу в интернет',
    agent: 'зову подмогу',
    ask: 'жду твой ответ',
    done: 'готово!',
    sad: 'ладно…',
    oops: 'ой, что-то сломалось',
  },
  uk: {
    think: 'думаю…',
    bash: 'запускаю команди',
    write: 'пишу код',
    read: 'читаю файли',
    web: 'шукаю в інтернеті',
    agent: 'кличу підмогу',
    ask: 'чекаю на відповідь',
    done: 'готово!',
    sad: 'ну гаразд…',
    oops: 'ой, щось зламалося',
  },
  de: {
    think: 'denke nach…',
    bash: 'führe Befehle aus',
    write: 'schreibe Code',
    read: 'lese Dateien',
    web: 'suche im Web',
    agent: 'hole Verstärkung',
    ask: 'warte auf dich',
    done: 'fertig!',
    sad: 'na gut…',
    oops: 'hoppla, etwas ging schief',
  },
  es: {
    think: 'pensando…',
    bash: 'ejecutando comandos',
    write: 'escribiendo código',
    read: 'leyendo archivos',
    web: 'buscando en la web',
    agent: 'pidiendo refuerzos',
    ask: 'esperando tu respuesta',
    done: '¡listo!',
    sad: 'bueno…',
    oops: 'ups, algo se rompió',
  },
  fr: {
    think: 'je réfléchis…',
    bash: 'je lance des commandes',
    write: "j'écris du code",
    read: 'je lis les fichiers',
    web: 'je cherche sur le web',
    agent: "j'appelle des renforts",
    ask: "j'attends ta réponse",
    done: 'terminé !',
    sad: 'tant pis…',
    oops: 'oups, quelque chose a cassé',
  },
  it: {
    think: 'sto pensando…',
    bash: 'eseguo comandi',
    write: 'scrivo codice',
    read: 'leggo i file',
    web: 'cerco sul web',
    agent: 'chiamo rinforzi',
    ask: 'aspetto la tua risposta',
    done: 'fatto!',
    sad: 'pazienza…',
    oops: 'ops, qualcosa si è rotto',
  },
  pt: {
    think: 'pensando…',
    bash: 'executando comandos',
    write: 'escrevendo código',
    read: 'lendo arquivos',
    web: 'pesquisando na web',
    agent: 'chamando reforços',
    ask: 'esperando sua resposta',
    done: 'pronto!',
    sad: 'tudo bem…',
    oops: 'opa, algo quebrou',
  },
  pl: {
    think: 'myślę…',
    bash: 'uruchamiam polecenia',
    write: 'piszę kod',
    read: 'czytam pliki',
    web: 'szukam w sieci',
    agent: 'wzywam posiłki',
    ask: 'czekam na odpowiedź',
    done: 'gotowe!',
    sad: 'no trudno…',
    oops: 'ups, coś się zepsuło',
  },
  tr: {
    think: 'düşünüyorum…',
    bash: 'komut çalıştırıyorum',
    write: 'kod yazıyorum',
    read: 'dosya okuyorum',
    web: "web'de arıyorum",
    agent: 'yardım çağırıyorum',
    ask: 'cevabını bekliyorum',
    done: 'bitti!',
    sad: 'peki…',
    oops: 'eyvah, bir şey bozuldu',
  },
  ja: {
    think: '考え中…',
    bash: 'コマンド実行中',
    write: 'コードを書いています',
    read: 'ファイルを読んでいます',
    web: 'ウェブを検索中',
    agent: '応援を呼んでいます',
    ask: 'お返事を待っています',
    done: 'できた！',
    sad: 'しかたない…',
    oops: 'おっと、何か壊れた',
  },
  ko: {
    think: '생각 중…',
    bash: '명령 실행 중',
    write: '코드 작성 중',
    read: '파일 읽는 중',
    web: '웹 검색 중',
    agent: '지원 요청 중',
    ask: '답변 기다리는 중',
    done: '완료!',
    sad: '어쩔 수 없지…',
    oops: '앗, 뭔가 고장 났어요',
  },
  zh: {
    think: '思考中…',
    bash: '正在运行命令',
    write: '正在写代码',
    read: '正在读文件',
    web: '正在上网搜索',
    agent: '正在呼叫支援',
    ask: '等你回复',
    done: '完成！',
    sad: '好吧…',
    oops: '哎呀，出错了',
  },
  hi: {
    think: 'सोच रहा हूँ…',
    bash: 'कमांड चला रहा हूँ',
    write: 'कोड लिख रहा हूँ',
    read: 'फ़ाइलें पढ़ रहा हूँ',
    web: 'वेब पर खोज रहा हूँ',
    agent: 'मदद बुला रहा हूँ',
    ask: 'आपके जवाब का इंतज़ार',
    done: 'हो गया!',
    sad: 'कोई बात नहीं…',
    oops: 'अरे, कुछ टूट गया',
  },
  id: {
    think: 'sedang berpikir…',
    bash: 'menjalankan perintah',
    write: 'menulis kode',
    read: 'membaca berkas',
    web: 'mencari di web',
    agent: 'memanggil bantuan',
    ask: 'menunggu jawabanmu',
    done: 'selesai!',
    sad: 'ya sudah…',
    oops: 'aduh, ada yang rusak',
  },
}

export const LANGUAGES = Object.keys(LINES)

// 'ru', 'ru-RU' and 'ru_RU.UTF-8' all name Russian; anything unknown is English.
export function languageOf(locale: string | undefined) {
  const language = (locale ?? '').toLowerCase().split(/[-_.]/)[0] ?? ''

  return language in LINES ? language : 'en'
}

// The binary sits at <app data>/claude-code/<version>/..., beside config.json.
export function appConfigPath(binary: string | undefined) {
  const folder = binary?.match(/^(.*)[\\/]claude-code[\\/]/)?.[1]

  return folder === undefined ? undefined : `${folder}/config.json`
}

export function captionFor(kind: MoodKind, language: string) {
  if (kind === 'idle') return ''

  return (LINES[language] ?? EN)[kind]
}

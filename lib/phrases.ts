// Seção Idiomas do METANOIA — frases do dia a dia em PT / EN / RU,
// com tradução e pronúncia (foneta simplificada em pt-BR). Comprehensible
// input: sempre com o sentido ao lado. Offline, curado.

export interface Phrase {
  pt: string;
  en: string;
  enPron: string; // pronúncia aproximada em pt-BR
  ru: string; // cirílico
  ruPron: string; // pronúncia aproximada em pt-BR
}

export interface PhraseTheme {
  id: string;
  label: string;
  emoji: string;
  phrases: Phrase[];
}

export const THEMES: PhraseTheme[] = [
  {
    id: "saudacoes",
    label: "Saudações",
    emoji: "👋",
    phrases: [
      { pt: "Olá / Oi", en: "Hello / Hi", enPron: "rê-lôu / rái", ru: "Привет", ruPron: "Privyét" },
      { pt: "Bom dia", en: "Good morning", enPron: "gud mór-ning", ru: "Доброе утро", ruPron: "Dóbraie útra" },
      { pt: "Boa noite", en: "Good night", enPron: "gud náit", ru: "Спокойной ночи", ruPron: "Spakóinai nóchi" },
      { pt: "Como vai você?", en: "How are you?", enPron: "ráu ar iú?", ru: "Как дела?", ruPron: "Kak dilá?" },
      { pt: "Prazer em conhecer", en: "Nice to meet you", enPron: "náis tchu mít iú", ru: "Приятно познакомиться", ruPron: "Priyátna paznakómitsa" },
      { pt: "Até logo / Tchau", en: "See you / Bye", enPron: "si iú / bái", ru: "До свидания / Пока", ruPron: "Da svidániya / Paká" },
    ],
  },
  {
    id: "cortesia",
    label: "Cortesia",
    emoji: "🙏",
    phrases: [
      { pt: "Por favor", en: "Please", enPron: "plíz", ru: "Пожалуйста", ruPron: "Pajálsta" },
      { pt: "Obrigado(a)", en: "Thank you", enPron: "ténk iú", ru: "Спасибо", ruPron: "Spasíba" },
      { pt: "De nada", en: "You're welcome", enPron: "iór uél-câm", ru: "Не за что", ruPron: "Nyé za shta" },
      { pt: "Desculpe", en: "Sorry / Excuse me", enPron: "só-ri / eks-kiúz mi", ru: "Извините", ruPron: "Izvinítie" },
      { pt: "Tudo bem", en: "It's okay", enPron: "its ôu-kéi", ru: "Всё хорошо", ruPron: "Vsió kharashó" },
      { pt: "Sim / Não", en: "Yes / No", enPron: "iés / nôu", ru: "Да / Нет", ruPron: "Da / Nyét" },
    ],
  },
  {
    id: "cotidiano",
    label: "No dia a dia",
    emoji: "💬",
    phrases: [
      { pt: "Eu não entendi", en: "I didn't understand", enPron: "ái dí-dent ân-der-sténd", ru: "Я не понял", ruPron: "Ya ni pónial" },
      { pt: "Pode repetir?", en: "Can you repeat?", enPron: "kén iú ri-pít?", ru: "Можете повторить?", ruPron: "Mózhite paftarít?" },
      { pt: "Fale mais devagar", en: "Speak more slowly", enPron: "spík mór slôu-li", ru: "Говорите медленнее", ruPron: "Gavaríte myédlinnie" },
      { pt: "O que significa isso?", en: "What does that mean?", enPron: "uót dâz dét mín?", ru: "Что это значит?", ruPron: "Shto éta znáchit?" },
      { pt: "Quanto custa?", en: "How much is it?", enPron: "ráu match iz it?", ru: "Сколько это стоит?", ruPron: "Skólka éta stóit?" },
      { pt: "Onde fica o banheiro?", en: "Where is the bathroom?", enPron: "uér iz dâ béth-rum?", ru: "Где туалет?", ruPron: "Gdye tualyét?" },
    ],
  },
  {
    id: "sobre-mim",
    label: "Sobre mim",
    emoji: "🙋",
    phrases: [
      { pt: "Meu nome é...", en: "My name is...", enPron: "mai néim iz...", ru: "Меня зовут...", ruPron: "Minyá zavút..." },
      { pt: "Eu sou do Brasil", en: "I'm from Brazil", enPron: "áim from bra-zíl", ru: "Я из Бразилии", ruPron: "Ya iz Brazílii" },
      { pt: "Eu estou aprendendo", en: "I'm learning", enPron: "áim lér-ning", ru: "Я учусь", ruPron: "Ya uchús" },
      { pt: "Ainda não falo bem", en: "I don't speak well yet", enPron: "ái dôunt spík uél iét", ru: "Я ещё плохо говорю", ruPron: "Ya ischó plókha gavarió" },
      { pt: "Eu gosto disto", en: "I like this", enPron: "ái láik dis", ru: "Мне это нравится", ruPron: "Mnye éta nrávitsa" },
      { pt: "Eu preciso de ajuda", en: "I need help", enPron: "ái níd rrélp", ru: "Мне нужна помощь", ruPron: "Mnye nuzhná pómashch" },
    ],
  },
  {
    id: "acao",
    label: "Ação & coragem",
    emoji: "🔥",
    phrases: [
      { pt: "Eu consigo fazer isso", en: "I can do this", enPron: "ái kén du dis", ru: "Я могу это сделать", ruPron: "Ya magú éta zdyélat" },
      { pt: "Um passo de cada vez", en: "One step at a time", enPron: "uân stép at a táim", ru: "Шаг за шагом", ruPron: "Shag za shágam" },
      { pt: "Hoje eu vou agir", en: "Today I will act", enPron: "tchu-déi ái uil ékt", ru: "Сегодня я буду действовать", ruPron: "Sivódnia ya búdu dyéistvavat" },
      { pt: "Sem medo", en: "No fear", enPron: "nôu fír", ru: "Без страха", ruPron: "Byez strákha" },
      { pt: "Nunca desista", en: "Never give up", enPron: "né-ver guiv âp", ru: "Никогда не сдавайся", ruPron: "Nikagdá ni sdaváisa" },
    ],
  },
];

export const ALL_PHRASES: Phrase[] = THEMES.flatMap((t) => t.phrases);

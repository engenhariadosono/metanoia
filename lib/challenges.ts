// Banco curado do app "METANOIA" — do grego μετάνοια, a transformação da mente.
// Ação imediata (coragem + prática) com perguntas de profundidade: PNL,
// psicanálise e psicologia ancoradas na Palavra. Offline, sem API.

export type Intensity = 1 | 2 | 3; // 1 leve · 2 médio · 3 corajoso
export type CategoryId =
  | "medo"
  | "social"
  | "adiado"
  | "desconforto"
  | "verdade"
  | "disciplina"
  | "corpo"
  | "espirito"
  | "trabalho"
  | "estudo"
  | "foco"
  | "dinheiro"
  | "mudanca"
  | "mestres";
export type Tradition = "biblia" | "estoico" | "livro" | "filosofo";

export interface Anchor {
  text: string;
  source: string;
  tradition: Tradition;
}

export interface Challenge {
  id: string;
  category: CategoryId;
  intensity: Intensity;
  action: string; // o que fazer AGORA — concreto e pequeno
  question: string; // reflexão profunda sobre a raiz (crença, medo, ganho oculto)
  anchor: Anchor;
}

export const CATEGORY_ORDER: CategoryId[] = [
  "medo",
  "verdade",
  "adiado",
  "social",
  "desconforto",
  "disciplina",
  "corpo",
  "espirito",
  "trabalho",
  "estudo",
  "foco",
  "mestres",
  "mudanca",
  "dinheiro",
];

export const CATEGORIES: Record<
  CategoryId,
  { label: string; emoji: string }
> = {
  medo: { label: "Encarar o medo", emoji: "🦁" },
  verdade: { label: "Encarar a verdade", emoji: "🔦" },
  adiado: { label: "O que você adia", emoji: "⏳" },
  social: { label: "Coragem social", emoji: "🗣️" },
  desconforto: { label: "Desconforto voluntário", emoji: "🧊" },
  disciplina: { label: "Quebrar o automático", emoji: "⚔️" },
  corpo: { label: "Corpo em movimento", emoji: "🏃" },
  espirito: { label: "Espírito", emoji: "🙏" },
  trabalho: { label: "Mãos à obra", emoji: "💼" },
  estudo: { label: "Mente que cresce", emoji: "📚" },
  foco: { label: "Foco essencial", emoji: "🎯" },
  mestres: { label: "Estratégias dos mestres", emoji: "🏛️" },
  mudanca: { label: "Abraçar a mudança", emoji: "🧭" },
  dinheiro: { label: "Mente e dinheiro", emoji: "💰" },
};

export const INTENSITY: Record<Intensity, { label: string; color: string }> = {
  1: { label: "Leve", color: "#4bbf7b" },
  2: { label: "Médio", color: "#e0a13a" },
  3: { label: "Corajoso", color: "#e2604a" },
};

// Âncoras (versículos e frases estoicas) são de domínio público.
export const CHALLENGES: Challenge[] = [
  // ---------- MEDO ----------
  {
    id: "medo-1",
    category: "medo",
    intensity: 2,
    action:
      "Escreva num papel o medo que mais te paralisa hoje. Nomeá-lo já começa a desarmá-lo.",
    question:
      "Se esse medo tem uma voz, de quem é o timbre dela — e desde quando você a confunde com a sua?",
    anchor: {
      text: "Sofremos mais na imaginação do que na realidade.",
      source: "Sêneca",
      tradition: "estoico",
    },
  },
  {
    id: "medo-2",
    category: "medo",
    intensity: 3,
    action:
      "Dê o primeiro passo, hoje, em direção àquilo que você evita por medo — mesmo pequeno e imperfeito.",
    question:
      "O que você teria de deixar de acreditar sobre si mesmo para dar esse passo agora?",
    anchor: {
      text: "Sê forte e corajoso; não temas, porque o Senhor teu Deus é contigo.",
      source: "Josué 1:9",
      tradition: "biblia",
    },
  },
  {
    id: "medo-3",
    category: "medo",
    intensity: 1,
    action:
      "Respire fundo 3 vezes e diga em voz alta: 'Eu posso encarar isto.' Depois faça a próxima coisa pequena.",
    question:
      "Entre o que te acontece e como você reage existe um espaço. Quem você escolhe ser dentro dele?",
    anchor: {
      text: "Deus não nos deu espírito de covardia, mas de poder, amor e equilíbrio.",
      source: "2 Timóteo 1:7",
      tradition: "biblia",
    },
  },
  {
    id: "medo-4",
    category: "medo",
    intensity: 2,
    action:
      "Descreva no papel o pior cenário do que você teme e como sobreviveria a ele. Tire o monstro do escuro.",
    question:
      "Que ganho secreto esse medo te oferece, que você ainda não quis admitir que aceita?",
    anchor: {
      text: "Não são as coisas que nos perturbam, mas as opiniões que temos delas.",
      source: "Epicteto",
      tradition: "estoico",
    },
  },
  {
    id: "medo-5",
    category: "medo",
    intensity: 3,
    action:
      "Faça agora aquilo que você espera 'se sentir pronto' para fazer. A prontidão nasce da ação, não antes dela.",
    question:
      "A espera por 'estar pronto' te protege do fracasso — ou de descobrir que você é capaz?",
    anchor: {
      text: "É porque não ousamos que as coisas são difíceis, não o contrário.",
      source: "Sêneca",
      tradition: "estoico",
    },
  },

  // ---------- VERDADE ----------
  {
    id: "verdade-1",
    category: "verdade",
    intensity: 3,
    action:
      "Escreva uma verdade sobre você que vem evitando admitir. Encará-la no papel é o começo da mudança.",
    question:
      "Qual verdade sobre você é tão pesada que você prefere carregar a mentira no lugar dela?",
    anchor: {
      text: "Conhecereis a verdade, e a verdade vos libertará.",
      source: "João 8:32",
      tradition: "biblia",
    },
  },
  {
    id: "verdade-2",
    category: "verdade",
    intensity: 2,
    action:
      "Peça a alguém de confiança um retorno honesto sobre um ponto seu que você tem medo de ouvir.",
    question:
      "Você quer o espelho ou o aplauso — e o que o medo do espelho já te custou?",
    anchor: {
      text: "As feridas feitas pelo amigo são fiéis.",
      source: "Provérbios 27:6",
      tradition: "biblia",
    },
  },
  {
    id: "verdade-3",
    category: "verdade",
    intensity: 2,
    action:
      "Assuma um erro recente para a pessoa certa, sem terceirizar a culpa. 'Eu errei' — ponto.",
    question:
      "A imagem que você defende vale o preço de nunca ser conhecido de verdade?",
    anchor: {
      text: "Quem encobre as suas faltas nunca prosperará; quem as confessa alcança misericórdia.",
      source: "Provérbios 28:13",
      tradition: "biblia",
    },
  },
  {
    id: "verdade-4",
    category: "verdade",
    intensity: 1,
    action:
      "Separe no papel o que depende de você e o que não depende, no problema que te aflige. Aja só sobre o primeiro.",
    question:
      "Quanta da sua energia hoje foi gasta empurrando aquilo que nunca esteve nas suas mãos?",
    anchor: {
      text: "Você tem poder sobre a sua mente, não sobre os eventos. Perceba isso e achará força.",
      source: "Marco Aurélio",
      tradition: "estoico",
    },
  },

  // ---------- ADIADO ----------
  {
    id: "adiado-1",
    category: "adiado",
    intensity: 2,
    action:
      "Escolha a tarefa que você mais adia e faça só os primeiros 5 minutos dela agora. Só começar.",
    question: "Do que exatamente a procrastinação está te poupando de sentir?",
    anchor: {
      text: "Enquanto adiamos, a vida passa.",
      source: "Sêneca",
      tradition: "estoico",
    },
  },
  {
    id: "adiado-2",
    category: "adiado",
    intensity: 1,
    action:
      "Faça agora aquela ligação ou e-mail chato de 2 minutos que fica te perseguindo há dias.",
    question:
      "Por que a mente transforma o pequeno em gigante — o que ela ganha com esse exagero?",
    anchor: {
      text: "Comece já a ser quem você quer ser.",
      source: "Marco Aurélio",
      tradition: "estoico",
    },
  },
  {
    id: "adiado-3",
    category: "adiado",
    intensity: 3,
    action:
      "Ataque hoje a decisão grande que você vem empurrando. Escreva prós e contras e dê o próximo passo real.",
    question:
      "Não decidir também é decidir. Que futuro você está escolhendo ao não escolher?",
    anchor: {
      text: "Quem observa o vento nunca semeará; quem olha as nuvens nunca colherá.",
      source: "Eclesiastes 11:4",
      tradition: "biblia",
    },
  },
  {
    id: "adiado-4",
    category: "adiado",
    intensity: 2,
    action:
      "Arrume agora aquele canto bagunçado que te incomoda toda vez que você passa por ele.",
    question:
      "Se o lado de fora espelha o de dentro, que desordem interna esse canto anuncia?",
    anchor: {
      text: "Faça-se tudo com decência e ordem.",
      source: "1 Coríntios 14:40",
      tradition: "biblia",
    },
  },
  {
    id: "adiado-5",
    category: "adiado",
    intensity: 1,
    action:
      "Defina em uma frase a coisa mais importante do seu dia e faça o primeiro pedaço dela antes de tudo.",
    question:
      "Você corre atrás do urgente para não encarar o silêncio do que é realmente importante?",
    anchor: {
      text: "Primeiro diga a si mesmo o que quer ser; depois faça o que precisa fazer.",
      source: "Epicteto",
      tradition: "estoico",
    },
  },

  // ---------- SOCIAL ----------
  {
    id: "social-1",
    category: "social",
    intensity: 2,
    action:
      "Mande agora a mensagem que você está adiando — para aquela pessoa que você precisa procurar.",
    question:
      "O que essa conversa revelaria sobre você que você prefere manter no escuro?",
    anchor: {
      text: "Sede praticantes da palavra e não apenas ouvintes.",
      source: "Tiago 1:22",
      tradition: "biblia",
    },
  },
  {
    id: "social-2",
    category: "social",
    intensity: 1,
    action:
      "Olhe nos olhos e cumprimente com sinceridade a próxima pessoa que cruzar seu caminho.",
    question:
      "Quando você se esconde no automático, de qual encontro real está fugindo?",
    anchor: {
      text: "Se quer melhorar, aceite parecer tolo por um tempo.",
      source: "Epicteto",
      tradition: "estoico",
    },
  },
  {
    id: "social-3",
    category: "social",
    intensity: 3,
    action:
      "Peça perdão, hoje, a quem você magoou — sem desculpas nem 'mas'. Só um pedido honesto.",
    question:
      "Que parte de você acredita que pedir perdão é perder — e quem te ensinou isso?",
    anchor: {
      text: "Se teu irmão tem algo contra ti, vai primeiro reconciliar-te com ele.",
      source: "Mateus 5:23-24",
      tradition: "biblia",
    },
  },
  {
    id: "social-4",
    category: "social",
    intensity: 2,
    action:
      "Diga 'não' a um pedido que você aceitaria só para agradar. Um não honesto vale mais que um sim ressentido.",
    question:
      "Ao dizer sim para todos, para quem você tem dito não a vida inteira?",
    anchor: {
      text: "Seja o vosso falar: sim, sim; não, não.",
      source: "Mateus 5:37",
      tradition: "biblia",
    },
  },
  {
    id: "social-5",
    category: "social",
    intensity: 2,
    action:
      "Elogie de forma específica e sincera alguém hoje. Coragem também é afirmar o bem no outro.",
    question:
      "O que te custa reconhecer o bem no outro — e o que isso revela do que você nega em si?",
    anchor: {
      text: "As palavras agradáveis são como favos de mel: doçura para a alma.",
      source: "Provérbios 16:24",
      tradition: "biblia",
    },
  },

  // ---------- DESCONFORTO ----------
  {
    id: "desconforto-1",
    category: "desconforto",
    intensity: 2,
    action:
      "Termine seu banho com 30 segundos de água fria hoje. Treine escolher o desconforto de propósito.",
    question:
      "Se você foge do pequeno desconforto, que autoridade dá a ele sobre a sua vida?",
    anchor: {
      text: "O obstáculo à ação impulsiona a ação. O que atrapalha o caminho vira o caminho.",
      source: "Marco Aurélio",
      tradition: "estoico",
    },
  },
  {
    id: "desconforto-2",
    category: "desconforto",
    intensity: 1,
    action:
      "Fique 10 minutos sem o celular, em silêncio, só com seus pensamentos. Encare o tédio.",
    question: "O que emerge no silêncio que você anestesia com a tela?",
    anchor: {
      text: "Aquietai-vos e sabei que eu sou Deus.",
      source: "Salmo 46:10",
      tradition: "biblia",
    },
  },
  {
    id: "desconforto-3",
    category: "desconforto",
    intensity: 3,
    action:
      "Abra mão hoje de um conforto que virou muleta (um doce, uma rede social, uma reclamação). Só por hoje.",
    question:
      "Você possui esse hábito, ou é ele que possui você — quem é o dono de quem?",
    anchor: {
      text: "Tudo me é lícito, mas eu não me deixarei dominar por nada.",
      source: "1 Coríntios 6:12",
      tradition: "biblia",
    },
  },
  {
    id: "desconforto-4",
    category: "desconforto",
    intensity: 2,
    action:
      "Coma hoje uma refeição mais simples do que gostaria — e agradeça por ela. Pratique a suficiência.",
    question: "A sua paz depende de ter mais, ou de precisar de menos?",
    anchor: {
      text: "Aprendi a contentar-me com o que tenho.",
      source: "Filipenses 4:11",
      tradition: "biblia",
    },
  },

  // ---------- DISCIPLINA ----------
  {
    id: "disciplina-1",
    category: "disciplina",
    intensity: 2,
    action:
      "Cumpra hoje uma promessa pequena que você fez a si mesmo. A confiança em você se constrói assim.",
    question: "Se a confiança se constrói com provas, que provas você tem dado a si mesmo?",
    anchor: {
      text: "O justo é ousado como um leão.",
      source: "Provérbios 28:1",
      tradition: "biblia",
    },
  },
  {
    id: "disciplina-2",
    category: "disciplina",
    intensity: 1,
    action:
      "Levante no primeiro toque do despertador amanhã — sem soneca. Vença a si mesmo antes do dia começar.",
    question:
      "A cada 'só mais cinco minutos', a quem você está obedecendo — ao chamado ou ao conforto?",
    anchor: {
      text: "Não explique sua filosofia. Encarne-a.",
      source: "Epicteto",
      tradition: "estoico",
    },
  },
  {
    id: "disciplina-3",
    category: "disciplina",
    intensity: 3,
    action:
      "Faça hoje, por inteiro, aquele hábito bom que você começa e abandona. Uma repetição completa, sem negociar.",
    question: "O que muda no seu caráter quando você para de negociar consigo mesmo?",
    anchor: {
      text: "Portai-vos com coragem, sede fortes; vigiai e estai firmes na fé.",
      source: "1 Coríntios 16:13",
      tradition: "biblia",
    },
  },
  {
    id: "disciplina-4",
    category: "disciplina",
    intensity: 2,
    action:
      "Escolha uma distração e corte-a por 3 horas hoje. Devolva esse tempo ao que importa.",
    question:
      "Se o seu tempo é a sua vida em miniatura, o que ele tem confessado sobre os seus deuses?",
    anchor: {
      text: "Nenhum homem é livre se não é senhor de si mesmo.",
      source: "Epicteto",
      tradition: "estoico",
    },
  },
  {
    id: "disciplina-5",
    category: "disciplina",
    intensity: 1,
    action:
      "Antes de reclamar de algo hoje, transforme a reclamação em uma ação ou em um agradecimento.",
    question:
      "A queixa te dá a ilusão de agir sem o custo de mudar. Você percebe a troca que aceitou?",
    anchor: {
      text: "Fazei tudo sem murmurações nem contendas.",
      source: "Filipenses 2:14",
      tradition: "biblia",
    },
  },

  // ---------- CORPO ----------
  {
    id: "corpo-1",
    category: "corpo",
    intensity: 2,
    action:
      "Vá treinar hoje, nem que seja por 20 minutos. Corpo em movimento, mente no lugar.",
    question:
      "Que respeito por si mesmo você adia toda vez que abandona o próprio corpo?",
    anchor: {
      text: "O vosso corpo é templo do Espírito Santo, que habita em vós.",
      source: "1 Coríntios 6:19",
      tradition: "biblia",
    },
  },
  {
    id: "corpo-2",
    category: "corpo",
    intensity: 1,
    action:
      "Levante e caminhe ou corra 10 minutos agora — de preferência ao ar livre.",
    question:
      "A indisposição vem antes do movimento, ou é a desculpa que o movimento desmente?",
    anchor: {
      text: "As dificuldades revelam os homens.",
      source: "Epicteto",
      tradition: "estoico",
    },
  },
  {
    id: "corpo-3",
    category: "corpo",
    intensity: 1,
    action:
      "Beba um copo de água agora e planeje suas refeições do dia com sobriedade, não no impulso.",
    question: "Você se alimenta para viver, ou para não sentir — o que a comida tem tapado?",
    anchor: {
      text: "Quer comais, quer bebais, fazei tudo para a glória de Deus.",
      source: "1 Coríntios 10:31",
      tradition: "biblia",
    },
  },
  {
    id: "corpo-4",
    category: "corpo",
    intensity: 3,
    action:
      "Marque ou realize hoje aquele treino, consulta ou exame que você vem empurrando.",
    question:
      "O que você adia cuidar no corpo até ele gritar aquilo que você se recusa a ouvir?",
    anchor: {
      text: "Disciplino o meu corpo e o reduzo à servidão.",
      source: "1 Coríntios 9:27",
      tradition: "biblia",
    },
  },

  // ---------- ESPÍRITO ----------
  {
    id: "espirito-1",
    category: "espirito",
    intensity: 1,
    action:
      "Pare agora e ore por 2 minutos — fale com Deus como quem fala com um Pai, sem fórmula.",
    question:
      "Se você fala com Deus como fala com um Pai, o que o seu silêncio com Ele revela da relação?",
    anchor: {
      text: "Orai sem cessar.",
      source: "1 Tessalonicenses 5:17",
      tradition: "biblia",
    },
  },
  {
    id: "espirito-2",
    category: "espirito",
    intensity: 2,
    action:
      "Leia um capítulo da Bíblia agora e escreva uma frase do que Deus te falou nele.",
    question:
      "Você busca a Palavra para ser transformado, ou só para ser confirmado no que já pensa?",
    anchor: {
      text: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.",
      source: "Salmo 119:105",
      tradition: "biblia",
    },
  },
  {
    id: "espirito-3",
    category: "espirito",
    intensity: 1,
    action:
      "Fique 5 minutos em silêncio, respirando devagar, entregando a Deus aquilo que te aflige.",
    question: "Do que a sua pressa está fugindo, que só o silêncio faria você ouvir?",
    anchor: {
      text: "Vinde a mim todos os que estais cansados, e eu vos aliviarei.",
      source: "Mateus 11:28",
      tradition: "biblia",
    },
  },
  {
    id: "espirito-4",
    category: "espirito",
    intensity: 1,
    action:
      "Escreva 3 coisas pelas quais você é grato hoje, antes de pedir qualquer coisa.",
    question:
      "A queixa mira o que falta; a gratidão, o que sustenta. Para onde seus olhos foram treinados?",
    anchor: {
      text: "Em tudo dai graças, porque esta é a vontade de Deus.",
      source: "1 Tessalonicenses 5:18",
      tradition: "biblia",
    },
  },
  {
    id: "espirito-5",
    category: "espirito",
    intensity: 2,
    action:
      "Medite 5 minutos num único versículo — repita-o devagar até ele descer do pensamento ao coração.",
    question: "A verdade só liberta quando desce ao coração. Onde a sua ainda está presa?",
    anchor: {
      text: "Medita neste livro da lei dia e noite, para que faças conforme está escrito.",
      source: "Josué 1:8",
      tradition: "biblia",
    },
  },

  // ---------- TRABALHO ----------
  {
    id: "trabalho-1",
    category: "trabalho",
    intensity: 2,
    action:
      "Crie e publique hoje UMA campanha ou anúncio. Feito é melhor que perfeito — coloque no mundo.",
    question:
      "O 'perfeito' que você persegue serve à obra, ou serve ao seu medo de ser julgado?",
    anchor: {
      text: "Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças.",
      source: "Eclesiastes 9:10",
      tradition: "biblia",
    },
  },
  {
    id: "trabalho-2",
    category: "trabalho",
    intensity: 1,
    action:
      "Dê o próximo passo pequeno no seu projeto AGORA — uma tarefa de 10 minutos que faz ele andar.",
    question:
      "Planejar sem executar dá a sensação de progresso sem o risco dele. Você aceitou esse acordo?",
    anchor: {
      text: "Em todo trabalho há proveito; meras palavras levam à pobreza.",
      source: "Provérbios 14:23",
      tradition: "biblia",
    },
  },
  {
    id: "trabalho-3",
    category: "trabalho",
    intensity: 2,
    action:
      "Procure hoje um cliente ou lead: mande uma mensagem, faça uma oferta, publique algo que venda seu trabalho.",
    question:
      "O que você teme que o 'não' de um cliente diga sobre o seu valor — e quem definiu isso?",
    anchor: {
      text: "Os planos do diligente conduzem à fartura.",
      source: "Provérbios 21:5",
      tradition: "biblia",
    },
  },
  {
    id: "trabalho-4",
    category: "trabalho",
    intensity: 3,
    action:
      "Termine e entregue hoje aquele projeto 90% pronto que você não fecha por medo do julgamento.",
    question: "Segurar a obra pronta é humildade, ou é medo disfarçado de capricho?",
    anchor: {
      text: "Aquele que em vós começou a boa obra a aperfeiçoará.",
      source: "Filipenses 1:6",
      tradition: "biblia",
    },
  },
  {
    id: "trabalho-5",
    category: "trabalho",
    intensity: 1,
    action:
      "Elimine uma distração do seu ambiente e faça 2 horas de foco numa só tarefa importante.",
    question: "Cada distração é uma fuga barata. Do que exatamente você foge ao se dispersar?",
    anchor: {
      text: "Faça cada tarefa como se fosse a última — com foco e sem pressa.",
      source: "Marco Aurélio",
      tradition: "estoico",
    },
  },

  // ---------- ESTUDO ----------
  {
    id: "estudo-1",
    category: "estudo",
    intensity: 2,
    action:
      "Estude inglês agora por 15 minutos — uma lição, um vídeo, 10 palavras novas. Sem esperar o dia perfeito.",
    question:
      "Se você já dominasse esse idioma, quem você se tornaria — e por que essa versão te assusta?",
    anchor: {
      text: "Adquire a sabedoria, adquire o entendimento; não te esqueças.",
      source: "Provérbios 4:5",
      tradition: "biblia",
    },
  },
  {
    id: "estudo-2",
    category: "estudo",
    intensity: 2,
    action:
      "Dedique 15 minutos ao russo agora: alfabeto, frases, revisão. Constância vence intensidade.",
    question:
      "A crença 'não levo jeito' é um fato, ou uma sentença que você aceitou sem nunca julgar?",
    anchor: {
      text: "O coração do entendido adquire o conhecimento.",
      source: "Provérbios 18:15",
      tradition: "biblia",
    },
  },
  {
    id: "estudo-3",
    category: "estudo",
    intensity: 1,
    action:
      "Pratique por 15 minutos uma habilidade que te aproxima de quem você quer ser.",
    question: "O que a sua mente ganha ao te convencer de que é tarde ou difícil demais?",
    anchor: {
      text: "A felicidade da tua vida depende da qualidade dos teus pensamentos.",
      source: "Marco Aurélio",
      tradition: "estoico",
    },
  },
  {
    id: "estudo-4",
    category: "estudo",
    intensity: 2,
    action:
      "Leia 10 páginas de um livro que te desafia — não o que te distrai, o que te faz crescer.",
    question: "Você lê para preencher a mente, ou para ser confrontado por ela — qual tem evitado?",
    anchor: {
      text: "Aplica o coração ao ensino e os ouvidos às palavras do conhecimento.",
      source: "Provérbios 23:12",
      tradition: "biblia",
    },
  },

  // ---------- FOCO ESSENCIAL ----------
  {
    id: "foco-1",
    category: "foco",
    intensity: 2,
    action:
      "Pergunte-se: qual é a ÚNICA coisa que, se eu fizer hoje, torna todo o resto mais fácil ou desnecessário? Faça só ela primeiro.",
    question:
      "Você se ocupa de muitas coisas justamente para não se comprometer com a única que importa?",
    anchor: {
      text: "Qual é a única coisa que torna o resto mais fácil ou desnecessário?",
      source: "A Única Coisa — Gary Keller",
      tradition: "livro",
    },
  },
  {
    id: "foco-2",
    category: "foco",
    intensity: 2,
    action:
      "Elimine hoje uma tarefa, compromisso ou assinatura que não é um 'claro que sim'. Menos, porém melhor.",
    question:
      "Você diz sim ao trivial por medo de decepcionar — e, com isso, trai o essencial?",
    anchor: {
      text: "Se não é um 'claro que sim', então é um não.",
      source: "Essencialismo — Greg McKeown",
      tradition: "livro",
    },
  },
  {
    id: "foco-3",
    category: "foco",
    intensity: 1,
    action:
      "Nomeie o gatilho interno (tédio, ansiedade) que te empurra à distração agora e escreva o que você realmente sente antes de reagir.",
    question:
      "A distração não é sobre a tela: de qual desconforto interno você foge com ela?",
    anchor: {
      text: "A distração começa por dentro, num desconforto que se quer evitar.",
      source: "Indistraível — Nir Eyal",
      tradition: "livro",
    },
  },

  // ---------- ESTRATÉGIAS DOS MESTRES ----------
  {
    id: "mestres-1",
    category: "mestres",
    intensity: 2,
    action:
      "Sirva alguém hoje sem que ninguém veja nem retribua. A grandeza que Jesus ensinou começa no servir.",
    question: "Você busca ser servido e chama isso de sucesso — ou lidera servindo?",
    anchor: {
      text: "Quem quiser tornar-se grande, que seja servo de todos.",
      source: "Jesus — Marcos 10:43",
      tradition: "biblia",
    },
  },
  {
    id: "mestres-2",
    category: "mestres",
    intensity: 2,
    action:
      "Escolha uma verdade que você já conhece e PRATIQUE-a hoje. Ouvir sem fazer é casa construída na areia.",
    question: "Quanto do que você sabe virou vida — e quanto virou só informação?",
    anchor: {
      text: "Quem ouve estas palavras e as pratica é como quem constrói sobre a rocha.",
      source: "Jesus — Mateus 7:24",
      tradition: "biblia",
    },
  },
  {
    id: "mestres-3",
    category: "mestres",
    intensity: 1,
    action:
      "Pergunte-se: 'e se hoje fosse o último dia?' — e ajuste UMA escolha do seu dia a essa lucidez.",
    question: "A ilusão de tempo infinito é o que te faz desperdiçar o tempo que você tem?",
    anchor: {
      text: "Não é que temos pouco tempo, é que perdemos muito dele.",
      source: "Sêneca",
      tradition: "estoico",
    },
  },
  {
    id: "mestres-4",
    category: "mestres",
    intensity: 2,
    action:
      "Antes de um desafio de hoje, ensaie na mente o pior que pode acontecer. Enfrente-o já preparado e sereno.",
    question: "O inesperado te derruba porque você se recusa a olhar para ele antes?",
    anchor: {
      text: "O que é inesperado golpeia mais forte; ensaie a adversidade de antemão.",
      source: "Sêneca",
      tradition: "estoico",
    },
  },
  {
    id: "mestres-5",
    category: "mestres",
    intensity: 2,
    action:
      "Repita hoje, de propósito, o ato da virtude que você quer ter (coragem, paciência). Você se torna o que pratica.",
    question:
      "Você espera se SENTIR virtuoso para agir — quando é o agir que forma a virtude?",
    anchor: {
      text: "A virtude nasce do hábito: tornamo-nos justos praticando a justiça.",
      source: "Aristóteles",
      tradition: "filosofo",
    },
  },
  {
    id: "mestres-6",
    category: "mestres",
    intensity: 1,
    action:
      "Encontre hoje o meio-termo numa área em que você exagera ou falta (comida, trabalho, fala). Aja no ponto certo.",
    question: "Onde a sua falta de medida vira vício — no excesso ou na omissão?",
    anchor: {
      text: "A virtude está no meio-termo entre o excesso e a falta.",
      source: "Aristóteles",
      tradition: "filosofo",
    },
  },

  // ---------- ABRAÇAR A MUDANÇA ----------
  {
    id: "mudanca-1",
    category: "mudanca",
    intensity: 2,
    action:
      "Dê hoje um passo em direção a uma mudança que você resiste. O queijo velho não volta; mova-se com ele.",
    question:
      "Você fareja a mudança chegando e, ainda assim, finge que o antigo vai durar para sempre?",
    anchor: {
      text: "Quanto mais cedo você solta o queijo velho, mais cedo acha o novo.",
      source: "Quem Mexeu no Meu Queijo? — Spencer Johnson",
      tradition: "livro",
    },
  },
  {
    id: "mudanca-2",
    category: "mudanca",
    intensity: 3,
    action:
      "Escreva: 'o que eu faria agora se não tivesse medo?' — e faça a menor versão disso ainda hoje.",
    question: "O medo da mudança te custa mais do que a própria mudança custaria?",
    anchor: {
      text: "O que você faria se não tivesse medo?",
      source: "Quem Mexeu no Meu Queijo? — Spencer Johnson",
      tradition: "livro",
    },
  },

  // ---------- MENTE E DINHEIRO ----------
  {
    id: "dinheiro-1",
    category: "dinheiro",
    intensity: 1,
    action:
      "Espere 24h antes daquela compra por impulso que você ia fazer. Deixe o desejo esfriar e depois decida.",
    question: "Você compra coisas para impressionar pessoas cuja opinião nem valoriza?",
    anchor: {
      text: "Riqueza é o que você não vê: é o dinheiro que você não gastou.",
      source: "Psicologia Financeira — Morgan Housel",
      tradition: "livro",
    },
  },
  {
    id: "dinheiro-2",
    category: "dinheiro",
    intensity: 2,
    action:
      "Defina hoje o seu 'suficiente' — quanto basta — e anote. Sem essa linha, nenhuma quantia é bastante.",
    question:
      "A ausência de um 'já basta' é o que transforma ambição em ganância silenciosa?",
    anchor: {
      text: "O mais difícil na riqueza é saber a hora de dizer 'já é suficiente'.",
      source: "Psicologia Financeira — Morgan Housel",
      tradition: "livro",
    },
  },
  {
    id: "dinheiro-3",
    category: "dinheiro",
    intensity: 2,
    action:
      "Separe hoje uma reserva — mesmo pequena — antes de gastar o resto. Pague-se primeiro.",
    question: "Você trata o seu 'eu do futuro' como um estranho por quem não vale a pena poupar?",
    anchor: {
      text: "Na casa do sábio há tesouro; o insensato, porém, tudo devora.",
      source: "Provérbios 21:20",
      tradition: "biblia",
    },
  },

  // ---------- TRABALHO (ação massiva) ----------
  {
    id: "trabalho-6",
    category: "trabalho",
    intensity: 3,
    action:
      "Multiplique por 10 a sua próxima meta e por 10 a ação de hoje. Faça mais do que parece razoável.",
    question:
      "Suas metas são pequenas porque são realistas — ou porque você teme mirar alto e falhar?",
    anchor: {
      text: "Estabeleça metas 10x maiores e aja com esforço 10x.",
      source: "Regra 10x — Grant Cardone",
      tradition: "livro",
    },
  },
];

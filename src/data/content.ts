export const site = {
  name: "Clínica Neuropleno",
  tagline: "Referência em Neurologia, Neurocirurgia e Neurorradiologia",
  city: "Teresina - PI",
  cityShort: "Teresina-PI",
  address: "R. Gov. Joca Pires, 2020, Ininga, Centro Médico San Vitta, Teresina/PI",
  // Resumo em uma linha (rodapé, llms.txt, seção Sobre). O detalhamento por dia fica em hoursLines.
  hours: "Segunda a quinta, das 08h às 19h · Sexta, das 08h às 17h",
  hoursLines: ["Segunda a quinta, das 08h às 19h", "Sexta, das 08h às 17h"],
  whatsapp: "5586988519192",
  whatsappDisplay: "(86) 98851-9192",
  instagram: "https://www.instagram.com/neuroplenoclinica",
  // Exigido pela Resolução CFM nº 2.336/2023 para publicidade de estabelecimentos assistenciais
  // em ambiente virtual. Confirme os dados corretos com a clínica antes de publicar — a Footer só
  // exibe esta linha quando ambos os campos estiverem preenchidos.
  clinicCrmRegistration: "",
  technicalDirector: "",
};

export const whatsappMessage =
  "Olá! Gostaria de agendar uma consulta com a Clínica Neuropleno ou tirar dúvidas.";

export function whatsappLink(customMessage?: string) {
  const msg = encodeURIComponent(customMessage ?? whatsappMessage);
  return `https://wa.me/${site.whatsapp}?text=${msg}`;
}

export const nav = [
  { label: "Início", href: "#home" },
  { label: "Procedimentos", href: "#procedimentos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Equipe", href: "#equipe" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  headline: "Cuidado neurológico completo em um só lugar",
  subheadline:
    "Do diagnóstico preciso ao tratamento clínico, cirúrgico e endovascular, com equipe especializada e tecnologia de ponta.",
  specialties: "Neurologia • Neurocirurgia • Neurointervenção • Exames especializados",
};

export const teamImage = "/images/equipe/hero.webp";

export const stats = [
  { label: "Anos de Experiência", value: 10, suffix: "+" },
  { label: "Pacientes Atendidos", value: 20000, suffix: "+" },
  { label: "Tratamentos Realizados", value: 5000, suffix: "+" },
];

export type SpecialtyKey = "neurologia" | "neurocirurgia" | "neurorradiologia";

export type Procedure = {
  title: string;
  image: string;
  category: SpecialtyKey;
};

export const procedures: Procedure[] = [
  // A esteira segue a jornada do paciente: consultas, exames, procedimentos e cirurgias.
  // Manter os cards agrupados nessa ordem — é ela que dá sentido à sequência para quem assiste.

  // Consultas
  { title: "Cefaleia", image: "/images/procedimentos/cefaleia.jpg", category: "neurologia" },
  { title: "Esquecimentos ou Demência", image: "/images/procedimentos/demencia.jpg", category: "neurologia" },
  { title: "Doença de Parkinson", image: "/images/procedimentos/parkinson.jpg", category: "neurologia" },
  { title: "Epilepsia", image: "/images/procedimentos/epilepsia.jpg", category: "neurologia" },
  { title: "Autismo", image: "/images/procedimentos/autismo.jpg", category: "neurologia" },
  { title: "TDAH", image: "/images/procedimentos/tdah.jpg", category: "neurologia" },
  { title: "Esclerose Múltipla", image: "/images/procedimentos/esclerose-multipla.jpg", category: "neurologia" },
  { title: "Neuropatia Periférica", image: "/images/procedimentos/neuropatia-periferica.jpg", category: "neurologia" },
  { title: "Fibromialgia", image: "/images/procedimentos/fibromialgia.jpg", category: "neurologia" },

  // Exames
  { title: "Eletroneuromiografia", image: "/images/procedimentos/eletroneuromiografia.jpg", category: "neurologia" },
  { title: "Eletroencefalograma", image: "/images/procedimentos/eeg.jpg", category: "neurologia" },
  { title: "Polissonografia", image: "/images/procedimentos/polissonografia.jpg", category: "neurologia" },
  { title: "Angiografia Cerebral", image: "/images/procedimentos/angiografia.jpg", category: "neurorradiologia" },

  // Procedimentos
  { title: "Punção Lombar com Coleta de Líquor", image: "/images/procedimentos/puncao-lombar.jpg", category: "neurologia" },
  { title: "Bloqueio de Nervo Occipital", image: "/images/procedimentos/bloqueio-occipital.jpg", category: "neurologia" },
  { title: "Toxina Botulínica", image: "/images/procedimentos/toxina-botulinica.jpg", category: "neurologia" },
  { title: "Aneurisma Cerebral", image: "/images/procedimentos/aneurisma.jpg", category: "neurorradiologia" },
  { title: "Neurointervenção", image: "/images/procedimentos/neurointervencao.jpg", category: "neurorradiologia" },

  // Cirurgias
  { title: "Cirurgia de Coluna", image: "/images/procedimentos/cirurgia-coluna.jpg", category: "neurocirurgia" },
  { title: "Artrodese de Coluna", image: "/images/procedimentos/artrodese.jpg", category: "neurocirurgia" },
  { title: "Descompressão do Trigêmeo", image: "/images/procedimentos/trigemeo.jpg", category: "neurocirurgia" },
];

export type SpecialtyArea = {
  key: SpecialtyKey;
  title: string;
  description: string;
  image: string;
};

export const specialtyAreas: SpecialtyArea[] = [
  {
    key: "neurologia",
    title: "Neurologia",
    description:
      "Investigação e tratamento de dores de cabeça, enxaqueca, Parkinson, Alzheimer, epilepsia, AVC e outros sintomas neurológicos, com avaliação individualizada e acompanhamento especializado.",
    image: "/images/procedimentos/parkinson.jpg",
  },
  {
    key: "neurocirurgia",
    title: "Neurocirurgia",
    description:
      "Tratamento especializado de tumores cerebrais, doenças da coluna, compressões nervosas e outras condições neurocirúrgicas, sempre buscando a melhor estratégia para cada paciente.",
    image: "/images/procedimentos/tumor-cerebral.jpg",
  },
  {
    key: "neurorradiologia",
    title: "Neurorradiologia",
    description:
      "Abordagem de aneurismas cerebrais, doenças vasculares, angioplastia de carótida, angiografia e outros procedimentos realizados pelos vasos sanguíneos.",
    image: "/images/procedimentos/aneurisma.jpg",
  },
];

export const authorityPoints = [
  "Corpo clínico com mestrado, doutorado e docência universitária em neurologia e neurocirurgia.",
  "Preceptor da residência médica de Neurocirurgia do HGV, formando novos especialistas.",
  "Especialização em neurorradiologia intervencionista, neurofisiologia clínica e doenças cerebrovasculares.",
  "Mais de 10 anos de atuação e 20.000+ pacientes atendidos em Teresina - PI.",
];

export type Doctor = {
  name: string;
  /** Especialidade + registros (CRM/RQE), exibido logo abaixo do nome. */
  role: string;
  /** Até 5 linhas curtas de autoridade/atuação — nunca a lista completa de patologias. */
  highlights: string[];
  ctaLabel: string;
  image: string;
};

export const doctors: Doctor[] = [
  {
    name: "Dr. Davi Said Araújo",
    role: "Neurologista | CRM-PI 4898 | RQE 3230",
    highlights: [
      "Neurologista com atuação em doenças cerebrovasculares e condições neurológicas",
      "Diagnóstico e acompanhamento de AVC e outras doenças neurológicas",
      "Atuação em cefaleias, enxaqueca, Alzheimer, Parkinson e epilepsia",
      "Também acompanha neuropatias, miastenia e distúrbios do sono",
    ],
    ctaLabel: "Quero agendar minha consulta",
    image: "/images/equipe/dr-davi-said-araujo.jpg",
  },
  {
    name: "Dr. Marconi Cosme Soares de Oliveira Filho",
    role: "Neurologista e Neurofisiologista Clínico | CRM-PI 5303 | RQE 3558 / 3791",
    highlights: [
      "Especialista em Neurologia e Neurofisiologia Clínica",
      "Atuação com foco em doenças neuromusculares e neuropatias",
      "Realiza eletroneuromiografia e punção lombar",
      "Investiga formigamentos, fraqueza, túnel do carpo, radiculopatias e outras alterações neurológicas",
    ],
    ctaLabel: "Quero agendar minha consulta",
    image: "/images/equipe/dr-marconi-cosme.jpg",
  },
  {
    name: "Dr. Frederico Maia Prado",
    role: "Neurologista e Neurofisiologista Clínico | CRM-PI 4096 | RQE 3578",
    highlights: [
      "Neurologista e Neurofisiologista Clínico pela Universidade Federal Fluminense (UFF)",
      "Mestre em Neurologia com ênfase em doenças neuromusculares pela UFF",
      "Doutorando pela UFPI e Professor de Medicina na UNICET",
      "Realiza consultas, eletroneuromiografia e bloqueios de nervos periféricos",
    ],
    ctaLabel: "Quero agendar minha consulta",
    image: "/images/equipe/dr-frederico-maia-prado.jpg",
  },
  {
    name: "Dr. Romilto Pacheco",
    role: "Neurocirurgião e Neurorradiologista Intervencionista | CRM-PI 5160 | RQE 4472 / 5512",
    highlights: [
      "Neurocirurgião formado pelo HCFMRP-USP",
      "Especialização em Radiologia e Neurorradiologia Intervencionista pelo HCFMRP-USP",
      "Mestre em Ciências das Imagens e Preceptor da Neurocirurgia do HGV",
      "Doutorando em Neurologia e Neurociências - USP",
      "Atuação em AVC, aneurismas, tumores, doenças da coluna e tratamentos por cirurgia ou cateter",
    ],
    ctaLabel: "Quero agendar minha avaliação",
    image: "/images/equipe/dr-romilto-pacheco.jpg",
  },
];

export type MediaMention = {
  name: string;
  image: string;
  // Preencha com a matéria real (headline, assunto e link) para cada veículo.
  // Enquanto vazio, o card exibe apenas a logo, sem link — nunca inventar URL/manchete.
  headline?: string;
  topic?: string;
  url?: string;
};

// Apenas veículos com matéria real verificada entram nesta lista — sem link real, sem entrada.
export const mediaLogos: MediaMention[] = [
  { name: "Terra", image: "/images/midia/terra.png" },
  { name: "Globo", image: "/images/midia/globo.png" },
  { name: "iG", image: "/images/midia/ig.png" },
  { name: "UOL", image: "/images/midia/uol.png" },
  { name: "Valor Econômico", image: "/images/midia/valor-economico.png" },
  { name: "O Globo", image: "/images/midia/oglobo.png" },
];

export const behindTheScenesVideo = {
  eyebrow: "Bastidores",
  title: "Veja um exame de eletroneuromiografia na prática",
  description:
    "Registro real de um atendimento na Clínica Neuropleno, mostrando como funciona o exame que avalia a atividade elétrica de nervos e músculos. Exame realizado por equipe especializada em neurofisiologia, com cuidado e orientação em todas as etapas.",
  video: "/videos/exame-eletroneuromiografia.mp4",
  poster: "/images/posters/eletroneuromiografia.jpg",
};

export const facilityText =
  "Trazemos para Teresina-PI diagnósticos precisos, exames de alta complexidade e tratamentos personalizados, tudo com tecnologia de ponta e equipe médica de referência nacional. Cuidar da sua saúde neurológica nunca foi tão seguro, moderno e humano.";

// Só o espaço físico entra aqui: fachada, recepção, espera, salas. Foto com médico
// em primeiro plano é conteúdo da Equipe, não da Estrutura — facility-4, 5 e 6 são
// os médicos em procedimento e por isso ficam fora desta lista.
export const facilityImages = [
  "/images/estrutura/fachada.jpg",
  "/images/estrutura/recepcao.jpg",
  "/images/estrutura/sala-de-espera.jpg",
];

export const steps = [
  {
    icon: "/images/passos/1.svg",
    title: "Agende Sua Consulta",
    description: "Agende sua consulta pelo nosso WhatsApp com um clique",
  },
  {
    icon: "/images/passos/2.svg",
    title: "Realize Sua Avaliação",
    description: "Avaliação médica personalizada, com recursos de ponta",
  },
  {
    icon: "/images/passos/3.svg",
    title: "Realize Seus Exames e Tratamento",
    description: "Seja clínico ou cirúrgico, aqui você tem acesso ao plano completo",
  },
  {
    icon: "/images/passos/4.svg",
    title: "Recupere Sua Qualidade de Vida",
    description: "Com o diagnóstico certo e a abordagem correta",
  },
];

export const symptoms = [
  "Dormência e formigamento",
  "Esquecimentos e confusão mental",
  "Dores de cabeça frequentes",
  "Tremores, fraqueza ou dificuldade para segurar objetos",
  "Dores cervicais ou lombares intensas",
  "Alterações na fala ou na compreensão",
  "Tonturas, perda de visão súbita ou paralisias",
  "Convulsões e desmaios",
];

export const features = [
  {
    title: "Diagnóstico preciso e rápido",
    description: "Exames de alta performance para identificar a causa com agilidade e segurança.",
  },
  {
    title: "Tratamentos modernos",
    description: "Abordagens atualizadas para condições neurológicas clínicas e cirúrgicas.",
  },
  {
    title: "Equipe referência",
    description: "Médicos especialistas em neurologia e neurocirurgia, com formação e experiência reconhecidas.",
  },
];

export type Testimonial = {
  name: string;
  quote: string;
  rating?: number;
  // Só preencher com o link da avaliação real no perfil da clínica no Google Maps.
  // Sem origem verificada o card não exibe o selo do Google — nunca atribuir ao
  // Google um depoimento que não veio de lá.
  googleUrl?: string;
};

// Perfil real da clínica no Google Meu Negócio. O ftid (0x...:0x...) é o
// identificador do estabelecimento; ",1," abre a lista de avaliações e ",3," o
// formulário de quem vai avaliar.
const GOOGLE_FTID = "0x78e3900166e35df:0xdf1f22a8adfe7098";
const GOOGLE_SEARCH = "https://www.google.com/search?q=Cl%C3%ADnica+NeuroPleno+Teresina";

export const googleBusiness = {
  rating: 4.9,
  reviewCount: 64,
  profileUrl: "https://www.google.com/maps?cid=16077607302604943512",
  reviewsUrl: `${GOOGLE_SEARCH}#lrd=${GOOGLE_FTID},1,,,,`,
  writeReviewUrl: `${GOOGLE_SEARCH}#lrd=${GOOGLE_FTID},3,,,,`,
};

// Avaliações reais publicadas no perfil do Google da clínica, transcritas em
// 23/09/2026. Conferidas uma a uma — nenhuma frase aqui é escrita por nós.
export const testimonials: Testimonial[] = [
  {
    name: "Sandra Santos",
    rating: 5,
    quote:
      "Foi excelente. Médico Dr. Frederico atencioso, cuidadoso, minucioso com todos os detalhes. Realmente passou total confiança. As atendentes super educadas e atenciosas.",
    googleUrl: googleBusiness.reviewsUrl,
  },
  {
    name: "Marcia Cristina Gomes",
    rating: 5,
    quote:
      "Lugar que se preocupa e se compromete com o atendimento em excelência. Profissionais capacitados, tratando os pacientes bem como os acompanhantes de forma humanitária.",
    googleUrl: googleBusiness.reviewsUrl,
  },
  {
    name: "Ludmila Lopes de A. Miranda",
    rating: 5,
    quote:
      "Serviço de excelência, com excelente estrutura física e quadro clínico! Dr. Marconi é muito atencioso e preparado no que faz!",
    googleUrl: googleBusiness.reviewsUrl,
  },
  {
    name: "Valduleide Cavalcante Costa",
    rating: 5,
    quote:
      "Gostei muito do atendimento, prático e rápido no agendamento de exames pelo WhatsApp e consulta no horário marcado.",
    googleUrl: googleBusiness.reviewsUrl,
  },
];

export const paymentText =
  "Os valores podem ser pagos de forma parcelada e temos sensibilidade sobre o quão importante é o tratamento para seu bem-estar. A avaliação é feita de maneira integral e tiraremos todas as suas dúvidas.";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faq: FaqItem[] = [
  {
    question: "Quais especialidades são atendidas na Neuropleno?",
    answer:
      "A clínica conta com atendimento em Neurologia, Neurocirurgia e Neurorradiologia, com profissionais especializados em diferentes áreas da saúde neurológica.",
  },
  {
    question: "Quais exames e procedimentos são realizados na clínica?",
    answer:
      "A Neuropleno realiza exames e procedimentos como eletroneuromiografia, punção lombar e bloqueios de nervos periféricos, conforme indicação médica.",
  },
  {
    question: "Quais sintomas indicam que devo procurar um neurologista?",
    answer:
      "Dores de cabeça frequentes, formigamentos, perda de força, tremores, alterações de memória, crises convulsivas, tonturas e outros sintomas neurológicos merecem avaliação especializada.",
  },
  {
    question: "Quanto tempo dura a consulta?",
    answer:
      "O tempo pode variar conforme cada caso, pois a consulta é direcionada à avaliação cuidadosa dos sintomas, histórico clínico e exames do paciente.",
  },
  {
    question: "Como funciona o retorno após a consulta?",
    answer:
      "O retorno segue as orientações e o prazo estabelecidos pelo médico de acordo com a necessidade de cada paciente.",
  },
  {
    question: "Como faço para agendar uma consulta ou exame?",
    answer:
      "O agendamento pode ser realizado pelo WhatsApp da clínica. A equipe orienta sobre o profissional mais adequado, horários disponíveis e documentos necessários.",
  },
];

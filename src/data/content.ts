export const site = {
  name: "Clínica Neuropleno",
  tagline: "Referência em Neurologia, Neurocirurgia e Neurorradiologia",
  city: "Teresina - PI",
  cityShort: "Teresina-PI",
  address: "R. Gov. Joca Pires, 2020 — Ininga - Centro Médico San Vitta, Teresina/PI",
  // Resumo em uma linha (rodapé, llms.txt, seção Sobre). O detalhamento por dia fica em hoursLines.
  hours: "Segunda a quinta, das 08h às 19h · Sexta, das 08h às 17h",
  hoursLines: ["Segunda à quinta, das 08h às 19h", "Sexta, das 08h às 17h"],
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
  "Olá! Gostaria de agendar uma consulta com a Clínica Neuropleno ou tirar dúvidas";

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

export const teamImage = "/images/hero.webp";

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
  // As fotos reais da clínica entram a cada 3 cards: o colorido no meio do
  // duotone vira ritmo, e não um bloco solto na esteira.
  { title: "Cefaleia", image: "/images/proc-cefaleia.jpg", category: "neurologia" },
  { title: "Esquecimentos ou Demência", image: "/images/proc-demencia.jpg", category: "neurologia" },
  { title: "Eletroneuromiografia", image: "/images/proc-eletroneuromiografia.jpg", category: "neurologia" },
  { title: "Eletroencefalograma", image: "/images/proc-eeg.jpg", category: "neurologia" },
  { title: "Polissonografia", image: "/images/proc-polissonografia.jpg", category: "neurologia" },
  { title: "Angiografia Cerebral", image: "/images/proc-angiografia.jpg", category: "neurorradiologia" },
  { title: "Aneurisma Cerebral", image: "/images/proc-aneurisma.jpg", category: "neurorradiologia" },
  { title: "Neuropatia Periférica", image: "/images/proc-neuropatia-periferica.jpg", category: "neurologia" },
  { title: "Neurointervenção", image: "/images/proc-neurointervencao.jpg", category: "neurorradiologia" },
  { title: "Descompressão do Trigêmeo", image: "/images/proc-trigemeo.jpg", category: "neurocirurgia" },
  { title: "Doença de Parkinson", image: "/images/proc-parkinson.jpg", category: "neurologia" },
  { title: "Toxina Botulínica", image: "/images/proc-toxina-botulinica.jpg", category: "neurologia" },
  { title: "Epilepsia", image: "/images/proc-epilepsia.jpg", category: "neurologia" },
  { title: "Punção Lombar com Coleta de Líquor", image: "/images/proc-puncao-lombar.jpg", category: "neurologia" },
  { title: "Bloqueio de Nervo Occipital", image: "/images/proc-bloqueio-occipital.jpg", category: "neurologia" },
  { title: "Cirurgia de Coluna", image: "/images/proc-cirurgia-coluna.jpg", category: "neurocirurgia" },
  { title: "Artrodese de Coluna", image: "/images/proc-artrodese.jpg", category: "neurocirurgia" },
  { title: "Fibromialgia", image: "/images/proc-fibromialgia.jpg", category: "neurologia" },
  { title: "Esclerose Múltipla", image: "/images/proc-esclerose-multipla.jpg", category: "neurologia" },
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
    image: "/images/proc-parkinson.jpg",
  },
  {
    key: "neurocirurgia",
    title: "Neurocirurgia",
    description:
      "Tratamento especializado de tumores cerebrais, doenças da coluna, compressões nervosas e outras condições neurocirúrgicas, sempre buscando a melhor estratégia para cada paciente.",
    image: "/images/proc-tumor-cerebral.jpg",
  },
  {
    key: "neurorradiologia",
    title: "Neurorradiologia",
    description:
      "Abordagem de aneurismas cerebrais, doenças vasculares, angioplastia de carótida, angiografia e outros procedimentos realizados pelos vasos sanguíneos.",
    image: "/images/proc-aneurisma.jpg",
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
    image: "/images/dr-davi-said-araujo.jpg",
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
    image: "/images/dr-marconi-cosme.jpg",
  },
  {
    name: "Dr. Frederico Maia Prado",
    role: "Neurologista e Neurofisiologista Clínico | CRM-PI 4096 | RQE 3578",
    highlights: [
      "Neurologista e Neurofisiologista Clínico pela Universidade Federal Fluminense – UFF",
      "Mestre em Neurologia com ênfase em doenças neuromusculares pela UFF",
      "Doutorando pela UFPI e Professor de Medicina na UNICET",
      "Realiza consultas, eletroneuromiografia e bloqueios de nervos periféricos",
    ],
    ctaLabel: "Quero agendar minha consulta",
    image: "/images/dr-frederico-maia-prado.jpg",
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
    image: "/images/dr-romilto-pacheco.jpg",
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
  { name: "Terra", image: "/images/media-terra.png" },
  { name: "Globo", image: "/images/media-globo.png" },
  { name: "iG", image: "/images/media-ig.png" },
  { name: "UOL", image: "/images/media-uol.png" },
  { name: "Valor Econômico", image: "/images/media-valor-economico.png" },
  { name: "O Globo", image: "/images/media-oglobo.png" },
];

export const behindTheScenesVideo = {
  eyebrow: "Bastidores",
  title: "Veja um exame de eletroneuromiografia na prática",
  description:
    "Registro real de um atendimento na Clínica Neuropleno, mostrando como funciona o exame que avalia a atividade elétrica de nervos e músculos. Exame realizado com cuidado, orientação em todas as etapas e por equipe especializada em neurofisiologia.",
  video: "/videos/exame-eletroneuromiografia.mp4",
  poster: "/images/exame-eletroneuromiografia-poster.jpg",
};

export const facilityText =
  "Trazemos para Teresina-PI diagnósticos precisos, exames de alta complexidade e tratamentos personalizados — tudo com tecnologia de ponta e equipe médica referência nacional. Cuidar da sua saúde neurológica nunca foi tão seguro, moderno e humano.";

export const facilityImages = [
  "/images/facility-1.jpg",
  "/images/facility-2.jpg",
  "/images/facility-3.jpg",
];

export const steps = [
  {
    icon: "/images/step-1.svg",
    title: "Agende Sua Consulta",
    description: "Agende sua consulta pelo nosso WhatsApp com 1 clique",
  },
  {
    icon: "/images/step-2.svg",
    title: "Realize Sua Avaliação",
    description: "Avaliação médica personalizada, com recursos de ponta",
  },
  {
    icon: "/images/step-3.svg",
    title: "Realize Seus Exames e Tratamento",
    description: "Seja clínico ou cirúrgico, aqui você tem acesso ao plano",
  },
  {
    icon: "/images/step-4.svg",
    title: "Recupere Sua Qualidade de Vida",
    description: "Com diagnóstico certo e abordagem correta",
  },
];

export const symptoms = [
  "Dormência e Formigamento",
  "Esquecimentos e Confusão Mental",
  "Dores de cabeça frequentes",
  "Tremores, Fraqueza ou Dificuldade para segurar objetos",
  "Dores cervicais ou lombares intensas",
  "Alterações de fala ou compreensão",
  "Tonturas, Perda de visão súbita ou Paralisias",
  "Convulsões e Desmaios",
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

export const testimonials: Testimonial[] = [
  {
    name: "Marcia O.",
    quote:
      "Quando descobri que tinha um aneurisma, fiquei em choque. Mas a equipe da Neuropleno me acolheu desde o primeiro atendimento. A embolização foi um sucesso e hoje sigo minha vida com mais tranquilidade.",
  },
  {
    name: "Marcela G.",
    quote:
      "Convivi com enxaquecas por anos e achava que era normal. Na consulta com o Dr. entendi que tinha uma cefaleia crônica e comecei um tratamento que mudou completamente minha rotina. Hoje, voltei a trabalhar com muito mais qualidade de vida.",
  },
  {
    name: "Francisco R.",
    quote:
      "Meu pai teve um AVC e depois que ele começou o acompanhamento com a equipe da Neuropleno, vimos uma diferença enorme. O cuidado vai muito além do atendimento: é humano, atento e sempre baseado no que ele realmente precisa. Hoje ele está recuperando movimentos, a fala e, principalmente, a confiança.",
  },
  {
    name: "Ronaldo F.",
    quote:
      "Senti dormência nas pernas por meses até que fui diagnosticado com neuropatia. Fiz a eletroneuromiografia na própria clínica e fui tratado com muito cuidado por toda a equipe.",
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

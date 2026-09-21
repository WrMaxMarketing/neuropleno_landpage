export const site = {
  name: "Clínica Neuropleno",
  tagline: "Referência em Neurologia, Neurocirurgia e Neurorradiologia",
  city: "Teresina - PI",
  address: "R. Gov. Joca Pires, 2020 - Ininga, Teresina - PI - Centro Médico San Vitta",
  hours: "Segunda a Sexta - 08:00 às 18:00",
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
  headline: "Referência em Neurologia, Neurocirurgia e Neurorradiologia em Teresina",
    subheadline: "Do diagnóstico ao tratamento clínico, cirúrgico e endovascular de condições neurológicas complexas, com equipe especializada e tecnologia de alta precisão.",
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
  { title: "Cefaleia", image: "/images/proc-cefaleia.jpg", category: "neurologia" },
  { title: "Esquecimentos ou Demência", image: "/images/proc-demencia.jpg", category: "neurologia" },
  { title: "AVC", image: "/images/proc-avc.jpg", category: "neurologia" },
  { title: "Doenças Neurológicas Degenerativas", image: "/images/proc-doencas-degenerativas.jpg", category: "neurologia" },
  { title: "Eletroencefalograma", image: "/images/proc-eeg.jpg", category: "neurologia" },
  { title: "Polissonografia", image: "/images/proc-polissonografia.jpg", category: "neurologia" },
  { title: "Punção Lombar com Coleta de Líquor", image: "/images/proc-puncao-lombar.jpg", category: "neurologia" },
  { title: "Aneurisma Cerebral", image: "/images/proc-aneurisma.jpg", category: "neurorradiologia" },
  { title: "Angioplastia de Carótida", image: "/images/proc-angioplastia.jpg", category: "neurorradiologia" },
  { title: "Angiografia Cerebral", image: "/images/proc-angiografia.jpg", category: "neurorradiologia" },
  { title: "Eletroneuromiografia", image: "/images/proc-eletroneuromiografia.jpg", category: "neurologia" },
  { title: "Neuropatia Periférica", image: "/images/proc-neuropatia-periferica.jpg", category: "neurologia" },
  { title: "Miopatia", image: "/images/proc-miopatia.jpg", category: "neurologia" },
  { title: "Descompressão do Trigêmeo", image: "/images/proc-trigemeo.jpg", category: "neurocirurgia" },
  { title: "Doença de Parkinson", image: "/images/proc-parkinson.jpg", category: "neurologia" },
  { title: "Epilepsia", image: "/images/proc-epilepsia.jpg", category: "neurologia" },
  { title: "Cirurgia de Coluna", image: "/images/proc-cirurgia-coluna.jpg", category: "neurocirurgia" },
  { title: "Artrodese de Coluna", image: "/images/proc-artrodese.jpg", category: "neurocirurgia" },
  { title: "Cirurgia de Tumor Cerebral", image: "/images/proc-tumor-cerebral.jpg", category: "neurocirurgia" },
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
      "Diagnóstico e tratamento clínico de AVC, Parkinson, epilepsia, demências, cefaleias e outras condições neurológicas.",
    image: "/images/proc-parkinson.jpg",
  },
  {
    key: "neurocirurgia",
    title: "Neurocirurgia",
    description:
      "Procedimentos cirúrgicos para tumores cerebrais, cirurgia de coluna e descompressão do trigêmeo, com equipe especializada.",
    image: "/images/proc-tumor-cerebral.jpg",
  },
  {
    key: "neurorradiologia",
    title: "Neurorradiologia Intervencionista",
    description:
      "Tratamentos minimamente invasivos realizados pelos vasos sanguíneos: aneurisma cerebral, angioplastia de carótida, angiografia e tratamento endovascular.",
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
  credentials: string;
  specialty: string;
  image: string;
};

export const doctors: Doctor[] = [
  {
    name: "Dr. Davi Said Araújo",
    credentials: "CRM 4898-PI / RQE 3230",
    specialty:
      "Médico neurologista especialista em doenças cerebrovasculares e mestre em ciências médicas.",
    image: "/images/dr-davi-said-araujo.jpg",
  },
  {
    name: "Dr. Frederico Maia Prado",
    credentials: "CRM 4096-PI / RQE 3578/3579",
    specialty:
      "Médico neurologista e neurofisiologista, mestre em doenças neuromusculares, doutorando e professor de neurologia.",
    image: "/images/dr-frederico-maia-prado.jpg",
  },
  {
    name: "Dr. Romilto Pacheco",
    credentials: "CRM-PI 5160 / RQE 4472/5512",
    specialty:
      "Médico neurocirurgião pós-graduado em radiologia e neurorradiologia intervencionista, mestre em ciências das imagens. Preceptor da residência de Neurocirurgia do HGV.",
    image: "/images/dr-romilto-pacheco.jpg",
  },
  {
    name: "Dr. Marconi Cosme",
    credentials: "CRM-PI 5303 / RQE 3558/3791",
    specialty: "Médico neurologista especializado em neurofisiologia e eletroneuromiografia.",
    image: "/images/dr-marconi-cosme.jpg",
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
    question:
      "Quais são os principais sintomas que indicam a necessidade de procurar um neurologista?",
    answer:
      "Alterações neurológicas podem se manifestar de várias formas, muitas vezes de maneira sutil. Alguns dos sinais mais comuns que indicam a necessidade de avaliação com um neurologista incluem: dores de cabeça frequentes ou intensas, crises convulsivas, tremores, perda de força ou sensibilidade em braços ou pernas, esquecimentos fora do comum, tonturas recorrentes, dificuldades de equilíbrio, alterações na fala ou na visão, formigamentos persistentes e distúrbios do sono. Se você ou alguém próximo apresenta algum desses sintomas, o ideal é agendar uma consulta para investigação detalhada e, se necessário, iniciar o tratamento adequado o quanto antes.",
  },
  {
    question: "O que é a eletroneuromiografia?",
    answer:
      "A eletroneuromiografia é um exame que avalia a atividade elétrica dos nervos e músculos. Ele é indicado para diagnosticar doenças como neuropatias periféricas, síndrome do túnel do carpo, miopatias, compressões nervosas e outras alterações neuromusculares. O exame ajuda o neurologista a entender se os sintomas de dormência, formigamento, dor ou fraqueza muscular estão relacionados a problemas nos nervos ou nos músculos. Na Neuropleno, o exame é realizado por especialistas em neurofisiologia, com equipamentos de alta precisão e cuidado em cada etapa do processo.",
  },
  {
    question: "Como funciona o atendimento para pacientes com AVC ou histórico familiar?",
    answer:
      "Na Neuropleno, oferecemos um atendimento completo e individualizado para pacientes que sofreram um AVC ou que possuem histórico familiar da doença. Nosso foco está tanto na prevenção, por meio da identificação e controle de fatores de risco (como pressão alta, diabetes e alterações vasculares), quanto no acompanhamento pós-AVC, com avaliação neurológica contínua e estratégias para evitar novos eventos. Pacientes com histórico familiar de AVC também podem realizar exames específicos, como angiografia cerebral ou ultrassonografia de carótidas, além de consultas para análise do risco neurológico.",
  },
  {
    question: "É possível tratar enxaqueca e dores de cabeça crônicas com neurologista?",
    answer:
      "Sim. O neurologista é o especialista mais indicado para investigar e tratar enxaquecas e outros tipos de dores de cabeça crônicas. Muitas vezes, esses quadros têm causas neurológicas que precisam ser avaliadas com atenção. Na Neuropleno, o tratamento é feito com base em um plano personalizado, que pode incluir medicações preventivas, ajustes no estilo de vida, controle de gatilhos e, em alguns casos, exames complementares para descartar outras causas. O objetivo é reduzir a frequência, a intensidade das crises e melhorar a qualidade de vida do paciente.",
  },
  {
    question: "Como funciona o acompanhamento neurológico em casos de doenças degenerativas?",
    answer:
      "O acompanhamento neurológico em casos de doenças degenerativas, como Esclerose Múltipla ou ELA, é fundamental para preservar a qualidade de vida do paciente e retardar a progressão dos sintomas. Na Neuropleno, o cuidado é contínuo, individualizado e realizado por especialistas em neurologia clínica e neurofisiologia. O processo envolve avaliações periódicas, exames específicos, controle de sintomas motores e cognitivos, além de orientações sobre medicamentos, terapias complementares e suporte familiar. Nosso foco é oferecer segurança, funcionalidade e bem-estar ao longo de todas as fases da doença, com planos de cuidado ajustados às necessidades de cada paciente.",
  },
];

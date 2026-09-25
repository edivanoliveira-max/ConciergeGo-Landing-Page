import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateLead } from '@workspace/api-client-react';
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Check,
  ChevronDown,
  ClipboardList,
  Globe2,
  HeartHandshake,
  Languages,
  LifeBuoy,
  MapPinned,
  Menu,
  MessageCircle,
  PanelTop,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const appUrl = 'https://app.conciergego.com.br';
const signupUrl = `${appUrl}/cadastro`;
const whatsappNumber = '5588999932515';
const whatsappUrl = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const leadSchema = z.object({
  name: z.string().min(2, 'Digite seu nome.'),
  email: z.string().email('Digite um e-mail profissional válido.'),
  whatsapp: z.string().min(8, 'Digite um WhatsApp válido.'),
  propertyName: z.string().min(2, 'Digite o nome da hospedagem.'),
});
type LeadForm = z.infer<typeof leadSchema>;

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`cg-reveal ${delay ? `cg-delay-${delay}` : ''} ${className}`}>
      {children}
    </div>
  );
}

function BrandLogo({ dark = false, footer = false }: { dark?: boolean; footer?: boolean }) {
  return (
    <span className={`cg-brand ${footer ? 'cg-brand-footer' : ''}`} data-testid="brand-logo">
      <span className="cg-brand-mark">
        <img
          src="/assets/icone_1790293727716.png"
          alt="Marca ConciergeGo"
          data-testid="img-brand-mark"
        />
      </span>
      <span className={dark ? 'cg-brand-word-dark' : 'cg-brand-word'}>ConciergeGo</span>
    </span>
  );
}

function PhoneMockup() {
  const tiles = [
    { icon: Utensils, title: 'Cardápio', desc: 'Peça no quarto' },
    { icon: MapPinned, title: 'Passeios', desc: 'Explore a região' },
    { icon: BedDouble, title: 'Meu quarto', desc: 'Tudo por perto' },
    { icon: MessageCircle, title: 'Falar com a equipe', desc: 'Estamos aqui' },
  ];
  return (
    <div className="cg-phone-stage" aria-label="Exemplo da experiência do hóspede" data-testid="mockup-phone">
      <img
        className="cg-hero-photo"
        src="/assets/instagram-b3da0c1a-d0bf-4c20-8c10-140cb8127d15_1790293736933.png"
        alt="Hóspede usando o ConciergeGo no quarto"
        data-testid="img-hero-hospitality"
      />
      <div className="cg-phone-shadow" />
      <div className="cg-phone">
        <div className="cg-phone-screen">
          <span className="cg-phone-kicker">POUSADA CASA DO MAR</span>
          <h3>Olá, Marina</h3>
          <div className="cg-phone-cover" />
          <div className="cg-phone-grid">
            {tiles.map(({ icon: Icon, title, desc }) => (
              <div className="cg-phone-tile" key={title} data-testid={`card-phone-${title.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon className="cg-phone-icon" strokeWidth={1.6} />
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
          <div className="cg-phone-footer">
            <span>Início</span><span>Meus pedidos</span><span>Perfil</span>
          </div>
        </div>
      </div>
      <div className="cg-phone-sticker"><QrCode size={15} /> Acesso pelo quarto</div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="cg-dashboard-wrap" data-testid="mockup-dashboard">
      <div className="cg-dashboard">
        <div className="cg-dashboard-top">
          <strong>Visão da recepção</strong>
          <span>Hoje, 09:42 · online</span>
        </div>
        <div className="cg-dashboard-body">
          <div className="cg-dashboard-card">
            <h4>Pedidos em aberto</h4>
            <div className="cg-open-count">08 <small>solicitações</small></div>
            <div className="cg-bar"><span /></div>
            <div className="cg-dashboard-list">
              <div className="cg-dashboard-row"><span>Toalhas · Quarto 204</span><b>novo</b></div>
              <div className="cg-dashboard-row"><span>Jantar · Quarto 108</span><b>em preparo</b></div>
              <div className="cg-dashboard-row"><span>Transfer · Quarto 312</span><b>agendado</b></div>
            </div>
          </div>
          <div className="cg-dashboard-side">
            <div className="cg-dashboard-card">
              <h4>Tempo médio</h4>
              <div className="cg-metric">04:12<small>para primeira resposta</small></div>
            </div>
            <div className="cg-dashboard-card">
              <h4>Última avaliação</h4>
              <div className="cg-metric"><Star size={15} fill="#e8a17e" color="#e8a17e" /> 5,0<small>esta semana</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="cg-header" data-testid="site-header">
      <div className="cg-container cg-nav">
        <a href="#inicio" className="cg-logo" data-testid="link-logo" onClick={close}>
          <BrandLogo />
        </a>
        <nav className={`cg-nav-links ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
          <a href="#como-funciona" data-testid="link-nav-como-funciona" onClick={close}>Como funciona</a>
          <a href="#recursos" data-testid="link-nav-recursos" onClick={close}>Recursos</a>
          <a href="#planos" data-testid="link-nav-planos" onClick={close}>Planos</a>
          <a href="#quem-faz" data-testid="link-nav-quem-faz" onClick={close}>Quem faz</a>
        </nav>
        <div className="cg-nav-actions">
          <a href={appUrl} className="cg-login" target="_blank" rel="noreferrer" data-testid="link-entrar">Entrar</a>
          <a href={signupUrl} className="cg-button cg-button-primary" target="_blank" rel="noreferrer" data-testid="button-header-cta">
            Quero conhecer <ArrowUpRight className="cg-arrow" size={16} />
          </a>
          <button className="cg-mobile-menu" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="cg-hero" id="inicio" data-testid="section-hero">
      <div className="cg-container cg-hero-grid">
        <div className="cg-hero-copy">
          <Reveal>
            <div className="cg-eyebrow">A hospitalidade que continua depois do check-in</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 data-testid="text-hero-title">Menos perguntas repetidas.<br /><em>Mais tempo para cuidar.</em></h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="cg-hero-lede" data-testid="text-hero-subtitle">
              Concierge digital para hotéis e pousadas que transforma o QR Code do quarto em um canal simples, bonito e eficiente de atendimento — sem app para baixar.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="cg-hero-actions">
              <a className="cg-button cg-button-primary" href={signupUrl} target="_blank" rel="noreferrer" data-testid="button-hero-primary">
                Quero conhecer o ConciergeGo <ArrowRight className="cg-arrow" size={17} />
              </a>
              <a className="cg-button cg-button-ghost" href="#recursos" data-testid="button-hero-secondary">
                Ver como funciona <ChevronDown className="cg-arrow" size={16} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={4}>
            <ul className="cg-hero-notes" data-testid="list-hero-trust">
              <li><Check className="cg-check" /> Acesso pelo quarto</li>
              <li><Check className="cg-check" /> Sem download</li>
              <li><Check className="cg-check" /> 14 dias grátis</li>
            </ul>
          </Reveal>
        </div>
        <Reveal className="cg-hero-visual" delay={2}><PhoneMockup /></Reveal>
      </div>
    </section>
  );
}

const problems = [
  ['A recepção virou um balcão de perguntas repetidas', 'Wi-Fi, horário do café, senha do portão. A equipe sabe responder — só não deveria precisar repetir.'],
  ['O hóspede vai embora sem descobrir o melhor da região', 'Passeios, restaurantes e experiências ficam escondidos quando ninguém tem tempo de apresentar.'],
  ['Pedidos simples se perdem no meio da correria', 'Uma toalha, um travesseiro, um pedido de manutenção. O que não fica registrado, vira ruído.'],
  ['O WhatsApp pessoal não dá conta da operação', 'Conversas misturadas, pedidos sem histórico e uma equipe que nunca sabe quem respondeu.'],
];

function Problems() {
  return (
    <section className="cg-section cg-section-cream" id="problemas" data-testid="section-problemas">
      <div className="cg-container">
        <Reveal>
          <div className="cg-section-head">
            <div className="cg-eyebrow">A rotina como ela é</div>
            <h2 data-testid="text-problems-title">Você reconhece esses problemas?</h2>
            <p className="cg-section-intro">Cuidar de uma hospedagem é estar disponível. Mas estar disponível não precisa significar repetir as mesmas respostas o dia inteiro.</p>
          </div>
        </Reveal>
        <div className="cg-problems-grid">
          {problems.map(([title, desc], index) => (
            <Reveal key={title} delay={(index % 4) + 1}>
              <article className="cg-problem" data-testid={`card-problem-${index + 1}`}>
                <span className="cg-problem-num">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TransitionBand() {
  return (
    <section className="cg-section-aqua cg-pullquote" data-testid="section-transition">
      <div className="cg-container">
        <Reveal>
          <p data-testid="text-transition">O ConciergeGo coloca as respostas, os pedidos e as boas experiências <em>no lugar certo: nas mãos do hóspede.</em></p>
        </Reveal>
      </div>
    </section>
  );
}

const resources = [
  [Sparkles, 'Boas-vindas com a sua cara', 'Uma primeira impressão que já explica tudo o que sua hospedagem oferece.'],
  [ClipboardList, 'Pedidos em tempo real', 'Toalhas, limpeza e manutenção chegam organizados para quem precisa resolver.'],
  [MapPinned, 'Passeios que vendem', 'Apresente experiências locais e transforme curiosidade em reserva.'],
  [Utensils, 'Cardápio e loja de conveniência', 'Seu menu e itens extras disponíveis em poucos toques.'],
  [ArrowRight, 'Extensão de estadia', 'Convide o hóspede a ficar mais um pouco quando a experiência pede.'],
  [HeartHandshake, 'Identidade visual personalizada', 'O canal do hóspede com o jeito, as cores e a voz da sua marca.'],
  [Star, 'Avaliação integrada com Google', 'Direcione quem teve uma boa experiência para contar isso ao mundo.'],
  [LifeBuoy, 'Ajuda quando importa (SOS)', 'Um caminho claro para urgências, sem deixar ninguém procurando.'],
  [PanelTop, 'Painel sem complicação', 'Veja cada solicitação, responsável e prazo em um só lugar.'],
  [Languages, 'Fale com mais gente', 'Multi-idioma para receber hóspedes de diferentes lugares com a mesma clareza.'],
];

function Resources() {
  return (
    <section className="cg-section cg-section-green" id="recursos" data-testid="section-recursos">
      <div className="cg-container">
        <div className="cg-resource-layout">
          <Reveal>
            <div className="cg-section-head">
              <div className="cg-eyebrow">O cuidado em cada detalhe</div>
              <h2 data-testid="text-resources-title">Pequenos gestos.<br /><em>Uma estadia mais memorável.</em></h2>
              <p className="cg-section-intro">Tudo que o hóspede precisa, no momento em que precisa — e sem aumentar a pilha de tarefas da equipe.</p>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <a className="cg-button cg-button-ghost" href={whatsappUrl('Olá! Quero saber mais sobre o ConciergeGo')} target="_blank" rel="noreferrer" data-testid="button-resources-whatsapp">
              Conversar sobre minha hospedagem <ArrowUpRight className="cg-arrow" size={16} />
            </a>
          </Reveal>
        </div>
        <div className="cg-resource-grid">
          {resources.map(([Icon, title, desc], index) => {
            const ResourceIcon = Icon as typeof Sparkles;
            return (
              <Reveal key={title as string} delay={(index % 4) + 1}>
                <article className="cg-resource" data-testid={`card-resource-${index + 1}`}>
                  <div className="cg-resource-icon"><ResourceIcon strokeWidth={1.65} /></div>
                  <h3>{title as string}</h3>
                  <p>{desc as string}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const steps = [
  ['O hóspede aponta a câmera', 'Um QR Code no quarto abre o concierge direto no navegador. Sem senha, sem download, sem atrito.'],
  ['Encontra tudo em poucos toques', 'Informações, pedidos, cardápio e experiências locais reunidos num espaço simples e bonito.'],
  ['A equipe recebe e resolve', 'Cada solicitação aparece no painel certo, com clareza para agir e histórico para acompanhar.'],
];

function HowItWorks() {
  return (
    <section className="cg-section cg-section-cream" id="como-funciona" data-testid="section-como-funciona">
      <div className="cg-container cg-steps-layout">
        <div>
          <Reveal>
            <div className="cg-section-head">
              <div className="cg-eyebrow">Do QR Code à resolução</div>
              <h2 data-testid="text-how-title">Simples para o hóspede.<br /><em>Organizado para você.</em></h2>
              <p className="cg-section-intro">Uma jornada curta para quem está hospedado. Uma operação mais leve para quem faz a hospedagem acontecer.</p>
            </div>
          </Reveal>
          <div className="cg-steps">
            {steps.map(([title, desc], index) => (
              <Reveal key={title} delay={index + 1}>
                <article className="cg-step" data-testid={`card-step-${index + 1}`}>
                  <span className="cg-step-num">0{index + 1}</span>
                  <div><h3>{title}</h3><p>{desc}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="cg-dashboard-reveal" delay={2}><DashboardMockup /></Reveal>
      </div>
    </section>
  );
}

function Results() {
  const results = [['até 30%', 'menos interrupções'], ['+ reservas', 'para experiências locais'], ['mais 5★', 'na lembrança da estadia']];
  return (
    <section className="cg-results" data-testid="section-results">
      <div className="cg-container cg-results-grid">
        {results.map(([value, label], index) => (
          <Reveal key={value} delay={index + 1}>
            <div className="cg-result" data-testid={`metric-result-${index + 1}`}><strong>{value}</strong><span>{label}</span></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const plans = [
  { label: 'TRIAL', title: '14 dias grátis', price: '', desc: 'Sem cartão de crédito', features: ['Todos os recursos essenciais', 'Sem cartão de crédito', 'Configuração acompanhada'], cta: 'Começar teste grátis', href: signupUrl },
  { label: 'START', title: 'Plano Start', price: 'R$ 97', desc: 'Para começar leve, até 8 acomodações', features: ['Boas-vindas e informações', 'Solicitações e pedidos', 'Painel de gestão simples', 'Sem taxa de instalação'], cta: 'Quero o Start', href: whatsappUrl('Olá! Tenho interesse no plano Start do ConciergeGo') },
  { label: 'PREMIUM', title: 'Plano Premium', price: 'R$ 197', desc: 'Até 20 acomodações, experiência completa', features: ['Tudo do plano Start', 'Reserva de passeios', 'Multi-idioma (PT/EN/ES)', 'Cardápio digital', 'Sem taxa de instalação'], cta: 'Quero o Premium', href: whatsappUrl('Olá! Tenho interesse no plano Premium do ConciergeGo'), featured: true },
  { label: 'REDE PREMIUM', title: 'Rede Premium', price: 'R$ 397', desc: 'Para grupos com mais de uma hospedagem', priceRule: 'Até 3 propriedades inclusas + R$ 79/mês por propriedade adicional', features: ['Tudo do plano Premium, em cada propriedade', 'Visão consolidada da rede', 'Gestão centralizada', 'Sem taxa de instalação'], cta: 'Falar sobre a Rede Premium', href: whatsappUrl('Olá! Tenho interesse no plano Rede Premium do ConciergeGo') },
];

function Plans() {
  return (
    <section className="cg-section cg-section-cream" id="planos" data-testid="section-planos">
      <div className="cg-container">
        <Reveal>
          <div className="cg-plans-head">
            <div className="cg-section-head">
              <div className="cg-eyebrow">Sem letras miúdas</div>
              <h2 data-testid="text-plans-title">Uma escolha simples para uma operação mais leve</h2>
            </div>
            <p>Sem taxa de instalação, sem fidelidade.</p>
          </div>
        </Reveal>
        <div className="cg-plans-grid">
          {plans.map((plan, index) => (
            <Reveal key={plan.label} delay={(index % 4) + 1}>
              <article className={`cg-plan ${plan.featured ? 'featured' : ''}`} data-testid={`card-plan-${plan.label.toLowerCase().replaceAll(' ', '-')}`}>
                {plan.featured && <span className="cg-plan-badge">Mais escolhido</span>}
                <span className="cg-plan-label">{plan.label}</span>
                <h3>{plan.title}</h3>
                {plan.price && <p className="cg-plan-price">{plan.price}<small>/mês</small></p>}
                {plan.priceRule && <p className="cg-plan-rule"><span aria-hidden="true">+</span>{plan.priceRule}</p>}
                <p className="cg-plan-desc">{plan.desc}</p>
                <ul className="cg-plan-features">
                  {plan.features.map((feature) => <li className="cg-plan-feature" key={feature}><Check /> {feature}</li>)}
                </ul>
                <a className={`cg-button ${plan.featured ? 'cg-button-primary' : 'cg-button-ink'}`} href={plan.href} target="_blank" rel="noreferrer" data-testid={`button-plan-${plan.label.toLowerCase().replaceAll(' ', '-')}`}>
                  {plan.cta} <ArrowUpRight className="cg-arrow" size={16} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="cg-plan-note" data-testid="text-plans-note">Cobrança mensal, sem fidelidade. Cancelamento a qualquer momento.</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="cg-section cg-section-dark" id="quem-faz" data-testid="section-quem-faz">
      <div className="cg-container cg-about">
        <Reveal>
          <div className="cg-about-mark" data-testid="mark-solus-design">
            <img src="/assets/icone_1790293727716.png" alt="Símbolo ConciergeGo" />
          </div>
        </Reveal>
        <Reveal delay={2}>
          <div className="cg-about-copy">
            <div className="cg-eyebrow">Por trás da ferramenta</div>
            <h2 data-testid="text-about-title">Tecnologia com olhar de hospitalidade</h2>
            <p>O ConciergeGo é desenvolvido pela Solus Design, uma empresa brasileira com 20 anos de experiência em tecnologia para turismo e hospedagem. Conhecemos a operação, respeitamos o seu tempo e construímos ferramentas para a experiência acontecer de verdade.</p>
            <div className="cg-about-sign">Solus Design — 20 anos criando para receber bem</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const createLead = useCreateLead();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', whatsapp: '', propertyName: '' },
  });
  const onSubmit = (data: LeadForm) => {
    setSubmitted(false);
    createLead.mutate({ data }, {
      onSuccess: () => {
        setSubmitted(true);
        form.reset();
      },
    });
  };
  return (
    <section className="cg-section cg-section-green cg-contact" id="contato" data-testid="section-contato">
      <div className="cg-container cg-contact-layout">
        <Reveal>
          <div className="cg-contact-copy">
            <div className="cg-eyebrow">O próximo passo é leve</div>
            <h2 data-testid="text-contact-title">Comece grátis por 14 dias. <em>Sem cartão de crédito.</em></h2>
            <p>Prefere conversar antes de criar sua conta? Deixe seu contato que a gente te chama.</p>
            <a className="cg-whatsapp-link" href={whatsappUrl('Olá! Quero saber mais sobre o ConciergeGo')} target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp">
              <MessageCircle /> Falar no WhatsApp agora <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
        <Reveal delay={2}>
          <div className="cg-form-card">
            {submitted ? (
              <div className="cg-form-success" data-testid="status-form-success">
                <strong>Recebemos seu contato.</strong><br />Em breve a gente conversa sobre a rotina da sua hospedagem.
              </div>
            ) : (
              <>
                <h3>Vamos conversar sobre a sua hospedagem?</h3>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate data-testid="form-contact">
                  <div className="cg-form-grid">
                    <label className="cg-field-wrap">
                      <span className="cg-field-label">Seu nome</span>
                      <input className="cg-field" placeholder="Como podemos te chamar?" {...form.register('name')} data-testid="input-lead-name" />
                      {form.formState.errors.name && <span className="cg-form-error">{form.formState.errors.name.message}</span>}
                    </label>
                    <label className="cg-field-wrap">
                      <span className="cg-field-label">E-mail profissional</span>
                      <input className="cg-field" type="email" placeholder="voce@hospedagem.com.br" {...form.register('email')} data-testid="input-lead-email" />
                      {form.formState.errors.email && <span className="cg-form-error">{form.formState.errors.email.message}</span>}
                    </label>
                    <label className="cg-field-wrap">
                      <span className="cg-field-label">WhatsApp</span>
                      <input className="cg-field" type="tel" placeholder="(00) 00000-0000" {...form.register('whatsapp')} data-testid="input-lead-whatsapp" />
                      {form.formState.errors.whatsapp && <span className="cg-form-error">{form.formState.errors.whatsapp.message}</span>}
                    </label>
                    <label className="cg-field-wrap">
                      <span className="cg-field-label">Nome da hospedagem</span>
                      <input className="cg-field" placeholder="Pousada, hotel ou rede" {...form.register('propertyName')} data-testid="input-lead-property" />
                      {form.formState.errors.propertyName && <span className="cg-form-error">{form.formState.errors.propertyName.message}</span>}
                    </label>
                  </div>
                  {createLead.isError && <p className="cg-form-error" role="alert" data-testid="status-form-error">Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.</p>}
                  <button className="cg-button cg-button-primary" type="submit" disabled={createLead.isPending} data-testid="button-submit-lead">
                    {createLead.isPending ? 'Enviando seu contato…' : 'Quero começar a conversa'}
                    {!createLead.isPending && <ArrowRight className="cg-arrow" size={17} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="cg-footer" data-testid="site-footer">
      <div className="cg-container">
        <div className="cg-footer-main">
          <a href="#inicio" className="cg-footer-logo" data-testid="link-footer-logo"><BrandLogo footer /></a>
          <p className="cg-footer-copy">Uma criação Solus Design — 20 anos de tecnologia para turismo</p>
          <div className="cg-footer-links">
            <a href="tel:+5588999932515" data-testid="link-footer-phone"><Phone size={13} /> (88) 99993-2515</a>
            <a href="https://solusdesign.com.br" target="_blank" rel="noreferrer" data-testid="link-footer-solus">solusdesign.com.br <ArrowUpRight size={13} /></a>
          </div>
        </div>
        <div className="cg-footer-bottom">
          <span>© {new Date().getFullYear()} ConciergeGo. Feito para receber bem.</span>
          <a href="#inicio" data-testid="link-back-top">Voltar ao início ↑</a>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a className="cg-float-whatsapp" href={whatsappUrl('Olá! Quero saber mais sobre o ConciergeGo')} target="_blank" rel="noreferrer" data-testid="button-floating-whatsapp">
      <MessageCircle /> Falar no WhatsApp
    </a>
  );
}

function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -30px' },
    );
    const elements = pageRef.current?.querySelectorAll('.cg-reveal');
    elements?.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="cg-page" ref={pageRef}>
      <Header />
      <main>
        <Hero />
        <Problems />
        <TransitionBand />
        <Resources />
        <HowItWorks />
        <Results />
        <Plans />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
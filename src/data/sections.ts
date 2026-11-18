/**
 * Content for the portfolio sections opened from the hanging stars.
 * `id` doubles as the URL hash (`#about`), so links anywhere on the page
 * (navbar, intro text, stars) open the matching section.
 */
import { projects, type Project } from './projects';

export type ServiceIcon = 'devices' | 'pen' | 'video' | 'code';

export interface Service {
  title: string;
  description: string;
  icon: ServiceIcon;
}

export interface ContactLink {
  type: 'email' | 'whatsapp' | 'instagram';
  /** Button text: the channel's name, not the address/number itself. */
  label: string;
  href: string;
}

/** Contact channels: used by the Contact section and the header's "Let's Talk". */
export const contacts: ContactLink[] = [
  { type: 'email', label: 'Email', href: 'mailto:barbbportfolio@gmail.com' },
  // wa.me needs the international format: 54 (AR) + 9 (mobile) + area code + number.
  { type: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/5491123101994' },
  { type: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/barrcarballo/' },
];

export interface Section {
  id: string;
  /** Label shown on the hanging star. */
  label: string;
  /** Title; the first letter is rendered in the script font. */
  title: string;
  /** Optional highlighted word(s) appended to the title, shown in accent colour. */
  accent?: string;
  /** Body copy. Trusted static HTML (only <strong> is used). */
  body?: string;
  /** When present, the section shows a project browser instead of body copy. */
  projects?: Project[];
  /** When present, the section shows a grid of services instead of body copy. */
  services?: Service[];
  /** Contact links shown under the body. */
  contacts?: ContactLink[];
  /** When true, the section hosts the visitor guestbook at `#<id>/estrellas`. */
  guestbook?: boolean;
  /** Optional call-to-action button under the body. `href` may be an in-page route. */
  cta?: {
    label: string;
    href: string;
    /** Short line shown right above the button. Trusted static HTML (only <strong>). */
    intro?: string;
  };
}

export const sections: Section[] = [
  {
    id: 'about',
    label: 'About me',
    title: 'Simple, nunca',
    accent: 'básica',
    body: 'Soy <strong>diseñadora multimedia</strong> y me especializo en UX/UI. Creo que las mejores interfaces son las que no te hacen pensar, y las mejores marcas, las que no te podés sacar de la cabeza.',
  },
  {
    id: 'work',
    label: 'Works',
    title: 'Mis',
    accent: 'trabajos',
    projects,
  },
  {
    id: 'services',
    label: 'Services',
    title: 'Lo que',
    accent: 'hago',
    services: [
      {
        title: 'Diseño web y mobile',
        description: 'Interfaces claras y con personalidad, del wireframe al prototipo.',
        icon: 'devices',
      },
      {
        title: 'Diseño gráfico',
        description: 'Identidades, branding y piezas que no se olvidan.',
        icon: 'pen',
      },
      {
        title: 'Edición de video',
        description: 'Piezas audiovisuales con ritmo, para redes y marcas.',
        icon: 'video',
      },
      {
        title: 'Desarrollo front y back',
        description: 'Llevo el diseño a código: sitios y apps que funcionan de verdad.',
        icon: 'code',
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Hablemos',
    body: '¿Tenés un proyecto en mente? Escribime.',
    contacts,
    guestbook: true,
    cta: {
      label: 'Dejá tu estrella',
      href: '#contact/estrellas',
      intro: '¿Solo pasabas? Dejá tu estrella en el <strong>cielo de visitas</strong>.',
    },
  },
];

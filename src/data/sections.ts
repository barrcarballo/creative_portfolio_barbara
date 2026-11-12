/**
 * Content for the portfolio sections opened from the hanging stars.
 * `id` doubles as the URL hash (`#about`), so links anywhere on the page
 * (navbar, intro text, stars) open the matching section.
 */
import { projects, type Project } from './projects';

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
  /** When true, the section hosts the visitor guestbook at `#<id>/estrellas`. */
  guestbook?: boolean;
  /** Optional call-to-action button under the body. `href` may be an in-page route. */
  cta?: { label: string; href: string };
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
  // TODO: replace placeholder copy for the sections below once it's designed.
  {
    id: 'services',
    label: 'Services',
    title: 'Lo que',
    accent: 'hago',
    body: 'Contenido en preparación.',
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Hablemos',
    // TODO: add contact details (email, socials).
    body: '¿Pasaste por acá? Dejá tu estrella en el <strong>cielo de visitas</strong>: un nombre, un mensaje y un lugar donde brillar.',
    guestbook: true,
    cta: { label: 'Dejá tu estrella', href: '#contact/estrellas' },
  },
];

/**
 * Projects listed in the "Works" section.
 * `roles` is what Barbara did on the project; shown as tags.
 * Images live in `src/assets/projects/<id>/` (see lib/projectImages.ts);
 * `imageAlts` describes them in the same order, for screen readers.
 */
export interface Project {
  id: string;
  name: string;
  roles: string[];
  description: string;
  imageAlts?: string[];
  /** Descriptions for the images in the card (`<id>/ficha/`), same order. */
  cardImageAlts?: string[];
  /** External links; each button only shows when its URL is set. */
  links?: {
    /** Full case study (Behance, PDF, Notion…). */
    caseStudy?: string;
    /** Interactive prototype (Figma, deployed site…). */
    prototype?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'loopies',
    name: 'Loopies',
    roles: ['Identidad', 'Diseño de app'],
    imageAlts: ['Logo de Loopies en violeta, con las dos “o” dibujadas como espirales'],
    cardImageAlts: ['Cuatro pantallas de la app de Loopies: inicio, menú de cookies, puntos acumulados y perfil'],
    // TODO: add URLs.
    links: { caseStudy: 'https://www.figma.com/proto/ZItD0tuRLJQxi8Rb3Hp2wT/Loopies---version-2.0?node-id=63-4378&viewport=377%2C178%2C0.06&t=G1F3lZ1kHUXPkQYK-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=63%3A4378&page-id=63%3A4377', prototype: 'https://www.figma.com/proto/vxVygBysZXcy7lka1a1715/Proyecto-final---Figma?node-id=2118-1544&viewport=207%2C-125%2C0.13&t=ReseP4MRra162ihD-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2118%3A1544&page-id=0%3A1' },
    description:
      'Loopies es una pâtisserie con un toque cannábico. El nombre sale de “Loop”, que así se llama a los bucles de la montaña rusa. Este juego suele relacionarse con la diversión y podría considerarse un “viaje”, una palabra que suele ser parte de la jerga de la marihuana. Básicamente, todo el branding gira alrededor del nombre. El concepto apunta a lo creativo, innovador y colorido buscando, aún así, generar empatía con los clientes utilizando elementos ya conocidos por ellos.',
  },
  {
    id: 'ketupe',
    name: 'KeTuPé',
    roles: ['Rediseño web', 'Nuevo lanzamiento'],
    description:
      'KeTuPé es una marca de ropa urbana que propone prendas pensadas para usarse afuera, en la ciudad y en el día a día. La marca se inspira en el movimiento, el calor y los cuerpos reales, y busca construir una identidad cercana, auténtica y visualmente fuerte. El sitio web funciona como un espacio de exploración visual, donde la fotografía lifestyle y la comunidad ocupan un rol central dentro de la experiencia.',
  },
  {
    id: 'studio3',
    name: 'Studio3',
    roles: ['UI web', 'Frontend'],
    description: 'Studio3 es un estudio creativo de diseñadoras multimediales.',
  },
  {
    id: 'girliesout',
    name: 'GirliesOut',
    roles: ['UX/UI', 'App mobile iOS'],
    description:
      'GirliesOut es una app para que las jóvenes encuentren planes divertidos y seguros en la Ciudad de Buenos Aires.',
  },
  {
    id: 'frameit',
    name: 'FrameIt',
    roles: ['Identidad de marca', 'Branding', 'UX/UI', 'Modelado 3D', 'Frontend', 'Backend'],
    description:
      'FrameIt es una cabina de fotos portátil y autónoma, diseñada para transformar cualquier evento en una experiencia memorable. A diferencia de las cabinas de alquiler genéricas, FrameIt combina tecnología, diseño de producto y creatividad visual en un dispositivo compacto que se adapta a bodas, fiestas corporativas y festivales. Cada captura se convierte en un recuerdo personalizado a través de marcos generativos únicos, tiras fotográficas y una galería digital que conecta lo físico con lo digital. FrameIt no es solo una cabina de fotos: es una pieza de diseño que documenta momentos y los convierte en contenido compartible.',
  },
];

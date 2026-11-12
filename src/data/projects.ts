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
    imageAlts: ['Logo de KeTuPé: las letras KTP en marrón'],
    cardImageAlts: [
      'Rediseño del sitio de KeTuPé en desktop y mobile: banner de la colección Verano 26, best sellers y sección para postularse como modelo',
    ],
    // TODO: add URLs.
    links: { caseStudy: 'https://www.figma.com/proto/LqvylADtneHCxVFZ1p5jjG/KTP---Redesign?node-id=1-3&viewport=238%2C346%2C0.04&t=1NMWSHgg82wNWQFV-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=1%3A3&page-id=0%3A1', prototype: 'https://www.figma.com/proto/LqvylADtneHCxVFZ1p5jjG/KTP---Redesign?node-id=27-227&viewport=238%2C346%2C0.04&t=1NMWSHgg82wNWQFV-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=1%3A3&page-id=0%3A1' },
    description:
      'KeTuPé es una marca de ropa urbana que propone prendas pensadas para usarse afuera, en la ciudad y en el día a día. La marca se inspira en el movimiento, el calor y los cuerpos reales, y busca construir una identidad cercana, auténtica y visualmente fuerte. El sitio web funciona como un espacio de exploración visual, donde la fotografía lifestyle y la comunidad ocupan un rol central dentro de la experiencia.',
  },
  {
    id: 'studio3',
    name: 'Studio3',
    roles: ['UI web', 'Frontend'],
    imageAlts: ['Logo de Studio3: la palabra “studio” con un 3 en superíndice'],
    cardImageAlts: [
      'Landing completa de Studio3: hero “Think. Build. Connect.”, servicios en pestañas de colores, el equipo y una grilla de trabajos',
    ],
    // TODO: add URLs.
    links: { caseStudy: '', prototype: 'https://prog3-tp4-ecommerce.vercel.app/' },
    description: 'Studio3 es un estudio creativo de diseñadoras multimediales.',
  },
  {
    id: 'girliesout',
    name: 'GirliesOut',
    roles: ['UX/UI', 'App mobile iOS'],
    imageAlts: ['Ícono de la app GirliesOut: una “g” blanca sobre fondo rojo, rodeada de destellos'],
    cardImageAlts: [
      'Cinco pantallas de la app GirliesOut: login, inicio con nuevos eventos, reservas, búsqueda por categorías y perfil',
    ],
    // TODO: add URLs.
    links: { caseStudy: 'https://www.figma.com/proto/elhhQCSv6907oJ2NPpJsRS/girliesOut---iOS-app?node-id=659-3980&viewport=429%2C339%2C0.09&t=k3o58UVgxdbvBqNy-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=659%3A3980&page-id=659%3A3979', prototype: 'https://www.figma.com/proto/elhhQCSv6907oJ2NPpJsRS/girliesOut---iOS-app?node-id=657-5331&viewport=914%2C519%2C0.07&t=npsYikpPKCHYrZCA-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=657%3A5331&page-id=237%3A682' },
    description:
      'GirliesOut es una app para que las jóvenes encuentren planes divertidos y seguros en la Ciudad de Buenos Aires.',
  },
  {
    id: 'frameit',
    name: 'FrameIt',
    roles: ['Identidad de marca', 'Branding', 'UX/UI', 'Modelado 3D', 'Frontend', 'Backend'],
    imageAlts: ['Logo de FrameIt: la palabra “Frame” y “it” dentro de un recuadro de visor de cámara'],
    cardImageAlts: [
      'Seis pantallas de la cabina FrameIt: inicio, elección de modo, captura con cuenta regresiva, preview de la tira, elección de fondo y código QR para descargar la foto',
    ],
    // TODO: add URLs.
    links: { caseStudy: 'https://drive.google.com/file/d/1WQWu3S93WCUfjgjxhdi3wVistryqNox0/view?usp=sharing', prototype: 'https://frameit-lac.vercel.app/' },
    description:
      'FrameIt es una cabina de fotos portátil y autónoma, diseñada para transformar cualquier evento en una experiencia memorable. A diferencia de las cabinas de alquiler genéricas, FrameIt combina tecnología, diseño de producto y creatividad visual en un dispositivo compacto que se adapta a bodas, fiestas corporativas y festivales. Cada captura se convierte en un recuerdo personalizado a través de marcos generativos únicos, tiras fotográficas y una galería digital que conecta lo físico con lo digital. FrameIt no es solo una cabina de fotos: es una pieza de diseño que documenta momentos y los convierte en contenido compartible.',
  },
];

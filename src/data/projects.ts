/**
 * Projects listed in the "Works" section.
 * `roles` is what Barbara did on the project; shown as tags.
 */
export interface Project {
  id: string;
  name: string;
  roles: string[];
  description: string;
}

export const projects: Project[] = [
  {
    id: 'loopies',
    name: 'Loopies',
    roles: ['Identidad', 'Diseño de app'],
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

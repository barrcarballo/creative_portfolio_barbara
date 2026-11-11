import type { ImageMetadata } from 'astro';

/**
 * Project images are discovered from the file system, ordered by file name
 * (e.g. `1-logo.svg`, `2-app.png`):
 *
 * - `src/assets/projects/<id>/*`        → star gallery (the first is the cover).
 * - `src/assets/projects/<id>/ficha/*`  → shown in the project card, under the description.
 *
 * How each gallery image fills the star:
 * - Photos (jpg, png, webp, avif) cover the whole star and get cropped.
 * - SVGs are treated as logos: shown whole and centred, never cropped.
 */
export type ImageFit = 'cover' | 'contain';

export interface ProjectImage {
  src: ImageMetadata;
  fit: ImageFit;
}

type Modules = Record<string, { default: ImageMetadata }>;

const galleryModules: Modules = import.meta.glob(
  '/src/assets/projects/*/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true },
);

const cardModules: Modules = import.meta.glob(
  '/src/assets/projects/*/ficha/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true },
);

/** Images of one project in a glob result, sorted by file name. */
function collect(modules: Modules, projectId: string): ImageMetadata[] {
  return Object.entries(modules)
    .filter(([path]) => path.split('/projects/')[1]?.split('/')[0] === projectId)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, module]) => module.default);
}

export function getProjectImages(projectId: string): ProjectImage[] {
  return collect(galleryModules, projectId).map((image) => ({
    src: image,
    fit: image.format === 'svg' ? 'contain' : 'cover',
  }));
}

export function getProjectCardImages(projectId: string): ImageMetadata[] {
  return collect(cardModules, projectId);
}

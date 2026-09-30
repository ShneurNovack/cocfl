// Builds a Florida outline and a lat/lng projector at build time from us-atlas.
import { feature } from 'topojson-client';
import states from 'us-atlas/states-10m.json';

const topo = states as any;
const fl: any = (feature(topo, topo.objects.states) as any).features.find((f: any) => f.id === '12');

const W = 600;
const PAD = 12;
const K = Math.cos((28 * Math.PI) / 180);
const pts: [number, number][] = [];
for (const poly of fl.geometry.coordinates) for (const ring of poly) for (const p of ring) pts.push(p);
const xs = pts.map((p) => p[0] * K);
const ys = pts.map((p) => -p[1]);
const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
const scale = (W - PAD * 2) / (maxX - minX);
export const MAP_W = W;
export const MAP_H = Math.round((maxY - minY) * scale + PAD * 2);

export function project(lat: number, lng: number) {
  return { x: +((lng * K - minX) * scale + PAD).toFixed(1), y: +((-lat - minY) * scale + PAD).toFixed(1) };
}

// drop tiny islands (keys) to keep the path light, but keep enough to read as Florida
export const FL_PATH = fl.geometry.coordinates
  .map((poly: any) => poly[0])
  .filter((ring: any) => ring.length > 12)
  .map((ring: any) =>
    'M' +
    ring
      .map(([lng, lat]: [number, number]) => {
        const { x, y } = project(lat, lng);
        return `${x},${y}`;
      })
      .join('L') +
    'Z',
  )
  .join('');

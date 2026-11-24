// =====================================================================
// LEVELS — the worlds in order, their screens, print style and food.
// Breakables placed through Havre (De Soif's are in its screens).
// =====================================================================
S1.items = [{ k: 'barrel', x: 240, z: 80 }, { k: 'fishcrate', x: 300, z: 92 }, { k: 'pot', x: 330, z: 20 }, { k: 'crate', x: 560, z: 60 }, { k: 'barrel', x: 600, z: 14 }, { k: 'cart', x: 820, z: 40 }, { k: 'pot', x: 1000, z: 90 }, { k: 'fishcrate', x: 1040, z: 96 },
  { k: 'barrel', x: 1480, z: 30 }, { k: 'crate', x: 1540, z: 96 }, { k: 'pot', x: 1760, z: 20 }, { k: 'barrel', x: 1800, z: 70 }];
S2.items = [{ k: 'fishcrate', x: 300, z: 70 }, { k: 'stall', x: 560, z: 90 }, { k: 'barrel', x: 680, z: 20 }, { k: 'cart', x: 940, z: 60 }, { k: 'fishcrate', x: 1060, z: 90 }, { k: 'stall', x: 1320, z: 30 }, { k: 'barrel', x: 1460, z: 86 },
  { k: 'crate', x: 1580, z: 20 }, { k: 'fishcrate', x: 1880, z: 96 }, { k: 'cart', x: 2000, z: 40 }, { k: 'barrel', x: 2260, z: 80 }, { k: 'pot', x: 2400, z: 20 }];
S3.items = [{ k: 'pot', x: 320, z: 80 }, { k: 'pot', x: 700, z: 20 }, { k: 'fishcrate', x: 1100, z: 60 }, { k: 'barrel', x: 1480, z: 30 }, { k: 'pot', x: 1760, z: 90 }, { k: 'fishcrate', x: 2200, z: 40 }, { k: 'cart', x: 2380, z: 70 }];
S4.items = [{ k: 'table', x: 520, z: 80 }, { k: 'chair', x: 490, z: 86 }, { k: 'chair', x: 552, z: 86 }, { k: 'bin', x: 640, z: 12 }, { k: 'newsbox', x: 680, z: 14 }, { k: 'moto', x: 1080, z: 90 }, { k: 'table', x: 1200, z: 30 }, { k: 'chair', x: 1170, z: 36 },
  { k: 'chair', x: 1232, z: 36 }, { k: 'barrel', x: 1340, z: 90 }, { k: 'car', x: 1700, z: 30 }];
// the big scenic moments ride on particular waves
S1.zones[0].waves[1].set = 'freighter'; S4.zones[1].waves[1].set = 'assault'; D1.zones[0].waves[1].set = 'crane'; D4.zones[1].waves[1].set = 'truck';
const LEVELS = [
  { id: 'havre', screens: [S1, S2, S3, S4], style: 4, name: { fr: 'MONDE 1 · HAVRE', en: 'WORLD 1 · HAVRE' } },
  { id: 'soif', screens: [D1, D2, D3, D4], style: 0, name: { fr: 'MONDE 2 · DE SOIF', en: 'WORLD 2 · DE SOIF' } }
];
let LEVEL = 0;

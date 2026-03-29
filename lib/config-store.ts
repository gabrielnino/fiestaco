import fs from 'fs';
import path from 'path';
import { BASE_PRICE, ADDONS, DRINKS, FLAVORS } from './constants';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRICES_FILE = path.join(DATA_DIR, 'prices.json');

export interface PricesConfig {
  basePrice: number;
  addons: Record<string, number>;
  drinks: Record<string, number>;
  flavors: Record<string, number>;
}

export function getDefaultPrices(): PricesConfig {
  const addons: Record<string, number> = {};
  ADDONS.forEach(a => addons[a.id] = a.price || 0);

  const drinks: Record<string, number> = {};
  DRINKS.forEach(d => drinks[d.id] = d.price || 0);

  const flavors: Record<string, number> = {};
  FLAVORS.forEach(f => {
    // We explicitly store 0 for flavors without a surcharge so they can be modified
    flavors[f.id] = f.surcharge || 0;
  });

  return {
    basePrice: BASE_PRICE,
    addons,
    drinks,
    flavors
  };
}

export function getPrices(): PricesConfig {
  try {
    if (fs.existsSync(PRICES_FILE)) {
      const data = fs.readFileSync(PRICES_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Merge with defaults to ensure new items implicitly get a default price
      return {
        ...getDefaultPrices(),
        ...parsed,
        addons: { ...getDefaultPrices().addons, ...(parsed.addons || {}) },
        drinks: { ...getDefaultPrices().drinks, ...(parsed.drinks || {}) },
        flavors: { ...getDefaultPrices().flavors, ...(parsed.flavors || {}) },
      };
    }
  } catch (e) {
    console.error('Error reading prices.json', e);
  }
  return getDefaultPrices();
}

export function savePrices(prices: Partial<PricesConfig>): PricesConfig {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const current = getPrices();
  const updated = {
    ...current,
    ...prices,
    addons: { ...current.addons, ...(prices.addons || {}) },
    drinks: { ...current.drinks, ...(prices.drinks || {}) },
    flavors: { ...current.flavors, ...(prices.flavors || {}) },
  };
  fs.writeFileSync(PRICES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

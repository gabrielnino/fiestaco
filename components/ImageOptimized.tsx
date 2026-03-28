import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

// Mapeo de alt text para imágenes locales
const LOCAL_ALT_TEXT_MAP: Record<string, string> = {
  // Flavors
  '/images/flavors/al_pastor.webp': 'Al Pastor Tacos - Traditional Mexican marinated pork with pineapple and spices',
  '/images/flavors/barbacoa_cordero.webp': 'Barbacoa Lamb Tacos - Slow-cooked lamb with traditional Mexican barbacoa seasoning',
  '/images/flavors/carnitas.webp': 'Carnitas Tacos - Slow-cooked pulled pork with citrus and herbs',
  '/images/flavors/cauliflower.webp': 'Cauliflower Tacos - Roasted cauliflower with Mexican spices, vegetarian option',
  '/images/flavors/chipotle_beans.webp': 'Chipotle Bean Tacos - Smoky chipotle beans with peppers and onions',
  '/images/flavors/fish.webp': 'Fish Tacos - Beer-battered fish with cabbage slaw and lime crema',
  '/images/flavors/pierna.webp': 'Pierna Tacos - Slow-roasted pork leg with traditional seasonings',
  '/images/flavors/pollo_mole.webp': 'Pollo Mole Tacos - Chicken with rich chocolate mole sauce',
  '/images/flavors/pollo_pibil.webp': 'Pollo Pibil Tacos - Achiote-marinated chicken with citrus',
  '/images/flavors/tinga_veg.webp': 'Tinga Vegetable Tacos - Spicy shredded vegetables, vegan option',
  '/images/flavors/chorizo.webp': 'Chorizo Tacos - Spicy Mexican sausage with peppers',
  '/images/flavors/elote.webp': 'Elote Tacos - Mexican street corn style',
  '/images/flavors/lengua.webp': 'Lengua Tacos - Traditional beef tongue',
  '/images/flavors/picadillo.webp': 'Picadillo Tacos - Ground beef with potatoes and carrots',
  '/images/flavors/shrimp.webp': 'Shrimp Tacos - Grilled shrimp with garlic and lime',
  
  // Addons
  '/images/addons/cheese.webp': 'Mexican Cheese - Queso fresco and cotija cheese blend',
  
  // Background y logo
  '/background.webp': 'Mexican food background with traditional patterns',
  '/logo.webp': 'Fiestaco Logo - Skull design with Mexican aesthetic',
  
  // Placeholder
  '/images/placeholder.webp': 'Taco placeholder image',
};

// Mapeo de imágenes externas (Wikipedia)
const EXTERNAL_ALT_TEXT_MAP: Record<string, string> = {
  'guacomole.jpg': 'Fresh Guacamole - Hass avocado with lime and cilantro',
  'Pico_de_Gallo': 'Pico de Gallo - Fresh tomato salsa with onions and cilantro',
  'sour_cream_and_cheese.jpg': 'Mexican Crema - Tangy crema with lime zest',
  'jalapeno_capsicum': 'Pickled Jalapeños - Spicy pickled peppers',
  'Salsa_verde.jpg': 'Salsa Verde - Green tomatillo salsa',
  'Corona_Extra_beer_bottle': 'Corona Beer - Mexican lager beer',
  'Budweiser_bottle_close-up.jpg': 'Budweiser Lager - American lager beer',
  'Pacifico_Clara.jpeg': 'Pacifico Lager - Mexican lager beer',
};

interface ImageOptimizedProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  fallbackAlt?: string;
  priority?: boolean;
}

export default function ImageOptimized({
  src,
  alt,
  fallbackAlt = 'Fiestaco image',
  priority = false,
  loading = 'lazy',
  ...props
}: ImageOptimizedProps) {
  const [error, setError] = useState(false);
  
  // Determinar alt text automáticamente
  const getAltText = () => {
    if (alt) return alt;
    
    const srcString = typeof src === 'string' ? src : '';
    
    // Buscar en mapa local
    if (srcString in LOCAL_ALT_TEXT_MAP) {
      return LOCAL_ALT_TEXT_MAP[srcString];
    }
    
    // Buscar en mapa externo (Wikipedia)
    if (srcString.includes('upload.wikimedia.org')) {
      const filename = srcString.split('/').pop() || '';
      for (const [key, value] of Object.entries(EXTERNAL_ALT_TEXT_MAP)) {
        if (filename.includes(key)) {
          return value;
        }
      }
    }
    
    // Generar alt text basado en nombre de archivo
    if (srcString) {
      const filename = srcString.split('/').pop()?.replace('.webp', '').replace('.jpg', '').replace('.png', '').replace(/_/g, ' ') || '';
      return `${filename} - Fiestaco`;
    }
    
    return fallbackAlt;
  };

  const altText = getAltText();
  
  return (
    <Image
      src={error ? '/images/placeholder.webp' : src}
      alt={altText}
      loading={priority ? 'eager' : loading}
      priority={priority}
      onError={() => setError(true)}
      {...props}
    />
  );
}

// Componente helper para imágenes de productos
export function ProductImage({ productId, productName, ...props }: {
  productId: string;
  productName: string;
} & Omit<ImageOptimizedProps, 'src' | 'alt'>) {
  const imageMap: Record<string, string> = {
    // Flavors
    'al-pastor': '/images/flavors/al_pastor.webp',
    'chorizo': '/images/flavors/chorizo.webp',
    'pierna': '/images/flavors/pierna.webp',
    'pollo-pibil': '/images/flavors/pollo_pibil.webp',
    'chipotle-beans': '/images/flavors/chipotle_beans.webp',
    'elote': '/images/flavors/elote.webp',
    'lengua': '/images/flavors/lengua.webp',
    'carnitas': '/images/flavors/carnitas.webp',
    'pollo-mole': '/images/flavors/pollo_mole.webp',
    'picadillo': '/images/flavors/picadillo.webp',
    'barbacoa-cordero': '/images/flavors/barbacoa_cordero.webp',
    'cauliflower': '/images/flavors/cauliflower.webp',
    'tinga-veg': '/images/flavors/tinga_veg.webp',
    'shrimp': '/images/flavors/shrimp.webp',
    'fish': '/images/flavors/fish.webp',
    
    // Addons
    'cheese': '/images/addons/cheese.webp',
  };
  
  const imageSrc = imageMap[productId] || '/images/placeholder.webp';
  const altText = LOCAL_ALT_TEXT_MAP[imageSrc] || `${productName} - Fiestaco`;
  
  return (
    <ImageOptimized
      src={imageSrc}
      alt={altText}
      {...props}
    />
  );
}
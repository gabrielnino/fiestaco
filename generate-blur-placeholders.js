const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateBlurPlaceholder(imagePath, outputPath) {
  try {
    console.log(`🔍 Generando placeholder para: ${path.basename(imagePath)}`);
    
    // Crear una versión muy pequeña y blur para placeholder
    const buffer = await sharp(imagePath)
      .resize(20, 20, { fit: 'inside' })
      .blur(5)
      .toBuffer();
    
    // Convertir a base64 para data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64}`;
    
    // Guardar como archivo JSON
    const placeholderData = {
      src: imagePath,
      blurDataURL: dataUrl,
      width: 20,
      height: 20,
      generated: new Date().toISOString()
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(placeholderData, null, 2));
    
    console.log(`   ✅ Placeholder generado: ${path.basename(outputPath)}`);
    console.log(`   📏 Tamaño: ${dataUrl.length} caracteres (base64)`);
    
    return dataUrl;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function generateAllPlaceholders() {
  console.log('🚀 GENERANDO BLUR PLACEHOLDERS PARA IMÁGENES');
  console.log('=' .repeat(50));
  
  const directories = [
    'public/images/flavors',
    'public/images/addons',
    'public'
  ];
  
  const importantImages = [
    'public/background.webp',
    'public/logo.webp',
    'public/images/flavors/al_pastor.webp', // Primera imagen visible
  ];
  
  let totalGenerated = 0;
  let totalFailed = 0;
  
  // Primero, imágenes importantes (above the fold)
  console.log('\n🎯 IMÁGENES IMPORTANTES (Above the fold):');
  console.log('-'.repeat(40));
  
  for (const imagePath of importantImages) {
    if (fs.existsSync(imagePath)) {
      const outputPath = imagePath.replace('.webp', '.placeholder.json');
      const success = await generateBlurPlaceholder(imagePath, outputPath);
      
      if (success) {
        totalGenerated++;
        
        // También crear un archivo TypeScript con los placeholders
        const tsContent = `// Auto-generated blur placeholders
export const BLUR_PLACEHOLDERS = {
  '${imagePath}': '${success}',
} as const;

export type ImageKey = keyof typeof BLUR_PLACEHOLDERS;
`;
        
        const tsPath = path.join(path.dirname(imagePath), 'placeholders.ts');
        fs.writeFileSync(tsPath, tsContent);
        
      } else {
        totalFailed++;
      }
    }
  }
  
  // Luego, todas las demás imágenes
  for (const dir of directories) {
    const fullPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`\n📁 Directorio no encontrado: ${dir}`);
      continue;
    }
    
    // Saltar si ya procesamos las imágenes importantes de este directorio
    if (importantImages.some(img => img.startsWith(dir))) {
      continue;
    }
    
    console.log(`\n📂 Procesando: ${dir}`);
    console.log('-'.repeat(30));
    
    const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.webp'));
    
    for (const file of files) {
      const inputPath = path.join(fullPath, file);
      const outputPath = path.join(fullPath, file.replace('.webp', '.placeholder.json'));
      
      // Saltar si ya existe
      if (fs.existsSync(outputPath)) {
        console.log(`   ⏭️  Saltando: ${file} (ya existe)`);
        continue;
      }
      
      const success = await generateBlurPlaceholder(inputPath, outputPath);
      
      if (success) {
        totalGenerated++;
      } else {
        totalFailed++;
      }
    }
  }
  
  // Resumen
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMEN DE PLACEHOLDERS');
  console.log('=' .repeat(50));
  console.log(`✅ Generados: ${totalGenerated} placeholders`);
  console.log(`❌ Fallidos: ${totalFailed} placeholders`);
  
  if (totalGenerated > 0) {
    console.log('\n🎯 CÓMO USAR LOS PLACEHOLDERS:');
    console.log(`
// En tus componentes:
import { BLUR_PLACEHOLDERS } from './placeholders';

<ImageOptimizedV2
  src="/images/flavors/al_pastor.webp"
  alt="Al Pastor Tacos"
  placeholder="blur"
  blurDataURL={BLUR_PLACEHOLDERS['/images/flavors/al_pastor.webp']}
  width={400}
  height={300}
/>

// O con el componente helper:
<ProductImageV2
  productId="al-pastor"
  productName="Al Pastor"
  placeholder="blur"
  width={400}
  height={300}
/>
    `);
    
    // Crear archivo de utilidades
    const utilsContent = `// Image utilities for optimized loading
import { BLUR_PLACEHOLDERS } from './placeholders';

export function getBlurPlaceholder(src: string): string | undefined {
  return BLUR_PLACEHOLDERS[src as keyof typeof BLUR_PLACEHOLDERS];
}

export function shouldUseBlurPlaceholder(src: string): boolean {
  // Usar blur placeholder para imágenes above the fold
  const aboveFoldImages = [
    '/background.webp',
    '/logo.webp',
    '/images/flavors/al_pastor.webp',
  ];
  
  return aboveFoldImages.includes(src);
}

export const IMAGE_LOADING_STRATEGIES = {
  ABOVE_FOLD: {
    priority: true,
    loading: 'eager' as const,
    placeholder: 'blur' as const,
  },
  BELOW_FOLD: {
    priority: false,
    loading: 'lazy' as const,
    placeholder: 'empty' as const,
  },
} as const;
`;
    
    const utilsPath = path.join(__dirname, 'lib/image-utils.ts');
    fs.writeFileSync(utilsPath, utilsContent);
    
    console.log(`\n📁 Archivos creados:`);
    console.log(`   • placeholders.ts - Mapa de blur placeholders`);
    console.log(`   • image-utils.ts - Utilidades para manejo de imágenes`);
  }
  
  console.log('\n💡 BENEFICIOS:');
  console.log('   • Mejor UX: Placeholders blur durante carga');
  console.log('   • Menos CLS: Layout estable durante carga de imágenes');
  console.log('   • Mejor percepción de velocidad');
}

// Ejecutar generación
generateAllPlaceholders().catch(console.error);
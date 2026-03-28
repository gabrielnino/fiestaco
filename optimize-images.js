const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Mapeo de imágenes a descripciones alt
const ALT_TEXT_MAP = {
  // Flavors
  'al_pastor.png': 'Al Pastor Tacos - Traditional Mexican marinated pork with pineapple and spices',
  'barbacoa_cordero.png': 'Barbacoa Lamb Tacos - Slow-cooked lamb with traditional Mexican barbacoa seasoning',
  'carnitas.png': 'Carnitas Tacos - Slow-cooked pulled pork with citrus and herbs',
  'cauliflower.png': 'Cauliflower Tacos - Roasted cauliflower with Mexican spices, vegetarian option',
  'chipotle_beans.png': 'Chipotle Bean Tacos - Smoky chipotle beans with peppers and onions',
  'fish.png': 'Fish Tacos - Beer-battered fish with cabbage slaw and lime crema',
  'pierna.png': 'Pierna Tacos - Slow-roasted pork leg with traditional seasonings',
  'pollo_mole.png': 'Pollo Mole Tacos - Chicken with rich chocolate mole sauce',
  'pollo_pibil.png': 'Pollo Pibil Tacos - Achiote-marinated chicken with citrus',
  'tinga_veg.png': 'Tinga Vegetable Tacos - Spicy shredded vegetables, vegan option',
  
  // Addons
  'cheese.png': 'Mexican Cheese - Queso fresco and cotija cheese blend',
  'guacamole.png': 'Fresh Guacamole - Hass avocado with lime and cilantro',
  'salsa.png': 'House Salsa - Tomato and chili salsa with fresh herbs',
  'crema.png': 'Mexican Crema - Tangy crema with lime zest',
  
  // Background y logo
  'background.png': 'Mexican food background with traditional patterns',
  'logo.png': 'Fiestaco Logo - Skull design with Mexican aesthetic'
};

async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    console.log(`🔄 Convirtiendo: ${path.basename(inputPath)}`);
    
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const stats = fs.statSync(inputPath);
    const webpStats = fs.statSync(outputPath);
    const reduction = ((stats.size - webpStats.size) / stats.size * 100).toFixed(1);
    
    console.log(`   ✅ ${path.basename(outputPath)} (${(webpStats.size / 1024).toFixed(1)}KB) - ${reduction}% más pequeño`);
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function optimizeAllImages() {
  console.log('🚀 INICIANDO OPTIMIZACIÓN DE IMÁGENES');
  console.log('=' .repeat(50));
  
  const directories = [
    'public/images/flavors',
    'public/images/addons',
    'public'
  ];
  
  let totalConverted = 0;
  let totalFailed = 0;
  
  for (const dir of directories) {
    const fullPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`📁 Directorio no encontrado: ${dir}`);
      continue;
    }
    
    console.log(`\n📂 Procesando: ${dir}`);
    console.log('-'.repeat(30));
    
    const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.png'));
    
    for (const file of files) {
      const inputPath = path.join(fullPath, file);
      const outputFile = file.replace('.png', '.webp');
      const outputPath = path.join(fullPath, outputFile);
      
      const success = await convertToWebP(inputPath, outputPath);
      
      if (success) {
        totalConverted++;
        
        // Crear archivo de metadatos para alt text
        const altText = ALT_TEXT_MAP[file] || `${file.replace('.png', '').replace(/_/g, ' ')} - Fiestaco`;
        const metaFile = path.join(fullPath, file.replace('.png', '.meta.json'));
        
        fs.writeFileSync(metaFile, JSON.stringify({
          alt: altText,
          original: file,
          optimized: outputFile,
          timestamp: new Date().toISOString()
        }, null, 2));
        
        console.log(`   📝 Alt text: "${altText}"`);
      } else {
        totalFailed++;
      }
    }
  }
  
  // Resumen
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('=' .repeat(50));
  console.log(`✅ Convertidas: ${totalConverted} imágenes`);
  console.log(`❌ Fallidas: ${totalFailed} imágenes`);
  
  if (totalConverted > 0) {
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Actualizar page.tsx para usar imágenes .webp');
    console.log('2. Implementar next/image component');
    console.log('3. Agregar atributos alt con los textos generados');
    
    // Crear reporte
    const report = {
      timestamp: new Date().toISOString(),
      totalConverted,
      totalFailed,
      directories,
      altTextMap: ALT_TEXT_MAP
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'image-optimization-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n📁 Reporte guardado en: image-optimization-report.json`);
  }
  
  console.log('\n💡 Para actualizar el código:');
  console.log('   Reemplazar: backgroundImage: "url(\'/background.png\')"');
  console.log('   Con: backgroundImage: "url(\'/background.webp\')"');
}

// Ejecutar optimización
optimizeAllImages().catch(console.error);
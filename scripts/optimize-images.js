const imagemin = require('imagemin').default;
const imageminWebp = require('imagemin-webp').default;
const imageminPngquant = require('imagemin-pngquant').default;
const imageminMozjpeg = require('imagemin-mozjpeg').default;
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const inputDir = 'assets/img';
  const outputDir = 'assets/img/optimized';
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🖼️  Optimizing images...');

  // Optimize PNG images
  console.log('📦 Compressing PNG images...');
  await imagemin([`${inputDir}/*.png`], {
    destination: outputDir,
    plugins: [
      imageminPngquant({
        quality: [0.65, 0.8]
      })
    ]
  });

  // Optimize JPEG images
  console.log('📦 Compressing JPEG images...');
  await imagemin([`${inputDir}/*.jpg`, `${inputDir}/*.jpeg`], {
    destination: outputDir,
    plugins: [
      imageminMozjpeg({
        quality: 80
      })
    ]
  });

  // Convert to WebP
  console.log('🌐 Converting to WebP...');
  await imagemin([`${inputDir}/*.{png,jpg,jpeg}`], {
    destination: outputDir,
    plugins: [
      imageminWebp({
        quality: 80
      })
    ]
  });

  console.log('✅ Image optimization complete!');
  console.log(`📁 Optimized images saved to: ${outputDir}`);
  
  // Show size comparison
  console.log('\n📊 Size comparison:');
  const originalFiles = fs.readdirSync(inputDir).filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file)
  );
  
  originalFiles.forEach(file => {
    const originalPath = path.join(inputDir, file);
    const originalSize = fs.statSync(originalPath).size;
    
    // Check if optimized version exists
    const webpFile = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const webpPath = path.join(outputDir, webpFile);
    
    if (fs.existsSync(webpPath)) {
      const webpSize = fs.statSync(webpPath).size;
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
      console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(webpSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);
    }
  });
}

optimizeImages().catch(console.error);

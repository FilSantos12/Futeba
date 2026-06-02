const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'icons', 'icon.svg');

async function generate() {
  await sharp(svgPath).resize(192, 192).png().toFile(path.join(__dirname, 'public', 'icons', 'icon-192.png'));
  console.log('✓ icon-192.png gerado');

  await sharp(svgPath).resize(512, 512).png().toFile(path.join(__dirname, 'public', 'icons', 'icon-512.png'));
  console.log('✓ icon-512.png gerado');
}

generate().catch((err) => {
  console.error('Erro ao gerar ícones:', err.message);
  process.exit(1);
});

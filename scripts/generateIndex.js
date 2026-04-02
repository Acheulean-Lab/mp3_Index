const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '../public/audio');
const outputFile = path.join(__dirname, '../src/data/index.json');

async function generateIndex() {
  // `music-metadata` publishes with an `exports` map that doesn't always work with
  // CommonJS `require()`; dynamic import works reliably across environments.
  const { parseFile } = await import('music-metadata');

  const files = fs.readdirSync(audioDir).filter(file => file.endsWith('.mp3'));

  const objects = [];

  for (const file of files) {
    const filePath = path.join(audioDir, file);
    try {
      const metadata = await parseFile(filePath);
      const title = metadata.common.title || path.parse(file).name.replace(/[_-]/g, ' ');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const description = `Listen to ${title}`;

      objects.push({
        id,
        title,
        description,
        filename: file
      });
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
      // Fallback
      const title = path.parse(file).name.replace(/[_-]/g, ' ');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      objects.push({
        id,
        title,
        description: `Listen to ${title}`,
        filename: file
      });
    }
  }

  // Sort by title
  objects.sort((a, b) => a.title.localeCompare(b.title));

  fs.writeFileSync(outputFile, JSON.stringify(objects, null, 2));
  console.log(`Generated index.json with ${objects.length} items`);
}

generateIndex().catch(console.error);
const fs = require('fs');
const path = require('path');

const schemaDir = path.join(__dirname, 'schema');
const outputFile = path.join(__dirname, 'schema.prisma');

const files = [
  'base.prisma',
  'category.prisma',
  'user.prisma',
  'product.prisma',
  'order.prisma',
  
 
];

let mergedSchema = '';

files.forEach(file => {
  const filePath = path.join(schemaDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    mergedSchema += content + '\n\n';
  }
});

fs.writeFileSync(outputFile, mergedSchema);
console.log(' Schema files merged successfully!');
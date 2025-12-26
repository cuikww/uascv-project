import newman from 'newman';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateHtmlReport } from './utils/generateReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define output folder
const outputDir = path.join(__dirname, 'reports');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const htmlReport = path.join(outputDir, `api-report-${timestamp}.html`);
const jsonReport = path.join(outputDir, `api-report-${timestamp}.json`);

console.log('🚀 Starting API Tests with Newman...');

newman.run({
    collection: path.join(__dirname, 'postman', 'uascv-collection.postman_collection.json'),
    environment: path.join(__dirname, 'postman', 'uascv-environment.postman_environment.json'),
    reporters: ['cli', 'json'],
    reporter: {
        json: { export: jsonReport }
    },
    delayRequest: 100
}, (err) => {
    if (err) {
        console.error('❌ Test run failed:', err);
        process.exit(1);
    }

    // Generate Custom HTML Report
    console.log('📊 Generating detailed HTML report...');
    generateHtmlReport(jsonReport, htmlReport);

    console.log('✅ Test run completed successfully!');
    console.log(`📄 JSON Report: ${jsonReport}`);
    console.log(`📊 HTML Report (Detailed): ${htmlReport}`);
});

const fs = require('fs');

const products = fs.readFileSync('products.txt', 'utf8').split('\n').map(p => p.trim()).filter(p => p.length > 0);

const PRODUCT_SELLING_MODEL = 'Term Based - Monthly';
const ADJUSTMENT_TYPE = 'Percentage';
const ADJUSTMENT_VALUE = '10';

const maxNoOfCabinets = ['10', '50', '100', '200', '400', '600', '800', '1000'];
const drawCaps = ['3 kVA', '4 kVA', '5 kVA', '6 kVA', '7 kVA'];
const cbeBands = ['2 – 3', '3 – 4', '4 – 5', '5 – 6', '6 – 7'];

const csvFile = 'AttributeBasedAdjustments.csv';

// CSV Header (You may need to adjust these header names to match the exact API names in Salesforce)
// For example: PriceAdjustmentScheduleId, Product__c, ProductSellingModel__c, AdjustmentType, AdjustmentValue, MaxNoOfCabinets__c, DrawCap__c, CabEBand__c
const header = 'Product Name,Product Selling Model,Adjustment Type,Adjustment Value,Max No Of Cabinets,Draw Cap,CabE Band\n';

fs.writeFileSync(csvFile, header);

let count = 0;

for (const product of products) {
    for (const cabinet of maxNoOfCabinets) {
        for (const drawCap of drawCaps) {
            for (const cbeBand of cbeBands) {
                // Escape commas in values by wrapping in quotes
                const row = `"${product}","${PRODUCT_SELLING_MODEL}","${ADJUSTMENT_TYPE}","${ADJUSTMENT_VALUE}","${cabinet}","${drawCap}","${cbeBand}"\n`;
                fs.appendFileSync(csvFile, row);
                count++;
            }
        }
    }
}

console.log(`Successfully generated ${count} combinations in ${csvFile}.`);

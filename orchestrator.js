const { spawn } = require('child_process');
const fs = require('fs');

const NUM_WORKERS = 5; // Change this if you want more or fewer parallel browsers
const products = fs.readFileSync('products.txt', 'utf8').split('\n').map(p => p.trim()).filter(p => p.length > 0);
let currentIndex = 0;

async function runWorker(workerId) {
    while (currentIndex < products.length) {
        const product = products[currentIndex];
        currentIndex++;
        
        console.log(`\n======================================================`);
        console.log(`[Worker ${workerId}] STARTING: ${product}`);
        console.log(`======================================================\n`);
        
        await new Promise((resolve) => {
            const child = spawn('node', ['createAttributePricing.js', product, workerId], { stdio: 'inherit' });
            
            child.on('close', (code) => {
                console.log(`[Worker ${workerId}] FINISHED: ${product}`);
                resolve();
            });
            
            child.on('error', (err) => {
                console.log(`[Worker ${workerId}] ERROR on ${product}:`, err);
                resolve();
            });
        });
    }
}

async function start() {
    console.log(`Starting Orchestrator with ${NUM_WORKERS} parallel workers for ${products.length} products...\n`);
    
    // Stagger startup slightly so 5 browsers don't open at the exact same millisecond
    const workers = [];
    for (let i = 1; i <= NUM_WORKERS; i++) {
        workers.push(
            new Promise(resolve => setTimeout(resolve, i * 2000)).then(() => runWorker(i))
        );
    }
    
    await Promise.all(workers);
    console.log('\n*** ALL PRODUCTS HAVE BEEN PROCESSED! ***');
}

start();

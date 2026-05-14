const { chromium } = require('playwright');
const fs = require('fs');

(async () => {

    const URL =
        'https://crmantra-e-dev-ed.develop.lightning.force.com/lightning/r/PriceAdjustmentSchedule/84Xbm000000ClmLEAS/view';

    const PRODUCT = 'Shared Cage';
    const PRODUCT_SELLING_MODEL = 'Term Based - Monthly';
    const ADJUSTMENT_TYPE = 'Percentage';
    const ADJUSTMENT_VALUE = '10';

    const EFFECTIVE_DATE = 'Jan 1, 2026';
    const EFFECTIVE_TIME = '11:45 PM';

    const maxNoOfCabinets = [
        '10',
        '50',
        '100',
        '200',
        '400',
        '600',
        '800',
        '1000'
    ];

    const drawCaps = [
        '3 kVA',
        '4 kVA',
        '5 kVA',
        '6 kVA',
        '7 kVA'
    ];

    const cbeBands = [
        '2 – 3',
        '3 – 4',
        '4 – 5',
        '5 – 6',
        '6 – 7'
    ];

    const context = await chromium.launchPersistentContext(
        './salesforce-profile',
        {
            headless: false,
            slowMo: 100
        }
    );

    const page = await context.newPage();

    page.setDefaultTimeout(60000);

    await page.goto(URL);

    console.log('\nLOGIN TO SALESFORCE');
    console.log('After login press ENTER in terminal...\n');

    process.stdin.resume();

    await new Promise(resolve => {
        process.stdin.once('data', resolve);
    });

    // Ensure we are on the Related tab
    const relatedTab = page.locator('a:has-text("Related")');
    if (await relatedTab.isVisible()) {
        await relatedTab.click();
        console.log('Clicked Related tab, waiting 5s...');
        await page.waitForTimeout(5000);
    }

    let count = 0;

    for (const cabinet of maxNoOfCabinets) {

        for (const drawCap of drawCaps) {

            for (const cbeBand of cbeBands) {

                count++;

                console.log(`\n[${count}/200] PLEASE CLICK "NEW" in Attribute Based Adjustment section...`);
                
                // Wait for modal to appear
                const modal = page.locator('.slds-modal:visible, .forceModal:visible, .uiModal:visible, section[role="dialog"]:visible, div[role="dialog"]:visible').filter({ hasText: /New Attribute Based Adjustment|Attribute Based Adjustment/ }).first();
                await modal.waitFor({ state: 'visible', timeout: 300000 }); // Wait up to 5 minutes
                
                console.log('Modal detected, filling form...');

                // PRODUCT
                console.log('--- PHASE: Filling Product ---');
                const productInput = modal.locator('input[placeholder="Search Products..."]').first();
                await productInput.click();
                console.log('Clicked Product input');
                await page.waitForTimeout(1000);
                await productInput.fill(PRODUCT);
                console.log(`Typed product: ${PRODUCT}`);
                await page.waitForTimeout(5000); // Wait for dropdown to be fully loaded
                
                console.log('Searching for Product option in dropdown...');
                // Specifically look for items that match the product name and are NOT "Show more results"
                const productOption = page.locator('lightning-base-combobox-item, [role="option"], .slds-listbox__option')
                    .filter({ hasText: PRODUCT })
                    .filter({ hasNotText: /results for/i })
                    .first();
                
                await productOption.waitFor({ state: 'visible' });
                console.log('Product option found and visible, clicking...');
                await productOption.click({ force: true });
                console.log('Clicked Product option, waiting 4s for processing...');
                await page.waitForTimeout(4000);

                // RE-DETECT MODAL
                console.log('Re-detecting modal after Product selection...');
                const modalRef = page.locator('.slds-modal:visible, .forceModal:visible, section[role="dialog"]:visible').filter({ hasText: /New Attribute Based Adjustment|Attribute Based Adjustment/ }).first();

                // PRODUCT SELLING MODEL
                console.log('--- PHASE: Filling Product Selling Model ---');
                const psmInput = modalRef.locator('input[placeholder="Search Product Selling Models..."]').first();
                await psmInput.click();
                console.log('Clicked PSM input');
                await page.waitForTimeout(1000);
                await psmInput.fill(PRODUCT_SELLING_MODEL);
                console.log(`Typed PSM: ${PRODUCT_SELLING_MODEL}`);
                await page.waitForTimeout(5000);
                
                console.log('Searching for PSM option in dropdown...');
                const psmOption = page.locator('lightning-base-combobox-item, [role="option"], .slds-listbox__option')
                    .filter({ hasText: PRODUCT_SELLING_MODEL })
                    .filter({ hasNotText: /results for/i })
                    .first();
                
                await psmOption.waitFor({ state: 'visible' });
                console.log('PSM option found and visible, clicking...');
                await psmOption.click({ force: true });
                console.log('Clicked PSM option, waiting 4s for processing...');
                await page.waitForTimeout(4000);

                // ADJUSTMENT TYPE
                console.log('--- PHASE: Selecting Adjustment Type ---');
                // Target the specific dropdown for Adjustment Type
                const typeDropdown = modalRef.locator('button, [role="combobox"], select').filter({ hasText: /Adjustment Type|--None--/ }).first();
                await typeDropdown.click();
                console.log('Clicked Adjustment Type dropdown, waiting for options...');
                await page.waitForTimeout(2000);
                
                const typeOption = page.locator('.slds-listbox, [role="listbox"]').locator('lightning-base-combobox-item, [role="option"], .slds-listbox__option').filter({ hasText: ADJUSTMENT_TYPE }).first();
                await typeOption.waitFor({ state: 'visible' });
                await typeOption.click({ force: true });
                console.log(`Selected Adjustment Type: ${ADJUSTMENT_TYPE}`);
                await page.waitForTimeout(2000);

                // RE-DETECT MODAL
                const modalRef2 = page.locator('.slds-modal:visible, .forceModal:visible, section[role="dialog"]:visible').filter({ hasText: /New Attribute Based Adjustment|Attribute Based Adjustment/ }).first();

                // ADJUSTMENT VALUE
                console.log('--- PHASE: Filling Adjustment Value ---');
                const adjValContainer = modalRef2.locator('lightning-input, .slds-form-element').filter({ hasText: /Adjustment Value/ }).first();
                const valInput = adjValContainer.locator('input');
                await valInput.waitFor({ state: 'visible' });
                await valInput.click();
                await valInput.fill(ADJUSTMENT_VALUE);
                console.log(`Filled Adjustment Value: ${ADJUSTMENT_VALUE}`);
                await page.waitForTimeout(2000);

                // DATE
                console.log('--- PHASE: Filling Date ---');
                // Target the calendar icon button within the date field
                const calendarBtn = modalRef2.locator('lightning-datepicker button, button:has(lightning-icon[icon-name*="date"])').first();
                await calendarBtn.waitFor({ state: 'visible' });
                await calendarBtn.click();
                console.log('Clicked small calendar icon, waiting for calendar...');
                await page.waitForTimeout(2000);
                
                // Click day "1" in the calendar
                const dayOne = page.locator('td:not(.slds-day_adjacent-month) span').filter({ hasText: /^1$/ }).first();
                await dayOne.waitFor({ state: 'visible' });
                await dayOne.click();
                console.log('Clicked day "1" in calendar (Time should auto-populate)');
                await page.waitForTimeout(2000);

                // NEXT
                console.log('--- PHASE: Clicking Next ---');
                const nextBtn = modalRef2.locator('button:has-text("Next")');
                await nextBtn.click({ force: true });
                console.log('Clicked Next, waiting for Page 2...');
                await page.waitForTimeout(6000);

                if (await nextBtn.isVisible()) {
                    console.log('STILL ON FIRST PAGE - possible validation error. Retrying Next...');
                    await nextBtn.click({ force: true });
                    await page.waitForTimeout(6000);
                }

                // RE-DETECT MODAL AGAIN FOR PAGE 2
                console.log('Re-detecting modal for Page 2...');
                const modalPage2 = page.locator('.slds-modal:visible, .forceModal:visible, section[role="dialog"]:visible').first();

                // Helper to select from custom dropdown on Page 2 by Row Label
                const selectByRow = async (rowLabel, operatorValue, attributeValue) => {
                    console.log(`--- Row: ${rowLabel} ---`);
                    const row = modalPage2.locator('.slds-grid, tr, .slds-form-element__row').filter({ hasText: rowLabel }).first();
                    await row.scrollIntoViewIfNeeded();
                    
                    const dropdowns = row.locator('button[role="combobox"], .slds-combobox_container button');
                    
                    // 1. SELECT OPERATOR
                    console.log(`Selecting Operator: ${operatorValue}...`);
                    const opDropdown = dropdowns.nth(0);
                    await opDropdown.click({ force: true });
                    await page.waitForTimeout(2000);
                    
                    // Find ONLY visible listbox
                    const visibleListbox = page.locator('.slds-listbox:visible, [role="listbox"]:visible').first();
                    const opOption = visibleListbox.locator('lightning-base-combobox-item, [role="option"], .slds-listbox__option').filter({ hasText: new RegExp(`^${operatorValue}$`, 'i') }).first();
                    
                    await opOption.waitFor({ state: 'visible', timeout: 8000 });
                    await opOption.click({ force: true });
                    console.log(`Selected Operator: ${operatorValue}`);
                    await page.waitForTimeout(1000);

                    // 2. SELECT VALUE
                    console.log(`Selecting Value: ${attributeValue}...`);
                    const valDropdown = dropdowns.nth(1);
                    await valDropdown.click({ force: true });
                    await page.waitForTimeout(2000);
                    
                    const visibleListbox2 = page.locator('.slds-listbox:visible, [role="listbox"]:visible').first();
                    const valOption = visibleListbox2.locator('lightning-base-combobox-item, [role="option"], .slds-listbox__option').filter({ hasText: new RegExp(`^${attributeValue}$`, 'i') }).first();
                    
                    await valOption.waitFor({ state: 'visible', timeout: 8000 });
                    await valOption.click({ force: true });
                    console.log(`Selected Value: ${attributeValue}`);
                    await page.waitForTimeout(1000);
                };

                // MAX NO OF CABINETS
                await selectByRow('MaxNoOfCabinets', 'Equals', cabinet);

                // DRAW CAP
                await selectByRow('Draw Cap', 'Equals', drawCap);

                // CBE BAND
                await selectByRow('CabE Band', 'Equals', cbeBand);

                // SAVE
                console.log('--- PHASE: Clicking Save ---');
                await modalPage2.locator('button:has-text("Save")').click({ force: true });
                console.log('Clicked Save, waiting for completion...');
                await page.waitForTimeout(10000);
                
                // LOG TO FILE
                const logEntry = `[${new Date().toLocaleString()}] SUCCESS - Record ${count}/200: Product: ${PRODUCT}, PSM: ${PRODUCT_SELLING_MODEL}, Type: ${ADJUSTMENT_TYPE}, Value: ${ADJUSTMENT_VALUE}, Cabinet: ${cabinet}, DrawCap: ${drawCap}, CabE: ${cbeBand}\n`;
                fs.appendFileSync('creation_log.txt', logEntry);
                console.log('--- RECORD LOGGED TO creation_log.txt ---');
                console.log('Iteration complete.');

            }
        }
    }

    console.log('\nDONE — 200 COMBINATIONS CREATED');

})();
describe ('Amazon Order Placement Script', () => {
    const selectors = {
        baseURL: 'https://www.amazon.com/',
        searchBox: '#twotabsearchtextbox',
        searchBoxBackup: '//*[@aria-label="Search Amazon"]', //'/html/body/div[1]/header/div/div[1]/div[2]/div/form/div[2]/div[1]/input',
        continueShoppingBtn: '/html/body/div/div[1]/div[3]/div/div/form/div/div/span/span/button',//'button[name="Continue Shopping"]',
        search: 'iPhone X',
        filter1: '//*[@id="p_n_g-1003517064111/69690504011"]/span/a/div/label',
        
        sortOption: 'price-desc-rank'
    }

    it('should search, add filters, and display result list', async () => {
        // --- Step 1: Go to Amazon homepage ---
        await browser.url(selectors.baseURL);
        await browser.maximizeWindow();
        console.log('-------> Navigated to Amazon homepage.');

        // check if continue shopping button pops up
        const continueShoppingElement = await $(selectors.continueShoppingBtn);
        if (await continueShoppingElement.isDisplayed()) {
            await continueShoppingElement.click();
            console.log('-------> Continue Shopping button clicked.');
            await browser.pause(200);
        }

        // --- Step 2: Search for a product ---
        let searchInput = await $(selectors.searchBox);
        try {
            await searchInput.waitForDisplayed({ timeout: 5000 });
        } catch (error) {
            console.log('-------> Primary search box not found, trying backup selector.');
            searchInput = await $(selectors.searchBoxBackup);
            await searchInput.waitForDisplayed({ timeout: 5000 });
        }
        await searchInput.waitForDisplayed();
        await searchInput.click();
        await searchInput.setValue(selectors.search);
        await browser.keys('Enter');
        console.log(`-------> Searched for product: ${selectors.search}.`);

        // --- Step 3: Apply filters ---
        await $(selectors.filter1).waitForDisplayed();
        await $(selectors.filter1).click();
        console.log('-------> Applied filter: selector.filter1');

        const sortDropdown = await $('#s-result-sort-select');
        await sortDropdown.selectByAttribute('value', selectors.sortOption);
        console.log(`-------> Sorted results by: ${selectors.sortOption}.`);

        // --- Step 4: Extract info for console list ---
        await browser.pause(3000);

        const rawProductContainers = await $$('.s-result-item.s-asin[data-asin]');
        const allProductContainers = Array.from(rawProductContainers);
        
        let validProductElements = [];

        // 1. Define the asynchronous filter logic
        const filterPromises = allProductContainers.map(async (element) => {
            try {
                const linkElement = await element.$('a.a-link-normal.s-line-clamp-2');

                return !!linkElement; 

            } catch (e) {
                return false;
            }
        });

        // 2. Resolve all checks and filter the original array
        const results = await Promise.all(filterPromises);
        
        validProductElements = allProductContainers.filter((element, index) => {
            return results[index];
        });

        // Use the new, clean array in your loop
        const productElements = validProductElements;
        console.log('--------------------> this is my array length (Filtered):' + productElements.length);

        let resultsList = [];

        async function run() {
            console.log('--------------------- Extracting Product Information ---------------------');
            for  (const element of productElements) {
                try {
                    console.log('-----------> Extracting product info...');
                    const linkElement = await element.$('a.s-line-clamp-2');

                    const productName = await (linkElement.getText()).trim();
                    console.log('-----name------>'+productName);

                    //const linkElement = await element.$('a.a-link-normal.s-link-style')
                    const productLink = await (linkElement.getAttribute('href')).trim();
                    const fullLink = productLink.startsWith('http') ? productLink : `${URL}${productLink}`;
                    console.log('---link-------->'+fullLink);

                    const wholePart = await element.$('.a-price-whole').getText();
                    const fractionPart = await element.$('.a-price-fraction').getText();
                    const priceWhole = `${wholePart}.${fractionPart}`;
                    console.log('---price-------->'+priceWhole);
                    
                    resultsList.push({
                        'Product Name': productName,
                        'Price': priceWhole,
                        'Link': fullLink
                    });

                } catch (e) {
                    continue; 
                }   
            }
        }
        await run();

        await console.log('----------------------------88------------------------');
        async function run2() {
            resultsList.forEach((item, index) => {
                console.log(`${index + 1}. Product Name: ${item['Product Name']}`);
                console.log(`   Price: ${item.Price}`);
                console.log(`   Link: ${item.Link}`);
                console.log('----------------------------------------------------');
            });
        }
        await run2();
    });
});

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
        await $(selectors.searchBox).waitForDisplayed();
        await $(selectors.searchBox).click();
        await $(selectors.searchBox).setValue(selectors.search);
        await browser.keys('Enter');
        console.log(`-------> Searched for product: ${selectors.search}.`);
    })

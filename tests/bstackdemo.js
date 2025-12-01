//import { use } from "react";

describe('StackDemo Order Placement Script', () => {

    // Define mock shipping data
    const mockShippingData = {
        firstName: 'Tester',
        lastName: 'User',
        address: '123 Automation Lane',
        province: 'CA',
        postalCode: '90210'
    };

    // Define selectors (based on standard BStackDemo structure)
    const selectors = {
        // Login Page
        usernameDesktop: '//*[@id="username"]/div/div[1]',
        usernameMobile: '//*[@id="username"]/div[1]/div[1]/div[1]',
        password: '//*[@id="password"]/div/div[1]',
        loginBtn: '#login-btn',
        demouserOption: "//div[text()='demouser']", 
        passwordOption: "//div[text()='testingisfun99']", 

        signInBtn: '#signin',

        // Product Page
        iphone12AddToCartBtn: '//*[@id="1"]/div[4]',
        
        // Cart and Checkout
        cartIcon: '#cart',
        checkoutBtn: '//*[@id="__next"]/div/div/div[2]/div[2]/div[3]/div[3]',

        // Shipping Form
        firstName: '//*[@id="firstNameInput"]',
        lastName: '#lastNameInput',
        address: '#addressLine1Input',
        province: '#provinceInput',
        postalCode: '#postCodeInput',
        submitOrderBtn: '#checkout-shipping-continue',

        // Confirmation
        successMessageText: '//*[@id="confirmation-message"]'
    };

    it('should sign in, add iPhone 12 to cart and buy', async () => {
        // --- Step 1: Go to StackDemo and Sign in ---

        await browser.url('https://bstackdemo.com/');
        //await browser.maximizeWindow(); // Optional: Maximizes window for better visibility

        console.log('Navigated to home page and starting login...');

        await $(selectors.signInBtn).click();
       // await browser.pause(200);

        //let usernameSelector;
        //const capabilities = await browser.getCapabilities();
        
        // Check if the current environment is a mobile device/browser
        // Common checks for mobile include 'deviceName' or 'platformName'
       /* if (capabilities.deviceName || capabilities.platformName === 'iOS' || capabilities.platformName === 'Android') {
            console.log('Detected mobile environment. Using mobile selector.');
            usernameSelector = selectors.usernameMobile;
        } else {
            console.log('Detected desktop environment. Using desktop selector.');
            usernameSelector = selectors.usernameDesktop;
        }*/

        const usernameField = await $(selectors.usernameDesktop);
        await usernameField.waitForDisplayed();
        await usernameField.click();
        console.log('Dropdown clicked.');

        const demouserOption = await $(selectors.demouserOption);
        await demouserOption.waitForDisplayed();
        await demouserOption.click();
        console.log('Username selected: demouser.');

        const passwordField = await $(selectors.password);
        //await passwordField.waitForDisplayed();
        await passwordField.click();
        const passwordOption = await $(selectors.passwordOption);
        await passwordOption.waitForDisplayed();
        await passwordOption.click();

        console.log('Password selected: testingisfun99.');

        // Wait for login elements to be visible
        //await $(selectors.usernameInput).waitForDisplayed();

        // Sign in as user “demouser”
        //await $(selectors.usernameInput).setValue('demouser');
        await $(selectors.loginBtn).click();
        //await browser.pause(200);

        console.log('Logged in successfully.');

        // --- Step 2: Add iPhone 12 to cart ---

        // Wait for product list to load
        //await $(selectors.iphone12AddToCartBtn)//.waitForDisplayed({ timeout: 3000 });

        console.log('Adding iPhone 12 to cart...');

        // Click the 'Add to cart' button for iPhone 12
        await $(selectors.iphone12AddToCartBtn).click();

        console.log('iPhone 12 added to cart.');
        
        // --- Step 3: Check out ---

        // Go to the cart
        //await $(selectors.cartIcon).waitForClickable();
        //await $(selectors.cartIcon).click();
        
        // Click Checkout button
        await $(selectors.checkoutBtn).waitForDisplayed();
        await $(selectors.checkoutBtn).click();
       // await browser.pause(200);

        console.log('Proceeding to shipping address form.');

        // --- Step 4: Submit a shipping address ---

        //await $(selectors.firstName).waitForDisplayed();

        // Fill out the shipping form
        await $(selectors.firstName).setValue(mockShippingData.firstName);
        await $(selectors.lastName).setValue(mockShippingData.lastName);
        await $(selectors.address).setValue(mockShippingData.address);
        await $(selectors.province).setValue(mockShippingData.province);
        await $(selectors.postalCode).setValue(mockShippingData.postalCode);
        
        console.log('Shipping details entered. Placing order...');

        // Submit the order
        await $(selectors.submitOrderBtn).click();
        //await browser.pause(200);

        // --- Step 5: Verify success message ---
        
        // Wait for the confirmation message to appear
        const successMessageElement = await $(selectors.successMessageText);
        await successMessageElement//.waitForDisplayed({ timeout: 5000 });

        // Verify "Your Order has been successfully placed." text
        const confirmationText = await successMessageElement.getText();

        await expect(confirmationText).toEqual('Your Order has been successfully placed.');
        
        console.log(`Verification successful! Confirmation text: "${confirmationText}"`);
    });
});
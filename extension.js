$(document).on('page:load', function() {
    // add content
    var page = Shopify.Checkout.page; //contact_information, shipping_method, payment_method, processing (between payment page and thank you page), review
    var step = Shopify.Checkout.step; //show, stock_problems, processing, forward, thank_you

    if(step == 'thank_you' ) {
        // communicate with faber
    }
});
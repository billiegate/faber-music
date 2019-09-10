function centerModal(){
   var modal = $('.modal.open');
   var mWidth = modal.outerWidth()
   var mHeight = modal.outerHeight();
   var width = $(window).width();
   var height = $(window).height();
   if((width % 1) != 0){
      width = Math.round(width)
   }
   if((height % 1) != 0){
      height = Math.round(height)
   }
   var topPos = (height / 2) - (mHeight / 2);
   var leftPos = (width / 2) - (mWidth / 2); 
   modal.css({top: topPos, left:leftPos})
}
//open modal and overlay
function openModal(){
   $('.modal').removeClass('hidden').addClass('open');
   $('.modal--overlay').removeClass('hidden').addClass('open');
   $('body').css('overflow', 'hidden');
   centerModal();
}

//close modal and overlay
function closeModal(overlay){
   $(overlay).addClass('hidden').removeClass('open');
   $('.modal.open').addClass('hidden').removeClass('open');
   $('body').css('overflow', 'auto');
}


function addItem(form_id) {
    loadButton()
    $.ajax({
       type: 'POST', 
       url: '/cart/add.js',
       dataType: 'json', 
       data: $('#'+form_id).serialize(),
       success: addToCartOk,
       error: addToCartFail
    });
 }

 function addToCartOk(product) { 
    releaseLoadButton()
    theme.settings.cartCount++; 
    $('.modal').html(product.title + ' was added to the cart!'); 
    addProduct(product);
    cartNotification();
    openModal();
    // setTimeout( function() {
    //     window.location.href = '/cart'
    // }, 1000);
 } 


 function addToCartFail(obj, status) { 
    releaseLoadButton()
    $('.modal').html('The product you are trying to add is out of stock.'); 
    openModal()
 }

 function loadButton() {
    $('#AddToCartButton').attr('disable', true);
    $('#AddToCartButton').find('img').show();
 }

 function releaseLoadButton() {
    $('#AddToCartButton').attr('disable', false);
    $('#AddToCartButton').find('img').hide();
 }

 $('.modal--overlay').on('click', function(){
    var overlay = $('.modal--overlay')
    closeModal(overlay)
 })

 function cartNotification() {
    var bubble = $('.cart-link__bubble').first()//.replaceWith("<a href="/cart" id="cart-number">View cart (" + cartCount + ")</a>");
    if(theme.settings.cartCount != 0 && !bubble.hasClass('cart-link__bubble--visible')) {
        bubble.addClass('cart-link__bubble--visible')
    }
 }

 $(document).ready(function() {
    var username = 'eUserName'
    var secret = 'eUserName'
    var api = new PublicAPI(username,secret);
    cartNotification();
 })

 function addProduct(product) {
    var __element = '<div class="ajaxcart__row" data-line="1">\
      <div class="grid">\
        <div class="grid__item one-quarter">\
          <a href="' + product.url + '" class="ajaxcart__product-image"><img src="' + product.featured_image.url + '" alt="' + product.title + '"></a>\
        </div>\
        <div class="grid__item three-quarters">\
          <div class="ajaxcart__product-name--wrapper">\
            <a href="' + product.url + '" class="ajaxcart__product-name">' + product.title + '</a>\
              <span class="ajaxcart__product-meta">' + (product.variant_title ? product.variant_title : "") + '</span>\
          </div>\
          <div class="grid--full">\
            <div class="grid__item one-half">\
              <div class="ajaxcart__qty">\
                <button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--minus icon-fallback-text" data-id="' + product.key + '" data-qty="0" data-line="1" aria-label="Reduce item quantity by one">\
                  <span class="icon icon-minus" aria-hidden="true"></span>\
                  <span class="fallback-text" aria-hidden="true">−</span>\
                </button>\
                <input type="text" name="updates[]" class="ajaxcart__qty-num" value="' + product.quantity + '" min="0" data-id="' + product.key + '" data-line="1" aria-label="quantity" pattern="[0-9]*">\
                <button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--plus icon-fallback-text" data-id="' + product.key + '" data-line="1" data-qty="2" aria-label="Increase item quantity by one">\
                  <span class="icon icon-plus" aria-hidden="true"></span>\
                  <span class="fallback-text" aria-hidden="true">+</span>\
                </button>\
              </div>\
            </div>\
            <div class="grid__item one-half text-right">\
                <span class="ajaxcart__price"><span class="money" data-original-value="' + product.price + '" data-usd="$' + (product.price / 100) + ' USD">$' + (product.price / 100) + ' USD</span>\
            </span></div>\
          </div>\
        </div>\
      </div>\
    </div>';

    $('.ajaxcart__product').first().append(__element)
 }
 
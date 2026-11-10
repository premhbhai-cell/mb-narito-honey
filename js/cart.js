/* Cart page */
function summaryHTML(subtotal, ship, inner) {
  return '<div class="summary"><h2>Order Summary</h2><div class="rows">' +
    '<div class="r"><span>Subtotal</span><span>' + inr(subtotal) + '</span></div>' +
    '<div class="r"><span>Delivery</span><span>' + (ship ? inr(ship) : "FREE") + '</span></div>' +
    '<div class="r total"><span>Total</span><span>' + inr(subtotal + ship) + '</span></div></div>' +
    '<p class="free">Free delivery on orders above \u20B9999</p>' + inner + '</div>';
}
window.summaryHTML = summaryHTML;

function renderCart() {
  var root = document.getElementById("cart-root");
  if (!root) return;
  var lines = Cart.lines(), subtotal = Cart.subtotal(), ship = shippingFor(subtotal);
  if (!lines.length) {
    root.innerHTML = '<div class="empty"><h1 class="page-h1">Your cart is empty</h1><a href="shop.html" class="btn btn-primary btn-lg">Shop Now</a></div>';
    return;
  }
  root.innerHTML = '<div class="container-6 two-col"><div class="stack"><h1 class="page-h1">Your Cart</h1>' +
    lines.map(function (l) {
      return '<div class="line"><img src="' + l.product.image + '" alt="' + l.product.name + '" loading="lazy" width="80" height="80">' +
        '<div class="info-c"><p class="n">' + l.product.name + '</p><p class="w">' + inr(l.product.price) + ' \u00B7 ' + l.product.weight + '</p>' +
        '<div class="qty"><button data-q="' + l.id + '" data-d="-1">\u2212</button><span>' + l.qty + '</span><button data-q="' + l.id + '" data-d="1">+</button></div></div>' +
        '<div class="right"><p class="t">' + inr(l.qty * l.product.price) + '</p><button class="rm" data-rm="' + l.id + '" aria-label="Remove">' + icon("trash-2") + '</button></div></div>';
    }).join("") + '</div>' +
    summaryHTML(subtotal, ship, '<a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>') + '</div>';

  root.querySelectorAll("[data-q]").forEach(function (b) {
    b.onclick = function () {
      var id = b.getAttribute("data-q"), cur = Cart.lines().find(function (x) { return x.id === id; });
      Cart.setQty(id, cur.qty + Number(b.getAttribute("data-d")));
    };
  });
  root.querySelectorAll("[data-rm]").forEach(function (b) { b.onclick = function () { Cart.remove(b.getAttribute("data-rm")); }; });
}
document.addEventListener("DOMContentLoaded", renderCart);
document.addEventListener("cart:changed", renderCart);

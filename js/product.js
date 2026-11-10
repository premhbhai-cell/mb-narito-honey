/* Product detail page: product.html?id=sundarban-forest-honey */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.getElementById("product-root");
  if (!root) return;
  var id = new URLSearchParams(location.search).get("id");
  var p = PRODUCTS.find(function (x) { return x.id === id; });
  if (!p) {
    root.innerHTML = '<div class="empty"><h1 class="page-h1">Product not found</h1><a href="shop.html" class="btn btn-primary btn-lg">Back to Shop</a></div>';
    return;
  }
  document.title = p.name + " | Mb Naturo Pure";
  var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", p.description);

  var stars = ""; for (var s = 0; s < 5; s++) stars += icon("star");
  var off = Math.round((1 - p.price / p.mrp) * 100), qty = 1;

  root.innerHTML =
    '<a href="shop.html" class="back">\u2190 Back to shop</a>' +
    '<div class="product">' +
      '<img class="big" src="' + p.image + '" alt="' + p.name + '" width="816" height="816">' +
      '<div>' +
        '<p class="cat-l">' + p.category + '</p>' +
        '<h1>' + p.name + '</h1>' +
        '<div style="margin-top:.5rem"><span class="stars">' + stars + '<small>(' + p.rating + ')</small></span></div>' +
        '<div class="price-big"><span class="p">' + inr(p.price) + '</span><span class="m">' + inr(p.mrp) + '</span><span class="off">' + off + '% OFF</span></div>' +
        '<p class="weight">Net weight: ' + p.weight + '</p>' +
        '<p class="desc">' + p.description + '</p>' +
        '<div class="buy-row"><div class="qty"><button id="q-minus" type="button">\u2212</button><span id="q-val">1</span><button id="q-plus" type="button">+</button></div></div>' +
        '<button id="detail-wishlist" type="button" class="wishlist-detail" aria-pressed="false">♡ Add to Wishlist</button>' +
        '<div class="buy-btns"><button id="add-btn" type="button" class="btn btn-outline">Add to Cart</button><button id="buy-btn" type="button" class="btn btn-primary btn-lg">Buy Now</button></div>' +
        '<ul class="ticks"><li>\u2705 100% Pure &amp; Natural</li><li>\u2705 No Added Sugar</li><li>\u2705 Direct from Sundarban</li><li>\u2705 FSSAI Certified</li></ul>' +
      '</div>' +
    '</div>' +
    '<h2 class="more-h">You may also like</h2><div class="prod-grid four" id="related"></div>';

  var q = document.getElementById("q-val");
  document.getElementById("q-minus").onclick = function () { qty = Math.max(1, qty - 1); q.textContent = qty; };
  document.getElementById("q-plus").onclick = function () { qty++; q.textContent = qty; };
  var wishBtn = document.getElementById("detail-wishlist"), wishList = [];
  try { wishList = JSON.parse(localStorage.getItem("mbnp-wishlist") || "[]"); } catch (e) {}
  function syncWish() { var on = wishList.indexOf(p.id) !== -1; wishBtn.classList.toggle("active", on); wishBtn.setAttribute("aria-pressed", on ? "true" : "false"); wishBtn.textContent = on ? "♥ Added to Wishlist" : "♡ Add to Wishlist"; }
  syncWish();
  wishBtn.onclick = function () { var at = wishList.indexOf(p.id); if (at === -1) wishList.push(p.id); else wishList.splice(at,1); try { localStorage.setItem("mbnp-wishlist", JSON.stringify(wishList)); } catch (e) {} syncWish(); if (window.toast) toast(at === -1 ? "Added to wishlist" : "Removed from wishlist"); };
  document.getElementById("add-btn").onclick = function () { Cart.add(p.id, qty); toast("Added to cart"); };
  document.getElementById("buy-btn").onclick = function () { Cart.add(p.id, qty); location.href = "checkout.html"; };

  document.getElementById("related").innerHTML = PRODUCTS.filter(function (x) { return x.id !== p.id; }).slice(0, 4).map(function (x) {
    return '<div class="pcard"><a href="product.html?id=' + x.id + '" class="pimg"><img src="' + x.image + '" alt="' + x.name + '" loading="lazy" width="816" height="816"></a>' +
      '<a href="product.html?id=' + x.id + '" class="pname">' + x.name + '</a>' +
      '<div class="stars-wrap"><span class="stars">' + stars + '<small>(' + x.rating + ')</small></span></div>' +
      '<div class="price-row"><span class="price">' + inr(x.price) + '</span><span class="mrp">' + inr(x.mrp) + '</span></div>' +
      '<button class="btn btn-primary" data-add="' + x.id + '">' + icon("shopping-cart") + ' Add to Cart</button></div>';
  }).join("");
});

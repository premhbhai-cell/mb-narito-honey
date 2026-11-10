/* UPI-only checkout. Payment is confirmed manually with the seller via WhatsApp. */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.getElementById("checkout-root");
  if (!root) return;
  var pay = "Pay on UPI";
  function empty() {
    root.innerHTML = '<div class="empty"><h1 class="page-h1">Your cart is empty</h1><a href="shop.html" class="btn btn-primary btn-lg">Shop Now</a></div>';
  }
  function render() {
    var lines = Cart.lines(), subtotal = Cart.subtotal(), ship = shippingFor(subtotal);
    if (!lines.length) return empty();
    var items = '<ul class="items">' + lines.map(function (l) { return '<li>' + l.product.name + ' × ' + l.qty + '</li>'; }).join("") + '</ul>';
    root.innerHTML = '<form id="co-form" class="container-6 two-col">' +
      '<div class="stack-4"><h1 class="page-h1">Checkout</h1>' +
      '<div class="form-grid">' +
        '<input required name="name" placeholder="Full Name" class="field">' +
        '<input required name="phone" placeholder="Mobile Number" inputmode="numeric" maxlength="10" class="field">' +
        '<textarea required name="address" placeholder="House no, Street, Area" class="field span2" rows="3"></textarea>' +
        '<input required name="city" placeholder="City / Town" class="field">' +
        '<input required name="pin" placeholder="PIN Code" inputmode="numeric" maxlength="6" class="field">' +
      '</div><h2 class="sec-h">Payment</h2>' +
      '<div class="upi-payment"><strong>Pay on UPI</strong><p>Scan the QR code below using any UPI app to pay your order total.</p>' +
      '<button type="button" id="show-qr" class="btn btn-outline">View UPI QR Code</button>' +
      '<label class="pay-confirm"><input type="checkbox" name="paid"> I have completed the UPI payment</label>' +
      '<small>After submitting, your order details will be sent to our WhatsApp for payment and order confirmation.</small></div></div>' +
      summaryHTML(subtotal, ship, items + '<button type="submit" class="btn btn-primary btn-block">Place Order</button>') + '</form>' +
      '<div class="upi-modal" id="upi-modal" aria-hidden="true"><div class="upi-modal-card"><button type="button" class="upi-close" aria-label="Close">×</button><h2>Scan to Pay</h2><img src="assets/upi-qr.jpeg" alt="Mb Naturo Pure UPI QR code"><p>Scan using your UPI app, then return here to place your order.</p></div></div>';

    document.getElementById("show-qr").onclick = function () {
      var modal = document.getElementById("upi-modal"); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    };
    function closeQR() {
      var modal = document.getElementById("upi-modal"); modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    }
    root.querySelector(".upi-close").onclick = closeQR;
    root.querySelector("#upi-modal").onclick = function (e) { if (e.target.id === "upi-modal") closeQR(); };
    document.getElementById("co-form").onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, v = function (n) { return f.elements[n].value.trim(); };
      if (!/^[6-9]\d{9}$/.test(v("phone"))) return alert("Please enter a valid 10-digit mobile number");
      if (!/^\d{6}$/.test(v("pin"))) return alert("Please enter a valid 6-digit PIN code");
      if (!f.elements.paid.checked) return alert("Please complete the UPI payment and tick the confirmation box.");
      var id = "MB" + Date.now().toString().slice(-6);
      var msg = ["New Order " + id, "Payment method: UPI (customer marked payment completed - please verify)"].concat(lines.map(function (l) {
        return "• " + l.product.name + " x" + l.qty + " = " + inr(l.qty * l.product.price);
      })).concat(["Delivery: " + (ship ? inr(ship) : "FREE"), "Total: " + inr(subtotal + ship), "",
        "Name: " + v("name"), "Phone: " + v("phone"), "Address: " + v("address") + ", " + v("city") + " - " + v("pin")]).join("\n");
      window.open("https://wa.me/" + BRAND.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
      Cart.clear();
      root.innerHTML = '<div class="empty done"><div class="emoji">🍯</div><h1>Order submitted!</h1>' +
        '<p>Order ID: <b>' + id + '</b>. Your UPI payment will be verified by our team on WhatsApp before the order is confirmed.</p>' +
        '<a href="shop.html" class="btn btn-primary btn-lg">Continue Shopping</a></div>';
      done = true;
    };
  }
  var done = false; render();
  document.addEventListener("cart:changed", function () { if (!done && !document.getElementById("co-form")) render(); });
});

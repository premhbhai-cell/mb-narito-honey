/* ==========================================================
   Mb Naturo Pure - shared behaviour
   cart (localStorage), toast, mobile menu, sliders, FAQ, shop filter
   ========================================================== */
(function () {
  var KEY = "mbnp-cart";
  var WISH_KEY = "mbnp-wishlist";

  /* ---------- Cart ---------- */
  var Cart = {
    raw: function () {
      try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
    },
    save: function (l) {
      try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {}
      Cart.updateBadge();
      document.dispatchEvent(new CustomEvent("cart:changed"));
    },
    lines: function () {
      return Cart.raw().map(function (l) {
        return { id: l.id, qty: l.qty, product: PRODUCTS.find(function (p) { return p.id === l.id; }) };
      }).filter(function (l) { return l.product; });
    },
    count: function () { return Cart.lines().reduce(function (s, l) { return s + l.qty; }, 0); },
    subtotal: function () { return Cart.lines().reduce(function (s, l) { return s + l.qty * l.product.price; }, 0); },
    add: function (id, qty) {
      qty = qty || 1;
      var raw = Cart.raw(), ex = raw.find(function (l) { return l.id === id; });
      if (ex) ex.qty += qty; else raw.push({ id: id, qty: qty });
      Cart.save(raw);
    },
    setQty: function (id, qty) {
      var raw = Cart.raw();
      raw = qty <= 0 ? raw.filter(function (l) { return l.id !== id; }) : raw.map(function (l) { return l.id === id ? { id: id, qty: qty } : l; });
      Cart.save(raw);
    },
    remove: function (id) { Cart.save(Cart.raw().filter(function (l) { return l.id !== id; })); },
    clear: function () { Cart.save([]); },
    updateBadge: function () {
      var n = Cart.count();
      document.querySelectorAll(".cart-count").forEach(function (el) {
        el.textContent = n; el.classList.toggle("show", n > 0);
      });
    }
  };
  window.Cart = Cart;

  /* ---------- Toast ---------- */
  window.toast = function (msg) {
    var box = document.getElementById("toasts");
    if (!box) return;
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 300); }, 2200);
  };

  document.addEventListener("DOMContentLoaded", function () {
    Cart.updateBadge();

    /* Product card wishlist + sale badge, shared by home, shop and related products */
    var wishlist = [];
    try { wishlist = JSON.parse(localStorage.getItem(WISH_KEY) || "[]"); } catch (e) { wishlist = []; }
    function saveWishlist() { try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch (e) {} }
    document.querySelectorAll(".pcard").forEach(function (card) {
      var add = card.querySelector("[data-add]"), link = card.querySelector(".pname"), id = add ? add.getAttribute("data-add") : (link && (link.getAttribute("href") || "").split("id=")[1]);
      if (!id) return;
      var image = card.querySelector(".pimg");
      if (image) {
        image.classList.add("has-product-actions");
        if (!image.querySelector(".sale-badge")) {
          var mrp = card.querySelector(".mrp"), price = card.querySelector(".price"),
              oldPrice = mrp ? Number((mrp.textContent || "").replace(/[^0-9.]/g, "")) : 0,
              newPrice = price ? Number((price.textContent || "").replace(/[^0-9.]/g, "")) : 0;
          if (oldPrice > newPrice && newPrice > 0) {
            var sale = document.createElement("span"); sale.className = "sale-badge"; sale.textContent = Math.round((1-newPrice/oldPrice)*100) + "% OFF"; image.appendChild(sale);
          }
        }
        if (!image.querySelector(".wishlist-btn")) {
          var heart = document.createElement("button"); heart.type = "button"; heart.className = "wishlist-btn"; heart.setAttribute("aria-label", "Add to wishlist"); heart.setAttribute("aria-pressed", wishlist.indexOf(id) !== -1 ? "true" : "false"); heart.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';
          if (wishlist.indexOf(id) !== -1) heart.classList.add("active");
          heart.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); var at = wishlist.indexOf(id); if (at === -1) { wishlist.push(id); heart.classList.add("active"); heart.setAttribute("aria-pressed", "true"); toast("Added to wishlist"); } else { wishlist.splice(at,1); heart.classList.remove("active"); heart.setAttribute("aria-pressed", "false"); toast("Removed from wishlist"); } saveWishlist(); });
          image.appendChild(heart);
        }
      }
    });

    /* Add to cart buttons (event delegation) */
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]");
      if (!b) return;
      var p = PRODUCTS.find(function (x) { return x.id === b.getAttribute("data-add"); });
      Cart.add(b.getAttribute("data-add"), 1);
      if ((b.textContent || "").toLowerCase().indexOf("buy now") !== -1 || b.hasAttribute("data-buy-now")) {
        window.location.href = "checkout.html";
        return;
      }
      toast((p ? p.name : "Item") + " added to cart");
    });

    /* Mobile menu */
    var mt = document.querySelector(".menu-toggle"), mn = document.querySelector(".nav-mobile");
    if (mt && mn) mt.addEventListener("click", function () { mt.classList.toggle("open"); mn.classList.toggle("open"); });

    /* FAQ accordion (one open at a time) */
    document.querySelectorAll(".faq-q").forEach(function (q) {
      q.addEventListener("click", function () {
        var item = q.parentElement, was = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item").forEach(function (i) { i.classList.remove("open"); });
        if (!was) item.classList.add("open");
      });
    });

    /* Shop category filter */
    var filters = document.querySelectorAll(".filters button");
    if (filters.length) {
      filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
          filters.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var cat = btn.getAttribute("data-cat");
          document.querySelectorAll("#shop-grid .pcard").forEach(function (c) {
            c.style.display = (cat === "All" || c.getAttribute("data-cat") === cat) ? "" : "none";
          });
        });
      });
    }

    /* ---------- Hero slider ---------- */
    var hero = document.querySelector(".hero");
    if (hero) {
      var track = hero.querySelector(".hero-track"), slides = hero.querySelectorAll(".hero-slide"),
          dots = hero.querySelectorAll(".hero-dots button"), n = slides.length, i = 0, paused = false, startX = null;
      var go = function (k) {
        i = ((k % n) + n) % n;
        track.style.transform = "translateX(-" + (i * 100) + "%)";
        dots.forEach(function (d, j) { d.classList.toggle("active", j === i); });
        slides.forEach(function (s, j) { s.setAttribute("aria-hidden", j !== i); });
      };
      hero.querySelector(".prev").addEventListener("click", function () { go(i - 1); });
      hero.querySelector(".next").addEventListener("click", function () { go(i + 1); });
      dots.forEach(function (d, j) { d.addEventListener("click", function () { go(j); }); });
      hero.addEventListener("mouseenter", function () { paused = true; });
      hero.addEventListener("mouseleave", function () { paused = false; });
      hero.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; paused = true; }, { passive: true });
      hero.addEventListener("touchend", function (e) {
        var x = e.changedTouches[0].clientX, d = x - (startX == null ? x : startX);
        if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1));
        paused = false;
      });
      setInterval(function () { if (!paused) go(i + 1); }, 5500);
      go(0);
    }

    /* ---------- Review slider ---------- */
    document.querySelectorAll(".rev-slider").forEach(function (sec) {
      var track = sec.querySelector(".rev-track"), dotsBox = sec.querySelector(".rev-dots"),
          total = track.children.length, pages = total, page = 0, paused = false;
      var step = function () { var c = track.firstElementChild; return c ? c.offsetWidth + 16 : 0; };
      var renderDots = function () {
        dotsBox.innerHTML = "";
        for (var k = 0; k < pages; k++) {
          (function (k) {
            var b = document.createElement("button");
            b.setAttribute("aria-label", "Go to review " + (k + 1));
            b.className = k === page ? "active" : "";
            b.addEventListener("click", function () { go(k); });
            dotsBox.appendChild(b);
          })(k);
        }
      };
      var measure = function () {
        var s = step(); if (!s) return;
        var perView = Math.max(1, Math.round((track.clientWidth + 16) / s));
        var np = Math.max(1, total - perView + 1);
        var cp = Math.round(track.scrollLeft / s);
        if (np !== pages || cp !== page) { pages = np; page = cp; renderDots(); }
      };
      var go = function (p) {
        var t = ((p % pages) + pages) % pages;
        track.scrollTo({ left: t * step(), behavior: "smooth" });
      };
      sec.querySelector(".rev-prev").addEventListener("click", function () { go(page - 1); });
      sec.querySelector(".rev-next").addEventListener("click", function () { go(page + 1); });
      track.addEventListener("scroll", measure);
      window.addEventListener("resize", measure);
      ["mouseenter", "touchstart"].forEach(function (ev) { sec.addEventListener(ev, function () { paused = true; }, { passive: true }); });
      ["mouseleave", "touchend"].forEach(function (ev) { sec.addEventListener(ev, function () { paused = false; }); });
      setInterval(function () { if (!paused) go(page + 1); }, 4500);
      measure(); renderDots();
    });
  });
})();

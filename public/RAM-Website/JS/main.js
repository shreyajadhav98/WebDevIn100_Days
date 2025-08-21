import arrProducts from "./products.js";

function randomLoadProducts(items) {
  let productsSectionHome = document.querySelector(".products-section-home");
  productsSectionHome.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * items.length);
    let newProduct = document.createElement("div");
    newProduct.classList.add("p-0");
    newProduct.innerHTML = `
    <a
    href="${items[randomIndex].url}"
    class="card rounded text-black text-decoration-none p-0">
    <img
      src="${items[randomIndex].image}"
      alt="${items[randomIndex].name}"
      class="card-img-top" />
    <div class="card-body">
      <h6 class="card-title">
        ${items[randomIndex].name}
      </h6>
      <div class="product-description d-flex my-4">
        <div class="left-section">
          <p>Memory:</p>
          <p>Type:</p>
          <p>Frequency:</p>
          <p>Latency:</p>
        </div>
        <div class="right-section">
          <p>
            ${items[randomIndex].memory}
            <span class="d-none d-sm-inline-block">${items[randomIndex].memoryBracket}</span>
          </p>
          <p>
          ${items[randomIndex].type}
          </p>
          <p>${items[randomIndex].frequency}</p>
          <p>${items[randomIndex].latency}</p>
        </div>
      </div>
      <div class="btn-group d-flex mb-3">
        <button
          class="btn btn-warning btn-sm w-100 text-black"
          role="button"
          type="button">
          SPRAWDŹ
        </button>
        <button
          class="btn btn-primary btn-sm button-cart-shopping"
          role="button"
          type="button">
          <i class="fa-solid fa-cart-shopping mx-1"></i>
        </button>
        <button
          class="btn btn-outline-danger btn-sm button-heart"
          role="button"
          type="button">
          <i class="fa-solid fa-heart mx-1"></i>
        </button>
      </div>
    </div> </a
  >`;
    productsSectionHome.appendChild(newProduct);
  }
}

document.onload = randomLoadProducts(arrProducts);

// Buttons

const heartBtn = document.querySelectorAll(".button-heart");
const heartFavNum = document.getElementById("num-add-heart");

const cartBtn = document.querySelectorAll(".button-cart-shopping");
const cartAddNum = document.getElementById("num-add-cart");

heartBtn.forEach(function (heartBtn) {
  var switchButton = 1;
  heartBtn.addEventListener("click", function (event) {
    if (switchButton === 1) {
      event.preventDefault();
      heartBtn.classList.add("active");
      ++heartFavNum.innerHTML;
      switchButton = 2;
    } else if (switchButton === 2) {
      event.preventDefault();
      heartBtn.classList.remove("active");
      --heartFavNum.innerHTML;
      switchButton = 1;
    }
  });
});

cartBtn.forEach(function (cartBtn) {
  cartBtn.addEventListener("click", function (event) {
    event.preventDefault();
    cartBtn.classList.add("active");
    ++cartAddNum.innerHTML;
    setTimeout(() => {
      cartBtn.classList.remove("active");
    }, 250);
  });
});

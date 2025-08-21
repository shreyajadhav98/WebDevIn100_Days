import arrProducts from "./products.js";

let productsSectionShop = document.querySelector(".products-section-shop");

let numSearchItem = document.getElementById("num-search-item");

function loadProducts(items) {
  productsSectionShop.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    let newProduct = document.createElement("div");
    newProduct.classList.add("p-0");
    newProduct.innerHTML = `
     <a
     href="../${items[i].url}"
     class="card rounded text-black text-decoration-none p-0">
     <img
       src="../${items[i].image}"
       alt="${items[i].name}"
       class="card-img-top" />
     <div class="card-body">
       <h6 class="card-title">
         ${items[i].name}
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
             ${items[i].memory}
             <span class="d-none d-sm-inline-block">${items[i].memoryBracket}</span>
           </p>
           <p>
           ${items[i].type}
           </p>
           <p>${items[i].frequency}</p>
           <p>${items[i].latency}</p>
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
    productsSectionShop.appendChild(newProduct);
  }
  numSearchItem.innerText = items.length;
}

document.onload = loadProducts(arrProducts);

function filterProducts() {
  const nameFilter = document.getElementById("filter-name").value.toLowerCase();
  const memoryFilter = document.getElementById("filter-memory").value;
  const typeFilter = document.getElementById("filter-type").value;
  const frequencyFilter = document.getElementById("filter-frequency").value;
  const latencyFilter = document.getElementById("filter-latency").value;

  const filteredProducts = arrProducts.filter((item) => {
    return (
      (nameFilter === "" || item.name.toLowerCase().includes(nameFilter)) &&
      (memoryFilter === "" || item.memory === memoryFilter) &&
      (typeFilter === "" || item.type === typeFilter) &&
      (frequencyFilter === "" || item.frequency === frequencyFilter) &&
      (latencyFilter === "" || item.latency === latencyFilter)
    );
  });

  loadProducts(filteredProducts);
}

const filterButton = document.querySelector(".filter.submit button");
filterButton.addEventListener("click", function (event) {
  event.preventDefault();
  filterProducts();
});

const nameFilterInput = document.getElementById("filter-name");
nameFilterInput.addEventListener("input", function () {
  filterProducts();
});

// Buttons

const heartBtn = document.querySelectorAll(".button-heart");
const heartFavNum = document.getElementById("num-add-heart");

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

const cartBtn = document.querySelectorAll(".button-cart-shopping");
const cartAddNum = document.getElementById("num-add-cart");

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

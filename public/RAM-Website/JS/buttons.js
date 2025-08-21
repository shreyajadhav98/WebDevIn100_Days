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

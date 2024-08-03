// GLOBAL SELECTORS

const menuList = document.querySelector(".menu-list");
const addToCartHover = document.querySelectorAll(".add-to-cart:hover");
const cart = document.querySelector(".cart-content-wrapper");
const emptyCart = document.querySelector(".empty-cart");
const CartList = document.querySelector(".item-list");
const total = document.querySelector(".total");
const orderTotal = document.querySelector(".order-total-price");
const cartQuantity = document.querySelector(".quantity");
const confirmedModal = document.querySelector(".confirmed-order");
const confirmBtn = document.querySelector(".confirm-btn");
const orderList = document.querySelector(".order");
const overlay = document.querySelector(".overlay");
const newOrder = document.querySelector(".order-btn");
const body = document.querySelector("body");

// ON LOAD DISPLAY OF DYNAMIC CONTENT
document.addEventListener("DOMContentLoaded", (e) => {
  displayMenu();
});

// ASYNCHRONOUS FETCH FUNCTION
const fetchData = async () => {
  const response = await fetch("data.json");

  if (response.status !== 200) {
    throw new Error("cannot fetch the data");
  }
  const data = response.json();
  return data;
};

// SOME VARIABLES

// FUNCTIONS
function displayMenu() {
  fetchData().then((data) => {
    // Rendering Dynamic content

    let items = createMeal(data)[0];
    menuList.innerHTML = items.join("");
    // ADD TO CART FUNCTIONALITY

    let meals = createMeal(data)[1];
    updateCart(meals);

    confirmBtn.addEventListener("click", () => {
      displayOrder(meals);
      overlay.classList.remove("hidden");
      confirmedModal.classList.remove("hidden");
      body.classList.add("no-scroll");
    });

    newOrder.addEventListener("click", (e) => {
      displayMenu();
      body.classList.remove("no-scroll");
      overlay.classList.add("hidden");
      confirmedModal.classList.add("hidden");
    });

    CartList.addEventListener("click", (e) => {
      if (e.target.closest(".remove-btn")) {
        let parent = e.target.closest(".item");
        let mealId = parent.getAttribute("id");
        meals.forEach((meal) => {
          if (meal.id === mealId) {
            meal.quantity = 0;
            updateCart(meals);
          }
        });
      }
    });

    const addToCart = document.querySelectorAll(".add-to-cart");
    addToCart.forEach((btn) => {
      const activeState = btn.querySelector(".active-state");
      const normalState = btn.querySelector(".normal-state");
      const increaseBtn = btn.querySelector(".increase-btn");
      const reduceBtn = btn.querySelector(".reduce-btn");
      const quantity = btn.querySelector(".quantity");

      let mealId = btn.getAttribute("id");
      let mealIndex = mealId - 1;
      let currentMeal = meals[mealIndex];
      const amountControls = activeState.querySelectorAll("div");
      btn.addEventListener("click", (e) => {
        if (
          (e.target === normalState ||
            e.target.classList.contains("cart-svg")) &&
          currentMeal.quantity === 0
        ) {
          currentMeal.quantity = 1;
          quantity.innerHTML = currentMeal.quantity;
        }
        updateCart(meals);

        addToCart.forEach((item) => {
          if (item.firstElementChild !== normalState) {
            item.firstElementChild.classList.remove("hidden");
            let lastChild = item.lastElementChild;
            if (!lastChild.classList.contains("hidden")) {
              lastChild.classList.add("hidden");
            }
            item.style.border = "2px solid var(--rose-300)";
          }
        });
        if (activeState.classList.contains("hidden")) {
          activeState.classList.remove("hidden");
          normalState.classList.add("hidden");
          e.currentTarget.style.border = "none";
        }
        if (e.target.classList.contains("active-state")) {
          normalState.classList.remove("hidden");
          activeState.classList.add("hidden");
          e.currentTarget.style.border = "2px solid var(--rose-300)";
        }
      });

      let isNormal = activeState.classList.contains("hidden");
      amountControls.forEach((element) => {
        element.addEventListener("click", (e) => {
          if (element === increaseBtn) {
            currentMeal.quantity++;
          } else if (element === reduceBtn && currentMeal.quantity > 0) {
            currentMeal.quantity--;
          }
          quantity.innerHTML = currentMeal.quantity;
        });
      });
    });
  });
}

function updateCart(meals) {
  let cartItems = [];
  meals.forEach((meal) => {
    if (meal.quantity > 0) {
      cartItems.push(meal);
    }
  });

  displayCart(cartItems);
  if (cartItems.length > 0) revealCart();
  else hideCart();
}

function createMeal(data) {
  let items = [];
  let meals = [];
  let counter = 0;
  data.forEach((meal) => {
    counter++;
    let mealObject = { ...meal };
    mealObject.id = `${counter}`;
    mealObject.quantity = 0;
    meals.push(mealObject);
    let item = `<div class="menu-item flex-col">
            <picture class="img horizontal-flex">
              <source
                media="(min-width: 1250px)"
                srcset="${meal.image.desktop}"
              />
              <source
                media="(min-width: 600px)"
                srcset="${meal.image.tablet}"
              />
              <img src="${meal.image.mobile}" alt="image of ${meal.category}" />

              <div class="add-to-cart vertical-flex" id = "${mealObject.id}">
                <div class="normal-state">
                  <div class="cart">
                    <svg
                    class="cart-svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      fill="none"
                      viewBox="0 0 21 20"
                    >
                      <g fill="#C73B0F" clip-path="url(#a)">
                        <path
                          d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"
                        />
                        <path
                          d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"
                        />
                      </g>
                      <defs>
                        <clipPath id="a">
                          <path fill="#fff" d="M.333 0h20v20h-20z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  Add to Cart
                </div>
                <div class="active-state hidden">
                  <div class="reduce-btn">
                    <svg
                      class="reduce"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="2"
                      fill="none"
                      viewBox="0 0 10 2"
                    >
                      <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
                    </svg>
                  </div>
                  <span class='quantity'>${mealObject.quantity}</span>
                  <div class="increase-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        fill="#fff"
                        d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </picture>
            <span class="category">${meal.category} </span>
            <span class="name">${meal.name} </span>
            <span class="price">$ ${meal.price.toFixed(2)}</span>
          </div>`;
    items.push(item);
  });
  let info = [items, meals];
  return info;
}

function revealCart() {
  emptyCart.classList.add("hidden");
  cart.classList.remove("hidden");
}
function hideCart() {
  cart.classList.add("hidden");
  emptyCart.classList.remove("hidden");
}

function displayCart(cart) {
  let displayedCart = [];
  let amount = [];
  cart.forEach((item) => {
    let mealTotal = item.price * item.quantity;
    let cartItem = `
        <div class="item" id = ${item.id}>
              <div class="item-details">
                <span class="item-name">${item.name}</span>
                <div class="amount">
                  <span class="item-number">${item.quantity}x</span>
                  <span class="item-price">@$${item.price.toFixed(1)}</span>
                  <span class="total-price">@$${mealTotal.toFixed(2)}</span>
                </div>
              </div>
              <div class="remove-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    fill="#CAAFA7"
                    d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
                  />
                </svg>
              </div>
            </div>
        `;

    displayedCart.push(cartItem);
    amount.push(mealTotal);
  });

  let sum = amount.reduce((a, b) => {
    return a + b;
  }, 0);

  total.innerHTML = `$${sum.toFixed(2)}`;
  cartQuantity.innerHTML = cart.length;
  CartList.innerHTML = displayedCart.join("");
}

function displayOrder(meals) {
  let confirmedOrder = [];
  let amount = [];

  let order = [];
  meals.forEach((item) => {
    if (item.quantity > 0) order.push(item);
  });
  order.forEach((item) => {
    let mealTotal = item.price * item.quantity;
    let orderItem = `
        <div class="order-item">
            <div class="order-item-description">
              <div class="order-img">
                <img
                  src="${item.image.thumbnail}"
                  alt="${item.name}"
                />
              </div>
              <div class="order-item-details">
                <span class="item-name">${item.name}</span>
                <div class="order-amount">
                  <span class="item-number">${item.quantity}x</span>
                  <span class="item-price">@$${item.price.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <span class="total-price">@$${mealTotal.toFixed(2)}</span>
          </div>
        `;

    confirmedOrder.push(orderItem);
    amount.push(mealTotal);
  });

  let sum = amount.reduce((a, b) => {
    return a + b;
  }, 0);

  orderTotal.innerHTML = `$${sum.toFixed(2)}`;

  orderList.innerHTML = confirmedOrder.join("");
}

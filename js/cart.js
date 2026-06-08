// 로컬스토리지의 장바구니 정보 조회
// cartItems에 할당
// cart-list의 내용의 뒤에 태그 생성
// 과제 2
import { readCart, updateCartCount } from "./utils/common.js";
const cartItems = readCart();
const cartLayout = document.querySelector(".cart-list");
updateCartCount();
console.log(cartItems);

const cartHTML = cartItems.map(
  item =>
    `<article class="cart-item">
              <span class="item-check"><span class="check-box" aria-hidden="true"></span></span>
              <div class="cart-thumb">
                <img
                  src="${item.thumb}"
                  alt="${item.title}"
                />
              </div>
              <div class="cart-item-info">
                <h2>${item.title}</h2>
                <p>${item.brand} | 블랙</p>
                <strong>189,000원</strong>
              </div>
              <div class="quantity-box" aria-label="수량">
                <button type="button" aria-label="수량 줄이기">-</button>
                <span>${item.qty}</span>
                <button type="button" aria-label="수량 늘리기">+</button>
              </div>
              <button type="button" class="remove-item" aria-label="${item.title} 삭제"></button>
            </article>`,
);
cartLayout.innerHTML += cartHTML.join("");

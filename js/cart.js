// 로컬스토리지의 장바구니 정보 조회
// cartItems에 할당
// cart-list의 내용의 뒤에 태그 생성
// 과제 2
import { readCart, writeCart, updateCartCount } from "./utils/common.js";
const cartList = document.querySelector(".cart-list");
const cartCountText = document.querySelector(".cart-count-text");
const selectAll = document.querySelector(".select-all");
const selectAllText = selectAll.querySelector("span");
const selectDeleteBtn = document.querySelector(".cart-list-header button");
const productAmount = document.querySelector(".order-row strong");
const totalAmount = document.querySelector(".order-total strong");

let cart = readCart();
updateCartCount();
console.log(cart);

let cartHTML = [];
let selectedIds = new Set();
renderCart();
function updateCartCountFx() {
  // 상품 개수 반영
  cartCountText.textContent = `총 ${cart.length}개의 상품`;
}
updateCartCountFx();
function updateTotalAmount() {
  // 상품 금액과 총 결제 금액 업데이트
  const sum = cart.reduce((total, item) => total + item.qty * item.price, 0).toFixed(2);
  productAmount.textContent = `$${sum}`;
  totalAmount.textContent = `$${sum}`;
}
updateTotalAmount();

// 이벤트(수량변경, 삭제버튼)
cartList.addEventListener("click", e => {
  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;
  const id = Number(cartItem.dataset.id);
  const targetItem = cart.find(item => item.id === id);
  // console.log(targetItem);

  // minus
  if (e.target.closest(".minusBtn")) {
    if (targetItem.qty > 1) {
      targetItem.qty--;
      // console.log(targetItem.qty);
      // 로컬 스토리지 저장
      saveCart();
      // 화면 코드 생성
      renderCart();
      return;
    }
  }
  // plus
  if (e.target.closest(".plusBtn")) {
    targetItem.qty++;
    // console.log(targetItem.qty);
    // 로컬 스토리지 저장
    saveCart();
    // 화면 코드 생성
    renderCart();
    return;
  }
  // remove
  if (e.target.closest(".remove-item")) {
    cart = cart.filter(item => item.id !== id);
    // console.log(cart);
    // 로컬 스토리지 저장
    saveCart();
    renderCart();
    return;
  }
});

// 이벤트 (체크박스 선택)

cartList.addEventListener("change", e => {
  if (e.target.matches(".cart-item input")) {
    updateSelectState();
  }
});
function updateSelectState() {
  const checkboxes = getCheckBoxes();
  console.log(checkboxes.length);
  const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length;
  selectAllText.textContent = `전체선택 (${checkedCount}/${checkboxes.length})`;
  console.log(checkedCount);
  selectAll.querySelector("input").checked = checkedCount > 0 && checkedCount === checkboxes.length;
  selectedIds = new Set(getCheckedIds());
}
function renderCart() {
  // 기존 HTML 제거
  cartList.querySelectorAll(".cart-item").forEach(el => {
    el.remove();
  });
  cartHTML = [];

  if (cart.length === 0) {
    cartHTML.push(
      `<article>
  장바구니가 비어있습니다.
</article>`,
    );
  } else {
    cartHTML = cart.map(
      item =>
        `<article class="cart-item" data-id="${item.id}">
        <label class="item-check">
          <input type="checkbox" ${selectedIds.has(item.id) ? "checked" : ""}/>               
        </label>    
  
        <div class="cart-thumb">
          <img
            src="${item.thumb}"
            alt="${item.title}"
          />
        </div>
        <div class="cart-item-info">
          <h2>${item.title}</h2>
          <p>브랜드명 | ${item.brand}</p>
          <strong>$${item.price}</strong>
        </div>
        <div class="quantity-box" aria-label="수량">
          <button class="minusBtn" type="button" aria-label="수량 줄이기">-</button>
          <span>${item.qty}</span>
          <button class="plusBtn" type="button" aria-label="수량 늘리기">+</button>
        </div>
        <button type="button" class="remove-item" aria-label="${item.title} 삭제"></button>
      </article>
    `,
    );
  }
  cartList.insertAdjacentHTML("beforeend", cartHTML.join(""));
  updateSelectState();
}
function saveCart() {
  writeCart(cart);
  updateTotalAmount();
  updateCartCountFx();
  updateCartCount();
}

// 선택삭제
selectDeleteBtn.addEventListener("click", () => {
  const checkedIds = getCheckedIds();
  cart = cart.filter(item => !checkedIds.includes(item.id));
  selectedIds = checkedIds;
  saveCart();
  renderCart();
});
function getCheckedIds() {
  const checkboxes = getCheckBoxes();
  return checkboxes
    .filter(checkbox => checkbox.checked)
    .map(checkbox => Number(checkbox.closest(".cart-item").dataset.id));
  // console.log(checkedIds);
}
function getCheckBoxes() {
  return [...cartList.querySelectorAll(".cart-item input")];
}

selectAll.querySelector("input").addEventListener("change", e => {
  const checkboxes = getCheckBoxes();
  if (e.target.checked) {
    checkboxes.forEach(checkbox => (checkbox.checked = true));
  } else {
    checkboxes.forEach(checkbox => (checkbox.checked = false));
  }
  updateSelectState();
});

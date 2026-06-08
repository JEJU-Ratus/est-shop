import { addToCart, updateCartCount } from "./utils/common.js";
let product = {};
export async function fetchProduct() {
  // console.log(location.href);
  // console.log(location.search);
  let params = new URLSearchParams(location.search);
  // console.log(params.get("id"));
  const productID = params.get("id"); // 1
  console.log(productID);
  if (!productID) {
    alert("잘못된 접근입니다. 홈으로 이동하겠습니다.");
    location.href = "./index.html";
  }
  try {
    const res = await fetch("./data/products.json");
    if (!res.ok) throw new Error("로딩에 실패했습니다.");
    const data = await res.json();
    const products = data.products;
    // 조회된 상품정보에서 상품의 id가 productId와 일치하는 요소를 변수 product에 할당
    product = products.find(p => p.id === Number(productID));
    if (!product) {
      alert("존재하지 않는 상품입니다.");
      location.href = "./index.html";
    }
    console.log(product);
    createContent(product);
    createRecommendLists(products, product.category, Number(productID));
  } catch (err) {
    console.log(err);
  } finally {
    console.log("조회 종료");
    // console.log(product);
  }
}
function createContent(data) {
  const mainImage = document.querySelector(".main-image > img"),
    category = document.querySelector(".product-category"),
    title = document.querySelector("#product-title"),
    desc = document.querySelector(".product-description"),
    originPrice = document.querySelector(".origin-price"),
    salePrice = document.querySelector(".sale-price"),
    discountRate = document.querySelector(".discount-rate"),
    details = document.querySelector("#product-info");

  mainImage.setAttribute("src", data.images[0]);
  mainImage.setAttribute("alt", data.title);
  category.textContent = data.category;
  title.textContent = data.title;
  desc.textContent = data.description;
  originPrice.textContent = (data.price / (1 - data.discountPercentage / 100)).toFixed(2);
  salePrice.textContent = data.price;
  discountRate.textContent = data.discountPercentage;
  details.textContent = data.description;
}

// 추천상품
// all에는 전체데이터, category는 현재 category
function createRecommendLists(all, category, id) {
  const recommendList = all.filter(p => p.id !== id && p.category === category).slice(0, 4);
  const recommendGrid = document.querySelector(".recommend-grid");

  console.log(recommendList);
  const recommendHTML = recommendList.map(
    p =>
      `
          <article class="product-card">
            <img
              src="${p.thumbnail}"
              alt="${p.title}"
            />
            <div class="product-info">
              <h3><a href="detail.html?id=${p.id}">${p.title}</a></h3>
              <p>${p.category}</p>
              <div class="product-bottom">
                <strong>${p.price}</strong>
                <button
                  type="button"
                  class="cart-add"
                  aria-label="${p.title} 장바구니 담기" data-id='${p.id}'
                ></button>
              </div>
            </div>
          </article>
    `,
  );
  recommendGrid.innerHTML = recommendHTML.join("");
}

// 상품 상세 tab ------------------------------------ 과제 1
const detailTabMenus = document.querySelectorAll(".detail-tabs > a"),
  detailTabContents = document.querySelectorAll(".tab-content > section");
// detail_tab_menus를 클릭하면, 변수명 target에 클릭한 요소의 href 속성 값 할당.
detailTabMenus.forEach(m => {
  m.addEventListener("click", () => {
    detailTabMenus.forEach(tm => {
      tm.classList.remove("active");
    });
    m.classList.add("active");
    const target = m.getAttribute("href");
    // detail_tab_contents 모두가 안보이고 변수명 target에 해당하는 요소에 active 추가
    detailTabContents.forEach(tc => {
      tc.classList.remove("active");
    });
    document.querySelector(`${target}`).classList.add("active");
  });
});

fetchProduct();

// 수량 변경하기.
const quantityControl = document.querySelector(".quantity-control"),
  quantity = document.querySelector("#quantity");
//변수 currentQty id quantity

//qc를 클릭했을 때, 클릭한 그 요소가 가까운 btn이라면
let currentQty = Number(quantity.value);
quantityControl.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  //그 버튼의 내용이 - 라면 currentQty 1 차감
  if (btn.textContent === "-") {
    // console.log("마이너스");
    if (currentQty > 1) {
      currentQty--;
    }
  } else {
    //그 버튼의 내용이 + 라면 currentQty 1 증가
    // console.log("플러스");
    currentQty++;
  }
  // console.log(quantity.getAttribute("value"));
  quantity.value = currentQty;
  console.log(currentQty);
});

// 장바구니 담기 버튼 클릭하면 현재 수량을 addToCart 함수에 인수를 넣어 실행.
const addCart = document.querySelector("#addcart");
addCart.addEventListener("click", () => {
  addToCart(product, quantity.value);
});

updateCartCount();

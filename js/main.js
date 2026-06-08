import { addToCart, updateCartCount } from "./utils/common.js";

const productGrid = document.querySelector(".product-grid");
const pager = document.querySelector(".pagination .pager");
const pagerPrevBtn = document.querySelector(".pagination .prev");
const pagerNextBtn = document.querySelector(".pagination .next");
const categoryFilter = document.querySelector("#category-filter");
const priceFilter = document.querySelector("#price-filter");
const brandFilter = document.querySelector("#brand-filter");
const filteredCount = document.querySelector(".products-tools > span");
const sortSelect = document.querySelector("#sort");
// pagination
const countPerPage = 12;
const pagerPerGroup = 5; // 페이저그룹당 몇개의 페이지 생성.
let currentPage = 1;
let paginationCount = 0;
let products = [];
let currentGroup = 1;
let filteredData = [];

let selectedCategories = [];
let selectedBrands = [];
let selectedPrice = "";

fetchProducts();
// 상품조회
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    // console.log(data.products);
    products = data.products;
    filteredData = products;
    console.log(products);
    renderProducts(filteredData);
    // pagination 생성
    makePagination(filteredData.length);
    // 카테고리 생성
    renderCategories();
    // 브랜드 생성
    renderBrand();
    // 가격 생성
    renderPrices();
  } catch {
  } finally {
  }
}
// --------------------------- 상품 렌더링 ---------------------------
function renderProducts(data) {
  const pagedData = paginate(data, currentPage);
  // console.log(data, products);
  console.log(pagedData);
  const productHTML = pagedData.map(
    p =>
      `<article class="product-card">
            <img src="${p.thumbnail}" alt="${p.title}">
            <div class="product-info">
              <h3><a href="detail.html?id=${p.id}">${p.title}</a></h3>
              <p>${p.brand}</p>
              <div class="product-bottom">
                <strong>${p.price}</strong>
                <button type="button" class="cart-add" aria-label="${p.title} 장바구니 담기" data-id="${p.id}"></button>
              </div>
            </div>
          </article>`,
  );
  productGrid.innerHTML = productHTML.join("");
  // 총 n개의 상품
  filteredCount.innerHTML = `총 ${data.length}개 상품`;
}
// pagination
function makePagination(total) {
  paginationCount = Math.ceil(total / countPerPage);
  const pagerGroupCount = Math.ceil(paginationCount / pagerPerGroup);
  const startPage = (currentGroup - 1) * pagerPerGroup + 1;
  const endPage = Math.min(startPage + pagerPerGroup - 1, paginationCount);
  // console.log(pagerGroupCount);
  let pagerHTML = "";
  for (let i = startPage; i <= endPage; i++) {
    pagerHTML += `<a href="#" class="${i === currentPage ? "active" : ""}">${i}</a>`;
  }
  pager.innerHTML = pagerHTML;

  if (currentGroup === 1) {
    pagerPrevBtn.classList.add("disabled");
  } else pagerPrevBtn.classList.remove("disabled");
  if (currentGroup === pagerGroupCount) {
    pagerNextBtn.classList.add("disabled");
  } else pagerNextBtn.classList.remove("disabled");
  const pagerBtns = pager.querySelectorAll("a");
  pagerBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      let target = Number(e.target.innerHTML);
      if (currentPage === target) return;
      e.preventDefault();
      // 클릭한 요소의 숫자를 파악하고, 그 번호를 currentPage에 재할당
      // 상품 출력
      currentPage = target;
      renderProducts(filteredData);
      // 모든 pager에서 active를 제거하고 현재 활성화된 a태그에 active 추가.
      pagerBtns.forEach(pb => {
        pb.classList.remove("active");
      });
      btn.classList.add("active");
    });
  });
}

function paginate(data, pageNum) {
  const start = (pageNum - 1) * countPerPage;
  const end = start + countPerPage;
  return data.slice(start, end);
}

pagerPrevBtn.addEventListener("click", e => {
  e.preventDefault();
  moveGroup(-1);
});
pagerNextBtn.addEventListener("click", e => {
  e.preventDefault();
  moveGroup(1);
});
function moveGroup(direction) {
  currentGroup += direction;
  currentPage = (currentGroup - 1) * pagerPerGroup + 1; //1
  makePagination(filteredData.length);
  renderProducts(filteredData);
}
// ----------------------- 카테고리 생성 ----------------------------
/* <label><input type="checkbox" name="category" value="fashion" /> 패션의류</label> */

function renderCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  const frag = document.createDocumentFragment();
  categories.forEach(category => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="category" value="${category}" /> ${category}`;
    frag.appendChild(label);
  });
  categoryFilter.appendChild(frag);
  // console.log(categories);
  const categoryLabel = categoryFilter.querySelectorAll("input");
  categoryLabel.forEach(label => {
    label.addEventListener("change", () => {
      if (label.checked && label.value === "all") {
        categoryLabel.forEach(l => {
          if (l.value !== "all") {
            l.checked = false;
          }
        });
        selectedCategories = [];
      } else {
        categoryLabel.forEach(l => {
          if (l.value === "all") {
            l.checked = false;
          }
        });
        selectedCategories = [...categoryLabel]
          .filter(input => input.checked && input.value !== "all")
          .map(input => input.value);
      }
      applyFilter();
    });
  });
}
function renderBrand() {
  const brands = [...new Set(products.map(p => p.brand))];
  const frag = document.createDocumentFragment();
  brands.forEach(brand => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="brand" value="${brand}" /> ${brand}`;
    frag.appendChild(label);
  });
  brandFilter.appendChild(frag);
  // console.log(brands);
  const brandInputs = brandFilter.querySelectorAll("input");
  brandInputs.forEach(label => {
    label.addEventListener("change", () => {
      selectedBrands = [...brandInputs].filter(input => input.checked).map(input => input.value);

      applyFilter();
    });
  });
}

function renderPrices() {
  const priceHTML = `
  <label><input type="radio" name="price" value="low" /> 10$ 미만</label>
  <label><input type="radio" name="price" value="middle" /> 10$ ~ 100$ 미만</label>
  <label><input type="radio" name="price" value="high" /> 100$ 이상</label>
  `;
  priceFilter.innerHTML += priceHTML;
  const priceInputs = priceFilter.querySelectorAll("input");
  priceInputs.forEach(input => {
    input.addEventListener("change", () => {
      selectedPrice = input.value;
      applyFilter();
    });
  });
}
//필터 적용 함수
function applyFilter() {
  let result = [...products];

  // 카테고리
  if (selectedCategories.length > 0) {
    result = result.filter(p => selectedCategories.includes(p.category));
  }
  // 가격
  if (selectedPrice === "low") {
    result = result.filter(p => p.price < 10);
  } else if (selectedPrice === "middle") {
    result = result.filter(p => p.price >= 10 && p.price < 100);
  } else if (selectedPrice === "high") {
    result = result.filter(p => p.price >= 100);
  }
  // 브랜드
  if (selectedBrands.length > 0) {
    result = result.filter(p => selectedBrands.includes(p.brand));
  }

  currentPage = 1;
  currentGroup = 1;
  filteredData = result;
  renderProducts(filteredData);
  makePagination(filteredData.length);
}

sortSelect.addEventListener("change", () => {
  const selectedValue = sortSelect.value;
  console.log(selectedValue);
  // if (selectedValue === "인기순") {
  //   filteredData.sort((a, b) => {
  //     return b.rating - a.rating;
  //   });
  // } else if (selectedValue === "최신순") {
  //   filteredData.sort((a, b) => {
  //     return new Date(b.meta.createdAt) - new Date(a.meta.createdAt);
  //   });
  // } else if (selectedValue === "낮은 가격순") {
  //   filteredData.sort((a, b) => {
  //     return a.price - b.price;
  //   });
  // } else if (selectedValue === "높은 가격순") {
  //   filteredData.sort((a, b) => {
  //     return b.price - a.price;
  //   });
  // }
  switch (selectedValue) {
    case "인기순":
      filteredData.sort((a, b) => {
        return b.rating - a.rating;
      });
      break;
    case "최신순":
      filteredData.sort((a, b) => {
        return new Date(b.meta.createdAt) - new Date(a.meta.createdAt);
      });
      break;
    case "낮은 가격순":
      filteredData.sort((a, b) => {
        return a.price - b.price;
      });
      break;
    case "높은 가격순":
      filteredData.sort((a, b) => {
        return b.price - a.price;
      });
      break;
  }
  currentPage = 1;
  currentGroup = 1;
  renderProducts(filteredData);
  makePagination(filteredData.length);
});

// 장바구니 추가
let cart = [];
productGrid.addEventListener("click", e => {
  const btn = e.target.closest("button");
  const pid = Number(btn.dataset.id);
  if (!btn) return;
  const product = products.find(p => p.id === pid);
  addToCart(product);
});
updateCartCount();

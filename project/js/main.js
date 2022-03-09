"use strict";
$(document).ready(() => firstLoad());

function firstLoad() {
  let products = []; // 장바구니 추가한 상품들을 저장하기 위한 용도

  // 데이터바인딩
  getProducts();
}

// 데이터바인딩(json파일에 있는 데이터를 ajax get 요청하기)
function getProducts() {
  $.get("resources1/store.json").done((data) => {
    data.products.forEach((상품, i) => {
      appendProducts(상품, i);
    });
  });
}

// 상품 데이터바인딩 코드, drag 기능 가능하도록 설정(jquery UI)
function appendProducts(product, index) {
  let newItem = $(`
  <div class="card cardView" data-index="${index}" style="width: 20%; margin-right: 15px">
  <img src="resources1/${product.photo}" class="card-img" />
  <div class="card-body">
  <h5 class="card-product product-name">${product.product_name}</h5>
  <p class="card-brand brand-name">${product.brand_name}</p>
  </div>
  <ul class="list-group list-group-flush">
  <li class="list-group-item">${product.price}</li>
  </ul>
  </div>
  `).draggable({
    zIndex: 999,
    revert: "invalid",
  });

  $(".card_list").append(newItem);
}

// 모달창: login 버튼을 누르면 로그인창 띄우기/닫기 버튼 누르면 닫기/빈칸 알람 띄우기
$(".login").click(() => $(".black-background").fadeIn());
$("#close").click(() => $(".black-background").fadeOut());
$("form").on("submit", (e) => {
  let input2 = $("#email").val();
  if (input2 == "") {
    e.preventDefault(); // form 전송을 막는
    $("#email-alert").show();
    $("#password-alert").hide();
  } else if ($("#password").val() == "") {
    e.preventDefault();
    $("#password-alert").show();
    $("#email-alert").hide();
  }
});

// toggle 버튼 - 메뉴 슬라이드 다운
$(".toggle_btn").hover(() => $(".toggle_all").fadeToggle());

// 상품 검색 기능: input에 검색어를 입력하면 그 글자를 가지고 있는 상품만 보여주기
$(".input").on("input", () => {
  let inputVal = $(".input").val();
  let productName = $(".card_list").find(".product-name");
  let cardShow = $(".card_list");
  let brandName = $(this).find(".brand-name");

  $(".card_list").html("");
  productArray.forEach((a, i) => {
    if (productName[i].text().indexOf(inputVal) !== -1) {
      cardShow[i].show();
    }

    // if (productName.text().indexOf(inputVal) !== -1) {
    //   $(`.card${i}`).
    // }
  });
});

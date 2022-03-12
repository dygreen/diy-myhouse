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
  <li class="list-group-item price">${product.price}</li>
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

// 장바구니 부분: drop 기능 (jquery UI)
$(".drop-area").droppable({
  drop: function (event, ui) {
    let item = $(ui.draggable);
    let index = item.attr("data-index"); // 0, 1, 2, 3
    let img = item.find("img");
    let productName = item.find(".product-name").text();
    let brandName = item.find(".brand-name").text();
    let price = item.find(".price").text();

    // 상품 원위치 시키기
    item.css({
      position: "relative",
      top: "auto",
      left: "auto",
    });

    // 중복되는 상품이 있을 경우
    let productInBasket = $(`#basket-list [data-index=${index}]`);
    if (productInBasket.length) {
      alert("이미 장바구니에 담긴 상품입니다.");
      return;
    }

    //드롭했을 시 그 밑에 상품목록 생성해주기
    let 장바구니상품 = $(`
    <div class="card-deck">
        <div class="card mb-3" style="max-width: 540px;" data-index="${index}">
            <div class="row no-gutters">
                <div class="col-md-4 overflow-hidden">
                    <img src="${img.attr(
                      "src"
                    )}" class="card-img h-100 w-auto" alt="${productName}" title="${productName}">
                </div>
                <div class="col-md-7">
                    <div class="card-body">
                    <h5 class="card-title product-name">${productName}</h5>
                    <p class="card-text brand-name">${brandName}</p>
                    <p class="card-text"><small class="text-muted price">${price}</small></p>
                    <p class="card-text">
                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm-${index}">수량</span>
                            </div>
                            <input type="number" min="1" value="1" class="form-control number" >
                        </div>
                    </p>
                    <p class="card-text">합계 <span class="sum">${price}</span>원</p>
                    </div>
                </div>
                <button type="button" class="col-md-1 btn-delete">X</button>
            </div>
        </div>
    </div>
    `);

    $("#basket-list").append(장바구니상품);
    setTotalSum();
  },
});

//장바구니 변동될 때마다 총 금액 계산해주는 기능
function setTotalSum() {
  let totalSum = 0;

  $("#basket-list .sum").each(function () {
    totalSum += parseInt($(this).text(), 10);
  });

  $("#total-sum").text(totalSum);
}

//
//
//
//
//
//
//
//
//
//
//

// 상품 검색 기능: input에 검색어를 입력하면 그 글자를 가지고 있는 상품만 보여주기
$(".input").on("input", () => {
  // let productName = products.product_name;
  let inputVal = $(".input").val();
  // let cardShow = $(".card_list > div");
  // let brandName = $(".card_list").find(".brand-name");

  $(".card_list").html("");
  if ("식기세척기".indexOf(inputVal) !== -1 && inputVal !== "") {
    console.log(inputVal);
  }

  // $(".card_list").html("");
  // products.forEach((i) => {
  //   if (products[i].product_name.indexOf(inputVal) !== -1) {
  //     cardShow.eq(i).show();
  //   } else {
  //     $("#msg-empty").show();
  //   }
  // });
});

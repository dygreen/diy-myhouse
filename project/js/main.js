"use strict";
$(document).ready(() => firstLoad());

function firstLoad() {
  // 데이터바인딩
  getProducts();

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
                  <div class="col-md-4 overflow-hidden ">
                      <img src="${img.attr(
                        "src"
                      )}" class="card-img w-auto" alt="${productName}" title="${productName}">
                  </div>
                  <div class="col-md-7" >
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
                  <button type="button" class="col-md-1 btn-delete ">X</button>
              </div>
          </div>
      </div>
      `);

      // x 버튼을 누르면 (장바구니에서) 해당 항목 삭제
      장바구니상품.find("button.btn-delete").click(() => {
        장바구니상품.remove(); // .hide()도 가능
        setTotalSum();
      });

      // 장바구니 '수량'에 따른 합계 계산
      장바구니상품.find("input[type='number']").on("keyup change", function () {
        let valueSum = parseInt(price, 10) * $(this).val();
        장바구니상품.find(".sum").text(valueSum);

        setTotalSum();
      });
      // *(keyup과 change를 같이 써야 자동완성될 때 이벤트가 발동 안할 경우 대비 가능)

      // 장바구니 리스트에 붙여넣기
      $("#basket-list").append(장바구니상품);
      setTotalSum();
    },
  });
}

//장바구니 변동될 때마다 '총 금액' 계산해주는 기능
function setTotalSum() {
  let totalSum = 0;

  $("#basket-list .sum").each(function () {
    totalSum += parseInt($(this).text(), 10);
  });

  $("#total-sum").text(totalSum);
}

//
//

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

// 
// 

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

//
//


// 구매하기 버튼: 장바구니 비었음 알림 / 구매자 정보 입력 모달창
$('.buyBtn').click(() => {
  let basketList = $('#basket-list *');
  if( basketList.length === 0) {
    alert('장바구니가 비어있습니다.');
    return;
  } else {
    $('.buyerContainer').fadeIn();
  }
})


// 구매자 정보 입력: 닫기 버튼 / 구매완료 버튼
// 닫기 버튼
$('#close2').click(() => $('.buyerContainer').fadeOut());
// 구매완료 버튼
$('#buySuccess').click(() => Receipt());

// 
// 

// 영수증 이미지: 구매한 물품을 영수증으로 보여주기
function Receipt() {
  $('.receipt').show();
  $('#receiptBtn').show();
  
  // canvas 설정
  let canvas = document.getElementById('canvas');
  let c = canvas.getContext('2d');
  $('#canvas').attr('width', '500').attr('height', '700');

  // 영수증
  c.font = 'bold 18px Malgun Gothic';
  c.fillText('영수증', 20, 50);

  // 날짜
  let date = new Date();
  c.font = 'bold 14px Malgun Gothic';
  c.fillText(date, 20, 80);

  // 구매 물품
  $('#basket-list > div').each(function(i) {
    let productName = $(this).find('.product-name').text();
    let brandName = $(this).find('.brand-name').text();
    let price = $(this).find('.price').text();
    let number = $(this).find('.number').val();
    let sum = $(this).find('.sum').text();

    c.fillText(productName, 20, 120 * (i + 1));
    c.fillText(brandName, 20, 120 * (i + 1) + 20);
    c.fillText(`가격: ${price}`, 20, 120 * (i + 1) + 40);
    c.fillText(`수량: ${number}`, 20, 120 * (i + 1) + 60);
    c.fillText(`합계: ${sum}`, 20, 120 * (i + 1) + 80);
  });

  // 총 합계
  let totalSum = $('#total-sum').text();
  c.fillText(`총 합계: ${totalSum}`, 20, 650);

  // 닫기 버튼
  $('#receiptBtn').click(() => {$('.receipt').fadeOut()})
}

//
//

// 상품 검색 기능: input에 검색어를 입력하면 그 글자를 가지고 있는 상품만 보여주기
$("input.search").on("input", function () {
  let input = $("input.search").val();
  
  // 검색어와 일치하는 상품 보여주기
  $(".card_list > div").each(function() {
    let productName = $(this).find(".product-name");
    let brandName = $(this).find(".brand-name");
    let card = $(this);

    if ( input === '' ) {
      $('#msg-empty').hide();
      $('.card_list').show();
      return;
    } else {
      $('.card_list').hide();
    }


    if ( productName.text().indexOf(input) !== -1 ) {
      let pnHighlight = productName.text().replace(input, `<span class='highlight'>${input}</span>`);
      productName.html(pnHighlight);
      card.css('display', 'block');
      console.log(card);
    } else if ( brandName.text().indexOf(input) !== -1) {
      let bnHighlight = brandName.text().replace(input, `<span class='highlight'>${input}</span>`);
      brandName.html(bnHighlight);
      $(this).show();
    } else {
      $("#msg-empty").show();
    }






    // if (
    //   productName.text().indexOf(input) !== -1 ||
    //   brandName.text().indexOf(input) !== -1
    // ) {
    //   const prHighLight = productName
    //     .text()
    //     .replace(input, `<span class='highlight'>${input}</span>`);
    //   productName.html(prHighLight);
    //   $(this).css("display", "block");
    //   // card.eq(1).show();
    //   // card.eq(1).show();
    //   $("#msg-empty").hide();
    // } else {
    //   $("#msg-empty").show();
    // }

    //
    //
    //
    // if (productName.text().indexOf(input) !== -1) {
    //   productName.find($(".card_list > div")).css("display", "block");
    //   // $(".card_list > div")
    //   // $(this).css("display", "block");
    //   console.log("yes");
    //   $("#msg-empty").hide();
    //   // $(this).show(); // this 고민하기!
    // } //else {
    // //$("#msg-empty").show();
    // //}
    // else if (brandName.text().indexOf(input) !== -1) {
    //   console.log("no");
    //   // $(".card_list > div").css("display", "block");
    //   $("#msg-empty").hide();
    // } else {
    //   $("#msg-empty").show();
    // }
  });
});

//
//
//
//
//
//

// $(".input").on("input", () => {
//   // let productName = products.product_name;
//   let inputVal = $(".input").val();
//   // let cardShow = $(".card_list > div");
//   // let brandName = $(".card_list").find(".brand-name");

//   $(".card_list").html("");
//   if ("식기세척기".indexOf(inputVal) !== -1 && inputVal !== "") {
//     console.log(inputVal);
//   }

//   // $(".card_list").html("");
//   // products.forEach((i) => {
//   //   if (products[i].product_name.indexOf(inputVal) !== -1) {
//   //     cardShow.eq(i).show();
//   //   } else {
//   //     $("#msg-empty").show();
//   //   }
//   // });
// });

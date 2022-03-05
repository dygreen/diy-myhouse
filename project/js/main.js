"use strict";

function getProducts() {
  $.get("resources1/");
}

// toggle 버튼 - 메뉴 슬라이드 다운
$(".toggle_btn").hover(() => $(".toggle_all").slideToggle());

// toggle 버튼 - 가운데 컨텐츠가 밑으로 내려가는
$(".toggle_btn").hover(() => $(".middleAndFooter").addClass(".midFotDown"));

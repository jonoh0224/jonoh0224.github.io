if (EC$("#feat_container_").length) {
  alert("feat 거네!");
  EC$("#feat_container_").append("<h1>요기 살짝</h1>");
}
CAFE24API.init('3j8vdlLGDVOiftrcxYmyRE')
CAFE24API.getCartItemList((err,res) => {
  console.log(res)
  console.log(CAFE24API.MALL_ID)
})

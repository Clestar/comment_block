var commentCount = 0;
var commentList=[];
var option;
function comment_extract(){
  commentList=[];
    var dccommentList = document.getElementsByClassName('usertxt');
    for( var i = 0; i < dccommentList.length; i++){
        if(dccommentList[i].classList.contains("extracted")) continue;
        var commentString = dccommentList[i].innerText;
        commentList.push({
            "id":"tmp",
            "text": commentString
        })
        commentCount++;
        if(commentCount==20){
          console.log(commentList);
          send_message();
          commentCount=0;
          commentList=[];
        }
    }
    console.log(commentList);
    send_message();
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(data){
  var dccommentList = document.getElementsByClassName('usertxt');
  var json_idx=0;
    for( var i = 0; i < dccommentList.length; i++){
        if(dccommentList[i].classList.contains("extracted")) continue;
        var origin_text = dccommentList[i].innerText;
        dccommentList[i].setAttribute('data-origin-text',origin_text);
        dccommentList[i].setAttribute('data-censored','true');
        dccommentList[i].innerText = "검열된 댓글입니다"
        console.log(data[json_idx].labelPrediction);
        json_idx++;
        dccommentList[i].classList.add("extracted");
        dccommentList[i].addEventListener("click", (e) => {
          if(e.target.getAttribute('data-censored')==='true'){
            e.target.innerText = e.target.getAttribute('data-origin-text');
            e.target.setAttribute('data-censored','false');
          }
          else{
            e.target.innerText = "검열된 댓글입니다";
            e.target.setAttribute('data-censored','true');
          }
          
      });
    }
}
comment_extract();
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  const intervalId = setInterval(() => {
      commentCount=0;
      comment_extract();
      if (commentCount > 0) {
          clearInterval(intervalId);
      }
  }, 1000);
});
function send_message(){
  fetch('https://project-march.inha.me/api/blind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(commentList),
  })
  .then((response) => response.json())
  .then((data) => replace(data));
}
var commentCount = 0;
var commentList=[];
var option = null;
var idx = 0;
console.log('hi dc');
function comment_extract(){
    var dccommentList = document.getElementsByClassName('usertxt');
    for( var i = 0; i < dccommentList.length; i++){
        if(dccommentList[i].classList.contains("extracted")) continue;
        dccommentList[i].setAttribute('idx',idx);
        var commentString = dccommentList[i].innerText;
        comment={
          "id":idx.toString(),
          "text": commentString
        }
        idx++;
        commentCount++;
        send_message();
    }
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(data){
  var dccommentList = document.getElementsByClassName('usertxt');
  for( var i = 0; i < dccommentList.length; i++){
      if(dccommentList[i].classList.contains("extracted")) continue;
      if(dccommentList[i].getAttribute('idx')!=parseInt(data.id)) continue;
      var origin_text = dccommentList[i].innerText;
      var blind_text="검열된 댓글입니다. by ";
      var censor = false;
      var prediction = data.labelPrediction;
      for(var j = 0; j < 7; j++){
        if(prediction[j].label=='clean') {
          if(prediction[j].score>0.9){
            censor=false;
            break;
          }
        }
        if(option[prediction[j].label]){
          if(prediction[j].score>option["intensity"]/100){
            blind_text+=prediction[j].label+" ";
            censor=true;
          }
        }
      }
      if(censor){
        dccommentList[i].setAttribute('data-origin-text',origin_text);
        dccommentList[i].setAttribute('data-censored','true');
        dccommentList[i].innerText = blind_text;
        dccommentList[i].addEventListener("click", (e) => {
          if(e.target.getAttribute('data-censored')==='true'){
            e.target.setAttribute('data-censored',e.target.innerText);
            e.target.innerText = e.target.getAttribute('data-origin-text');
          }
          else{
            e.target.innerText = e.target.getAttribute('data-censored');
            e.target.setAttribute('data-censored','true');
          }   
        });
      }
      dccommentList[i].classList.add("extracted");
    }
}
if(option==null){
  const intervaloption = setInterval(() => {
    if(option!=null) {
      comment_extract();
      clearInterval(intervaloption);
    }
}, 100);
}
else{
  if(option["on"]==true){
    const intervalId = setInterval(() => {
      commentCount=0;
      comment_extract();
      if (commentCount > 0) {
          clearInterval(intervalId);
      }
  }, 1000);
  }
}
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  console.log('start');
  if(option["on"]==true){
    const intervalId = setInterval(() => {
      commentCount=0;
      comment_extract();
      if (commentCount > 0) {
          clearInterval(intervalId);
      }
  }, 1000);
  }
});
function send_message(){
  fetch('https://project-march.inha.me/api/blind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(comment),
  })
  .then((response) => response.json())
  .then((data) => replace(data));
}
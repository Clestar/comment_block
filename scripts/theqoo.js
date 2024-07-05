var commentCount = 0;
var commentList=[];
var option;
var idx = 0;
var flag=true;
console.log('hi theqoo');
function comment_extract(){
  commentCount=0;
    var theqoocommentList = document.getElementsByClassName('fdb_itm');
    for( var i = 0; i < theqoocommentList.length; i++){
        if(theqoocommentList[i].classList.contains("extracted")) continue;
        if(theqoocommentList[i].getAttribute('idx')!==null) continue;
        theqoocommentList[i].setAttribute('idx',idx);
        var commentString = theqoocommentList[i].children[1].innerText;
        if(commentString=="") continue;
        comment={
          "id":idx.toString(),
          "text": commentString
        }
        idx++;
        commentCount++;
        
        send_message();
    }
    flag=true;
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(data){
  var theqoocommentList = document.getElementsByClassName('fdb_itm');
    for( var i = 0; i < theqoocommentList.length; i++){
        if(theqoocommentList[i].classList.contains("extracted")) continue;
        if(theqoocommentList[i].getAttribute('idx')!=parseInt(data.id)) continue;
        var theqooText = theqoocommentList[i].children[1];
        var origin_text = theqooText.innerText;
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
          theqooText.setAttribute('data-origin-text',origin_text);
          theqooText.setAttribute('data-censored','true');
          theqooText.innerText = blind_text;
          theqooText.addEventListener("click", (e) => {
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
        theqoocommentList[i].classList.add("extracted");  
    }
}
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
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  var stop=false;
  if(option["on"]==true){
    var timer =0;
    const intervalId = setInterval(() => {
      if(stop==true) clearInterval(intervalId);
      if(flag==true){
        flag=false;
        comment_extract();
        if (commentCount == 100) {
            clearInterval(intervalId);
        }
        timer++;
        if(timer == 5) stop=true;
      }
  }, 1000);
  }
  });
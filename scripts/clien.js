var commentCount = 0;
var commentList=[];
var option;
var idx = 0;
console.log('hi clien');
function comment_extract(){
  console.log("hi")
    var cliencommentList = document.getElementsByClassName('comment_view');
    for( var i = 0; i < cliencommentList.length; i++){
        if(cliencommentList[i].classList.contains("extracted")) continue;
        cliencommentList[i].setAttribute('idx',idx);
        var commentString = cliencommentList[i].innerText;

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
  var cliencommentList = document.getElementsByClassName('comment_view');
    for( var i = 0; i < cliencommentList.length; i++){
        if(cliencommentList[i].classList.contains("extracted")) continue;
        if(cliencommentList[i].getAttribute('idx')!=parseInt(data.id)) continue;
        var origin_text = cliencommentList[i].innerText;
        var blind_text="검열된 댓글입니다. by ";
        var censor = false;
        var prediction = data.labelPrediction;
        for(var j = 0; j < 7; j++){
          if(prediction.label=='clean') continue;
          if(option[prediction[j].label]){
            if(prediction[j].score>option["intensity"]/100){
              blind_text+=prediction[j].label+" ";
              censor=true;
            }
          }
        }
        if(censor){
          cliencommentList[i].setAttribute('data-origin-text',origin_text);
          cliencommentList[i].setAttribute('data-censored','true');
          cliencommentList[i].innerText = blind_text;
          cliencommentList[i].addEventListener("click", (e) => {
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
        cliencommentList[i].classList.add("extracted");  
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
var stop=false;
    const intervalId = setInterval(() => {
      if(stop==true) clearInterval(intervalId);
      console.log('catch');
        commentCount=0;
        comment_extract();
        if (commentCount == 20) {
            clearInterval(intervalId);
        }
        stop=true;
  }, 1000);
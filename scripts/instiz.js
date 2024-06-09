var commentCount = 0;
var commentList=[];
var option;
var idx = 0;
console.log('hi instiz')
function comment_extract(){
  console.log("hi")
    var instizcommentList = document.getElementsByClassName('comment_line');
    for( var i = 0; i < instizcommentList.length; i++){
        if(instizcommentList[i].classList.contains("extracted")) continue;
        instizcommentList[i].setAttribute('idx',idx);
        var commentString = instizcommentList[i].firstElementChild.innerText;

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
  var instizcommentList = document.getElementsByClassName('comment_line');
    for( var i = 0; i < instizcommentList.length; i++){
        if(instizcommentList[i].classList.contains("extracted")) continue;
        if(instizcommentList[i].getAttribute('idx')!=parseInt(data.id)) continue;
        var origin_text = instizcommentList[i].firstElementChild.innerText;
        var blind_text="검열된 댓글입니다. by ";
        var censor = false;
        var prediction = data.labelPrediction;
        for(var j = 0; j < 7; j++){
          if(prediction.label=='clean') continue;
          if(option[prediction[j].label]){
            console.log(prediction[j].score+ " "+ option["intensity"]/100)
            if(prediction[j].score>option["intensity"]/100){
              blind_text+=prediction[j].label+" ";
              censor=true;
            }
          }
        }
        if(censor){
          instizcommentList[i].setAttribute('data-origin-text',origin_text);
          instizcommentList[i].setAttribute('data-censored','true');
          var commentString = instizcommentList[i].firstElementChild.innerText = blind_text;
          instizcommentList[i].addEventListener("click", (e) => {
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
        instizcommentList[i].classList.add("extracted");  
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
    const intervalId = setInterval(() => {
        commentCount=0;
        console.log('detect');
        comment_extract();
        if (commentCount > 0) {
            clearInterval(intervalId);
        }
    }, 1000);
});
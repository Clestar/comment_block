var commentCount = 0;
var commentList=[];
var option;
var idx = 0;
console.log('hi instiz')
function comment_extract(){
  console.log("hi")
    var theqoocommentList = document.getElementsByClassName('fdb_itm');
    for( var i = 0; i < theqoocommentList.length; i++){
        if(theqoocommentList[i].classList.contains("extracted")) continue;
        theqoocommentList[i].setAttribute('idx',idx);
        var commentString = theqoocommentList[i].children[1].innerText;

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
  var theqoocommentList = document.getElementsByClassName('fdb_itm');
    for( var i = 0; i < theqoocommentList.length; i++){
        if(theqoocommentList[i].classList.contains("extracted")) continue;
        if(theqoocommentList[i].getAttribute('idx')!=parseInt(data.id)) continue;
        var commentString = theqoocommentList[i].children[1].innerText;
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
          theqoocommentList[i].setAttribute('data-origin-text',origin_text);
          theqoocommentList[i].setAttribute('data-censored','true');
          var commentString = theqoocommentList[i].children[1].innerText = blind_text;
          theqoocommentList[i].addEventListener("click", (e) => {
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
    const intervalId = setInterval(() => {
        commentCount=0;
        comment_extract();
        if (commentCount > 0) {
            clearInterval(intervalId);
        }
    }, 1000);
});
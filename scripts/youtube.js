var commentCount = 0;
var commentList=[];
var option;
var idx = 0;
//ytd-comment-view-model
//yt-core-attributed-string
function comment_extract(){
    var youtubecommentList = document.getElementsByTagName('ytd-comment-view-model');
    for( var i = 0; i < youtubecommentList.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;
        youtubecommentList[i].setAttribute('idx',idx);
        var commentString = youtubecommentList[i].querySelector('#content-text').innerText;
        comment={
          "id":idx.toString(),
          "text": commentString
        }
        commentCount++;
        idx++;
        send_message();
    }  
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(data){
  var youtubecommentList = document.getElementsByTagName('ytd-comment-view-model');
    for( var i = 0; i < youtubecommentList.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;
        if(youtubecommentList[i].getAttribute('idx')!=parseInt(data.id)) continue;
        youtubecommentList[i].classList.add("extracted"); 
        var youtubeText = youtubecommentList[i].querySelector('#content-text');
        var origin_text = youtubeText.innerText;
        var blind_text="검열된 댓글입니다. by ";
        var censor = false;
        var prediction = data[i].labelPrediction;
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
          youtubeText.setAttribute('data-origin-text',origin_text);
          youtubeText.setAttribute('data-censored','true');
          youtubeText.innerText = blind_text
          youtubeText.addEventListener("click", (e) => {
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
        youtubecommentList[i].classList.add("extracted"); 
    }
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
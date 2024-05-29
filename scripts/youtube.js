var commentCount = 0;
var commentList=[];
var option;
//ytd-comment-view-model
//yt-core-attributed-string
console.log('hi_youtube');
function comment_extract(){
  commentList=[];
    var youtubecommentList = document.getElementsByTagName('ytd-comment-view-model');
    for( var i = 0; i < youtubecommentList.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;
        var commentString = youtubecommentList[i].querySelector('#content-text').innerText;
        commentList.push({
            "id":commentCount,
            "text": commentString
        })
        commentCount++;
    }
    console.log(commentList);
    send_message();
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(data){
  var youtubecommentList = document.getElementsByTagName('ytd-comment-view-model');
  console.log(data.length);
    for( var i = 0; i < data.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;
        youtubecommentList[i].classList.add("extracted"); 
        var youtubeText = youtubecommentList[i].querySelector('#content-text');
        var origin_text = youtubeText.innerText;
        var blind_text="검열된 댓글입니다. by ";
        var censor = false;
        var prediction = data[i].labelPrediction;
        for(var j = 0; j < 6; j++){
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
          //console.log(data[json_idx].labelPrediction);
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
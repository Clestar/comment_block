var commentCount = 0;
var commentList=[];
var option;
//ytd-comment-view-model
//yt-core-attributed-string

function comment_extract(){
  commentList=[];
    var youtubecommentList = document.getElementsByTagName('ytd-comment-view-model');
    for( var i = 0; i < youtubecommentList.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;
        var commentString = youtubecommentList[i].querySelector('#content-text').innerText;
        commentList.push({
            "id":"tmp",
            "text": commentString
        })
        commentCount++;
    }
    console.log(commentList);
    //send_message();
    replace();
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(){
  var youtubecommentList = document.getElementsByTagName('ytd-comment-view-model');
  var json_idx=0;
    for( var i = 0; i < youtubecommentList.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;
        var youtubeText = youtubecommentList[i].querySelector('#content-text');
        var origin_text = youtubeText.innerText;
        youtubeText.setAttribute('data-origin-text',origin_text);
        youtubeText.setAttribute('data-censored','true');
        youtubeText.innerText = "검열된 댓글입니다"
        //console.log(data[json_idx].labelPrediction);
        json_idx++;
        youtubeText.classList.add("extracted");
        youtubeText.addEventListener("click", (e) => {
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
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error)); //throw된 error를 받아서 console에 출력
}
var commentCount = 0;
var commentList=[];
function comment_extract(){
    var youtubecommentList = document.getElementsByTagName('ytd-comment-thread-renderer');
    for( var i = 0; i < youtubecommentList.length; i++){
        if(youtubecommentList[i].classList.contains("extracted")) continue;

        var commentString = youtubecommentList[i].querySelector('#content-text').innerText;
        youtubecommentList[i].classList.add("extracted");
        commentList.push({
            "id":"tmp",
            "text": commentString
        })
        commentCount++;
    }
    console.log(commentList);
    send_message();
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
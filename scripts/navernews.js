var commentCount = 0;
var commentList=[];
function comment_extract(){
    var navercommentList = document.getElementsByClassName('u_cbox_contents');
    for( var i = 0; i < navercommentList.length; i++){
        if(navercommentList[i].classList.contains("extracted")) continue;
        
        navercommentList[i].classList.add("extracted");
        var commentString = navercommentList[i].innerText;
        commentList.push({
            "id":"tmp",
            "contents": commentString
        })
        commentCount++;
    }
    console.log(commentList);
    send_message();
}

function send_message(){
    fetch('http://18.139.83.84:8080/api/blind', {
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
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    const intervalId = setInterval(() => {
        commentCount=0;
        comment_extract();
        if (commentCount > 0) {
            clearInterval(intervalId);
        }
    }, 1000);
});
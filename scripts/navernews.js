var commentCount = 0;
var commentList=[];
var option;
function comment_extract(){
  commentList=[];
    var navercommentList = document.getElementsByClassName('u_cbox_contents');
    for( var i = 0; i < navercommentList.length; i++){
        if(navercommentList[i].classList.contains("extracted")) continue;
        var commentString = navercommentList[i].innerText;
        commentList.push({
            "id":"tmp",
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
  var navercommentList = document.getElementsByClassName('u_cbox_contents');
  var json_idx=0;
    for( var i = 0; i < navercommentList.length; i++){
        if(navercommentList[i].classList.contains("extracted")) continue;
        var origin_text = navercommentList[i].innerText;
        navercommentList[i].setAttribute('data-origin-text',origin_text);
        navercommentList[i].setAttribute('data-censored','true');
        navercommentList[i].innerText = "검열된 댓글입니다"
        console.log(data[json_idx].labelPrediction);
        json_idx++;
        navercommentList[i].classList.add("extracted");
        navercommentList[i].addEventListener("click", (e) => {
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
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    const intervalId = setInterval(() => {
        commentCount=0;
        comment_extract();
        if (commentCount > 0) {
            clearInterval(intervalId);
        }
    }, 1000);
});
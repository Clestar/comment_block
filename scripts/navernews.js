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
  var navercommentList = document.getElementsByClassName('u_cbox_contents');
    for( var i = 0; i < navercommentList.length; i++){
        if(navercommentList[i].classList.contains("extracted")) continue;
        var origin_text = navercommentList[i].innerText;
        var blind_text="검열된 댓글입니다. by ";
        var censor = false;
        var prediction = data[i].labelPrediction;
        for(var j = 0; j < 6; j++){
          if(option[prediction[j].label]){
            console.log(prediction[j].score+ " "+ option["intensity"]/100)
            if(prediction[j].score>option["intensity"]/100){
              blind_text+=prediction[j].label+" ";
              censor=true;
            }
          }
        }
        if(censor){
          navercommentList[i].setAttribute('data-origin-text',origin_text);
          navercommentList[i].setAttribute('data-censored','true');
          navercommentList[i].innerText = blind_text;
          navercommentList[i].addEventListener("click", (e) => {
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
        navercommentList[i].classList.add("extracted");  
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
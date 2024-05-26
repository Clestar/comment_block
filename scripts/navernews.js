var commentCount = 0;
var commentList=[];
var option;
function comment_extract(){
    var navercommentList = document.getElementsByClassName('u_cbox_contents');
    for( var i = 0; i < navercommentList.length; i++){
        if(navercommentList[i].classList.contains("extracted")) continue;
        
        //navercommentList[i].classList.add("extracted");
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
  for (var key in option) {
    console.log(key + " : " + option[key]);
}
});
function replace(data){
  var navercommentList = document.getElementsByClassName('u_cbox_contents');
  var json_idx=0;
    for( var i = 0; i < navercommentList.length; i++){
        if(navercommentList[i].classList.contains("extracted")) continue;
        console.log(data[json_idx].labelPrediction);
        json_idx++;
        navercommentList[i].classList.add("extracted");
        navercommentList[i].innerText += "검열된 댓글입니다";
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
    .then((data) => console.log(data));
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
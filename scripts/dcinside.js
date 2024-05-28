var commentCount = 0;
var commentList=[];
var option;
function comment_extract(){
  commentList=[];
    var dccommentList = document.getElementsByClassName('usertxt');
    for( var i = 0; i < dccommentList.length; i++){
        if(dccommentList[i].classList.contains("extracted")) continue;
        var commentString = dccommentList[i].innerText;
        commentList.push({
            "id":commentCount,
            "text": commentString
        })
        commentCount++;
        /*
        if(commentCount==20){
          console.log(commentList);
          send_message();
          commentCount=0;
          commentList=[];
        }
        */
    }
    console.log(commentList);
    send_message();
}
chrome.storage.local.get("option", function(data) {
  option = data.option
});
function replace(data){
  var dccommentList = document.getElementsByClassName('usertxt');
  for( var i = 0; i < dccommentList.length; i++){
      if(dccommentList[i].classList.contains("extracted")) continue;
      var origin_text = dccommentList[i].innerText;
      dccommentList[i].setAttribute('data-origin-text',origin_text);
      dccommentList[i].setAttribute('data-censored','true');
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
      //console.log(data[json_idx].labelPrediction);
      
      if(censor){
        dccommentList[i].setAttribute('data-origin-text',origin_text);
        dccommentList[i].setAttribute('data-censored','true');
        dccommentList[i].innerText = blind_text;
        dccommentList[i].addEventListener("click", (e) => {
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
      dccommentList[i].classList.add("extracted");
    }
}
comment_extract();
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
var commentCount = 0;
function comment_extract(){
    var navercommentList = document.getElementsByClassName('u_cbox_contents');
    for( var i = 0; i < navercommentList.length; i++){
        var commentString = navercommentList[i].innerText;
        commentCount++;
        console.log(commentString);
    }
}

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    const intervalId = setInterval(() => {
        commentCount=0;
        console.log(commentCount);
        comment_extract();
        if (commentCount > 0) {
            clearInterval(intervalId);
        }
    }, 1000);
});
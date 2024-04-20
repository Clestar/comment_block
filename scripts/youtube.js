function comment_extract(){
    var commentList = document.getElementsByTagName('ytd-comment-thread-renderer');
    for( var i = 0; i < commentList.length; i++){
      var commentString = commentList[i].querySelector('#content-text').innerText;
      console.log(commentString);
    }
}
//comment_extract();
function callback(mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type === "childList" && mutation.target.tag==="ytd-comment-thread-renderer") {
          //comment_extract();
          console.log(mutation.target);
        }
    }
    
}
window.onload=function(){
    setTimeout(start,3000);
};
document.querySelector("#expander-contents.style-scope.ytd_comment-replies-renderer");
function start(){
    console.log("start");
    var target_xpath = "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-comments/ytd-item-section-renderer/div[3]"
    var target = document.evaluate(
        target_xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true,
    };
    console.log(target);
    
    const observer = new MutationObserver(callback);
    observer.observe(target, observerOptions);
}




var commentList = [];
function comment_extract(){
    var elements = document.querySelectorAll('li[id^="comment_li_"]');
    var commentCount = 0;
    elements.forEach(function(element) {
        if(commentCount>20){
            send_message();
            commentCount=0;
        }
        var pElement = element.querySelector("p");
        if(pElement != null){
            commentCount++;
            commentList.push({
                "id":"tmp",
                "text": pElement.textContent
            })
            console.log(pElement.textContent);
            var reply="reply_list"+element.id.substr(10);
            var re_Element = document.querySelector("#"+reply);
            if(re_Element!=null){
                re_Element = re_Element.querySelectorAll("li");
                re_Element.forEach(function(re_element) {
                    var re_pElement = re_element.querySelectorAll("p");
                    if(re_pElement !=null){
                        re_pElement.forEach(function(re){
                            commentCount++;
                            commentList.push({
                                "id":"tmp",
                                "text": re.textContent
                            })
                            console.log("\t"+re.textContent);
                        })
                        
                    }
                });
            }
        }
    });
    send_message();
}
comment_extract();
const targetNode = document.querySelector("div.view_comment");
function callback(mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-comment-cnt") {
          comment_extract();
        }
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
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error)); //throw된 error를 받아서 console에 출력
}
const observerOptions = {
 
  attributes: true,

  // false를 지정하거나 아예 생략하여 부모 노드의 변경만 감지
  subtree: true,
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, observerOptions);

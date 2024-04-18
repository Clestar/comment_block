var elements = document.querySelectorAll('li[id^="comment_li_"]');
elements.forEach(function(element) {
    var pElement = element.querySelector("p");
    if(pElement != null){
        console.log(pElement.textContent);
        var reply="reply_list"+element.id.substr(10);
        var re_Element = document.querySelector("#"+reply);
        if(re_Element!=null){
            re_Element = re_Element.querySelectorAll("li");
            re_Element.forEach(function(re_element) {
                var re_pElement = re_element.querySelectorAll("p");
                if(re_pElement !=null){
                    re_pElement.forEach(function(re){
                        console.log("\t"+re.textContent);
                    })
                    
                }
            });
        }
    }
});
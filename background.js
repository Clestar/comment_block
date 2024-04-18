function setStorage(key, value) {
    let setObj = {};
    setObj[key] = value;
    chrome.storage.local.set(setObj);
}
function getStorage(){
    chrome.storage.local.get(setObj);
}
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if(message.action === "save_options"){
        setStorage("option", message.data);
    }  
    if(message.action === "get_options"){
        chrome.storage.local.get("option", function(data) {
            sendResponse({ data: data });
          });
        return true;
    }
});
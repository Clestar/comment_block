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
  
const networkFilters = {
    urls: ["https://*.youtube.com/*"],
};
//https://apis.naver.com/commentBox/cbox/web_naver_list_jsonp.json?
chrome.webRequest.onCompleted.addListener(tmp, {urls:["https://apis.naver.com/commentBox/cbox/web_naver_list_*"]});
chrome.webRequest.onCompleted.addListener(sendMessageToActiveTab, {urls:["https://www.youtube.com/youtubei/v1/next?prettyPrint=false"]});
async function tmp(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
async function sendMessageToActiveTab(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
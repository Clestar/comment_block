function setStorage(key, value) {
    let setObj = {};
    setObj[key] = value;
    chrome.storage.local.set(setObj);
}
function getStorage(){
    chrome.storage.local.get("option");
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
    if(message.action === "initialize_options"){
        var option_data = { 
            on : true,  
            intensity : 50,
            "성차별" : true,
            "인종/국적/지역" : true,
            "연령" : true,
            "종교" : true,
            "악플/욕설" : true,
            "정치/기타혐오" : true,
        };
        setStorage("option",option_data);
        sendResponse(option_data);
    }
});
//https://theqoo.net/modules/board/skins/sketchbook5_ajax/ejs/comment.ejs?version=13
chrome.webRequest.onCompleted.addListener(sendClien, {urls:["https://www.clien.net/service/board/*/*"]});
chrome.webRequest.onCompleted.addListener(sendTheqoo, {urls:["https://theqoo.net/*/*"]});
chrome.webRequest.onCompleted.addListener(sendInstiz, {urls:["https://www.instiz.net/*/*"]});
chrome.webRequest.onCompleted.addListener(sendNaver, {urls:["https://apis.naver.com/commentBox/cbox/web_naver_list_*"]});
chrome.webRequest.onCompleted.addListener(sendDC, {urls:["https://gall.dcinside.com/board/comment/"]});
chrome.webRequest.onCompleted.addListener(sendYoutube, {urls:["https://www.youtube.com/youtubei/v1/next?prettyPrint=false"]});
async function sendTheqoo(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
async function sendClien(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
async function sendInstiz(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
async function sendNaver(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
async function sendDC(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
async function sendYoutube(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, message);
}
var slider = document.getElementById("option_slider");
document.getElementById("value").textContent=slider.value;
slider.oninput = function(){
    document.getElementById("value").textContent=slider.value;
};
var on = document.getElementById("switch");
var total_check = document.getElementById("0");
var gender_check = document.getElementById("1");
var origin_check = document.getElementById("2");
var age_check = document.getElementById("3");
var religion_check = document.getElementById("4");
var physical_check = document.getElementById("5");
var politic_check = document.getElementById("6");

document.addEventListener("DOMContentLoaded", async () => {
    const response = await chrome.runtime.sendMessage({action: "get_options"});
    var data = response.data.option;
    if(data==null){
        data = await chrome.runtime.sendMessage(
            {
                action: "initialize_options"
            }
        );
    }
    on.checked = data["on"];
    slider.value = data["intensity"]
    document.getElementById("value").textContent=slider.value;
    gender_check.checked = data["성차별"];
    origin_check.checked = data["인종/국적/지역"];
    age_check.checked = data["연령"];
    religion_check.checked = data["종교"];
    physical_check.checked = data["악플/욕설"];
    politic_check.checked = data["정치/기타혐오"];
});

total_check.addEventListener("click", () => {
    check_value = total_check.checked;
    origin_check.checked = check_value;
    physical_check.checked = check_value;
    politic_check.checked = check_value;
    age_check.checked = check_value;
    gender_check.checked = check_value;
    religion_check.checked = check_value;
});
var option_btn = document.getElementById("option_btn");
option_btn.addEventListener("click", () => {
    var option_data = { 
        on : on.checked,
        intensity : slider.value,
        "성차별" : gender_check.checked,
        "인종/국적/지역" : origin_check.checked,
        "연령" : age_check.checked,
        "종교" : religion_check.checked,
        "악플/욕설" : physical_check.checked,
        "정치/기타혐오" : politic_check.checked,
    };
    chrome.runtime.sendMessage(
        {
            action: "save_options",
            data: option_data
        }
    );
});
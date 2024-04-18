var slider = document.getElementById("option_slider");
document.getElementById("value").textContent=slider.value;
slider.oninput = function(){
    document.getElementById("value").textContent=slider.value;
};
var total_check = document.getElementById("0");
var origin_check = document.getElementById("1");
var physical_check = document.getElementById("2");
var politic_check = document.getElementById("3");
var profanity_check = document.getElementById("4");
var age_check = document.getElementById("5");
var gender_check = document.getElementById("6");
var race_check = document.getElementById("7");
var religion_check = document.getElementById("8");

document.addEventListener("DOMContentLoaded", async () => {
    const response = await chrome.runtime.sendMessage({action: "get_options"});
    console.log(response.data.option);
    slider.value = response.data.option.intensity;
    document.getElementById("value").textContent=slider.value;
    origin_check.checked = response.data.option.origin;
    physical_check.checked = response.data.option.physical;
    politic_check.checked = response.data.option.politic;
    profanity_check.checked = response.data.option.profanity;
    age_check.checked = response.data.option.age;
    gender_check.checked = response.data.option.gender;
    race_check.checked = response.data.option.race;
    religion_check.checked = response.data.option.religion;
})

total_check.addEventListener("click", () => {
    check_value = total_check.checked;
    origin_check.checked = check_value;
    physical_check.checked = check_value;
    politic_check.checked = check_value;
    profanity_check.checked = check_value;
    age_check.checked = check_value;
    gender_check.checked = check_value;
    race_check.checked = check_value;
    religion_check.checked = check_value;
});
var option_btn = document.getElementById("option_btn");
option_btn.addEventListener("click", () => {
    var option_data = { 
        intensity : slider.value,
        origin : origin_check.checked,
        physical : physical_check.checked,
        politic : politic_check.checked,
        profanity : profanity_check.checked,
        age : age_check.checked,
        gender : gender_check.checked,
        race : race_check.checked,
        religion : religion_check.checked,
    };
    chrome.runtime.sendMessage(
        {
            action: "save_options",
            data: option_data
        }
    );
});
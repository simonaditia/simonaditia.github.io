const displayTime = () => {
    moment.locale("id");
    $(".time").text(moment().format("h:mm:ss a,"));
    $(".date").text(moment().format("LL"));
};

const updateTime = () => {
    displayTime();
    setTimeout(updateTime, 1000)
};

updateTime();
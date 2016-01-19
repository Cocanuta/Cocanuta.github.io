/**
 * Created by Ben on 18/01/2016.
 */
var xhttp = new XMLHttpRequest();
var overallRuntime = 0;
var items = [];
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        read(xhttp);
        initialize();
    }
};
xhttp.open("GET", "database.xml", true);
xhttp.send();

function toggleCheckbox(checkbox, item)
{
    if(checkbox.checked)
    {
        subtractFromRuntime(parseInt(item["Runtime"].data));
        setCookie(item["Name"].data, checkbox.checked? 1: 0, 100);
    }
    if(!checkbox.checked)
    {
        addToRuntime(parseInt(item["Runtime"].data));
        setCookie(item["Name"].data, checkbox.checked? 1: 0, 100);
    }
    updateTotal();
}

function updateTotal()
{
    var time = secondsToTime(overallRuntime);
    document.getElementById("remainingTime").innerHTML = time["d"] + " Days " + time["h"] + " Hours " + time["m"] + " Minutes";
}

function secondsToTime(mins)
{
    var minPerHour = 60;
    var minPerDay = 60 * 24;

    var minutes = mins;
    var days = Math.floor(minutes / minPerDay);
    minutes = minutes - days * minPerDay;
    var hours = Math.floor(minutes / minPerHour);
    minutes = minutes - hours * minPerHour;

    var obj = {
        "d": days,
        "h": hours,
        "m": minutes
    };
    return obj;
}

function addToRuntime(time)
{
    overallRuntime += time;
}
function subtractFromRuntime(time)
{
    overallRuntime -= time;
}

function CountDownTimer(dt, id)
{
    var end = new Date(dt);

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {

            clearInterval(timer);
            document.getElementById(id).innerHTML = 'EXPIRED!';

            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);

        document.getElementById(id).innerHTML = days + ' Days ';
        document.getElementById(id).innerHTML += hours + ' Hours ';
        document.getElementById(id).innerHTML += minutes + ' Minutes';
    }
    showRemaining();

    timer = setInterval(showRemaining, 60000);
}

function setCookie(c_name, value, expiredays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate);
}

function getCookie(c_name)
{
    if(document.cookie.length>0)
    {
        c_start = document.cookie.indexOf(c_name + "=")
        if(c_start != 1)
        {
            c_start = c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";", c_start);
            if(c_end==-1) c_end=document.cookie.lenght
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return null;
}

function initialize() {
    var container = document.getElementById("container");
    CountDownTimer('04/29/2016 00:01 AM', 'civilwarClock');
    items.forEach(function(item)
    {
        var newItem = document.createElement("div");
        var checkbox = document.createElement("input");
        var label = document.createElement("label");
        var name = item["Name"].data;
        var runtime = parseInt(item["Runtime"].data);

        if (item["Type"] == "Movie") {
            newItem.className = "bubble movie";
        }
        if (item["Type"] == "TV") {
            newItem.className = "bubble tv";
        }
        if (item["Type"] == "Netflix") {
            newItem.className = "bubble netflix";
        }
        if (item["Type"] == "OneShot") {
            newItem.className = "bubble oneshot";
        }
        if (item["Type"] == "WHIH") {
            newItem.className = "bubble whih";
        }

        checkbox.type = "checkbox";
        checkbox.onclick = function(){toggleCheckbox(this, item)};
        checkbox.className = "css-checkbox";
        checkbox.checked = getCookie(name)==1? true : false;
        checkbox.id = name;

        label.htmlFor = name;
        label.className = "css-label";
        label.appendChild(document.createTextNode(name + " - " + runtime + "min"));

        newItem.appendChild(checkbox);
        newItem.appendChild(label);

        container.appendChild(newItem);
        if(!checkbox.checked)
        {
            addToRuntime(runtime);
        }

    });
    updateTotal();
}

function read(xml) {
    var xmlDoc = xml.responseXML;
    var ite = Array.prototype.slice.call(xmlDoc.getElementsByTagName("Items")[0].childNodes);
    items = [];

    for(var i = 0; i < ite.length; i++)
    {
        if(ite[i].nodeName.toString() == "Movie")
        {
            var Movie = {
                "Type" : "Movie",
                "Name" : ite[i].childNodes[0].childNodes[0],
                "Runtime" : ite[i].childNodes[1].childNodes[0]
            };
            items.push(Movie);
        }
        if(ite[i].nodeName.toString() == "TV")
        {
            var TV = {
                "Type" : "TV",
                "Name" : ite[i].childNodes[1].childNodes[0],
                "Runtime" : ite[i].childNodes[4].childNodes[0],
                "Series" : ite[i].childNodes[0].childNodes[0],
                "Season" : ite[i].childNodes[2].childNodes[0],
                "Episode" : ite[i].childNodes[3].childNodes[0]
            };
            items.push(TV);
        }
        if(ite[i].nodeName.toString() == "Netflix")
        {
            var Netflix = {
                "Type" : "Netflix",
                "Name" : ite[i].childNodes[1].childNodes[0],
                "Runtime" : ite[i].childNodes[4].childNodes[0],
                "Series" : ite[i].childNodes[0].childNodes[0],
                "Season" : ite[i].childNodes[2].childNodes[0],
                "Episode" : ite[i].childNodes[3].childNodes[0]
            };
            items.push(Netflix);
        }
        if(ite[i].nodeName.toString() == "OneShot")
        {
            var OneShot = {
                "Type" : "OneShot",
                "Name" : ite[i].childNodes[0].childNodes[0],
                "Runtime" : ite[i].childNodes[1].childNodes[0]
            };
            items.push(OneShot);
        }
        if(ite[i].nodeName.toString() == "WHIH")
        {
            var WHIH = {
                "Type" : "WHIH",
                "Name" : ite[i].childNodes[0].childNodes[0],
                "Runtime" : ite[i].childNodes[1].childNodes[0]
            };
            items.push(WHIH);
        }

    }

}

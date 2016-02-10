/**
 * Created by Ben on 18/01/2016.
 */
$(document).ready(function () {
    var xhttp = new XMLHttpRequest();
    var overallRuntime = 0;
    var items = [];
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            read(xhttp);
            initialize();
        }
    };
    xhttp.open("GET", "../newDatabase.xml", true);
    xhttp.send();

    function toggleCheckbox(checkbox, item)
    {
        if(checkbox.checked)
        {
            subtractFromRuntime(parseInt(item["Runtime"].data));
            item["Watched"].data = "true";

        }
        if(!checkbox.checked)
        {
            addToRuntime(parseInt(item["Runtime"].data));
            item["Watched"].data = "false";

        }
        writeXML();
        updateTotal();
    }

    function updateTotal()
    {
        var time = secondsToTime(overallRuntime);
        document.getElementById("remainingTime").innerHTML = time["d"] + " Days " + time["h"] + " Hours " + time["m"] + " Minutes";

        var checkboxes = document.getElementsByClassName("css-checkbox");
        var count = 0;
        var sum = 0;
        for(var i = 0; i < checkboxes.length; i++)
        {
            if(!checkboxes[i].checked)
            {
                count++;
                sum += parseInt(items[i]["Runtime"].data);
            }
        }
        var avg = sum / count;
        document.getElementById("remainingWatch").innerHTML = "YOU MUST WATCH " + Math.ceil((sum / DaysTillCivilWar()) / avg) + " ITEMS  PER DAY";
        var percentage = Math.round((checkboxes.length - count)/checkboxes.length * 100);
        var percElem = document.getElementById("remainingPercentage");
        percElem.innerHTML = percentage.toString() + "%";
        var percWidth = 0;
        var id = setInterval(frame, 10);
        function frame()
        {
            if(percWidth == percentage)
            {
                clearInterval(id);
            }
            else
            {
                percWidth++;
                percElem.style.width = percWidth + '%';
            }
        }
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

    function DaysTillCivilWar()
    {
        var end = new Date('04/29/2016 00:01 AM');

        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
        var timer;

        var now = new Date();
        var distance = end - now;

        var days = Math.floor(distance / _day);

        return days;



    }



    function initialize() {
        var container = document.getElementById("container");
        CountDownTimer('04/29/2016 00:01 AM', 'civilwarClock');
        items.forEach(function(item)
        {
            var newItem = document.createElement("div");
            var details = document.createElement("div");
            var checkbox = document.createElement("input");
            var label = document.createElement("label");
            var name = item["Name"].data;
            var runtime = parseInt(item["Runtime"].data);
            var expander = document.createElement("a");

            expander.className = "expander";

            expander.href = "#";

            var poster = document.createElement("img");
            poster.src = "../images/posters/" + item["Poster"].data + ".jpg";
            poster.className = "poster";
            details.appendChild(poster);

            var title = document.createElement("p");
            title.className = "details title";

            newItem.className = "bubble";
            newItem.style.backgroundImage = "url('../images/banners/" + item["Poster"].data + ".jpg')";

            if (item["Type"] == "Movie") {

                label.appendChild(document.createTextNode(name + " - " + runtime + "min"));
                title.appendChild(document.createTextNode(name + " - " + item["Year"].data));
            }
            if (item["Type"] == "TV") {
                label.appendChild(document.createTextNode(item["Series"].data + " " + "S" + item["Season"].data + "E" + item["Episode"].data + " - " + runtime + "min"));
                title.appendChild(document.createTextNode(name + " - " + item["Year"].data));
            }
            if (item["Type"] == "Netflix") {
                label.appendChild(document.createTextNode(item["Series"].data + " " + "S" + item["Season"].data + "E" + item["Episode"].data + " - " + runtime + "min"));
                title.appendChild(document.createTextNode(name + " - " + item["Year"].data));
            }
            if (item["Type"] == "OneShot") {
                label.appendChild(document.createTextNode(name + " - " + runtime + "min"));
                title.appendChild(document.createTextNode(name + " - " + item["Year"].data));

            }
            if (item["Type"] == "WHIH") {
                label.appendChild(document.createTextNode(name + " - " + runtime + "min"));
                title.appendChild(document.createTextNode(name + " - " + item["Year"].data));

            }

            details.appendChild(title);

            var text = document.createElement("p");
            text.appendChild(document.createTextNode(item["Overview"].data));
            text.className = "details";
            details.appendChild(text);


            checkbox.type = "checkbox";
            checkbox.onclick = function(){toggleCheckbox(this, item)};
            checkbox.className = "css-checkbox";
            if(item["Watched"].data.toString() == "true")
            {
                checkbox.checked = true;
            }
            else
            {
                checkbox.checked = false;
            }
            checkbox.id = name;

            label.htmlFor = name;
            label.className = "css-label";



            details.className = "content";

            newItem.appendChild(checkbox);
            newItem.appendChild(label);
            newItem.appendChild(expander);

            newItem.appendChild(details);

            container.appendChild(newItem);

            if(!checkbox.checked)
            {
                addToRuntime(runtime);
            }

        });
        $(function () {
            $('.expander').simpleexpand({'hideMode' : 'fadeToggle'});
        });
        updateTotal();
    }

    function writeXML() {

        var file = "";

        file += '<?xml version="1.0" encoding="utf-8"?>\n';
        file += '<Database>\n';
        file +='    <Items>\n';

        items.forEach(function(item)
        {
            file += '        <' + item["Type"].toString() + '>';
            file += '<Name>' + item["Name"].data.toString() + '</Name>';
            file += '<Runtime>' + item["Runtime"].data.toString() + '</Runtime>';
            file += '<Overview>' + item["Overview"].data.toString() + '</Overview>';
            file += '<Year>' + item["Year"].data.toString() + '</Year>';
            file += '<Poster>' + item["Poster"].data.toString() + '</Poster>';
            if(item["Type"].toString() == "TV" || item["Type"].toString() == "Netflix")
            {
                file += '<Series>' + item["Series"].data.toString() + '</Series>';
                file += '<Season>' + item["Season"].data.toString() + '</Season>';
                file += '<Episode>' + item["Episode"].data.toString() + '</Episode>';
            }
            file += '<Watched>' + item["Watched"].data.toString() + '</Watched>';
            file += '</' + item["Type"].toString() + '>\n';

        });

        file += '    </Items>\n';
        file += '</Database>\n';

        $.ajax({
            url: '../writeXML.php',
            type: 'POST',
            data: 'data=' + file,
        })
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
                    "Runtime" : ite[i].childNodes[1].childNodes[0],
                    "Overview" : ite[i].childNodes[2].childNodes[0],
                    "Year" : ite[i].childNodes[3].childNodes[0],
                    "Poster" : ite[i].childNodes[4].childNodes[0],
                    "Watched" : ite[i].childNodes[5].childNodes[0]
                };
                items.push(Movie);
            }
            if(ite[i].nodeName.toString() == "TV")
            {
                var TV = {
                    "Type" : "TV",
                    "Name" : ite[i].childNodes[0].childNodes[0],
                    "Runtime" : ite[i].childNodes[1].childNodes[0],
                    "Series" : ite[i].childNodes[5].childNodes[0],
                    "Season" : ite[i].childNodes[6].childNodes[0],
                    "Episode" : ite[i].childNodes[7].childNodes[0],
                    "Overview" : ite[i].childNodes[2].childNodes[0],
                    "Year" : ite[i].childNodes[3].childNodes[0],
                    "Poster" : ite[i].childNodes[4].childNodes[0],
                    "Watched" : ite[i].childNodes[8].childNodes[0]
                };
                items.push(TV);
            }
            if(ite[i].nodeName.toString() == "Netflix")
            {
                var Netflix = {
                    "Type" : "Netflix",
                    "Name" : ite[i].childNodes[0].childNodes[0],
                    "Runtime" : ite[i].childNodes[1].childNodes[0],
                    "Series" : ite[i].childNodes[5].childNodes[0],
                    "Season" : ite[i].childNodes[6].childNodes[0],
                    "Episode" : ite[i].childNodes[7].childNodes[0],
                    "Overview" : ite[i].childNodes[2].childNodes[0],
                    "Year" : ite[i].childNodes[3].childNodes[0],
                    "Poster" : ite[i].childNodes[4].childNodes[0],
                    "Watched" : ite[i].childNodes[8].childNodes[0]
                };
                items.push(Netflix);
            }
            if(ite[i].nodeName.toString() == "OneShot")
            {
                var OneShot = {
                    "Type" : "OneShot",
                    "Name" : ite[i].childNodes[0].childNodes[0],
                    "Runtime" : ite[i].childNodes[1].childNodes[0],
                    "Overview" : ite[i].childNodes[2].childNodes[0],
                    "Year" : ite[i].childNodes[3].childNodes[0],
                    "Poster" : ite[i].childNodes[4].childNodes[0],
                    "Watched" : ite[i].childNodes[5].childNodes[0]
                };
                items.push(OneShot);
            }
            if(ite[i].nodeName.toString() == "WHIH")
            {
                var WHIH = {
                    "Type" : "WHIH",
                    "Name" : ite[i].childNodes[0].childNodes[0],
                    "Runtime" : ite[i].childNodes[1].childNodes[0],
                    "Overview" : ite[i].childNodes[2].childNodes[0],
                    "Year" : ite[i].childNodes[3].childNodes[0],
                    "Poster" : ite[i].childNodes[4].childNodes[0],
                    "Watched" : ite[i].childNodes[5].childNodes[0]
                };
                items.push(WHIH);
            }

        }

    }

});
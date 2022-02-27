var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var offset = $("#body > div > div > div > div > div").offset();

var offsetTop = [
    $("#body > div > div > div > div > div.panel-heading").height(),
    $("#body > div > div > div > div > div.panel-body > ul").height()
].reduce((a, b) => a + b, 0);

var offsetL = offset.left;
var offsetT = offset.top + offsetTop;

var trackDataKeys = {
    mTrack: 'Mouse Data',
    cTrack: 'Click Data',
    scTrack: 'Scroll Data',
    kTrack: 'Keyboard Data',
    sData: 'Sensor Data',
    sessions: 'Tracking Sessions'
}

ctx.canvas.width = $(".tab-content").width();

function parseResultData(resultData) {

    var content = "";

    for (var key in resultData) {        

        content += '<div class="panel-group" style="margin-top: 20px;margin-bottom: 1px;" id="' + key + '">';

        for (var key2 in resultData[key]) {
            content += '\
					<div class="panel panel-primary">\
					<div class="panel-heading">\
					<h4 class="panel-title">\
					<a aria-expanded="false" data-toggle="collapse" href="#' + key + key2 + '">' + (trackDataKeys[key2]) + '</a>\
					</h4>\
					</div>\
					<div id="' + key + key2 + '" class="panel-collapse collapse" id>\
					<div class="panel-body"> <table class="table table-striped table-bordered">\
					 <thead>\
					 <tr>\
					<th>Key</th>\
					<th>Value</th>\
					 </tr>\
					</thead>\
					<tbody>';

            if (typeof resultData[key][key2] === 'array') {
                for (var key3 in resultData[key][key2]) {
                    content += '<tr>\
								<td>' + key3 + '</td>\
								<td><pre><code>' + JSON.stringify(resultData[key][key2][key3]) + '</code></pre></td>\
								</tr>';
                }
            } else {

                for (var key3 in resultData[key][key2]) {
                    content += '<tr>\
						<td>' + key3 + '</td>\
						<td><pre><code>' + JSON.stringify(resultData[key][key2][key3], null, 2) + '</code></pre></td>\
						</tr>';
                }

            }
            content += '</tbody>\
					 </table></div>\
					</div>\
					</div>';

        }

        content += '</div>';

    }

    return content;

}

function parseBrowserData(resultData) {

    resultData = JSON.parse(resultData);

    var content = "";

    content += '<div class="panel-group" style="margin-top: 20px;margin-bottom: 1px;" id="' + key + '">';

    for (var key in resultData) {
        content += '\
                <div class="panel panel-primary">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a aria-expanded="false" data-toggle="collapse" href="#' + key + '">' + (key) + '</a>\
                </h4>\
                </div>\
                <div id="' + key + '" class="panel-collapse collapse" id>\
                <div class="panel-body"> <table class="table table-striped table-bordered">';

        if (typeof resultData[key] === 'array' || typeof resultData[key] === 'object') {
            content += '\
                    <thead>\
                    <tr>\
                    <th>Key</th>\
                    <th>Value</th>\
                    </tr>\
                    </thead>\
                    <tbody>';
        } else {
            content += '\
                    <thead>\
                    <tr>\
                    <th>Value</th>\
                    </tr>\
                    </thead>\
                    <tbody>';

        }

        if (typeof resultData[key] === 'array' || typeof resultData[key] === 'object') {
            for (var key3 in resultData[key]) {
                content += '<tr>\
                            <td>' + key3 + '</td>\
                            <td><pre><code>' + JSON.stringify(resultData[key][key3]) + '</code></pre></td>\
                            </tr>';
            }
        } else {

            content += '<tr>\
                    <td colspan="2"><pre><code>' + JSON.stringify(resultData[key], null, 2) + '</code></pre></td>\
                    </tr>';

        }

        content += '</tbody>\
                    </table></div>\
                </div>\
                </div>';
    }

    content += '</div>';

    return content;
}

function plotMousePath(mousePoints) {
    mousePoints.forEach(function (mousePoint) {
        drawLine(mousePoint.x, mousePoint.y)
    });
}

function plotMouseClick(mouseClicks) {
    mouseClicks.forEach(function (mouseClick) {
        drawPoint(mouseClick.up.x, mouseClick.up.y, mouseClick.speed);
    });
}

function populateResult() {

    var result = localStorage.getItem('records');
    var resultData = {};

    if (!result) {
        $("#dataview").html('<div class="alert alert-warning"><strong>No data.</strong> Please start the tracking and comeback to this page.</div>');
        return;
    }

    try {
        resultData = {
            items: JSON.parse(result)
        }

        var mousePoints = resultData.items.mTrack;
        var mouseClicks = resultData.items.cTrack;

        plotMousePath(mousePoints);

        plotMouseClick(mouseClicks);

        $("#dataview").html(parseResultData(resultData));
        $("#rawdata code").html(result);

    } catch (e) {
        return;
    }
}

function populateDeviceInfo() {
    var result = localStorage.getItem('browserData');

    if (!result) {
        $("#browserdataview").html('<div class="alert alert-warning"><strong>No data.</strong> Please start the tracking and comeback to this page.</div>');
        return;
    }

    $("#browserdataview").html(parseBrowserData(result));
    $("#browserrawdata code").html(result);
}

$(document).ready(function () {
    showSize();
    populateResult();
    populateDeviceInfo();
})
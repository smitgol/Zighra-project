var kinetic;

var options = {
    logging: false,
    trackingTimeSensitivity: 10,
    autoTracking: false,
    // autoTrackingInterval: 5000,
    mouseTrackingElement: '#trackarea'
}

$(document).ready(function () {

    kinetic = new ZFS.KineticTracker(options);
    kinetic.init();

    if (typeof options.autoTracking == 'undefined' || options.autoTracking == true) {
        $("#startTracking").hide();
        $("#stopTracking").hide();
        $("#showData").show();

    } else {
        $("#startTracking").show();
        $("#stopTracking").hide();
        $("#showData").hide();
    }

    $("#demoForm").submit(function (e) {
        e.preventDefault();
        $("#successMessage").show();
    })

});

function getResults(x) {
    var output = {};

    if (localStorage.getItem('records')) {
        try {
            output = JSON.parse(localStorage.getItem('records'));
        } catch (e) {
            // Do nothing
        }
    }

    localStorage.setItem('records', JSON.stringify($.extend(output, x)));
    localStorage.setItem('browserData', JSON.stringify(kinetic.getDeviceInfo()));

}

function startTracking() {
    kinetic.trackStart();
    $("#startTracking").hide();
    $("#stopTracking").show();
    $("#trackarea").addClass("tracking");
}

function stopTracking() {

    kinetic.trackStop(function (trackingData) {

        getResults(trackingData);

        $("#stopTracking").hide();
        $("#startTracking").show();
        $("#showData").show();
        $("#trackarea").removeClass("tracking");
        $('.nav-tabs a[href="#data"]').tab('show');
    });

}
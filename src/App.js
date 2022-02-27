import "./App.css";
import { Button, Container, Row, Form } from "react-bootstrap";
import { useState } from "react";
import { Helmet } from "react-helmet";
function App() {
  const [username, setUsername] = useState("");

  const [tracking, setTracking] = useState({
    class: "primary",
    text: "Start Tracking",
  });

  const handleSubmit = (e) => {
    setUsername("");
  };

  const StartTracking = () => {
    setTracking((prevState) => ({
      ...prevState,
      ["class"]: "danger",
      ["text"]: "Stop tracking",
    }));
  };

  const StopTracking = () => {
    console.log(localStorage.getItem("profileCode"));
    if (localStorage.getItem("profileCode")) {
      setTracking((prevState) => ({
        ...prevState,
        ["class"]: "primary",
        ["text"]: "Start tracking",
      }));
    }
  };
  const handleTracking = () => {
    if (tracking["class"] === "primary") {
      StartTracking();
    } else if (tracking["class"] === "danger") {
      StopTracking();
    }
  };
  return (
    <div>
      <Container>
        <Row className="p-5">
          <p className="h1 text-center">Custom Zighra Web SDK</p>
        </Row>
        <div className="border border-secondary mt-4" id="trackarea">
          <Row className="p-4 gap-3">
            <p className="h3 text-center">Login To start Tracking</p>
            <Form
              className="w-25 text-center"
              id="my-form"
              onSubmit={handleSubmit}
            >
              <Form.Group className="my-3" controlId="formBasicEmail">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </Form.Group>
              <Button varient="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Row>
        </div>
        <Row className="justify-content-md-center pt-4" id="track-btn">
          <Button
            variant={tracking["class"]}
            className="text-center w-25"
            onClick={handleTracking}
            id={tracking["class"]}
          >
            {tracking["text"]}
          </Button>
        </Row>
      </Container>
      <Helmet>
        <script>{`
    var options = {
    logging: false,
    trackingTimeSensitivity: 10,
    mouseTrackingElement: "#trackarea",
    debug: true,
    autoTracking: false,
    appKey: "hLxqCOFNH94iDAI",
    appSecret:
      "AgVUZD5DdfDn3ib6kcu+yhllpBE6QD+opU0m6+tuWI8129A2l+iUPxF0NHLKE8u0wQ==",
    trackingInterval: 60,
    sensorPollingFrequency: 10,
    packageId: "/test",
  };
  var KineticTracker = new ZFS.KineticTracker(options);
  KineticTracker.init();
  document.querySelector('#my-form').addEventListener("submit", handlesubmit)
  function handlesubmit (e) {
    e.preventDefault();
    console.log(e)
    var userData = {
      name: e.target[0].value,
      uCode: e.target[0].value,
    };
    KineticTracker.getProfile(userData, function (error, data) {
      if (error) {
        console.log(error);
      } else {
        // Success
        if (data) {
          localStorage.setItem("profileCode", data.data.profileCode);
        }
      }
    });
  }
  var track_btn = document.querySelector('#track-btn')
  track_btn.addEventListener('click', handleTracking)

  function handleTracking() {
    if (track_btn.firstChild.id === "danger") {
      stopTracking()
    }
    else{
      startTracking()
    }
  }

  function startTracking() {
    KineticTracker.trackStart();
  }

  function stopTracking() {
    
    KineticTracker.trackStop(function(trackingData){
      let reqBody = {
        gestureInfo: trackingData, //trackingData from trackStop()
        profileCode: localStorage.getItem("profileCode"), // of the logged in user.
      };
      if (localStorage.getItem("profileCode")) {
        KineticTracker.checkGesture(reqBody, function (error, gestureData) {
          if (error) {
            console.log("Error!");
          } else {
            var score = gestureData.data.score;
            if (score > 80) {
              var reportActionInputData = {
                profileCode: reqBody.profileCode,
                action: "allow",
                refId: gestureData.refId,
                type: gestureData.data.type,
              };
              KineticTracker.reportAction(
                reportActionInputData,
                function (error, outputData) {
                }
              );
              alert("Report submitted with good score")
            } else {
              var reportActionInputData = {
                profileCode: reqBody.profileCode,
                action: "deny",
                refId: gestureData.refId,
                type: gestureData.data.type,
              };
              KineticTracker.reportAction(
                reportActionInputData,
                function (error, outputData) {
                }
              );
              alert("Report submitted with bad score")
            }
          }
        });
      }
      else {
        alert("sign in to start tracking")
      }
  });
  }
  `}</script>
      </Helmet>
    </div>
  );
}

export default App;

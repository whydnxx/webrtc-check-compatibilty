/* global check compatibilty */
let video = true;
let audio = true;
let bandwidth = true;

let iceServers = [
  { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  {
    username:
      "b18e2c7189580662eae445df45649d5a85195b45b5ad674cdd03e144cc5eafb1",
    urls: "turn:global.turn.twilio.com:3478?transport=udp",
    credential: "jnkhHjlELk9C9lbtOnAqON6FUSHze485CyPkpa4WMzo=",
  },
  { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  {
    username:
      "b18e2c7189580662eae445df45649d5a85195b45b5ad674cdd03e144cc5eafb1",
    urls: "turn:global.turn.twilio.com:3478?transport=udp",
    credential: "jnkhHjlELk9C9lbtOnAqON6FUSHze485CyPkpa4WMzo=",
  },
  {
    username:
      "b18e2c7189580662eae445df45649d5a85195b45b5ad674cdd03e144cc5eafb1",
    urls: "turn:global.turn.twilio.com:3478?transport=tcp",
    credential: "jnkhHjlELk9C9lbtOnAqON6FUSHze485CyPkpa4WMzo=",
  },
  {
    username:
      "b18e2c7189580662eae445df45649d5a85195b45b5ad674cdd03e144cc5eafb1",
    urls: "turn:global.turn.twilio.com:443?transport=tcp",
    credential: "jnkhHjlELk9C9lbtOnAqON6FUSHze485CyPkpa4WMzo=",
  },
];

const testSuite = new CheckCompatibilty.TestSuite();

const runButton = document.getElementById("run-button");

const testCompleted = function (test, success, res) {
  const result = `test completed ${test.name} ${
    success ? "success" : "failure"
  } ${res} ${res && res.details ? res.details : "no results"}`;
  console.log(result, res);
  const p = document.createElement("p");
  p.innerText = result;
  document.body.appendChild(p);
};

runButton.onclick = function startTroubleshooter() {
  if (!navigator.mediaDevices) {
    video = false;
    audio = false;
  }

  const iceConfig = {
    iceServers: iceServers,
    iceTransports: "relay",
  };

  const mediaOptions = { audio: true, video: true };

  if (audio) {
    const audioTest = new CheckCompatibilty.AudioTest(mediaOptions);
    audioTest.promise.then(
      testCompleted.bind(null, audioTest, true),
      testCompleted.bind(null, audioTest, false)
    );
    testSuite.addTest(audioTest);
  }

  if (video) {
    const videoTest = new CheckCompatibilty.VideoTest(mediaOptions);
    videoTest.promise.then(
      testCompleted.bind(null, videoTest, true),
      testCompleted.bind(null, videoTest, false)
    );
    testSuite.addTest(videoTest);
  }

  if (bandwidth) {
    const audioBandwidthTest = new CheckCompatibilty.AudioBandwidthTest({
      iceConfig: iceConfig,
      mediaOptions: mediaOptions,
    });
    audioBandwidthTest.promise.then(
      testCompleted.bind(null, audioBandwidthTest, true),
      testCompleted.bind(null, audioBandwidthTest, false)
    );
    testSuite.addTest(audioBandwidthTest);

    const videoBandwidthTest = new CheckCompatibilty.VideoBandwidthTest({
      iceConfig: iceConfig,
      mediaOptions: mediaOptions,
    });
    videoBandwidthTest.promise.then(
      testCompleted.bind(null, videoBandwidthTest, true),
      testCompleted.bind(null, videoBandwidthTest, false)
    );
    testSuite.addTest(videoBandwidthTest);
  }

  if (window.RTCPeerConnection) {
    const connectivityTest = new CheckCompatibilty.ConnectivityTest(iceConfig);
    connectivityTest.promise.then(
      testCompleted.bind(null, connectivityTest, true),
      testCompleted.bind(null, connectivityTest, false)
    );

    const symmetricNatTest = new CheckCompatibilty.SymmetricNatTest(iceConfig);
    symmetricNatTest.promise.then(
      testCompleted.bind(null, symmetricNatTest, true),
      testCompleted.bind(null, symmetricNatTest, false)
    );

    testSuite.addTest(connectivityTest);
    testSuite.addTest(symmetricNatTest);
  }

  const p = document.createElement("p");
  testSuite
    .start()
    .then(
      function (results) {
        const result = "Finished the tests";
        console.log(result, results);
        p.innerText = result;
      },
      function (err) {
        const result = "test failure";
        console.warn(result, err, err.details);
        p.innerText = result;
      }
    )
    .then(function () {
      document.body.appendChild(p);
    });
};

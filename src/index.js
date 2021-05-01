import TestSuite from "./utils/TestSuite";
import AudioTest from "./diagnostics/AudioTest";
import VideoTest from "./diagnostics/VideoTest";
import AudioBandwidthTest from "./diagnostics/AudioBandwidthTest";
import VideoBandwidthTest from "./diagnostics/VideoBandwidthTest";
import ConnectivityTest from "./diagnostics/ConnectivityTest";
import SymmetricNatTest from "./diagnostics/SymmetricNatTest";
import ERROR_CODES from "./utils/testErrorCodes";

module.exports = {
  TestSuite,
  AudioTest,
  VideoTest,
  AudioBandwidthTest,
  VideoBandwidthTest,
  ConnectivityTest,
  SymmetricNatTest,
  ERROR_CODES,
};

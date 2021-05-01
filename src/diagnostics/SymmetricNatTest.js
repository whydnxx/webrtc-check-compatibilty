import Test from "../utils/Test";
import parseCandidate from "../utils/parseCandidate";

class SymmetricNatTest extends Test {
  constructor() {
    super(...arguments);
    this.name = "Symmetric Nat Test";
  }

  logIceServers() {
    if (this.options.iceServers) {
      this.options.iceServers.forEach((iceServer) => {
        this.logger.log(`Using ICE Server: ${iceServer.urls}`);
      });
      if (this.options.iceServers.length === 0) {
        this.logger.error("no ice servers provided");
      }
    } else {
      this.logger.log("Using default ICE Servers");
    }
  }

  start() {
    super.start();
    this.logIceServers();

    const pc = new window.RTCPeerConnection(this.options.iceServers);
    pc.createDataChannel("symmetricNatTest");
    const candidates = {};
    pc.onicecandidate = (e) => {
      if (e.candidate && e.candidate.candidate.indexOf("srflx") !== -1) {
        const candidate = parseCandidate(e.candidate.candidate);
        this.logger.log("SymmetricNatTest Candidate", candidate);
        if (!candidates[candidate.relatedPort]) {
          candidates[candidate.relatedPort] = [];
        }
        candidates[candidate.relatedPort].push(candidate.port);
      } else if (!e.candidate) {
        const relatedPorts = Object.keys(candidates);
        if (relatedPorts.length === 1) {
          const relatedPort = relatedPorts[0];
          const ports = candidates[relatedPort];
          this.resolve(ports.length === 1 ? "nat.asymmetric" : "nat.symmetric");
        } else if (relatedPorts.length === 0) {
          this.resolve("nat.noSrflx");
        } else {
          let hasAsymmetric = false;
          let hasSymmetric = false;
          for (let i = 0; i < relatedPorts.length; i++) {
            const relatedPort = relatedPorts[i];
            const ports = candidates[relatedPort];
            if (ports.length === 1) {
              hasAsymmetric = true;
            } else {
              hasSymmetric = true;
            }
          }
          if (hasSymmetric && !hasAsymmetric) {
            this.resolve("nat.symmetric");
          } else if (!hasSymmetric && hasAsymmetric) {
            this.resolve("nat.asymmetric");
          } else if (hasSymmetric && hasAsymmetric) {
            this.resolve("nat.both");
          } else {
            this.resolve("not.noSrflx");
          }
        }
      }
    };
    pc.onendofcandidates = pc.onicecandidate.bind(pc, {});
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));
    return this.promise;
  }

  destroy() {
    super.destroy();
  }
}

export default SymmetricNatTest;

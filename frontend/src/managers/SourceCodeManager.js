import { C } from "./Core.js";

class SourceCodeManager {
  constructor() {
    this.running = false;
    this.hasSource = false;
    this.source = "";
    this.finished = false;
    this.success = true;
    this.closed = true;
  }

  //Toggle the running state of the source code
  toggleRun() {
    if (!this.hasSource) return;
    if (this.running) return;
    this.running = !this.running;
    if (this.running && this.hasSource) {
      //Run the source code
      const url = "http://localhost:8000/run";
      fetch(url, {
        method: "POST",
        body: this.source,
      })
        .then((response) => response.json())
        .then((data) => {
          C().layerMan.importLayer(data, { name: "Generated Layer" });
          this.running = false;
          this.finished = true;
          this.success = true;
          this.closed = false;
          C().updateBottomBar();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.running = false;
          this.finished = true;
          this.success = false;
          this.closed = false;
          C().updateBottomBar();
        });
    }
    C().updateBottomBar();
  }

  closeAlert() {
    this.closed = true;
    C().updateBottomBar();
  }

  /**
   * Import source code
   * @param {string} source
   */
  importSource(source) {
    this.hasSource = true;
    this.source = source;
    C().updateBottomBar();
  }

  //Remove the source code
  removeSource() {
    this.hasSource = false;
    this.source = "";
    C().updateBottomBar();
  }
}

export default SourceCodeManager;

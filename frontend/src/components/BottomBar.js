import * as React from "react";
import "./BottomBar.css";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { C } from "../managers/Core";

//MUI elements
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import Collapse from "@mui/material/Collapse";

//Icon imports
import TerminalIcon from "@mui/icons-material/TerminalRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import PlayCircleIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircleOutlined";
import FileUploadIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/CloseRounded";

export default class BottomBar extends React.Component {
  constructor() {
    super();
    this.state = {
      top: false,
      left: false,
      bottom: false,
      right: false,
      update: 0,
    };
  }

  // Create a reference to the code element
  codeRef = React.createRef(null);

  // Create a reference to the hidden file input element
  hiddenFileInput = React.createRef(null);

  // to handle the user-selected file
  handleChange = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const fileReader = new FileReader(file);
    fileReader.onloadend = () => {
      C().sourceMan.importSource(fileReader.result);
    };
    fileReader.readAsText(file);
  };

  // reset the file input to allow the same file to be uploaded again
  componentDidMount() {
    if (this.hiddenFileInput.current) {
      this.hiddenFileInput.current.setAttribute("onclick", "this.value=null;");
    }
  }

  // Highlight the code when the component updates
  componentDidUpdate() {
    if (this.codeRef.current === null || !C().sourceMan.hasSource) {
      return;
    }
    this.codeRef.current.removeAttribute("data-highlighted");
    hljs.highlightElement(this.codeRef.current);
    console.log("highlighted");
  }

  // function to update the UI
  updateUI = () => {
    this.setState({ update: this.state.update + 1 });
    //console.log("updateUI()! " + this.state.update);
  };

  toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    this.setState({ ...this.state, [anchor]: open });
  };

  // Toggle the running state of the source code
  toggleRun = () => {
    C().sourceMan.toggleRun();
  };

  // Toggle the file input
  toggleFile = () => {
    if (C().sourceMan.hasSource) {
      C().sourceMan.removeSource();
      return;
    }
    this.hiddenFileInput.current.click();
  };

  // panel that will appear when the bottom bar is clicked
  list = () => (
    <Box
      role="presentation"
      style={{
        backgroundColor: "#0D0F21",
        height: "80%",
        borderRadius: "24px 24px 0px 0px",
        overflowY: "hidden",
        overflowX: "hidden",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="start"
        justifyContent="start"
        m={0}
        sx={{ display: "flex" }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="start"
          m={0}
          sx={{ display: "flex" }}
        >
          <Button
            aria-label="add"
            onClick={this.toggleDrawer("bottom", false)}
            style={{
              color: "#ffffff",
              backgroundColor: "#0D0F21",
              border: "1px solid #7e86bd22",
              width: "100px",
              borderRadius: "24px",
              marginTop: "6px",
            }}
          >
            <ExpandMoreRounded />
          </Button>
        </Grid>

        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="start"
          m={0}
          style={{ marginLeft: "32px" }}
          sx={{ display: "flex" }}
        >
          <Chip
            icon={
              C().sourceMan.hasSource ? (
                <CloseIcon style={{ color: "#ffffff" }} />
              ) : (
                <FileUploadIcon style={{ color: "#ffffff" }} />
              )
            }
            onClick={this.toggleFile}
            label={C().sourceMan.hasSource ? "Remove source" : "Import source"}
            variant="outlined"
            style={{
              color: "#ffffff",
              borderColor: "#7e86bd22",
              minWidth: "150px",
            }}
          />
          <input
            type="file"
            accept=".pl"
            onChange={this.handleChange}
            ref={this.hiddenFileInput}
            style={{ display: "none" }} // Make the file input element invisible
          />

          <Chip
            icon={
              C().sourceMan.running ? (
                <StopCircleIcon style={{ color: "#ffffff" }} />
              ) : (
                <PlayCircleIcon style={{ color: "#ffffff" }} />
              )
            }
            onClick={C().sourceMan.finished && C().sourceMan.success ? undefined: this.toggleRun}
            label={C().sourceMan.running ? "Stop" : "Run"}
            variant="outlined"
            style={{
              color: "#ffffff",
              borderColor: "#7e86bd22",
              minWidth: "80px",
              marginLeft: "8px",
            }}
          />
          <Collapse in={!C().sourceMan.closed}>
            <Alert 
              severity={C().sourceMan.success ? "success" : "error"}
              style={{
                minWidth: "80px",
                marginLeft: "30px",
              }}
              variant='filled'
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => C().sourceMan.closeAlert()}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {C().sourceMan.success ? "Success" : "Error"}
            </Alert>
          </Collapse>
        </Grid>

        <div
          style={{
            marginTop: "12px",
            marginBottom: "0px",
            marginLeft: "0px",
            marginRight: "0px",
            color: "#ffffff",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#33333355",
              width: "800px",
              height: "500px",
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: "8px",
              textAlign: "left",
              overflow: "auto",
            }}
          >
            <pre>
              <code ref={this.codeRef} className={C().sourceMan.hasSource ? "prolog" : ""}>
                {C().sourceMan.hasSource
                  ? C().sourceMan.source
                  : "No source code imported."}
              </code>
            </pre>
          </div>
        </div>
      </Grid>
    </Box>
  );

  render() {
    //Update reference
    C().addRefBottomBar(this.updateUI);

    return (
      <div
        style={{
          position: "absolute",
          bottom: 4,
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Fab
          variant="extended"
          aria-label="add"
          onClick={this.toggleDrawer("bottom", true)}
          style={{
            color: "#ffffff",
            backgroundColor: "#0D0F21",
            width: "100px",
          }}
        >
          <TerminalIcon />
        </Fab>

        <React.Fragment key={"bottom"}>
          <Drawer
            variant="persistent"
            anchor={"bottom"}
            open={this.state["bottom"]}
            onClose={this.toggleDrawer("bottom", false)}
            PaperProps={{
              elevation: 2,
              square: false,
              style: {
                backgroundColor: "transparent",
                width: "60%",
                borderRadius: "24px 24px 0px 0px",
                marginLeft: "auto",
                marginRight: "auto",
              },
            }}
          >
            {this.list("bottom")}
          </Drawer>
        </React.Fragment>
      </div>
    );
  }
}

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid, Button, Typography, Snackbar, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import { Link } from "react-router-dom";
import S3 from "react-s3-uploader";
import { useAuth } from "../components/UserContext";

export default function SubmitSubmission(props) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const classes = useStyles();
  //Snackbar state
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("WARNING");
  const [severity, setSeverity] = useState("error"); //allowed: error, warning, success, info

  const contestId = props.match.params.id;
  const { authTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  const handleSubmit = async () => {
    if (uploadedFiles.length > 0) {
      const submission = {
        contest_id: contestId,
        user_id: user.id,
        user_name: user.name,
        upload_files: uploadedFiles,
      };
      let request = await fetch(`/api/contest/:id/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authTokens.token,
        },
        body: JSON.stringify({
          submission,
        }),
      });
      let requestJson = await request.json();
      console.log(requestJson);
      if (requestJson.error) {
        handleAlert(
          "There was a problem submitting your file, please try again later.",
          "error"
        );
      } else {
        handleAlert("Uploaded Successfully", "success");
        setUploadedFiles([]);
        //Notify Contest Creator of the submission
        let result = await fetch(
          "/api/notifications/contest/submit/" + contestId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": authTokens.token,
            },
          }
        );
        let resultJson = await result.json();
        console.log(resultJson);
      }
    } else {
      handleAlert("Select a file first", "error");
    }
  };

  const handleAlert = (message, severity) => {
    setOpenAlert(true);
    setSeverity(severity);
    setAlertMessage(message);
  };

  const handleRemoval = (index) => {
    console.log("clicked!");
    setUploadedFiles((prev) => {
      let copy = prev.slice();
      copy.splice(index, 1);
      return copy;
    });
  };
  return (
    <div className={classes.container}>
      <Box size='large' className={classes.breadcrumbWrapper}>
        <Link to={`/contest/${contestId}`}>
          <Typography variant='caption' className={classes.breadcrumb}>
            Back to Contest
          </Typography>
        </Link>
      </Box>
      <Grid
        style={{ flex: 1, height: "80%" }}
        container
        spacing={2}
        justify='center'
        align='center'
      >
        <Grid item className={classes.uploadBox}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openAlert}
            autoHideDuration={5000}
            onClose={() => setOpenAlert(false)}
          >
            <Alert severity={severity} onClose={() => setOpenAlert(false)}>
              {alertMessage}
            </Alert>
          </Snackbar>
          <Typography className={classes.title} variant='h4'>
            Submit Your Design
          </Typography>
          <div>
            <S3
              accept='image/*'
              multiple={true}
              signingUrl='/s3/sign'
              signingUrlWithCredentials={true}
              className={classes.uploadButton}
              id='s3'
              scrubFilename={(name) =>
                Date.now() + "-" + name.replace(/[^\w\d_\-.]+/gi, "")
              }
              onFinish={(e) => {
                const url = e["uploadUrl"];
                setUploadedFiles((prev) => [...prev, url]);
              }}
            />
            <label htmlFor='s3'>
              <Button component='span'>
                <CloudUploadOutlinedIcon fontSize='large' />
              </Button>
            </label>
            <div style={{ margin: "2rem" }}>
              <Typography style={{ fontWeight: "bolder" }} variant='body1'>
                {uploadedFiles.length > 0
                  ? "Click to add more files. When you're ready, hit Submit."
                  : "Click to choose a file"}
              </Typography>
              <br />
              <Typography
                display='block'
                className={classes.instructions}
                variant='caption'
              >
                High resolution images
              </Typography>
              <Typography
                display='block'
                className={classes.instructions}
                variant='caption'
              >
                PNG, JPG, GIF
              </Typography>
            </div>
            {uploadedFiles.length > 0 ? (
              <>
                {uploadedFiles.map((file, index) => {
                  return (
                    <div
                      className={classes.previewWrapper}
                      id='remove-upload'
                      key={file}
                    >
                      <button
                        className={classes.removalButton}
                        onClick={() => handleRemoval(index)}
                        style={{
                          position: "absolute",
                          right: 0,
                        }}
                      >
                        x
                      </button>
                      <img
                        alt='preview'
                        className={classes.preview}
                        src={file}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <img style={{ display: "none", height: "75px", width: "75px" }} />
            )}
          </div>

          <Button
            size='large'
            className={classes.submitButton}
            onClick={handleSubmit}
            variant='outlined'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
//theme components styled with useStyles, local components use inline styles
const useStyles = makeStyles((theme) => ({
  breadcrumbWrapper: {
    marginTop: "2rem",
    marginBottom: "2rem",
    position: "absolute",
    left: "2rem",
  },
  breadcrumb: {
    color: "gray",
    textDecoration: "underline",
  },
  container: {
    flexGrow: 1,
    flexDirection: "column",
    height: "100vh",
    display: "flex",
    alignItems: "center",
  },
  uploadBox: {
    display: "flex",
    flex: 1,
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: "bold",
  },
  uploadButton: {
    display: "none",
  },
  previewWrapper: {
    height: "75px",
    width: "75px",
    margin: "5px",
    display: "inline",
    position: "relative",
  },
  preview: {
    height: "75px",
    width: "75px",
  },
  removalButton: {
    position: "absolute",
    right: "0px",
    backgroundColor: "rgba(255,255,255,0.5)",
    border: "none",
    textAlign: "center",
    cursor: "pointer",
  },
  instructions: {
    color: "gray",
    fontWeight: "lighter",
  },
  submitButton: {
    backgroundColor: "#252525",
    color: "white",
    borderRadius: 0,
    padding: theme.spacing(2),
    minWidth: "200px",
  },
}));

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Button,
  Typography,
  Snackbar,
  Box,
  Chip,
  CircularProgress
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import { Link } from "react-router-dom";
import S3 from "react-s3-uploader";
import { useAuth } from "../components/UserContext";

export default function SubmitSubmission(props) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedWithTags, setUploadedWithTags] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ message: "", value: 0 })
  const classes = useStyles();
  //Snackbar state
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("WARNING");
  const [severity, setSeverity] = useState("error"); //allowed: error, warning, success, info

  const contestId = props.match.params.id;
  const { authTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  const handleSubmit = async () => {
    if (uploadedWithTags.length > 0) {
      const submission = {
        contest_id: contestId,
        user_id: user.id,
        user_name: user.name,
        upload_files: uploadedWithTags,
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

      if (requestJson.error) {
        handleAlert(
          "There was a problem submitting your file, please try again later.",
          "error"
        );
      } else {
        handleAlert("Uploaded Successfully", "success");
        setUploadedFiles([]);
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

    setUploadedWithTags((prev) => {
      let copy = prev.slice();
      copy.splice(index, 1);
      return copy;
    });
    setUploadedFiles((prev) => {
      let copy = prev.slice();
      copy.splice(index, 1);
      return copy;
    });
  };

  const getAI = async (img) => {
    setUploadProgress({ message: "Scanning For Copyright", value: 50 }) //objects, explicit content, etc. 

    //   const getImageLabels = await fetch(
    //     `/api/vision/detectLabels?imgURL=${img}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "x-auth-token": authTokens.token,
    //       },
    //     }
    //   );
    //   const labelsJson = await getImageLabels.json();
    //   return labelsJson["labels"];
    // };
    const detectLogos = await fetch(
      `/api/vision/detectLogos?imgURL=${img}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authTokens.token,
        },
      }
    );
    const logosJson = await detectLogos.json();

    if (logosJson.message) {

      setUploadedWithTags((prev) => [
        ...prev,
        { url: img, tags: [""] },
      ]);
      setUploadProgress({ message: "", value: 0 })
    }
    else {
      let logosString = logosJson.join(' , ')
      const warningString = `Warning! We've detected copyrighted or trademarked logos: ${logosString}. Please double check before uploading`
      handleAlert(warningString, "error")
      setUploadedWithTags((prev) => [
        ...prev,
        { url: img, tags: logosJson },
      ]);
      setUploadProgress({ message: "", value: 0 })
    }

  };
  return (
    <div className={classes.container}>
      <Box size="large" className={classes.breadcrumbWrapper}>
        <Link to={`/contest/${contestId}`}>
          <Typography variant="caption" className={classes.breadcrumb}>
            Back to Contest
          </Typography>
        </Link>
      </Box>
      <Grid
        style={{ flex: 1, height: "80%" }}
        container
        spacing={2}
        justify="center"
        align="center"
      >
        <Grid item className={classes.uploadBox}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openAlert}
            autoHideDuration={10000}
            onClose={() => setOpenAlert(false)}
          >
            <Alert severity={severity} onClose={() => setOpenAlert(false)}>
              {alertMessage}
            </Alert>
          </Snackbar>
          <Typography className={classes.title} variant="h4">
            Submit Your Design
          </Typography>
          <div>
            <S3
              accept="image/*"
              multiple={true}
              signingUrl="/s3/sign"
              signingUrlWithCredentials={true}
              className={classes.uploadButton}
              onProgress={value => setUploadProgress({ message: "Uploading File", value })}
              id="s3"
              scrubFilename={(name) =>
                Date.now() + "-" + name.replace(/[^\w\d_\-.]+/gi, "")
              }
              onFinish={(e) => {
                const url = e["uploadUrl"];
                getAI(url)
                setUploadedFiles((prev) => [...prev, url]);
              }}
            />
            <label htmlFor="s3">
              <Button component="span">
                {(uploadProgress.value > 0) ? <div className={classes.progressWrapper}>
                  <Typography variant="body1">{uploadProgress.message}</Typography>
                  <CircularProgress />
                </div> : <CloudUploadOutlinedIcon fontSize="large" />}

              </Button>
            </label>
            <div style={{ margin: "2rem" }}>
              <Typography style={{ fontWeight: "bolder" }} variant="body1">
                {uploadedFiles.length > 0
                  ? "Click to add more files. When you're ready, hit Submit."
                  : "Click to choose a file"}
              </Typography>
              <br />
              <Typography
                display="block"
                className={classes.instructions}
                variant="caption"
              >
                High resolution images
              </Typography>
              <Typography
                display="block"
                className={classes.instructions}
                variant="caption"
              >
                PNG, JPG, GIF
              </Typography>
            </div>
            {uploadedWithTags.length > 0 ? (
              <div>
                {uploadedWithTags.map((file, index) => {
                  return (
                    <div
                      className={classes.previewWrapper}
                      style={{
                        width: "5rem",
                        height: "5rem",
                        margin: "2rem",
                        // position: "relative", //for tags
                        // display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                      }}
                      id="remove-upload"
                      key={file.url}
                    >

                      <img
                        alt="preview"
                        className={classes.preview}
                        src={file.url}
                      />
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

                      {/* {file.tags.length > 0 ? (
                        <>
                          {file.tags.map((tag, index, all) => {
                            let offsetAngle = 360 / all.length;
                            let rotateAngle = offsetAngle * index;
                            return (
                              <Chip
                                variant="outlined"
                                key={index}
                                size="small"
                                color="primary"
                                label={tag}
                                style={{
                                  position: "absolute",
                                  borderRadius: 0,
                                  transform: `rotate(${rotateAngle}deg) translate(0, -5rem) rotate(-${rotateAngle}deg)`,
                                }}
                              />
                            );
                          })}
                        </>
                      ) : null} */}
                    </div>
                  );
                })}
              </div>
            ) : (
                <img style={{ display: "none", height: "75px", width: "75px" }} />
              )}
          </div>

          <Button
            size="large"
            className={classes.submitButton}
            onClick={handleSubmit}
            variant="outlined"
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
  progressWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chip: {
    "$ .MuiChip-root": {},
  },
}));

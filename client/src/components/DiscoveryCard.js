import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { FormatQuoteSharp } from "@material-ui/icons";

export default function DiscoveryCard(props) {
  const {
    deadline_date,
    title,
    description,
    prize_amount,
    name,
    profile_image_url,
    firstImage,
  } = props;
  const [countdown, setCountdown] = useState(0);
  const classes = useStyles();
  useEffect(() => {
    const dateHelper = () => {
      const deadline = Date.parse(deadline_date);
      const now = Date.now();
      const timeLeft = deadline - now;
      let minutesLeft = Math.floor((timeLeft / 60000) % 60);
      let hoursLeft = Math.floor((timeLeft / 3600000) % 24);
      let daysLeft = (timeLeft / 86400000).toFixed(0);
      daysLeft = daysLeft != 1 ? daysLeft + " days " : "1 day ";
      hoursLeft = hoursLeft < 10 ? "0" + hoursLeft : hoursLeft;
      minutesLeft = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;
      setCountdown(
        daysLeft + hoursLeft + " hours " + minutesLeft + " minutes "
      );
    };
    dateHelper();
  }, []);
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar src={profile_image_url}>N</Avatar>}
        disableTypography
        title={<Typography variant="h6">{title}</Typography>}
        subheader={
          <Typography variant="body2">
            By <span style={{ textDecoration: "underline" }}>@{name}</span>
          </Typography>
        }
      />
      <CardMedia style={{ height: "75%" }} src={firstImage} component="img" />
      <CardContent>
        <Typography>
          <FormatQuoteSharp
            style={{
              color: "gray",
              transform: "rotateY(180deg)",
            }}
          />
          {description}
          <FormatQuoteSharp
            style={{
              color: "gray",
              transform: "translate(0, 0.5rem)",
            }}
          />
        </Typography>
      </CardContent>
      <CardContent style={{ textAlign: "right" }}>
        <Typography gutterBottom>
          <span
            style={{
              padding: "0.5rem",
              fontWeight: "bold",
              backgroundColor: "black",
              color: "white",
            }}
          >
            ${prize_amount}
          </span>
        </Typography>
        <Typography style={{ color: "gray" }} variant="caption">
          Ending in {countdown}
        </Typography>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    marginBottom: "1.5rem",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

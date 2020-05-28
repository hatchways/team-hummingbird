import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 200,
    height: 200,
    margin: 30,
    boxShadow: 'rgba(0, 0, 0, 0.8) 5px 5px 55px inset'
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'rgba(0, 0, 0, 0.8) 5px 5px 55px inset'
  },
  contestTitle: {
    fontWeight: 600,
    fontSize: 18,
    marginTop: 40
  },
  contestDescription: {
    color: "#718096",
    fontSize: 14,
  },
  money: {
    backgroundColor: "black",
    color: "white",
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 14,
    textTransform: "none",
    borderRadius: "0",
    marginTop: 20,
    '&:hover': {
      backgroundColor: "black",
    }
  },
  inProgress: {
    backgroundColor: "black",
    color: "white",
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 14,
    textTransform: "none",
    borderRadius: "0",
    marginTop: 20,
    marginLeft: 20,
    padding: '4px 15px',
    '&:hover': {
      backgroundColor: "black",
    }
  },
  completed: {
    backgroundColor: "white",
    color: "black",
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 14,
    textTransform: "none",
    borderRadius: "0",
    border: "1px solid #000000",
    marginTop: 20,
    marginLeft: 20,
    padding: '4px 15px',
    '&:hover': {
      backgroundColor: "white",
    }
  },
}));

function ContestCard(props) {
  const {
    imageUrl,
    title,
    description,
    prizeAmount,
    deadlineDate,
    contest_id
  } = props;
  const date = new Date();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="complex" src={imageUrl} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" className={classes.contestTitle}>
                <Link to={`/contest/${contest_id}`}>
                  {title}
                </Link>
              </Typography>
              <Typography variant="body2" gutterBottom className={classes.contestDescription}>
                {description}
              </Typography>
              <Button
                size="small"
                className={classes.money}
              >
                ${prizeAmount}
              </Button>
              <Button
                size="small"
                className={date > deadlineDate ? classes.completed : classes.inProgress}
              >
                {date > deadlineDate ? 'COMPLETED' : 'IN PROGRESS'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ContestCard;
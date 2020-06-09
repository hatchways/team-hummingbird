import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, Snackbar, TextField } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import { useAuth } from "./UserContext";
import { loadStripe } from "@stripe/stripe-js";
const stripeKey = require("../config/default.json").stripeKey;
const stripe = loadStripe(stripeKey);
function BankForm() {
  //const stripe = useStripe();
  //const elements = useElements();
  const classes = useStyles();

  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success"); //success, error, info
  const [alertMessage, setAlertMessage] = useState("");

  const { authTokens, setAuthTokens } = useAuth();
  const [user, setUser] = useState(authTokens ? authTokens.user : null);
  const [routingNumber, setRoutingNumber] = useState({
    error: null,
    value: "",
  });
  const [accountNumber, setAccountNumber] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!routingNumber.error && accountNumber) {
      //validation of bank info is done server side and returned in error messages,
      //passed to handleAlert
      const addBankInfo = async () => {
        const routing = String(routingNumber.value);
        const saveInfo = await fetch(
          `/api/stripe/saveBankAccount?routing_number=${routing}&account_number=${accountNumber}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": authTokens.token,
            },
          }
        );

        const savedInfoJson = await saveInfo.json();
        if (savedInfoJson.error) {
          handleAlert(savedInfoJson.error, "error");
        } else if (savedInfoJson) {
          console.log(savedInfoJson);
          handleAlert("Your bank account was added successfully", "success");
          const _user = {
            ...user,
            hasPayoutInfoSaved: true,
            payoutInfo: {
              savedInfoJson,
            },
          };
          setAuthTokens({
            ...authTokens,
            user: _user,
          });
        }
      };
      addBankInfo();
    }
  };

  //basic routing number validation
  //Further validation and account number validation
  //done server side
  const handleRoutingNumber = (e) => {
    e.preventDefault();
    let value = e.target.value;
    const nineDigitNumber = new RegExp("^\\d{9}$");
    if (value.match(nineDigitNumber)) setRoutingNumber({ error: null, value });
    else {
      setRoutingNumber({ error: true, value });
    }
  };
  const handleAlert = (message, severity) => {
    setOpenAlert(true);
    setSeverity(severity);
    setAlertMessage(message);
  };
  return (
    <div>
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
      <Typography variant="h3">Payout Info</Typography>

      <Typography className={classes.instructionText} variant="subtitle1">
        If you're a contestant, enter your bank account info to receive payouts:
      </Typography>

      <form onSubmit={handleSubmit}>
        <div style={{ marginLeft: "1rem", paddingTop: "1rem" }}>
          <TextField disabled label="Name" defaultValue={user.name} />
        </div>
        <div className={classes.bankField}>
          <TextField
            required
            id="standard-number"
            label="Routing Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Must be 9 digits."
            value={routingNumber.value}
            error={routingNumber.error}
            onChange={(e) => handleRoutingNumber(e)}
          />
        </div>
        <div className={classes.bankField}>
          <TextField
            required
            id="standard-number"
            label="Account Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <Button
          variant="outlined"
          size="large"
          type="submit"
          className={classes.button}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default function AddBankInfo() {
  return <BankForm />;
}
//Stripe element style settings
const options = {
  style: {
    base: {
      fontSize: "16px",
      color: "#252525",
      "::placeholder": {
        color: "#252525",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const useStyles = makeStyles({
  instructionText: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  field: {
    width: "75px",
  },
  bankField: {
    marginLeft: "1rem",
    paddingTop: "1rem",
  },
  button: {
    marginTop: "2rem",
    height: 50,
    width: "100%",
    borderRadius: 0,
    borderColor: "#252525",
  },
});

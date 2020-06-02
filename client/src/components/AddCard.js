import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "./UserContext";
const stripeKey = require("../config/default.json").stripeKey;

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success"); //success, error, info
  const [alertMessage, setAlertMessage] = useState("");

  const { authTokens, setAuthTokens } = useAuth();
  const [user, setUser] = useState(authTokens ? authTokens.user : null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });
    if (error) {
      handleAlert(error.message, "error");
    }
    if (paymentMethod) {
      const _user = {
        ...user,
        hasPaymentInfoSaved: true,
        paymentInfo: {
          cardType: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
        },
        paymentId: paymentMethod.id,
      };

      setAuthTokens({
        ...authTokens,
        user: _user,
      });

      handleAlert(
        `Your ${paymentMethod?.card?.brand} card ending in ${paymentMethod?.card?.last4} was added successfully`,
        "success"
      );
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
      <Typography variant="h3">Payment Details</Typography>

      <Typography className={classes.instructionText} variant="subtitle1">
        Enter your card details:
      </Typography>

      <form onSubmit={handleSubmit}>
        <div style={{ marginLeft: "1rem", paddingTop: "1rem" }}>
          <Typography className={classes.fieldLabel} variant="caption">
            Card Number
          </Typography>

          <CardNumberElement options={options} />
        </div>
        <div className={classes.inlineFieldContainer}>
          <div className={classes.field}>
            <Typography className={classes.fieldLabel} variant="caption">
              Card Expiry
            </Typography>
            <CardExpiryElement options={options} />
          </div>
          <div className={classes.field}>
            <Typography className={classes.fieldLabel} variant="caption">
              CVC
            </Typography>
            <CardCvcElement options={options} />
          </div>
        </div>

        <Button
          variant="outlined"
          size="large"
          type="submit"
          disabled={!stripe}
          className={classes.button}
        >
          Add Card
        </Button>
      </form>
    </div>
  );
}

const stripePromise = loadStripe(stripeKey);

export default function AddPaymentMethod() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
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
  inlineFieldContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginLeft: "1rem",
    paddingBottom: "1rem",
    paddingTop: "1rem",
  },
  fieldLabel: {
    color: "gray",
  },
  field: {
    width: "75px",
  },
  button: {
    marginTop: "2rem",
    height: 50,
    width: "100%",
    borderRadius: 0,
    borderColor: "#252525",
  },
});

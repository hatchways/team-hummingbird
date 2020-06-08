const express = require("express");
const stripeRouter = express.Router();

const auth = require("../../middleware/auth");
const key = require("../../config/default.json").stripe_secret;
const stripe = require("stripe")(key);

// Route: POST api/stripe/saveCard
// Desc: client secret for saving a card for later
// access:  private

stripeRouter.post("/initialIntent", auth, (req, res) => {
  //create stripe customer
  const createCustomer = async () => {
    const customer = await stripe.customers.create();
    //console.log(customer);
    //use customer id to create a future payment intent
    const customer_id = await customer["id"];
    const intent = await stripe.setupIntents.create({
      customer: customer_id,
    });
    if (intent.error) {
      res.status(200).json({ error });
    }
    //send back customer secret to client
    console.log(intent);
    res
      .status(200)
      .json({ client_secret: intent.client_secret, customer: intent.customer });
  };
  createCustomer();
});

// Route: POST api/stripe/saveCard
// Desc: Charge a saved card
// access:  private

stripeRouter.post("/chargeSavedCard", (req, res) => {
  //payment amount is in cents i.e $10.00 = 1000
  let { customer_id, payment_method, amount } = req.query;
  const charge = async () => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer: customer_id,
        payment_method,
        //capture_method: "manual",
        off_session: true,
        capture_method: "manual",
        confirm: true,
      });

      res.status(200).json(paymentIntent);
    } catch (err) {
      console.log("error code is: ", err.code, err.message);
    }
  };
  charge();
});

// Route: POST api/stripe/saveBankAccount
// Desc: process a payment
// access:  private
stripeRouter.post("/saveBankAccount", auth, (req, res) => {
  const createConnectedAccount = async () => {
    //Stripe Test Bank as default values
    const {
      routing_number = "110000000",
      account_number = "000123456789",
    } = req.query;
    console.log(req.query);
    //create a platform custom account and provide user identification information to stripe
    try {
      const response = await stripe.accounts.create({
        country: "US",
        type: "custom",
        requested_capabilities: ["card_payments", "transfers"],
        business_type: "individual",
        individual: {
          first_name: "first_name",
          last_name: "last_name",
          dob: {
            day: 01,
            month: 01,
            year: 1901,
          },
        },
        business_profile: {
          url: "https://www.hatchwaystattooartist.com",
        },
        external_account: {
          object: "bank_account",
          country: "US",
          currency: "USD",
          routing_number,
          account_number,
        },
        settings: {
          payouts: {
            debit_negative_balances: true,
          },
        },
      });

      if (response.error) {
        res.json({ error: response.error });
      }
      const id = await response["id"];
      //simulate user accepting the terms and conditions of Stripe
      const accept_TOS = await stripe.accounts.update(id, {
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: req.connection.remoteAddress, // Assumes you're not using a proxy
        },
      });
      if (accept_TOS.error) {
        res.json({ error: accept_TOS.error });
      }
      const id_after_TOS = await accept_TOS.id;

      res.status(200).json({ userWithBankId: id_after_TOS });
    } catch (error) {
      res.json({ error: error.code });
    }
  };

  createConnectedAccount();
});

// Route: POST api/stripe/payContestWinner
//desc Pay out to a saved bank account
//access private

stripeRouter.post("/payContestWinner", (req, res) => {
  const { payoutAmount = 100, userWithBankId } = req.query;
  console.log(res.query);
  //Balance needs to come from our platform balance.
  //Currently not possible to test payouts without
  //going through stripe legal registration
  const pay = async () => {
    try {
      const payout = await stripe.payouts.create(
        {
          amount: payoutAmount,
          currency: "usd",
        },
        {
          stripeAccount: userWithBankId,
        }
      );
      if (payout.error) {
        res.status(400).json(payout.error);
      } else if (payout) {
        res.status(200).json(payout);
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  };
  pay();
});

module.exports = stripeRouter;

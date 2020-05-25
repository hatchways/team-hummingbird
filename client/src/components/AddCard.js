import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography, Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { loadStripe } from '@stripe/stripe-js'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'

const stripeKey = require('../config/default.json').stripeKey

function CheckoutForm() {
    const stripe = useStripe()
    const elements = useElements()
    const classes = useStyles()

    const [openAlert, setOpenAlert] = useState(false)
    const [severity, setSeverity] = useState("success") //success, error, info
    const [alertMessage, setAlertMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardNumberElement)
        })
        if (error) {
            handleAlert(error.message, "error")

        }
        if (paymentMethod) {
            handleAlert(`Your ${paymentMethod?.card?.brand} card ending in ${paymentMethod?.card?.last4} was added successfully`, "success")
        }
    }

    const handleAlert = (message, severity) => {
        setOpenAlert(true)
        setSeverity(severity)
        setAlertMessage(message)
    }
    const options = {
        style: {
            base: {
                fontSize: '16px',
                color: '#252525',
                '::placeholder': {
                    color: '#252525',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    }
    return (<div>
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openAlert}
            autoHideDuration={5000}
            onClose={() => setOpenAlert(false)}
        >
            <Alert
                severity={severity}
                onClose={() => setOpenAlert(false)}
            >
                {alertMessage}
            </Alert>
        </Snackbar>
        <Typography variant="h3">Payment Details</Typography>
        <br />
        <Typography
            variant="subtitle1"
        >Enter your card details</Typography>
        <br />
        <form
            style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}
            onSubmit={handleSubmit}>


            <Typography
                className={classes.fieldLabel}
                variant="caption">Card Number</Typography>
            <CardNumberElement
                options={options} />
            <div style={{ display: 'flex', width: '100%', paddingBottom: 25, paddingTop: 25, }}>
                <div className={classes.field}>
                    <Typography
                        className={classes.fieldLabel}
                        variant="caption">Card Expiry</Typography>
                    <CardExpiryElement
                        options={options}
                    />
                </div>
                <div className={classes.field}>
                    <Typography
                        className={classes.fieldLabel}
                        variant="caption">CVC</Typography>
                    <CardCvcElement
                        options={options}
                    />
                </div>
            </div>

            <Button
                variant="outlined"
                size="large"
                type="submit"
                disabled={!stripe}
                style={{ margin: 'auto', height: 50, width: 150, borderRadius: 0, borderColor: '#252525' }}>
                Add Card
            </Button>
        </form>
    </div>)
}

const stripePromise = loadStripe(stripeKey)

export default function AddPaymentMethod() {
    return (<Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>)
}

const useStyles = makeStyles({
    fieldLabel: {
        color: 'gray'
    },
    field: {
        width: '75px'
    }
})
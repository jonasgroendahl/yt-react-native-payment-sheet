import express from 'express';
import Stripe from 'stripe';
import {keys} from '../keys';

const stripe = new Stripe(keys.secret, {
  apiVersion: '2020-08-27',
  typescript: true,
});
const app = express();
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 3000,
    currency: 'usd',
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(3000, () => console.log('Server up'));

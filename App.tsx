/* eslint-disable react-native/no-inline-styles */
import {
  CardField,
  StripeProvider,
  useStripe,
} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Button, SafeAreaView, View} from 'react-native';
import {keys} from './keys';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <StripeProvider
      publishableKey={keys.public}
      merchantIdentifier="merchant.identifier">
      <SafeAreaView>
        <StripeTest />
      </SafeAreaView>
    </StripeProvider>
  );
};

const StripeTest: React.FC = () => {
  const {confirmPayment, initPaymentSheet, presentPaymentSheet} = useStripe();

  const [key, setKey] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        console.log('intent', res);
        setKey((res as {clientSecret: string}).clientSecret);
        initPaymentSheet({paymentIntentClientSecret: key});
      })
      .catch(e => Alert.alert(e.message));
  }, []);

  const handleConfirmation = async () => {
    if (key) {
      const {paymentIntent, error} = await confirmPayment(key, {
        type: 'Card',
        billingDetails: {
          email: 'John@email.com',
        },
      });

      if (!error) {
        Alert.alert('Received payment', `Billed for ${paymentIntent?.amount}`);
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleSheet = () => {
    presentPaymentSheet({
      clientSecret: key,
    });
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />
      <Button title="Confirm payment" onPress={handleConfirmation} />
      <Button title="Present sheet" onPress={handleSheet} />
    </View>
  );
};

export default App;

# authy-client
A complete Authy client with support for TOTP, OneTouch, Phone Verification and Phone Intelligence APIs.

## Status
[![npm version][npm-image]][npm-url] [![build status][travis-image]][travis-url]

## Installation
Install the package via `npm`:

```sh
npm install authy-client --save
```

## Usage
### Examples
#### Registering a user and requesting an SMS
**Using await/async (requires `babel`)**:

```js
import { Client } from 'authy-client';

const client = new Client({ key: 'foo' });

(async function() {
  const { user: { id: authyId } } = await client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' });
  const { cellphone } = await client.requestSms({ authyId });

  console.log(`SMS requested to ${cellphone}`)
}());
```

**Using promises**:

```js
const Client = require('authy-client').Client;
const client = new Client({ key: 'foo' });

client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' })
  .then(function(response) {
    return response.user.id;
  })
  .then(function(authyId) {
    return client.requestSms({ authyId: authyId });
  })
  .then(function(response) {
    console.log(`SMS requested to ${response.cellphone}`);
  });
```

**Using callbacks**:

```js
const Client = require('authy-client').Client;
const client = new Client({ key: 'foo' });

client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' }, function(err, res) {
  if (err) throw err;

  client.requestSms({ authyId: res.user.id }, function(err, res) {
    if (err) throw err;

    console.log(`SMS requested to ${res.cellphone}`)
  });
});
```

If you want to run this example without first transpiling it, you can install the `babel-cli` package and run `node_modules/.bin/babel-node example.js`.

### Client({ key }, [options])
#### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.key` _(string)_: The private API key obtained from the [Authy Dashboard](https://dashboard.authy.com/).
3. `[options]` _(Object)_: The options object.
4. `[options.host=https://api.authy.com]` _(string)_: The target endpoint (`https://api.authy.com` or `https://sandbox-api.authy.com`).
5. `[options.timeout=5000]` _(number)_: The maximum request time, in milliseconds.

##### Example

```js
new Client({ key: 'foo' }, { timeout: 10000 });
```

### TOTP API
Authy TOTP (Time-based One-time Password) is an API that allows application developers to enable two-factor authentication (2FA) for a user. 2FA, as the name suggests, is an additional step to secure an user's account or action by comparing a code generated or sent to the user's mobile phone against a shared secret.

#### Methods
##### registerUser({ countryCode, email, phone }, [callback])
Create an Authy user based on the users mobile phone number and email. The returned Authy Id should be stored on your database for subsequent calls.

The library automatically converts conforming country codes (e.g. `US`) to the corresponding country calling code (e.g. `1`) and validates the resulting phone number thoroughly before submitting it to Authy.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.countryCode` _(string)_: the user's phone country code in ISO 3166 alpha 2 format (**recommended** format, e.g. `US`) or a numeric country calling code (use at your own risk).
3. `args.email` _(string)_: the user's email address.
4. `args.phone` _(string)_: the user's phone number.
5. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const { user: { id: authyId } } = await client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' });

console.log('Authy Id', authyId);
```

**Using promises**:

```js
client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' })
  .then(function(response) {
    console.log('Authy Id', response.user.id);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.registerUser({ countryCode: 'PT', email: 'foo@bar.com', phone: '911234567' }, function(err, res) {
  if (err) throw err;

  console.log('Authy Id', res.user.id);
});
```

##### requestSms({ authyId }, [options, callback])
Request an SMS with a token for users that don't own a smartphone. If the Authy app is in use by the user, this request is ignored and a push notification is sent instead.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `[options]` _(Object)_: the options object.
4. `[options.action]` _(string)_: the action or context that is being validated.
5. `[options.force]` _(boolean)_: whether to send an SMS even if the user is using the mobile application.
6. `[options.message]` _(string)_: a message for the specific action, if one is set.
7. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.requestSms({ authyId: 1635 });

console.log('Message sent successfully to', response.cellphone);
```

**Using promises**:

```js
client.requestSms({ authyId: 1635 })
  .then(function(response) {
    console.log('Message sent successfully to', response.cellphone);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.requestSms({ authyId: 1635 }, function(err, res) {
  if (err) throw err;

  console.log('Message sent successfully to', res.cellphone);
});
```

##### requestCall({ authyId }, [options, callback])
Request a call with a token for users that don't own a smartphone. If the Authy app is in use by the user, this request is ignored and a push notification is sent instead.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `[options]` _(Object)_: the options object.
4. `[options.action]` _(string)_: the action or context that is being validated.
5. `[options.force]` _(boolean)_: whether to call the user even if the mobile application is in use.
6. `[options.message]` _(string)_: a message for the specific action, if one is set.
7. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.requestCall({ authyId: 1635 });

console.log('Call requested successfully to', response.cellphone);
```

**Using promises**:

```js
client.requestCall({ authyId: 1635 })
  .then(function(response) {
    console.log('Call requested successfully to', response.cellphone);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.requestCall({ authyId: 1635 }, function(err, res) {
  if (err) throw err;

  console.log('Call requested successfully to', res.cellphone);
});
```

##### verifyToken({ authyId, token }, [options, callback])
Verify if a token submitted by the user is valid or not.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `args.token` _(string)_: the token to verify.
4. `[options]` _(Object)_: the options object.
5. `[options.force]` _(boolean)_: whether to verify the token regardless of the user's login status.
6. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.verifyToken({ authyId: 1635, token: '1234567' });

console.log('Token is valid');
```

**Using promises**:

```js
client.verifyToken({ authyId: 1635, token: '1234567' })
  .then(function(response) {
    console.log('Token is valid');
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.verifyToken({ authyId: 1635, token: '1234567' }, function(err, res) {
  if (err) throw err;

  console.log('Token is valid');
});
```

##### deleteUser({ authyId }, [options, callback])
Delete a user from the application.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `[options]` _(Object)_: the options object.
4. `[options.ip]` _(string)_: the IP requesting to delete the user.
5. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.deleteUser({ authyId: 1635 });

console.log('User has been scheduled for deletion');
```

**Using promises**:

```js
client.deleteUser({ authyId: 1635 })
  .then(function(response) {
    console.log('User has been scheduled for deletion');
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.deleteUser({ authyId: 1635 }, function(err, res) {
  if (err) throw err;

  console.log('User has been scheduled for deletion');
});
```

##### registerActivity({ authyId, data, type }, [options, callback])
Register a user activity.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `args.type` _(string)_: the activity type (one of `password_reset`, `banned`, `unbanned` or `cookie_login`).
4. `[data]` _(Object)_: a data object associated with the activity.
5. `[options]` _(Object)_: the options object.
6. `[options.ip]` _(string)_: the IP of the user registering the activity.
7. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '127.0.0.1' });

console.log('Activity registered');
```

**Using promises**:

```js
client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '127.0.0.1' })
  .then(function(response) {
    console.log('Activity registered');
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.registerActivity({ authyId: 1635, data: { reason: 'foo' }, type: 'banned' }, { ip: '127.0.0.1' }, function(err, res) {
  if (err) throw err;

  console.log('Activity registered');
});
```

##### getUserStatus({ authyId }, [options, callback])
Retrieve the user status, such as the registered country code, phone number, devices and confirmation status.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `[options]` _(Object)_: the options object.
4. `[options.ip]` _(string)_: the IP of the user requesting to see the user details.
5. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.getUserStatus({ authyId: 1635 });

console.log('User status', response.status);
```

**Using promises**:

```js
client.getUserStatus({ authyId: 1635 })
  .then(function(response) {
    console.log('User status', response.status);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.getUserStatus({ authyId: 1635 }, function(err, res) {
  if (err) throw err;

  console.log('User status', response.status);
});
```

##### getApplicationDetails([options, callback])
Retrieve application details such as its name or current billing plan.

###### Arguments
1. `[options]` _(Object)_: the options object.
2. `[options.ip]` _(string)_: the IP of the user requesting to see the application details.
3. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.getApplicationDetails();

console.log('Application details', response.app);
```

**Using promises**:

```js
client.getApplicationDetails()
  .then(function(response) {
    console.log('Application details', response.app);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.getApplicationDetails(function(err, res) {
  if (err) throw err;

  console.log('Application details', response.app);
});
```

##### getApplicationStatistics([options, callback])
Retrieve application statistics by month and current quotas.

###### Arguments
1. `[options]` _(Object)_: the options object.
2. `[options.ip]` _(string)_: the IP of the user requesting to see the application statistics.
3. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.getApplicationStatistics();

console.log('Application statistics', response);
```

**Using promises**:

```js
client.getApplicationStatistics()
  .then(function(response) {
    console.log('Application statistics', response);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.getApplicationStatistics(function(err, res) {
  if (err) throw err;

  console.log('Application statistics', response);
});
```

### Phone Verification API
The Phone Verification API allows for a simple phone verification for situations where the complexity of the TOTP API is not required. First, a code is sent to the user's phone number and then that code is submitted back by the user. Authy verifies that the code matches the one issued for it.

#### Methods
##### startPhoneVerification({ countryCode, phone, via }, [options, callback])
Verify a phone number by sending it a verification code by SMS or call. Custom messages for the SMS are currently not working so support has not been added.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.countryCode` _(string)_: the user's phone country code in ISO 3166 alpha 2 format (**recommended** format, e.g. `US`) or a numeric country calling code (use at your own risk).
3. `args.phone` _(string)_: the user's phone number to verify.
4. `args.via` _(string)_: the mechanism used to send the verification code (`sms` or `call`).
5. `[options]` _(Object)_: the options object.
6. `[options.locale]` _(string)_: the locale of the message received by the user. If none is given, Authy will attempt to auto-detect it based on the country code passed, otherwise English will be used.
7. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
import { enums } from 'authy-client';

const response = await client.startPhoneVerification({ countryCode: 'US', locale: 'en', phone: '7754615609', via: enums.verificationVia.SMS });

console.log('Phone information', response);
```

**Using promises**:

```js
const enums = require('authy-client').enums;

client.startPhoneVerification({ countryCode: 'US', locale: 'en', phone: '7754615609', via: enums.verificationVia.SMS })
  .then(function(response) {
    console.log('Phone information', response);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
const enums = require('authy-client').enums;

client.startPhoneVerification({ countryCode: 'US', locale: 'en', phone: '7754615609', via: enums.verificationVia.SMS }, function(err, res) {
  if (err) throw err;

  console.log('Phone information', response);
});
```

##### verifyPhone({ countryCode, phone, token }, [callback])
Verify a phone number through a verification code.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.countryCode` _(string)_: the user's phone country code in ISO 3166 alpha 2 format (**recommended** format, e.g. `US`) or a numeric country calling code (use at your own risk).
3. `args.phone` _(string)_: the user's phone number to verify.
4. `args.token` _(string)_: the token submitted by the user to verify the phone.
5. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' });

console.log('Verification code is correct');
```

**Using promises**:

```js
client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' })
  .then(function(response) {
    console.log('Verification code is correct');
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.verifyPhone({ countryCode: 'US', phone: '7754615609', token: '1234' }, function(err, res) {
  if (err) throw err;

  console.log('Verification code is correct');
});
```

### Phone Intelligence API
The Phone Intelligence API allows an application developer to retrieve information about a specific number such as its type (VoIP, landline or mobile) and carrier.

#### Methods
##### getPhoneInformation({ countryCode, phone }, [options, callback])
Verify a phone number by sending it a verification code by SMS or call. Custom messages for the SMS are currently not working so support has not been added.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.countryCode` _(string)_: the phone's country code in ISO 3166 alpha 2 format (**recommended** format, e.g. `US`) or a numeric country calling code (use at your own risk).
3. `args.phone` _(string)_: the phone's number to retrieve information about.
4. `[options]` _(Object)_: the options object.
5. `[options.ip]` _(string)_: the IP of the user requesting to retrieve information about the phone.
6. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' });

console.log('Phone information', response);
```

**Using promises**:

```js
client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' })
  .then(function(response) {
    console.log('Phone information', response);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.getPhoneInformation({ countryCode: 'US', phone: '7754615609' }, function(err, res) {
  if (err) throw err;

  console.log('Phone information', response);
});
```

### OneTouch API
Authy OneTouch is an API that allows application developers to create simple _approval requests_ so that users can frictionless _approve_ or _deny_ such request. It can be used for a variety of purposes, such as authentication (e.g. login approval) or validation (e.g. financial transaction approval).

When the user takes actions, Authy sends a GET or POST callback to a URL defined on the application dashboard. The request, which can optionally be cryptographically verified, allows for immediate reaction. An alternate polling method can also be used.

#### Methods
##### createApprovalRequest({ authyId, details, logos, message }, [options, callback])
Create an approval request for the given Authy Id and send it to the user as a push notification.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.authyId` _(string)_: the user's Authy Id.
3. `args.message` _(string)_: the message shown to the user upon receiving the approval request.
4. `[details]` _(Object)_: the details object.
5. `[details.hidden]` _(Object)_: a dictionary of hidden details associated with the approval request.
6. `[details.visible]` _(Object)_: a dictionary of visible details associated with the approval request.
7. `[logos]` _(array)_: the custom logos collection.
8. `[logos.<n>]` _(Object)_: a custom logo object.
9. `[logos.<n>.res]` _(string)_: the target resolution of the custom logo (one of `default`, `low`, `med` or `high`).
10. `[logos.<n>.url]` _(string)_: the url of the custom logo image.
11. `[options]` _(Object)_: the options object.
12. `[options.ttl]` _(integer)_: the number of seconds that the approval request will be available for being responded. If set to `0`, the approval request won't expire.
13. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.createApprovalRequest({
  authyId: 1635,
  details: {
    hidden: {
      ip_address: '10.10.3.203'
    },
    visible: {
      'Account Number': '981266321',
      location: 'California, USA',
      username: 'Bill Smith'
    }
  },
  logos: [{
    res: 'default',
    url: 'https://example.com/logos/default.png'
  }, {
    res: 'low',
    url: 'https://example.com/logos/low.png'
  }],
  message: 'Login requested for a CapTrade Bank account.',
}, {
  ttl: 120
});

console.log('Approval request UUID', response.approval_request.uuid);
```

**Using promises**:

```js
client.createApprovalRequest({
  authyId: 1635,
  details: {
    hidden: {
      ip_address: '10.10.3.203'
    },
    visible: {
      'Account Number': '981266321',
      location: 'California, USA',
      username: 'Bill Smith'
    }
  },
  logos: [{
    res: 'default',
    url: 'https://example.com/logos/default.png'
  }, {
    res: 'low',
    url: 'https://example.com/logos/low.png'
  }],
  message: 'Login requested for a CapTrade Bank account.',
}, {
  ttl: 120
}).then(function(response) {
  console.log('Approval request UUID', response.approval_request.uuid);
}).catch(function(error) {
  throw error;
});
```

**Using callbacks**:

```js
client.createApprovalRequest({
  authyId: 1635,
  details: {
    hidden: {
      ip_address: '10.10.3.203'
    },
    visible: {
      'Account Number': '981266321',
      location: 'California, USA',
      username: 'Bill Smith'
    }
  },
  logos: [{
    res: 'default',
    url: 'https://example.com/logos/default.png'
  }, {
    res: 'low',
    url: 'https://example.com/logos/low.png'
  }],
  message: 'Login requested for a CapTrade Bank account.',
}, {
  ttl: 120
}, function(err, res) {
  if (err) throw err;

  console.log('Approval request UUID', response.approval_request.uuid);
});
```

##### getApprovalRequest({ id }, [callback])
Get information about an approval request.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.id` _(string)_: the id of the approval request.
3. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
const response = await client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' });

console.log('Approval request', response.approval_request);
```

**Using promises**:

```js
client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' })
  .then(function(response) {
    console.log('Approval request', response.approval_request);
  })
  .catch(function(error) {
    throw error;
  });
```

**Using callbacks**:

```js
client.getApprovalRequest({ id: '550e8400-e29b-41d4-a716-446655440000' }, function(err, res) {
  if (err) throw err;

  console.log('Approval request', response.approval_request);
});
```

##### verifyCallback({ body, headers, method, protocol, url }, [callback])
Authy callbacks contain a header (`X-Authy-Signature`) with an HTTP HMAC signature of the request. This signature can be used to verify the authenticity of the request.

Currently, GET requests cannot be validated, as only POST requests contain such signature.

If you have configured your Authy application to receive callbacks for OneTouch approval requests, you should verify their authenticity.

###### Arguments
1. `args` _(Object)_: the required arguments object.
2. `args.body` _(Object)_: the parsed body of the request.
3. `args.headers` _(Object)_: the headers of the request.
4. `args.method` _(string)_: the method of the request (`GET` or `POST`).
5. `args.protocol` _(string)_: the protocol of the request (`http` or `https`).
6. `args.url` _(string)_: the url of the request (e.g. `/callback/onetouch`).
7. `[callback]` _(Function)_: a callback, otherwise a Promise is returned.

###### Example
**Using await/async (requires `babel`)**:

```js
await client.verifyCallback({
  body: {
    approval_request: {
      expiration_timestamp: 1455911778,
      logos: null,
      transaction: {
        created_at_time: 1455825378,
        customer_uuid: '2ccf0040-ed25-0132-5987-0e67b818e6fb',
        details: {},
        device_details: null,
        device_geolocation: null,
        device_signing_time: 0,
        encrypted: false,
        flagged: false,
        hidden_details: {},
        message: '.',
        reason: null,
        requester_details: null,
        status: 'approved',
        uuid: '996201c0-b7a7-0133-7c06-0e67b818e6fb'
      }
    },
    authy_id: 1234567,
    callback_action: 'approval_request_status',
    device_uuid: '4d89c320-a9bb-0133-7c02-0e67b818e6fb',
    signature: 'BObhJgZwgU7O9r4Uo9VT6j6shAOe7y/IRGpW/N0Uq34/XHZU9E+aHOI5rcQzW1ZgNCECzVrqrsnjhYEK4Zq1naKWu0YNkuvILmMz8IxJEQH+c+6x186fjIjxvP4nu4p/pfUDomo/za24s1XOjtNlVsrDTDXClHUh5MjFQbyBjhFd8gOtmGVatN7K2Lx71I8YR2JDLbRX4DlJEMu++PLBn1nqQH9tbNYzX5jjX87CXPBtDfRwfWSs/imnfZ9zkDq4ZKuBcuwzQNsxKlby6782X0o78rYhCHrcDnHgRtyMGvX9ovK3XTt6M7p6i9SKaRgBWIOFVPygxv15iJesqt9cng==',
    status: 'approved',
    uuid: '996221c0-b7a7-0133-7c06-0e67b818e6fb'
  },
  headers: {
    host: 'foo.bar',
    'x-authy-signature': 'hqB6las54sMBA83GKs0U1QQi9ocJ2tH20SXHZNzfqqQ=',
    'x-authy-signature-nonce': 1455825429
  },
  method: 'POST',
  protocol: 'https',
  url: '/'
});

console.log('Approval request callback is valid');
```

**Using promises**:

```js
client.verifyCallback({
  body: {
    approval_request: {
      expiration_timestamp: 1455911778,
      logos: null,
      transaction: {
        created_at_time: 1455825378,
        customer_uuid: '2ccf0040-ed25-0132-5987-0e67b818e6fb',
        details: {},
        device_details: null,
        device_geolocation: null,
        device_signing_time: 0,
        encrypted: false,
        flagged: false,
        hidden_details: {},
        message: '.',
        reason: null,
        requester_details: null,
        status: 'approved',
        uuid: '996201c0-b7a7-0133-7c06-0e67b818e6fb'
      }
    },
    authy_id: 1234567,
    callback_action: 'approval_request_status',
    device_uuid: '4d89c320-a9bb-0133-7c02-0e67b818e6fb',
    signature: 'BObhJgZwgU7O9r4Uo9VT6j6shAOe7y/IRGpW/N0Uq34/XHZU9E+aHOI5rcQzW1ZgNCECzVrqrsnjhYEK4Zq1naKWu0YNkuvILmMz8IxJEQH+c+6x186fjIjxvP4nu4p/pfUDomo/za24s1XOjtNlVsrDTDXClHUh5MjFQbyBjhFd8gOtmGVatN7K2Lx71I8YR2JDLbRX4DlJEMu++PLBn1nqQH9tbNYzX5jjX87CXPBtDfRwfWSs/imnfZ9zkDq4ZKuBcuwzQNsxKlby6782X0o78rYhCHrcDnHgRtyMGvX9ovK3XTt6M7p6i9SKaRgBWIOFVPygxv15iJesqt9cng==',
    status: 'approved',
    uuid: '996221c0-b7a7-0133-7c06-0e67b818e6fb'
  },
  headers: {
    host: 'foo.bar',
    'x-authy-signature': 'hqB6las54sMBA83GKs0U1QQi9ocJ2tH20SXHZNzfqqQ=',
    'x-authy-signature-nonce': 1455825429
  },
  method: 'POST',
  protocol: 'https',
  url: '/'
}).then(function(response) {
  console.log('Approval request callback is valid');
})
.catch(function(error) {
  throw error;
});
```

**Using callbacks**:

```js
client.verifyCallback({
  body: {
    approval_request: {
      expiration_timestamp: 1455911778,
      logos: null,
      transaction: {
        created_at_time: 1455825378,
        customer_uuid: '2ccf0040-ed25-0132-5987-0e67b818e6fb',
        details: {},
        device_details: null,
        device_geolocation: null,
        device_signing_time: 0,
        encrypted: false,
        flagged: false,
        hidden_details: {},
        message: '.',
        reason: null,
        requester_details: null,
        status: 'approved',
        uuid: '996201c0-b7a7-0133-7c06-0e67b818e6fb'
      }
    },
    authy_id: 1234567,
    callback_action: 'approval_request_status',
    device_uuid: '4d89c320-a9bb-0133-7c02-0e67b818e6fb',
    signature: 'BObhJgZwgU7O9r4Uo9VT6j6shAOe7y/IRGpW/N0Uq34/XHZU9E+aHOI5rcQzW1ZgNCECzVrqrsnjhYEK4Zq1naKWu0YNkuvILmMz8IxJEQH+c+6x186fjIjxvP4nu4p/pfUDomo/za24s1XOjtNlVsrDTDXClHUh5MjFQbyBjhFd8gOtmGVatN7K2Lx71I8YR2JDLbRX4DlJEMu++PLBn1nqQH9tbNYzX5jjX87CXPBtDfRwfWSs/imnfZ9zkDq4ZKuBcuwzQNsxKlby6782X0o78rYhCHrcDnHgRtyMGvX9ovK3XTt6M7p6i9SKaRgBWIOFVPygxv15iJesqt9cng==',
    status: 'approved',
    uuid: '996221c0-b7a7-0133-7c06-0e67b818e6fb'
  },
  headers: {
    host: 'foo.bar',
    'x-authy-signature': 'hqB6las54sMBA83GKs0U1QQi9ocJ2tH20SXHZNzfqqQ=',
    'x-authy-signature-nonce': 1455825429
  },
  method: 'POST',
  protocol: 'https',
  url: '/'
}, function(err, res) {
  if (err) throw err;

  console.log('Approval request callback is valid');
});
```

## Tests
To test using a local installation of `node.js`:

```sh
npm test
```

To test using Docker exclusively:

```sh
docker-compose run --rm sut
```

## Release

```sh
npm version [<newversion> | major | minor | patch] -m "Release %s"
```

## License
MIT

[npm-image]: https://img.shields.io/npm/v/authy-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/authy-client
[travis-image]: https://img.shields.io/travis/seegno/authy-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/seegno/authy-client

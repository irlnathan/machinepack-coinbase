module.exports = {


  friendlyName: 'Get buy price',


  description: 'Total price to buy some amount of bitcoin.',


  extendedDescription: 'The price is broken down as follows:\n\n>btc - this is the total amount of bitcoin you would receive\n\n>subtotal - this is the current market price to buy this quantity of bitcoin, we integrate with a number of exchanges on the backend to calculate this price\n\n>fees - an array of fees you will pay if you wish to purchase at this price through Coinbase\n\n>total - the sum of the subtotal and fees, this is the total price you will pay if you wish to buy this quantity on Coinbase.',


  inputs: {
    quantity: {
      example: '10',
      description: 'The quantity of bitcoin you would like to buy (default is 1).'
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Returns the current the price to buy a bitcoin.',
      example: {
        "btc": {
          "amount": "1.00000000",
          "currency": "BTC"
        },
        "subtotal": {
          "amount": "10.10",
          "currency": "USD"
        },
        "fees": [{
          "coinbase": {
            "amount": "0.10",
            "currency": "USD"
          }
        }, {
          "bank": {
            "amount": "0.15",
            "currency": "USD"
          }
        }],
        "total": {
          "amount": "10.35",
          "currency": "USD"
        }
      },
    },

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: 'https://coinbase.com',
      url: '/api/v1/prices/buy',
      method: 'get',
      params: {
        qty: inputs.quantity || '1'
      }
    }).exec({
      success: function(httpResponse) {
        // Parse response body and build up result.
        var responseBody;
        try {
          responseBody = JSON.parse(httpResponse.body);

          return exits.success(responseBody);
        } catch (e) {
          return exits.error('Unexpected response from the Coinbase API:\n' + util.inspect(responseBody, false, null) + '\nParse error:\n' + util.inspect(e));
        }
      },
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      }
    });

  },



};

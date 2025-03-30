App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (window.ethereum) {
      // Modern dapp browsers
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error("User denied account access");
      }
      web3 = new Web3(window.ethereum);
    }
    else if (typeof web3 !== 'undefined') {
      // Legacy dapp browsers
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else {
      // Specify default if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("BottleCoin.json", function(bottlecoin) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.BottleCoin = TruffleContract(bottlecoin);
      // Connect provider to interact with contract
      App.contracts.BottleCoin.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var bottleCoinInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    
    console.log("Attempting to get deployed contract...");
    
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    
    // Load contract data
    App.contracts.BottleCoin.deployed().then(function(instance) {
      bottleCoinInstance = instance;
      App.instance = instance; // Store instance for later use
      console.log("Contract instance obtained:", instance);
      console.log("Attempting to call contract functions...");
      
      // Listen for transfer events
      bottleCoinInstance.Transfer({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          console.log("Transfer event:", event);
          try {
            // Try to extract parameters regardless of how they're structured
            let from = event.args[0] || event.args.from || event.args.owner;
            let to = event.args[1] || event.args.to || event.args.spender;
            let value = (event.args[2] || event.args.value || 0).toString();
            
            App.addTransactionToHistory(
              event.transactionHash,
              from,
              to,
              value
            );

            // Refresh balance if current account was involved in the transfer
            if (from === App.account || to === App.account) {
              App.refreshBalance();
            }
          } catch (err) {
            console.warn("Could not process transfer event:", err, event);
          }
        } else {
          console.error("Error watching events:", error);
        }
      });
      
      return Promise.all([
        bottleCoinInstance.name(),
        bottleCoinInstance.symbol(),
        bottleCoinInstance.totalSupply(),
        bottleCoinInstance.weiPerToken()
      ]);
    }).then(function(results) {
      var name = results[0];
      var symbol = results[1];
      var totalSupply = results[2];
      var weiPerToken = results[3];
      
      console.log("Contract data retrieved:", { name, symbol, totalSupply: totalSupply.toString(), weiPerToken: weiPerToken.toString() });
      
      $("#contractName").text(name);
      $("#tokenSymbol").text(symbol);
      $("#totalSupply").text(totalSupply.toString());
      $("#exchangeRate").text(web3.fromWei(weiPerToken.toString(), 'ether') + " ETH");
      
      // Get user balance if account is available
      if (App.account) {
        App.refreshBalance();
        
        // Set up a periodic balance refresh
        App.balanceRefreshInterval = setInterval(App.refreshBalance, 5000);
      }
      
      loader.hide();
      content.show();
    }).catch(function(err) {
      console.error("Error in render function:", err);
      loader.hide();
      content.show();
    });
  },
  
  // Function to refresh the current user's balance
  refreshBalance: function() {
    if (App.instance && App.account) {
      App.instance.balanceOf(App.account)
        .then(function(balance) {
          console.log("Refreshed balance:", balance.toString());
          $("#tokenBalance").text(balance.toString());
        })
        .catch(function(err) {
          console.error("Error refreshing balance:", err);
        });
    }
  },
  
  // Function to transfer tokens
  transferTokens: function() {
    var recipient = $("#recipientAddress").val();
    var amount = $("#transferAmount").val();
    
    if (!recipient || !amount) {
      $("#transferStatus").html('<div class="alert alert-danger">Please enter recipient address and amount!</div>');
      return;
    }
    
    if (!web3.isAddress(recipient)) {
      $("#transferStatus").html('<div class="alert alert-danger">Invalid Ethereum address!</div>');
      return;
    }
    
    $("#transferStatus").html('<div class="alert alert-info">Processing transfer...</div>');
    
    App.instance.transfer(recipient, amount, { from: App.account })
      .then(function(result) {
        console.log("Transfer result:", result);
        $("#transferStatus").html('<div class="alert alert-success">Transfer successful! Transaction hash: ' + result.tx + '</div>');
        
        // Update balance after transfer
        return App.instance.balanceOf(App.account);
      })
      .then(function(balance) {
        $("#tokenBalance").text(balance.toString());
        
        // Clear form
        $("#recipientAddress").val('');
        $("#transferAmount").val('');
      })
      .catch(function(err) {
        console.error("Transfer error:", err);
        $("#transferStatus").html('<div class="alert alert-danger">Transfer failed: ' + err.message + '</div>');
      });
  },
  
  // Add transaction to history table
  addTransactionToHistory: function(txHash, from, to, amount) {
    var truncatedFrom = from.substring(0, 6) + '...' + from.substring(from.length - 4);
    var truncatedTo = to.substring(0, 6) + '...' + to.substring(to.length - 4);
    var truncatedTxHash = txHash.substring(0, 6) + '...' + txHash.substring(txHash.length - 4);
    
    var link = '<a href="https://etherscan.io/tx/' + txHash + '" target="_blank">' + truncatedTxHash + '</a>';
    
    $("#transactionHistory").prepend(
      '<tr>' +
        '<td>' + link + '</td>' +
        '<td>' + truncatedFrom + '</td>' +
        '<td>' + truncatedTo + '</td>' +
        '<td>' + amount + '</td>' +
      '</tr>'
    );
  },
  
  // Function to receive fixed amount of tokens (3)
  receiveTokens: function() {
    var receiverAddress = $("#receiverAddress").val();
    var fixedAmount = 3;
    
    if (!receiverAddress) {
      $("#receiveStatus").html('<div class="alert alert-danger">Please enter an address!</div>');
      return;
    }
    
    if (!web3.isAddress(receiverAddress)) {
      $("#receiveStatus").html('<div class="alert alert-danger">Invalid Ethereum address!</div>');
      return;
    }
    
    // Special handling for self-transfer
    if (receiverAddress === App.account) {
      $("#receiveStatus").html('<div class="alert alert-warning">You are sending tokens to yourself. Your balance will not change.</div>');
      setTimeout(function() {
        $("#receiveStatus").html('');
        $("#receiverAddress").val('');
      }, 3000);
      return;
    }
    
    $("#receiveStatus").html('<div class="alert alert-info">Processing token credit...</div>');
    
    // Check if we have access to the mint function (owner only)
    App.instance.owner()
      .then(function(ownerAddress) {
        if (ownerAddress === App.account) {
          // Owner can mint new tokens
          return App.instance.mint(receiverAddress, fixedAmount, { from: App.account });
        } else {
          // Non-owners will transfer from their account
          return App.instance.transfer(receiverAddress, fixedAmount, { from: App.account });
        }
      })
      .then(function(result) {
        console.log("Receive tokens result:", result);
        $("#receiveStatus").html('<div class="alert alert-success">Tokens credited successfully! Transaction hash: ' + result.tx + '</div>');
        
        // Force immediate balance update
        App.refreshBalance();
        
        // Clear input field
        $("#receiverAddress").val('');
        
        // Update again after a delay to ensure blockchain has updated
        setTimeout(App.refreshBalance, 2000);
      })
      .catch(function(err) {
        console.error("Receive tokens error:", err);
        $("#receiveStatus").html('<div class="alert alert-danger">Failed to credit tokens: ' + err.message + '</div>');
      });
  },
  
  // Update balances after token operations
  updateBalances: function(otherAddress) {
    console.log("Updating balances for:", App.account, "and possibly", otherAddress);
    
    // Always update current user's balance first
    App.instance.balanceOf(App.account)
      .then(function(balance) {
        console.log("Current user balance:", balance.toString());
        $("#tokenBalance").text(balance.toString());
        
        // If we're sending to ourselves or no otherAddress, we're done
        if (!otherAddress || otherAddress === App.account) {
          // Clear the receiver address field and return
          $("#receiverAddress").val('');
          return;
        }
        
        // Otherwise, also get the other address's balance for reference
        return App.instance.balanceOf(otherAddress)
          .then(function(otherBalance) {
            console.log("Other address balance:", otherBalance.toString());
            // We don't display this balance in the UI currently, but we could
            
            // Clear the receiver address field
            $("#receiverAddress").val('');
          });
      })
      .catch(function(err) {
        console.error("Error updating balances:", err);
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
    
    // Add event listener for transfer button
    $(document).on('click', '#transferButton', function() {
      App.transferTokens();
    });
    
    // Add event listener for receive button
    $(document).on('click', '#receiveButton', function() {
      App.receiveTokens();
    });
  });
});

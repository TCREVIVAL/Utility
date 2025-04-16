
/* A special thank you note to 
@Raider HX for helping with ULUNA  and 
@BOBCATLUNC for helping with fixing the gas fees issue
*********
TEAM TCR
*********
*/



const { LCDClient, MnemonicKey, MsgSend, isTxError } = require('@terra-money/terra.js');

// Replace with your actual 24-word mnemonic
const mnemonic = 'Replace with your actual 24-word mnemonic';
// Replace with the recipient's actual wallet address
const recipient = 'Replace with the recipient's actual wallet address';

// Initialize the Terra client with the node URL and chain ID for Terra Classic
const terra = new LCDClient({
  URL: 'https://lcd.terra-classic.hexxagon.io/',
  chainID: 'columbus-5',
});

// Create a wallet object from the mnemonic
const mk = new MnemonicKey({ mnemonic });
const wallet = terra.wallet(mk);

async function sendTest() {
  // Create a message to send 1 LUNC (1 LUNC = 1,000,000 uluna)
  const msg = new MsgSend(
    wallet.key.accAddress, // Sender's address derived from your mnemonic
    recipient,             // Recipient's address
    { uluna: '1000000' }   // Amount to send: 1,000,000 uluna (1 LUNC)
  );

  console.log('🧾 Transaction message:', msg);

  try {
    console.log('🧾 Creating and signing the transaction...');
    // Create and sign the transaction using your gas settings
    const tx = await wallet.createAndSignTx({
      msgs: [msg],
      gasPrices: { uluna: 28.4 },
      gasAdjustment: 1.4,
    });

    console.log('🚀 Broadcasting the transaction...');
    // Broadcast the transaction to the network
    const result = await terra.tx.broadcast(tx);

    if (isTxError(result)) {
      console.error('❌ Transaction failed:', result.raw_log);
    } else {
      console.log('✅ Success! Tx Hash:', result.txhash);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

sendTest();


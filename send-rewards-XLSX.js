const { LCDClient, MnemonicKey, MsgSend, isTxError } = require('@terra-money/terra.js');
const xlsx = require('xlsx');
const path = require('path');

// 🔐 Your 24-word mnemonic
const mnemonic = 'Enter your mnemonic code here';


// 🌍 Terra Classic client setup
const terra = new LCDClient({
  URL: 'https://lcd.terra-classic.hexxagon.io/',
  chainID: 'columbus-5',
});

const mk = new MnemonicKey({ mnemonic });
const wallet = terra.wallet(mk);

// 📥 Load Excel file with recipients
const workbook = xlsx.readFile(path.join(__dirname, 'recipients.xlsx'));
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

// 🚀 Batch Send Function
async function sendBatchLunc() {
  const msgs = [];

  for (const entry of data) {
    const recipient = entry.address.trim();
    const amount = parseInt(entry.amount);

    if (!recipient || isNaN(amount)) {
      console.error(`⚠️ Invalid entry skipped: ${JSON.stringify(entry)}`);
      continue;
    }

    const msg = new MsgSend(wallet.key.accAddress, recipient, {
      uluna: amount.toString(),
    });

    msgs.push(msg);
  }

  if (msgs.length === 0) {
    console.error("❌ No valid recipients found. Aborting.");
    return;
  }

  try {
    console.log(`🧾 Creating and signing a batch transaction with ${msgs.length} recipients...`);
    const tx = await wallet.createAndSignTx({
      msgs,
      gasPrices: { uluna: 28.4 },
      gasAdjustment: 1.4,
    });

    console.log('🚀 Broadcasting the transaction...');
    const result = await terra.tx.broadcast(tx);

    if (isTxError(result)) {
      console.error('❌ Batch transaction failed:', result.raw_log);
    } else {
      console.log(`✅ Batch transaction sent successfully! TxHash: ${result.txhash}`);
    }
  } catch (err) {
    console.error('❌ Error during batch send:', err.message);
  }
}

sendBatchLunc();

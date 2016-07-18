import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  wager_id: { type: 'String' },
  user_id: { type: 'String' },
  tx_id: { type: 'String' },
  hex: { type: 'String' }
});

export default mongoose.model('Transaction', transactionSchema);

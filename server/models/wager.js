import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wagerSchema = new Schema({
  dateAdded: { type: 'Date', default: Date.now, required: true },

  author_id: { type: 'String', default: null },
  acceptor_id: { type: 'String', default: null },

  home_id: { type: 'String', default: null },
  away_id: { type: 'String', default: null },

  home_pubkey: { type: 'String' },
  away_pubkey: { type: 'String' },
  server_pubkey: { type: 'String' },

  original_date: { type: 'String' },
  game_data_directory: { type: 'String' },
  gameday_id: { type: 'String' },

  home_team_name: { type: 'String' },
  away_team_name: { type: 'String' },
  home_file_code: { type: 'String' },
  away_file_code: { type: 'String' },

  original_side: { type: 'String' },

  spread: { type: 'Number' },
  value: { type: 'Number' },

  public: { type: 'Boolean', default: true },

  script_address: { type: 'String' },
  script_hex: { type: 'String' },
});

export default mongoose.model('Wager', wagerSchema);

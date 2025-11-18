const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global',
  },
  interestRate: {
    type: Number,
    required: true,
    default: 7, // The default 7% rate
  },
});

// Create a helper to ensure the settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    // If no settings exist, create the first one
    settings = await this.create({ key: 'global', interestRate: 7 });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
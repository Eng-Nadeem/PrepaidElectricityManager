import mongoose from 'mongoose';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepaid_meter_app';

// Connect to MongoDB
export const connectToDatabase = async () => {
  try {
    // Log connection string for debugging (masking credentials)
    const sanitizedUri = MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:***@'
    );
    console.log('Attempting to connect to MongoDB:', sanitizedUri);

    // Use mock data if MongoDB is not available
    if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/prepaid_meter_app') {
      console.log('No MongoDB URI provided. Using mock data instead.');
      throw new Error('No valid MongoDB URI provided');
    }

    // Connect with options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    
    console.log('MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to mock data.');
    return false;
  }
};

// MongoDB models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  walletBalance: { type: Number, default: 0, required: true },
  createdAt: { type: Date, default: Date.now, required: true }
});

const MeterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meterNumber: { type: String, required: true, unique: true },
  nickname: { type: String },
  address: { type: String },
  customerName: { type: String },
  type: { type: String, default: 'STS', required: true },
  status: { type: String, default: 'active', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
});

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meterNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', required: true },
  paymentMethod: { type: String, default: 'card', required: true },
  token: { type: String },
  units: { type: Number },
  receiptUrl: { type: String },
  transactionType: { type: String, default: 'recharge', required: true },
  createdAt: { type: Date, default: Date.now, required: true }
});

const DebtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meterNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'electricity', required: true },
  dueDate: { type: Date, required: true },
  description: { type: String },
  status: { type: String, default: 'pending', required: true },
  isPaid: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
});

const WalletTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // 'deposit', 'withdrawal', 'payment'
  description: { type: String },
  reference: { type: String },
  createdAt: { type: Date, default: Date.now, required: true }
});

// Export models
export const User = mongoose.model('User', UserSchema);
export const Meter = mongoose.model('Meter', MeterSchema);
export const Transaction = mongoose.model('Transaction', TransactionSchema);
export const Debt = mongoose.model('Debt', DebtSchema);
export const WalletTransaction = mongoose.model('WalletTransaction', WalletTransactionSchema);

// Export default User
export default User;
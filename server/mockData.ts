// Mock data for the prepaid meter app
// This is used when MongoDB connection is not available

// Helper function to simulate API delay
export const simulateApiDelay = async <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

// Mock meters data
export const MOCK_METERS = [
  {
    id: 1,
    number: "M-10254",
    nickname: "Home",
    status: "active",
    createdAt: "2023-04-15T09:30:00.000Z",
    userId: 1
  },
  {
    id: 2,
    number: "M-10255",
    nickname: "Office",
    status: "active",
    createdAt: "2023-04-16T14:45:00.000Z",
    userId: 1
  },
  {
    id: 3,
    number: "M-10256",
    nickname: "Apartment",
    status: "inactive",
    createdAt: "2023-04-17T11:15:00.000Z",
    userId: 1
  }
];

// Mock transactions data
export const MOCK_TRANSACTIONS = [
  {
    id: 1,
    type: "recharge",
    amount: 50,
    status: "completed",
    meterNumber: "M-10254",
    timestamp: "2023-04-20T10:30:00.000Z",
    token: "1234-5678-9012-3456",
    units: 22.5,
    userId: 1
  },
  {
    id: 2,
    type: "recharge",
    amount: 100,
    status: "completed",
    meterNumber: "M-10255",
    timestamp: "2023-04-18T15:45:00.000Z",
    token: "5678-9012-3456-7890",
    units: 45,
    userId: 1
  },
  {
    id: 3,
    type: "payment",
    amount: 35.5,
    status: "completed",
    meterNumber: "M-10254",
    timestamp: "2023-04-15T09:20:00.000Z",
    userId: 1
  },
  {
    id: 4,
    type: "recharge",
    amount: 25,
    status: "pending",
    meterNumber: "M-10254",
    timestamp: "2023-04-21T11:10:00.000Z",
    userId: 1
  },
  {
    id: 5,
    type: "wallet",
    amount: 150,
    status: "completed",
    timestamp: "2023-04-17T14:25:00.000Z",
    userId: 1
  }
];

// Mock debts data
export const MOCK_DEBTS = [
  {
    id: 1,
    type: "water",
    amount: 35.5,
    dueDate: "2023-05-15T00:00:00.000Z",
    meterNumber: "M-10254",
    status: "pending",
    userId: 1
  },
  {
    id: 2,
    type: "maintenance",
    amount: 50,
    dueDate: "2023-05-20T00:00:00.000Z",
    meterNumber: "M-10255",
    status: "pending",
    userId: 1
  },
  {
    id: 3,
    type: "electricity",
    amount: 45.75,
    dueDate: "2023-05-10T00:00:00.000Z",
    meterNumber: "M-10254",
    status: "pending",
    userId: 1
  }
];

// Mock wallet data
export const MOCK_WALLET = {
  balance: 85.25,
  userId: 1,
  transactions: [
    {
      id: 1,
      amount: 100,
      type: "deposit",
      timestamp: "2023-04-16T10:30:00.000Z",
      description: "Account top-up",
      userId: 1
    },
    {
      id: 2,
      amount: 50,
      type: "withdrawal",
      timestamp: "2023-04-18T15:45:00.000Z",
      description: "Meter recharge",
      userId: 1
    },
    {
      id: 3,
      amount: 35.25,
      type: "deposit",
      timestamp: "2023-04-20T09:15:00.000Z", 
      description: "Account top-up",
      userId: 1
    }
  ]
};

// Mock user profile
export const MOCK_USER_PROFILE = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  address: "123 Main St, City, Country",
  walletBalance: MOCK_WALLET.balance
};
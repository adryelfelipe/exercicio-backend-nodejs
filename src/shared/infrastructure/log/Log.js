class Log {
  constructor({ addressId, userId, operation, changedData }) {
    this.addressId = addressId;
    this.userId = userId;
    this.operation = operation;
    this.changedData = changedData;
  }
}

export default Log;
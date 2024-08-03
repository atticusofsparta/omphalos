export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FailedRequestError extends BaseError {
  constructor(status: number, message: string) {
    super(`Failed request: ${status}: ${message}`);
  }
}

export class ContractInteractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Contract Interaction Error';
  }
}

export class ArNSServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArNS Service Error';
  }
}

// NotificationOnlyError is an error that is only shown as a notification and does not emit to sentry

export class NotificationOnlyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Error Notification';
  }
}

export class ValidationError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'Validation Error';
  }
}

export class ArconnectError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'ArConnect';
  }
}

export class OthentError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'Othent';
  }
}

export class ArweaveAppError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'Arweave.app';
  }
}

export class WagmiError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'Wagmi';
  }
}

export class InsufficientFundsError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'Insufficient Funds';
  }
}

export class WalletNotInstalledError extends NotificationOnlyError {
  constructor(message: string) {
    super(message);
    this.name = 'Wallet Not Installed';
  }
}

import {
  AoClient,
  AoSigner,
  ILogger,
  InvalidContractConfigurationError,
  Logger,
  ProcessConfiguration,
  WriteInteractionError,
  isProcessConfiguration,
  isProcessIdConfiguration,
  safeDecode,
} from '@ar.io/sdk';
import { connect } from '@permaweb/aoconnect/browser';

export interface AOContract {
  read<K>({
    tags,
    data,
    retries,
  }: {
    tags?: { name: string; value: string }[];
    data?: string;
    retries?: number;
  }): Promise<K>;
  send<I, K>({
    tags,
    data,
    signer,
  }: {
    tags: { name: string; value: string }[];
    data: I;
    signer: AoSigner;
  }): Promise<{ id: string; result?: K }>;
}

export class AOProcess implements AOContract {
  private logger: ILogger;
  private processId: string;
  private ao: AoClient;

  constructor({
    processId,
    ao = connect(),
    logger = Logger.default,
  }: {
    processId: string;
    ao?: AoClient;
    logger?: ILogger;
  }) {
    this.processId = processId;
    this.logger = logger;
    this.ao = ao;
  }

  static fromConfiguration(config: Required<ProcessConfiguration>) {
    if (isProcessConfiguration(config)) {
      return config.process;
    } else if (isProcessIdConfiguration(config)) {
      return new AOProcess({
        processId: config.processId,
      });
    } else {
      throw new InvalidContractConfigurationError();
    }
  }

  async read<K>({
    tags,
    data,
    retries = 3,
  }: {
    tags?: Array<{ name: string; value: string }>;
    data?: string;
    retries?: number;
  }): Promise<K> {
    let attempts = 0;
    let lastError: Error | undefined;
    while (attempts < retries) {
      try {
        this.logger.debug(`Evaluating read interaction on contract`, {
          tags,
        });
        // map tags to inputs
        const result = await this.ao.dryrun({
          process: this.processId,
          tags,
          data,
        });

        if (result.Messages.length === 0) {
          throw new Error(
            `Process ${this.processId} does not support provided action.`,
          );
        }

        const tagsOutput = result.Messages[0].Tags;
        const error = tagsOutput.find(
          (tag: { name: string; value: string }) => tag.name === 'Error',
        );
        if (error) {
          throw new Error(`${error.Value}: ${result.Messages[0].Data}`);
        }

        this.logger.debug(`Read interaction result`, {
          result: result.Messages[0].Data,
        });

        // return empty object if no data is returned
        if (result.Messages[0].Data === undefined) {
          return {} as K;
        }

        const response: K = safeDecode<K>(result.Messages[0].Data);
        return response;
      } catch (e: any) {
        attempts++;
        this.logger.debug(`Read attempt ${attempts} failed`, {
          error: e,
          tags,
        });
        lastError = e;
        // exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 2 ** attempts * 1000),
        );
      }
    }
    throw lastError;
  }

  async send<I, K>({
    tags,
    data,
    signer,
    retries = 3,
  }: {
    tags: Array<{ name: string; value: string }>;
    data?: I;
    signer: AoSigner;
    retries?: number;
  }): Promise<{ id: string; result?: K }> {
    // main purpose of retries is to handle network errors/new process delays
    let attempts = 0;
    let lastError: Error | undefined;
    while (attempts < retries) {
      try {
        this.logger.debug(`Evaluating send interaction on contract`, {
          tags,
          data,
          processId: this.processId,
        });

        // TODO: do a read as a dry run to check if the process supports the action

        const messageId = await this.ao.message({
          process: this.processId,
          // TODO: any other default tags we want to add?
          data: typeof data !== 'string' ? JSON.stringify(data) : data,
          signer: signer as any,
        });

        this.logger.debug(`Sent message to process`, {
          messageId,
          processId: this.processId,
        });

        // check the result of the send interaction
        const output = await this.ao.result({
          message: messageId,
          process: this.processId,
        });

        this.logger.debug('Message result', {
          output,
          messageId,
          processId: this.processId,
        });

        // check if there are any Messages in the output
        if (output.Messages?.length === 0 || output.Messages === undefined) {
          return { id: messageId };
        }

        const tagsOutput = output.Messages[0].Tags;
        const error = tagsOutput.find(
          (tag: { name: string; value: string }) => tag.name === 'Error',
        );
        // if there's an Error tag, throw an error related to it
        if (error) {
          const result = output.Messages[0].Data;
          throw new WriteInteractionError(`${error.Value}: ${result}`);
        }

        if (output.Messages.length === 0) {
          throw new Error(
            `Process ${this.processId} does not support provided action.`,
          );
        }

        if (output.Messages[0].Data === undefined) {
          return { id: messageId };
        }

        const resultData: K = safeDecode<K>(output.Messages[0].Data);

        this.logger.debug('Message result data', {
          resultData,
          messageId,
          processId: this.processId,
        });

        return { id: messageId, result: resultData };
      } catch (error: any) {
        this.logger.error('Error sending message to process', {
          error: error.message,
          processId: this.processId,
          tags,
        });
        // throw on write interaction errors. No point retrying wr ite interactions, waste of gas.
        if (error.message.includes('500')) {
          this.logger.debug('Retrying send interaction', {
            attempts,
            retries,
            error: error.message,
            processId: this.processId,
          });
          // exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, 2 ** attempts * 2000),
          );
          attempts++;
          lastError = error;
        } else throw error;
      }
    }
    throw lastError;
  }
}

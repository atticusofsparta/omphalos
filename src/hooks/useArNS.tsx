import {
  ANTState,
  AoArNSNameData,
  AoIORead,
  AoIOWrite,
  ArNSEventEmitter,
  IO,
  IO_TESTNET_PROCESS_ID,
} from '@ar.io/sdk';
import { errorEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { useEffect, useState } from 'react';

function useArNS() {
  const address = useGlobalState((s) => s.address);
  const wallet = useGlobalState((s) => s.wallet);
  const domains = useGlobalState((s) => s.domains);
  const ants = useGlobalState((s) => s.ants);
  const addDomains = useGlobalState((s) => s.addDomains);
  const addAnts = useGlobalState((s) => s.addAnts);
  const [ario, setArio] = useState<AoIORead | AoIOWrite>(IO.init());
  const [emitter, setEmitter] = useState<ArNSEventEmitter>(
    new ArNSEventEmitter({
      timeoutMs: 30_000,
    }),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet) {
      setArio(
        IO.init({
          processId: IO_TESTNET_PROCESS_ID,
          signer: wallet.arconnectSigner as any,
        }),
      );
      setEmitter(
        new ArNSEventEmitter({
          timeoutMs: 30_000,
          contract: IO.init({
            processId: IO_TESTNET_PROCESS_ID,
            signer: wallet.arconnectSigner as any,
          }),
        }),
      );
    }
  }, [wallet]);

  useEffect(() => {
    const errorHandler = (error: Error) => {
      errorEmitter.emit('error', error);
      setLoading(false);
    };

    if (!address) return;
    console.log('ArNS', address);
    emitter.on('process', (id, process) => {
      addDomains(process.names);
      addAnts({ [id]: process.state });
    });
    // error listener handles timeout
    emitter.on('error', errorHandler);
    // arns:error listener handles errors from graphql communications
    emitter.on('arns:error', errorHandler);
    emitter.on('end', () => {
      setLoading(false);
    });
    emitter
      .fetchProcessesOwnedByWallet({ address })
      .catch((e) =>
        errorHandler(
          new Error('Error getting assets owned by wallet: ' + e.message),
        ),
      );

    return () => {
      emitter.off('process');
      emitter.off('error');
      emitter.off('arns:error');
      emitter.off('end');
    };
  }, [address]);

  return {
    domains,
    ants,
    ario,
    emitter,
    loading,
  };
}

export default useArNS;

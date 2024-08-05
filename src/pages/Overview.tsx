import Button from '@src/components/buttons/Button';
import { useGlobalState } from '@src/services/state/useGlobalState';

function Overview() {
  const wallet = useGlobalState((state) => state.wallet);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <Button
        onClick={() => {
          console.log(wallet);
          wallet?.disconnect();
        }}
      >
        disconnect
      </Button>
    </div>
  );
}
3;

export default Overview;

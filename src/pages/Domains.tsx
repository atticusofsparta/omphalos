import DomainsTable from '@src/components/data-display/tables/DomainsTable';
import Sidebar from '@src/components/navigation/Sidebar';
import useArNS from '@src/hooks/useArNS';

function Domains() {
  const { domains, loading } = useArNS();
  return (
    <div className="box-border flex max-h-full w-full flex-row gap-10 overflow-y-hidden pt-4">
      <Sidebar>
        <div className="flex h-full w-full flex-col items-center justify-center p-6">
          <div className="flex h-full w-full flex-col gap-4">
            <div className="flex text-primary">ArNS</div>
          </div>
        </div>
      </Sidebar>
      <div className="flex h-full w-full flex-col items-center justify-center p-6 ">
        <div className="flex w-full flex-col gap-2 overflow-y-scroll rounded-xl border-2 border-primaryThin p-2 shadow-foregroundThin scrollbar scrollbar-thumb-primaryThin scrollbar-thumb-rounded-full scrollbar-w-2">
          <DomainsTable domains={domains} loading={loading} />
        </div>
      </div>
    </div>
  );
}
3;

export default Domains;

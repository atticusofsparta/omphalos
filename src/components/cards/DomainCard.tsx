import { AoArNSNameData } from '@ar.io/sdk';

import Card from './Card';

function DomainCard({ domain }: { domain: string; record: AoArNSNameData }) {
  return (
    <Card classes="cursor-pointer">
      <div className="flex h-full w-full flex-col rounded-lg border-2 border-foreground border-matrix bg-night-sky-thin text-matrix shadow-matrixThin backdrop-blur-sm hover:bg-forest-green-thin hover:text-primary">
        <span className="tex-2xl p-2 font-bold">{domain}</span>
      </div>
    </Card>
  );
}

export default DomainCard;

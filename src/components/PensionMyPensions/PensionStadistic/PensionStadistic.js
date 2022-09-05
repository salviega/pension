import React from 'react';
import { AreaChart } from '../../charts/AreaChart';

function PensionStadistic({ data, labels }) {
  return (
    <div className="my-pensions-container__pensions-stadistic">
      <AreaChart data={data} labels={labels} />
    </div>
  );
}

export { PensionStadistic };

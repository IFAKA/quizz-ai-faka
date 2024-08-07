import React from "react";

type Props = {
  value: number;
  label: string;
};

const MetricCard = (props: Props) => {
  const { label, value } = props;
  return (
    <div className="p-6 border rounded-md">
      <p className="text-[#6c7381]">{label}</p>
      <p className="text-3xl font-bold mt-2">{parseFloat(value.toFixed(2))}</p>
    </div>
  );
};

export default MetricCard;

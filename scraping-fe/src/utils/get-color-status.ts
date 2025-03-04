export const getColorStatus = (status: string) => {
  const color =
    status === "pending"
      ? "bg-yellow"
      : status === "processing"
      ? "bg-blue"
      : status === "completed"
      ? "bg-green"
      : "bg-red";
  return color;
};

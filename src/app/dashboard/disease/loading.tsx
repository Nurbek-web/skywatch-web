import { LoadingSpinner } from "@/components/loading-spinner";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadingSpinner className="" />
    </div>
  );
}

import { CuteSlimeLoading } from "./CuteSlimeLoading";

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
}

export function LoadingOverlay({
  message = "Đang thắp sáng đèn lồng, chờ tí nhé...",
  subMessage = "Đang xử lý dữ liệu và đồng bộ thế giới sinh tồn",
  compact = false,
}: LoadingOverlayProps) {
  if (compact) {
    return <CuteSlimeLoading variant="compact" title={message} />;
  }

  return (
    <CuteSlimeLoading
      variant="fullscreen"
      title={message}
      subtitle={subMessage}
    />
  );
}

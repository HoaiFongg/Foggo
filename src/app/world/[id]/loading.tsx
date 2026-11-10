import { CuteSlimeLoading } from "@/components/ui/CuteSlimeLoading";

export default function WorldLoading() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <CuteSlimeLoading
        title="Bé Slime đang chuẩn bị sàn đấu Hầm Ngục... ⚔️"
        subtitle="Đang xáo trộn câu đố của trường lớp và triệu hồi quái vật. Hãy chuẩn bị vũ khí nhé!"
      />
    </div>
  );
}

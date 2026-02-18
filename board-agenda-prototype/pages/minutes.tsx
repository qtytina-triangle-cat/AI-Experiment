import MeetingHeader from "@/components/MeetingHeader";
import SecondaryHeader from "@/components/SecondaryHeader";

export default function Minutes() {
  return (
    <>
      <MeetingHeader />
      <div className="p-6">
        <SecondaryHeader title="Minutes" />
        <div className="py-8 text-slate-500">
          Minutes content goes here.
        </div>
      </div>
    </>
  );
}

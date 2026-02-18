import MeetingHeader from "@/components/MeetingHeader";
import SecondaryHeader from "@/components/SecondaryHeader";

export default function Recording() {
  return (
    <>
      <MeetingHeader />
      <div className="p-6">
        <SecondaryHeader title="Recording" />
        <div className="py-8 text-slate-500">
          Recording content goes here.
        </div>
      </div>
    </>
  );
}

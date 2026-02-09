import SecondaryHeader from "./SecondaryHeader";
import BoardPacketCard from "./BoardPacketCard";
import AgendaBuilder from "./AgendaBuilder";

export default function MaterialsSection() {
  return (
    <div className="p-6">
      {/* Section Header */}
      <div className="mb-6">
        <SecondaryHeader
          title="Materials"
          collaboratorsCount={2}
          collaborators={[
            { initials: "A", variant: "blue" },
            { initials: "M", variant: "purple" },
          ]}
          actionLabel="Republish"
        />
      </div>

      {/* Board Packet Card */}
      <BoardPacketCard />

      {/* Agenda Builder */}
      <AgendaBuilder />
    </div>
  );
}

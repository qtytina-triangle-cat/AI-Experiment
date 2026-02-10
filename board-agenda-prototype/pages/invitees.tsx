import Layout from "@/components/Layout";
import MeetingHeader from "@/components/MeetingHeader";
import SecondaryHeader from "@/components/SecondaryHeader";
import { InviteesTable } from "@/components/Table";
import { Mail } from "lucide-react";

export default function Invitees() {
  return (
    <Layout activePage="invitees">
      <MeetingHeader />
      <div className="px-6 py-6">
        <SecondaryHeader 
          title="Invitees" 
          variant="ghost"
          actionLabel="Email Invitees"
          actionIcon={<Mail className="w-4 h-4" />}
        />
        <div className="py-0">
          <InviteesTable />
        </div>
      </div>
    </Layout>
  );
}

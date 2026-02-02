import Layout from "@/components/Layout";
import MeetingHeader from "@/components/MeetingHeader";
import MaterialsSection from "@/components/MaterialsSection";

export default function Home() {
  return (
    <Layout>
      <MeetingHeader />
      <MaterialsSection />
    </Layout>
  );
}

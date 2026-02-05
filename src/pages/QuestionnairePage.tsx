import { DiagnosticQuestionnaire } from "@/components/DiagnosticQuestionnaire";
import { Header } from "@/components/Header";

const QuestionnairePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DiagnosticQuestionnaire />
    </div>
  );
};

export default QuestionnairePage;

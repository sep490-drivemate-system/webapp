"use client";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";

const AnalysisPage = () => {
  useRequireAuth([UserRole.Admin, UserRole.Inspector]);
  return (
    <div>
      <h1>Analysis</h1>
      <p>This is the analyasdasdassis page.</p>
    </div>
  );
};

export default AnalysisPage;

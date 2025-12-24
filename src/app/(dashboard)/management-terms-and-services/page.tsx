"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TermsList } from "@/components/terms-and-services/terms-list";
import { TermsFormModal } from "@/components/terms-and-services/terms-form-modal";
import PageHeader from "@/components/commons/Header/header";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getNewDriverPolicy, getInstructorPolicy, createPolicy, updatePolicy, deletePolicy } from "@/features/policy/policyThunk";
import { Policy } from "@/types/policy";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Term {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

export default function AdminTermsPage() {
  const dispatch = useAppDispatch();
  const { newDriverPolicies, instructorPolicies, isLoading } = useAppSelector(
    (state) => state.policy
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | undefined>();
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getNewDriverPolicy())
      .unwrap()
      .catch((error) => {
        console.error("Không thể tải điều khoản người lái mới", error);
      });

    dispatch(getInstructorPolicy())
      .unwrap()
      .catch((error) => {
        console.error("Không thể tải điều khoản người hướng dẫn", error);
      });
  }, [dispatch, refreshTrigger]);

  const terms = useMemo(() => {
    const allPolicies: Term[] = [];

    newDriverPolicies.forEach((policy) => {
      allPolicies.push({
        id: policy.id,
        title: policy.title,
        description: policy.detail,
        type: "1",
        createdAt: new Date().toISOString(),
      });
    });

    instructorPolicies.forEach((policy) => {
      allPolicies.push({
        id: policy.id,
        title: policy.title,
        description: policy.detail,
        type: "2",
        createdAt: new Date().toISOString(),
      });
    });

    return allPolicies;
  }, [newDriverPolicies, instructorPolicies]);

  const handleEdit = (term: Term) => {
    setSelectedTerm(term);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTerm(undefined);
    setModalOpen(true);
  };

  const handleSubmit = async (termData: Omit<Term, "id" | "createdAt">) => {
    setLoading(true);
    try {
      const policyData: Omit<Policy, "id"> = {
        title: termData.title,
        description: termData.description,
        type: parseInt(termData.type, 10),
      };

      if (selectedTerm) {
        await dispatch(updatePolicy({ id: selectedTerm.id, data: policyData })).unwrap();
      } else {
        await dispatch(createPolicy(policyData)).unwrap();
      }

      setModalOpen(false);
      setSelectedTerm(undefined);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving term:", error);
      alert("Lỗi khi lưu điều khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setTermToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!termToDelete) return;

    setLoading(true);
    try {
      await dispatch(deletePolicy([termToDelete])).unwrap();
      setRefreshTrigger((prev) => prev + 1);
      setDeleteDialogOpen(false);
      setTermToDelete(null);
    } catch (error) {
      console.error("Error deleting term:", error);
      alert("Lỗi khi xóa điều khoản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <PageHeader
          title="Quản Lý Điều khoản & Dịch vụ"
          description="Tạo, chỉnh sửa và quản lý các điều khoản dịch vụ"
          actionButton={{
            label: "Tạo điều khoản mới",
            onClick: handleCreateNew,
            icon: Plus,
          }}
          className="mb-6"
        />

        <Card className="p-6">
          <TermsList 
            onEdit={handleEdit}
            onDelete={handleDelete}
            refreshTrigger={refreshTrigger}
            terms={terms}
            loading={isLoading}
          />
        </Card>

        <TermsFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          term={selectedTerm}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa điều khoản</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa điều khoản này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={loading}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

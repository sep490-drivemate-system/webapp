import { useState, useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getCategories } from "@/features/taxonomy/category/categoryThunk";
import { ICategory } from "@/types/taxonomy/category/category.type";
import { toast } from "sonner";

export const useCategories = () => {
    const dispatch = useAppDispatch();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            try {
                const result = await dispatch(getCategories()).unwrap();
                if (result?.value) {
                    setCategories(result.value);
                }
            } catch (error) {
                console.error("Error loading categories:", error);
                toast.error("Không thể tải danh mục. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };
        loadCategories();
    }, [dispatch]);

    return {
        categories,
        isLoading,
    };
};


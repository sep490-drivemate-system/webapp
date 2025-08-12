"use client";
import users from "@/data/users.json";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePagination } from "@/hooks/commonHooks";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 5;

export default function PaginationTestPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pageFromQuery = Number(searchParams.get("page") || 1);

    const { page, totalPages, currentItems, setPage, next, prev } = usePagination(
        users,
        PAGE_SIZE,
        isNaN(pageFromQuery) || pageFromQuery < 1 ? 1 : pageFromQuery
    );

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    const goTo = (p: number) => {
        setPage(p);
        router.replace(`?page=${p}`);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-xl font-semibold">Pagination Test</h1>
            <ul className="divide-y rounded-md border bg-white/60">
                {currentItems.map((u) => (
                    <li key={u.id} className="p-3">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                    </li>
                ))}
            </ul>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?page=${Math.max(1, page - 1)}`}
                            onClick={(e) => {
                                e.preventDefault();
                                prev();
                                router.replace(`?page=${Math.max(1, page - 1)}`);
                            }}
                        />
                    </PaginationItem>

                    {pageNumbers.map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href={`?page=${p}`}
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goTo(p);
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            href={`?page=${Math.min(totalPages, page + 1)}`}
                            onClick={(e) => {
                                e.preventDefault();
                                next();
                                router.replace(`?page=${Math.min(totalPages, page + 1)}`);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}



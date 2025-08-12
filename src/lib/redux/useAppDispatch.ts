"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

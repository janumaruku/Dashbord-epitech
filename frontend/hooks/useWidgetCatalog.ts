"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

export type WidgetParam = {
  name: string;
  type: string;
  description: string;
};

export type CatalogWidget = {
  id: string;
  service_id: string;
  name: string;
  description: string;
  params: WidgetParam[];
};

export function useWidgetCatalog() {
  const [widgets, setWidgets] = useState<CatalogWidget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<CatalogWidget[]>("/api/widgets");
      setWidgets(response.data);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        typeof err.response?.data?.message === "string"
      ) {
        setError(err.response.data.message);
      } else {
        setError("Could not load the widget catalog.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCatalog();
  }, [fetchCatalog]);

  return { widgets, isLoading, error, refetch: fetchCatalog };
}

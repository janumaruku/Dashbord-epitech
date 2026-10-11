"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { Position } from "@/lib/widgets";

export type WidgetInstance = {
  id: string;
  widget_id: string;
  config: Record<string, unknown>;
  refresh_rate: number;
  position: Position;
  created_at: string;
  updated_at: string;
  data: unknown;
  fetched_at: string | null;
  cached: boolean;
};

export function useWidgetInstances() {
  const [instances, setInstances] = useState<WidgetInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInstances = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<WidgetInstance[]>("/dashboard/widgets");
      setInstances(response.data);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        typeof err.response?.data?.message === "string"
      ) {
        setError(err.response.data.message);
      } else {
        setError("Could not load your dashboard.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInstances();
  }, [fetchInstances]);

  const updatePosition = useCallback(
    async (id: string, position: Position) => {
      setInstances((current) =>
        current.map((instance) =>
          instance.id === id ? { ...instance, position } : instance,
        ),
      );
      try {
        await api.put(`/dashboard/widgets/${id}`, { position });
      } catch {
        fetchInstances();
      }
    },
    [fetchInstances],
  );

  const deleteInstance = useCallback(async (id: string) => {
    await api.delete(`/dashboard/widgets/${id}`);
    setInstances((current) => current.filter((instance) => instance.id !== id));
  }, []);

  return {
    instances,
    isLoading,
    error,
    refetch: fetchInstances,
    updatePosition,
    deleteInstance,
  };
}

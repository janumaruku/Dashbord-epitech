"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

export type Service = {
  id: string;
  name: string;
  description: string;
  requires_auth: boolean;
  oauth_provider: string | null;
  subscribed: boolean;
};

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<Service[]>("/api/services");
      setServices(response.data);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        typeof err.response?.data?.message === "string"
      ) {
        setError(err.response.data.message);
      } else {
        setError("Could not load services. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, [fetchServices]);

  const subscribe = useCallback(async (serviceId: string) => {
    setSubscribingId(serviceId);
    try {
      await api.post(`/api/services/${serviceId}/subscribe`);
      setServices((current) =>
        current.map((service) =>
          service.id === serviceId
            ? { ...service, subscribed: true }
            : service,
        ),
      );
    } finally {
      setSubscribingId(null);
    }
  }, []);

  const unsubscribe = useCallback(async (serviceId: string) => {
    setUnsubscribingId(serviceId);
    try {
      await api.delete(`/api/services/${serviceId}/subscribe`);
      setServices((current) =>
        current.map((service) =>
          service.id === serviceId
            ? { ...service, subscribed: false }
            : service,
        ),
      );
    } finally {
      setUnsubscribingId(null);
    }
  }, []);

  return {
    services,
    isLoading,
    error,
    subscribingId,
    subscribe,
    unsubscribingId,
    unsubscribe,
    refetch: fetchServices,
  };
}

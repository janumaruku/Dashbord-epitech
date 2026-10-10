"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type ServiceId =
  | "weather"
  | "github"
  | "clock";

type ServiceContextValue = {
  weatherSubscribed: boolean;
  githubSubscribed: boolean;
  githubConnected: boolean;
  clockSubscribed: boolean;

  subscribeService: (
    service: ServiceId
  ) => void;

  unsubscribeService: (
    service: ServiceId
  ) => void;

  connectGithub: () => void;
  disconnectGithub: () => void;

  canUseService: (
    service: ServiceId
  ) => boolean;
};

const ServiceContext =
  createContext<
    ServiceContextValue | undefined
  >(undefined);

type ServiceProviderProps = {
  children: ReactNode;
};

export function ServiceProvider({
  children,
}: ServiceProviderProps) {
  const [
    weatherSubscribed,
    setWeatherSubscribed,
  ] = useState(true);

  const [
    githubSubscribed,
    setGithubSubscribed,
  ] = useState(true);

  const [
    githubConnected,
    setGithubConnected,
  ] = useState(false);

  const [
    clockSubscribed,
    setClockSubscribed,
  ] = useState(true);

  function subscribeService(
    service: ServiceId
  ) {
    if (service === "weather") {
      setWeatherSubscribed(true);
      return;
    }

    if (service === "github") {
      setGithubSubscribed(true);
      return;
    }

    setClockSubscribed(true);
  }

  function unsubscribeService(
    service: ServiceId
  ) {
    if (service === "weather") {
      setWeatherSubscribed(false);
      return;
    }

    if (service === "github") {
      setGithubSubscribed(false);
      setGithubConnected(false);
      return;
    }

    setClockSubscribed(false);
  }

  function connectGithub() {
    setGithubSubscribed(true);
    setGithubConnected(true);
  }

  function disconnectGithub() {
    setGithubConnected(false);
  }

  function canUseService(
    service: ServiceId
  ) {
    if (service === "weather") {
      return weatherSubscribed;
    }

    if (service === "github") {
      return (
        githubSubscribed &&
        githubConnected
      );
    }

    return clockSubscribed;
  }

  return (
    <ServiceContext.Provider
      value={{
        weatherSubscribed,
        githubSubscribed,
        githubConnected,
        clockSubscribed,

        subscribeService,
        unsubscribeService,

        connectGithub,
        disconnectGithub,

        canUseService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context =
    useContext(ServiceContext);

  if (!context) {
    throw new Error(
      "useServices must be used inside ServiceProvider"
    );
  }

  return context;
}
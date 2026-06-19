"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { VisaDetailPage } from "@/components/visas/detail/VisaDetailPage";
import {
  activateEmployeeFromVisa,
  advanceVisaStage,
  fetchVisaApplicationById,
} from "@/lib/visas/api";
import type { VisaDetail } from "@/lib/visas/types";

export default function VisaDetailRoutePage() {
  const params = useParams();
  const id = params.id as string;

  const [visa, setVisa] = useState<VisaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVisa = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVisaApplicationById(id);
      setVisa(data.application);
    } catch (err) {
      setVisa(null);
      setError(err instanceof Error ? err.message : "Visa application not found.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVisa();
  }, [loadVisa]);

  async function handleAdvanceStage() {
    setIsAdvancing(true);
    setError(null);
    try {
      const data = await advanceVisaStage(id);
      setVisa(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to advance stage.");
    } finally {
      setIsAdvancing(false);
    }
  }

  async function handleActivateEmployee() {
    setIsActivating(true);
    setError(null);
    try {
      const data = await activateEmployeeFromVisa(id);
      setVisa(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate employee.");
    } finally {
      setIsActivating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl p-gutter">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-body-md text-on-surface-variant">
          Loading visa application...
        </div>
      </div>
    );
  }

  if (!visa) {
    return (
      <div className="mx-auto max-w-2xl p-gutter">
        <div className="rounded-xl border border-error/20 bg-error-container p-xl text-on-error-container">
          <p className="text-body-md">{error || "Visa application not found."}</p>
          <Link href="/dashboard/visas" className="mt-md inline-block text-label-md text-primary hover:underline">
            Back to Visas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="mx-auto max-w-[1440px] px-gutter pt-md">
          <div className="rounded-lg border border-error/20 bg-error-container px-md py-sm text-body-sm text-on-error-container">
            {error}
          </div>
        </div>
      ) : null}
      <VisaDetailPage
        visa={visa}
        isAdvancing={isAdvancing}
        isActivating={isActivating}
        onAdvanceStage={handleAdvanceStage}
        onActivateEmployee={handleActivateEmployee}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import { EmployeeHighlights } from "@/components/employees/EmployeeHighlights";
import { EmployeesPageHeader } from "@/components/employees/EmployeesPageHeader";
import { EmployeeStatsGrid } from "@/components/employees/EmployeeStatsGrid";
import { EmployeeTable } from "@/components/employees/EmployeeTable";

export function EmployeesPage() {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEmployeeCreated() {
    setRefreshKey((value) => value + 1);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] p-gutter md:p-2xl">
        <EmployeesPageHeader onAddEmployee={() => setShowAddEmployeeModal(true)} />
        <EmployeeStatsGrid refreshKey={refreshKey} />
        <EmployeeTable refreshKey={refreshKey} />
        <EmployeeHighlights
          refreshKey={refreshKey}
          onLaunchWizard={() => setShowAddEmployeeModal(true)}
        />
      </div>

      <AddEmployeeModal
        open={showAddEmployeeModal}
        onClose={() => setShowAddEmployeeModal(false)}
        onCreated={handleEmployeeCreated}
      />
    </>
  );
}

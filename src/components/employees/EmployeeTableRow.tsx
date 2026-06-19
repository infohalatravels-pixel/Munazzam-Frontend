"use client";

import type { EmployeeRecord } from "@/lib/employees/api";
import { EmployeeAvatar } from "./EmployeeAvatar";

type EmployeeTableRowProps = {
  employee: EmployeeRecord;
  selected: boolean;
  onToggleSelect: () => void;
  onNavigate: () => void;
};

export function EmployeeTableRow({
  employee,
  selected,
  onToggleSelect,
  onNavigate,
}: EmployeeTableRowProps) {
  function handleRowClick() {
    onNavigate();
  }

  function handleCheckboxClick(event: React.MouseEvent) {
    event.stopPropagation();
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleRowClick();
        }
      }}
      className="group cursor-pointer transition-colors hover:bg-surface-container-low"
    >
      <td className="px-md py-4" onClick={handleCheckboxClick}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          onClick={handleCheckboxClick}
          className="rounded border-outline-variant text-primary focus:ring-primary"
          aria-label={`Select ${employee.name}`}
        />
      </td>
      <td className="px-md py-4 text-label-md text-on-surface">{employee.employeeCode}</td>
      <td className="px-md py-4">
        <div className="flex items-center gap-sm">
          <EmployeeAvatar
            employeeId={employee.id}
            name={employee.name}
            hasPhoto={employee.hasPhoto}
          />
          <span className="text-label-md text-on-surface">{employee.name}</span>
        </div>
      </td>
      <td className="px-md py-4 text-body-sm text-on-surface-variant">
        {employee.nationality}
      </td>
      <td className="px-md py-4 text-body-sm text-on-surface-variant">
        {employee.department}
      </td>
      <td className="px-md py-4 text-body-sm text-on-surface-variant">
        {employee.position}
      </td>
      <td className="px-md py-4">
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[11px] font-label-sm tracking-wide uppercase",
            employee.visaStatusClassName,
          ].join(" ")}
        >
          {employee.visaStatusLabel}
        </span>
      </td>
      <td className="px-md py-4 text-body-sm text-on-surface-variant">
        {employee.joinedDate}
      </td>
      <td className="px-md py-4 text-body-sm text-on-surface-variant">
        {employee.lastSalaryTransferDate || "—"}
      </td>
    </tr>
  );
}

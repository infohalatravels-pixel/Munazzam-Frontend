import { FreelancerEmployee } from "@/lib/accounts/transactionsApi";

interface FreelancerSelectionTableProps {
  employees: FreelancerEmployee[];
  selectedEmployeeId?: string;
  onEmployeeSelect: (employee: FreelancerEmployee) => void;
  isLoading?: boolean;
}

export function FreelancerSelectionTable({
  employees,
  selectedEmployeeId,
  onEmployeeSelect,
  isLoading,
}: FreelancerSelectionTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-lg">
        <div className="text-label-lg text-on-surface-variant">Loading freelancers...</div>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="text-center py-lg">
        <div className="text-label-lg text-on-surface-variant">
          No active freelancer employees found.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-outline-variant rounded-lg">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-surface-variant">
            <tr>
              <th className="px-sm py-xs text-left text-label-md font-semibold text-on-surface">
                Employee
              </th>
              <th className="px-sm py-xs text-left text-label-md font-semibold text-on-surface">
                Designation
              </th>
              <th className="px-sm py-xs text-left text-label-md font-semibold text-on-surface">
                Contact
              </th>
              <th className="px-sm py-xs text-left text-label-md font-semibold text-on-surface">
                Visa Info
              </th>
              <th className="px-sm py-xs text-right text-label-md font-semibold text-on-surface">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className={`border-t border-outline-variant transition-colors hover:bg-surface-variant/40 ${
                  selectedEmployeeId === employee.id ? "bg-primary-container" : ""
                }`}
              >
                <td className="px-sm py-sm">
                  <div>
                    <div className="text-body-md font-medium text-on-surface">
                      {employee.nameAsPassport}
                    </div>
                    <div className="text-label-sm text-on-surface-variant">
                      Code: {employee.employeeCode}
                    </div>
                  </div>
                </td>
                <td className="px-sm py-sm">
                  <span className="text-body-sm text-on-surface-variant">
                    {employee.designation || "—"}
                  </span>
                </td>
                <td className="px-sm py-sm">
                  <div>
                    <div className="text-body-sm text-on-surface">
                      {employee.phoneNo}
                    </div>
                    <div className="text-label-sm text-on-surface-variant">
                      {employee.nationality || "—"}
                    </div>
                  </div>
                </td>
                <td className="px-sm py-sm">
                  <div>
                    <div className="text-body-sm text-on-surface">
                      {employee.visaNumber}
                    </div>
                    <div className="text-label-sm text-on-surface-variant">
                      Expires: {new Date(employee.visaExpiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-sm py-sm text-right">
                  <button
                    onClick={() => onEmployeeSelect(employee)}
                    className="inline-flex h-xs items-center justify-center rounded px-sm text-label-md font-medium transition-colors hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-primary text-on-primary"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="divide-y divide-outline-variant">
          {employees.map((employee, index) => (
            <div
              key={employee.id}
              className={`p-sm transition-colors ${
                selectedEmployeeId === employee.id ? "bg-primary-container" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-body-md font-medium text-on-surface">
                    {employee.nameAsPassport}
                  </div>
                  <div className="text-label-sm text-on-surface-variant">
                    Code: {employee.employeeCode}
                  </div>
                  <div className="mt-xs grid grid-cols-2 gap-xs text-label-sm">
                    <div>
                      <span className="text-on-surface-variant">Designation:</span>
                      <br />
                      <span className="text-on-surface">{employee.designation || "—"}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Phone:</span>
                      <br />
                      <span className="text-on-surface">{employee.phoneNo}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Visa:</span>
                      <br />
                      <span className="text-on-surface">{employee.visaNumber}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Expires:</span>
                      <br />
                      <span className="text-on-surface">
                        {new Date(employee.visaExpiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-sm">
                  <button
                    onClick={() => onEmployeeSelect(employee)}
                    className="inline-flex h-xs items-center justify-center rounded px-sm text-label-md font-medium transition-colors hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-primary text-on-primary"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
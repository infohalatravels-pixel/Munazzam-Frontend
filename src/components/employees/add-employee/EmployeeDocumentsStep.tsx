import { DocumentDropzone } from "@/components/onboarding/DocumentDropzone";

type EmployeeDocumentsStepProps = {
  visaFiles: File[];
  passportFiles: File[];
  qidFiles: File[];
  onVisaFilesChange: (files: File[]) => void;
  onPassportFilesChange: (files: File[]) => void;
  onQidFilesChange: (files: File[]) => void;
};

export function EmployeeDocumentsStep({
  visaFiles,
  passportFiles,
  qidFiles,
  onVisaFilesChange,
  onPassportFilesChange,
  onQidFilesChange,
}: EmployeeDocumentsStepProps) {
  return (
    <div className="space-y-lg p-xl">
      <div className="border-b border-outline-variant pb-md">
        <h3 className="text-headline-sm text-on-surface">Step 3: Compliance Documents</h3>
        <p className="text-body-sm text-on-surface-variant">
          Upload visa, passport, and QID copies for employee records and compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <DocumentDropzone
          label="Visa Copy"
          hint="PDF, JPG, or PNG up to 10MB"
          files={visaFiles}
          onFilesChange={(files) => onVisaFilesChange(files.slice(-1))}
        />
        <DocumentDropzone
          label="Passport Copy"
          hint="Bio page and relevant stamps"
          files={passportFiles}
          onFilesChange={(files) => onPassportFilesChange(files.slice(-1))}
        />
        <DocumentDropzone
          label="QID Copy (optional)"
          hint="Front and back if available"
          files={qidFiles}
          onFilesChange={(files) => onQidFilesChange(files.slice(-1))}
        />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-xl">
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-4xl">folder_open</span>
          </div>
          <div className="min-w-0 text-left">
            <h4 className="text-headline-sm text-on-surface">Document checklist</h4>
            <p className="mt-sm text-body-sm leading-relaxed text-on-surface-variant">
              Visa and passport uploads are required to complete onboarding. QID can be
              added later if the employee is still awaiting issuance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

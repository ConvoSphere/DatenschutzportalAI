export interface FileCategory {
  key: string;
  label: string;
  required: boolean;
  conditionalRequired?: boolean;
  files: File[];
}

export type WorkflowStep = 'institution' | 'projectType' | 'form' | 'existingProject' | 'confirmation';
export type Institution = 'university' | 'clinic' | null;
export type ProjectType = 'new' | 'existing' | null;

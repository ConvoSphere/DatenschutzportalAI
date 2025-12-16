export interface ExtractedStudyData {
  study_title: string;
  study_type: string;
  principal_investigator: string;
  institution: string;
  study_goal: string;
  data_types: string[];
  patient_count: string;
  data_sources: string[];
  processing_methods: string;
  pseudonymization_usage: boolean;
  external_data_sharing: boolean;
  ethics_vote?: string;
  data_minimization?: string;
  storage_location?: string;
  archiving_period?: string;
  internal_access?: string[];
  external_partners?: string;
}

export type ConceptStep = 'input' | 'review' | 'result';

export interface SaveConceptResponse {
  id: string;
  message: string;
}

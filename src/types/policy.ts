export interface PolicyValue {
  id: string;
  label: string;
  value: number;
  unit: string; // %, hours, days, etc.
  description?: string;
}

export interface PolicySection {
  id: string;
  title: string;
  description?: string;
  values: PolicyValue[];
  rules: string[];
}

export interface Policy {
  id: string;
  title: string;
  description?: string;
  sections: PolicySection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface PolicyFormData {
  title: string;
  description?: string;
  sections: {
    title: string;
    description?: string;
    values: {
      label: string;
      value: number;
      unit: string;
      description?: string;
    }[];
    rules: string[];
  }[];
}

export interface IPolicy {
  id: string;
  title: string;
  detail: string;
  type: number;
}

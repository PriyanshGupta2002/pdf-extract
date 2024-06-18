interface Context {
  "Strategic objective"?: string;
  "Strategic Program"?: string;
}

interface Overview {
  Type?: string;
  "Estimated timeline"?: string;
  "Target group"?: string;
}

interface Owner {
  "Program Sponsors"?: string;
  "Project Managers"?: string[];
}

interface Interdependency {
  [key: string]: string;
}

interface RiskAndMitigation {
  Risk?: string;
  Risks?: string;
  "Impact level"?: "High" | "Medium" | "Low";
  "Impact Level"?: "High" | "Medium" | "Low";
}

// interface KPITargets {
//   [year: string]: string;
// }

export interface KPIData {
  KPI?: string;
  Targets?: Record<string, string>;
}

interface KPI {
  kpi_type?: string;
  data?: KPIData[];
}

interface Initiative {
  [key: string]: string | string[];
}

export interface Project {
  _id?: string;
  File_Name?: string;
  Project_Name?: string;
  Image_String?: string;
  Context?: Context;
  Overview?: Overview;
  Initiative_Details: Initiative;
  Owner?: Owner;
  Stakeholders?: string[];
  Status?: string;
  List_of_Sub_Initiatives?: string[];
  Interdependencies?: Interdependency[];
  Risks_and_Mitigations?: RiskAndMitigation[];
  Key_Performance_Indicators?: KPI[];
  Budget?: string;
  Path?: string;
  DB_Id?: string;
  Skip?: boolean;
  Extracted?: string;
  Summary?: string;
}

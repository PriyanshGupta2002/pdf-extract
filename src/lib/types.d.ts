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
  "External Stakeholder"?: string;
  "Required support to implement the program"?: string;
  "Required support to implement the initiative"?: string;
  "External Entity"?: string;
}

interface RiskAndMitigation {
  Risk?: string;
  "Impact level"?: "High" | "Medium" | "Low";
}

// interface KPITargets {
//   [year: string]: string;
// }

interface KPIData {
  KPI?: string;
  Targets?: Record<string, string>;
}

interface KPI {
  kpi_type?: string;
  data?: KPIData[];
}

interface Initiative {
  "Program description": string;
  Deliverables: string[];
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
}

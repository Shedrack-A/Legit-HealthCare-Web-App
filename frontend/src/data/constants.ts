export const DEPARTMENTS = [
  "Admin", "A.G.O", "Assets", "C.N.G", "Cement Mill", "Central Maintenance",
  "Civil", "Civil Engineering", "Compliance", "Crusher", "D.H.U", "Electrical",
  "Ham-Admin", "Help Desk", "HSE", "I.T", "Inbound", "Instrumentation", "Kiln",
  "Kiln Mechanical", "LMV", "Loading Crew", "Logistics", "Mechanical",
  "Mechanical Rawmills", "Medical", "Methods", "Mines", "Mix-Storage",
  "National Patrol", "Operations", "Packing Plant", "Power Plant", "Process",
  "Procurement", "Production", "Projectt", "Purchase", "Quality Assurance",
  "Raw Mill", "Safety", "Security", "Special Duties", "Stores", "Traffic",
  "Tyre Re-Trading", "Workshop", "Workshop & Utility"
].sort();

export const CONTINENTS = [
  "Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"
];

export const COUNTRIES = [
  "Nigeria", "United States", "United Kingdom", "Canada", "Ghana", "South Africa", "India", "China"
].sort();

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select';
    options?: string[];
    readOnly?: boolean;
    fullWidth?: boolean;
}

export const CONSULTATION_FIELDS: FormField[] = [
  { name: 'luts', label: 'LUTS', type: 'select', options: ['Yes', 'No'] },
  { name: 'chronic_cough', label: 'Chronic Cough', type: 'select', options: ['Yes', 'No'] },
  { name: 'chronic_chest_pain', label: 'Chronic Chest Pain', type: 'select', options: ['Yes', 'No'] },
  { name: 'chest_infection', label: 'Chest Infection', type: 'select', options: ['Yes', 'No'] },
  { name: 'heart_dx', label: 'Heart DX', type: 'select', options: ['Yes', 'No'] },
  { name: 'palor', label: 'Palor', type: 'select', options: ['Yes', 'No'] },
  { name: 'jaundice', label: 'Jaundice', type: 'select', options: ['Yes', 'No'] },
  { name: 'murmur', label: 'Murmur', type: 'select', options: ['Yes', 'No'] },
  { name: 'chest', label: 'Chest', type: 'select', options: ['Clinically Clear', 'Not Clear'] },
  { name: 'prostrate_specific_antigen', label: 'Prostrate-Specific Antigen - PSA', type: 'select', options: ['Negative', 'Positive', 'Not Applicable'] },
  { name: 'psa_remark', label: 'PSA Remark', type: 'textarea', fullWidth: true },
  { name: 'fbs', label: 'FBS', type: 'text' },
  { name: 'rbs', label: 'RBS', type: 'text' },
  { name: 'fbs_rbs_remark', label: 'FBS/RBS Remark', type: 'select', options: ['Normal', 'Abnormal', 'Maybe Abnormal'] },
  { name: 'urine_analysis', label: 'Urine Analysis', type: 'select', options: ['No Abnormality', 'Proteinuria', 'Proteinuria+', 'Proteinuria >+', 'Glucosuria', 'Glucosuria+', 'Glucosuria >+', 'Proteinuria/Glucosuria'] },
  { name: 'ua_remark', label: 'U/A Remark', type: 'select', options: ['Normal', 'Abnormal', 'Maybe Abnormal'] },
  { name: 'diabetes_mellitus', label: 'Diabetes Mellitus - DM', type: 'select', options: ['Yes - On Regular Medication', 'Yes - Not on Regular Medication', 'Yes - Not on Medication', 'No'] },
  { name: 'hypertension', label: 'Hypertension - HTM', type: 'select', options: ['Yes - On Regular Medication', 'Yes - Not on Regular Medication', 'Yes - Not on Medication', 'No'] },
  { name: 'bp', label: 'B.P', type: 'text' },
  { name: 'pulse', label: 'PULSE - b/m', type: 'text' },
  { name: 'spo2', label: 'SPO2%', type: 'text' },
  { name: 'hs', label: 'HS: 1&2', type: 'select', options: ['Present', 'S3 Present', 'S4 Present'] },
  { name: 'breast_exam', label: 'Breast Exam', type: 'select', options: ['Not Applicable', 'Normal', 'Abnormal'] },
  { name: 'breast_exam_remark', label: 'Breast Exam Remark', type: 'textarea', fullWidth: true },
  { name: 'abdomen', label: 'Abdomen', type: 'select', options: ['Normal', 'Abnormal'] },
  { name: 'assessment_hx_pe', label: 'Assessment - HX/PE', type: 'select', options: ['Satisfactory', 'Elevated BP', 'Poorly Controled HTN', 'Known DM', 'Bladder Outlet Obstruction'] },
  { name: 'other_assessments', label: 'Other Assessments', type: 'textarea', fullWidth: true },
  { name: 'overall_lab_remark', label: 'Overall Lab Remark', type: 'textarea', fullWidth: true },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea', fullWidth: true },
  { name: 'overall_assessment', label: 'Overall Assessment(s)', type: 'textarea', fullWidth: true },
];

// Form Fields for Test Results

export const FULL_BLOOD_COUNT_FIELDS: FormField[] = [
  { name: 'hct', label: 'HCT', type: 'number' },
  { name: 'wbc', label: 'WBC', type: 'number' },
  { name: 'plt', label: 'PLT', type: 'number' },
  { name: 'lymp_percent', label: 'LYMP(%)', type: 'number' },
  { name: 'lymp', label: 'LYMP', type: 'number' },
  { name: 'gra_percent', label: 'GRA(%)', type: 'number' },
  { name: 'gra', label: 'GRA', type: 'number' },
  { name: 'mid_percent', label: 'MID(%)', type: 'number' },
  { name: 'mid', label: 'MID', type: 'number' },
  { name: 'rbc', label: 'RBC', type: 'number' },
  { name: 'mcv', label: 'MCV(fl)', type: 'number' },
  { name: 'mch', label: 'MCH(pg)', type: 'number' },
  { name: 'mchc', label: 'MCHC(g/dl)', type: 'number' },
  { name: 'rdw', label: 'RDW(%)', type: 'number' },
  { name: 'pdw', label: 'PDW(%)', type: 'number' },
  { name: 'hgb', label: 'HGB', type: 'number' },
  { name: 'fbc_remark', label: 'FBC Remark', type: 'textarea', fullWidth: true },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea', fullWidth: true },
];

export const KIDNEY_FUNCTION_TEST_FIELDS: FormField[] = [
  { name: 'k', label: 'K', type: 'number' },
  { name: 'na', label: 'NA', type: 'number' },
  { name: 'cl', label: 'CL', type: 'number' },
  { name: 'ca', label: 'CA', type: 'number' },
  { name: 'hc03', label: 'HC03', type: 'number', readOnly: true },
  { name: 'urea', label: 'UREA', type: 'number' },
  { name: 'cre', label: 'CRE', type: 'number' },
  { name: 'kft_remark', label: 'KFT Remark', type: 'textarea', fullWidth: true },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea', fullWidth: true },
];

export const LIPID_PROFILE_FIELDS: FormField[] = [
  { name: 'tcho', label: 'TCHO', type: 'number' },
  { name: 'tg', label: 'TG', type: 'number' },
  { name: 'hdl', label: 'HDL', type: 'number', readOnly: true },
  { name: 'ldl', label: 'LDL', type: 'number', readOnly: true },
  { name: 'lp_remark', label: 'LP Remark', type: 'textarea', fullWidth: true },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea', fullWidth: true },
];

export const LIVER_FUNCTION_TEST_FIELDS: FormField[] = [
  { name: 'ast', label: 'AST', type: 'number' },
  { name: 'alt', label: 'ALT', type: 'number' },
  { name: 'alp', label: 'ALP', type: 'number' },
  { name: 'tb', label: 'TB', type: 'number' },
  { name: 'cb', label: 'CB', type: 'number' },
  { name: 'lft_remark', label: 'LFT Remark', type: 'textarea', fullWidth: true },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea', fullWidth: true },
];

export const ECG_FIELDS: FormField[] = [
  { name: 'ecg_result', label: 'ECG Result', type: 'textarea', fullWidth: true },
  { name: 'remark', label: 'Remark', type: 'textarea', fullWidth: true },
];

export const SPIROMETRY_FIELDS: FormField[] = [
  { name: 'spirometry_result', label: 'Spirometry Result', type: 'textarea', fullWidth: true },
  { name: 'spirometry_remark', label: 'Spirometry Remark', type: 'textarea', fullWidth: true },
];

export const AUDIOMETRY_FIELDS: FormField[] = [
  { name: 'audiometry_result', label: 'Audiometry Result', type: 'textarea', fullWidth: true },
  { name: 'audiometry_remark', label: 'Audiometry Remark', type: 'textarea', fullWidth: true },
];

export const TEST_TYPE_CONFIG: any = {
  'full-blood-count': {
    name: 'Full Blood Count',
    fields: FULL_BLOOD_COUNT_FIELDS,
  },
  'kidney-function-test': {
    name: 'Kidney Function Test',
    fields: KIDNEY_FUNCTION_TEST_FIELDS,
  },
  'lipid-profile': {
    name: 'Lipid Profile',
    fields: LIPID_PROFILE_FIELDS,
  },
  'liver-function-test': {
    name: 'Liver Function Test',
    fields: LIVER_FUNCTION_TEST_FIELDS,
  },
  'ecg': {
    name: 'ECG',
    fields: ECG_FIELDS,
  },
  'spirometry': {
    name: 'Spirometry',
    fields: SPIROMETRY_FIELDS,
  },
  'audiometry': {
    name: 'Audiometry',
    fields: AUDIOMETRY_FIELDS,
  },
};

export const DIRECTOR_REVIEW_FIELDS: FormField[] = [
  // Fields from Consultation
  { name: 'diabetes_mellitus', label: 'Diabetes Mellitus - DM', type: 'select', options: ['Yes - On Regular Medication', 'Yes - Not on Regular Medication', 'Yes - Not on Medication', 'No'] },
  { name: 'hypertension', label: 'Hypertension - HTM', type: 'select', options: ['Yes - On Regular Medication', 'Yes - Not on Regular Medication', 'Yes - Not on Medication', 'No'] },
  { name: 'bp', label: 'B.P', type: 'text' },
  { name: 'pulse', label: 'PULSE - b/m', type: 'text' },
  { name: 'spo2', label: 'SPO2%', type: 'text' },
  { name: 'hs', label: 'HS: 1&2', type: 'select', options: ['Present', 'S3 Present', 'S4 Present'] },
  { name: 'breast_exam', label: 'Breast Exam', type: 'select', options: ['Not Applicable', 'Normal', 'Abnormal'] },
  { name: 'breast_exam_remark', label: 'Breast Exam Remark', type: 'textarea', fullWidth: true },
  { name: 'abdomen', label: 'Abdomen', type: 'select', options: ['Normal', 'Abnormal'] },
  { name: 'prostrate_specific_antigen', label: 'Prostrate-Specific Antigen - PSA', type: 'select', options: ['Negative', 'Positive', 'Not Applicable'] },
  { name: 'psa_remark', label: 'PSA Remark', type: 'textarea', fullWidth: true },
  { name: 'fbs', label: 'FBS', type: 'text' },
  { name: 'rbs', label: 'RBS', type: 'text' },
  { name: 'fbs_rbs_remark', label: 'FBS/RBS Remark', type: 'select', options: ['Normal', 'Abnormal', 'Maybe Abnormal'] },
  { name: 'urine_analysis', label: 'Urine Analysis', type: 'select', options: ['No Abnormality', 'Proteinuria', 'Proteinuria+', 'Proteinuria >+', 'Glucosuria', 'Glucosuria+', 'Glucosuria >+', 'Proteinuria/Glucosuria'] },
  { name: 'ua_remark', label: 'U/A Remark', type: 'select', options: ['Normal', 'Abnormal', 'Maybe Abnormal'] },

  // Fields from other tests
  { name: 'ecg_result', label: 'ECG Result', type: 'textarea', fullWidth: true },
  { name: 'remark', label: 'ECG Remark', type: 'textarea', fullWidth: true },
  { name: 'spirometry_result', label: 'Spirometry Result', type: 'textarea', fullWidth: true },
  { name: 'spirometry_remark', label: 'Spirometry Remark', type: 'textarea', fullWidth: true },
  { name: 'audiometry_result', label: 'Audiometry Result', type: 'textarea', fullWidth: true },
  { name: 'audiometry_remark', label: 'Audiometry Remark', type: 'textarea', fullWidth: true },

  // Fields from Consultation Assessment
  { name: 'assessment_hx_pe', label: 'Assessment - HX/PE', type: 'select', options: ['Satisfactory', 'Elevated BP', 'Poorly Controled HTN', 'Known DM', 'Bladder Outlet Obstruction'] },
  { name: 'other_assessments', label: 'Other Assessments', type: 'textarea', fullWidth: true },
  { name: 'overall_lab_remark', label: 'Overall Lab Remark', type: 'textarea', fullWidth: true },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea', fullWidth: true },
  { name: 'overall_assessment', label: 'Overall Assessment(s)', type: 'textarea', fullWidth: true },

  // New Director Comments
  { name: 'comment_one', label: 'Comment One', type: 'textarea', fullWidth: true },
  { name: 'comment_two', label: 'Comment Two', type: 'textarea', fullWidth: true },
  { name: 'comment_three', label: 'Comment Three', type: 'textarea', fullWidth: true },
  { name: 'comment_four', label: 'Comment Four', type: 'textarea', fullWidth: true },
];
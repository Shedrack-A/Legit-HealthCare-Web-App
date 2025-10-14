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

// A comprehensive list of countries would be very large.
// Using a smaller, representative list for development.
// A library like 'countries-list' would be used in a real application.
export const COUNTRIES = [
  "Nigeria", "United States", "United Kingdom", "Canada", "Ghana", "South Africa", "India", "China"
].sort();

export const CONSULTATION_FIELDS: { name: string; label: string; type: 'select' | 'text' | 'textarea'; options?: string[] }[] = [
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
  { name: 'psa_remark', label: 'PSA Remark', type: 'textarea' },
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
  { name: 'breast_exam_remark', label: 'Breast Exam Remark', type: 'textarea' },
  { name: 'abdomen', label: 'Abdomen', type: 'select', options: ['Normal', 'Abnormal'] },
  { name: 'assessment_hx_pe', label: 'Assessment - HX/PE', type: 'select', options: ['Satisfactory', 'Elevated BP', 'Poorly Controled HTN', 'Known DM', 'Bladder Outlet Obstruction'] },
  { name: 'other_assessments', label: 'Other Assessments', type: 'textarea' },
  { name: 'overall_lab_remark', label: 'Overall Lab Remark', type: 'textarea' },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea' },
  { name: 'overall_assessment', label: 'Overall Assessment(s)', type: 'textarea' },
];

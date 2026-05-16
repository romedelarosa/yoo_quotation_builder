import type { ServiceTemplate } from "@/types/quote";

const surgicalInclusions = [
  "Doctor's surgical planning and professional fee",
  "Clinic surgical room / OR setup",
  "Anesthesiologist fee, if applicable to the package",
  "Standard surgical instruments and consumables",
  "Standard sterile setup and surgical supplies",
  "Basic pre-operative coordination",
  "Standard post-operative instructions",
  "Scheduled post-operative review",
  "Clinic care coordination before and after the procedure"
];

const surgicalConditionalItems = [
  "Laboratory tests, if required",
  "Medical clearance, if required",
  "Additional medications outside standard protocol",
  "Additional procedures not included in this quotation",
  "Complex-case modifications, if applicable after doctor assessment"
];

const treatmentInclusions = [
  "Doctor assessment",
  "Treatment planning",
  "Standard treatment or procedure supplies",
  "Standard aftercare instructions",
  "Clinic care coordination"
];

const treatmentConditionalItems = [
  "Additional treatment units, sessions, or materials, if needed",
  "Additional treatments not included in this quotation",
  "Follow-up treatment sessions, if recommended",
  "Plan modifications after doctor assessment"
];

const enhancementConditionalItems = [
  "Main procedure package, if quoted separately",
  "Additional materials or treatment areas, if needed",
  "Follow-up sessions or revisions, if recommended",
  "Plan modifications after doctor assessment"
];

const standardNotes = [
  "This quotation is structured as a package to help the patient review expected inclusions clearly.",
  "The care plan remains doctor-led and may be adjusted after assessment."
];

const defaultDisclaimer =
  "Final surgical plan, eligibility, and pricing remain subject to physician assessment, patient history, physical examination, laboratory requirements, and medical clearance when applicable.";

const paymentMethodNotes =
  "Payments may be made through clinic-approved payment channels. Exact payment method availability and processing schedules may be confirmed with the clinic team.";

function serviceTemplate(
  input: Omit<ServiceTemplate, "standardNotes" | "disclaimer" | "paymentMethodNotes">
): ServiceTemplate {
  return {
    ...input,
    standardNotes,
    disclaimer: defaultDisclaimer,
    paymentMethodNotes
  };
}

export const serviceTemplates: ServiceTemplate[] = [
  serviceTemplate({
    id: "upper-blepharoplasty",
    name: "Upper Blepharoplasty",
    category: "Eyes",
    regularPrice: 50000,
    packageType: "Inclusive surgical package",
    inclusions: surgicalInclusions,
    conditionalItems: surgicalConditionalItems
  }),
  serviceTemplate({
    id: "lower-blepharoplasty",
    name: "Lower Blepharoplasty",
    category: "Eyes",
    regularPrice: 80000,
    packageType: "Inclusive surgical package",
    inclusions: surgicalInclusions,
    conditionalItems: surgicalConditionalItems
  }),
  serviceTemplate({
    id: "upper-lower-blepharoplasty",
    name: "Upper + Lower Blepharoplasty",
    category: "Eyes",
    regularPrice: 120000,
    packageType: "Inclusive surgical package",
    inclusions: surgicalInclusions,
    conditionalItems: surgicalConditionalItems
  }),
  serviceTemplate({
    id: "hiko-nose-thread-lift",
    name: "HIKO Nose Thread Lift",
    category: "Nose",
    regularPrice: 0,
    packageType: "Doctor-led aesthetic treatment package",
    inclusions: [
      "Doctor assessment",
      "Treatment planning",
      "Thread procedure",
      "Standard procedure supplies",
      "Standard aftercare instructions",
      "Clinic care coordination"
    ],
    conditionalItems: [
      "Additional threads, if needed",
      "Additional treatments not included in the quotation",
      "Follow-up treatment sessions, if recommended"
    ]
  }),
  serviceTemplate({
    id: "yoo-undereye-solution",
    name: "YOO UnderEye Solution",
    category: "Eyes",
    regularPrice: 17500,
    packageType: "Doctor-led minimally invasive treatment package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-precision-noselift",
    name: "YOO Precision Noselift",
    category: "Nose",
    regularPrice: 20000,
    packageType: "Doctor-led aesthetic treatment package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-chindefine",
    name: "YOO ChinDefine",
    category: "Chin",
    regularPrice: 20000,
    packageType: "Doctor-led lower-face contouring package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-necklift",
    name: "YOO NeckLift",
    category: "Neck",
    regularPrice: 20000,
    packageType: "Doctor-led neck refinement package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-jawlift",
    name: "YOO JawLift",
    category: "Jaw",
    regularPrice: 20000,
    packageType: "Doctor-led jawline support package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-facelift",
    name: "YOO FaceLift",
    category: "Face Lift & Rejuvenation",
    regularPrice: 20000,
    packageType: "Doctor-led facial rejuvenation package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-deepwrinkle",
    name: "YOO DeepWrinkle (Static & Dynamic)",
    category: "Face Lift & Rejuvenation",
    regularPrice: 20000,
    packageType: "Doctor-led wrinkle management package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-biolift",
    name: "YOO BioLift",
    category: "Face Lift & Rejuvenation",
    regularPrice: 30000,
    packageType: "Doctor-led rejuvenation support package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-cheek-restore",
    name: "YOO Cheek Restore",
    category: "Face Lift & Rejuvenation",
    regularPrice: 20000,
    packageType: "Doctor-led midface restoration package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "yoo-lipo-contour",
    name: "YOO Lipo Contour",
    category: "Body Contouring",
    regularPrice: 25000,
    packageType: "Doctor-led body contouring package",
    inclusions: [
      "Doctor assessment and contour planning",
      "Procedure planning for selected area",
      "Clinic surgical room / OR setup, when applicable",
      "Standard instruments, consumables, and procedure supplies",
      "Standard aftercare instructions",
      "Clinic care coordination"
    ],
    conditionalItems: surgicalConditionalItems
  }),
  serviceTemplate({
    id: "yoo-scar-release",
    name: "YOO Scar Release",
    category: "Scar & Texture Rebuild",
    regularPrice: 5000,
    packageType: "Doctor-led scar and texture treatment package",
    inclusions: treatmentInclusions,
    conditionalItems: treatmentConditionalItems
  }),
  serviceTemplate({
    id: "microfat-grafting",
    name: "MicroFat Grafting",
    category: "Doctor Recommended Enhancements",
    regularPrice: 2500,
    packageType: "Doctor-recommended enhancement add-on",
    inclusions: [
      "Doctor assessment for enhancement suitability",
      "Enhancement planning as part of the main treatment plan",
      "Standard procedure supplies",
      "Standard aftercare instructions",
      "Clinic care coordination"
    ],
    conditionalItems: enhancementConditionalItems
  }),
  serviceTemplate({
    id: "nanofat-grafting",
    name: "NanoFat Grafting",
    category: "Doctor Recommended Enhancements",
    regularPrice: 2500,
    packageType: "Doctor-recommended texture enhancement add-on",
    inclusions: [
      "Doctor assessment for enhancement suitability",
      "Skin texture enhancement planning",
      "Standard procedure supplies",
      "Standard aftercare instructions",
      "Clinic care coordination"
    ],
    conditionalItems: enhancementConditionalItems
  }),
  serviceTemplate({
    id: "wrinkle-release",
    name: "Wrinkle Release",
    category: "Doctor Recommended Enhancements",
    regularPrice: 1350,
    packageType: "Doctor-recommended release-focused add-on",
    inclusions: [
      "Doctor assessment for release-focused enhancement",
      "Treatment planning as part of the main plan",
      "Standard procedure supplies",
      "Standard aftercare instructions",
      "Clinic care coordination"
    ],
    conditionalItems: enhancementConditionalItems
  })
];

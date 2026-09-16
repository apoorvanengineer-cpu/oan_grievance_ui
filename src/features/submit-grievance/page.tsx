"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { selectUser } from "@/features/auth/store/authSlice";
import { clearGrievanceDraft, loadGrievanceDraft, saveGrievanceDraft } from "@/lib/submitGrievanceDraft";
import { useAppSelector } from "@/store/hooks";
import { Stepper } from "./components/Stepper";
import { SubmitterIdentityCard } from "./components/SubmitterIdentityCard";
import { GrievanceDetailsCard } from "./components/GrievanceDetailsCard";
import { ReviewAndSubmitCard } from "./components/ReviewAndSubmitCard";
import { GrievanceSubmittedCard } from "./components/GrievanceSubmittedCard";
import { SubmitGrievanceHeader } from "./components/TopHeader";

export default function SubmitGrievancePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draftJustSaved, setDraftJustSaved] = useState(false);

  const user = useAppSelector(selectUser);
  const userEmail = user?.email;
  // Only recomputed when the signed-in email changes, not on every keystroke
  // this page's own step-wizard state causes — its result feeds nothing but
  // the useState initializers just below.
  const savedDraft = useMemo(() => (userEmail ? loadGrievanceDraft(userEmail) : null), [userEmail]);

  // Step 1 — Submitter Identity
  const [submitterType, setSubmitterType] = useState(savedDraft?.submitterType ?? "");
  const [submissionChannel, setSubmissionChannel] = useState(savedDraft?.submissionChannel ?? "");
  const [identityValues, setIdentityValues] = useState<Record<string, string>>(savedDraft?.identityValues ?? {});

  const handleSubmitterTypeChange = (value: string) => {
    setSubmitterType(value);
    // Switching type mid-form invalidates whatever was entered for the
    // previous type's field set — carrying it over would show unrelated
    // stale values (or, worse, silently submit them) after the switch.
    setIdentityValues({});
  };

  const setIdentityValue = (key: string, value: string) => {
    setIdentityValues((prev) => ({ ...prev, [key]: value }));
  };

  // Step 2 — Grievance Details
  const [serviceCategory, setServiceCategory] = useState(savedDraft?.serviceCategory ?? "");
  const [grievanceType, setGrievanceType] = useState(savedDraft?.grievanceType ?? "");
  const [region, setRegion] = useState(savedDraft?.region ?? "");
  const [zone, setZone] = useState(savedDraft?.zone ?? "");
  const [woreda, setWoreda] = useState(savedDraft?.woreda ?? "");
  const [kebele, setKebele] = useState(savedDraft?.kebele ?? "");
  const [serviceProviderName, setServiceProviderName] = useState(savedDraft?.serviceProviderName ?? "");
  const [description, setDescription] = useState(savedDraft?.description ?? "");
  const [desiredOutcome, setDesiredOutcome] = useState(savedDraft?.desiredOutcome ?? "");
  // Never restored from a draft — a File object isn't serializable, so a
  // reloaded draft asks the user to re-attach it.
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    if (!userEmail) return;
    saveGrievanceDraft(userEmail, {
      submitterType,
      submissionChannel,
      identityValues,
      serviceCategory,
      grievanceType,
      region,
      zone,
      woreda,
      kebele,
      serviceProviderName,
      description,
      desiredOutcome,
    });
    setDraftJustSaved(true);
    window.setTimeout(() => setDraftJustSaved(false), 2500);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (userEmail) clearGrievanceDraft(userEmail);
    // In a real application, you would scroll to top here or handle routing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="font-sans pb-2">
        <GrievanceSubmittedCard onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans pb-2">
      {/* Back Button */}
      {currentStep > 1 && (
        <div className="flex items-center -mb-2">
          <button
            onClick={() => {
               if (currentStep > 1) {
                  handleBack();
               }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold text-[15px] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            Back
          </button>
        </div>
      )}

      {/* Page Header */}
      <SubmitGrievanceHeader />

      {/* Stepper */}
      <Stepper currentStep={currentStep} />

      {/* Main Content Area */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <SubmitterIdentityCard
            onNext={handleNext}
            submitterType={submitterType}
            setSubmitterType={handleSubmitterTypeChange}
            submissionChannel={submissionChannel}
            setSubmissionChannel={setSubmissionChannel}
            identityValues={identityValues}
            setIdentityValue={setIdentityValue}
            onSaveDraft={handleSaveDraft}
            draftJustSaved={draftJustSaved}
          />
        )}
        {currentStep === 2 && (
          <GrievanceDetailsCard
            onNext={handleNext}
            onBack={handleBack}
            serviceCategory={serviceCategory}
            setServiceCategory={setServiceCategory}
            grievanceType={grievanceType}
            setGrievanceType={setGrievanceType}
            region={region}
            setRegion={setRegion}
            zone={zone}
            setZone={setZone}
            woreda={woreda}
            setWoreda={setWoreda}
            kebele={kebele}
            setKebele={setKebele}
            serviceProviderName={serviceProviderName}
            setServiceProviderName={setServiceProviderName}
            description={description}
            setDescription={setDescription}
            desiredOutcome={desiredOutcome}
            setDesiredOutcome={setDesiredOutcome}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            onSaveDraft={handleSaveDraft}
            draftJustSaved={draftJustSaved}
          />
        )}
        {currentStep === 3 && (
          <ReviewAndSubmitCard
            onBack={handleBack}
            onSubmit={handleSubmit}
            submitterType={submitterType}
            submissionChannel={submissionChannel}
            identityValues={identityValues}
            serviceCategory={serviceCategory}
            grievanceType={grievanceType}
            region={region}
            zone={zone}
            woreda={woreda}
            kebele={kebele}
            serviceProviderName={serviceProviderName}
            description={description}
            desiredOutcome={desiredOutcome}
            uploadedFile={uploadedFile}
            onSaveDraft={handleSaveDraft}
            draftJustSaved={draftJustSaved}
          />
        )}
      </div>
    </div>
  );
}

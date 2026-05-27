export interface JobApplication {
  id: number;
  jobTitle: string;
  name: string;
  email: string;
  submittedAt: Date;
}

// This will act as our in-memory database for submitted applications.
export const submittedApplications: JobApplication[] = [];

export const addApplication = (application: Omit<JobApplication, 'id' | 'submittedAt'>) => {
  const newApplication: JobApplication = {
    ...application,
    id: submittedApplications.length + 1,
    submittedAt: new Date(),
  };
  submittedApplications.push(newApplication);
  console.log('Application submitted:', newApplication);
  console.log('All applications:', submittedApplications);
};

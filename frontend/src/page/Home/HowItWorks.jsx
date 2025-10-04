import React from "react";
import { UserPlus, ListChecks, ThumbsUp } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
          How does it work?
        </h3>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="text-4xl text-blue-600 mb-4">
              <UserPlus />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Create an Account
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sign up for a free account as a job seeker or employer. Set up your
              profile in minutes to start posting jobs or applying for jobs.
              Customize your profile to highlight your skills or requirements.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="text-4xl text-blue-600 mb-4">
              <ListChecks />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Post or Browse Jobs
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Employers can post detailed job descriptions, and job seekers can
              browse a comprehensive list of available positions. Utilize filters
              to find jobs that match your skills and preferences.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="text-4xl text-blue-600 mb-4">
              <ThumbsUp />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Hire or Get Hired
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Employers can shortlist candidates and extend job offers. Job
              seekers can review job offers and accept positions that align with
              their career goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

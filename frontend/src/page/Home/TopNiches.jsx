import React from "react";

const TopNiches = () => {
  const services = [
    {
      id: 1,
      service: "Software Development",
      description:
        "Innovative software development services to build, maintain, and upgrade applications, ensuring they meet the highest quality standards.",
    },
    {
      id: 2,
      service: "Web Development",
      description:
        "Comprehensive web development solutions from front-end design to back-end integration, delivering responsive and user-friendly websites.",
    },
    {
      id: 3,
      service: "Data Science",
      description:
        "Advanced data science services to analyze and interpret complex data, providing actionable insights and data-driven solutions.",
    },
    {
      id: 4,
      service: "Cloud Computing",
      description:
        "Reliable cloud computing services to manage, store, and process data efficiently, offering scalable and flexible cloud solutions.",
    },
    {
      id: 5,
      service: "DevOps",
      description:
        "DevOps services to streamline software development and operations, enhancing deployment efficiency and reducing time to market.",
    },
    {
      id: 6,
      service: "Mobile App Development",
      description:
        "Expert mobile app development for iOS and Android platforms, creating intuitive and engaging mobile experiences for your users.",
    },
  ];

  return (
    <section className="py-12 bg-gray-0">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className='text-2xl md:text-4xl font-bold text-center mb-5'><span className='text-[#6A38C2]'>Top </span> Niches</h1> 
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((element) => (
            <div
              key={element.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {element.service}
              </h4>
              <p className="text-gray-600 text-sm">{element.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopNiches;

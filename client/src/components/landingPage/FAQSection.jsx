import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee for all our courses. If you're not satisfied with your purchase, you can request a full refund within 30 days."
    },
    {
      question: "Do you have live course or pre-recorded?",
      answer: "We offer both live and pre-recorded courses. Live courses provide real-time interaction with instructors, while pre-recorded courses offer flexibility to learn at your own pace."
    },
    {
      question: "How long will it take to complete a course?",
      answer: "Course duration varies depending on the subject and depth. Most courses range from 10-40 hours of content, which you can complete at your own pace over weeks or months."
    },
    {
      question: "What if I have questions during the course?",
      answer: "You can ask questions through our course discussion forums, direct messaging to instructors, or join live Q&A sessions scheduled regularly for each course."
    },
    {
      question: "Are there any prerequisites for the courses?",
      answer: "Prerequisites vary by course. Each course page clearly lists any required knowledge or skills. We also offer beginner-friendly courses that require no prior experience."
    },
    {
      question: "What kind of certificate do I get?",
      answer: "Upon successful completion of a course, you'll receive a verified certificate that you can share on LinkedIn, add to your resume, or showcase to employers."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faqsection" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">FAQ</h2>
          <h3 className="text-3xl font-bold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border  border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full cursor-pointer  px-6 py-4 text-left bg-white hover:bg-gray-400 flex items-center justify-between transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-x-4">
          {/* <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Ask a Question
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            More FAQ
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

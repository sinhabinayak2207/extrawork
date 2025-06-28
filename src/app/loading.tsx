import MainLayout from "../components/layout/MainLayout";
import Section from "../components/ui/Section";

export default function Loading() {
  return (
    <MainLayout>
      <Section background="white" paddingY="xl">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 mb-8 animate-spin">
            <svg
              className="w-full h-full text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
            Loading...
          </h2>
          <p className="text-gray-600 animate-pulse">
            Please wait while we load your content
          </p>
        </div>
      </Section>
    </MainLayout>
  );
}

import { Header } from "@/components/Header";

export default function About() {
  return (
    <div className="h-full">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold mb-8">About This Project</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Swinburne University of Technology
            </h2>
            <p className="mb-2">
              COS30049 - Computing Technology Innovation Project
            </p>
            <p className="mb-2">Semester 2, 2024</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
            <ul className="list-disc pl-6">
              <li>Chi Cuong Nguyen (ID: 104222057)</li>
              <li>Duc Anh Tran (ID: 104204233)</li>
              <li>Tran Anh Thu Pham (ID: 10381840)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

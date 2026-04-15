import React from 'react';
import { Briefcase, MapPin, Clock, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
}

export default function JobPostings() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Join the <span className="text-orange-600">Zealous</span> Team</h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            We are looking for passionate individuals to help us redefine HR automation. Explore our open positions below.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search for roles, locations, or keywords..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-orange-600 transition-all shadow-2xl"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-zinc-500">Searching for opportunities...</div>
          ) : jobs.length === 0 ? (
            // Mock jobs if none in DB
            [
              { id: 1, title: 'Senior HR Specialist', location: 'Remote / New York', type: 'Full-time' },
              { id: 2, title: 'Full Stack Engineer', location: 'Austin, TX', type: 'Full-time' },
              { id: 3, title: 'Compliance Officer (Medicare)', location: 'Remote', type: 'Contract' },
              { id: 4, title: 'Operations Manager', location: 'Chicago, IL', type: 'Full-time' }
            ].map((job) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-all group cursor-pointer"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14} /> HR & Operations</span>
                  </div>
                </div>
                <button className="bg-zinc-800 hover:bg-white hover:text-black px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  Apply Now <ChevronRight size={18} />
                </button>
              </motion.div>
            ))
          ) : jobs.map((job) => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              {/* Real job mapping */}
            </div>
          ))}
        </div>

        <div className="bg-orange-600/10 border border-orange-600/20 p-8 rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-bold">Don't see a role for you?</h2>
          <p className="text-zinc-400">Send us your resume anyway! We're always looking for great talent.</p>
          <button className="text-orange-500 font-bold hover:underline">careers@zealous.com</button>
        </div>
      </div>
    </div>
  );
}

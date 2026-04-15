import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, ChevronRight, Timer, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

interface Assessment {
  AssessmentID: number;
  ModuleID: number;
  AssessmentType: string;
  MaxScore: number;
  ModuleName?: string;
}

export default function AssessmentPortal() {
  const [activeExam, setActiveExam] = React.useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [score, setScore] = React.useState<number | null>(null);
  const [assessments, setAssessments] = React.useState<Assessment[]>([]);

  React.useEffect(() => {
    // Mock assessments matching the new schema
    setAssessments([
      { AssessmentID: 1, ModuleID: 1, AssessmentType: 'MCQ', MaxScore: 100, ModuleName: 'Medicare Compliance' },
      { AssessmentID: 2, ModuleID: 2, AssessmentType: 'MCQ', MaxScore: 100, ModuleName: 'ACA Enrollment Standards' },
      { AssessmentID: 3, ModuleID: 3, AssessmentType: 'Practical', MaxScore: 50, ModuleName: 'MVA Safety Protocol' },
      { AssessmentID: 4, ModuleID: 4, AssessmentType: 'MCQ', MaxScore: 100, ModuleName: 'FE Ethics & Conduct' }
    ]);
  }, []);

  const mockQuestions: Question[] = [
    {
      id: 1,
      text: "What is the primary purpose of the Medicare Part D program?",
      options: ["Hospital Insurance", "Prescription Drug Coverage", "Medical Insurance", "Long-term Care"],
      correct: 1
    },
    {
      id: 2,
      text: "Under the ACA, what is the maximum age for children to stay on their parents' health plan?",
      options: ["18", "21", "24", "26"],
      correct: 3
    },
    {
      id: 3,
      text: "Which document is required for MVA compliance during vehicle inspection?",
      options: ["Form 1095-C", "Form I-9", "Safety Inspection Certificate", "W-2"],
      correct: 2
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = async () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctCount = answers.reduce((acc, ans, idx) => {
        return ans === mockQuestions[idx].correct ? acc + 1 : acc;
      }, 0);
      const finalScore = Math.round((correctCount / mockQuestions.length) * 100);
      
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ assessmentId: 1, score: finalScore }) // Using 1 as mock ID
        });
      } catch (err) {
        console.error('Failed to submit assessment:', err);
      }

      setScore(finalScore);
      setActiveExam(false);
    }
  };

  if (score !== null) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-128px)]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center max-w-md w-full space-y-6 shadow-2xl"
        >
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${score >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            <Award size={48} />
          </div>
          <h2 className="text-4xl font-bold text-white">Assessment Complete</h2>
          <div className="text-6xl font-black text-orange-600">{score}%</div>
          <p className="text-zinc-500">
            {score >= 70 
              ? "Congratulations! You have passed the assessment." 
              : "You did not meet the passing score of 70%. Please review the modules and try again."}
          </p>
          <button 
            onClick={() => { setScore(null); setAnswers([]); setCurrentQuestion(0); }}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all"
          >
            Return to Training
          </button>
        </motion.div>
      </div>
    );
  }

  if (activeExam) {
    const q = mockQuestions[currentQuestion];
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Assessment Exam</h2>
            <p className="text-zinc-500">Question {currentQuestion + 1} of {mockQuestions.length}</p>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-mono font-bold bg-orange-500/10 px-4 py-2 rounded-lg">
            <Timer size={18} /> 14:52
          </div>
        </div>

        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-orange-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8">
          <h3 className="text-xl text-white font-medium leading-relaxed">{q.text}</h3>
          
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  answers[currentQuestion] === i 
                    ? 'bg-orange-600/10 border-orange-600 text-white' 
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span>{opt}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  answers[currentQuestion] === i ? 'border-orange-600 bg-orange-600' : 'border-zinc-700'
                }`}>
                  {answers[currentQuestion] === i && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            disabled={answers[currentQuestion] === undefined}
            onClick={nextQuestion}
            className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentQuestion === mockQuestions.length - 1 ? 'Finish Exam' : 'Next Question'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Assessments</h1>
        <p className="text-zinc-500">Validate your knowledge and earn certifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((exam) => (
          <div key={exam.AssessmentID} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 group hover:border-zinc-700 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 group-hover:text-orange-500 transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest bg-orange-500/10 text-orange-500">
                {exam.AssessmentType}
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{exam.ModuleName}</h3>
              <div className="flex gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1"><Timer size={12} /> 15 mins</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Max Score: {exam.MaxScore}</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveExam(true)}
              className="w-full py-3 rounded-xl font-bold transition-all bg-white text-black hover:bg-zinc-200"
            >
              Start Assessment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

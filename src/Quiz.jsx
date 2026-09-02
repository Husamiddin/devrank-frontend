import { useEffect, useState } from 'react';

export default function QuizComponent({ challenge, attempt }) {
  const [status, setStatus] = useState(attempt?.status || 'ACTIVE');
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(2 - (attempt?.attempts || 0));

  // ANTI-COPY tizimi
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        alert("Kechirasiz, platformada ko'chirish taqiqlangan!");
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert("Iltimos, variantni tanlang!");
      return;
    }

    try {
      const res = await fetch(`/api/challenges/${challenge.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ answer: selectedOption, type: 'QUIZ' })
      });
      const data = await res.json();

      if (data.passed || data.status === 'COMPLETED') {
        setStatus('COMPLETED');
      } else {
        if (data.locked || data.attemptsLeft === 0) {
          setStatus('LOCKED');
        }
        setAttemptsLeft(data.attemptsLeft ?? Math.max(0, attemptsLeft - 1));
        setMessage(data.message || "Xato javob!");
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan xatolik yuz berdi");
    }
  };

  // 1. Bajarilgan holat (Bajarildi ✓)
  if (status === 'COMPLETED' || attempt?.status === 'COMPLETED') {
    return (
      <div className="p-8 text-center bg-gray-900 text-white rounded-xl border border-green-500/30">
        <div className="text-green-400 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">Bajarildi</h2>
        <p className="text-gray-400">Siz bu quizni muvaffaqiyatli yakunlab bo'lgansiz.</p>
      </div>
    );
  }

  // 2. Bloklangan holat (2 ta urinish tugaganda)
  if (status === 'LOCKED' || attempt?.status === 'LOCKED') {
    return (
      <div className="p-8 text-center bg-gray-900 text-white rounded-xl border border-red-500/30">
        <div className="text-red-400 text-5xl mb-4">✕</div>
        <h2 className="text-2xl font-bold mb-2">Vazifa bloklandi</h2>
        <p className="text-gray-400">Barcha urinishlaringiz (2 ta) tugadi.</p>
      </div>
    );
  }

  // 3. Faol holat (Quizni ishlash)
  return (
    <div className="select-none p-6 bg-gray-900 text-white rounded-xl shadow-lg" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
      <p className="text-gray-300 mb-6">{challenge.description || challenge.quiz?.question}</p>

      <div className="space-y-3 mb-6">
        {challenge.quiz?.options?.map((option, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              selectedOption === idx ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:bg-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name="quiz-option" 
              checked={selectedOption === idx}
              onChange={() => setSelectedOption(idx)}
              className="accent-blue-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {message && <p className="mb-4 text-sm text-yellow-400 font-medium">{message}</p>}
      <p className="text-xs text-gray-400 mb-4">Qolgan urinishlar: {attemptsLeft} / 2</p>

      <button 
        onClick={handleSubmit}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors text-white"
      >
        Javobni yuborish
      </button>
    </div>
  );
}